"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import DashboardLayout from "@/components/DashboardLayout";
import PublicLayout from "@/components/public/PublicLayout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

// 🔥 Rutas públicas (NO requieren login) - CON EL PREFIJO /public/
const PUBLIC_ROUTES = [
  "/",
  "/public",
  "/public/servicios",
  "/public/proyectos",
  "/public/nosotros",
  "/public/contacto",
  "/public/faq",
  "/public/blog",
  "/public/testimonios",
];

const AUTH_ROUTES = ["/login", "/register", "/public/login"];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Determinar qué layout usar
  const isAuthPage = AUTH_ROUTES.includes(pathname);

  // 🔥 Reconocer subrutas de rutas públicas (ej: /public/servicios/estructuras-metalicas)
  const isPublicPage =
    PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + "/")) ||
    pathname === "/" ||
    pathname.startsWith("/public/");

  // 👇 Rutas del panel de cliente ya autenticado (/cliente/dashboard, /cliente/fotos, /cliente/hitos)
  const isClienteAppRoute = pathname.startsWith("/cliente") && !isAuthPage;

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <TooltipProvider>
          <Providers>
            {isAuthPage ? (
              // ✅ Páginas de autenticación (sin layout)
              children
            ) : isPublicPage ? (
              // ✅ Páginas públicas (con Navbar + Footer)
              <PublicLayout>{children}</PublicLayout>
            ) : isClienteAppRoute ? (
              // ✅ Panel de cliente (sin el DashboardLayout interno del ERP)
              children
            ) : (
              // ✅ Páginas protegidas del ERP interno (con Sidebar + Dashboard)
              <DashboardLayout>{children}</DashboardLayout>
            )}
          </Providers>
        </TooltipProvider>
      </body>
    </html>
  );
}