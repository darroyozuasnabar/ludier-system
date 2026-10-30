"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { trackEvent, getLandingPath, withWhatsAppReference } from "@/lib/analytics";

export default function WhatsAppButton({ offset = false }: { offset?: boolean }) {
  // FIX MOBILE F1: elevar el flotante solo donde existe la barra B2B.
  const pathname = usePathname();
  const hasMobileBar = offset || [
    "/servicios/barandas-acero-inoxidable",
    "/servicios/chutes-metalicos-para-construccion",
    "/servicios/estructuras-metalicas-para-techos",
  ].includes(pathname.replace(/\/$/, ""));
  const [isVisible, setIsVisible] = useState(false);
  const phoneNumber = "51965391256";
  const message = "Hola%20LUDIER%2C%20quiero%20cotizar%20un%20proyecto";
  // FIX TRACKING F5: referencia legible en el primer mensaje comercial.
  const whatsappUrl = withWhatsAppReference(`https://wa.me/${phoneNumber}?text=${message}`, "floating");

  useEffect(() => {
    // FIX TRACKING F5: capturar la landing antes de navegar al formulario.
    getLandingPath();
    // Mostrar el botón después de 2 segundos para dar tiempo a cargar la página
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed ${hasMobileBar ? "bottom-[calc(72px+env(safe-area-inset-bottom))] lg:bottom-6" : "bottom-6"} right-6 z-50 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          trackEvent("whatsapp_click", {
            ubicacion: "boton_flotante",
            location: "floating",
          });
        }}
        className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-[#25D366] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Contactar por WhatsApp"
      >
        {/* FIX WHATSAPP LOGO: mantener el logo por encima de las capas verdes del halo. */}
        <img
          src="/img/WhatsAppLogo.jpg"
          alt="WhatsApp"
          className="relative z-10 w-10 h-10 object-contain rounded-full"
        />

        {/* Efecto de pulso (anillo) */}
        {/* FIX MOBILE F1: respetar la preferencia de movimiento reducido. */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping motion-reduce:animate-none opacity-75" />
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30" />

        {/* Tooltip que aparece al hacer hover */}
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Cotiza por WhatsApp
          <span className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1.5 border-4 border-transparent border-l-gray-900" />
        </span>
      </a>
    </div>
  );
}
