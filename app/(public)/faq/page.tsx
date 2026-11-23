// app/faq/page.tsx
import type { Metadata } from "next";
import Faq from "@/components/public/Faq";

// FIX SEO F2: canonical y metadatos específicos de Preguntas Frecuentes.
const TITLE = "Preguntas Frecuentes sobre Metalmecánica | LUDIER";
const DESCRIPTION = "Resuelve tus dudas sobre los servicios de LUDIER: cotizaciones, fabricación, instalación y coordinación de trabajos metalmecánicos para obras en Lima.";
const PAGE_URL = "https://grupoludier.com/faq";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    type: "website",
    images: ["/img/og-default.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/img/og-default.jpg"],
  },
};

export default function FaqPage() {
  return (
    <div className="pt-20">
      <Faq />
    </div>
  );
}
