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

// Definición de qué rutas puede ver cada rol
// - '*' significa todas las rutas
// - Las rutas se verifican por prefijo (ej. "/dashboard" incluye "/dashboard/...")
const ROLE_PERMISSIONS: Record<string, { allowed: string[]; blocked: string[] }> = {
  // FUNDADOR: acceso total
  FUNDADOR: {
    allowed: ['*'],
    blocked: []
  },
  
  // ADMIN: todo excepto configuraciones críticas (si existen)
  ADMIN: {
    allowed: ['*'],
    blocked: ['/configuracion/critica']
  },
  
  // FIELD_ENGINEER: obra, calidad, personal (sin sueldos), producción, fotos, documentos, alertas
  FIELD_ENGINEER: {
    allowed: [
      '/obras',
      '/calidad',
      '/personal',
      '/produccion',
      '/fotos',
      '/documentos',
      '/alertas',
      '/cotizaciones',  // solo lectura (lo manejaremos en el componente)
    ],
    blocked: [
      '/dashboard',
      '/valorizaciones',
      '/facturacion',
      '/costos',
      '/indicadores',
      '/reportes',
      '/compras',
      '/inventario',     // solo lectura en componente
    ]
  },
  
  // PRODUCTION: producción, fotos, documentos, alertas, inventario (lectura)
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
  
  // VIEWER: solo lectura de obras, cotizaciones, documentos y alertas
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
// 🔥 MIDDLEWARE PRINCIPAL
// ============================================================

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // ─── 1. VERIFICAR RUTAS PÚBLICAS ───
  const isExactPublic = PUBLIC_PREFIXES.some(prefix => path === prefix);
  const isPathPublic = PUBLIC_PATH_PREFIXES.some(prefix => path.startsWith(prefix));
  if (isExactPublic || isPathPublic) {
    return NextResponse.next();
  }

  // ─── 2. OBTENER TOKEN ───
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // ─── 3. SI NO HAY TOKEN, REDIRIGIR A LOGIN ───
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  // ─── 4. OBTENER ROL Y PERMISOS ───
  const role = token.role as string || 'VIEWER';
  const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.VIEWER;

  // Si el rol tiene acceso total ('*'), continuar
  if (permissions.allowed.includes('*')) {
    return NextResponse.next();
  }

  // ─── 5. VERIFICAR SI LA RUTA ESTÁ PERMITIDA ───
  const isAllowed = permissions.allowed.some(route => 
    path === route || path.startsWith(route + '/')
  );
  const isBlocked = permissions.blocked.some(route => 
    path === route || path.startsWith(route + '/')
  );

  // Si no está permitida o está explícitamente bloqueada → denegar
  if (!isAllowed || isBlocked) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // ─── 6. SI TODO ESTÁ BIEN, CONTINUAR ───
  return NextResponse.next();
}

// ============================================================
// 🔥 CONFIGURACIÓN DEL MATCHER
// ============================================================

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|img|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};