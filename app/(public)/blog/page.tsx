// app/(public)/blog/page.tsx
import type { Metadata } from "next";
import BlogClient from "@/components/public/BlogClient";
import { getPostsSorted } from "@/lib/blog-posts";

const SITE_URL = "https://grupoludier.com";

// ============================================================
// METADATA SEO
// ============================================================
export const metadata: Metadata = {
  title: "Blog — Estructuras Metálicas, Seguridad y Construcción | LUDIER",
  description:
    "Artículos técnicos sobre estructuras metálicas, seguridad en obra, chutes metálicos y construcción vertical en Lima, Perú. Guías escritas por el equipo de LUDIER.",
  keywords: [
    "blog estructuras metálicas",
    "artículos construcción lima",
    "guías metalmecánica perú",
    "seguridad en obras",
    "chutes metálicos",
    "construcción vertical",
  ],
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Blog LUDIER — Estructuras Metálicas y Construcción en Lima",
    description:
      "Guías técnicas, casos de obra y novedades del sector metalmecánico. Escrito por el equipo de LUDIER.",
    url: `${SITE_URL}/blog`,
    type: "website",
    siteName: "LUDIER — Soluciones Metalmecánicas",
    locale: "es_PE",
    images: [
      {
        url: "/img/og_image.jpg",
        width: 1200,
        height: 630,
        alt: "Blog LUDIER",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog LUDIER — Estructuras Metálicas y Construcción",
    description:
      "Guías técnicas, casos de obra y novedades del sector metalmecánico.",
    images: ["/img/og_image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ============================================================
// JSON-LD: Blog schema
// ============================================================
function buildBlogJsonLd(posts: { titulo: string; slug: string; fechaISO: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog LUDIER",
    description:
      "Artículos técnicos sobre estructuras metálicas, seguridad en obra y construcción vertical en Lima, Perú.",
    url: `${SITE_URL}/blog`,
    publisher: {
      "@type": "Organization",
      name: "CONSTRUCCIONES GENERALES LUDIER E.I.R.L.",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/img/logo-ludier.png`,
      },
    },
    blogPost: posts.slice(0, 10).map((p) => ({
      "@type": "BlogPosting",
      headline: p.titulo,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.fechaISO,
    })),
  };
}

// ============================================================
// PAGE (Server Component)
// ============================================================
export default function BlogPage() {
  const posts = getPostsSorted();
  const blogJsonLd = buildBlogJsonLd(posts);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <BlogClient posts={posts} />
    </>
  );
}