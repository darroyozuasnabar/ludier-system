// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// ============================================================
// 🔥 CONFIGURACIÓN DE RUTAS PÚBLICAS
// ============================================================

// Rutas públicas exactas (NO requieren autenticación)
const publicRoutes = [
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
];

// Prefijos públicos (cualquier ruta que empiece con estos prefijos es pública)
const publicPrefixes = [
  "/servicios/",
  "/proyectos/",
  "/blog/",
];

// Rutas API públicas (solo GET - lectura pública)
const publicApiRoutes = [
  "/api/cotizaciones",
];

// ============================================================
// 🔥 MIDDLEWARE PRINCIPAL
// ============================================================

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // ─── 1. Verificar si es una ruta pública exacta ───
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // ─── 2. Verificar si es un prefijo público ───
  if (publicPrefixes.some(prefix => path.startsWith(prefix))) {
    return NextResponse.next();
  }

  // ─── 3. Verificar si es una API pública (solo GET) ───
  const isPublicApi = publicApiRoutes.some(route => {
    if (path === route) return true;
    if (path.startsWith(route + "/")) {
      // Si es una ruta con ID (ej. /api/cotizaciones/123)
      // Permitir solo GET (lectura pública)
      return req.method === "GET";
    }
    return false;
  });

  if (isPublicApi) {
    return NextResponse.next();
  }

  // ─── 4. Obtener token de sesión ───
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // ─── 5. Si no hay token, redirigir a login ───
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", path);
    
    // Usar status 303 para convertir POST a GET (evita errores 405)
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  // ─── 6. (Opcional) Verificación de roles ───
  // const role = token.role as string;
  // if (path.startsWith("/dashboard") && role !== "FUNDADOR") {
  //   return NextResponse.redirect(new URL("/unauthorized", req.url));
  // }

  // ─── 7. Si todo está bien, continuar ───
  return NextResponse.next();
}

// ============================================================
// 🔥 CONFIGURACIÓN DEL MATCHER
// ============================================================

export const config = {
  matcher: [
    // Aplica a todas las rutas excepto archivos estáticos
    "/((?!_next/static|_next/image|favicon.ico|img|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};