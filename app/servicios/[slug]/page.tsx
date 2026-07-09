"use client";

import { useEffect, useRef, useState, use } from "react"; // 🔥 Importar 'use'
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Shield,
  Gauge,
  DoorOpen,
  HardHat,
  Wrench,
  CheckCircle,
  Clock,
  PhoneCall,
  ShieldCheck,
  Users,
  Truck,
  Zap,
  Award,
} from "lucide-react";

const FONT_DISPLAY = 'var(--font-display, Oswald, ui-sans-serif, sans-serif)';
const FONT_BODY = 'var(--font-body, Inter, ui-sans-serif, system-ui, sans-serif)';
const FONT_MONO = 'var(--font-mono, "JetBrains Mono", ui-monospace, monospace)';
// ============================================================
// DATOS DE CATEGORÍAS (mismo que en la página principal)
// ============================================================

const categorias = [
  {
    slug: "estructuras-metalicas",
    icon: Building2,
    title: "Estructuras Metálicas",
    description:
      "Diseñamos, fabricamos e instalamos estructuras metálicas para proyectos residenciales, comerciales e industriales, garantizando resistencia, precisión y cumplimiento de los estándares de construcción.",
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
    beneficios: [
      "Resistencia estructural certificada",
      "Acabados anticorrosivos de alta durabilidad",
      "Fabricación con acero de primera calidad",
      "Instalación precisa por técnicos especializados",
    ],
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
    beneficios: [
      "Diseño personalizado según proyecto",
      "Acabados gloss mate, epóxicos y electrostáticos",
      "Instalación con anclajes de alta resistencia",
      "Cumplimiento de normas de seguridad",
    ],
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
    beneficios: [
      "Diseño estructural certificado",
      "Pasamanos y barandas integradas",
      "Acabado profesional con pintura electrostática",
      "Instalación en obra por técnicos especializados",
    ],
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
    beneficios: [
      "Fabricación con acero galvanizado y pintura electrostática",
      "Sistemas de cierre y herrajes de alta calidad",
      "Instalación con precisión y nivelación exacta",
      "Resistencia a impacto y condiciones climáticas",
    ],
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
    beneficios: [
      "Respuesta rápida a necesidades de obra",
      "Soluciones adaptadas al cronograma de construcción",
      "Personal especializado en trabajos en altura",
      "Cumplimiento de normas de seguridad en obra",
    ],
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
    beneficios: [
      "Diseño 100% personalizado",
      "Fabricación con materiales certificados",
      "Control de calidad en cada etapa",
      "Entrega según especificaciones del cliente",
    ],
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

// ============================================================
// PÁGINA DE DETALLE
// ============================================================

export default function ServicioDetallePage({ 
  params 
}: { 
  params: Promise<{ slug: string }>  // 🔥 params es una Promise
}) {
  // 🔥 Desestructurar params con React.use()
  const { slug } = use(params);
  const router = useRouter();

  // Buscar la categoría por slug
  const categoria = categorias.find((c) => c.slug === slug);

  // Si no existe, mostrar 404
  if (!categoria) {
    notFound();
  }

  const Icon = categoria.icon;
  const { ref: heroRef, inView: heroInView } = useScrollReveal<HTMLDivElement>(0.1);
  const { ref: gridRef, inView: gridInView } = useScrollReveal<HTMLDivElement>(0.1);
  const { ref: ctaRef, inView: ctaInView } = useScrollReveal<HTMLDivElement>(0.1);

  return (
    <div className="min-h-screen bg-[#F7F7F4]" style={{ fontFamily: FONT_BODY }}>

      {/* ============================================================
          HERO - DETALLE DE CATEGORÍA
          ============================================================ */}
      <section className="relative overflow-hidden bg-[#14161A] py-24 lg:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[url('/img/grid-pattern.svg')] bg-repeat" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, #C7CBD1 0px, #C7CBD1 1px, transparent 1px, transparent 64px)",
          }}
        />
        <div
          className="pointer-events-none absolute -left-32 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full opacity-[0.06]"
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
            transition: "opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 text-sm text-[#8A8F96] hover:text-[#FF5A1F] transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a servicios
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span
                className="inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.22em] text-[#8A8F96]"
                style={{ fontFamily: FONT_MONO }}
              >
                <span className="h-px w-6 bg-[#FF5A1F]" />
                {categoria.tag}
              </span>
              <h1
                className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                {categoria.title}
              </h1>
              <p className="mt-4 text-lg text-[#9AA0A6] leading-relaxed">
                {categoria.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {categoria.beneficios.slice(0, 2).map((beneficio, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 text-xs text-[#8A8F96] bg-[#1D2024] px-3 py-1.5 rounded-sm border border-[#3A3F45]"
                  >
                    <CheckCircle className="h-3 w-3 text-[#FF5A1F]" />
                    {beneficio}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={`/contacto?servicio=${categoria.slug}`}
                  className="inline-flex items-center gap-2 bg-[#FF5A1F] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#FF5A1F]/20 transition-all hover:bg-[#FF7A44] hover:shadow-[#FF5A1F]/40 hover:-translate-y-1"
                >
                  <PhoneCall className="h-4 w-4" />
                  Cotizar este servicio
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-[#3A3F45] bg-[#1D2024]">
                <img
                  src={categoria.image}
                  alt={categoria.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[#FF5A1F]/20 border border-[#FF5A1F]/30">
                      <Icon className="h-6 w-6 text-[#FF5A1F]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{categoria.title}</p>
                      <p className="text-xs text-white/60">{categoria.tag}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SUB-SERVICIOS
          ============================================================ */}
      <section className="py-20 lg:py-28">
        <div
          ref={gridRef}
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          style={{
            opacity: gridInView ? 1 : 0,
            transform: gridInView ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div className="text-center mb-14">
            <span
              className="inline-block text-xs font-medium uppercase tracking-[0.2em] text-[#8B8F86] px-3 py-1 border border-[#E3E1D8]"
              style={{ fontFamily: FONT_MONO }}
            >
              Servicios incluidos
            </span>
            <h2
              className="mt-4 text-3xl font-semibold text-[#1E2126] sm:text-4xl"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              Todo lo que ofrecemos en{" "}
              <span className="text-[#FF5A1F]">{categoria.title}</span>
            </h2>
            <p className="mt-3 text-[#565C63] max-w-2xl mx-auto">
              Conoce la lista completa de servicios que ofrecemos dentro de esta
              categoría.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categoria.subServicios.map((subServicio, index) => (
              <div
                key={index}
                className="group relative flex items-start gap-4 p-4 bg-white border border-[#E3E1D8] rounded-sm transition-all hover:border-[#FF5A1F]/30 hover:shadow-md"
              >
                <CornerMarks />
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-[#FF5A1F]/10 border border-[#FF5A1F]/20">
                  <CheckCircle className="h-4 w-4 text-[#FF5A1F]" />
                </div>
                <div>
                  <h3
                    className="text-sm font-semibold text-[#1E2126]"
                    style={{ fontFamily: FONT_DISPLAY }}
                  >
                    {subServicio}
                  </h3>
                  <p className="text-xs text-[#8B8F86] mt-0.5">
                    Solución metalmecánica profesional
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          BENEFICIOS DESTACADOS
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
              Ventajas competitivas
            </span>
            <h2
              className="mt-4 text-3xl font-semibold text-white sm:text-4xl"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              ¿Por qué elegirnos para{" "}
              <span className="text-[#FF5A1F]">{categoria.title.toLowerCase()}</span>?
            </h2>
            <p className="mt-3 text-[#9AA0A6] max-w-2xl mx-auto">
              Estas son las razones por las que las principales constructoras
              confían en LUDIER.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categoria.beneficios.map((beneficio, index) => {
              const iconMap = {
                0: ShieldCheck,
                1: Truck,
                2: Users,
                3: Zap,
              };
              const IconComp = iconMap[index as keyof typeof iconMap] || ShieldCheck;
              return (
                <div
                  key={index}
                  className="group relative bg-[#1D2024] border border-[#3A3F45] p-6 rounded-sm transition-all hover:border-[#FF5A1F]/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#FF5A1F]/5"
                >
                  <CornerMarks />
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm bg-[#FF5A1F]/10 border border-[#FF5A1F]/20">
                    <IconComp className="h-6 w-6 text-[#FF5A1F]" />
                  </div>
                  <h3
                    className="text-base font-semibold text-white"
                    style={{ fontFamily: FONT_DISPLAY }}
                  >
                    {beneficio}
                  </h3>
                  <p className="mt-2 text-xs text-[#8A8F96]">Garantizado en cada proyecto</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA FINAL
          ============================================================ */}
      <section className="bg-white py-20 lg:py-28">
        <div
          ref={ctaRef}
          className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8"
          style={{
            opacity: ctaInView ? 1 : 0,
            transform: ctaInView ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <span
            className="inline-block text-xs font-medium uppercase tracking-[0.2em] text-[#8B8F86] px-3 py-1 border border-[#E3E1D8]"
            style={{ fontFamily: FONT_MONO }}
          >
            Tu próximo proyecto
          </span>
          <h2
            className="mt-5 text-4xl font-semibold text-[#1E2126] sm:text-5xl"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            ¿Necesitas <span className="text-[#FF5A1F]">{categoria.title}</span>?
            <br />
            Cotiza sin compromiso
          </h2>
          <p className="mt-4 text-lg text-[#565C63] max-w-2xl mx-auto">
            Recibe una respuesta en menos de 24 horas. Te ayudamos a definir la
            mejor solución para tu proyecto.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={`/contacto?servicio=${categoria.slug}`}
              className="group inline-flex items-center gap-2 bg-[#FF5A1F] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#FF5A1F]/20 transition-all hover:bg-[#FF7A44] hover:shadow-[#FF5A1F]/40 hover:-translate-y-1"
            >
              <PhoneCall className="h-4 w-4" />
              Cotizar {categoria.title}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/proyectos"
              className="group inline-flex items-center gap-2 border border-[#E3E1D8] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-[#1E2126] transition-all hover:border-[#FF5A1F] hover:text-[#FF5A1F]"
            >
              Ver proyectos relacionados
            </Link>
          </div>

          <div className="mt-8 flex justify-center gap-6 text-xs text-[#8B8F86]">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Respuesta en 24h
            </span>
            <span className="text-[#E3E1D8]">|</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              Cotización sin compromiso
            </span>
            <span className="text-[#E3E1D8]">|</span>
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