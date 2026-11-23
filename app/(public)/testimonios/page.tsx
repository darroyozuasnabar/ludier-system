// app/testimonios/page.tsx
import type { Metadata } from "next";
import Testimonios from "@/components/public/Testimonios";

// FIX SEO F2: canonical y metadatos específicos de Testimonios.
const TITLE = "Testimonios de Clientes | LUDIER";
const DESCRIPTION = "Conoce las opiniones y experiencias de clientes que confiaron en LUDIER para la fabricación e instalación de soluciones metalmecánicas en sus proyectos.";
const PAGE_URL = "https://grupoludier.com/testimonios";

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

export default function TestimoniosPage() {
  return (
    <div className="pt-20">
      <Testimonios />
    </div>
  );
}
