"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import DashboardLayout from "@/components/DashboardLayout";
import PublicLayout from "@/components/public/PublicLayout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

// 🔥 Rutas públicas (NO requieren login)
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

// 🔥 Rutas de autenticación (sin layout)
const AUTH_ROUTES = ["/login", "/register"];

// 🔥 Rutas que usan DashboardLayout (ERP + CRM)
const DASHBOARD_ROUTES = [
  "/erp",
  "/crm",
  "/dashboard",
  "/personal",
  "/produccion",
  "/obras",
  "/valorizaciones",
  "/costos",
  "/compras",
  "/inventario",
  "/documentos",
  "/fotos",
  "/calidad",
  "/alertas",
  "/reportes",
  "/facturacion",
  "/indicadores",
  "/cotizaciones",
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage = AUTH_ROUTES.some(route => pathname === route);

  const isPublicPage =
    PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + "/")) ||
    pathname === "/" ||
    pathname.startsWith("/public/");

  const isClienteAppRoute = pathname.startsWith("/cliente") && !isAuthPage;

  // ✅ Detectar si es una ruta que usa DashboardLayout
  const usesDashboardLayout = DASHBOARD_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + "/")
  );

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
              // ✅ Panel de cliente (sin layout adicional)
              children
            ) : usesDashboardLayout ? (
              // ✅ Páginas del ERP y CRM (con Sidebar + Dashboard)
              <DashboardLayout>{children}</DashboardLayout>
            ) : (
              // ✅ Fallback: cualquier otra ruta usa DashboardLayout
              <DashboardLayout>{children}</DashboardLayout>
            )}
          </Providers>
        </TooltipProvider>
      </body>
    </html>
  );
}