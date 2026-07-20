"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  ArrowRight,
  PhoneCall,
  MessageCircle,
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
// HOOK useScrollReveal
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
// DATOS DE FAQ
// ============================================================
const faqs = [
  {
    id: 1,
    pregunta: "¿Qué servicios ofrece LUDIER?",
    respuesta:
      "Ofrecemos soluciones integrales en metalmecánica: estructuras metálicas, barandas y pasamanos, escaleras metálicas, puertas y portones, soluciones para constructoras y fabricación a medida. Todo con los más altos estándares de calidad y seguridad.",
  },
  {
    id: 2,
    pregunta: "¿Cuánto tiempo toma la fabricación de una estructura metálica?",
    respuesta:
      "El tiempo de fabricación depende de la complejidad del proyecto. En promedio, una estructura metálica estándar puede tomar entre 2 a 4 semanas. Para proyectos más grandes, podemos acordar plazos específicos. Siempre garantizamos el cumplimiento de los plazos acordados.",
  },
  {
    id: 3,
    pregunta: "¿Realizan instalación en obra?",
    respuesta:
      "Sí, contamos con un equipo técnico especializado que realiza la instalación en obra. Incluye trazado, perforación, anclajes, soldadura en campo y control de acabados. Garantizamos una instalación segura y precisa.",
  },
  {
    id: 4,
    pregunta: "¿Qué tipo de acabados ofrecen?",
    respuesta:
      "Ofrecemos acabados de alta calidad: pintura anticorrosiva, pintura electrostática, gloss mate, epóxicos y otros según la especificación del proyecto. Todos nuestros acabados garantizan durabilidad y resistencia a la intemperie.",
  },
  {
    id: 5,
    pregunta: "¿Trabajan con planos proporcionados por el cliente?",
    respuesta:
      "Sí, trabajamos con planos proporcionados por el cliente o podemos desarrollar el diseño desde cero. Nuestro equipo de ingeniería analiza y optimiza cada proyecto para garantizar la mejor solución.",
  },
  {
    id: 6,
    pregunta: "¿Ofrecen garantía en sus trabajos?",
    respuesta:
      "Sí, todos nuestros trabajos cuentan con garantía de calidad y conformidad. Respaldaos nuestra experiencia y el uso de materiales certificados. La garantía específica depende del tipo de proyecto.",
  },
  {
    id: 7,
    pregunta: "¿Cómo puedo solicitar una cotización?",
    respuesta:
      "Puedes solicitar una cotización a través de nuestro formulario de contacto, llamándonos al +51 930 747 399 o enviándonos un correo a ernestoarroyo1969@hotmail.com. Respondemos en menos de 24 horas.",
  },
  {
    id: 8,
    pregunta: "¿Atienden proyectos en todo Lima?",
    respuesta:
      "Sí, atendemos proyectos en toda Lima Metropolitana y también en provincias. Nuestra logística propia nos permite llegar a cualquier ubicación con nuestros equipos y materiales.",
  },
];

// ============================================================
// SUBCOMPONENTE: Acordeón
// ============================================================
const AccordionItem = ({
  faq,
  index,
}: {
  faq: typeof faqs[0];
  index: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 800 + index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className="bg-white border border-[#E3E1D8] rounded-sm overflow-hidden transition-all hover:border-[#FF5A1F]/30"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 600ms cubic-bezier(0.16,1,0.3,1), transform 600ms cubic-bezier(0.16,1,0.3,1)`,
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-[#F7F7F4] transition-colors"
      >
        <h3
          className="text-base font-semibold text-[#1E2126] pr-4"
          style={{ fontFamily: FONT_DISPLAY }}
        >
          {faq.pregunta}
        </h3>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-[#FF5A1F]/10 border border-[#FF5A1F]/20">
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-[#FF5A1F]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#FF5A1F]" />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 pt-0 text-[#565C63] leading-relaxed border-t border-[#E3E1D8]">
          {faq.respuesta}
        </div>
      )}
    </div>
  );
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function Faq() {
  const { ref: heroRef, inView: heroInView } = useScrollReveal<HTMLDivElement>(0.1);
  const { ref: gridRef, inView: gridInView } = useScrollReveal<HTMLDivElement>(0.1);
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
              Preguntas frecuentes
            </span>
            <h1
              className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              Resolvemos tus
              <br />
              <span className="relative inline-block">
                <span className="text-[#FF5A1F]">dudas</span>
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#FF5A1F]/30 rounded-full blur-sm" />
              </span>
            </h1>
            <p className="mt-6 text-lg text-[#9AA0A6] max-w-xl leading-relaxed">
              Encuentra respuestas a las preguntas más comunes sobre nuestros
              servicios, procesos y garantías.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs text-[#8A8F96]">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-[#FF5A1F]" />
                Respuestas claras
              </span>
              <span className="text-[#3A3F45]">|</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-[#FF5A1F]" />
                Actualizadas
              </span>
              <span className="text-[#3A3F45]">|</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-[#FF5A1F]" />
                +8 preguntas
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          GRID DE FAQ (ACORDEÓN)
          ============================================================ */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div
            ref={gridRef}
            className="space-y-4"
            style={{
              opacity: gridInView ? 1 : 0,
              transform: gridInView ? "translateY(0)" : "translateY(30px)",
              transition:
                "opacity 900ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.id} faq={faq} index={index} />
            ))}
          </div>

          {/* Contacto rápido */}
          <div className="mt-12 text-center bg-white border border-[#E3E1D8] rounded-sm p-8 shadow-sm">
            <h3
              className="text-lg font-semibold text-[#1E2126]"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              ¿No encontraste tu respuesta?
            </h3>
            <p className="mt-2 text-sm text-[#565C63]">
              Contáctanos directamente y te ayudaremos con lo que necesites.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 bg-[#FF5A1F] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#FF7A44]"
              >
                <MessageCircle className="h-4 w-4" />
                Contactar
              </Link>
              <Link
                href="tel:+51930747399"
                className="inline-flex items-center gap-2 border border-[#E3E1D8] px-6 py-2.5 text-sm font-semibold text-[#1E2126] transition-all hover:border-[#FF5A1F] hover:text-[#FF5A1F]"
              >
                <PhoneCall className="h-4 w-4" />
                +51 930 747 399
              </Link>
            </div>
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
            ¿Listo para comenzar tu proyecto?
          </h2>
          <p className="mt-3 text-[#565C63] max-w-xl mx-auto">
            Solicita una cotización sin compromiso y descubre cómo podemos ayudarte.
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