import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/public/Reveal";
import ServicioCard from "@/components/public/ServicioCard";
import ConstructorasCTA from "@/components/public/ConstructorasCTA";
import { SERVICIOS_CATALOGO } from "@/lib/servicios-catalogo";

/** Colores originales de la portada; tipografía heredada del tema público. */

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
          {SERVICIOS_CATALOGO.map((servicio, index) => (
            <Reveal key={servicio.slug} className="h-full" delay={(index % 3) * 70}>
              <ServicioCard servicio={servicio} />
            </Reveal>
          ))}
        </div>

        <div className="mt-12 lg:mt-16">
          <Reveal><ConstructorasCTA /></Reveal>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/contacto"
            className="ludier-button ludier-button-primary"
          >
            <span>Cotizar ahora</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
