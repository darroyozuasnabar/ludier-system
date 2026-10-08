// components/public/ServicioCarrusel.tsx
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { ETAPAS_INFO, type ServicioGaleria } from "@/lib/proyectos-galeria";
import LightboxServicio from "./LightboxServicio";

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
  indiceServicio: number;
  totalServicios: number;
};

export default function ServicioCarrusel({
  servicio,
  indiceServicio,
  totalServicios,
}: Props) {
  const [idx, setIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const total = servicio.fotos.length;
  const foto = servicio.fotos[idx];
  const etapaInfo = ETAPAS_INFO[foto.etapa];
  const etapaColor = ETAPA_COLORS[etapaInfo.color] || ETAPA_COLORS.gray;

  const irAnterior = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((i) => (i - 1 + total) % total);
  };

  const irSiguiente = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((i) => (i + 1) % total);
  };

  return (
    <>
      <article
        className="group bg-white border border-[#E3E1D8] rounded-sm overflow-hidden transition-all hover:shadow-xl hover:border-[#FF5A1F]/30 hover:-translate-y-1 flex flex-col cursor-pointer"
        style={{ fontFamily: FONT_BODY }}
        onClick={() => setLightboxOpen(true)}
      >
        {/* Imagen */}
        <div className="relative aspect-[4/3] bg-[#F0EDE7] overflow-hidden">
          <img
            key={foto.src}
            src={foto.src}
            alt={foto.alt}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />

          <div className="absolute top-4 left-4 z-10">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] rounded-full shadow-lg ${etapaColor}`}
              style={{ fontFamily: FONT_MONO }}
            >
              {etapaInfo.label}
            </span>
          </div>

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

          <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex items-center gap-2 px-5 py-3 bg-white/95 backdrop-blur-sm rounded-full shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300">
              <Maximize2 className="w-4 h-4 text-[#1E2126]" />
              <span
                className="text-[#1E2126] text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                style={{ fontFamily: FONT_MONO }}
              >
                Click para ampliar
              </span>
            </div>
          </div>

          {total > 1 && (
            <>
              <button
                onClick={irAnterior}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/95 hover:bg-[#FF5A1F] hover:text-white border border-[#E3E1D8] flex items-center justify-center text-[#1E2126] transition-all shadow-md opacity-0 group-hover:opacity-100"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={irSiguiente}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/95 hover:bg-[#FF5A1F] hover:text-white border border-[#E3E1D8] flex items-center justify-center text-[#1E2126] transition-all shadow-md opacity-0 group-hover:opacity-100"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {total > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
              {servicio.fotos.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIdx(i);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === idx
                      ? "w-6 bg-[#FF5A1F]"
                      : "w-1.5 bg-white/70 hover:bg-white"
                  }`}
                  aria-label={`Ir a imagen ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-6 flex-1 flex flex-col">
          <h3
            className="text-lg font-semibold text-[#1E2126] leading-tight mb-2 group-hover:text-[#FF5A1F] transition-colors"
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

      {/* Lightbox */}
      {lightboxOpen && (
        <LightboxServicio
          servicio={servicio}
          indiceServicio={indiceServicio}
          totalServicios={totalServicios}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}