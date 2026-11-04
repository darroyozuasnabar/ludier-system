import type { Metadata } from "next";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  HardHat,
  Building2,
  CheckCircle,
  Clock,
  PhoneCall,
  Award,
  Users,
} from "lucide-react";

import Reveal from "@/components/public/Reveal";
import ServiciosHero from "@/components/public/ServiciosHero";
import ServicioCard from "@/components/public/ServicioCard";
import ConstructorasCTA from "@/components/public/ConstructorasCTA";
import { SERVICIOS_CATALOGO } from "@/lib/servicios-catalogo";

const FONT_DISPLAY = "var(--font-display)";
const FONT_BODY = "var(--font-body)";
const FONT_MONO = "var(--font-mono)";

const SITE_URL = "https://grupoludier.com";
const PAGE_URL = `${SITE_URL}/servicios`;
const TITLE = "Servicios de Metalmecánica en Lima | LUDIER";
const DESCRIPTION =
  "Fabricación e instalación de estructuras metálicas, barandas, escaleras, portones y chutes en Lima. Atención a constructoras y trabajos según planos.";

// --- SEO ---
export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    type: "website",
    siteName: "LUDIER",
    locale: "es_PE",
    images: [{ url: "/img/Qantua.jpg", alt: "Trabajos metalmecánicos de LUDIER en el proyecto Qantua" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/img/Qantua.jpg"],
  },
};

// ============================================================
// COMPONENTE CLIENTE PARA EL CONTADOR
// ============================================================
function StatCounter({ value }: { value: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const numericPart = parseInt(value.replace(/\D/g, ""), 10) || 0;
  const suffix = value.replace(/\d/g, "");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(numericPart);
      return;
    }
    let startTime: number | null = null;
    const duration = 1500;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * numericPart));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, numericPart]);

  return (
    <span ref={ref} className="mt-3 text-2xl font-semibold text-[#1E2126] transition-colors group-hover:text-[#FF5A1F]">
      {count}{suffix}
    </span>
  );
}

// ============================================================
// DATOS
// ============================================================
const STATS = [
  { value: "10+", label: "Años de experiencia", icon: Award },
  { value: "20+", label: "Proyectos ejecutados", icon: Building2 },
  { value: "95%", label: "Cumplimiento de plazos", icon: Clock },
  { value: "100%", label: "Compromiso garantizado", icon: CheckCircle },
];

const beneficios = [
  { icon: ShieldCheck, title: "Calidad certificada", desc: "Materiales de primera calidad y acabados superiores en cada proyecto." },
  { icon: Clock, title: "Entregas puntuales", desc: "Cumplimos los plazos establecidos con planificación rigurosa." },
  { icon: HardHat, title: "Seguridad garantizada", desc: "Equipos con EPP certificado y protocolos de seguridad en obra." },
  { icon: Users, title: "Atención personalizada", desc: "Cada proyecto recibe atención directa de nuestros líderes." },
];

function CornerMarks({ active = false }: { active?: boolean }) {
  const base = "pointer-events-none absolute h-3 w-3 transition-all duration-500";
  const border = active ? "border-[#FF5A1F] opacity-100" : "border-[#3A3F45] opacity-50";
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
// PÁGINA PRINCIPAL
// ============================================================
export default function ServiciosPage() {
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: SERVICIOS_CATALOGO.map((servicio, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: servicio.title,
        url: `${SITE_URL}${servicio.href}`,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-[#F7F7F4]" style={{ fontFamily: FONT_BODY }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd).replace(/</g, "\\u003c") }}
      />

      <ServiciosHero />

      {/* ESTADÍSTICAS CON CONTADOR */}
      <section className="py-12 bg-white border-b border-[#E3E1D8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Reveal key={index} delay={index * 70} className="group flex flex-col items-center p-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#FF5A1F] group-hover:text-white">
                    <Icon className="h-6 w-6 text-[#FF5A1F] transition-colors group-hover:text-white" />
                  </div>
                  <StatCounter value={stat.value} />
                  <p className="text-sm text-[#565C63]" style={{ fontFamily: FONT_BODY }}>{stat.label}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* GRID DE CATEGORÍAS */}
      <section id="catalogo-servicios" tabIndex={-1} className="scroll-mt-24 py-20 outline-none lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-14">
            <span className="inline-block text-xs font-medium uppercase tracking-[0.2em] text-[#8B8F86] px-3 py-1 border border-[#E3E1D8]" style={{ fontFamily: FONT_MONO }}>
              Nuestras líneas de negocio
            </span>
            <h2 className="mt-4 text-3xl font-semibold text-[#1E2126] sm:text-4xl" style={{ fontFamily: FONT_DISPLAY }}>
              Todo lo que necesitas en <span className="text-[var(--ludier-accent-ink)]">metalmecánica</span>
            </h2>
            <p className="mt-3 text-[#565C63] max-w-2xl mx-auto" style={{ fontFamily: FONT_BODY }}>
              Explora los alcances, revisa trabajos realizados y encuentra la solución metálica que necesita tu proyecto.
            </p>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICIOS_CATALOGO.map((categoria, index) => (
              <Reveal key={categoria.slug} className="h-full" delay={(index % 3) * 70}>
                <ServicioCard servicio={categoria} />
              </Reveal>
            ))}
          </div>

          <div id="constructoras" className="mt-12 scroll-mt-28 lg:mt-16">
            <Reveal><ConstructorasCTA /></Reveal>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="relative overflow-hidden bg-[#14161A] py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FF5A1F]/5 via-transparent to-transparent opacity-50" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[url('/img/grid-pattern.svg')] bg-repeat" />
        <div className="pointer-events-none absolute -right-32 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #FF5A1F 0%, transparent 70%)" }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-14">
            <span className="inline-block text-xs font-medium uppercase tracking-[0.2em] text-[#8A8F96] px-3 py-1 border border-[#3A3F45]" style={{ fontFamily: FONT_MONO }}>
              Por qué elegirnos
            </span>
            <h2 className="mt-4 text-4xl font-semibold text-white" style={{ fontFamily: FONT_DISPLAY }}>
              La diferencia está en el <span className="text-[#FF5A1F]">detalle</span>
            </h2>
            <p className="mt-3 text-[#9AA0A6] max-w-2xl mx-auto" style={{ fontFamily: FONT_BODY }}>
              4 razones por las que las principales constructoras del Perú confían en LUDIER para sus proyectos más exigentes.
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {beneficios.map((beneficio, index) => {
              const Icon = beneficio.icon;
              return (
                <Reveal key={beneficio.title} delay={index * 70} className="h-full">
                  <div className="group relative h-full overflow-hidden rounded-sm border border-[#3A3F45] bg-[#1D2024] p-6 transition-all duration-500 hover:-translate-y-2 hover:border-[#FF5A1F]/40 hover:shadow-2xl hover:shadow-[#FF5A1F]/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF5A1F]/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <CornerMarks active={true} />
                    <div className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-sm border border-[#FF5A1F]/20 bg-[#FF5A1F]/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#FF5A1F]">
                      <Icon className="h-6 w-6 text-[#FF5A1F] transition-colors group-hover:text-white" />
                    </div>
                    <h3 className="relative z-10 text-lg font-semibold text-white transition-colors group-hover:text-[#FF5A1F]" style={{ fontFamily: FONT_DISPLAY }}>
                      {beneficio.title}
                    </h3>
                    <p className="relative z-10 mt-2 text-sm leading-relaxed text-[#9AA0A6]" style={{ fontFamily: FONT_BODY }}>
                      {beneficio.desc}
                    </p>
                    <div className="relative z-10 mt-4 flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-[#FF5A1F]" />
                      <span className="text-[10px] uppercase tracking-wider text-[#6E7379] transition-colors group-hover:text-[#FF5A1F]">Garantizado</span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-white py-16 lg:py-20 border-t border-[#E3E1D8]">
        <Reveal className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-[#1E2126]" style={{ fontFamily: FONT_DISPLAY }}>
            ¿Tienes un proyecto en mente?
          </h2>
          <p className="mt-3 text-[#565C63] max-w-xl mx-auto" style={{ fontFamily: FONT_BODY }}>
            Cuéntanos qué necesitas y te ayudaremos a encontrar la mejor solución metalmecánica para tu proyecto.
          </p>
          <Link href="/contacto" className="ludier-button ludier-button-primary mt-6 inline-flex items-center gap-3" style={{ fontFamily: FONT_BODY }}>
            <PhoneCall className="h-4 w-4" />
            Cotizar ahora
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <div className="mt-4 flex justify-center gap-4 text-xs text-[#8B8F86]">
            <span>✓ Respuesta en 24h</span>
            <span>✓ Cotización sin compromiso</span>
            <span>✓ Asesoría personalizada</span>
          </div>
        </Reveal>
      </section>
    </div>
  );
}