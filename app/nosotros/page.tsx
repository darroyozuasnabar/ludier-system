"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Target,
  Eye,
  Users,
  Award,
  Clock,
  Shield,
  ArrowRight,
  CheckCircle,
  Building2,
  Wrench,
  HardHat,
  Truck,
  Zap,
  TrendingUp,
  FileCheck,
  PhoneCall,
  Sparkles,
  MapPin,
  Calendar,
  ClipboardCheck,
  Hammer,
} from "lucide-react";

const FONT_DISPLAY = 'var(--font-display, Oswald, ui-sans-serif, sans-serif)';
const FONT_BODY = 'var(--font-body, Inter, ui-sans-serif, system-ui, sans-serif)';
const FONT_MONO = 'var(--font-mono, "JetBrains Mono", ui-monospace, monospace)';

// ============================================================
// DATOS ESTRATÉGICOS PARA CONVERSIÓN
// ============================================================

const STATS = [
  { 
    value: "10+", 
    label: "Años de experiencia", 
    icon: Award,
    description: "En el sector construcción"
  },
  { 
    value: "100%", 
    label: "Proyectos cumplidos", 
    icon: TrendingUp,
    description: "Compromiso garantizado"
  },
  { 
    value: "20+", 
    label: "Proyectos completados", 
    icon: Building2,
    description: "Con 100% de conformidad"
  },
  { 
    value: "95%", 
    label: "Clientes recurrentes", 
    icon: Users,
    description: "Confianza que perdura"
  },
];

const VALORES = [
  { 
    icon: Shield, 
    label: "Calidad de clase mundial",
    desc: "Acabados superiores y materiales certificados que superan los estándares de la industria.",
    color: "orange",
    image: "/img/estructurasMetalicas.png"
  },
  { 
    icon: Clock, 
    label: "Cumplimiento garantizado",
    desc: "Entregas puntuales con un 95% de cumplimiento de plazos, respaldado por planificación rigurosa.",
    color: "blue",
    image: "/img/escaleras-de-emergencia.jpg"
  },
  { 
    icon: HardHat, 
    label: "Seguridad absoluta",
    desc: "Equipos con EPP certificado y protocolos de seguridad que protegen a tu equipo y el nuestro.",
    color: "emerald",
    image: "/img/barandaBalcones.jpg"
  },
  { 
    icon: Users, 
    label: "Compromiso personalizado",
    desc: "Cada proyecto recibe atención directa de nuestros líderes, sin intermediarios ni pérdidas de tiempo.",
    color: "purple",
    image: "/img/portones.jpeg"
  },
];

const LOGROS = [
  { 
    icon: FileCheck, 
    title: "Contratos con grandes constructoras",
    desc: "Hemos sido elegidos por Grupo LAR, MDP Construcciones y más."
  },
  { 
    icon: Truck, 
    title: "Logística propia",
    desc: "Flota y taller propio que garantiza tiempos de entrega sin retrasos externos."
  },
  { 
    icon: Wrench, 
    title: "Equipo certificado",
    desc: "Soldadores certificados y personal técnico con años de experiencia en campo."
  },
  { 
    icon: Zap, 
    title: "Respuesta inmediata",
    desc: "Atención a urgencias en menos de 24 horas para mantener tu obra en movimiento."
  },
];

// 🔥 CLIENTES - PARA MOSTRAR LOGOS EN LA SECCIÓN
const clientes = [
  { nombre: "Grupo LAR", logo: "/img/grupoLarLogo.png" },
  { nombre: "MDP Construcciones", logo: "/img/MDP_LOGO.png" },
  { nombre: "Flat Canevaro", logo: "/img/flatLogo.png" },
  { nombre: "Grupo Percola", logo: "/img/grupo_pergola_logo.png" },
  { nombre: "Real Edificaciones", logo: "/img/RealEdificaciones.png" },
  { nombre: "CHL", logo: "/img/CHL_Logo.png" },
];

// ============================================================
// COMPONENTES
// ============================================================

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
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold, rootMargin: "-60px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function useCountUp(target: number, active: boolean, duration = 1800) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) { setValue(0); return; }
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

// ============================================================
// PÁGINA PRINCIPAL
// ============================================================

export default function NosotrosPage() {
  const { ref: heroRef, inView: heroInView } = useScrollReveal<HTMLDivElement>(0.1);
  const { ref: misionRef, inView: misionInView } = useScrollReveal<HTMLDivElement>(0.1);
  const { ref: statsRef, inView: statsInView } = useScrollReveal<HTMLDivElement>(0.1);
  const { ref: logrosRef, inView: logrosInView } = useScrollReveal<HTMLDivElement>(0.1);
  const { ref: valoresRef, inView: valoresInView } = useScrollReveal<HTMLDivElement>(0.1);
  const { ref: ctaRef, inView: ctaInView } = useScrollReveal<HTMLDivElement>(0.1);

  return (
    <div className="min-h-screen bg-[#F7F7F4]" style={{ fontFamily: FONT_BODY }}>

      {/* ============================================================
          HERO - STATEMENT DE AUTORIDAD
          ============================================================ */}
      <section className="relative overflow-hidden bg-[#14161A] py-28 lg:py-40">
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[url('/img/grid-pattern.svg')] bg-repeat" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, #C7CBD1 0px, #C7CBD1 1px, transparent 1px, transparent 64px)",
          }}
        />
        <div
          className="pointer-events-none absolute -left-32 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle, #FF5A1F 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        <div
          className="absolute top-0 left-0 right-0 h-[4px]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #FF5A1F 0px, #FF5A1F 14px, #14161A 14px, #14161A 28px)",
          }}
        />

        <div
          ref={heroRef}
          className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          style={{
            opacity: heroInView ? 1 : 0,
            transform: heroInView ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 800ms cubic-bezier(0.16,1,0.3,1), transform 800ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <div>
              <span
                className="inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.22em] text-[#8A8F96]"
                style={{ fontFamily: FONT_MONO }}
              >
                <span className="h-px w-6 bg-[#FF5A1F]" />
                Quiénes somos
              </span>
              <h1
                className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                Expertos en
                <br />
                <span className="relative inline-block">
                  <span className="text-[#FF5A1F]">estructuras</span>
                  <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#FF5A1F]/30 rounded-full blur-sm" />
                </span>
                <br />
                desde 2016
              </h1>
              <p className="mt-6 text-lg text-[#9AA0A6] max-w-lg leading-relaxed">
                Somos la elección de las principales constructoras e inmobiliarias del Perú.
                Fabricamos e instalamos estructuras metálicas con precisión certificada.
              </p>

              <div className="mt-8 flex flex-wrap gap-6">
                {[
                  { icon: Shield, label: "Calidad garantizada" },
                  { icon: Clock, label: "Entregas a tiempo" },
                  { icon: CheckCircle, label: "100% conformidad" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-[#FF5A1F]" />
                      <span className="text-xs text-[#8A8F96]">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {STATS.slice(0, 4).map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    className="group relative bg-[#1D2024] border border-[#3A3F45] p-5 rounded-sm transition-all hover:border-[#FF5A1F]/40 hover:-translate-y-1"
                  >
                    <CornerMarks />
                    <Icon className="h-5 w-5 text-[#FF5A1F] mb-2" />
                    <p
                      className="text-2xl font-semibold text-white"
                      style={{ fontFamily: FONT_DISPLAY }}
                    >
                      {stat.value}
                    </p>
                    <p className="text-xs text-[#8A8F96]">{stat.label}</p>
                    {stat.description && (
                      <p className="text-[10px] text-[#6E7379] mt-0.5">{stat.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          MISIÓN + VISIÓN - CON PROPÓSITO CLARO
          ============================================================ */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            ref={misionRef}
            className="grid gap-8 md:grid-cols-2"
            style={{
              opacity: misionInView ? 1 : 0,
              transform: misionInView ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {/* Misión */}
            <div className="group relative bg-white border border-[#E3E1D8] p-8 rounded-sm transition-all hover:border-[#FF5A1F]/30 hover:shadow-xl hover:-translate-y-1">
              <CornerMarks />
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-sm bg-[#FF5A1F]/10 border border-[#FF5A1F]/20">
                <Target className="h-7 w-7 text-[#FF5A1F]" />
              </div>
              <h2
                className="text-2xl font-semibold text-[#1E2126]"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                Nuestra Misión
              </h2>
              <p className="mt-3 text-[#565C63] leading-relaxed text-lg">
                Brindar soluciones metalmecánicas confiables que contribuyan al desarrollo seguro y eficiente de los proyectos de nuestros clientes.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-[#FF5A1F]">
                <span className="h-px w-8 bg-[#FF5A1F]" />
                <span>Más que estructuras, confianza</span>
              </div>
            </div>

            {/* Visión */}
            <div className="group relative bg-white border border-[#E3E1D8] p-8 rounded-sm transition-all hover:border-[#FF5A1F]/30 hover:shadow-xl hover:-translate-y-1">
              <CornerMarks />
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-sm bg-[#FF5A1F]/10 border border-[#FF5A1F]/20">
                <Eye className="h-7 w-7 text-[#FF5A1F]" />
              </div>
              <h2
                className="text-2xl font-semibold text-[#1E2126]"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                Nuestra Visión
              </h2>
              <p className="mt-3 text-[#565C63] leading-relaxed text-lg">
                Consolidarnos como empresa referente en soluciones metalmecánicas para el sector construcción en el Perú.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-[#FF5A1F]">
                <span className="h-px w-8 bg-[#FF5A1F]" />
                <span>El socio técnico que todo constructor elige</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          VALORES - CON PROOF SOCIAL E IMÁGENES DE FONDO
          ============================================================ */}
      <section className="bg-[#14161A] py-20 lg:py-28 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[url('/img/grid-pattern.svg')] bg-repeat" />
        <div
          className="pointer-events-none absolute -right-32 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #FF5A1F 0%, transparent 70%)" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            ref={valoresRef}
            style={{
              opacity: valoresInView ? 1 : 0,
              transform: valoresInView ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div className="text-center mb-14">
              <span
                className="inline-block text-xs font-medium uppercase tracking-[0.2em] text-[#8A8F96] px-3 py-1 border border-[#3A3F45]"
                style={{ fontFamily: FONT_MONO }}
              >
                Lo que nos diferencia
              </span>
              <h2
                className="mt-4 text-4xl font-semibold text-white"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                Valores que <span className="text-[#FF5A1F]">construyen</span> confianza
              </h2>
              <p className="mt-3 text-[#9AA0A6] max-w-2xl mx-auto">
                4 pilares que garantizan la excelencia en cada proyecto que ejecutamos.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {VALORES.map((valor, index) => {
                const Icon = valor.icon;
                return (
                  <div
                    key={index}
                    className="group relative bg-[#1D2024] border border-[#3A3F45] p-6 rounded-sm transition-all hover:border-[#FF5A1F]/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#FF5A1F]/5 overflow-hidden"
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700">
                      <img
                        src={valor.image}
                        alt={valor.label}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-[#1D2024] mix-blend-multiply" />
                    </div>

                    <CornerMarks />
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 relative z-10">
                      <Icon className="h-6 w-6 text-[#FF5A1F]" />
                    </div>
                    <h3
                      className="text-lg font-semibold text-white relative z-10"
                      style={{ fontFamily: FONT_DISPLAY }}
                    >
                      {valor.label}
                    </h3>
                    <p className="mt-2 text-sm text-[#9AA0A6] leading-relaxed relative z-10">
                      {valor.desc}
                    </p>
                    <div className="mt-4 flex items-center gap-2 relative z-10">
                      <CheckCircle className="h-3 w-3 text-[#FF5A1F]" />
                      <span className="text-[10px] text-[#6E7379] uppercase tracking-wider">Compromiso garantizado</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          LOGROS - PRUEBA SOCIAL CON IMAGEN Y LOGOS DE CLIENTES
          ============================================================ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            ref={logrosRef}
            className="grid lg:grid-cols-2 gap-12 items-center"
            style={{
              opacity: logrosInView ? 1 : 0,
              transform: logrosInView ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div>
              <span
                className="inline-block text-xs font-medium uppercase tracking-[0.2em] text-[#8B8F86]"
                style={{ fontFamily: FONT_MONO }}
              >
                Por qué elegir LUDIER
              </span>
              <h2
                className="mt-3 text-3xl font-semibold text-[#1E2126] sm:text-4xl"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                No somos un taller más.
                <br />
                Somos <span className="text-[#FF5A1F]">socios estratégicos</span>.
              </h2>
              <p className="mt-4 text-[#565C63] text-lg">
                Los proyectos más exigentes del país confían en nosotros porque ofrecemos
                algo que pocos pueden garantizar: certeza.
              </p>

              <div className="mt-8 space-y-4">
                {LOGROS.map((logro, i) => {
                  const Icon = logro.icon;
                  return (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-sm border border-[#E3E1D8] bg-[#F7F7F4] hover:border-[#FF5A1F]/30 transition-all">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#FF5A1F]/10">
                        <Icon className="h-5 w-5 text-[#FF5A1F]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#1E2126]">{logro.title}</h4>
                        <p className="text-sm text-[#565C63]">{logro.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 🔥 LOGOS DE CLIENTES - PRUEBA SOCIAL DIRECTA */}
              <div className="mt-8 pt-6 border-t border-[#E3E1D8]">
                <p className="text-xs text-[#8B8F86] uppercase tracking-wider mb-4">Empresas que confían en nosotros</p>
                <div className="flex flex-wrap items-center gap-6">
                  {clientes.map((cliente, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <img
                        src={cliente.logo}
                        alt={cliente.nombre}
                        className="h-8 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Imagen de credibilidad - CORREGIDA */}
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-[#E3E1D8] bg-[#14161A]">
                <img
                  src="/img/Qantua1_foto1.jpg"
                  alt="Proyecto Qantua - Estructuras metálicas LUDIER"
                  className="w-full h-full object-cover"
                />
                
                {/* 🔥 Sello de calidad - AHORA VISIBLE */}
                <div className="absolute -right-2 -top-2 bg-[#FF5A1F] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-2 rotate-12 shadow-lg z-20">
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Confiable
                  </span>
                </div>

                {/* 🔥 Overlay de proyecto - AHORA CON FONDO OSCURO PARA LEGIBILIDAD */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10">
                  <p className="text-sm font-semibold text-white">Proyecto Qantua - Fase 2</p>
                  <p className="text-xs text-white/80">Grupo LAR · Estructuras metálicas</p>
                </div>
              </div>

              {/* 🔥 Clientes flotantes - REPOSICIONADOS PARA NO TAPAR */}
              <div className="absolute -bottom-4 -left-4 bg-white border border-[#E3E1D8] rounded-sm shadow-xl p-3 flex items-center gap-3 z-20">
                <div className="flex -space-x-2">
                  {clientes.slice(0, 4).map((cliente, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full bg-[#1D2024] border-2 border-white flex items-center justify-center overflow-hidden"
                    >
                      <img
                        src={cliente.logo}
                        alt={cliente.nombre}
                        className="h-5 w-5 object-contain"
                      />
                    </div>
                  ))}
                  <div className="h-8 w-8 rounded-full bg-[#FF5A1F] border-2 border-white flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white">+6</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1E2126]">+20 clientes</p>
                  <p className="text-[10px] text-[#8B8F86]">confían en nosotros</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA FINAL - CONVERSIÓN DIRECTA
          ============================================================ */}
      <section className="relative overflow-hidden bg-[#14161A] py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[url('/img/grid-pattern.svg')] bg-repeat" />
        <div
          className="pointer-events-none absolute -left-32 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #FF5A1F 0%, transparent 70%)" }}
        />

        <div
          ref={ctaRef}
          className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8"
          style={{
            opacity: ctaInView ? 1 : 0,
            transform: ctaInView ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <span
            className="inline-block text-xs font-medium uppercase tracking-[0.2em] text-[#8A8F96] px-3 py-1 border border-[#3A3F45]"
            style={{ fontFamily: FONT_MONO }}
          >
            Tu próximo proyecto
          </span>
          <h2
            className="mt-5 text-4xl font-semibold text-white sm:text-5xl"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            ¿Listo para construir con
            <br />
            <span className="text-[#FF5A1F]">un socio confiable?</span>
          </h2>
          <p className="mt-4 text-lg text-[#9AA0A6] max-w-2xl mx-auto">
            Cotiza tu proyecto ahora y recibe una respuesta en menos de 24 horas.
            No solo te damos un presupuesto, te ofrecemos certeza.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contacto"
              className="group inline-flex items-center gap-2 bg-[#FF5A1F] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#FF5A1F]/20 transition-all hover:bg-[#FF7A44] hover:shadow-[#FF5A1F]/40 hover:-translate-y-1"
            >
              <PhoneCall className="h-4 w-4" />
              Cotizar ahora
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/proyectos"
              className="group inline-flex items-center gap-2 border border-[#3A3F45] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-[#C7CBD1] transition-all hover:border-[#FF5A1F] hover:text-white"
            >
              Ver proyectos
            </Link>
          </div>

          <div className="mt-8 flex justify-center gap-6 text-xs text-[#6E7379]">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Respuesta en 24h
            </span>
            <span className="text-[#3A3F45]">|</span>
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Cotización sin compromiso
            </span>
            <span className="text-[#3A3F45]">|</span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Asesoría personalizada
            </span>
          </div>
        </div>
      </section>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          section * {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}