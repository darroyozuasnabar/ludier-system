// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Si no hay token y no está en login, redirigir a login
    if (!token && path !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Permitir acceso a login sin token
        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
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
  ],
};