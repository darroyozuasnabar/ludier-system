"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import ConstructorasCTA from "@/components/public/ConstructorasCTA";
import { SERVICIOS_CATALOGO, type ServicioCatalogo } from "@/lib/servicios-catalogo";

/**
 * FUENTES: Oswald (display) + Inter (cuerpo) + JetBrains Mono (códigos técnicos)
 * cargadas en layout.tsx como --font-display / --font-body / --font-mono.
 */

const COLORS = {
  paper: "#F7F7F4",
  card: "#FFFFFF",
  border: "#E3E1D8",
  borderMuted: "#D8D5CB",
  title: "#1E2126",
  text: "#565C63",
  textFaint: "#8B8F86",
  accent: "#FF5A1F",
  accentHover: "#FF7A44",
  accentText: "#B8390F",
  iconIdle: "#3F454C",
};

// Regla de medición decorativa
const RULER_WIDTH = 1200;
const RULER_STEP = 20;
const RULER_MAJOR_EVERY = 5;

const rulerTicks = Array.from(
  { length: RULER_WIDTH / RULER_STEP + 1 },
  (_, i) => {
    const x = i * RULER_STEP;
    const isMajor = i % RULER_MAJOR_EVERY === 0;
    return {
      x,
      isOrigin: i === 0,
      isMajor,
      label: isMajor ? (i / RULER_MAJOR_EVERY) * 10 : null,
    };
  }
);

function RulerStrip() {
  return (
    <div className="relative mb-12 lg:mb-16">
      <div className="mb-2 flex items-center justify-between px-1">
        <span
          className="text-[10px] font-medium uppercase tracking-[0.2em]"
          style={{
            color: COLORS.textFaint,
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
          }}
        >
          Especificaciones técnicas
        </span>
        <span
          className="text-[10px] font-medium uppercase tracking-[0.2em]"
          style={{
            color: COLORS.textFaint,
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
          }}
        >
          Tolerancia&nbsp;±1&nbsp;mm
        </span>
      </div>

      <svg
        viewBox={`0 0 ${RULER_WIDTH} 32`}
        preserveAspectRatio="none"
        className="block h-8 w-full"
        role="presentation"
        aria-hidden="true"
      >
        <line x1={0} y1={26} x2={RULER_WIDTH} y2={26} stroke={COLORS.border} strokeWidth={1} />
        {rulerTicks.map((t) => (
          <g key={t.x}>
            <line
              x1={t.x}
              x2={t.x}
              y1={t.isOrigin ? 4 : t.isMajor ? 10 : 18}
              y2={26}
              stroke={t.isOrigin ? COLORS.accent : t.isMajor ? "#B7B4A8" : COLORS.border}
              strokeWidth={t.isOrigin ? 1.5 : 1}
            />
            {t.label !== null && (
              <text
                x={t.x}
                y={9}
                textAnchor={t.x === 0 ? "start" : t.x === RULER_WIDTH ? "end" : "middle"}
                fontSize={7}
                fill={t.isOrigin ? COLORS.accentText : COLORS.textFaint}
                style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}
              >
                {t.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

function CornerMarks() {
  const base =
    "pointer-events-none absolute h-3 w-3 transition-colors duration-300 group-hover:!border-[color:var(--accent-color)] group-focus-visible:!border-[color:var(--accent-color)]";
  const style = { borderColor: COLORS.borderMuted } as React.CSSProperties;
  return (
    <>
      <span className={`${base} left-3 top-3 border-l-2 border-t-2`} style={style} />
      <span className={`${base} right-3 top-3 border-r-2 border-t-2`} style={style} />
      <span className={`${base} bottom-3 left-3 border-b-2 border-l-2`} style={style} />
      <span className={`${base} bottom-3 right-3 border-b-2 border-r-2`} style={style} />
    </>
  );
}

function ServiceCard({ servicio }: { servicio: ServicioCatalogo }) {
  const Icon = servicio.icon;

  return (
    <article className="flex h-full flex-col">
      <Link
        href={servicio.href}
        className="group relative flex flex-1 flex-col overflow-hidden rounded-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 motion-reduce:transform-none motion-reduce:transition-none"
        style={
          {
            backgroundColor: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            outlineColor: COLORS.accent,
          } as React.CSSProperties
        }
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = COLORS.accent)}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = COLORS.border)}
      >
        <CornerMarks />

        {/* Imagen del servicio */}
        <div
          className="relative h-44 w-full shrink-0"
          style={{ backgroundColor: COLORS.paper, borderBottom: `1px solid ${COLORS.border}` }}
        >
          {servicio.image ? (
            <Image
              src={servicio.image}
              alt={servicio.imageAlt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Icon className="h-10 w-10" style={{ color: COLORS.borderMuted }} />
            </div>
          )}

          {servicio.image && (
            <div
              className="absolute inset-x-0 bottom-0 h-16"
              style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
              }}
              aria-hidden="true"
            />
          )}

          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
            <span
              className="rounded-sm px-2 py-1 text-xs font-medium tracking-wider"
              style={{
                color: servicio.image ? "#FFFFFF" : COLORS.accentText,
                backgroundColor: servicio.image ? "rgba(30,33,38,0.55)" : "transparent",
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              }}
            >
              {servicio.code}
            </span>
            <span
              className="rounded-sm px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em]"
              style={{
                color: servicio.image ? "#FFFFFF" : COLORS.textFaint,
                backgroundColor: servicio.image ? "rgba(30,33,38,0.55)" : "transparent",
              }}
            >
              {servicio.tag}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-start gap-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm"
              style={{ border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.paper }}
            >
              <Icon className="h-4 w-4" style={{ color: COLORS.iconIdle }} />
            </div>
            <h3
              className="pt-1 text-lg font-semibold"
              style={{
                color: COLORS.title,
                fontFamily: "var(--font-display, Oswald, ui-sans-serif, sans-serif)",
              }}
            >
              {servicio.title}
            </h3>
          </div>

          <p className="mb-5 mt-4 text-sm leading-relaxed" style={{ color: COLORS.text }}>
            {servicio.description}
          </p>

          <div
            className="mt-auto flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide"
            style={{ color: COLORS.accentText }}
          >
            <span>{servicio.linkLabel}</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
          style={{ backgroundColor: COLORS.accent }}
        />
      </Link>
      {servicio.relatedLinks.length > 0 && (
        <div className="border-x border-b border-[#E3E1D8] bg-white px-6 py-3">
          {servicio.relatedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#B8390F] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8390F]"
            >
              {link.label}
              <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}

export default function Servicios() {
  return (
    <section
      className="relative overflow-hidden py-20 lg:py-28"
      id="servicios"
      style={{
        backgroundColor: COLORS.paper,
        fontFamily: "var(--font-body, Inter, ui-sans-serif, system-ui, sans-serif)",
      }}
    >
      {/* Trama de fondo */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(30,33,38,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(30,33,38,0.045) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="inline-flex items-center gap-3">
            <span className="h-[2px] w-8" style={{ backgroundColor: COLORS.accent }} aria-hidden="true" />
            <span
              className="text-xs font-medium uppercase tracking-[0.2em]"
              style={{ color: COLORS.text }}
            >
              Nuestros servicios
            </span>
            <span className="h-[2px] w-8" style={{ backgroundColor: COLORS.accent }} aria-hidden="true" />
          </div>

          <h2
            className="mt-6 text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl"
            style={{
              color: COLORS.title,
              fontFamily: "var(--font-display, Oswald, ui-sans-serif, sans-serif)",
            }}
          >
            Fabricación e instalación en{" "}
            <span style={{ color: COLORS.accentText }}>metalmecánica</span>
          </h2>

          <p className="mt-4 text-lg" style={{ color: COLORS.text }}>
            Estructuras, barandas, escaleras, portones y chutes metálicos en Lima.
            Elige tu servicio y revisa cómo podemos atender tu proyecto.
          </p>
        </div>

        <RulerStrip />

        {/* Grid de servicios */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICIOS_CATALOGO.map((servicio) => (
            <ServiceCard key={servicio.slug} servicio={servicio} />
          ))}
        </div>

        <div className="mt-12 lg:mt-16">
          <ConstructorasCTA />
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 rounded-sm px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5"
            style={{ backgroundColor: COLORS.accent }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLORS.accentHover)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = COLORS.accent)}
          >
            <span>Cotizar ahora</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
