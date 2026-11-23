// app/contacto/page.tsx
import type { Metadata } from "next";
import Contacto from "@/components/public/Contacto";

// FIX SEO F2: metadata propia para que Contacto no herede el canonical de la Home.
const TITLE = "Contacto y Cotizaciones en Lima | LUDIER";
const DESCRIPTION = "Contacta a LUDIER para cotizar estructuras metálicas, barandas, escaleras y portones en Lima. Envíanos los requerimientos de tu obra y solicita una propuesta.";
const PAGE_URL = "https://grupoludier.com/contacto";

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

export default function ContactoPage() {
  return (
    <div className="pt-20">
      <Contacto />
    </div>
  );
}
