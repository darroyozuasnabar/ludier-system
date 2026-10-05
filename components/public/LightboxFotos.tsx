// components/public/LightboxFotos.tsx
"use client";

import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIAS_INFO, type FotoGaleria } from "@/lib/proyectos-galeria";

const FONT_DISPLAY = "var(--font-display, Oswald, sans-serif)";
const FONT_MONO = 'var(--font-mono, "JetBrains Mono", monospace)';

const BADGE_COLORS: Record<string, string> = {
  orange: "bg-[#FF5A1F]/15 text-[#FF5A1F] border-[#FF5A1F]/30",
  blue: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  gray: "bg-white/10 text-white/70 border-white/20",
  emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

type Props = {
  fotos: FotoGaleria[];
  indiceActual: number;
  onClose: () => void;
  onNavigate: (nuevoIndice: number) => void;
};

export default function LightboxFotos({
  fotos,
  indiceActual,
  onClose,
  onNavigate,
}: Props) {
  const foto = fotos[indiceActual];
  const total = fotos.length;

  const irAnterior = useCallback(() => {
    onNavigate((indiceActual - 1 + total) % total);
  }, [indiceActual, total, onNavigate]);

  const irSiguiente = useCallback(() => {
    onNavigate((indiceActual + 1) % total);
  }, [indiceActual, total, onNavigate]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") irAnterior();
      if (e.key === "ArrowRight") irSiguiente();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, irAnterior, irSiguiente]);

  if (!foto) return null;

  const catInfo = CATEGORIAS_INFO[foto.categoria];
  const badgeColor = BADGE_COLORS[catInfo.color] || BADGE_COLORS.gray;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Contador arriba */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-xs tracking-widest"
        style={{ fontFamily: FONT_MONO }}
      >
        {indiceActual + 1} / {total}
      </div>

      {/* Cerrar arriba derecha */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Cerrar"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Flecha izquierda */}
      {total > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            irAnterior();
          }}
          className="absolute left-4 md:left-8 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Imagen */}
      <div
        className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={foto.src}
          alt={foto.alt}
          className="max-w-full max-h-[70vh] object-contain rounded-sm shadow-2xl"
        />

        {/* Info debajo */}
        <div className="mt-6 max-w-2xl text-center px-4">
          <span
            className={`inline-block text-[10px] font-medium uppercase tracking-[0.15em] px-3 py-1 rounded-full border mb-3 ${badgeColor}`}
            style={{ fontFamily: FONT_MONO }}
          >
            {catInfo.label}
          </span>
          <h3
            className="text-xl md:text-2xl font-semibold text-white mb-2"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            {foto.titulo}
          </h3>
          <p className="text-sm text-white/60 leading-relaxed">
            {foto.descripcion}
          </p>
        </div>
      </div>

      {/* Flecha derecha */}
      {total > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            irSiguiente();
          }}
          className="absolute right-4 md:right-8 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}