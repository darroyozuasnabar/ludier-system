// components/public/CertificacionesDetalle.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
  Shield,
  Award,
  CheckCircle,
  ExternalLink,
  Calendar,
  Building2,
  FileCheck,
} from "lucide-react";

const FONT_DISPLAY = 'var(--font-display, Oswald, ui-sans-serif, sans-serif)';
const FONT_BODY = 'var(--font-body, Inter, ui-sans-serif, system-ui, sans-serif)';
const FONT_MONO = 'var(--font-mono, "JetBrains Mono", ui-monospace, monospace)';

function CornerMarks({ active = false }: { active?: boolean }) {
  const base = "pointer-events-none absolute h-3 w-3 transition-all duration-500";
  const border = active
    ? "border-[#FF5A1F] opacity-100"
    : "border-[#3A3F45] opacity-50";
  return (
    <>
      <span className={`${base} left-3 top-3 border-l-2 border-t-2 ${border}`} />
      <span className={`${base} right-3 top-3 border-r-2 border-t-2 ${border}`} />
      <span className={`${base} bottom-3 left-3 border-b-2 border-l-2 ${border}`} />
      <span className={`${base} bottom-3 right-3 border-b-2 border-r-2 ${border}`} />
    </>
  );
}

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

export default function CertificacionesDetalle() {
  const { ref, inView } = useScrollReveal<HTMLDivElement>(0.1);

  const normas = [
    { nombre: "ISO 9001:2015", descripcion: "Gestión de Calidad" },
    { nombre: "ISO 14001:2015", descripcion: "Gestión Ambiental" },
    { nombre: "ISO 45001:2018", descripcion: "Seguridad y Salud en el Trabajo" },
    { nombre: "ISO 37001:2016", descripcion: "Gestión Antisoborno" },
    { nombre: "WORLDCOB CSR", descripcion: "Responsabilidad Social Empresarial" },
    { nombre: "WORLDCOB TRUST SEAL", descripcion: "Sello de Confianza Empresarial" },
  ];

  return (
    <section
      id="certificaciones"
      ref={ref}
      className="relative overflow-hidden bg-white border-y border-[#E3E1D8] py-20 lg:py-28"
      style={{ fontFamily: FONT_BODY }}
    >
      {/* Fondo decorativo */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, #1E2126 0px, #1E2126 1px, transparent 1px, transparent 64px)",
        }}
      />

      <div
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(30px)",
          transition:
            "opacity 900ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Encabezado */}
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-medium uppercase tracking-[0.2em] text-[#8B8F86] px-3 py-1 border border-[#E3E1D8]"
            style={{ fontFamily: FONT_MONO }}
          >
            Homologación de Proveedor
          </span>
          <h2
            className="mt-4 text-3xl font-semibold text-[#1E2126] sm:text-4xl"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            Avalado por <span className="text-[#FF5A1F]">Grupo Lar</span>
          </h2>
          <p className="mt-3 text-[#565C63] max-w-2xl mx-auto text-lg">
            LUDIER ha superado un riguroso proceso de Debida Diligencia Reforzada
            y ha sido declarado{" "}
            <span className="text-[#FF5A1F] font-semibold">proveedor apto</span>{" "}
            para proyectos de gran envergadura.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tarjeta principal - Certificado */}
          <div className="lg:col-span-2 group relative bg-[#F7F7F4] border border-[#E3E1D8] rounded-sm p-6 md:p-8 transition-all hover:border-[#FF5A1F]/40 hover:shadow-xl">
            <CornerMarks active />
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm bg-[#FF5A1F]/10 border border-[#FF5A1F]/20">
                  <Shield className="h-7 w-7 text-[#FF5A1F]" />
                </div>
                <div>
                  <h3
                    className="text-xl font-semibold text-[#1E2126]"
                    style={{ fontFamily: FONT_DISPLAY }}
                  >
                    Certificado de Homologación
                  </h3>
                  <p className="text-sm text-[#565C63] mt-1">
                    <strong>Emisor:</strong> Corporación HODELPE S.A.C.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-sm text-[#565C63]">
                <div className="flex items-start gap-2">
                  <Building2 className="h-4 w-4 text-[#FF5A1F] mt-0.5" />
                  <div>
                    <p className="text-xs text-[#8B8F86]">Solicitante</p>
                    <p className="font-medium">Grupo Lar Desarrollos Inmobiliarios S.A.C.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-[#FF5A1F] mt-0.5" />
                  <div>
                    <p className="text-xs text-[#8B8F86]">Resultado</p>
                    <p className="font-medium text-[#FF5A1F] font-bold">APTO</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-[#FF5A1F] mt-0.5" />
                  <div>
                    <p className="text-xs text-[#8B8F86]">Vigencia</p>
                    <p className="font-medium">20/03/2026 – 20/03/2027</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FileCheck className="h-4 w-4 text-[#FF5A1F] mt-0.5" />
                  <div>
                    <p className="text-xs text-[#8B8F86]">Proceso</p>
                    <p className="font-medium">Debida Diligencia Reforzada</p>
                  </div>
                </div>
              </div>

              <div className="mt-2 pt-4 border-t border-[#E3E1D8]">
                <p className="text-sm text-[#565C63] leading-relaxed">
                  Este certificado confirma que LUDIER cumple con los requisitos de homologación
                  establecidos por Grupo Lar Desarrollos Inmobiliarios S.A.C. para ser contratado
                  en sus proyectos de gran envergadura.
                </p>
                <Link
                  href="/img/certificado-hodelpe.pdf"
                  target="_blank"
                  className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-[#FF5A1F] hover:underline group"
                >
                  <ExternalLink className="h-4 w-4 transition-transform group-hover:scale-110" />
                  Ver certificado completo (PDF)
                </Link>
              </div>
            </div>
          </div>

          {/* Tarjeta lateral - Normas ISO */}
          <div className="space-y-3">
            <div className="bg-[#F7F7F4] border border-[#E3E1D8] rounded-sm p-4">
              <p
                className="text-sm font-semibold text-[#1E2126] mb-3 flex items-center gap-2"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                <Award className="h-5 w-5 text-[#FF5A1F]" />
                Normas certificadas por HODELPE
              </p>
              <div className="space-y-2">
                {normas.map((norma, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-sm bg-white/50 border border-[#E3E1D8]/60 hover:border-[#FF5A1F]/20 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4 text-[#FF5A1F] shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-[#1E2126]">{norma.nombre}</p>
                      <p className="text-xs text-[#8B8F86]">{norma.descripcion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#FF5A1F]/5 border border-[#FF5A1F]/20 rounded-sm p-4 text-center">
              <p className="text-xs text-[#565C63]">
                <span className="font-semibold text-[#FF5A1F]">✓</span>{" "}
                Proceso auditado bajo un Sistema de Gestión de Calidad
              </p>
              <p className="text-xs text-[#565C63] mt-1">
                <span className="font-semibold text-[#FF5A1F]">✓</span>{" "}
                Sello de Confianza Empresarial WORLDCOB
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}