import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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

import ConstructorasCTA from "@/components/public/ConstructorasCTA";
import { SERVICIOS_CATALOGO, type ServicioCatalogo } from "@/lib/servicios-catalogo";

const FONT_DISPLAY = 'var(--font-display, Oswald, ui-sans-serif, sans-serif)';
const FONT_BODY = 'var(--font-body, Inter, ui-sans-serif, system-ui, sans-serif)';
const FONT_MONO = 'var(--font-mono, "JetBrains Mono", ui-monospace, monospace)';

const SITE_URL = "https://grupoludier.com";
const PAGE_URL = `${SITE_URL}/servicios`;
const TITLE = "Servicios de Metalmecánica en Lima | LUDIER";
const DESCRIPTION =
  "Fabricación e instalación de estructuras metálicas, barandas, escaleras, portones y chutes en Lima. Atención a constructoras y trabajos según planos.";

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

// ============================================================
// DATOS ESTRATÉGICOS
// ============================================================

const STATS = [
  { value: "10+", label: "Años de experiencia", icon: Award },
  { value: "20+", label: "Proyectos ejecutados", icon: Building2 },
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

function CategoriaCard({ categoria }: { categoria: ServicioCatalogo }) {
  const Icon = categoria.icon;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-[#E3E1D8] bg-white transition-shadow hover:shadow-lg motion-reduce:transition-none">
      <Link
        href={categoria.href}
        className="relative flex flex-1 flex-col focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#B8390F]"
      >
        <CornerMarks />
        <div className="relative h-48 shrink-0 overflow-hidden bg-[#14161A]">
          <Image
            src={categoria.image}
            alt={categoria.imageAlt}
            fill
            sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
          />
          <span className="absolute bottom-3 left-3 rounded-sm bg-black/70 px-2 py-1 text-xs text-white">
            {categoria.tag}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-3 flex items-start gap-3">
            <Icon className="mt-1 h-6 w-6 shrink-0 text-[#B8390F]" aria-hidden />
            <h3 className="text-xl font-semibold text-[#1E2126]" style={{ fontFamily: FONT_DISPLAY }}>
              {categoria.title}
            </h3>
          </div>
          <p className="mb-5 text-sm leading-relaxed text-[#565C63]">{categoria.description}</p>
          <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[#B8390F]">
            {categoria.linkLabel}
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </span>
        </div>
      </Link>
      {categoria.relatedLinks.length > 0 && (
        <div className="border-t border-[#E3E1D8] bg-[#F7F7F4] px-6 py-3">
          {categoria.relatedLinks.map((link) => (
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

// ============================================================
// PÁGINA PRINCIPAL
// ============================================================

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F4]" style={{ fontFamily: FONT_BODY }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd).replace(/</g, "\\u003c") }}
      />

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

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
              Servicios de
              <br />{" "}
              <span className="relative inline-block">
                <span className="text-[#FF5A1F]">metalmecánica</span>
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#FF5A1F]/30 rounded-full blur-sm" />
              </span>
            </h1>
            <p className="mt-6 text-lg text-[#9AA0A6] max-w-xl leading-relaxed">
              Fabricamos e instalamos estructuras, barandas, escaleras, portones
              y chutes metálicos en Lima. Elige el servicio que necesitas o
              envíanos los planos para cotizar varios alcances de tu obra.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 bg-[#FF5A1F] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#FF5A1F]/20 transition-all hover:bg-[#FF7A44] hover:shadow-[#FF5A1F]/40 hover:-translate-y-1"
              >
                <PhoneCall className="h-4 w-4" />
                Cotizar ahora
              </Link>
              <Link
                href="#constructoras"
                className="inline-flex min-h-11 items-center gap-2 border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5A1F]"
              >
                Soy constructora
                <ArrowRight className="h-4 w-4" aria-hidden />
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
                20+ proyectos ejecutados
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
              Explora los alcances, revisa trabajos realizados y encuentra
              la solución metálica que necesita tu proyecto.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICIOS_CATALOGO.map((categoria) => (
              <CategoriaCard key={categoria.slug} categoria={categoria} />
            ))}
          </div>

          <div id="constructoras" className="mt-12 scroll-mt-28 lg:mt-16">
            <ConstructorasCTA />
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
          className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8"
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
    </div>
  );
}
