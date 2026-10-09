// app/layout-client.tsx
"use client";

import { usePathname } from "next/navigation";
import { Providers } from "@/components/providers";
import DashboardLayout from "@/components/DashboardLayout";
import PublicLayout from "@/components/public/PublicLayout";
import { TooltipProvider } from "@/components/ui/tooltip";

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
    pathname === "/" ||
    pathname.startsWith("/public/");

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