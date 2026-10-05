// components/public/GaleriaFotos.tsx
"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { Camera, Plus, Play } from "lucide-react";
import {
  CATEGORIAS_INFO,
  getGaleriaProyecto,
  type CategoriaFoto,
} from "@/lib/proyectos-galeria";
import LightboxFotos from "./LightboxFotos";

const FONT_DISPLAY = "var(--font-display, Oswald, sans-serif)";
const FONT_BODY = "var(--font-body, Inter, sans-serif)";
const FONT_MONO = 'var(--font-mono, "JetBrains Mono", monospace)';

type FiltroCategoria = "todas" | CategoriaFoto;

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold, rootMargin: "0px 0px -80px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export default function GaleriaFotos({ slug }: { slug: string }) {
  const galeria = useMemo(() => getGaleriaProyecto(slug), [slug]);
  const [filtro, setFiltro] = useState<FiltroCategoria>("todas");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const { ref, inView } = useInView(0.05);

  if (!galeria || galeria.fotos.length === 0) return null;

  const categoriasPresentes = Array.from(
    new Set(galeria.fotos.map((f) => f.categoria)),
  );

  const fotosFiltradas =
    filtro === "todas"
      ? galeria.fotos
      : galeria.fotos.filter((f) => f.categoria === filtro);

  const totalFotos = galeria.fotos.length;
  const totalVideos = galeria.videos.length;

  return (
    <section
      ref={ref}
      className="bg-[#F7F7F4] py-20 md:py-28"
      style={{ fontFamily: FONT_BODY }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── HEADER ─── */}
        <div
          className="mb-12 md:mb-16 max-w-3xl"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
            transition:
              "opacity 800ms cubic-bezier(0.16,1,0.3,1), transform 800ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <span
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#FF5A1F] mb-4"
            style={{ fontFamily: FONT_MONO }}
          >
            <span className="h-px w-6 bg-[#FF5A1F]" />
            Galería de obra
          </span>

          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1E2126] leading-[1.02] tracking-tight mb-4"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            Nuestro trabajo
            <br />
            <span className="text-[#FF5A1F]">en imágenes</span>
          </h2>

          <p className="text-base md:text-lg text-[#565C63] leading-relaxed">
            Registro visual del proceso de fabricación, instalación y acabado
            de cada elemento metálico que ejecutamos en obra.
          </p>
        </div>

        {/* ─── FILTROS ─── */}
        <div
          className="flex flex-wrap gap-2.5 mb-10"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(16px)",
            transition:
              "opacity 800ms cubic-bezier(0.16,1,0.3,1) 100ms, transform 800ms cubic-bezier(0.16,1,0.3,1) 100ms",
          }}
        >
          <button
            onClick={() => setFiltro("todas")}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm border transition-all duration-300 ${
              filtro === "todas"
                ? "bg-[#1E2126] text-white border-[#1E2126]"
                : "bg-white text-[#565C63] border-[#E3E1D8] hover:border-[#1E2126] hover:text-[#1E2126]"
            }`}
            style={{ fontFamily: FONT_MONO }}
          >
            Todas · {galeria.fotos.length}
          </button>
          {categoriasPresentes.map((cat) => {
            const info = CATEGORIAS_INFO[cat];
            const count = galeria.fotos.filter(
              (f) => f.categoria === cat,
            ).length;
            const activo = filtro === cat;
            return (
              <button
                key={cat}
                onClick={() => setFiltro(cat)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm border transition-all duration-300 ${
                  activo
                    ? "bg-[#1E2126] text-white border-[#1E2126]"
                    : "bg-white text-[#565C63] border-[#E3E1D8] hover:border-[#1E2126] hover:text-[#1E2126]"
                }`}
                style={{ fontFamily: FONT_MONO }}
              >
                {info.label} · {count}
              </button>
            );
          })}
        </div>

        {/* ─── GRID UNIFORME ─── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {fotosFiltradas.map((foto, idx) => {
            const idxOriginal = galeria.fotos.indexOf(foto);
            return (
              <button
                key={foto.src}
                onClick={() => setLightboxIdx(idxOriginal)}
                className="group relative aspect-[4/5] overflow-hidden rounded-sm border border-[#E3E1D8] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F] focus:ring-offset-2"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 700ms cubic-bezier(0.16,1,0.3,1) ${
                    Math.min(idx * 50, 500)
                  }ms, transform 700ms cubic-bezier(0.16,1,0.3,1) ${Math.min(
                    idx * 50,
                    500,
                  )}ms`,
                }}
              >
                <img
                  src={foto.src}
                  alt={foto.alt}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Overlay en hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E2126]/90 via-[#1E2126]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Ícono + */}
                <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 shadow-lg">
                  <Plus className="w-4 h-4 text-[#1E2126]" />
                </div>

                {/* Info inferior en hover */}
                <div className="absolute inset-x-0 bottom-0 p-4 text-left translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <span
                    className="inline-block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#FF5A1F] mb-1.5"
                    style={{ fontFamily: FONT_MONO }}
                  >
                    {CATEGORIAS_INFO[foto.categoria].label}
                  </span>
                  <p
                    className="text-white text-xs md:text-sm font-semibold leading-tight line-clamp-2"
                    style={{ fontFamily: FONT_BODY }}
                  >
                    {foto.titulo}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Placeholder vacío */}
        {fotosFiltradas.length === 0 && (
          <div className="text-center py-16 border border-dashed border-[#E3E1D8] rounded-sm">
            <Camera className="w-10 h-10 text-[#E3E1D8] mx-auto mb-3" />
            <p className="text-sm text-[#8B8F86]">
              No hay fotos en esta categoría aún.
            </p>
          </div>
        )}

        {/* ─── VIDEOS ─── */}
        {galeria.videos.length > 0 && (
          <div className="mt-20 pt-14 border-t border-[#E3E1D8]">
            <div className="mb-8">
              <span
                className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#FF5A1F] mb-3"
                style={{ fontFamily: FONT_MONO }}
              >
                <Play className="w-3 h-3 fill-[#FF5A1F]" />
                Videos
              </span>
              <h3
                className="text-3xl md:text-4xl font-bold text-[#1E2126]"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                Recorridos y procesos
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {galeria.videos.map((video) => (
                <div
                  key={video.src}
                  className="relative aspect-video overflow-hidden rounded-sm border border-[#E3E1D8] bg-black"
                >
                  <video
                    src={video.src}
                    poster={video.poster}
                    controls
                    preload="metadata"
                    className="w-full h-full object-cover"
                  >
                    Tu navegador no soporta video HTML5.
                  </video>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <LightboxFotos
          fotos={galeria.fotos}
          indiceActual={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onNavigate={setLightboxIdx}
        />
      )}
    </section>
  );
}