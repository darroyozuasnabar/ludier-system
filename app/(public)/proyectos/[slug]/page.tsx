// app/(public)/proyectos/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { proyectosData } from "@/lib/proyectos-data";
import ProyectoDetalleClient from "./ProyectoDetalleClient";

const SITE_URL = "https://grupoludier.com";

// 1. Pre-renderizado estático
export function generateStaticParams() {
  return proyectosData.map((proyecto) => ({
    slug: proyecto.slug,
  }));
}

// 2. SEO Dinámico (Metadata e Inyección Local)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const proyecto = proyectosData.find((p) => p.slug === slug);

  if (!proyecto) {
    return { title: "Proyecto no encontrado | LUDIER" };
  }

  const url = `${SITE_URL}/proyectos/${proyecto.slug}`;
  
  // Extraemos el distrito principal para el SEO
  const distrito = proyecto.ubicacion.split(",")[0]; 

  return {
    title: `${proyecto.titulo} en ${distrito} | LUDIER`,
    description: `Conoce el proyecto ${proyecto.titulo} ejecutado por LUDIER en ${proyecto.ubicacion}. ${proyecto.resultado.substring(0, 120)}...`,
    alternates: { canonical: url },
    openGraph: {
      title: `${proyecto.titulo} en ${distrito} | LUDIER`,
      description: `Proyecto de carpintería metálica ejecutado para ${proyecto.cliente} en ${proyecto.ubicacion}.`,
      url,
      type: "article",
      images: [{ url: proyecto.imagen, width: 1200, height: 630, alt: proyecto.titulo }],
    },
  };
}

// 3. Renderizado del Componente
export default async function ProyectoDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const proyecto = proyectosData.find((p) => p.slug === slug);

  if (!proyecto) {
    notFound();
  }

  // Inyección de JSON-LD (Datos estructurados para Google)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: proyecto.titulo,
    description: proyecto.resultado,
    image: `${SITE_URL}${proyecto.imagen}`,
    locationCreated: {
      "@type": "Place",
      name: proyecto.ubicacion,
    },
    creator: {
      "@type": "Organization",
      name: "Construcciones Generales LUDIER E.I.R.L.",
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProyectoDetalleClient proyecto={proyecto} />
    </>
  );
}