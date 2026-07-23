// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 🔥 Si no hay token, redirigir al login (excepto para rutas públicas)
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // 🔥 (Opcional) Verificación de roles por ruta
    // Ejemplo: solo FUNDADOR puede acceder a /dashboard
    // const role = token.role as string;
    // if (path.startsWith("/dashboard") && role !== "FUNDADOR") {
    //   return NextResponse.redirect(new URL("/unauthorized", req.url));
    // }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // ✅ Solo autoriza si hay un token válido
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

// 🔥 RUTAS PROTEGIDAS: incluye API y todas las rutas del dashboard
export const config = {
  matcher: [
    // Rutas del dashboard
    "/dashboard/:path*",
    "/obras/:path*",
    "/valorizaciones/:path*",
    "/facturacion/:path*",
    "/personal/:path*",
    "/inventario/:path*",
    "/compras/:path*",
    "/produccion/:path*",
    "/costos/:path*",
    "/indicadores/:path*",
    "/fotos/:path*",
    "/alertas/:path*",
    "/reportes/:path*",
    "/documentos/:path*",
    "/calidad/:path*",
    "/cotizaciones/:path*",
    "/reuniones/:path*",
    "/finanzas/:path*",

    // 🔥 Rutas de API (requieren autenticación)
    "/api/:path*",
  ],
};