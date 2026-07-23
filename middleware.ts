// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

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

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 🔥 1. Verificar si es una ruta pública exacta
    if (publicRoutes.includes(path)) {
      return NextResponse.next();
    }

    // 🔥 2. Verificar si es un prefijo público
    if (publicPrefixes.some(prefix => path.startsWith(prefix))) {
      return NextResponse.next();
    }

    // 🔥 3. Si no hay token y no es pública, redirigir a login
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(loginUrl);
    }

    // 🔥 4. Verificación de roles (opcional)
    // const role = token.role as string;
    // if (path.startsWith("/dashboard") && role !== "FUNDADOR") {
    //   return NextResponse.redirect(new URL("/unauthorized", req.url));
    // }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // 🔥 Solo autoriza si hay token (para rutas protegidas)
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

// 🔥 Configuración del matcher (aplica a todas las rutas excepto archivos estáticos)
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|img|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};