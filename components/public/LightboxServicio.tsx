// components/public/LightboxServicio.tsx
"use client";

import { useEffect, useCallback, useState, useRef, useId } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { ETAPAS_INFO, type ServicioGaleria } from "@/lib/proyectos-galeria";
import { trackEvent } from "@/lib/analytics";

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
  onClose: () => void;
};

export default function LightboxServicio({
  servicio,
  indiceServicio,
  totalServicios,
  onClose,
}: Props) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  // FIX MOBILE F2B: referencias estables para foco y nombre único del diálogo.
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const total = servicio.fotos.length;
  const foto = servicio.fotos[idx];
  const etapaInfo = ETAPAS_INFO[foto.etapa];
  const etapaColor = ETAPA_COLORS[etapaInfo.color] || ETAPA_COLORS.gray;

  // Montar el portal solo en cliente (evita errores SSR)
  useEffect(() => {
    setMounted(true);
  }, []);

  const irAnterior = useCallback(() => {
    setIdx((i) => (i - 1 + total) % total);
  }, [total]);

  const irSiguiente = useCallback(() => {
    setIdx((i) => (i + 1) % total);
  }, [total]);

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
  const isOpen = mounted && !!foto;
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

  useEffect(() => {
    setIdx(0);
  }, [servicio.id]);

  if (!mounted || !foto) return null;

  const contactHref = `/contacto?servicio=${encodeURIComponent(
    servicio.titulo,
  )}&proyecto=qantua`;

  const content = (
    <div
      // FIX MOBILE F2B: semántica y foco del diálogo.
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[9999] flex flex-col bg-[#0F1115]/98 backdrop-blur-md transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0, fontFamily: FONT_BODY }}
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FF5A1F] whitespace-nowrap"
            style={{ fontFamily: FONT_MONO }}
          >
            Servicio {indiceServicio + 1} de {totalServicios}
          </span>
          <span className="h-1 w-1 rounded-full bg-white/20 hidden sm:block" />
          <span
            className="text-[10px] uppercase tracking-[0.2em] text-white/50 truncate hidden sm:block"
            style={{ fontFamily: FONT_MONO }}
          >
            {servicio.titulo}
          </span>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          {total > 1 && (
            <span
              className="text-white/60 text-[10px] font-semibold tracking-widest"
              style={{ fontFamily: FONT_MONO }}
            >
              <span className="text-white">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="mx-1.5">/</span>
              <span>{String(total).padStart(2, "0")}</span>
            </span>
          )}
          <button
            onClick={onClose}
            // FIX MOBILE F2B: cierre con nombre accesible y área mínima de 44px.
            ref={closeRef}
            className="w-9 h-9 min-h-11 min-w-11 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-colors"
            aria-label="Cerrar galería"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        className="flex-1 relative flex items-center justify-center px-4 md:px-16 py-6 min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        {total > 1 && (
          <button
            onClick={irAnterior}
            className="absolute left-3 md:left-6 z-10 w-12 h-12 rounded-full bg-white/5 hover:bg-[#FF5A1F] border border-white/10 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <div className="relative max-w-full max-h-full">
          <img
            key={foto.src}
            src={foto.src}
            alt={foto.alt}
            className="max-w-full max-h-[65vh] md:max-h-[70vh] object-contain rounded-sm shadow-2xl"
            style={{
              animation: visible ? "fadeInImg 400ms ease-out" : "none",
            }}
          />

          <div className="absolute top-4 left-4">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] rounded-full shadow-lg ${etapaColor}`}
              style={{ fontFamily: FONT_MONO }}
            >
              {etapaInfo.label}
            </span>
          </div>
        </div>

        {total > 1 && (
          <button
            onClick={irSiguiente}
            className="absolute right-3 md:right-6 z-10 w-12 h-12 rounded-full bg-white/5 hover:bg-[#FF5A1F] border border-white/10 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {total > 1 && (
        <div
          className="flex justify-center gap-2 py-3"
          onClick={(e) => e.stopPropagation()}
        >
          {servicio.fotos.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === idx
                  ? "w-8 bg-[#FF5A1F]"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Ir a imagen ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* ─── Panel inferior ─── */}
      <div
        className="flex-shrink-0 bg-[#14161A]/95 backdrop-blur-md border-t border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Bloque izquierdo: info del servicio */}
            <div className="flex-1 min-w-0 max-w-2xl">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span
                  className="inline-flex items-center px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FF5A1F] bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 rounded-full"
                  style={{ fontFamily: FONT_MONO }}
                >
                  Servicio {indiceServicio + 1} de {totalServicios}
                </span>
              </div>

              <h3
                id={titleId}
                className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                {servicio.titulo}
              </h3>

              <p className="text-sm md:text-base text-white/70 leading-relaxed">
                {servicio.descripcion}
              </p>
            </div>

            <div className="flex-shrink-0 flex flex-col items-stretch md:items-end gap-3">
              <a
                href={contactHref}
                onClick={() => {
                  trackEvent("cta_cotizar_click", {
                    servicio: servicio.titulo,
                    ubicacion: "lightbox_servicio",
                  });
                }}
                className="group/cta inline-flex items-center justify-center gap-2 bg-[#FF5A1F] hover:bg-[#FF7A44] text-white px-7 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-[#FF5A1F]/30 hover:shadow-[#FF5A1F]/60 hover:-translate-y-0.5 whitespace-nowrap"
                style={{ fontFamily: FONT_MONO }}
              >
                <MessageCircle className="w-4 h-4" />
                Cotizar algo así
                <ArrowRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-1" />
              </a>
              <p
                className="text-[10px] uppercase tracking-widest text-white/40 text-center md:text-right"
                style={{ fontFamily: FONT_MONO }}
              >
                Respuesta en menos de 24h
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInImg {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );

  return createPortal(content, document.body);
}
