// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// ============================================================
// 🔥 CONFIGURACIÓN DE RUTAS PÚBLICAS
// ============================================================

const PUBLIC_PREFIXES = [
  "/",
  "/login",
  "/servicios",
  "/proyectos",
  "/nosotros",
  "/contacto",
  "/faq",
  "/blog",
  "/testimonios",
  "/api/auth",
  "/api/contacto",
  "/api/cotizaciones",
  "/cliente/login",   // 👈 Página de login para clientes
];

const PUBLIC_PATH_PREFIXES = [
  "/servicios/",
  "/proyectos/",
  "/blog/",
  "/api/auth/",
];

// ============================================================
// 🔥 MATRIZ DE PERMISOS POR ROL
// ============================================================

const ROLE_PERMISSIONS: Record<string, { allowed: string[]; blocked: string[] }> = {
  FUNDADOR: {
    allowed: ['*'],
    blocked: []
  },
  ADMIN: {
    allowed: ['*'],
    blocked: ['/configuracion/critica']
  },
  FIELD_ENGINEER: {
    allowed: [
      '/obras',
      '/calidad',
      '/personal',
      '/produccion',
      '/fotos',
      '/documentos',
      '/alertas',
      '/cotizaciones',
    ],
    blocked: [
      '/dashboard',
      '/valorizaciones',
      '/facturacion',
      '/costos',
      '/indicadores',
      '/reportes',
      '/compras',
      '/inventario',
    ]
  },
  // 👇 ROL CLIENTE
  CLIENTE: {
    allowed: [
      '/cliente/dashboard',
      '/cliente/fotos',
      '/cliente/hitos',
      '/api/cliente/*',
    ],
    blocked: [
      '/dashboard',
      '/personal',
      '/produccion',
      '/costos',
      '/reportes',
      '/obras',
      '/calidad',
      '/documentos',
      '/fotos',
      '/alertas',
      '/cotizaciones',
      '/valorizaciones',
      '/facturacion',
      '/compras',
      '/inventario',
      '/indicadores',
    ]
  },
  PRODUCTION: {
    allowed: [
      '/produccion',
      '/fotos',
      '/documentos',
      '/alertas',
      '/inventario',
    ],
    blocked: [
      '/dashboard',
      '/obras',
      '/valorizaciones',
      '/facturacion',
      '/cotizaciones',
      '/calidad',
      '/personal',
      '/compras',
      '/costos',
      '/indicadores',
      '/reportes',
    ]
  },
  VIEWER: {
    allowed: [
      '/obras',
      '/cotizaciones',
      '/documentos',
      '/alertas',
    ],
    blocked: [
      '/dashboard',
      '/valorizaciones',
      '/facturacion',
      '/calidad',
      '/personal',
      '/inventario',
      '/compras',
      '/produccion',
      '/costos',
      '/indicadores',
      '/fotos',
      '/reportes',
    ]
  }
};

// ============================================================
// 🔥 HELPER: matching de rutas con soporte para wildcard '/*'
// ============================================================
// Antes, '/api/cliente/*' se comparaba de forma literal contra el path
// (path === '/api/cliente/*' || path.startsWith('/api/cliente/*/')),
// lo cual NUNCA coincidía con rutas reales como /api/cliente/dashboard.
// Esta función interpreta correctamente el sufijo '/*' como wildcard.

function matchesRoute(path: string, route: string): boolean {
  if (route.endsWith('/*')) {
    const base = route.slice(0, -2); // quita "/*"
    return path === base || path.startsWith(base + '/');
  }
  return path === route || path.startsWith(route + '/');
}

// ============================================================
// 🔥 HEADERS DE SEGURIDAD (CSP CORREGIDA + GOOGLE FONTS)
// ============================================================

function setSecurityHeaders(response: NextResponse): NextResponse {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.supabase.co",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https://*.supabase.co",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.resend.com",
    "frame-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  return response;
}

// ============================================================
// 🔥 MIDDLEWARE PRINCIPAL
// ============================================================

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // ─── 1. VERIFICAR RUTAS PÚBLICAS ───
  const isExactPublic = PUBLIC_PREFIXES.some(prefix => path === prefix);
  const isPathPublic = PUBLIC_PATH_PREFIXES.some(prefix => path.startsWith(prefix));
  if (isExactPublic || isPathPublic) {
    const response = NextResponse.next();
    return setSecurityHeaders(response);
  }

  // ─── 2. OBTENER TOKEN ───
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  });

  // ─── 3. SI NO HAY TOKEN, REDIRIGIR A LOGIN ───
  if (!token) {
    const isClienteRoute = path.startsWith('/cliente/');
    const loginPath = isClienteRoute ? '/cliente/login' : '/login';
    const loginUrl = new URL(loginPath, req.url);
    loginUrl.searchParams.set('callbackUrl', path);
    const response = NextResponse.redirect(loginUrl, { status: 303 });
    return setSecurityHeaders(response);
  }

  // ─── 4. OBTENER ROL Y PERMISOS ───
  const role = token.role as string || 'VIEWER';
  const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.VIEWER;

  // ─── 5. VERIFICAR SI EL ROL TIENE ACCESO TOTAL ───
  if (permissions.allowed.includes('*')) {
    const response = NextResponse.next();
    return setSecurityHeaders(response);
  }

  // ─── 6. VERIFICAR SI LA RUTA ESTÁ PERMITIDA (con soporte wildcard) ───
  const isAllowed = permissions.allowed.some(route => matchesRoute(path, route));
  const isBlocked = permissions.blocked.some(route => matchesRoute(path, route));

  // ─── 7. SI NO ESTÁ PERMITIDA O ESTÁ BLOQUEADA → DENEGAR ───
  if (!isAllowed || isBlocked) {
    const response = NextResponse.redirect(new URL('/unauthorized', req.url));
    return setSecurityHeaders(response);
  }

  // ─── 8. SI TODO ESTÁ BIEN, CONTINUAR ───
  const response = NextResponse.next();
  return setSecurityHeaders(response);
}

// ============================================================
// 🔥 CONFIGURACIÓN DEL MATCHER
// ============================================================

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|img|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};