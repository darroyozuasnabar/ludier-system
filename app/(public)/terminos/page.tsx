import type { Metadata } from "next";
import { ClipboardCheck, FileCheck, FileText } from "lucide-react";
import LegalPageLayout from "@/components/public/LegalPageLayout";

// FIX MOBILE F2B: destino público para el enlace legal, sin competir en búsquedas.
export const metadata: Metadata = {
  title: "Términos de servicio",
  description: "Condiciones informativas del sitio web y las cotizaciones de LUDIER.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/terminos" },
};

export default function TerminosPage() {
  // FIX LEGAL DESIGN: distribuir el texto original sin añadir obligaciones ni cláusulas.
  return (
    <LegalPageLayout
      title="Términos y Condiciones"
      subtitle="Información sobre el sitio web, las cotizaciones y la contratación de servicios de LUDIER."
      contactTitle="¿Tienes dudas sobre nuestros servicios?"
      sections={[
        { id: "objeto", title: "Objeto del sitio", icon: FileText, content: <p>
          El contenido de este sitio es informativo y presenta los servicios y
          proyectos de LUDIER.
        </p> },
        { id: "cotizaciones", title: "Cotizaciones", icon: ClipboardCheck, content: <p>
          Las cotizaciones están sujetas a evaluación técnica. El alcance, los
          materiales, los plazos y las condiciones se determinan para cada proyecto.
        </p> },
        { id: "contratacion", title: "Contratación de servicios", icon: FileCheck, content: <p>
          Los proyectos ejecutados se rigen por un contrato independiente. El envío
          de una consulta mediante este sitio no constituye la contratación de un
          servicio.
        </p> },
      ]}
    />
  );
}
