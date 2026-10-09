// app/robots.ts
import type { MetadataRoute } from "next";

const SITE_URL = "https://grupoludier.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/erp/",
          "/crm/",
          "/cliente/",
          "/api/",
          "/login",
          "/register",
          "/unauthorized",
        ],
      },
      {
        // Bloquear bots agresivos de scraping
        userAgent: ["AhrefsBot", "SemrushBot", "MJ12bot", "DotBot"],
        disallow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}