// components/public/GaleriaFotos.tsx
"use client";

import { useMemo, useState } from "react";
import { Camera, Play, Image as ImageIcon } from "lucide-react";
import {
  CATEGORIAS_INFO,
  getGaleriaProyecto,
  type CategoriaFoto,
} from "@/lib/proyectos-galeria";
import LightboxFotos from "./LightboxFotos";

const FONT_DISPLAY = "var(--font-display, Oswald, sans-serif)";
const FONT_BODY = "var(--font-body, Inter, sans-serif)";
const FONT_MONO = 'var(--font-mono, "JetBrains Mono", monospace)';

const BADGE_COLORS: Record<string, string> = {
  orange: "bg-[#FF5A1F]/15 text-[#FF5A1F] border-[#FF5A1F]/30",
  blue: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  amber: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  gray: "bg-gray-500/15 text-gray-700 border-gray-500/30",
  emerald: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
};

type FiltroCategoria = "todas" | CategoriaFoto;

export default function GaleriaFotos({ slug }: { slug: string }) {
  const galeria = useMemo(() => getGaleriaProyecto(slug), [slug]);
  const [filtro, setFiltro] = useState<FiltroCategoria>("todas");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

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
      className="bg-white p-6 md:p-8 rounded-sm border border-[#E3E1D8] mb-8"
      style={{ fontFamily: FONT_BODY }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2
            className="text-2xl font-semibold text-[#1E2126] flex items-center gap-2"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            <Camera className="w-6 h-6 text-[#FF5A1F]" />
            Galería de obra
          </h2>
          <p className="text-sm text-[#8B8F86] mt-1">
            {totalFotos} {totalFotos === 1 ? "foto" : "fotos"}
            {totalVideos > 0 && ` · ${totalVideos} ${totalVideos === 1 ? "video" : "videos"}`}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFiltro("todas")}
          className={`px-4 py-1.5 text-xs font-medium uppercase tracking-wider rounded-sm border transition-all ${
            filtro === "todas"
              ? "bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-md shadow-[#FF5A1F]/20"
              : "bg-white text-[#565C63] border-[#E3E1D8] hover:border-[#FF5A1F]/40"
          }`}
          style={{ fontFamily: FONT_MONO }}
        >
          Todas ({galeria.fotos.length})
        </button>
        {categoriasPresentes.map((cat) => {
          const info = CATEGORIAS_INFO[cat];
          const count = galeria.fotos.filter((f) => f.categoria === cat).length;
          const activo = filtro === cat;
          return (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              className={`px-4 py-1.5 text-xs font-medium uppercase tracking-wider rounded-sm border transition-all ${
                activo
                  ? "bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-md shadow-[#FF5A1F]/20"
                  : "bg-white text-[#565C63] border-[#E3E1D8] hover:border-[#FF5A1F]/40"
              }`}
              style={{ fontFamily: FONT_MONO }}
            >
              {info.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {fotosFiltradas.map((foto) => {
          const idxOriginal = galeria.fotos.indexOf(foto);
          const catInfo = CATEGORIAS_INFO[foto.categoria];
          const badgeColor = BADGE_COLORS[catInfo.color] || BADGE_COLORS.gray;

          return (
            <button
              key={foto.src}
              onClick={() => setLightboxIdx(idxOriginal)}
              className="group relative aspect-square overflow-hidden rounded-sm border border-[#E3E1D8] bg-[#F7F7F4] focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
            >
              <img
                src={foto.src}
                alt={foto.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <span
                  className={`inline-block text-[9px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full border mb-1.5 bg-white/95 ${badgeColor}`}
                  style={{ fontFamily: FONT_MONO }}
                >
                  {catInfo.label}
                </span>
                <p className="text-white text-xs font-medium line-clamp-2 leading-tight">
                  {foto.titulo}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Sección de videos (oculta si no hay) */}
      {galeria.videos.length > 0 && (
        <div className="mt-10 pt-8 border-t border-[#E3E1D8]">
          <h3
            className="text-xl font-semibold text-[#1E2126] mb-4 flex items-center gap-2"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            <Play className="w-5 h-5 text-[#FF5A1F]" />
            Videos del proyecto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="mt-2 p-3 bg-white">
                  <p className="text-sm font-medium text-[#1E2126]">
                    {video.titulo}
                  </p>
                  <p className="text-xs text-[#8B8F86] mt-0.5">
                    {video.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Placeholder si no hay fotos */}
      {fotosFiltradas.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-10 h-10 text-[#E3E1D8] mx-auto mb-2" />
          <p className="text-sm text-[#8B8F86]">
            No hay fotos en esta categoría aún.
          </p>
        </div>
      )}

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