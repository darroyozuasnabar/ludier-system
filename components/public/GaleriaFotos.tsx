// components/public/GaleriaFotos.tsx
"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { Camera, Play, ZoomIn, Sparkles } from "lucide-react";
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

// ─────────────────────────────────────────────────────────────────────────────
// Hook: revela el bloque al hacer scroll
// ─────────────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
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
  const totalCategorias = categoriasPresentes.length;

  // Para el masonry: repartimos las fotos en 2 o 3 columnas con alturas variables
  const columnas = 3;
  const columnasArray: typeof fotosFiltradas[] = Array.from(
    { length: columnas },
    () => [],
  );
  fotosFiltradas.forEach((foto, idx) => {
    columnasArray[idx % columnas].push(foto);
  });

  return (
    <section
      ref={ref}
      className="relative bg-[#0F1115] py-20 md:py-28 overflow-hidden"
      style={{ fontFamily: FONT_BODY }}
    >
      {/* Patrón de fondo sutil */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, #FFFFFF 0px, #FFFFFF 1px, transparent 1px, transparent 64px)",
        }}
      />
      {/* Glow naranja */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full opacity-[0.08]"
        style={{
          background: "radial-gradient(circle, #FF5A1F 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* ─── HEADER ─── */}
        <div
          className="mb-12 md:mb-16"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 900ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <span
            className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] text-[#FF5A1F] mb-4"
            style={{ fontFamily: FONT_MONO }}
          >
            <span className="h-px w-6 bg-[#FF5A1F]" />
            Galería de obra
          </span>

          <div className="flex items-end justify-between gap-6 flex-wrap">
            <h2
              className="text-4xl md:text-6xl font-bold text-white leading-[0.95] tracking-tight max-w-2xl"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              Nuestro trabajo
              <br />
              <span className="text-[#FF5A1F]">en imágenes</span>
            </h2>

            {/* Stats grandes */}
            <div className="flex items-center gap-8 md:gap-12">
              <div className="text-right">
                <p
                  className="text-4xl md:text-5xl font-bold text-white leading-none"
                  style={{ fontFamily: FONT_DISPLAY }}
                >
                  {totalFotos}
                </p>
                <p
                  className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-2"
                  style={{ fontFamily: FONT_MONO }}
                >
                  Fotos
                </p>
              </div>
              {totalVideos > 0 && (
                <div className="text-right">
                  <p
                    className="text-4xl md:text-5xl font-bold text-[#FF5A1F] leading-none"
                    style={{ fontFamily: FONT_DISPLAY }}
                  >
                    {totalVideos}
                  </p>
                  <p
                    className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-2"
                    style={{ fontFamily: FONT_MONO }}
                  >
                    Videos
                  </p>
                </div>
              )}
              <div className="text-right">
                <p
                  className="text-4xl md:text-5xl font-bold text-white/40 leading-none"
                  style={{ fontFamily: FONT_DISPLAY }}
                >
                  {totalCategorias}
                </p>
                <p
                  className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-2"
                  style={{ fontFamily: FONT_MONO }}
                >
                  Tipos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── FILTROS ─── */}
        <div
          className="flex flex-wrap gap-2 mb-8 md:mb-12"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition:
              "opacity 900ms cubic-bezier(0.16,1,0.3,1) 100ms, transform 900ms cubic-bezier(0.16,1,0.3,1) 100ms",
          }}
        >
          <button
            onClick={() => setFiltro("todas")}
            className={`group relative px-5 py-2.5 text-xs font-medium uppercase tracking-widest rounded-full border transition-all duration-300 ${
              filtro === "todas"
                ? "bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-lg shadow-[#FF5A1F]/30"
                : "bg-white/5 text-white/60 border-white/10 hover:border-[#FF5A1F]/50 hover:text-white"
            }`}
            style={{ fontFamily: FONT_MONO }}
          >
            Todas · {galeria.fotos.length}
          </button>
          {categoriasPresentes.map((cat) => {
            const info = CATEGORIAS_INFO[cat];
            const count = galeria.fotos.filter((f) => f.categoria === cat).length;
            const activo = filtro === cat;
            return (
              <button
                key={cat}
                onClick={() => setFiltro(cat)}
                className={`group relative px-5 py-2.5 text-xs font-medium uppercase tracking-widest rounded-full border transition-all duration-300 ${
                  activo
                    ? "bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-lg shadow-[#FF5A1F]/30"
                    : "bg-white/5 text-white/60 border-white/10 hover:border-[#FF5A1F]/50 hover:text-white"
                }`}
                style={{ fontFamily: FONT_MONO }}
              >
                {info.label} · {count}
              </button>
            );
          })}
        </div>

        {/* ─── MASONRY GRID ─── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {columnasArray.map((columna, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-3 md:gap-4">
              {columna.map((foto, idx) => {
                const idxOriginal = galeria.fotos.indexOf(foto);
                // Alturas alternadas para efecto masonry
                const altura =
                  (idx + colIdx) % 5 === 0
                    ? "aspect-[3/4]"
                    : (idx + colIdx) % 5 === 1
                      ? "aspect-[4/5]"
                      : (idx + colIdx) % 5 === 2
                        ? "aspect-square"
                        : (idx + colIdx) % 5 === 3
                          ? "aspect-[5/7]"
                          : "aspect-[4/5]";

                return (
                  <button
                    key={foto.src}
                    onClick={() => setLightboxIdx(idxOriginal)}
                    className={`group relative ${altura} overflow-hidden rounded-lg border border-white/5 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]`}
                    style={{
                      opacity: inView ? 1 : 0,
                      transform: inView ? "translateY(0)" : "translateY(40px)",
                      transition: `opacity 900ms cubic-bezier(0.16,1,0.3,1) ${(idx + colIdx) * 60}ms, transform 900ms cubic-bezier(0.16,1,0.3,1) ${(idx + colIdx) * 60}ms`,
                    }}
                  >
                    <img
                      src={foto.src}
                      alt={foto.alt}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                    />

                    {/* Overlay gradiente siempre visible en la parte baja */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Ícono de zoom */}
                    <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <ZoomIn className="w-4 h-4 text-white" />
                    </div>

                    {/* Contenido inferior */}
                    <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                      <span
                        className="inline-block text-[9px] font-medium uppercase tracking-[0.2em] text-[#FF5A1F] mb-2"
                        style={{ fontFamily: FONT_MONO }}
                      >
                        {CATEGORIAS_INFO[foto.categoria].label}
                      </span>
                      <p
                        className="text-white text-sm font-medium leading-tight line-clamp-2 translate-y-1 group-hover:translate-y-0 transition-transform duration-300"
                        style={{ fontFamily: FONT_DISPLAY }}
                      >
                        {foto.titulo}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Placeholder vacío */}
        {fotosFiltradas.length === 0 && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-lg">
            <Camera className="w-12 h-12 text-white/10 mx-auto mb-3" />
            <p className="text-sm text-white/40">
              No hay fotos en esta categoría aún.
            </p>
          </div>
        )}

        {/* ─── VIDEOS ─── */}
        {galeria.videos.length > 0 && (
          <div className="mt-20 pt-16 border-t border-white/10">
            <div className="mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 flex items-center justify-center">
                <Play className="w-4 h-4 text-[#FF5A1F] fill-[#FF5A1F]" />
              </div>
              <h3
                className="text-2xl md:text-3xl font-bold text-white"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                Videos del proyecto
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {galeria.videos.map((video) => (
                <div
                  key={video.src}
                  className="group relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-black"
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
                  {video.titulo && (
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
                      <span
                        className="text-[10px] uppercase tracking-widest text-white/90"
                        style={{ fontFamily: FONT_MONO }}
                      >
                        {video.titulo}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── CTA FINAL ─── */}
        <div
          className="mt-20 pt-16 border-t border-white/10 text-center"
          style={{
            opacity: inView ? 1 : 0,
            transition: "opacity 900ms ease 600ms",
          }}
        >
          <div className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] text-[#FF5A1F] mb-4">
            <Sparkles className="w-3 h-3" />
            Próximo proyecto
          </div>
          <p
            className="text-2xl md:text-3xl font-bold text-white max-w-2xl mx-auto mb-6"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            ¿Tienes una obra que merece este nivel de acabado?
          </p>
          <a
            href="/contacto"
            className="inline-flex items-center gap-2 bg-[#FF5A1F] hover:bg-[#FF7A44] text-white px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-[#FF5A1F]/20 hover:shadow-[#FF5A1F]/40 hover:-translate-y-0.5"
            style={{ fontFamily: FONT_MONO }}
          >
            Cotiza tu proyecto
            <span className="text-lg">→</span>
          </a>
        </div>
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