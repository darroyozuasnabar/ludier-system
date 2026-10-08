// components/public/GaleriaServicios.tsx
"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { Hammer } from "lucide-react";
import { getGaleriaProyecto } from "@/lib/proyectos-galeria";
import ServicioCarrusel from "./ServicioCarrusel";

const FONT_DISPLAY = "var(--font-display, Oswald, sans-serif)";
const FONT_BODY = "var(--font-body, Inter, sans-serif)";
const FONT_MONO = 'var(--font-mono, "JetBrains Mono", monospace)';

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

export default function GaleriaServicios({ slug }: { slug: string }) {
  const galeria = useMemo(() => getGaleriaProyecto(slug), [slug]);
  const { ref, inView } = useInView(0.05);

  if (!galeria || !galeria.servicios || galeria.servicios.length === 0) {
    return null;
  }

  return (
    <section
      ref={ref}
      className="bg-white py-20 md:py-28 border-b border-[#E3E1D8]"
      style={{ fontFamily: FONT_BODY }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
            <Hammer className="w-3 h-3" />
            Proceso constructivo
          </span>

          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1E2126] leading-[1.02] tracking-tight mb-4"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            Cómo transformamos
            <br />
            <span className="text-[#FF5A1F]">cada espacio</span>
          </h2>

          <p className="text-base md:text-lg text-[#565C63] leading-relaxed">
            Recorre cada servicio ejecutado y observa la evolución real del
            trabajo: desde el estado inicial hasta el resultado final en obra.
          </p>
        </div>

        {/* Grid de servicios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galeria.servicios.map((servicio, idx) => (
            <div
              key={servicio.id}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(32px)",
                transition: `opacity 800ms cubic-bezier(0.16,1,0.3,1) ${
                  Math.min(idx * 100, 600)
                }ms, transform 800ms cubic-bezier(0.16,1,0.3,1) ${Math.min(
                  idx * 100,
                  600,
                )}ms`,
              }}
            >
              <ServicioCarrusel servicio={servicio} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}