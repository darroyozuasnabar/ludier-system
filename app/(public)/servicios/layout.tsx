// app/servicios/layout.tsx
import type { Metadata } from "next";

// FIX SEO F2: metadata propia sin convertir la página cliente ni cambiar su diseño.
const TITLE = "Servicios de Metalmecánica en Lima | LUDIER";
const DESCRIPTION = "Fabricación e instalación de estructuras metálicas, barandas, escaleras, portones y soluciones a medida para obras en Lima. Conoce los servicios de LUDIER.";
const PAGE_URL = "https://grupoludier.com/servicios";

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

export default function ServiciosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-[#F7F7F4]">{children}</div>;
}
