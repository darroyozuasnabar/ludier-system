// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import LayoutClient from "./layout-client";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = "https://grupoludier.com";
const GA_ID = "G-GYRFKP6RFF";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "LUDIER — Soluciones Metalmecánicas en Lima, Perú",
    template: "%s · LUDIER",
  },

  description:
    "Fabricación e instalación de estructuras metálicas, barandas, cercos perimetrales y chutes metálicos para proyectos residenciales, comerciales e industriales en Lima, Perú. Más de 10 años de experiencia.",

  keywords: [
    "carpintería metálica Lima",
    "estructuras metálicas Perú",
    "barandas metálicas",
    "pasamanos metálicos",
    "chutes metálicos",
    "cercos perimetrales",
    "soluciones metalmecánicas",
    "construcción metálica Lima",
    "LUDIER",
    "Grupo LUDIER",
  ],

  authors: [{ name: "CONSTRUCCIONES GENERALES LUDIER E.I.R.L." }],
  creator: "LUDIER",
  publisher: "CONSTRUCCIONES GENERALES LUDIER E.I.R.L.",

  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },

  // ── Open Graph (WhatsApp, LinkedIn, Facebook) ──
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: SITE_URL,
    siteName: "LUDIER — Soluciones Metalmecánicas",
    title: "LUDIER — Soluciones Metalmecánicas en Lima, Perú",
    description:
      "Fabricación e instalación de estructuras metálicas, barandas, cercos perimetrales y chutes metálicos para proyectos residenciales, comerciales e industriales.",
    images: [
      {
        url: "/img/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "LUDIER — Soluciones Metalmecánicas",
      },
    ],
  },

  // ── Twitter Card ──
  twitter: {
    card: "summary_large_image",
    title: "LUDIER — Soluciones Metalmecánicas",
    description:
      "Estructuras metálicas, barandas y cercos perimetrales para proyectos residenciales, comerciales e industriales en Lima, Perú.",
    images: ["/img/og-default.jpg"],
  },

  // ── Robots ──
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Iconos (favicon, apple touch, PWA) ──
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },

  // ── Verification (poner cuando lo tengas de Search Console) ──
  // verification: {
  //   google: "tu-codigo-de-google-search-console",
  // },

  alternates: {
    canonical: SITE_URL,
  },

  category: "Construcción",
};

export const viewport: Viewport = {
  themeColor: "#14161A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <LayoutClient>{children}</LayoutClient>
        <GoogleAnalytics gaId={GA_ID} />
      </body>
    </html>
  );
}