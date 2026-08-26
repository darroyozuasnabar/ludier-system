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
  // 👇 "/cliente/login" eliminado: el login se unificó en "/login" con toggle Equipo/Cliente
];

const PUBLIC_PATH_PREFIXES = [
  "/servicios/",
  "/proyectos/",
  "/blog/",
  "/api/auth/",
];

// ============================================================
// 🔥 MATRIZ DE PERMISOS POR ROL (CORREGIDA CON /erp/ y /cliente/)
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
      '/erp/obras',
      '/erp/calidad',
      '/erp/personal',
      '/erp/produccion',
      '/erp/fotos',
      '/erp/documentos',
      '/erp/alertas',
      '/crm/cotizaciones',
    ],
    blocked: [
      '/erp/dashboard',
      '/erp/valorizaciones',
      '/erp/facturacion',
      '/erp/costos',
      '/erp/indicadores',
      '/erp/reportes',
      '/erp/compras',
      '/erp/inventario',
    ]
  },
  CLIENTE: {
    allowed: [
      '/cliente/dashboard',
      '/cliente/fotos',
      '/cliente/hitos',
      '/cliente/valorizaciones',
      '/api/cliente/*',
    ],
    blocked: [
      '/erp',
      '/crm',
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
      '/erp/produccion',
      '/erp/fotos',
      '/erp/documentos',
      '/erp/alertas',
      '/erp/inventario',
    ],
    blocked: [
      '/erp/dashboard',
      '/erp/obras',
      '/erp/valorizaciones',
      '/erp/facturacion',
      '/crm/cotizaciones',
      '/erp/calidad',
      '/erp/personal',
      '/erp/compras',
      '/erp/costos',
      '/erp/indicadores',
      '/erp/reportes',
    ]
  },
  VIEWER: {
    allowed: [
      '/erp/obras',
      '/crm/cotizaciones',
      '/erp/documentos',
      '/erp/alertas',
    ],
    blocked: [
      '/erp/dashboard',
      '/erp/valorizaciones',
      '/erp/facturacion',
      '/erp/calidad',
      '/erp/personal',
      '/erp/inventario',
      '/erp/compras',
      '/erp/produccion',
      '/erp/costos',
      '/erp/indicadores',
      '/erp/fotos',
      '/erp/reportes',
    ]
  }
};

// ============================================================
// 🔥 HELPER: matching de rutas con soporte para wildcard '/*'
// ============================================================

function matchesRoute(path: string, route: string): boolean {
  if (route.endsWith('/*')) {
    const base = route.slice(0, -2);
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
    const loginUrl = new URL('/login', req.url);
    if (isClienteRoute) loginUrl.searchParams.set('tipo', 'cliente');
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