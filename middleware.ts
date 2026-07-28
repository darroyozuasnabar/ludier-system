// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// ============================================================
// 🔥 CONFIGURACIÓN DE RUTAS PÚBLICAS
// ============================================================

// TODAS las rutas que comiencen con estos prefijos son PÚBLICAS
// (no requieren autenticación)
const PUBLIC_PREFIXES = [
  // Páginas públicas del sitio
  "/",
  "/login",
  "/servicios",
  "/proyectos",
  "/nosotros",
  "/contacto",
  "/faq",
  "/blog",
  "/testimonios",
  
  // 🔥 IMPORTANTE: Todas las rutas de NextAuth DEBEN ser públicas
  "/api/auth",
  "/api/contacto",
  "/api/cotizaciones",
];

// Prefijos con sub-rutas (cualquier ruta que empiece con esto es pública)
const PUBLIC_PATH_PREFIXES = [
  "/servicios/",
  "/proyectos/",
  "/blog/",
  "/api/auth/",      // 👈 ¡ESTA LÍNEA ES CLAVE! Permite /api/auth/session, /api/auth/csrf, etc.
];

// ============================================================
// 🔥 MIDDLEWARE PRINCIPAL
// ============================================================

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // ─── 1. VERIFICAR SI ES UNA RUTA PÚBLICA ───
  // Verificar coincidencia exacta con PUBLIC_PREFIXES
  const isExactPublic = PUBLIC_PREFIXES.some(prefix => path === prefix);
  
  // Verificar si empieza con algún prefijo público
  const isPathPublic = PUBLIC_PATH_PREFIXES.some(prefix => path.startsWith(prefix));

  // Si es pública, permitir acceso inmediato (sin verificar token)
  if (isExactPublic || isPathPublic) {
    return NextResponse.next();
  }

  // ─── 2. OBTENER TOKEN DE SESIÓN ───
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // ─── 3. SI NO HAY TOKEN, REDIRIGIR A LOGIN ───
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", path);
    
    // Usamos status 303 para convertir POST a GET (evita errores 405)
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  // ─── 4. VERIFICACIÓN DE ROLES ───
  const role = token.role as string;
  
  // Si es ingeniero de campo u operativo, bloquear módulos financieros
  if (role === "FIELD_ENGINEER" || role === "OPERATIVO") {
    const blockedPaths = [
      "/costos",
      "/finanzas", 
      "/reportes",
      "/indicadores",
      "/facturacion",
      "/dashboard",
    ];
    
    if (blockedPaths.some(p => path.startsWith(p))) {
      // Redirigir a una página de "No autorizado"
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  // ─── 5. SI TODO ESTÁ BIEN, CONTINUAR ───
  return NextResponse.next();
}

// ============================================================
// 🔥 CONFIGURACIÓN DEL MATCHER
// ============================================================

export const config = {
  matcher: [
    // Aplica a todas las rutas EXCEPTO archivos estáticos
    "/((?!_next/static|_next/image|favicon.ico|img|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};