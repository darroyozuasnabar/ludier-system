"use client";

import { useEffect, useState } from "react";

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const phoneNumber = "51930747399";
  const message = "Hola%20LUDIER%2C%20quiero%20cotizar%20un%20proyecto";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  useEffect(() => {
    // Mostrar el botón después de 2 segundos para dar tiempo a cargar la página
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-[#25D366] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Contactar por WhatsApp"
      >
        {/* Imagen del logo de WhatsApp */}
        <img
          src="/img/WhatsAppLogo.jpg"
          alt="WhatsApp"
          className="w-10 h-10 object-contain rounded-full"
        />

        {/* Efecto de pulso (anillo) */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75" />
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