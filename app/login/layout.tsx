// app/login/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  // FIX SEO F2: conservar el título sin duplicar la marca del template global.
  title: { absolute: "Acceso al sistema | LUDIER" },
  description: "Acceso restringido al sistema interno de LUDIER.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-snippet": -1,
      "max-image-preview": "none",
    },
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
