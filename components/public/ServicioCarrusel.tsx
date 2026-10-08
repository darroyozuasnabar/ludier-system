// components/public/ServicioCarrusel.tsx
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { ETAPAS_INFO, type ServicioGaleria } from "@/lib/proyectos-galeria";

const FONT_DISPLAY = "var(--font-display, Oswald, sans-serif)";
const FONT_BODY = "var(--font-body, Inter, sans-serif)";
const FONT_MONO = 'var(--font-mono, "JetBrains Mono", monospace)';

const ETAPA_COLORS: Record<string, string> = {
  gray: "bg-[#565C63] text-white",
  blue: "bg-blue-600 text-white",
  emerald: "bg-emerald-600 text-white",
  orange: "bg-[#FF5A1F] text-white",
};

type Props = {
  servicio: ServicioGaleria;
  onImagenClick?: (src: string) => void;
};

export default function ServicioCarrusel({ servicio, onImagenClick }: Props) {
  const [idx, setIdx] = useState(0);
  const total = servicio.fotos.length;
  const foto = servicio.fotos[idx];
  const etapaInfo = ETAPAS_INFO[foto.etapa];
  const etapaColor = ETAPA_COLORS[etapaInfo.color] || ETAPA_COLORS.gray;

  const irAnterior = () => setIdx((i) => (i - 1 + total) % total);
  const irSiguiente = () => setIdx((i) => (i + 1) % total);

  return (
    <article
      className="group bg-white border border-[#E3E1D8] rounded-sm overflow-hidden transition-all hover:shadow-xl hover:border-[#FF5A1F]/30 flex flex-col"
      style={{ fontFamily: FONT_BODY }}
    >
      {/* ─── Imagen ─── */}
      <div className="relative aspect-[4/3] bg-[#F0EDE7] overflow-hidden">
        <img
          key={foto.src}
          src={foto.src}
          alt={foto.alt}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Badge etapa */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] rounded-full shadow-lg ${etapaColor}`}
            style={{ fontFamily: FONT_MONO }}
          >
            {etapaInfo.label}
          </span>
        </div>

        {/* Contador */}
        {total > 1 && (
          <div className="absolute top-4 right-4 z-10">
            <span
              className="inline-block px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold rounded-full"
              style={{ fontFamily: FONT_MONO }}
            >
              {idx + 1} / {total}
            </span>
          </div>
        )}

        {/* Zoom hover */}
        <button
          onClick={() => onImagenClick?.(foto.src)}
          className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/25 transition-colors duration-300"
          aria-label="Ver imagen completa"
        >
          <div className="w-12 h-12 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 shadow-xl">
            <ZoomIn className="w-5 h-5 text-[#1E2126]" />
          </div>
        </button>

        {/* Flechas */}
        {total > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                irAnterior();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 hover:bg-[#FF5A1F] hover:text-white border border-[#E3E1D8] flex items-center justify-center text-[#1E2126] transition-all shadow-md"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                irSiguiente();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 hover:bg-[#FF5A1F] hover:text-white border border-[#E3E1D8] flex items-center justify-center text-[#1E2126] transition-all shadow-md"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dots */}
        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
            {servicio.fotos.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === idx ? "w-6 bg-[#FF5A1F]" : "w-1.5 bg-white/70 hover:bg-white"
                }`}
                aria-label={`Ir a imagen ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ─── Contenido ─── */}
      <div className="p-6 flex-1 flex flex-col">
        <h3
          className="text-lg font-semibold text-[#1E2126] leading-tight mb-2"
          style={{ fontFamily: FONT_DISPLAY }}
        >
          {servicio.titulo}
        </h3>
        <p className="text-sm text-[#565C63] leading-relaxed flex-1">
          {servicio.descripcion}
        </p>

        {servicio.tipo === "antes-despues" && total > 1 && (
          <div
            className="mt-4 pt-4 border-t border-[#F0EDE7] flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#8B8F86]"
            style={{ fontFamily: FONT_MONO }}
          >
            <span className="text-[#565C63] font-semibold">Antes</span>
            <span className="h-px flex-1 bg-[#E3E1D8]" />
            <span className="text-emerald-600 font-semibold">Después</span>
          </div>
        )}
      </div>
    </article>
  );
}