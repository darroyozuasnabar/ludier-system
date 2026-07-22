"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  HardHat,
  Wrench,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MessageCircle,
} from "lucide-react";

// 🧾 "Ficha técnica"
const specs = [
  { label: "Proyectos ejecutados", value: "20+" },
  { label: "Años en el rubro", value: "10+" },
  { label: "Satisfacción de clientes", value: "95%" },
];

const trustPoints = [
  { icon: ShieldCheck, label: "Garantía por escrito en cada obra" },
  { icon: HardHat, label: "Equipo técnico especializado" },
  { icon: Wrench, label: "Seguimiento durante toda la instalación" },
];

const mediaItems = [
  {
    type: "image" as const,
    src: "/img/Qantua1_foto1.jpg",
    alt: "Estructura metálica ejecutada en obra",
    project: "LUDIER",
    caption: "Estructuras metálicas de alta calidad ejecutadas en obra",
  },
  {
    type: "image" as const,
    src: "/img/Qantua1_foto2.jpg",
    alt: "Detalle de acabado en estructura metálica",
    project: "LUDIER",
    caption: "Detalle de acabado e instalación en obra",
  },
  {
    type: "video" as const,
    src: "/img/Soldando.MOV",
    poster: undefined,
    project: "LUDIER",
    caption: "Nuestro equipo soldando en obra",
  },
];

function CornerMarks({ active = false }: { active?: boolean }) {
  const base = "pointer-events-none absolute h-4 w-4 transition-colors duration-300";
  const color = active ? "border-[#FF5A1F]" : "border-[#FF5A1F]/0";
  return (
    <>
      <span className={`${base} left-3 top-3 border-l-2 border-t-2 ${color}`} />
      <span className={`${base} right-3 top-3 border-r-2 border-t-2 ${color}`} />
      <span className={`${base} bottom-3 left-3 border-b-2 border-l-2 ${color}`} />
      <span className={`${base} bottom-3 right-3 border-b-2 border-r-2 ${color}`} />
    </>
  );
}

function TrussBackdrop() {
  return (
    <svg
      className="pointer-events-none absolute -left-20 bottom-0 hidden h-[420px] w-[640px] opacity-[0.14] lg:block"
      viewBox="0 0 640 420"
      fill="none"
      aria-hidden="true"
    >
      <path
        className="truss-path"
        pathLength={300}
        d="M0,420 L0,140 L120,40 L240,140 L240,420 M0,140 L240,140 M120,40 L120,420 M240,140 L360,40 L480,140 L480,420 M240,140 L480,140 M360,40 L360,420 M480,140 L600,60 M480,140 L600,220"
        stroke="#FF5A1F"
        strokeWidth="2"
      />
    </svg>
  );
}

function ApprovalStamp() {
  return (
    <div className="stamp-badge pointer-events-none absolute -left-8 -top-8 z-10 hidden h-32 w-32 items-center justify-center border-[3px] border-double border-[#FF5A1F] bg-[#1D2024] sm:flex">
      <div className="flex flex-col items-center gap-2 px-2 text-center">
        <img
          src="/img/logo-ludier.png"
          alt="LUDIER"
          className="h-10 w-10 object-contain"
        />
        <span
          className="text-[10px] font-semibold uppercase leading-tight tracking-[0.06em] text-[#C7CBD1]"
          style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', ui-monospace, monospace)" }}
        >
          Calidad
          <br />
          Garantizada
        </span>
      </div>
    </div>
  );
}

function useCountUp(target: string, durationMs = 1400) {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const match = target.match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (!match || prefersReduced) {
      setDisplay(target);
      return;
    }

    const end = parseFloat(match[1]);
    const suffix = match[2];
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(`${Math.floor(eased * end)}${suffix}`);
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setDisplay(target);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return display;
}

function SpecRow({ label, value }: { label: string; value: string }) {
  const display = useCountUp(value);
  return (
    <div className="flex items-baseline gap-3 py-2.5">
      <span className="shrink-0 text-[11px] uppercase tracking-[0.1em] text-[#9AA0A6]">
        {label}
      </span>
      <span className="mb-1 flex-1 border-b border-dotted border-[#3A3F45]" aria-hidden="true" />
      <span
        className="shrink-0 text-lg font-medium text-white"
        style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', ui-monospace, monospace)" }}
      >
        {display}
      </span>
    </div>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, []);
  return reduced;
}

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const totalItems = mediaItems.length;
  const currentMedia = mediaItems[currentIndex];

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex((index + totalItems) % totalItems);
      setIsPlaying(false);
      videoRef.current?.pause();
    },
    [totalItems]
  );

  const nextSlide = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const prevSlide = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  useEffect(() => {
    if (isHovering || currentMedia.type === "video" || prefersReducedMotion) return;
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalItems);
    }, 5000);
    return () => clearInterval(id);
  }, [isHovering, currentMedia.type, totalItems, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;
    const handleMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      section.style.setProperty("--mx", `${x}%`);
      section.style.setProperty("--my", `${y}%`);
    };
    section.addEventListener("mousemove", handleMove);
    return () => section.removeEventListener("mousemove", handleMove);
  }, [prefersReducedMotion]);

  const handlePlayVideo = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const laminaActual = String(currentIndex + 1).padStart(2, "0");
  const laminaTotal = String(totalItems).padStart(2, "0");

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] items-center overflow-hidden bg-[#14161A] py-8 md:py-12"
      style={{
        fontFamily: "var(--font-body, Inter, ui-sans-serif, system-ui, sans-serif)",
        "--mx": "34%",
        "--my": "38%",
      } as React.CSSProperties}
    >
      <style>{`
        .truss-path {
          stroke-dasharray: 300;
          stroke-dashoffset: 0;
        }
        @media (prefers-reduced-motion: no-preference) {
          .truss-path {
            stroke-dashoffset: 300;
            animation: truss-draw 2.4s ease-out forwards;
            animation-delay: .15s;
          }
        }
        @keyframes truss-draw {
          to { stroke-dashoffset: 0; }
        }

        .stamp-badge { transform: rotate(-8deg) scale(1); opacity: 1; }
        @media (prefers-reduced-motion: no-preference) {
          .stamp-badge {
            animation: stamp-in .6s cubic-bezier(.34,1.56,.64,1) both;
            animation-delay: .35s;
          }
        }
        @keyframes stamp-in {
          0% { transform: rotate(-30deg) scale(1.7); opacity: 0; }
          60% { transform: rotate(-5deg) scale(0.92); opacity: 1; }
          100% { transform: rotate(-8deg) scale(1); opacity: 1; }
        }

        .media-fade { opacity: 1; }
        @media (prefers-reduced-motion: no-preference) {
          .media-fade { animation: media-fade-in .55s ease-out; }
        }
        @keyframes media-fade-in {
          from { opacity: 0; transform: scale(1.015); }
          to { opacity: 1; transform: scale(1); }
        }

        .cta-shine { position: relative; overflow: hidden; }
        @media (prefers-reduced-motion: no-preference) {
          .cta-shine::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(115deg, transparent 30%, rgba(255,255,255,.32) 50%, transparent 70%);
            transform: translateX(-120%);
            transition: transform .7s ease;
          }
          .cta-shine:hover::after { transform: translateX(120%); }
        }

        @media (prefers-reduced-motion: no-preference) {
          .scroll-cue-icon { animation: scroll-bounce 1.7s ease-in-out infinite; }
        }
        @keyframes scroll-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }

        /* ─── RESPONSIVE: móviles pequeños ─── */
        @media (max-width: 480px) {
          .hero-title { font-size: 2.25rem; }
          .hero-subtitle { font-size: 0.9rem; }
          .cta-btn { padding: 0.75rem 1.5rem; font-size: 0.75rem; }
          .spec-row { padding: 0.5rem 0; }
          .spec-row span:first-child { font-size: 0.6rem; }
          .spec-row span:last-child { font-size: 0.9rem; }
        }
      `}</style>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, #C7CBD1 0px, #C7CBD1 1px, transparent 1px, transparent 64px)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08] transition-[background] duration-300"
        style={{
          background:
            "radial-gradient(300px circle at var(--mx) var(--my), #FF5A1F 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <TrussBackdrop />
      <div
        className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-[#3A3F45] lg:block"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-20">
          {/* Columna izquierda: texto */}
          <div className="space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2.5 border border-[#3A3F45] bg-[#1D2024] px-3 py-1.5">
              <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF5A1F] opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#FF5A1F]" />
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#C7CBD1] sm:text-xs">
                Líder en soluciones metalmecánicas · Lima, Perú
              </span>
            </div>

            <h1
              className="hero-title text-3xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-[3.4rem]"
              style={{ fontFamily: "var(--font-display, Oswald, ui-sans-serif, sans-serif)" }}
            >
              Construimos <span className="text-[#FF5A1F]">estructuras</span>
              <br className="hidden sm:block" />
              que transforman espacios
            </h1>

            <p className="hero-subtitle max-w-lg text-base leading-relaxed text-[#9AA0A6] sm:text-lg">
              Fabricación e instalación de soluciones metalmecánicas de alta
              calidad para proyectos residenciales, comerciales e
              industriales en Perú.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/contacto"
                className="cta-shine group inline-flex items-center gap-2 bg-[#FF5A1F] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#FF5A1F]/20 transition-all hover:bg-[#FF7A44] sm:px-8 sm:py-4"
              >
                Cotizar ahora
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/proyectos"
                className="inline-flex items-center gap-2 border border-[#3A3F45] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-[#C7CBD1] transition-all hover:border-[#FF5A1F] hover:text-white sm:px-8 sm:py-4"
              >
                Ver proyectos
              </Link>
            </div>

            <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-[#6E7379] sm:text-xs">
              <span className="h-1 w-1 rounded-full bg-[#FF5A1F]" aria-hidden="true" />
              Cotización sin costo · Respuesta en menos de 24 horas
            </p>

            <div className="divide-y divide-[#22262B] border-y border-[#3A3F45]">
              {specs.map((spec) => (
                <SpecRow key={spec.label} label={spec.label} value={spec.value} />
              ))}
            </div>

            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {trustPoints.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-start gap-2 text-xs text-[#9AA0A6] sm:flex-col sm:gap-2">
                  <Icon className="h-4 w-4 shrink-0 text-[#FF5A1F]" strokeWidth={1.75} />
                  <span className="leading-snug">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna derecha: vitrina multimedia */}
          <div
            className="relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="relative overflow-hidden border border-[#3A3F45] bg-[#1D2024] shadow-2xl shadow-black/40">
              <div className="relative aspect-[4/3]">
                <CornerMarks active />

                <span
                  className="absolute bottom-3 right-3 z-10 border border-[#3A3F45] bg-[#14161A]/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#C7CBD1] backdrop-blur-sm"
                  style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', ui-monospace, monospace)" }}
                >
                  [{currentMedia.type === "video" ? "Vídeo" : "Foto"}]
                </span>

                <div key={currentIndex} className="media-fade h-full w-full">
                  {currentMedia.type === "image" ? (
                    <img
                      src={currentMedia.src}
                      alt={currentMedia.alt}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="relative h-full w-full bg-black">
                      <video
                        ref={videoRef}
                        src={currentMedia.src}
                        poster={currentMedia.poster}
                        className="h-full w-full object-cover"
                        onEnded={() => setIsPlaying(false)}
                        playsInline
                      />
                      {!isPlaying && (
                        <button
                          onClick={handlePlayVideo}
                          aria-label="Reproducir video"
                          className="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors hover:bg-black/50"
                        >
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FF5A1F] shadow-xl transition-transform hover:scale-105 sm:h-16 sm:w-16">
                            <Play className="ml-0.5 h-6 w-6 text-white sm:h-7 sm:w-7" />
                          </div>
                        </button>
                      )}
                      {isPlaying && (
                        <button
                          onClick={handlePlayVideo}
                          aria-label="Pausar video"
                          className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 transition-colors hover:bg-black/90 sm:h-10 sm:w-10"
                        >
                          <Pause className="h-3 w-3 text-white sm:h-4 sm:w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div
                className="grid grid-cols-[1fr_auto_auto] divide-x divide-[#3A3F45] border-t border-[#3A3F45] bg-[#14161A]/95"
                style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', ui-monospace, monospace)" }}
              >
                <div className="px-3 py-2 sm:px-4 sm:py-3">
                  <p
                    className="truncate text-xs font-medium text-white sm:text-sm"
                    style={{ fontFamily: "var(--font-body, Inter, ui-sans-serif, system-ui, sans-serif)" }}
                  >
                    {currentMedia.caption}
                  </p>
                  <p className="mt-0.5 text-[8px] uppercase tracking-[0.14em] text-[#8A8F96] sm:text-[10px]">
                    Ejecución · {currentMedia.project}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center px-3 py-2 sm:px-4 sm:py-3">
                  <p className="text-[8px] uppercase tracking-[0.14em] text-[#6E7379] sm:text-[9px]">Escala</p>
                  <p className="text-[10px] text-[#C7CBD1] sm:text-xs">S/E</p>
                </div>
                <div className="flex flex-col items-center justify-center px-3 py-2 sm:px-4 sm:py-3">
                  <p className="text-[8px] uppercase tracking-[0.14em] text-[#6E7379] sm:text-[9px]">Lámina</p>
                  <p className="text-[10px] text-[#C7CBD1] sm:text-xs">
                    {laminaActual}/{laminaTotal}
                  </p>
                </div>
              </div>
            </div>

            <ApprovalStamp />

            <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 border border-[#3A3F45] bg-[#1D2024] px-3 py-2 shadow-lg sm:gap-3 sm:px-4 sm:py-2.5">
              <button
                onClick={prevSlide}
                className="rounded-full p-1 text-[#9AA0A6] transition-colors hover:bg-[#22262B] hover:text-white sm:p-1.5"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {mediaItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goTo(index)}
                    className={`h-1 rounded-full transition-all ${
                      index === currentIndex
                        ? "w-4 bg-[#FF5A1F] sm:w-6"
                        : "w-1 bg-[#3A3F45] hover:bg-[#6E7379]"
                    }`}
                    aria-label={`Ir a slide ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="rounded-full p-1 text-[#9AA0A6] transition-colors hover:bg-[#22262B] hover:text-white sm:p-1.5"
                aria-label="Siguiente"
              >
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>

            {/* WhatsApp flotante - Desktop */}
            <a
              href="https://wa.me/51930747399?text=Hola%20LUDIER%2C%20quiero%20cotizar%20un%20proyecto"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute -right-2 -top-2 hidden items-center gap-2 rounded-full bg-[#25D366] px-3 py-2 text-[10px] font-semibold text-[#0B1A0F] shadow-lg transition-transform hover:scale-105 sm:flex sm:px-4 sm:py-2.5 sm:text-xs"
            >
              <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              Escríbenos
            </a>

            {/* WhatsApp fijo para móviles */}
            <a
              href="https://wa.me/51930747399?text=Hola%20LUDIER%2C%20quiero%20cotizar%20un%20proyecto"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-xs font-semibold text-[#0B1A0F] shadow-lg transition-transform hover:scale-105 sm:hidden"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Indicador de scroll */}
        <div className="pointer-events-none absolute inset-x-0 bottom-4 hidden justify-center lg:flex">
          <div className="flex flex-col items-center gap-1.5 text-[#6E7379]">
            <span className="text-[10px] uppercase tracking-[0.16em]">Desliza para conocer más</span>
            <ChevronDown className="scroll-cue-icon h-4 w-4" />
          </div>
        </div>
      </div>
    </section>
  );
}