// lib/servicios-seo.ts
//
// Metadata SEO por servicio. Fuente de verdad para <title>,
// <meta description>, Open Graph y JSON-LD structured data.

export type ServicioSEO = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage: string;
  schemaDescription: string;
};

export const SERVICIOS_SEO: Record<string, ServicioSEO> = {
  "estructuras-metalicas": {
    slug: "estructuras-metalicas",
    metaTitle:
      "Estructuras Metálicas en Lima, Perú | Fabricación e Instalación | LUDIER",
    metaDescription:
      "Fabricación e instalación de estructuras metálicas, coberturas, techos, marquesinas, plataformas y vigas en Lima. +10 años de experiencia. Cotiza sin costo.",
    keywords: [
      "estructuras metálicas Lima",
      "fabricación de estructuras metálicas Perú",
      "coberturas metálicas Lima",
      "techos metálicos",
      "marquesinas metálicas",
      "plataformas metálicas",
      "vigas metálicas Lima",
      "estructuras para azotea",
      "estructuras para paneles solares",
    ],
    ogImage: "/img/estructurasMetalicas.png",
    schemaDescription:
      "Fabricación e instalación de estructuras metálicas para proyectos residenciales, comerciales e industriales en Lima, Perú.",
  },

  "barandas-pasamanos": {
    slug: "barandas-pasamanos",
    metaTitle:
      "Barandas y Pasamanos Metálicos en Lima | Fabricación e Instalación | LUDIER",
    metaDescription:
      "Fabricación e instalación de barandas metálicas para balcones, escaleras y azoteas. Acabados negro mate y anticorrosivo. +10 años. Cotiza sin costo.",
    keywords: [
      "barandas metálicas Lima",
      "pasamanos metálicos",
      "barandas para balcones",
      "barandas para escaleras",
      "barandas de acero Perú",
      "barandas de seguridad",
      "pasamanos para escaleras de emergencia",
      "barandas de azotea",
    ],
    ogImage: "/img/Barandasmetálicas.png",
    schemaDescription:
      "Fabricación e instalación de barandas metálicas y pasamanos para balcones, escaleras y áreas de circulación en Lima, Perú.",
  },

  "escaleras-metalicas": {
    slug: "escaleras-metalicas",
    metaTitle:
      "Escaleras Metálicas en Lima | Emergencia, Marineras e Industriales | LUDIER",
    metaDescription:
      "Diseño y fabricación de escaleras metálicas, de emergencia, marineras e industriales. Cumplimiento de normativas. Respuesta en 24 horas.",
    keywords: [
      "escaleras metálicas Lima",
      "escaleras de emergencia",
      "escaleras marineras",
      "escaleras industriales",
      "escaleras de evacuación",
      "accesos técnicos metálicos",
      "plataformas con escaleras",
    ],
    ogImage: "/img/escalerasMetalicas.jpg",
    schemaDescription:
      "Fabricación de escaleras metálicas de evacuación, marineras e industriales con pasamanos integrados y acabado profesional.",
  },

  "puertas-portones": {
    slug: "puertas-portones",
    metaTitle:
      "Puertas, Portones y Cerramientos Metálicos en Lima | LUDIER",
    metaDescription:
      "Fabricación de portones metálicos, puertas cortafuego, cercos, cerramientos industriales y protecciones perimetrales en Lima. Cotiza ya.",
    keywords: [
      "portones metálicos Lima",
      "puertas metálicas",
      "puertas cortafuego",
      "cercos metálicos",
      "cerramientos industriales",
      "protección perimetral",
      "mallas de seguridad",
    ],
    ogImage: "/img/portones.jpeg",
    schemaDescription:
      "Diseño, fabricación e instalación de portones metálicos, puertas de seguridad y cerramientos perimetrales en Lima.",
  },

  "cercos-cerramientos": {
    slug: "cercos-cerramientos",
    metaTitle:
      "Chutes Metálicos y Soluciones para Constructoras en Lima | LUDIER",
    metaDescription:
      "Chutes metálicos, cerramientos temporales, barandas provisionales y refuerzos estructurales para obras. Especialistas en construcción vertical.",
    keywords: [
      "chutes metálicos",
      "chutes para residuos obra",
      "chute metálico 19 pisos",
      "cerramientos temporales obra",
      "barandas provisionales",
      "refuerzos estructurales",
      "soluciones para constructoras Lima",
    ],
    ogImage: "/img/chutesMetalicos.webp",
    schemaDescription:
      "Soluciones metalmecánicas para obras de construcción vertical: chutes metálicos, cerramientos temporales, barandas provisionales y refuerzos.",
  },

  "fabricacion-medida": {
    slug: "fabricacion-medida",
    metaTitle:
      "Fabricación Metálica a Medida en Lima | Según Planos | LUDIER",
    metaDescription:
      "Rejillas, sumideros, tapas, bastidores, racks y elementos metálicos personalizados según plano. Fabricación en taller propio. Cotiza sin costo.",
    keywords: [
      "fabricación metálica a medida Lima",
      "rejillas metálicas",
      "sumideros metálicos",
      "tapas metálicas",
      "racks industriales",
      "bastidores metálicos",
      "fabricación según planos",
      "elementos metálicos personalizados",
    ],
    ogImage: "/img/rejillasMetalicas.jpg",
    schemaDescription:
      "Fabricación de elementos metálicos a medida según planos: rejillas, sumideros, tapas, bastidores, racks y soluciones personalizadas.",
  },
};

export function buildServiceJsonLd(slug: string) {
  const s = SERVICIOS_SEO[slug];
  if (!s) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.metaTitle.split("|")[0].trim(),
    description: s.schemaDescription,
    provider: {
      "@type": "LocalBusiness",
      name: "CONSTRUCCIONES GENERALES LUDIER E.I.R.L.",
      url: "https://grupoludier.com",
      telephone: "+51 965 391 256",
      address: {
        "@type": "PostalAddress",
        addressLocality: "San Juan de Miraflores",
        addressRegion: "Lima",
        addressCountry: "PE",
      },
    },
    areaServed: {
      "@type": "City",
      name: "Lima",
    },
    url: `https://grupoludier.com/servicios/${slug}`,
  };
}

export function buildBreadcrumbJsonLd(slug: string) {
  const s = SERVICIOS_SEO[slug];
  if (!s) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://grupoludier.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Servicios",
        item: "https://grupoludier.com/servicios",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: s.metaTitle.split("|")[0].trim(),
        item: `https://grupoludier.com/servicios/${slug}`,
      },
    ],
  };
}