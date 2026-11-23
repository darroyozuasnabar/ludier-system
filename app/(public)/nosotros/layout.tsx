import type { Metadata } from "next";

// FIX SEO F2: metadata en servidor conservando intacta la página cliente de Nosotros.
const TITLE = "Nosotros — Soluciones Metalmecánicas en Lima | LUDIER";
const DESCRIPTION = "Conoce a LUDIER, empresa peruana dedicada a la fabricación e instalación de estructuras metálicas y soluciones para constructoras y obras en Lima.";
const PAGE_URL = "https://grupoludier.com/nosotros";

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

export default function NosotrosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
