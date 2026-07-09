"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  HardHat,
  Wrench,
  Building2,
  Shield,
  Gauge,
  DoorOpen,
  CheckCircle,
  Clock,
  PhoneCall,
  Award,
  Users,
  TrendingUp,
  Zap,
  Truck,
  FileCheck,
} from "lucide-react";

const FONT_DISPLAY = 'var(--font-display, Oswald, ui-sans-serif, sans-serif)';
const FONT_BODY = 'var(--font-body, Inter, ui-sans-serif, system-ui, sans-serif)';
const FONT_MONO = 'var(--font-mono, "JetBrains Mono", ui-monospace, monospace)';

// ============================================================
// DATOS DE CATEGORÍAS DE SERVICIOS (6 LÍNEAS DE NEGOCIO)
// ============================================================

const categorias = [
  {
    slug: "estructuras-metalicas",
    icon: Building2,
    title: "Estructuras Metálicas",
    description:
      "Diseñamos, fabricamos e instalamos estructuras metálicas para proyectos residenciales, comerciales e industriales.",
    subServicios: [
      "Estructuras para azotea",
      "Coberturas metálicas",
      "Techos metálicos",
      "Marquesinas",
      "Plataformas metálicas",
      "Soportes metálicos",
      "Vigas metálicas",
      "Estructuras especiales",
      "Estructuras para paneles solares",
      "Cuartos metálicos para equipos",
      "Jaulas metálicas",
    ],
    image: "/img/estructurasMetalicas.png",
    tag: "11 servicios",
  },
  {
    slug: "barandas-pasamanos",
    icon: Shield,
    title: "Barandas y Pasamanos",
    description:
      "Fabricación e instalación de sistemas de protección y circulación metálica para edificios, condominios, centros comerciales e industrias.",
    subServicios: [
      "Barandas metálicas",
      "Barandas para balcones",
      "Barandas de escaleras",
      "Barandas de azotea",
      "Barandas de seguridad",
      "Pasamanos metálicos",
      "Pasamanos para escaleras de emergencia",
      "Pasamanos adosados a muro",
    ],
    image: "/img/barandaBalcones.jpg",
    tag: "8 servicios",
  },
  {
    slug: "escaleras-metalicas",
    icon: Gauge,
    title: "Escaleras Metálicas",
    description:
      "Fabricamos soluciones metálicas para acceso, circulación y evacuación, adaptadas a cada proyecto y normativa.",
    subServicios: [
      "Escaleras metálicas",
      "Escaleras de emergencia",
      "Escaleras marineras",
      "Escaleras industriales",
      "Plataformas con escaleras",
      "Accesos técnicos",
    ],
    image: "/img/escaleras-de-emergencia.jpg",
    tag: "6 servicios",
  },
  {
    slug: "puertas-portones",
    icon: DoorOpen,
    title: "Puertas, Portones y Cerramientos",
    description:
      "Desarrollamos soluciones de seguridad y control de accesos para edificaciones y proyectos de infraestructura.",
    subServicios: [
      "Portones metálicos",
      "Puertas metálicas",
      "Puertas cortafuego",
      "Cercos metálicos",
      "Cerramientos industriales",
      "Protección perimetral",
      "Mallas de seguridad",
    ],
    image: "/img/portones.jpeg",
    tag: "7 servicios",
  },
  {
    slug: "constructoras",
    icon: HardHat,
    title: "Soluciones para Constructoras",
    description:
      "Especialistas en fabricación e instalación de soluciones metalmecánicas para obras de construcción vertical.",
    subServicios: [
      "Chutes metálicos",
      "Cerramientos temporales",
      "Barandas provisionales",
      "Protecciones para obra",
      "Adecuaciones metálicas",
      "Modificaciones en obra",
      "Montajes especiales",
      "Refuerzos estructurales",
    ],
    image: "/img/cercosPerimetricos.jpg",
    tag: "8 servicios",
  },
  {
    slug: "fabricacion-medida",
    icon: Wrench,
    title: "Fabricación a Medida",
    description:
      "Desarrollamos soluciones metálicas personalizadas de acuerdo con planos, especificaciones técnicas y requerimientos del cliente.",
    subServicios: [
      "Rejillas metálicas",
      "Sumideros metálicos",
      "Tapas metálicas",
      "Bastidores",
      "Racks",
      "Soportes especiales",
      "Elementos metálicos personalizados",
      "Fabricación según planos",
    ],
    image: "/img/soldaduraPersonalizada.jpg",
    tag: "8 servicios",
  },
];

// ============================================================
// DATOS ESTRATÉGICOS
// ============================================================

const STATS = [
  { value: "10+", label: "Años de experiencia", icon: Award },
  { value: "40+", label: "Proyectos ejecutados", icon: Building2 },
  { value: "95%", label: "Cumplimiento de plazos", icon: Clock },
  { value: "100%", label: "Compromiso garantizado", icon: CheckCircle },
];

const beneficios = [
  {
    icon: ShieldCheck,
    title: "Calidad certificada",
    desc: "Materiales de primera calidad y acabados superiores en cada proyecto.",
  },
  {
    icon: Clock,
    title: "Entregas puntuales",
    desc: "Cumplimos los plazos establecidos con planificación rigurosa.",
  },
  {
    icon: HardHat,
    title: "Seguridad garantizada",
    desc: "Equipos con EPP certificado y protocolos de seguridad en obra.",
  },
  {
    icon: Users,
    title: "Atención personalizada",
    desc: "Cada proyecto recibe atención directa de nuestros líderes.",
  },
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

function CategoriaCard({ categoria, index }: { categoria: typeof categorias[0]; index: number }) {
  const Icon = categoria.icon;
  const { ref, inView } = useScrollReveal<HTMLDivElement>(0.1);

  return (
    <Link
      href={`/servicios/${categoria.slug}`}
      ref={ref}
      className="group relative block bg-white border border-[#E3E1D8] rounded-sm overflow-hidden transition-all hover:border-[#FF5A1F]/40 hover:shadow-xl hover:-translate-y-2"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 700ms cubic-bezier(0.16,1,0.3,1) ${index * 100}ms, transform 700ms cubic-bezier(0.16,1,0.3,1) ${index * 100}ms`,
      }}
    >
      <CornerMarks />

      {/* Imagen de fondo */}
      <div className="relative h-48 overflow-hidden bg-[#14161A]">
        <img
          src={categoria.image}
          alt={categoria.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span
            className="text-[10px] font-medium text-white bg-black/50 px-2 py-1 rounded-sm"
            style={{ fontFamily: FONT_MONO }}
          >
            {categoria.tag}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#FF5A1F]/10 border border-[#FF5A1F]/20">
            <Icon className="h-5 w-5 text-[#FF5A1F]" />
          </div>
          <h3
            className="text-lg font-semibold text-[#1E2126]"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            {categoria.title}
          </h3>
        </div>

        <p className="text-sm text-[#565C63] leading-relaxed mb-4 line-clamp-2">
          {categoria.description}
        </p>

        <div className="flex items-center gap-1 text-sm font-medium text-[#FF5A1F]">
          <span>Ver todos los servicios</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>

      {/* Línea inferior animada */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5A1F] scale-x-0 transition-transform duration-500 origin-left group-hover:scale-x-100" />
    </Link>
  );
}

// ============================================================
// PÁGINA PRINCIPAL
// ============================================================

export default function ServiciosPage() {
  const { ref: heroRef, inView: heroInView } = useScrollReveal<HTMLDivElement>(0.1);
  const { ref: ctaRef, inView: ctaInView } = useScrollReveal<HTMLDivElement>(0.1);

  return (
    <div className="min-h-screen bg-[#F7F7F4]" style={{ fontFamily: FONT_BODY }}>

      {/* ============================================================
          HERO
          ============================================================ */}
      <section className="relative overflow-hidden bg-[#14161A] py-28 lg:py-36">
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
          <div className="max-w-3xl">
            <span
              className="inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.22em] text-[#8A8F96]"
              style={{ fontFamily: FONT_MONO }}
            >
              <span className="h-px w-6 bg-[#FF5A1F]" />
              Nuestros servicios
            </span>
            <h1
              className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              Soluciones integrales
              <br />
              en{" "}
              <span className="relative inline-block">
                <span className="text-[#FF5A1F]">metalmecánica</span>
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#FF5A1F]/30 rounded-full blur-sm" />
              </span>
            </h1>
            <p className="mt-6 text-lg text-[#9AA0A6] max-w-xl leading-relaxed">
              Explora nuestras 6 líneas de negocio. Desde estructuras metálicas
              hasta fabricación a medida, tenemos la solución para tu proyecto.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 bg-[#FF5A1F] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#FF5A1F]/20 transition-all hover:bg-[#FF7A44] hover:shadow-[#FF5A1F]/40 hover:-translate-y-1"
              >
                <PhoneCall className="h-4 w-4" />
                Cotizar ahora
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-xs text-[#8A8F96]">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-[#FF5A1F]" />
                Más de 10 años de experiencia
              </span>
              <span className="text-[#3A3F45]">|</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-[#FF5A1F]" />
                40+ proyectos ejecutados
              </span>
              <span className="text-[#3A3F45]">|</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-[#FF5A1F]" />
                95% cumplimiento de plazos
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          ESTADÍSTICAS DE CONFIANZA
          ============================================================ */}
      <section className="py-12 bg-white border-b border-[#E3E1D8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center p-4 text-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[#FF5A1F]/10 border border-[#FF5A1F]/20">
                    <Icon className="h-6 w-6 text-[#FF5A1F]" />
                  </div>
                  <p
                    className="mt-3 text-2xl font-semibold text-[#1E2126]"
                    style={{ fontFamily: FONT_DISPLAY }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-sm text-[#565C63]">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          GRID DE CATEGORÍAS
          ============================================================ */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span
              className="inline-block text-xs font-medium uppercase tracking-[0.2em] text-[#8B8F86] px-3 py-1 border border-[#E3E1D8]"
              style={{ fontFamily: FONT_MONO }}
            >
              Nuestras líneas de negocio
            </span>
            <h2
              className="mt-4 text-3xl font-semibold text-[#1E2126] sm:text-4xl"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              Todo lo que necesitas en{" "}
              <span className="text-[#FF5A1F]">metalmecánica</span>
            </h2>
            <p className="mt-3 text-[#565C63] max-w-2xl mx-auto">
              Cada categoría contiene una lista detallada de servicios con
              imágenes y descripciones específicas.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categorias.map((categoria, index) => (
              <CategoriaCard key={categoria.slug} categoria={categoria} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          BENEFICIOS - POR QUÉ ELEGIRNOS
          ============================================================ */}
      <section className="bg-[#14161A] py-20 lg:py-28 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[url('/img/grid-pattern.svg')] bg-repeat" />
        <div
          className="pointer-events-none absolute -right-32 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #FF5A1F 0%, transparent 70%)" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span
              className="inline-block text-xs font-medium uppercase tracking-[0.2em] text-[#8A8F96] px-3 py-1 border border-[#3A3F45]"
              style={{ fontFamily: FONT_MONO }}
            >
              Por qué elegirnos
            </span>
            <h2
              className="mt-4 text-4xl font-semibold text-white"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              La diferencia está en el{" "}
              <span className="text-[#FF5A1F]">detalle</span>
            </h2>
            <p className="mt-3 text-[#9AA0A6] max-w-2xl mx-auto">
              4 razones por las que las principales constructoras del Perú confían
              en LUDIER para sus proyectos más exigentes.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {beneficios.map((beneficio, index) => {
              const Icon = beneficio.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-[#1D2024] border border-[#3A3F45] p-6 rounded-sm transition-all hover:border-[#FF5A1F]/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#FF5A1F]/5"
                >
                  <CornerMarks />
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm bg-[#FF5A1F]/10 border border-[#FF5A1F]/20">
                    <Icon className="h-6 w-6 text-[#FF5A1F]" />
                  </div>
                  <h3
                    className="text-lg font-semibold text-white"
                    style={{ fontFamily: FONT_DISPLAY }}
                  >
                    {beneficio.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#9AA0A6] leading-relaxed">
                    {beneficio.desc}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-[#FF5A1F]" />
                    <span className="text-[10px] text-[#6E7379] uppercase tracking-wider">Garantizado</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA FINAL
          ============================================================ */}
      <section className="bg-white py-16 lg:py-20 border-t border-[#E3E1D8]">
        <div
          ref={ctaRef}
          className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8"
          style={{
            opacity: ctaInView ? 1 : 0,
            transform: ctaInView ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <h2
            className="text-3xl font-semibold text-[#1E2126]"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            ¿Tienes un proyecto en mente?
          </h2>
          <p className="mt-3 text-[#565C63] max-w-xl mx-auto">
            Cuéntanos qué necesitas y te ayudaremos a encontrar la mejor solución
            metalmecánica para tu proyecto.
          </p>
          <Link
            href="/contacto"
            className="mt-6 inline-flex items-center gap-2 bg-[#FF5A1F] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#FF5A1F]/20 transition-all hover:bg-[#FF7A44] hover:shadow-[#FF5A1F]/40 hover:-translate-y-1"
          >
            <PhoneCall className="h-4 w-4" />
            Cotizar ahora
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="mt-4 flex justify-center gap-4 text-xs text-[#8B8F86]">
            <span>✓ Respuesta en 24h</span>
            <span>✓ Cotización sin compromiso</span>
            <span>✓ Asesoría personalizada</span>
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