// app/sitemap.ts
import type { MetadataRoute } from "next";
import { proyectosData } from "@/lib/proyectos-data";
import { SERVICIOS_SEO } from "@/lib/servicios-seo";

const SITE_URL = "https://grupoludier.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // ── Páginas estáticas públicas ──
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/servicios`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/proyectos`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/nosotros`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contacto`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/testimonios`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // ── Páginas de servicios (6 categorías) ──
  const servicePages: MetadataRoute.Sitemap = Object.keys(SERVICIOS_SEO).map(
    (slug) => ({
      url: `${SITE_URL}/servicios/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  // ── Páginas dinámicas de proyectos ──
  const projectPages: MetadataRoute.Sitemap = proyectosData.map((proyecto) => ({
    url: `${SITE_URL}/proyectos/${proyecto.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...servicePages, ...projectPages];
}