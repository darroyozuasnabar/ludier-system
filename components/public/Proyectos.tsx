"use client";

import Link from "next/link";
import { Building2, ArrowRight, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * FUENTES
 * Igual que el resto del sitio: Oswald + JetBrains Mono + Inter
 */

const proyectosDestacados = [
  {
    id: "qantua",
    nombre: "Qantua - Fase 1 y 2",
    cliente: "Grupo LAR",
    ubicacion: "Cercado de Lima",
    descripcion:
      "Fabricación e instalación de barandas metálicas, pasamanos, estructuras de azotea, vigas comerciales y chute metálico para proyecto residencial multifamiliar de gran escala.",
    tags: ["Barandas", "Estructuras", "Chute Metálico"],
    imagen: "/img/Qantua.jpg",
  },
  {
    id: "zendai",
    nombre: "Zendai",
    cliente: "Grupo LAR",
    ubicacion: "La Victoria, Lima",
    descripcion:
      "Fabricación e instalación de barandas metálicas para fachada frontal, lateral izquierda y derecha, incluyendo parantes estructurales.",
    tags: ["Barandas", "Fachadas", "Estructuras"],
    imagen: "/img/zendai.jpg",
  },
  {
    id: "hilton",
    nombre: "Hilton MDP",
    cliente: "MDP CONSTRUCCIONES S.A.C.",
    ubicacion: "Chacarilla, Surco",
    descripcion:
      "Fabricación e instalación de chute metálico de 19 pisos para el proyecto Hilton MDP en Chacarilla, Surco.",
    tags: ["Chute Metálico", "Estructuras"],
    imagen: "/img/hilton-lima-miraflores.jpg",
  },
];

function CornerMarks({ active = false }: { active?: boolean }) {
  const base =
    "pointer-events-none absolute h-3 w-3 transition-colors duration-300";
  const color = active ? "border-[#FF5A1F]" : "border-[#3A3F45]";
  return (
    <>
      <span className={`${base} left-3 top-3 border-l-2 border-t-2 ${color}`} />
      <span className={`${base} right-3 top-3 border-r-2 border-t-2 ${color}`} />
      <span className={`${base} bottom-3 left-3 border-b-2 border-l-2 ${color}`} />
      <span className={`${base} bottom-3 right-3 border-b-2 border-r-2 ${color}`} />
    </>
  );
}

/**
 * Hook simple para disparar animaciones cuando el elemento entra en viewport
 */
function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export default function Proyectos() {
  const { ref: sectionRef, inView } = useInView<HTMLDivElement>(0.1);

  return (
    <section
      className="relative overflow-hidden bg-[#14161A] py-20 lg:py-28"
      id="proyectos"
      style={{
        fontFamily:
          "var(--font-body, Inter, ui-sans-serif, system-ui, sans-serif)",
      }}
      ref={sectionRef}
    >
      {/* Franja decorativa superior — se "desliza" como placa metálica al entrar */}
      <div
        className="h-[4px] w-full origin-left transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #FF5A1F 0px, #FF5A1F 14px, #14161A 14px, #14161A 28px)",
          transform: inView ? "scaleX(1)" : "scaleX(0)",
        }}
        aria-hidden="true"
      />

      {/* Destello que recorre la franja al aparecer */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-[4px] w-40 bg-gradient-to-r from-transparent via-white/70 to-transparent transition-transform duration-[1400ms] ease-out"
        style={{
          transform: inView ? "translateX(calc(100vw + 10rem))" : "translateX(-10rem)",
          transitionDelay: "150ms",
        }}
        aria-hidden="true"
      />

      {/* Textura de fondo */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, #C7CBD1 0px, #C7CBD1 1px, transparent 1px, transparent 64px)",
        }}
        aria-hidden="true"
      />

      {/* Resplandor sutil */}
      <div
        className="pointer-events-none absolute -right-32 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full opacity-[0.04] transition-opacity duration-[1600ms]"
        style={{
          background: "radial-gradient(circle, #FF5A1F 0%, transparent 70%)",
          opacity: inView ? 0.06 : 0,
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className="mx-auto mb-16 max-w-3xl text-center lg:mb-20 transition-all duration-700 ease-out"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <div className="inline-flex items-center gap-2.5 border border-[#3A3F45] bg-[#1D2024] px-3.5 py-1.5">
            <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF5A1F] opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#FF5A1F]" />
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-[#C7CBD1]">
              Portafolio
            </span>
          </div>

          <h2
            className="mt-6 text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl"
            style={{
              fontFamily: "var(--font-display, Oswald, ui-sans-serif, sans-serif)",
            }}
          >
            Proyectos que nos <span className="text-[#FF5A1F]">respaldan</span>
          </h2>

          <p className="mt-4 text-lg text-[#9AA0A6]">
            Conoce algunos de los proyectos más importantes que hemos ejecutado
            con los más altos estándares de calidad y seguridad.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {proyectosDestacados.map((proyecto, index) => (
            <div
              key={proyecto.id}
              className="group relative flex flex-col overflow-hidden rounded-sm border border-[#3A3F45] bg-[#1D2024] transition-all duration-300 hover:border-[#FF5A1F] hover:shadow-lg hover:shadow-[#FF5A1F]/5"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0) scale(1)" : "translateY(40px) scale(0.98)",
                transition: "opacity 700ms ease-out, transform 700ms ease-out, border-color 300ms, box-shadow 300ms",
                transitionDelay: inView ? `${200 + index * 150}ms` : "0ms",
              }}
            >
              <CornerMarks />

              {/* Imagen */}
              <div className="relative h-52 w-full overflow-hidden bg-[#14161A]">
                {proyecto.imagen ? (
                  <img
                    src={proyecto.imagen}
                    alt={proyecto.nombre}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#14161A]">
                    <Building2 className="h-12 w-12 text-[#3A3F45]" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#14161A]/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              {/* Contenido */}
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h3
                    className="text-lg font-semibold text-white"
                    style={{
                      fontFamily: "var(--font-display, Oswald, ui-sans-serif, sans-serif)",
                    }}
                  >
                    {proyecto.nombre}
                  </h3>
                </div>

                <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8A8F96]">
                  <span>{proyecto.cliente}</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {proyecto.ubicacion}
                  </span>
                </div>

                <p className="mb-4 flex-1 text-sm leading-relaxed text-[#9AA0A6] line-clamp-3">
                  {proyecto.descripcion}
                </p>

                <div className="mb-4 flex flex-wrap gap-2">
                  {proyecto.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-[#3A3F45] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.06em] text-[#8A8F96] transition-colors duration-200 group-hover:border-[#FF5A1F]/30 group-hover:text-[#C7CBD1]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/proyectos/${proyecto.id}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-[#FF5A1F] transition-colors hover:text-[#FF7A44] group/link"
                >
                  Ver más
                  <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="mt-14 text-center transition-all duration-700 ease-out"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(16px)",
            transitionDelay: inView ? "700ms" : "0ms",
          }}
        >
          <Link
            href="/proyectos"
            className="group relative inline-flex items-center gap-2 border border-[#3A3F45] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-[#C7CBD1] transition-all hover:border-[#FF5A1F] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A1F]"
          >
            <span className="relative z-10">Ver todos los proyectos</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </Link>
        </div>
      </div>
    </section>
  );
}