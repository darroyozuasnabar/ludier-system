// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// 🔥 Rutas públicas (no requieren autenticación)
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
  "/api/cotizaciones",
];

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 🔥 Si la ruta es pública, permitir acceso sin token
    if (publicRoutes.some(route => path === route || path.startsWith(route + "/"))) {
      return NextResponse.next();
    }

    // 🔥 Si no hay token y no es pública, redirigir a login
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 🔥 (Opcional) Verificación de roles
    // const role = token.role as string;
    // if (path.startsWith("/dashboard") && role !== "FUNDADOR") {
    //   return NextResponse.redirect(new URL("/unauthorized", req.url));
    // }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Solo autoriza si hay token (esto es para rutas que no pasaron el filtro anterior)
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

// 🔥 El matcher ahora aplica a todas las rutas
// La lógica de exclusión está dentro del middleware
export const config = {
  matcher: [
    // Aplica a todas las rutas excepto archivos estáticos
    "/((?!_next/static|_next/image|favicon.ico|img|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};