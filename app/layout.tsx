"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import DashboardLayout from "@/components/DashboardLayout";
import PublicLayout from "@/components/public/PublicLayout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

// 🔥 Lista de rutas públicas (NO requieren login)
const PUBLIC_ROUTES = [
  "/",
  "/servicios",
  "/proyectos",
  "/nosotros",
  "/contacto",
  "/faq",
  "/blog",
  "/testimonios",
];

// 👇 "/cliente/login" se trata como página de auth (sin layout), igual que "/login"
const AUTH_ROUTES = ["/login", "/register", "/cliente/login"];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Determinar qué layout usar
  const isAuthPage = AUTH_ROUTES.includes(pathname);

  // 🔥 Reconocer subrutas de rutas públicas (ej: /servicios/estructuras-metalicas)
  const isPublicPage =
    PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + "/")) ||
    pathname === "/";

  // 👇 Rutas del panel de cliente ya autenticado (/cliente/dashboard, /cliente/fotos, /cliente/hitos).
  // Antes caían en el "else" y se envolvían con DashboardLayout (el layout interno del ERP,
  // pensado para FUNDADOR/ADMIN/FIELD_ENGINEER), que no reconoce el rol CLIENTE y redirige a "/".
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
              // TODO: reemplazar por un <ClienteLayout> propio (header simple / tabs)
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