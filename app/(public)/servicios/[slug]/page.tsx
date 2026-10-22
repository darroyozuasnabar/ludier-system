import type { Metadata } from "next";
import ServicioDetalleClient from "./ServicioDetalleClient";

const SITE_URL = "https://grupoludier.com";

// ============================================================
// PRE-RENDER ESTÁTICO (SEO) — 6 servicios
// ============================================================
export function generateStaticParams() {
  return [
    { slug: "estructuras-metalicas" },
    { slug: "barandas-pasamanos" },
    { slug: "escaleras-metalicas" },
    { slug: "puertas-portones" },
    { slug: "cercos-cerramientos" },
    { slug: "fabricacion-medida" },
  ];
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

  const seoMap: Record<
    string,
    { title: string; description: string; keywords: string[]; image: string }
  > = {
    "estructuras-metalicas": {
      title: "Fabricante de Estructuras Metálicas en Lima | LUDIER",
      description:
        "Diseño, fabricación e instalación de estructuras metálicas para techos, coberturas y azoteas en Lima. Más de 10 años de experiencia. Cotiza tu proyecto hoy.",
      keywords: [
        "fabricante de estructuras metálicas lima",
        "estructuras metálicas para techos",
        "estructura metálica lima",
        "techos en estructuras metalicas",
      ],
      image: "/img/estructurasMetalicas.png",
    },
    "barandas-pasamanos": {
      title: "Barandas Metálicas y de Acero Inoxidable en Lima | LUDIER",
      description:
        "Fabricación de barandas de acero inoxidable y metálicas para balcones, escaleras y terrazas. Resistencia a la humedad de Lima. Cotiza tu baranda ahora.",
      keywords: [
        "barandas de acero inoxidable",
        "barandas metálicas para balcones lima",
        "barandas para escaleras de acero inoxidable",
        "barandas de metal",
      ],
      image: "/img/barandaBalcones.jpg",
    },
    "escaleras-metalicas": {
      title: "Escaleras Metálicas de Emergencia e Industriales | LUDIER",
      description:
        "Fabricación de escaleras metálicas de emergencia, marineras e industriales en Lima. Cumplimiento de normativas y entrega en tiempo récord.",
      keywords: [
        "escaleras metálicas",
        "escaleras de emergencia",
        "escaleras marineras",
        "escaleras industriales",
      ],
      image: "/img/escaleras-de-emergencia.jpg",
    },
    "puertas-portones": {
      title: "Portones y Puertas Metálicas en Lima | LUDIER",
      description:
        "Fabricación e instalación de portones metálicos, puertas cortafuego y cerramientos industriales. Sistemas de apertura manual y automática.",
      keywords: [
        "portones metálicos lima",
        "puertas metálicas",
        "puertas cortafuego",
        "cerramientos industriales",
      ],
      image: "/img/portones.jpeg",
    },
    "cercos-cerramientos": {
      title: "Cercos Perimetrales y Prefabricados para Obras | LUDIER",
      description:
        "Especialistas en cercos perimetrales prefabricados y cerramientos temporales para constructoras en Lima. Rápidos, seguros y reutilizables.",
      keywords: [
        "cerco perimetral para obra",
        "cerco prefabricado",
        "cercos perimetrales prefabricados",
        "cerramientos temporales",
      ],
      image: "/img/cercosPerimetricos.jpg",
    },
    "fabricacion-medida": {
      title: "Fabricación Metálica a Medida en Lima | LUDIER",
      description:
        "Fabricación de rejillas metálicas, tapas, sumideros y estructuras personalizadas según planos. Control de calidad en taller propio.",
      keywords: [
        "fabricación de rejillas metálicas",
        "fabricación metálica a medida",
        "rejillas metálicas lima",
        "sumideros metálicos",
      ],
      image: "/img/soldaduraPersonalizada.jpg",
    },
  };

  const meta = seoMap[slug];

  if (!meta) {
    return {
      title: "Servicio no encontrado | LUDIER",
      description: "El servicio que buscas no está disponible.",
      robots: { index: false, follow: false },
    };
  }

  const url = `${SITE_URL}/servicios/${slug}`;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      type: "website",
      siteName: "LUDIER — Soluciones Metalmecánicas",
      locale: "es_PE",
      images: [
        {
          url: meta.image,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [meta.image],
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
// COMPONENTE PAGE (CON INYECCIÓN DE JSON-LD)
// ============================================================
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Volvemos a definir el diccionario aquí para tener acceso a los datos
  // (Es un poco redundante, pero asegura que el Server Component tenga la info)
  const seoMap: Record<string, any> = {
    "estructuras-metalicas": { title: "Fabricante de Estructuras Metálicas en Lima | LUDIER", description: "Diseño, fabricación e instalación de estructuras metálicas para techos, coberturas y azoteas en Lima." },
    "barandas-pasamanos": { title: "Barandas Metálicas y de Acero Inoxidable en Lima | LUDIER", description: "Fabricación de barandas de acero inoxidable y metálicas para balcones, escaleras y terrazas." },
    "escaleras-metalicas": { title: "Escaleras Metálicas de Emergencia e Industriales | LUDIER", description: "Fabricación de escaleras metálicas de emergencia, marineras e industriales en Lima." },
    "puertas-portones": { title: "Portones y Puertas Metálicas en Lima | LUDIER", description: "Fabricación e instalación de portones metálicos, puertas cortafuego y cerramientos industriales." },
    "cercos-cerramientos": { title: "Cercos Perimetrales y Prefabricados para Obras | LUDIER", description: "Especialistas en cercos perimetrales prefabricados y cerramientos temporales para constructoras." },
    "fabricacion-medida": { title: "Fabricación Metálica a Medida en Lima | LUDIER", description: "Fabricación de rejillas metálicas, tapas, sumideros y estructuras personalizadas según planos." },
  };

  const meta = seoMap[slug] || { title: "Servicios | LUDIER", description: "Soluciones metalmecánicas en Lima." };

  // 1. JSON-LD para el SERVICIO
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: meta.title.split("|")[0].trim(),
    description: meta.description,
    provider: {
      "@type": "LocalBusiness",
      name: "CONSTRUCCIONES GENERALES LUDIER E.I.R.L.",
      url: SITE_URL,
      telephone: "+51 965 391 256",
      address: {
        "@type": "PostalAddress",
        addressLocality: "San Juan de Miraflores",
        addressRegion: "Lima",
        addressCountry: "PE",
      },
    },
    areaServed: { "@type": "City", name: "Lima" },
    url: `${SITE_URL}/servicios/${slug}`,
  };

  // 2. JSON-LD para el BREADCRUMB
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Servicios", item: `${SITE_URL}/servicios` },
      { "@type": "ListItem", position: 3, name: meta.title.split("|")[0].trim(), item: `${SITE_URL}/servicios/${slug}` },
    ],
  };

  return (
    <>
      {/* Inyección de los datos estructurados */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      <ServicioDetalleClient slug={slug} />
    </>
  );
}