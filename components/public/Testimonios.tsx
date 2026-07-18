"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  Quote,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Building2,
} from "lucide-react";

// ============================================================
// TIPOGRAFÍAS
// ============================================================
const FONT_DISPLAY = 'var(--font-display, Oswald, ui-sans-serif, sans-serif)';
const FONT_BODY = 'var(--font-body, Inter, ui-sans-serif, system-ui, sans-serif)';
const FONT_MONO = 'var(--font-mono, "JetBrains Mono", ui-monospace, monospace)';

// ============================================================
// COMPONENTE CornerMarks
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

// ============================================================
// HOOK useScrollReveal (animación única y suave)
// ============================================================
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

// ============================================================
// DATOS DE TESTIMONIOS
// ============================================================
const testimonios = [
  {
    id: 1,
    nombre: "Carlos Mendoza",
    cargo: "Gerente de Proyectos, Grupo LAR",
    testimonio:
      "LUDIER ha sido un socio estratégico en nuestros proyectos más exigentes. Su calidad en estructuras metálicas y cumplimiento de plazos es impecable.",
    imagen: "/img/testimonio1.jpg",
    rating: 5,
  },
  {
    id: 2,
    nombre: "María Fernanda Torres",
    cargo: "Directora de Operaciones, MDP Construcciones",
    testimonio:
      "La instalación de chutes metálicos y barandas de seguridad en nuestros edificios ha sido perfecta. Recomiendo ampliamente sus servicios.",
    imagen: "/img/testimonio2.jpg",
    rating: 5,
  },
  {
    id: 3,
    nombre: "José Luis Ramírez",
    cargo: "Jefe de Obra, Flat Canevaro",
    testimonio:
      "El cerco perimetral que instalaron en nuestro proyecto de Lince superó todas nuestras expectativas. Profesionalismo y calidad garantizados.",
    imagen: "/img/testimonio3.jpg",
    rating: 5,
  },
  {
    id: 4,
    nombre: "Andrea Paredes",
    cargo: "Arquitecta, Grupo Percola",
    testimonio:
      "Trabajar con LUDIER ha sido una experiencia increíble. Entienden las necesidades del proyecto y entregan soluciones personalizadas de primera calidad.",
    imagen: "/img/testimonio4.jpg",
    rating: 5,
  },
  {
    id: 5,
    nombre: "Roberto Gutiérrez",
    cargo: "Supervisor de Obra, Real Edificaciones",
    testimonio:
      "La estructura metálica para nuestro proyecto residencial fue ejecutada con precisión y excelentes acabados. Sin duda los volveremos a contratar.",
    imagen: "/img/testimonio5.jpg",
    rating: 5,
  },
  {
    id: 6,
    nombre: "Patricia Vega",
    cargo: "Directora de Proyectos, CHL",
    testimonio:
      "LUDIER nos ha brindado soluciones metalmecánicas integrales con un trato personalizado y un servicio postventa excepcional.",
    imagen: "/img/testimonio6.jpg",
    rating: 5,
  },
];

// ============================================================
// SUBCOMPONENTE: TestimonioCard
// ============================================================
const TestimonioCard = ({
  testimonio,
  index,
}: {
  testimonio: typeof testimonios[0];
  index: number;
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 800 + index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className="group relative bg-white border border-[#E3E1D8] rounded-sm overflow-hidden transition-all hover:border-[#FF5A1F]/40 hover:shadow-xl hover:-translate-y-2"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 800ms cubic-bezier(0.16,1,0.3,1), transform 800ms cubic-bezier(0.16,1,0.3,1)`,
      }}
    >
      <CornerMarks />
      <div className="p-6">
        {/* Rating de estrellas */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(testimonio.rating)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-[#FF5A1F] text-[#FF5A1F]" />
          ))}
        </div>

        {/* Cita */}
        <Quote className="h-6 w-6 text-[#FF5A1F]/30 mb-3" />
        <p className="text-[#565C63] leading-relaxed italic">
          "{testimonio.testimonio}"
        </p>

        {/* Autor */}
        <div className="mt-4 flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-[#14161A] flex items-center justify-center text-white font-semibold text-lg">
            {testimonio.nombre.charAt(0)}
          </div>
          <div>
            <h4
              className="text-sm font-semibold text-[#1E2126]"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              {testimonio.nombre}
            </h4>
            <p className="text-xs text-[#8B8F86]">{testimonio.cargo}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function Testimonios() {
  const { ref: heroRef, inView: heroInView } = useScrollReveal<HTMLDivElement>(0.1);
  const { ref: gridRef, inView: gridInView } = useScrollReveal<HTMLDivElement>(0.1);
  const { ref: ctaRef, inView: ctaInView } = useScrollReveal<HTMLDivElement>(0.1);

  const stats = [
    { value: "100%", label: "Satisfacción garantizada", icon: Award },
    { value: "20+", label: "Clientes activos", icon: Users },
    { value: "20+", label: "Proyectos ejecutados", icon: Building2 },
    { value: "5/5", label: "Calificación promedio", icon: Star },
  ];

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
            transition:
              "opacity 900ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div className="max-w-3xl">
            <span
              className="inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.22em] text-[#8A8F96]"
              style={{ fontFamily: FONT_MONO }}
            >
              <span className="h-px w-6 bg-[#FF5A1F]" />
              Testimonios
            </span>
            <h1
              className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              Lo que dicen
              <br />
              <span className="relative inline-block">
                <span className="text-[#FF5A1F]">nuestros clientes</span>
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#FF5A1F]/30 rounded-full blur-sm" />
              </span>
            </h1>
            <p className="mt-6 text-lg text-[#9AA0A6] max-w-xl leading-relaxed">
              Conoce las experiencias de las principales constructoras e inmobiliarias
              que han confiado en LUDIER para sus proyectos más exigentes.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 bg-[#FF5A1F] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#FF5A1F]/20 transition-all hover:bg-[#FF7A44] hover:shadow-[#FF5A1F]/40 hover:-translate-y-1"
              >
                <CheckCircle className="h-4 w-4" />
                Cotizar ahora
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-xs text-[#8A8F96]">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-[#FF5A1F] fill-[#FF5A1F]" />
                5/5 de calificación
              </span>
              <span className="text-[#3A3F45]">|</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-[#FF5A1F]" />
                +20 clientes activos
              </span>
              <span className="text-[#3A3F45]">|</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-[#FF5A1F]" />
                95% de recomendación
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          ESTADÍSTICAS
          ============================================================ */}
      <section className="py-12 bg-white border-b border-[#E3E1D8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="flex flex-col items-center p-4 text-center">
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
          GRID DE TESTIMONIOS
          ============================================================ */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            ref={gridRef}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            style={{
              opacity: gridInView ? 1 : 0,
              transform: gridInView ? "translateY(0)" : "translateY(30px)",
              transition:
                "opacity 900ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {testimonios.map((testimonio, index) => (
              <TestimonioCard key={testimonio.id} testimonio={testimonio} index={index} />
            ))}
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
            transition:
              "opacity 900ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <h2
            className="text-3xl font-semibold text-[#1E2126]"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            ¿Quieres ser nuestro próximo cliente?
          </h2>
          <p className="mt-3 text-[#565C63] max-w-xl mx-auto">
            Únete a las mejores constructoras del Perú y descubre por qué confían en LUDIER.
          </p>
          <Link
            href="/contacto"
            className="mt-6 inline-flex items-center gap-2 bg-[#FF5A1F] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#FF5A1F]/20 transition-all hover:bg-[#FF7A44] hover:shadow-[#FF5A1F]/40 hover:-translate-y-1"
          >
            <CheckCircle className="h-4 w-4" />
            Cotizar ahora
            <ArrowRight className="h-4 w-4" />
          </Link>
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