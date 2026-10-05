// components/public/LightboxFotos.tsx
"use client";

import { useEffect, useCallback, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIAS_INFO, type FotoGaleria } from "@/lib/proyectos-galeria";

const FONT_DISPLAY = "var(--font-display, Oswald, sans-serif)";
const FONT_MONO = 'var(--font-mono, "JetBrains Mono", monospace)';

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
  const [visible, setVisible] = useState(false);

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
    // Animación de entrada
    setTimeout(() => setVisible(true), 10);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, irAnterior, irSiguiente]);

  if (!foto) return null;

  const catInfo = CATEGORIAS_INFO[foto.categoria];

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/97 backdrop-blur-xl transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0 }}
      onClick={onClose}
    >
      {/* ─── BARRA SUPERIOR ─── */}
      <div className="flex items-center justify-between px-6 py-5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span
            className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#FF5A1F]"
            style={{ fontFamily: FONT_MONO }}
          >
            {catInfo.label}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div
            className="text-white/50 text-xs tracking-widest"
            style={{ fontFamily: FONT_MONO }}
          >
            <span className="text-white font-medium">
              {String(indiceActual + 1).padStart(2, "0")}
            </span>
            <span className="mx-2">/</span>
            <span>{String(total).padStart(2, "0")}</span>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ─── IMAGEN CENTRAL ─── */}
      <div className="flex-1 relative flex items-center justify-center px-4 md:px-20 py-4 min-h-0">
        {/* Flecha izquierda */}
        {total > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              irAnterior();
            }}
            className="absolute left-3 md:left-6 z-10 w-12 h-12 rounded-full bg-white/5 hover:bg-[#FF5A1F] border border-white/10 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Imagen */}
        <img
          src={foto.src}
          alt={foto.alt}
          onClick={(e) => e.stopPropagation()}
          className="max-w-full max-h-full object-contain rounded-sm shadow-2xl"
        />

        {/* Flecha derecha */}
        {total > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              irSiguiente();
            }}
            className="absolute right-3 md:right-6 z-10 w-12 h-12 rounded-full bg-white/5 hover:bg-[#FF5A1F] border border-white/10 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* ─── INFO INFERIOR ─── */}
      <div
        className="flex-shrink-0 px-6 md:px-20 py-8 border-t border-white/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-3xl mx-auto">
          <h3
            className="text-xl md:text-2xl font-semibold text-white mb-2 leading-tight"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            {foto.titulo}
          </h3>
          <p className="text-sm text-white/50 leading-relaxed line-clamp-2">
            {foto.descripcion}
          </p>
        </div>
      </div>
    </div>
  );
}