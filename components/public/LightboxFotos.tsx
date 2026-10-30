// components/public/LightboxFotos.tsx
"use client";

import { useEffect, useCallback, useState, useRef, useId } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIAS_INFO, type FotoGaleria } from "@/lib/proyectos-galeria";
import { trackEvent } from "@/lib/analytics";

const FONT_DISPLAY = "var(--font-display, Oswald, sans-serif)";
const FONT_BODY = "var(--font-body, Inter, sans-serif)";
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
  // FIX MOBILE F2B: referencias estables para foco y nombre único del diálogo.
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const irAnterior = useCallback(() => {
    onNavigate((indiceActual - 1 + total) % total);
  }, [indiceActual, total, onNavigate]);

  const irSiguiente = useCallback(() => {
    onNavigate((indiceActual + 1) % total);
  }, [indiceActual, total, onNavigate]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // FIX MOBILE F2B: Escape y ciclo de Tab dentro del diálogo.
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
      if (e.key === "Tab") {
        const items = dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex="0"]',
        );
        if (items?.length) {
          const first = items[0];
          const last = items[items.length - 1];
          const outside = !dialogRef.current?.contains(document.activeElement);
          if (e.shiftKey && (document.activeElement === first || outside)) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && (document.activeElement === last || outside)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
      if (e.key === "ArrowLeft") irAnterior();
      if (e.key === "ArrowRight") irSiguiente();
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose, irAnterior, irSiguiente]);

  // FIX MOBILE F2B: capturar/restaurar foco y scroll solo al abrir/cerrar, no al navegar.
  const isOpen = !!foto;
  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    const timer = setTimeout(() => setVisible(true), 10);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [isOpen]);

  // 📊 Google Analytics — Tracking de vista de foto
  useEffect(() => {
    if (!foto) return;
    trackEvent("foto_view", {
      foto_titulo: foto.titulo,
      categoria: foto.categoria,
    });
  }, [foto]);

  if (!foto) return null;

  const catInfo = CATEGORIAS_INFO[foto.categoria];

  return (
    <div
      // FIX MOBILE F2B: semántica y foco del diálogo.
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[100] flex flex-col bg-[#F7F7F4] transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
      onClick={onClose}
    >
      {/* Barra superior */}
      <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-[#E3E1D8] bg-white/80 backdrop-blur-md flex-shrink-0">
        <div className="flex items-center gap-3">
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FF5A1F]"
            style={{ fontFamily: FONT_MONO }}
          >
            {catInfo.label}
          </span>
          <span className="h-1 w-1 rounded-full bg-[#E3E1D8]" />
          <span
            className="text-[10px] uppercase tracking-[0.2em] text-[#8B8F86]"
            style={{ fontFamily: FONT_MONO }}
          >
            {indiceActual + 1} / {total}
          </span>
        </div>
        <button
          onClick={onClose}
          // FIX MOBILE F2B: cierre con nombre accesible y área mínima de 44px.
          ref={closeRef}
          className="w-9 h-9 min-h-11 min-w-11 rounded-full hover:bg-[#1E2126] hover:text-white text-[#1E2126] flex items-center justify-center transition-colors"
          aria-label="Cerrar imagen"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Imagen */}
      <div className="flex-1 relative flex items-center justify-center px-4 md:px-16 py-6 min-h-0">
        {total > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              irAnterior();
            }}
            className="absolute left-3 md:left-6 z-10 w-11 h-11 rounded-full bg-white border border-[#E3E1D8] hover:bg-[#1E2126] hover:text-white hover:border-[#1E2126] text-[#1E2126] flex items-center justify-center transition-all shadow-md"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <img
          src={foto.src}
          alt={foto.alt}
          onClick={(e) => e.stopPropagation()}
          className="max-w-full max-h-full object-contain rounded-sm shadow-xl"
        />

        {total > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              irSiguiente();
            }}
            className="absolute right-3 md:right-6 z-10 w-11 h-11 rounded-full bg-white border border-[#E3E1D8] hover:bg-[#1E2126] hover:text-white hover:border-[#1E2126] text-[#1E2126] flex items-center justify-center transition-all shadow-md"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Info inferior */}
      <div
        className="flex-shrink-0 px-6 md:px-8 py-5 border-t border-[#E3E1D8] bg-white/80 backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-3xl mx-auto">
          <h3
            id={titleId}
            className="text-lg md:text-xl font-semibold text-[#1E2126] mb-1.5"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            {foto.titulo}
          </h3>
          <p
            className="text-sm text-[#565C63] leading-relaxed line-clamp-2"
            style={{ fontFamily: FONT_BODY }}
          >
            {foto.descripcion}
          </p>
        </div>
      </div>
    </div>
  );
}
