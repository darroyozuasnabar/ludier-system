"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // FIX UX L-04: estas páginas ya compensan el header; conservar su espacio sin duplicarlo.
  const pageReservesHeader = [
    "/",
    "/servicios",
    "/contacto",
    "/faq",
    "/testimonios",
    "/privacidad",
    "/terminos",
  ].includes(pathname);

  return (
    <div className="ludier-public min-h-screen flex flex-col bg-white">
      <Navbar />
      {/* FIX UX L-04: el header mide 64px en móvil y 80px desde md. */}
      <main className={pageReservesHeader ? "flex-1" : "flex-1 pt-16 md:pt-20"}>
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
