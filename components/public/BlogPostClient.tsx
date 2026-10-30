// components/public/BlogPostClient.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  ArrowRight,
  PhoneCall,
  MessageCircle,
} from "lucide-react";
import type { BlogPost } from "@/lib/blog-posts";
import WhatsAppLink from "@/components/public/WhatsAppLink";

const FONT_DISPLAY = 'var(--font-display, Oswald, ui-sans-serif, sans-serif)';
const FONT_BODY = 'var(--font-body, Inter, ui-sans-serif, system-ui, sans-serif)';
const FONT_MONO = 'var(--font-mono, "JetBrains Mono", ui-monospace, monospace)';

export default function BlogPostClient({
  post,
  relacionados,
}: {
  post: BlogPost;
  relacionados: BlogPost[];
}) {
  // URL de WhatsApp con mensaje contextual según el artículo
  const whatsappUrl = `https://wa.me/51965391256?text=${encodeURIComponent(
    `Hola LUDIER, leí el artículo "${post.titulo}" y quiero cotizar un proyecto similar.`
  )}`;

  return (
    <div className="min-h-screen bg-[#F7F7F4]" style={{ fontFamily: FONT_BODY }}>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#14161A] py-24 lg:py-32">
        <div className="absolute inset-0 opacity-[0.06] bg-[url('/img/grid-pattern.svg')] bg-repeat" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, #C7CBD1 0px, #C7CBD1 1px, transparent 1px, transparent 64px)",
          }}
        />
        <div
          className="absolute -left-32 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle, #FF5A1F 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-[4px]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #FF5A1F 0px, #FF5A1F 14px, #14161A 14px, #14161A 28px)",
          }}
        />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-[#8A8F96] hover:text-[#FF5A1F] transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Volver al blog
          </Link>

          <div className="max-w-3xl">
            <span
              className="inline-block text-xs font-medium uppercase tracking-[0.2em] text-[#8A8F96] px-3 py-1 border border-[#3A3F45]"
              style={{ fontFamily: FONT_MONO }}
            >
              {post.categoria}
            </span>
            <h1
              className="mt-6 text-4xl font-semibold text-white sm:text-5xl lg:text-6xl"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              {post.titulo}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#8A8F96]">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {post.fecha}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.tiempoLectura} de lectura
              </span>
              {post.autor && (
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {post.autor}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Imagen destacada */}
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-[#E3E1D8] bg-[#14161A] shadow-xl mb-12">
            {/* FIX MOBILE F3A-AJUSTE: priorizar la destacada situada inmediatamente después del hero. */}
            <Image src={post.imagen} alt={post.titulo} fill priority={true} sizes="(min-width: 1024px) 800px, 100vw" className="w-full h-full object-cover" />
          </div>

          {/* Contenido HTML */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.contenido }}
            style={{ fontFamily: FONT_BODY }}
          />

          {/* CTA INLINE - WhatsApp */}
          <div className="mt-10 p-6 bg-[#FFF3EC] border-l-4 border-[#FF5A1F] rounded-r-lg shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-[#1E2126] font-semibold text-lg" style={{ fontFamily: FONT_DISPLAY }}>
                  ¿Necesitas cotizar un proyecto similar?
                </p>
                <p className="text-sm text-[#565C63] mt-1">
                  Habla con un asesor por WhatsApp y recibe una cotización en menos de 24 horas.
                </p>
              </div>
              <WhatsAppLink
                href={whatsappUrl}
                location="inline_cta"
                page={`blog-${post.slug}`}
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#1FB855] transition-colors whitespace-nowrap shadow-md shadow-[#25D366]/20"
              >
                <MessageCircle className="h-4 w-4" /> Cotizar por WhatsApp
              </WhatsAppLink>
            </div>
          </div>

          {/* Compartir */}
          <div className="my-12 flex flex-wrap items-center gap-4 border-t border-[#E3E1D8] pt-8">
            <span className="text-sm font-medium text-[#8B8F86]">
              Comparte este artículo
            </span>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: post.titulo,
                    url: window.location.href,
                  });
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-[#E3E1D8] rounded-lg text-[#565C63] hover:text-[#FF5A1F] hover:border-[#FF5A1F]/30 transition-all"
            >
              <Share2 className="h-4 w-4" />
              Compartir
            </button>
            <Link
              href="/blog"
              className="ml-auto inline-flex items-center gap-2 text-sm font-medium text-[#FF5A1F] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> Ver más artículos
            </Link>
          </div>
        </div>
      </section>

      {/* ARTÍCULOS RELACIONADOS */}
      {relacionados.length > 0 && (
        <section className="bg-white py-16 border-t border-[#E3E1D8]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl font-semibold text-[#1E2126] mb-8"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              Artículos relacionados
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relacionados.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="group block bg-[#F7F7F4] border border-[#E3E1D8] rounded-sm overflow-hidden transition-all hover:border-[#FF5A1F]/40 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="relative h-40 overflow-hidden bg-[#14161A]">
                    {/* FIX MOBILE F3A: thumbnail relacionado; Image permanece dentro del Link. */}
                    <Image
                      src={rel.imagen}
                      alt={rel.titulo}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <span
                      className="text-[10px] font-medium text-[#FF5A1F] uppercase tracking-wider"
                      style={{ fontFamily: FONT_MONO }}
                    >
                      {rel.categoria}
                    </span>
                    <h3
                      className="mt-2 text-base font-semibold text-[#1E2126] group-hover:text-[#FF5A1F] transition-colors line-clamp-2"
                      style={{ fontFamily: FONT_DISPLAY }}
                    >
                      {rel.titulo}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA FINAL */}
      <section className="bg-white py-16 lg:py-24 border-t border-[#E3E1D8]">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#FF5A1F]/5 to-[#FF7A44]/5 border border-[#FF5A1F]/10 rounded-2xl p-8 md:p-12 shadow-sm">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-[#FF5A1F]/10 px-4 py-1.5 rounded-full mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF5A1F] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF5A1F]" />
                </span>
                <span className="text-xs font-medium text-[#FF5A1F] uppercase tracking-wider">
                  ¿Te ayudó este artículo?
                </span>
              </div>
              <h2
                className="text-3xl font-semibold text-[#1E2126]"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                Cotiza tu proyecto ahora
              </h2>
              <p className="mt-3 text-[#565C63] max-w-xl mx-auto">
                Cuéntanos tu idea y te ayudaremos a encontrar la mejor solución metalmecánica.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 bg-[#FF5A1F] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#FF5A1F]/20 transition-all hover:bg-[#FF7A44] hover:shadow-[#FF5A1F]/40 hover:-translate-y-1 rounded-lg w-full sm:w-auto justify-center"
                >
                  <PhoneCall className="h-4 w-4" />
                  Cotizar ahora
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <WhatsAppLink
                  href={whatsappUrl}
                  location="final_cta"
                  page={`blog-${post.slug}`}
                  className="inline-flex items-center gap-2 bg-[#25D366] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#25D366]/20 transition-all hover:bg-[#1FB855] hover:shadow-[#25D366]/40 hover:-translate-y-1 rounded-lg w-full sm:w-auto justify-center"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </WhatsAppLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ESTILOS PROSE */}
      <style jsx global>{`
        .prose {
          color: #1E2126 !important;
        }
        .prose h2 {
          font-family: var(--font-display, Oswald, ui-sans-serif, sans-serif) !important;
          font-size: 2rem !important;
          font-weight: 600 !important;
          margin-top: 2.5rem !important;
          margin-bottom: 1rem !important;
          color: #1E2126 !important;
          letter-spacing: -0.02em !important;
        }
        .prose h3 {
          font-family: var(--font-display, Oswald, ui-sans-serif, sans-serif) !important;
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          margin-top: 2rem !important;
          margin-bottom: 0.75rem !important;
          color: #1E2126 !important;
        }
        .prose p {
          color: #565C63 !important;
          line-height: 1.8 !important;
          margin-bottom: 1.25rem !important;
        }
        .prose ul {
          list-style: none !important;
          padding-left: 0 !important;
          margin: 1.5rem 0 !important;
        }
        .prose ul li {
          padding-left: 1.75rem !important;
          position: relative !important;
          margin-bottom: 0.75rem !important;
          line-height: 1.6 !important;
          color: #565C63 !important;
        }
        .prose ul li::before {
          content: "—" !important;
          position: absolute !important;
          left: 0 !important;
          color: #FF5A1F !important;
          font-weight: 600 !important;
        }
        .prose strong {
          color: #1E2126 !important;
          font-weight: 600 !important;
        }
        .prose a {
          color: #FF5A1F !important;
          text-decoration: none !important;
          transition: color 0.2s !important;
        }
        .prose a:hover {
          text-decoration: underline !important;
        }
        .prose blockquote {
          border-left: 4px solid #FF5A1F !important;
          padding-left: 1.5rem !important;
          margin: 1.5rem 0 !important;
          color: #565C63 !important;
          font-style: italic !important;
        }
        @media (max-width: 640px) {
          .prose h2 {
            font-size: 1.5rem !important;
          }
          .prose h3 {
            font-size: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
}
