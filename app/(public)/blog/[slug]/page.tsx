// app/(public)/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostClient from "@/components/public/BlogPostClient";
import { getPostBySlug, getAllSlugs, getPortonesGuide, POSTS } from "@/lib/blog-posts";

const SITE_URL = "https://grupoludier.com";

// ============================================================
// PRE-RENDER ESTÁTICO — 7 artículos
// ============================================================
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// ============================================================
// METADATA DINÁMICA POR ARTÍCULO
// ============================================================
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Artículo no encontrado | LUDIER",
      robots: { index: false, follow: false },
    };
  }

  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    // FIX SEO PORTONES: evitar la segunda marca añadida por title.template del layout.
    title: slug === "portones-metalicos-tipos-precios-guia"
      ? { absolute: `${post.titulo} | LUDIER` }
      : `${post.titulo} | LUDIER`,
    description: post.metaDescription,
    keywords: post.keywords,
    authors: [{ name: post.autor }],
    alternates: { canonical: url },
    openGraph: {
      title: post.titulo,
      description: post.metaDescription,
      url,
      type: "article",
      siteName: "LUDIER — Soluciones Metalmecánicas",
      locale: "es_PE",
      publishedTime: post.fechaISO,
      authors: [post.autor],
      images: [
        {
          url: post.imagen,
          width: 1200,
          height: 630,
          alt: post.titulo,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.titulo,
      description: post.metaDescription,
      images: [post.imagen],
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
// JSON-LD: Article + BreadcrumbList
// ============================================================
function buildArticleJsonLd(slug: string) {
  const post = getPostBySlug(slug);
  if (!post) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.titulo,
    description: post.metaDescription,
    image: `${SITE_URL}${post.imagen}`,
    datePublished: post.fechaISO,
    dateModified: post.fechaISO,
    author: {
      "@type": "Person",
      name: post.autor,
    },
    publisher: {
      "@type": "Organization",
      name: "CONSTRUCCIONES GENERALES LUDIER E.I.R.L.",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/img/logo-ludier.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    keywords: post.keywords.join(", "),
  };
}

function buildBreadcrumbJsonLd(slug: string) {
  const post = getPostBySlug(slug);
  if (!post) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.titulo,
        item: `${SITE_URL}/blog/${post.slug}`,
      },
    ],
  };
}

// ============================================================
// PAGE (Server Component)
// ============================================================
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const articleJsonLd = buildArticleJsonLd(slug);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(slug);
  // FIX F4-FAQ: conservar las FAQ visibles y emitir solo Article y BreadcrumbList.
  const guide = getPortonesGuide(post);

  // Posts relacionados (misma categoría, excluyendo el actual)
  let relacionados = POSTS.filter(
    (p) => p.categoria === post.categoria && p.slug !== post.slug
  ).slice(0, 3);
  // FIX SEO PORTONES: complementar la decisión de compra con contenido relevante.
  if (guide) {
    const relatedSlugs = [
      "cercos-perimetrales-industrial-guia",
      "fabricacion-metalica-medida-guia",
      "seguridad-en-obras-construccion",
    ];
    relacionados = relatedSlugs.flatMap((relatedSlug) => {
      const related = getPostBySlug(relatedSlug);
      return related ? [related] : [];
    });
  }

  return (
    <>
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      <BlogPostClient
        post={guide ? { ...post, contenido: guide.content } : post}
        relacionados={relacionados}
        portonesGuide={guide ? { headings: guide.headings, inlineAnchor: guide.inlineAnchor } : undefined}
      />
    </>
  );
}
