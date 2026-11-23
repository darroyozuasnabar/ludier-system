// app/proyectos/page.tsx
import type { Metadata } from "next";
import Proyectos from "@/components/public/Proyectos";

// FIX SEO F2: canonical autorreferente y título sin la marca duplicada del template.
const TITLE = "Proyectos de Metalmecánica en Lima | LUDIER";
const DESCRIPTION = "Conoce los proyectos de estructuras metálicas, barandas y soluciones metalmecánicas ejecutados por LUDIER para obras y constructoras en Lima.";
const PAGE_URL = "https://grupoludier.com/proyectos";

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

export default function ProyectosPage() {
  return <Proyectos />;
}
