import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CheckCircle2,
  PhoneCall,
  MessageCircle,
  ShieldCheck,
  Clock,
  Building2,
  HardHat,
  FileCheck,
  ChevronRight,
  ClipboardList,
  Ruler,
  Factory,
  Wrench,
  AlertTriangle,
} from "lucide-react";
import WhatsAppLink from "@/components/public/WhatsAppLink";


const SITE_URL = "https://grupoludier.com";
const PAGE_URL = `${SITE_URL}/servicios/chutes-metalicos-para-construccion`;
const PHONE_DISPLAY = "+51 965 391 256";
const PHONE_TEL = "+51965391256";
const WHATSAPP_URL = `https://wa.me/51965391256?text=${encodeURIComponent(
  "Hola LUDIER, quiero cotizar chutes metálicos para una obra. ¿Me pueden ayudar?"
)}`;
const QUOTE_URL = "/contacto?servicio=chutes-metalicos";

const FONT_DISPLAY = "var(--font-display, Oswald, sans-serif)";
const FONT_BODY = "var(--font-body, Inter, sans-serif)";
const FONT_MONO = 'var(--font-mono, "JetBrains Mono", monospace)';

// ============================================================
// SEO
// ============================================================
export const metadata: Metadata = {
  title: "Chutes Metálicos para Construcción en Lima | LUDIER",
  description:
    "Fabricamos e instalamos chutes metálicos para evacuación de escombros en obras y edificios. Acero galvanizado de alta resistencia. Montaje seguro para constructoras. Cotiza en 24 horas.",
  keywords: [
    "chutes metálicos para construcción",
    "chutes para escombros lima",
    "chutes para obras",
    "evacuación de residuos construcción",
    "proveedor de chutes metálicos",
    "fabricación de chutes lima",
  ],
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Chutes Metálicos para Construcción | LUDIER",
    description:
      "Soluciones de evacuación de escombros para edificios en construcción. Fabricación a medida y montaje seguro en Lima.",
    url: PAGE_URL,
    siteName: "LUDIER",
    locale: "es_PE",
    type: "website",
    images: [
      {
        url: "/img/chutesMetalicos.webp",
        width: 1200,
        height: 630,
        alt: "Chutes metálicos instalados en obra por LUDIER",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chutes Metálicos para Construcción | LUDIER",
    description: "Evacuación segura de escombros para constructoras en Lima.",
    images: ["/img/chutesMetalicos.webp"],
  },
};

// ============================================================
// CONTENIDO
// ============================================================
const FAQS = [
  {
    q: "¿Cómo eligen el tamaño del chute?",
    a: "Con los planos del edificio calculamos la altura total y los puntos de descarga. El diámetro y espesor del acero galvanizado se definen según el volumen de escombros y la altura del proyecto.",
  },
  {
    q: "¿Qué mantenimiento requiere el chute metálico?",
    a: "Los chutes de acero galvanizado que fabricamos son de alta resistencia. El mantenimiento se reduce a una revisión visual periódica de los anclajes y uniones, y a la limpieza de residuos acumulados para evitar atoros.",
  },
  {
    q: "¿Realizan el montaje y desmontaje en obra?",
    a: "Sí. Contamos con personal propio certificado para montar y desmontar los chutes de forma segura, coordinando siempre con la supervisión de la obra y respetando los plazos de ejecución.",
  },
  {
    q: "¿Es obligatorio el chute en una obra?",
    a: "El Reglamento Nacional de Edificaciones (RNE) y la Norma Técnica G.050 de Seguridad durante la Construcción exigen sistemas seguros para la evacuación de residuos en altura. Contar con chutes metálicos es una de las formas de cumplir y evitar sanciones.",
  },
  {
    q: "¿En cuánto tiempo entregan y montan el chute?",
    a: "El tiempo varía según la complejidad y cantidad de tramos. Para una obra estándar, la fabricación toma 3-5 días y el montaje 1-2 días. Al enviar tus planos te damos un plazo exacto.",
  },
];

const MATERIALS = [
  { name: "Chute Metálico Galvanizado", use: "Obras de mediana y gran altura", corrosion: "Alta; resiste intemperie", cost: "Óptimo", featured: true },
  { name: "Chute de Acero al Carbono", use: "Obras de baja altura o interiores", corrosion: "Requiere pintura", cost: "Menor" },
  { name: "Chute con Refuerzo Estructural", use: "Edificios > 20 pisos o gran volumen", corrosion: "Alta", cost: "Mayor" },
];

const PROCESS = [
  { icon: ClipboardList, title: "Envías planos de obra", text: "Revisamos altura, puntos de evacuación y volumen de escombros." },
  { icon: Ruler, title: "Cotización y diseño", text: "Propuesta con material, diámetro, anclajes y plazo de entrega." },
  { icon: Factory, title: "Fabricación en taller", text: "Producción por tramos, alineada al avance de tu obra." },
  { icon: Wrench, title: "Montaje en obra", text: "Instalación con personal propio y coordinación con supervisión." },
];

const QUOTE_CHECKLIST = [
  "Planos de elevación del edificio (PDF o DWG)",
  "Altura total de la obra (pisos o metros)",
  "Ubicación del proyecto (distrito)",
  "Fecha en que necesitas el montaje",
  "Si tienes un proveedor anterior, el detalle del sistema que usaban",
];

// 👇 3 PROYECTOS REALES CON CHUTES METÁLICOS
const PROJECTS = [
  {
    href: "/proyectos/hilton",
    img: "/img/hilton-lima-miraflores.jpg",
    alt: "Chute metálico instalado en el Hotel Hilton por LUDIER",
    title: "Hotel Hilton · Surco",
    text: "Fabricación e instalación de chute metálico para evacuación de escombros en 19 pisos y sótano.",
  },
  {
    href: "/proyectos/qantua",
    img: "/img/Qantua.jpg",
    alt: "Chutes metálicos instalados en el Proyecto Qantua por LUDIER",
    title: "Proyecto Qantua · Cercado de Lima",
    text: "Fabricación, instalación, mantenimiento y desmontaje de chutes de escombros para las 6 torres del proyecto.",
  },
  {
    href: "/proyectos/catalina-tower",
    img: "/img/CatalinaTower.png",
    alt: "Chute metálico instalado en el Edificio Catalina Tower por LUDIER",
    title: "Edificio Catalina Tower · La Victoria",
    text: "Servicio integral de instalación y desmontaje de chute metálico para evacuación de residuos en 10 pisos.",
  },
];

// ============================================================
// COMPONENTES AUXILIARES
// ============================================================
function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function CtaButtons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <Link
        href={QUOTE_URL}
        className="inline-flex items-center gap-2 bg-[#FF5A1F] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#FF5A1F]/25 transition-colors hover:bg-[#FF7A44] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <ClipboardList className="h-4 w-4" aria-hidden /> Cotizar mi proyecto
      </Link>
      <WhatsAppLink
        href={WHATSAPP_URL}
        location="hero"
        page="chutes"
        className="inline-flex items-center gap-2 border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <Image
          src="/img/WhatsAppLogo.jpg"
          alt=""
          width={20}
          height={20}
          aria-hidden
          className="rounded-full"
        />
        Escribir por WhatsApp
      </WhatsAppLink>
    </div>
  );
}

// ============================================================
// PÁGINA
// ============================================================
export default function ChutesMetalicosPage() {
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Fabricación e instalación de chutes metálicos",
    serviceType: "Chutes metálicos para construcción",
    description:
      "Fabricación y montaje en obra de chutes metálicos galvanizados para evacuación de escombros en proyectos de construcción en Lima.",
    url: PAGE_URL,
    image: `${SITE_URL}/img/chutesMetalicos.webp`,
    provider: {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#business`,
      name: "CONSTRUCCIONES GENERALES LUDIER E.I.R.L.",
      url: SITE_URL,
      telephone: PHONE_TEL,
      openingHours: "Mo-Fr 08:00-18:00",
      address: {
        "@type": "PostalAddress",
        addressLocality: "San Juan de Miraflores",
        addressRegion: "Lima",
        addressCountry: "PE",
      },
    },
    areaServed: { "@type": "City", name: "Lima" },
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Servicios", item: `${SITE_URL}/servicios` },
      { "@type": "ListItem", position: 3, name: "Chutes Metálicos", item: PAGE_URL },
    ],
  };

  return (
    <>
      <JsonLd data={serviceLd} />
      <JsonLd data={faqLd} />
      <JsonLd data={breadcrumbLd} />

      <main className="min-h-screen bg-[#F7F7F4] pb-24 text-[#1E2126] lg:pb-0" style={{ fontFamily: FONT_BODY }}>
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#14161A] px-4 py-16 text-white lg:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="relative mx-auto max-w-6xl">
            <nav aria-label="Migas de pan" className="mb-8 flex items-center gap-2 text-sm text-[#8A8F96]">
              <Link href="/servicios" className="inline-flex items-center gap-2 transition-colors hover:text-[#FF5A1F]">
                <ArrowLeft className="h-4 w-4" aria-hidden /> Servicios
              </Link>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <span className="text-white/80">Chutes Metálicos</span>
            </nav>

            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-[#FF5A1F]">Para constructoras y jefes de obra</p>
                <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl" style={{ fontFamily: FONT_DISPLAY }}>
                  Chutes metálicos para construcción y evacuación de escombros en Lima
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#B4B9BF]">
                  Fabricamos e instalamos chutes metálicos galvanizados para que tu obra evacue residuos de forma segura, rápida y cumpliendo la normativa vigente. Tú nos envías los planos; nosotros lo montamos.
                </p>

                <ul className="mt-6 space-y-2 text-sm text-white/90">
                  {[
                    "Acero galvanizado de alta resistencia, fabricado a medida",
                    "Montaje y desmontaje con personal propio certificado",
                    "Cumplimiento de la Norma Técnica G.050 (Seguridad en Construcción)",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FF5A1F]" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>

                <CtaButtons className="mt-8" />
              </div>

              <figure className="relative aspect-[4/3] overflow-hidden rounded-sm border border-[#3A3F45] shadow-2xl">
                <Image
                  src="/img/chutesMetalicos.webp"
                  alt="Chutes metálicos instalados para evacuación de escombros en obra"
                  fill
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <figcaption className="absolute bottom-4 left-4 right-4">
                  <p className="text-sm font-semibold">Chute metálico en obra</p>
                  <p className="text-xs text-white/70">Evacuación de residuos en edificio multifamiliar</p>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* FRANJA DE CONFIANZA */}
        <section className="border-b border-[#E3E1D8] bg-white py-5" aria-label="Por qué trabajar con LUDIER">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 md:grid-cols-4">
            {[
              { icon: ShieldCheck, label: "Acero galvanizado de alta resistencia" },
              { icon: HardHat, label: "Montaje con personal propio" },
              { icon: Clock, label: "Respuesta en 24 horas" },
              { icon: AlertTriangle, label: "Cumplimiento normativa G.050" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center justify-center gap-2 text-sm font-medium">
                <Icon className="h-5 w-5 shrink-0 text-[#FF5A1F]" aria-hidden />
                {label}
              </div>
            ))}
          </div>
        </section>

        {/* CONTENIDO */}
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-3">
          <div className="space-y-16 lg:col-span-2">
            {/* Material */}
            <section aria-labelledby="material">
              <h2 id="material" className="text-2xl font-semibold md:text-3xl" style={{ fontFamily: FONT_DISPLAY }}>
                ¿Por qué elegir un chute metálico galvanizado?
              </h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-[#565C63]">
                En una obra, la evacuación de escombros sin un sistema adecuado genera polvo, riesgos de accidentes y multas. El chute metálico galvanizado es la solución más eficiente:
              </p>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse bg-white text-left text-sm">
                  <caption className="sr-only">Comparación de materiales para chutes</caption>
                  <thead>
                    <tr className="border-b border-[#E3E1D8] bg-[#EFEEE8] text-[#1E2126]">
                      <th scope="col" className="p-3 font-semibold">Tipo de Chute</th>
                      <th scope="col" className="p-3 font-semibold">Ideal para</th>
                      <th scope="col" className="p-3 font-semibold">Resistencia</th>
                      <th scope="col" className="p-3 font-semibold">Costo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MATERIALS.map((m) => (
                      <tr key={m.name} className={`border-b border-[#E3E1D8] ${m.featured ? "bg-[#FFF3EC]" : ""}`}>
                        <th scope="row" className="p-3 font-semibold">
                          {m.name}
                          {m.featured && (
                            <span className="ml-2 rounded-sm bg-[#FF5A1F] px-1.5 py-0.5 text-xs font-medium text-white">
                              Más pedido
                            </span>
                          )}
                        </th>
                        <td className="p-3 text-[#565C63]">{m.use}</td>
                        <td className="p-3 text-[#565C63]">{m.corrosion}</td>
                        <td className="p-3 text-[#565C63]">{m.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { icon: AlertTriangle, title: "Evita multas y accidentes", text: "El RNE y la Norma G.050 exigen sistemas seguros de evacuación. El chute metálico es la solución que los inspectores esperan ver." },
                  { icon: Clock, title: "Ahorra tiempo en obra", text: "Evacuar escombros con chute reduce el tiempo de limpieza y el riesgo de bloqueos en zonas comunes del edificio." },
                  { icon: HardHat, title: "Montaje seguro", text: "Personal propio para instalar con anclajes certificados y coordinación con tu jefe de obra." },
                  { icon: ShieldCheck, title: "Fabricación a medida", text: "Diseñamos el chute según la altura del edificio, diámetro requerido y puntos de descarga." },
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} className="border-l-4 border-[#FF5A1F] bg-white p-5">
                    <Icon className="mb-2 h-5 w-5 text-[#FF5A1F]" aria-hidden />
                    <h3 className="text-base font-semibold">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#565C63]">{text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Proceso */}
            <section aria-labelledby="proceso">
              <h2 id="proceso" className="text-2xl font-semibold md:text-3xl" style={{ fontFamily: FONT_DISPLAY }}>
                Cómo trabajamos con tu constructora
              </h2>
              <ol className="mt-6 grid gap-4 sm:grid-cols-2">
                {PROCESS.map(({ icon: Icon, title, text }, i) => (
                  <li key={title} className="flex gap-4 bg-white p-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#14161A] text-lg text-white" style={{ fontFamily: FONT_DISPLAY }}>
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="flex items-center gap-2 text-base font-semibold">
                        {title}
                        <Icon className="h-4 w-4 text-[#FF5A1F]" aria-hidden />
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-[#565C63]">{text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Proyectos (3 columnas en desktop) */}
            <section aria-labelledby="proyectos">
              <h2 id="proyectos" className="text-2xl font-semibold md:text-3xl" style={{ fontFamily: FONT_DISPLAY }}>
                Obras donde ya instalamos
              </h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-[#565C63]">
                Somos una empresa especializada en soluciones metalmecánicas para proyectos de construcción. Estas son tres de nuestras obras donde instalamos chutes metálicos.
              </p>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {PROJECTS.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    className="group block overflow-hidden border border-[#E3E1D8] bg-white transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF5A1F]"
                  >
                    <div className="relative h-44 bg-[#14161A]">
                      <Image src={p.img} alt={p.alt} fill sizes="(min-width: 640px) 320px, 100vw" className="object-cover" />
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-semibold">{p.title}</p>
                      <p className="mt-1 text-sm text-[#565C63]">{p.text}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#FF5A1F]">
                        Ver proyecto <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Qué enviar */}
            <section aria-labelledby="enviar" className="bg-[#14161A] p-8 text-white">
              <h2 id="enviar" className="text-2xl font-semibold" style={{ fontFamily: FONT_DISPLAY }}>
                Qué enviar para recibir tu cotización
              </h2>
              <ul className="mt-5 space-y-3">
                {QUOTE_CHECKLIST.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/90">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FF5A1F]" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-white/70">¿Aún no tienes todo? Escríbenos igual y te ayudamos a definir el alcance.</p>
              <CtaButtons className="mt-6" />
            </section>

            {/* FAQ */}
            <section aria-labelledby="faq">
              <h2 id="faq" className="text-2xl font-semibold md:text-3xl" style={{ fontFamily: FONT_DISPLAY }}>
                Preguntas frecuentes
              </h2>
              <div className="mt-6 space-y-3">
                {FAQS.map((f) => (
                  <details key={f.q} className="group border border-[#E3E1D8] bg-white p-4 open:border-[#FF5A1F]/50">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
                      {f.q}
                      <ChevronRight className="h-4 w-4 shrink-0 text-[#FF5A1F] transition-transform group-open:rotate-90" aria-hidden />
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-[#565C63]">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <aside className="h-fit space-y-6 lg:sticky lg:top-24">
            <div className="bg-[#FF5A1F] p-6 text-white shadow-xl">
              <h3 className="text-xl font-semibold" style={{ fontFamily: FONT_DISPLAY }}>
                ¿Necesitas evacuar escombros en tu obra?
              </h3>
              <p className="mt-2 mb-6 text-sm text-white/90">
                Envíanos los planos de elevación y te cotizamos en menos de 24 horas.
              </p>
              <Link
                href={QUOTE_URL}
                className="block bg-white px-4 py-3 text-center text-sm font-bold text-[#FF5A1F] transition-colors hover:bg-[#F7F7F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Solicitar cotización
              </Link>
              <WhatsAppLink
                href={WHATSAPP_URL}
                location="sidebar"
                page="chutes"
                className="mt-3 flex items-center justify-center gap-2 border border-white/60 px-4 py-3 text-sm font-semibold transition-colors hover:bg-white/10"
              >
                <Image
                  src="/img/WhatsAppLogo.jpg"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden
                  className="rounded-full"
                />
                WhatsApp
              </WhatsAppLink>
            </div>

            <div className="border border-[#E3E1D8] bg-white p-6">
              <h3 className="mb-4 text-base font-semibold" style={{ fontFamily: FONT_DISPLAY }}>
                Contacto directo
              </h3>
              <ul className="space-y-3 text-sm text-[#565C63]">
                <li>
                  <a href={`tel:${PHONE_TEL}`} className="flex items-center gap-2 hover:text-[#FF5A1F]">
                    <PhoneCall className="h-4 w-4 text-[#FF5A1F]" aria-hidden />
                    {PHONE_DISPLAY}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#FF5A1F]" aria-hidden />
                  Lunes a viernes, 8 a. m. a 6 p. m.
                </li>
                <li className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#FF5A1F]" aria-hidden />
                  San Juan de Miraflores, Lima
                </li>
              </ul>
            </div>
          </aside>
        </div>

        {/* BARRA FIJA MÓVIL */}
        <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-[#3A3F45] bg-[#14161A] lg:hidden">
          <WhatsAppLink
            href={WHATSAPP_URL}
            location="mobile_bar"
            page="chutes"
            className="flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-white"
          >
            <Image
              src="/img/WhatsAppLogo.jpg"
              alt=""
              width={20}
              height={20}
              aria-hidden
              className="rounded-full"
            />
            WhatsApp
          </WhatsAppLink>
          <Link
            href={QUOTE_URL}
            className="flex items-center justify-center gap-2 bg-[#FF5A1F] py-3.5 text-sm font-semibold text-white"
          >
            <ClipboardList className="h-4 w-4" aria-hidden /> Cotizar
          </Link>
        </div>
      </main>
    </>
  );
}