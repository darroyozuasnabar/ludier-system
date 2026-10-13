import type { Metadata } from "next";
import ServicioDetalleClient from "./ServicioDetalleClient";
import {
  SERVICIOS_SEO,
  buildServiceJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/servicios-seo";

const SITE_URL = "https://grupoludier.com";

// ============================================================
// PRE-RENDER ESTÁTICO (SEO) — 6 servicios
// ============================================================
export function generateStaticParams() {
  return Object.keys(SERVICIOS_SEO).map((slug) => ({ slug }));
}

// ============================================================
// METADATA DINÁMICA POR SERVICIO
// ============================================================
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = SERVICIOS_SEO[slug];

  if (!meta) {
    return {
      title: "Servicio no encontrado | LUDIER",
      description: "El servicio que buscas no está disponible.",
      robots: { index: false, follow: false },
    };
  }

  const url = `${SITE_URL}/servicios/${slug}`;

  return {
    title: meta.metaTitle,
    description: meta.metaDescription,
    keywords: meta.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: meta.metaTitle,
      description: meta.metaDescription,
      url,
      type: "website",
      siteName: "LUDIER — Soluciones Metalmecánicas",
      locale: "es_PE",
      images: [
        {
          url: meta.ogImage,
          width: 1200,
          height: 630,
          alt: meta.metaTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.metaTitle,
      description: meta.metaDescription,
      images: [meta.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// ============================================================
// PAGE (Server Component)
// ============================================================
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const serviceJsonLd = buildServiceJsonLd(slug);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(slug);

  return (
    <>
      {serviceJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceJsonLd),
          }}
        />
      )}
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd),
          }}
        />
      )}

      <ServicioDetalleClient slug={slug} />
    </>
  );
}