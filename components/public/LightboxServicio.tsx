// components/public/LightboxServicio.tsx
"use client";

import { useEffect, useCallback, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import {
  ETAPAS_INFO,
  type ServicioGaleria,
} from "@/lib/proyectos-galeria";

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
  const total = servicio.fotos.length;
  const foto = servicio.fotos[idx];
  const etapaInfo = ETAPAS_INFO[foto.etapa];
  const etapaColor = ETAPA_COLORS[etapaInfo.color] || ETAPA_COLORS.gray;

  const irAnterior = useCallback(() => {
    setIdx((i) => (i - 1 + total) % total);
  }, [total]);

  const irSiguiente = useCallback(() => {
    setIdx((i) => (i + 1) % total);
  }, [total]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") irAnterior();
      if (e.key === "ArrowRight") irSiguiente();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    setTimeout(() => setVisible(true), 10);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, irAnterior, irSiguiente]);

  // Reset del índice cuando cambia el servicio
  useEffect(() => {
    setIdx(0);
  }, [servicio.id]);

  if (!foto) return null;

  // CTA hacia /contacto con contexto
  const contactHref = `/contacto?servicio=${encodeURIComponent(
    servicio.titulo,
  )}&proyecto=qantua`;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-[#0F1115]/98 backdrop-blur-md transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0, fontFamily: FONT_BODY }}
      onClick={onClose}
    >
      {/* ─── Barra superior ─── */}
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
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ─── Imagen central ─── */}
      <div
        className="flex-1 relative flex items-center justify-center px-4 md:px-16 py-6 min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Flecha izquierda */}
        {total > 1 && (
          <button
            onClick={irAnterior}
            className="absolute left-3 md:left-6 z-10 w-12 h-12 rounded-full bg-white/5 hover:bg-[#FF5A1F] border border-white/10 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Imagen */}
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

          {/* Badge de etapa sobre la imagen */}
          <div className="absolute top-4 left-4">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] rounded-full shadow-lg ${etapaColor}`}
              style={{ fontFamily: FONT_MONO }}
            >
              {etapaInfo.label}
            </span>
          </div>
        </div>

        {/* Flecha derecha */}
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

      {/* ─── Dots ─── */}
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
                i === idx ? "w-8 bg-[#FF5A1F]" : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Ir a imagen ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* ─── Panel inferior con descripción + CTA ─── */}
      <div
        className="flex-shrink-0 border-t border-white/5 bg-black/40 backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-4xl mx-auto px-6 md:px-8 py-6">
          <div className="grid md:grid-cols-[1fr_auto] gap-6 items-end">
            {/* Texto */}
            <div className="min-w-0">
              <h3
                className="text-xl md:text-2xl font-semibold text-white mb-2 leading-tight"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                {servicio.titulo}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed line-clamp-3">
                {servicio.descripcion}
              </p>
            </div>

            {/* CTA */}
            <a
              href={contactHref}
              className="group/cta inline-flex items-center justify-center gap-2 bg-[#FF5A1F] hover:bg-[#FF7A44] text-white px-6 py-3.5 rounded-full text-sm font-semibold uppercase tracking-wider transition-all duration-300 shadow-lg shadow-[#FF5A1F]/30 hover:shadow-[#FF5A1F]/50 hover:-translate-y-0.5 whitespace-nowrap"
              style={{ fontFamily: FONT_MONO }}
            >
              <MessageCircle className="w-4 h-4" />
              Cotizar algo así
              <ArrowRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-1" />
            </a>
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
}