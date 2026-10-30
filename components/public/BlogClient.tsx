// components/public/BlogClient.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle,
  Users,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import type { BlogPost } from "@/lib/blog-posts";

const FONT_DISPLAY = 'var(--font-display, Oswald, ui-sans-serif, sans-serif)';
const FONT_BODY = 'var(--font-body, Inter, ui-sans-serif, system-ui, sans-serif)';
const FONT_MONO = 'var(--font-mono, "JetBrains Mono", ui-monospace, monospace)';

function CornerMarks({ active = false }: { active?: boolean }) {
  const base = "pointer-events-none absolute h-3 w-3 transition-all duration-500";
  const border = active
    ? "border-[#FF5A1F] opacity-100"
    : "border-[#3A3F45] opacity-50";
  return (
    <>
      <span className={`${base} left-3 top-3 border-l-2 border-t-2 ${border}`} />
      <span className={`${base} right-3 top-3 border-r-2 border-t-2 ${border}`} />
      <span className={`${base} bottom-3 left-3 border-b-2 border-l-2 ${border}`} />
      <span className={`${base} bottom-3 right-3 border-b-2 border-r-2 ${border}`} />
    </>
  );
}

function useScrollReveal<T extends HTMLElement>(threshold = 0.12) {
  const ref = useRef<T | null>(null);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasBeenVisible) {
          setHasBeenVisible(true);
        }
      },
      { threshold, rootMargin: "-60px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, hasBeenVisible]);

  return { ref, inView: hasBeenVisible };
}

const BlogCard = ({
  post,
  index,
}: {
  post: BlogPost;
  index: number;
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 400 + index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 800ms cubic-bezier(0.16,1,0.3,1), transform 800ms cubic-bezier(0.16,1,0.3,1)`,
      }}
    >
      <div className="group relative bg-white border border-[#E3E1D8] rounded-sm overflow-hidden transition-all hover:border-[#FF5A1F]/40 hover:shadow-xl hover:-translate-y-2">
        <CornerMarks />
        <div className="relative h-48 overflow-hidden bg-[#14161A]">
          {/* FIX MOBILE F3A-AJUSTE: sizes coincide con las columnas 1/2/3 del grid. */}
          <Image
            src={post.imagen}
            alt={post.titulo}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-sm">
            <span
              className="text-[10px] font-medium text-white uppercase tracking-wider"
              style={{ fontFamily: FONT_MONO }}
            >
              {post.categoria}
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 text-xs text-[#8B8F86] mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {post.fecha}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.tiempoLectura}
            </span>
          </div>
          <h3
            className="text-lg font-semibold text-[#1E2126] group-hover:text-[#FF5A1F] transition-colors line-clamp-2"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            {post.titulo}
          </h3>
          <p className="mt-2 text-sm text-[#565C63] line-clamp-2">{post.extracto}</p>
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[#FF5A1F]">
            <span>Leer más</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function BlogClient({ posts }: { posts: BlogPost[] }) {
  const { ref: heroRef, inView: heroInView } = useScrollReveal<HTMLDivElement>(0.1);
  const { ref: gridRef, inView: gridInView } = useScrollReveal<HTMLDivElement>(0.1);
  const { ref: ctaRef, inView: ctaInView } = useScrollReveal<HTMLDivElement>(0.1);

  const stats = [
    { value: `${posts.length}+`, label: "Artículos publicados", icon: BookOpen },
    { value: "95%", label: "Contenido útil", icon: TrendingUp },
    { value: "100%", label: "Actualizado", icon: CheckCircle },
    { value: "200+", label: "Lectores mensuales", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F4]" style={{ fontFamily: FONT_BODY }}>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#14161A] py-28 lg:py-36">
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[url('/img/grid-pattern.svg')] bg-repeat" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, #C7CBD1 0px, #C7CBD1 1px, transparent 1px, transparent 64px)",
          }}
        />
        <div
          className="pointer-events-none absolute -left-32 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle, #FF5A1F 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-[4px]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #FF5A1F 0px, #FF5A1F 14px, #14161A 14px, #14161A 28px)",
          }}
        />

        <div
          ref={heroRef}
          className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          style={{
            opacity: heroInView ? 1 : 0,
            transform: heroInView ? "translateY(0)" : "translateY(30px)",
            transition:
              "opacity 900ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div className="max-w-3xl">
            <span
              className="inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.22em] text-[#8A8F96]"
              style={{ fontFamily: FONT_MONO }}
            >
              <span className="h-px w-6 bg-[#FF5A1F]" />
              Blog / Novedades
            </span>
            <h1
              className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              Novedades y
              <br />
              <span className="relative inline-block">
                <span className="text-[#FF5A1F]">conocimiento</span>
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#FF5A1F]/30 rounded-full blur-sm" />
              </span>
            </h1>
            <p className="mt-6 text-lg text-[#9AA0A6] max-w-xl leading-relaxed">
              Artículos, guías y novedades sobre estructuras metálicas, seguridad
              en obra y tendencias en construcción.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs text-[#8A8F96]">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-[#FF5A1F]" />
                Artículos técnicos
              </span>
              <span className="text-[#3A3F45]">|</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-[#FF5A1F]" />
                Actualizado semanalmente
              </span>
              <span className="text-[#3A3F45]">|</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-[#FF5A1F]" />
                Contenido experto
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ESTADÍSTICAS */}
      <section className="py-12 bg-white border-b border-[#E3E1D8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="flex flex-col items-center p-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[#FF5A1F]/10 border border-[#FF5A1F]/20">
                    <Icon className="h-6 w-6 text-[#FF5A1F]" />
                  </div>
                  <p
                    className="mt-3 text-2xl font-semibold text-[#1E2126]"
                    style={{ fontFamily: FONT_DISPLAY }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-sm text-[#565C63]">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* GRID DE ARTÍCULOS */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            ref={gridRef}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            style={{
              opacity: gridInView ? 1 : 0,
              transform: gridInView ? "translateY(0)" : "translateY(30px)",
              transition:
                "opacity 900ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {posts.map((post, index) => (
              <BlogCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-white py-16 lg:py-20 border-t border-[#E3E1D8]">
        <div
          ref={ctaRef}
          className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8"
          style={{
            opacity: ctaInView ? 1 : 0,
            transform: ctaInView ? "translateY(0)" : "translateY(20px)",
            transition:
              "opacity 900ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <h2
            className="text-3xl font-semibold text-[#1E2126]"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            ¿Tienes un proyecto en mente?
          </h2>
          <p className="mt-3 text-[#565C63] max-w-xl mx-auto">
            Cuéntanos tu idea y te ayudaremos a encontrar la mejor solución metalmecánica.
          </p>
          <Link
            href="/contacto"
            className="mt-6 inline-flex items-center gap-2 bg-[#FF5A1F] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#FF5A1F]/20 transition-all hover:bg-[#FF7A44] hover:shadow-[#FF5A1F]/40 hover:-translate-y-1"
          >
            <CheckCircle className="h-4 w-4" />
            Cotizar ahora
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          section * {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
