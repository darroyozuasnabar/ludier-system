// components/public/CertificacionBadge.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Shield, ArrowRight, Award, Sparkles } from "lucide-react";

const FONT_DISPLAY = 'var(--font-display, Oswald, ui-sans-serif, sans-serif)';
const FONT_BODY = 'var(--font-body, Inter, ui-sans-serif, system-ui, sans-serif)';
const FONT_MONO = 'var(--font-mono, "JetBrains Mono", ui-monospace, monospace)';

function useScrollReveal<T extends HTMLElement>(threshold = 0.12) {
  const ref = useRef<T | null>(null);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasBeenVisible) {
          setHasBeenVisible(true);
        }
      },
      { threshold, rootMargin: "-60px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, hasBeenVisible]);

  return { ref, inView: hasBeenVisible };
}

export default function CertificacionBadge() {
  const { ref, inView } = useScrollReveal<HTMLDivElement>(0.1);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-16 bg-gradient-to-br from-[#F7F7F4] to-white border-y-2 border-[#FF5A1F]/10"
      style={{ fontFamily: FONT_BODY }}
    >
      {/* Fondo decorativo */}
      <div className="absolute inset-0 opacity-[0.04] bg-[url('/img/grid-pattern.svg')] bg-repeat" />
      <div className="absolute -right-32 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-[#FF5A1F]/5 blur-3xl" />
      
      <div
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(30px)",
          transition:
            "opacity 800ms cubic-bezier(0.16,1,0.3,1), transform 800ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8 p-8 bg-white rounded-xl border border-[#E3E1D8] shadow-lg hover:shadow-xl transition-shadow duration-300">
          {/* Lado izquierdo: ícono + texto + sello APTO */}
          <div className="flex items-center gap-6">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF5A1F]/10 to-[#FF7A44]/10 border-2 border-[#FF5A1F]/20">
              <Shield className="h-10 w-10 text-[#FF5A1F]" />
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#FF5A1F] border-2 border-white">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3
                  className="text-xl font-semibold text-[#1E2126]"
                  style={{ fontFamily: FONT_DISPLAY }}
                >
                  Homologado por <span className="text-[#FF5A1F]">Grupo Lar</span>
                </h3>
                {/* 🔥 Sello APTO - AHORA MÁS GRANDE */}
                <div className="relative h-14 w-14 shrink-0">
                  <Image
                    src="/img/selloApto.jpg"
                    alt="APTO"
                    fill
                    className="object-contain"
                    sizes="56px"
                  />
                </div>
              </div>
              <p className="mt-1 text-sm text-[#565C63] max-w-xl">
                LUDIER ha superado un riguroso proceso de Debida Diligencia Reforzada,
                cumpliendo con los más altos estándares de confiabilidad y gestión.
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-[#8B8F86]">
                <span className="flex items-center gap-1">
                  <Award className="h-3.5 w-3.5 text-[#FF5A1F]" />
                  ISO 9001 • 14001 • 45001 • 37001
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-3 w-3 text-[#FF5A1F]">✓</span>
                  Vigencia: 2026-2027
                </span>
              </div>
            </div>
          </div>

          {/* Botón "Ver certificado" */}
          <Link
            href="/nosotros#certificaciones"
            className="group inline-flex shrink-0 items-center gap-2 bg-[#FF5A1F] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#FF5A1F]/20 transition-all hover:bg-[#FF7A44] hover:shadow-[#FF5A1F]/40 hover:-translate-y-1 rounded-lg"
          >
            <span>Ver certificado</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}