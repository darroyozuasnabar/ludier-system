// app/layout-client.tsx
"use client";

import { usePathname } from "next/navigation";
import { Providers } from "@/components/providers";
import DashboardLayout from "@/components/DashboardLayout";
import PublicLayout from "@/components/public/PublicLayout";
import { TooltipProvider } from "@/components/ui/tooltip";

const PUBLIC_ROUTES = [
  "/",
  "/servicios",
  "/proyectos",
  "/nosotros",
  "/contacto",
  "/faq",
  "/blog",
  "/testimonios",
  // FIX MOBILE F2B: las páginas legales usan el layout público con header y footer.
  "/privacidad",
  "/terminos",
];

const AUTH_ROUTES = ["/login", "/register"];

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage = AUTH_ROUTES.includes(pathname);

  const isPublicPage =
    PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + "/"),
    ) ||
    pathname === "/";

  const isClienteAppRoute = pathname.startsWith("/cliente") && !isAuthPage;

  return (
    <TooltipProvider>
      <Providers>
        {isAuthPage ? (
          children
        ) : isPublicPage ? (
          <PublicLayout>{children}</PublicLayout>
        ) : isClienteAppRoute ? (
          children
        ) : (
          <DashboardLayout>{children}</DashboardLayout>
        )}
      </Providers>
    </TooltipProvider>
  );
}
