"use client";

import { useEffect, useRef, useState } from "react";

const FONT_DISPLAY = 'var(--font-display, Oswald, ui-sans-serif, sans-serif)';
const FONT_BODY = 'var(--font-body, Inter, ui-sans-serif, system-ui, sans-serif)';
const FONT_MONO =
  'var(--font-mono, "JetBrains Mono", ui-monospace, SFMono-Regular, monospace)';

const clientes = [
  { nombre: "Grupo LAR", logo: "/img/grupoLarLogo.png" },
  { nombre: "MDP Construcciones", logo: "/img/MDP_LOGO.png" },
  { nombre: "Flat Canevaro", logo: "/img/flatLogo.png" },
  { nombre: "Grupo Percola", logo: "/img/grupo_pergola_logo.png" },
  { nombre: "Real Edificaciones", logo: "/img/RealEdificaciones.png" },
  { nombre: "CHL", logo: "/img/CHL_Logo.png" },
];

const stats = [
  { value: 40, prefix: "+", suffix: "", label: "Proyectos ejecutados" },
  { value: 6, prefix: "+", suffix: "", label: "Empresas líderes del sector" },
  { value: 100, prefix: "", suffix: "%", label: "Compromiso en cada obra" },
];

function useScrollReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold, rootMargin: "-80px 0px -80px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function useParallax<T extends HTMLElement>(maxOffset = 14) {
  const ref = useRef<T | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const handleMove = (e: MouseEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        setOffset({ x: px * maxOffset, y: py * maxOffset });
        frame = 0;
      });
    };
    const handleLeave = () => setOffset({ x: 0, y: 0 });

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [maxOffset]);

  return { ref, offset };
}

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    let start: number | null = null;
    let raf = 0;

    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return value;
}

function mergeRefs<T>(...refs: Array<React.MutableRefObject<T | null>>) {
  return (node: T | null) => {
    refs.forEach((r) => {
      r.current = node;
    });
  };
}

const filterIdle =
  "grayscale(1) brightness(1.8) opacity(0.5) drop-shadow(0 0 0 rgba(255,90,31,0))";
const filterActive =
  "grayscale(0) brightness(1) opacity(1) drop-shadow(0 0 26px rgba(255,90,31,0.45))";

function StatItem({
  value,
  prefix,
  suffix,
  label,
  active,
  delay,
}: {
  value: number;
  prefix: string;
  suffix: string;
  label: string;
  active: boolean;
  delay: number;
}) {
  const count = useCountUp(value, active);

  return (
    <div
      className="flex flex-col items-center px-6 py-6 sm:items-start sm:px-8 sm:py-0 first:pl-0 last:pr-0"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 700ms ease-out ${delay}ms, transform 700ms ease-out ${delay}ms`,
      }}
    >
      <span
        className="text-3xl font-semibold tabular-nums text-white sm:text-4xl md:text-5xl"
        style={{ fontFamily: FONT_DISPLAY }}
      >
        <span className="text-[#FF5A1F]">{prefix}</span>
        {count}
        <span className="text-[#FF5A1F]">{suffix}</span>
      </span>
      <span
        className="mt-2 text-[10px] uppercase tracking-[0.16em] text-[#8A8F96] sm:text-[11px]"
        style={{ fontFamily: FONT_MONO }}
      >
        {label}
      </span>
    </div>
  );
}

function LogoDesktop({
  cliente,
  index,
  hovered,
  onEnter,
  onLeave,
  inView,
}: {
  cliente: (typeof clientes)[number];
  index: number;
  hovered: number | null;
  onEnter: () => void;
  onLeave: () => void;
  inView: boolean;
}) {
  const isHovered = hovered === index;
  const isDimmed = hovered !== null && !isHovered;

  return (
    <li
      className="flex shrink-0 flex-col items-center outline-none"
      tabIndex={0}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      style={{
        opacity: inView ? (isDimmed ? 0.25 : 1) : 0,
        filter: inView ? "blur(0px)" : "blur(10px)",
        transform: inView
          ? "scale(1) translateY(0)"
          : "scale(0.75) translateY(12px)",
        transition:
          "opacity 500ms ease-out, filter 750ms ease-out, transform 750ms cubic-bezier(0.16,1,0.3,1)",
        transitionDelay: inView ? `${index * 90}ms` : "0ms",
      }}
    >
      <span className="rounded-sm focus-visible:ring-2 focus-visible:ring-[#FF5A1F] focus-visible:ring-offset-4 focus-visible:ring-offset-[#050505]">
        <img
          src={cliente.logo}
          alt={cliente.nombre}
          loading="lazy"
          decoding="async"
          className="h-14 w-auto max-w-[180px] object-contain transition-transform duration-500 ease-out md:h-16 md:max-w-[200px] lg:h-20 lg:max-w-[240px]"
          style={{
            filter: isHovered ? filterActive : filterIdle,
            transform: isHovered ? "translateY(-6px)" : "translateY(0)",
            transitionProperty: "filter, transform",
          }}
        />
      </span>
      <span
        className="mt-4 w-px md:mt-5"
        style={{
          height: 34,
          background: isHovered
            ? "linear-gradient(to bottom, rgba(58,63,69,0.6), #FF5A1F)"
            : "linear-gradient(to bottom, rgba(58,63,69,0.6), rgba(58,63,69,0.6))",
          transition: "background 400ms ease-out",
        }}
      />
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{
          background: isHovered ? "#FF5A1F" : "#4A4F55",
          boxShadow: isHovered ? "0 0 12px 2px rgba(255,90,31,0.6)" : "none",
          transition: "background 300ms ease-out, box-shadow 300ms ease-out",
        }}
      />
    </li>
  );
}

function LogoMobile({
  cliente,
  index,
  hovered,
  onEnter,
  onLeave,
  inView,
}: {
  cliente: (typeof clientes)[number];
  index: number;
  hovered: number | null;
  onEnter: () => void;
  onLeave: () => void;
  inView: boolean;
}) {
  const isHovered = hovered === index;
  const isDimmed = hovered !== null && !isHovered;

  return (
    <li
      className="flex items-center gap-5 outline-none"
      tabIndex={0}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      style={{
        opacity: inView ? (isDimmed ? 0.3 : 1) : 0,
        filter: inView ? "blur(0px)" : "blur(8px)",
        transform: inView ? "translateX(0) scale(1)" : "translateX(-10px) scale(0.85)",
        transition:
          "opacity 500ms ease-out, filter 650ms ease-out, transform 650ms cubic-bezier(0.16,1,0.3,1)",
        transitionDelay: inView ? `${index * 90}ms` : "0ms",
      }}
    >
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{
            background: isHovered ? "#FF5A1F" : "#4A4F55",
            boxShadow: isHovered ? "0 0 12px 2px rgba(255,90,31,0.6)" : "none",
            transition: "background 300ms ease-out, box-shadow 300ms ease-out",
          }}
        />
      </span>
      <span className="rounded-sm focus-visible:ring-2 focus-visible:ring-[#FF5A1F] focus-visible:ring-offset-4 focus-visible:ring-offset-[#050505]">
        <img
          src={cliente.logo}
          alt={cliente.nombre}
          loading="lazy"
          decoding="async"
          className="h-12 w-auto max-w-[160px] object-contain"
          style={{
            filter: isHovered ? filterActive : filterIdle,
            transitionProperty: "filter",
            transitionDuration: "400ms",
          }}
        />
      </span>
    </li>
  );
}

export default function Clientes() {
  const { ref: revealRef, inView } = useScrollReveal<HTMLElement>(0.12);
  const { ref: parallaxRef, offset } = useParallax<HTMLElement>(16);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      ref={mergeRefs(revealRef, parallaxRef)}
      id="clientes"
      aria-label="Clientes de LUDIER"
      className="relative overflow-hidden bg-[#050505] py-20 sm:py-24 lg:py-28"
      style={{ fontFamily: FONT_BODY }}
    >
      {/* Grano / textura industrial */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden="true"
      />

      {/* Wireframe estructural */}
      <svg
        viewBox="0 0 800 800"
        className="pointer-events-none absolute -right-56 -top-40 w-[85%] max-w-[920px] opacity-[0.035]"
        style={{
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
          transition: "transform 400ms ease-out",
        }}
        aria-hidden="true"
      >
        <g stroke="#FFFFFF" strokeWidth="1" fill="none">
          <line x1="0" y1="700" x2="800" y2="700" />
          <line x1="0" y1="500" x2="800" y2="500" />
          <line x1="0" y1="700" x2="100" y2="500" />
          <line x1="100" y1="500" x2="200" y2="700" />
          <line x1="200" y1="700" x2="300" y2="500" />
          <line x1="300" y1="500" x2="400" y2="700" />
          <line x1="400" y1="700" x2="500" y2="500" />
          <line x1="500" y1="500" x2="600" y2="700" />
          <line x1="600" y1="700" x2="700" y2="500" />
          <line x1="700" y1="500" x2="800" y2="700" />
          <line x1="100" y1="500" x2="100" y2="300" />
          <line x1="300" y1="500" x2="300" y2="250" />
          <line x1="500" y1="500" x2="500" y2="280" />
          <line x1="700" y1="500" x2="700" y2="320" />
        </g>
        <g fill="#FF5A1F" opacity="0.5">
          <circle cx="100" cy="500" r="4" />
          <circle cx="300" cy="500" r="4" />
          <circle cx="500" cy="500" r="4" />
          <circle cx="700" cy="500" r="4" />
        </g>
      </svg>

      {/* Luces radiales */}
      <div
        className="pointer-events-none absolute -left-20 -top-24 h-[520px] w-[520px] rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, #FF5A1F 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-10 h-[600px] w-[600px] rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, #FFFFFF 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Eyebrow */}
        <div
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 600ms ease-out, transform 600ms ease-out",
          }}
        >
          <span
            className="inline-flex items-center gap-2.5 text-[10px] uppercase tracking-[0.22em] text-[#8A8F96] sm:text-xs"
            style={{ fontFamily: FONT_MONO }}
          >
            <span className="text-[#FF5A1F]">//</span>
            Clientes que confían en nuestra ingeniería
          </span>
        </div>

        {/* Headline editorial */}
        <h2
          className="mt-6 max-w-4xl text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
          style={{
            fontFamily: FONT_DISPLAY,
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(22px)",
            transition: "opacity 700ms ease-out 80ms, transform 700ms ease-out 80ms",
          }}
        >
          Empresas que construyen
          <br className="hidden sm:block" /> el Perú confían en{" "}
          <span className="text-[#FF5A1F]">LUDIER.</span>
        </h2>

        {/* Subline - TAMAÑO AJUSTADO PARA COINCIDIR CON SERVICIOS */}
        <p
          className="mt-6 max-w-xl text-base leading-relaxed text-[#9AA0A6] md:text-lg"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 700ms ease-out 160ms, transform 700ms ease-out 160ms",
          }}
        >
          Estructuras, coberturas, escaleras y plataformas metálicas para los
          desarrollos inmobiliarios más exigentes del país.
        </p>

        {/* Carrusel de logos con logos GRANDES */}
        <div className="relative mt-16 hidden md:block lg:mt-20">
          <div className="pointer-events-none absolute inset-x-0 bottom-[3px] h-px">
            <div className="absolute inset-0 bg-[#26282C]" />
            <div
              className="absolute inset-0 origin-left bg-[#FF5A1F]"
              style={{
                transform: `scaleX(${inView ? 1 : 0})`,
                transition: "transform 900ms cubic-bezier(0.65,0,0.35,1)",
                boxShadow: "0 0 6px rgba(255,90,31,0.55)",
              }}
            />
            <div
              className="absolute -top-4 h-8 w-[16%]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.9) 45%, rgba(255,90,31,0.95) 62%, transparent)",
                filter: "blur(3px)",
                animation: inView
                  ? "ludier-weld-x 1.05s cubic-bezier(0.65,0,0.35,1) forwards"
                  : "none",
              }}
            />
          </div>

          <ul
            className="relative flex items-end justify-between gap-x-8 px-1 lg:gap-x-16"
            aria-label="Empresas cliente de LUDIER"
          >
            {clientes.map((cliente, index) => (
              <LogoDesktop
                key={cliente.nombre}
                cliente={cliente}
                index={index}
                hovered={hovered}
                onEnter={() => setHovered(index)}
                onLeave={() => setHovered(null)}
                inView={inView}
              />
            ))}
          </ul>
        </div>

        {/* Carrusel móvil - logos GRANDES */}
        <div className="relative mt-12 md:hidden">
          <div className="pointer-events-none absolute bottom-2 left-[15px] top-2 w-px">
            <div className="absolute inset-0 bg-[#26282C]" />
            <div
              className="absolute inset-0 origin-top bg-[#FF5A1F]"
              style={{
                transform: `scaleY(${inView ? 1 : 0})`,
                transition: "transform 900ms cubic-bezier(0.65,0,0.35,1)",
                boxShadow: "0 0 6px rgba(255,90,31,0.55)",
              }}
            />
            <div
              className="absolute -left-4 h-[16%] w-8"
              style={{
                background:
                  "linear-gradient(180deg, transparent, rgba(255,255,255,0.9) 45%, rgba(255,90,31,0.95) 62%, transparent)",
                filter: "blur(3px)",
                animation: inView
                  ? "ludier-weld-y 1.05s cubic-bezier(0.65,0,0.35,1) forwards"
                  : "none",
              }}
            />
          </div>

          <ul className="relative flex flex-col gap-y-9" aria-label="Empresas cliente de LUDIER">
            {clientes.map((cliente, index) => (
              <LogoMobile
                key={cliente.nombre}
                cliente={cliente}
                index={index}
                hovered={hovered}
                onEnter={() => setHovered(index)}
                onLeave={() => setHovered(null)}
                inView={inView}
              />
            ))}
          </ul>
        </div>

        {/* Estadísticas */}
        <div className="mt-16 flex flex-col divide-y divide-[#1E2024] sm:flex-row sm:divide-x sm:divide-y-0 lg:mt-20">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
              label={stat.label}
              active={inView}
              delay={200 + index * 130}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes ludier-weld-x {
          from {
            left: -16%;
            opacity: 1;
          }
          to {
            left: 100%;
            opacity: 0;
          }
        }
        @keyframes ludier-weld-y {
          from {
            top: -16%;
            opacity: 1;
          }
          to {
            top: 100%;
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          section * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}