// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// 🔥 Rutas públicas (NO requieren autenticación)
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

// 🔥 Prefijos públicos (cualquier ruta que empiece con estos prefijos es pública)
const publicPrefixes = [
  "/servicios/",
  "/proyectos/",
  "/blog/",
];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 🔥 1. Verificar si es una ruta pública exacta o por prefijo
  const isPublic = publicRoutes.includes(path) || publicPrefixes.some(prefix => path.startsWith(prefix));

  // 🔥 2. Si es pública, permitir acceso sin token
  if (isPublic) {
    return NextResponse.next();
  }

  // 🔥 3. Obtener token de sesión (requiere NEXTAUTH_SECRET)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 🔥 4. Si no hay token, redirigir a login con callback
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  // 🔥 5. (Opcional) Verificación de roles
  // const role = token.role as string;
  // if (path.startsWith("/dashboard") && role !== "FUNDADOR") {
  //   return NextResponse.redirect(new URL("/unauthorized", req.url));
  // }

  return NextResponse.next();
}

// 🔥 Configuración del matcher (aplica a todas las rutas excepto archivos estáticos)
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|img|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};