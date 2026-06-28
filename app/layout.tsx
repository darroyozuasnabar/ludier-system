"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import DashboardLayout from "@/components/DashboardLayout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import NotificacionesTiempoReal from "@/components/NotificacionesTiempoReal";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <TooltipProvider>
          <Providers>
            {isAuthPage ? children : <DashboardLayout>{children}</DashboardLayout>}
          </Providers>
        </TooltipProvider>
      </body>
    </html>
  );
}