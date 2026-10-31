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
  Sun,
  Droplets,
  Thermometer,
  ArrowRight,
} from "lucide-react";
import WhatsAppLink from "@/components/public/WhatsAppLink";

const SITE_URL = "https://grupoludier.com";
const PAGE_URL = `${SITE_URL}/servicios/estructuras-metalicas-para-techos`;
const PHONE_DISPLAY = "+51 965 391 256";
const PHONE_TEL = "+51965391256";
const WHATSAPP_URL = `https://wa.me/51965391256?text=${encodeURIComponent(
  "Hola LUDIER, quiero cotizar techos metálicos o coberturas para mi obra. ¿Me pueden ayudar?"
)}`;
const QUOTE_URL = "/contacto?servicio=estructuras-metalicas";

const FONT_DISPLAY = "var(--font-display, Oswald, sans-serif)";
const FONT_BODY = "var(--font-body, Inter, sans-serif)";
const FONT_MONO = 'var(--font-mono, "JetBrains Mono", monospace)';

// ============================================================
// SEO
// ============================================================
export const metadata: Metadata = {
  // FIX SEO TECHOS: ambas keywords principales y marca única mediante title.absolute.
  title: { absolute: "Estructuras Metálicas para Techos y Techos Metálicos | LUDIER" },
  description:
    "Fabricamos e instalamos estructuras metálicas para techos y techos metálicos en Lima. Coberturas para naves industriales, almacenes y azoteas. Cotiza en 24h.",
  keywords: [
    // FIX SEO TECHOS: variaciones exactas sin duplicar las keywords existentes.
    "estructuras metálicas para techos",
    "techos metálicos",
    "modelos de estructuras metálicas para techos",
    "techos metálicos para naves industriales",
    "techos metálicos lima",
    "coberturas metálicas",
    "techos para naves industriales",
    "estructuras para azotea",
    "estructuras metálicas para azoteas",
    "cobertura de policarbonato",
  ],
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Estructuras Metálicas para Techos y Coberturas | LUDIER",
    description:
      "Soluciones de techado metálico para naves industriales, estacionamientos y azoteas. Fabricación a medida y montaje seguro en Lima.",
    url: PAGE_URL,
    siteName: "LUDIER",
    locale: "es_PE",
    type: "website",
    images: [
      {
        url: "/img/coberturasMetalicas.jpg",
        width: 1200,
        height: 630,
        alt: "Estructura metálica para techos instalada por LUDIER",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Estructuras Metálicas para Techos | LUDIER",
    description: "Techos metálicos y coberturas de alta resistencia para constructoras en Lima.",
    images: ["/img/coberturasMetalicas.jpg"],
  },
};

// ============================================================
// CONTENIDO
// ============================================================
const FAQS = [
  {
    q: "¿Qué tipo de techo metálico me conviene?",
    a: "Depende del uso: para naves industriales y almacenes, el techo de calamina o panel aislante es el estándar. Para estacionamientos y azoteas, las coberturas de policarbonato o las estructuras tipo tijeral son ideales. Envíanos tu plano y te asesoramos.",
  },
  {
    q: "¿El techo metálico requiere mantenimiento?",
    a: "Un techo con acero galvanizado y pintura electrostática puede durar décadas sin mantenimiento. Si el ambiente es muy corrosivo (cerca al mar o industria química), recomendamos una revisión anual de anclajes y sellados.",
  },
  {
    q: "¿Resisten los techos metálicos los sismos y el viento?",
    a: "Sí. Diseñamos y fabricamos según la Norma E.030 de Diseño Sismorresistente y E.020 de Cargas. El acero es un material dúctil que disipa energía, lo que lo hace muy seguro frente a sismos y vientos fuertes.",
  },
  {
    q: "¿Ofrecen aislación térmica para techos metálicos?",
    a: "Sí. Podemos instalar paneles con poliuretano o lana de vidrio para reducir el calor en verano y el frío en invierno. Especialmente recomendado para naves industriales y almacenes.",
  },
  {
    q: "¿En cuánto tiempo entregan y montan el techo?",
    a: "El tiempo varía según la complejidad. Para un techo de 100 m², la fabricación toma 1-2 semanas y el montaje 2-3 días. Al enviar tus planos te damos un plazo exacto.",
  },
];

const MATERIALS = [
  { name: "Calamina Galvanizada", use: "Naves industriales, almacenes, techos livianos", corrosion: "Alta", cost: "Menor", featured: true },
  { name: "Panel Aislante (Poliuretano)", use: "Cámaras frigoríficas, naves con control de temperatura", corrosion: "Muy alta", cost: "Mayor" },
  { name: "Cobertura de Policarbonato", use: "Estacionamientos, patios, azoteas", corrosion: "Alta", cost: "Medio" },
  { name: "Teja Metálica", use: "Proyectos residenciales, techos decorativos", corrosion: "Alta", cost: "Mayor" },
];

const PROCESS = [
  { icon: ClipboardList, title: "Envías planos o medidas", text: "Revisamos el área, altura y tipo de cobertura requerida." },
  { icon: Ruler, title: "Cotización y diseño", text: "Propuesta con material, aislación y plazo de entrega." },
  { icon: Factory, title: "Fabricación en taller", text: "Producción por tramos, alineada al avance de tu obra." },
  { icon: Wrench, title: "Montaje en obra", text: "Instalación con personal propio y coordinación con supervisión." },
];

const QUOTE_CHECKLIST = [
  "Planos o croquis de la estructura (PDF o DWG)",
  "Dimensiones del área a techar (metros cuadrados)",
  "Ubicación del proyecto (distrito)",
  "Uso del espacio (nave, estacionamiento, azotea)",
  "Si necesitas aislación térmica y/o acústica",
];

// 👇 SOLO PROYECTO REAL (QANTUA) + CTA AL PORTAFOLIO
const PROJECTS = [
  {
    href: "/proyectos/qantua",
    img: "/img/proyectos/qantua/25-cobertura-policarbonato-ducto-gas-qantua.png",
    alt: "Estructura metálica con cobertura de policarbonato instalada en el Proyecto Qantua por LUDIER",
    title: "Proyecto Qantua · Cercado de Lima",
    text: "Fabricación e instalación de estructura metálica con cobertura de policarbonato para protección de ducto técnico en azotea.",
    isCta: false,
  },
  {
    href: "/proyectos",
    img: "/img/coberturasMetalicas.jpg",
    alt: "Ver todos los proyectos de estructuras metálicas de LUDIER",
    title: "Ver portafolio completo",
    text: "Explora todas nuestras obras de estructuras metálicas, techos, coberturas y soluciones para constructoras en Lima.",
    isCta: true,
  },
];

// 👇 SUBCATEGORÍAS HERMANAS DE "ESTRUCTURAS METÁLICAS"
// (excluye "Techos metálicos", que es esta misma ficha)
// Los ids coinciden con los que asigna ServicioDetalleClient a cada tarjeta.
const OTHER_SUBCATEGORIES = [
  {
    id: "estructuras-para-azotea",
    title: "Estructuras para azotea",
    description: "Estructuras metálicas para tanques, equipos de aire acondicionado, paneles solares y telecomunicaciones.",
    img: "/img/EstructurasAzotea.png",
  },
  {
    id: "coberturas-metalicas",
    title: "Coberturas metálicas",
    description: "Coberturas ligeras y resistentes para techos, estacionamientos, patios y áreas de descanso.",
    img: "/img/coberturasMetalicas.jpg",
  },
  {
    id: "marquesinas",
    title: "Marquesinas",
    description: "Marquesinas metálicas para proteger accesos, entradas de vehículos y zonas de carga.",
    img: "/img/Marquesinas_Metalicas.jpg",
  },
  {
    id: "plataformas-metalicas",
    title: "Plataformas metálicas",
    description: "Plataformas de trabajo y acceso, pasarelas y soporte de equipos con perfiles de alta resistencia.",
    img: "/img/Plataformas-metalicas.jpg",
  },
  {
    id: "soportes-metalicos",
    title: "Soportes metálicos",
    description: "Soportes estructurales para tuberías, ductos, climatización y sistemas de energía.",
    img: "/img/SoportesMetalicos.jpg",
  },
  {
    id: "vigas-metalicas",
    title: "Vigas metálicas",
    description: "Vigas de acero estructural para construcciones de gran altura y grandes luces.",
    img: "/img/vigasMetalicas.jpg",
  },
  {
    id: "estructuras-especiales",
    title: "Estructuras especiales",
    description: "Soluciones estructurales a medida: estadios, puentes, pasarelas, pérgolas y elementos arquitectónicos.",
    img: "/img/Estructuras_especiales.jpg",
  },
  {
    id: "estructuras-para-paneles-solares",
    title: "Estructuras para paneles solares",
    description: "Estructuras metálicas diseñadas para el montaje de paneles solares con inclinación óptima.",
    img: "/img/estructuraPanelesSolares.png",
  },
  {
    id: "cuartos-metalicos-para-equipos",
    title: "Cuartos metálicos para equipos",
    description: "Cuartos modulares metálicos para equipos eléctricos, bombas, generadores y climatización.",
    img: "/img/cuartosMetalicos.jpg",
  },
  {
    id: "jaulas-metalicas",
    title: "Jaulas metálicas",
    description: "Jaulas de seguridad para almacenamiento de materiales y protección de áreas sensibles.",
    img: "/img/Jaulas_metálicas.jpg",
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
        page="techos"
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
export default function TechosMetalicosPage() {
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    // FIX SEO TECHOS: alinear el nombre del servicio con la oferta del hero.
    name: "Fabricación e instalación de estructuras metálicas para techos y techos metálicos",
    serviceType: "Techos metálicos y coberturas",
    description:
      "Fabricación y montaje en obra de estructuras metálicas para techos, coberturas y azoteas en proyectos de construcción en Lima.",
    url: PAGE_URL,
    image: `${SITE_URL}/img/coberturasMetalicas.jpg`,
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
      { "@type": "ListItem", position: 3, name: "Techos Metálicos", item: PAGE_URL },
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
            <nav aria-label="Migas de pan" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-[#8A8F96]">
              <Link href="/servicios" className="inline-flex items-center gap-2 transition-colors hover:text-[#FF5A1F]">
                <ArrowLeft className="h-4 w-4" aria-hidden /> Servicios
              </Link>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <Link
                href="/servicios/estructuras-metalicas"
                className="transition-colors hover:text-[#FF5A1F]"
              >
                Estructuras Metálicas
              </Link>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <span className="text-white/80">Techos Metálicos</span>
            </nav>

            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-[#FF5A1F]">Para constructoras y proyectos industriales</p>
                <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl" style={{ fontFamily: FONT_DISPLAY }}>
                  {/* FIX SEO TECHOS: ampliar el H1 sin modificar sus clases. */}
                  Estructuras Metálicas para Techos y Techos Metálicos en Lima
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#B4B9BF]">
                  {/* FIX SEO TECHOS: techos metálicos y naves industriales al inicio del párrafo. */}
                  Fabricamos e instalamos techos metálicos para naves industriales, almacenes y azoteas, además de coberturas de policarbonato. Tú nos envías los planos; nosotros entregamos el techo montado, listo para usar.
                </p>

                <ul className="mt-6 space-y-2 text-sm text-white/90">
                  {[
                    "Acero galvanizado de alta resistencia, fabricado a medida",
                    "Aislación térmica y acústica opcional",
                    "Montaje con personal propio, coordinado con tu supervisión",
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
                  src="/img/coberturasMetalicas.jpg"
                  alt="Estructura metálica para techos instalada por LUDIER"
                  fill
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <figcaption className="absolute bottom-4 left-4 right-4">
                  <p className="text-sm font-semibold">Techos metálicos de alta durabilidad</p>
                  <p className="text-xs text-white/70">Diseñados para naves industriales y azoteas</p>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* CHIPS DE SUBCATEGORÍA */}
        <nav
          aria-label="Otras subcategorías de estructuras metálicas"
          className="border-b border-[#E3E1D8] bg-white"
        >
          <div className="mx-auto max-w-6xl px-4 py-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-[#8B8F86]">
              Otras soluciones de Estructuras Metálicas
            </p>
            {/* FIX OVERFLOW MOBILE: D — permitir reducir el ancho mínimo de cada chip. */}
            <ul className="flex flex-wrap gap-2">
              {OTHER_SUBCATEGORIES.map((sub) => (
                <li key={sub.id} className="min-w-0">
                  <Link
                    href={`/servicios/estructuras-metalicas#${sub.id}`}
                    className="inline-flex items-center gap-1.5 border border-[#E3E1D8] bg-[#F7F7F4] px-3.5 py-2 text-sm font-medium text-[#1E2126] transition-colors hover:border-[#FF5A1F] hover:bg-[#FFF3EC] hover:text-[#FF5A1F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A1F]"
                  >
                    {sub.title}
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* FRANJA DE CONFIANZA */}
        <section className="border-b border-[#E3E1D8] bg-white py-5" aria-label="Por qué trabajar con LUDIER">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 md:grid-cols-4">
            {[
              { icon: ShieldCheck, label: "Acero galvanizado de alta resistencia" },
              { icon: HardHat, label: "Montaje con personal propio" },
              { icon: Clock, label: "Respuesta en 24 horas" },
              { icon: AlertTriangle, label: "Cumplimiento normativa E.030 y E.020" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center justify-center gap-2 text-sm font-medium">
                <Icon className="h-5 w-5 shrink-0 text-[#FF5A1F]" aria-hidden />
                {label}
              </div>
            ))}
          </div>
        </section>

        {/* CONTENIDO */}
        {/* FIX OVERFLOW MOBILE: A — columna explícita y contenido reducible en móvil. */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 py-16 lg:grid-cols-3">
          <div className="min-w-0 space-y-16 lg:col-span-2">
            {/* Material */}
            <section aria-labelledby="material">
              <h2 id="material" className="text-2xl font-semibold md:text-3xl" style={{ fontFamily: FONT_DISPLAY }}>
                {/* FIX SEO TECHOS: orientar la elección del material a proyectos de obra. */}
                ¿Por qué elegir un techo metálico para tu obra?
              </h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-[#565C63]">
                En Lima, los techos de concreto o fibrocemento se agrietan con el tiempo y requieren mantenimiento constante. El techo metálico galvanizado ofrece una solución duradera y de bajo mantenimiento:
              </p>

              {/* FIX OVERFLOW MOBILE: E — limitar el scroll horizontal al wrapper de tabla. */}
              <div className="mt-6 overflow-x-auto max-w-full">
                <table className="w-full min-w-[560px] border-collapse bg-white text-left text-sm">
                  <caption className="sr-only">Comparación de materiales para techos</caption>
                  <thead>
                    <tr className="border-b border-[#E3E1D8] bg-[#EFEEE8] text-[#1E2126]">
                      <th scope="col" className="p-3 font-semibold">Tipo de Techo</th>
                      <th scope="col" className="p-3 font-semibold">Ideal para</th>
                      <th scope="col" className="p-3 font-semibold">Resistencia a la corrosión</th>
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
                  { icon: Sun, title: "Aislación térmica", text: "Los paneles con poliuretano o lana de vidrio reducen la temperatura interior hasta 10°C en verano." },
                  { icon: Droplets, title: "Resistencia a la lluvia", text: "El acero galvanizado no se oxida ni se filtra, incluso en las lluvias más intensas de Lima." },
                  { icon: HardHat, title: "Montaje seguro", text: "Personal propio para instalar con anclajes certificados y coordinación con tu jefe de obra." },
                  { icon: ShieldCheck, title: "Fabricación a medida", text: "Diseñamos el techo según el área, altura y tipo de cubierta que necesites." },
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} className="border-l-4 border-[#FF5A1F] bg-white p-5">
                    <Icon className="mb-2 h-5 w-5 text-[#FF5A1F]" aria-hidden />
                    <h3 className="text-base font-semibold">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#565C63]">{text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* FIX SEO TECHOS: sección B2B integrada con el estilo de las secciones existentes. */}
            <section aria-labelledby="naves-industriales">
              <h2 id="naves-industriales" className="text-2xl font-semibold md:text-3xl" style={{ fontFamily: FONT_DISPLAY }}>
                Techos metálicos para naves industriales y almacenes
              </h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-[#565C63]">
                Las naves industriales y los almacenes requieren estructuras de gran luz que permitan disponer de espacios de trabajo amplios. Ofrecemos cubiertas de calamina con aislación térmica o paneles aislantes, según el uso de la nave. Fabricamos y montamos conforme a los planos estructurales del proyecto, cumpliendo la norma E.030 de Diseño Sismorresistente aplicable a la obra.
              </p>
              <Link
                href="/contacto?from=techos-naves"
                className="mt-4 inline-flex items-center gap-2 py-3 text-sm font-semibold text-[#FF5A1F] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A1F]"
              >
                Cotizar techo para nave industrial
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </section>

            {/* Proceso */}
            <section aria-labelledby="proceso">
              <h2 id="proceso" className="text-2xl font-semibold md:text-3xl" style={{ fontFamily: FONT_DISPLAY }}>
                {/* FIX SEO TECHOS: explicitar fabricación y keyword principal. */}
                Cómo fabricamos tus estructuras metálicas para techos
              </h2>
              <ol className="mt-6 grid gap-4 sm:grid-cols-2">
                {PROCESS.map(({ icon: Icon, title, text }, i) => (
                  <li key={title} className="flex gap-4 bg-white p-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#14161A] text-lg text-white" style={{ fontFamily: FONT_DISPLAY }}>
                      {i + 1}
                    </span>
                    {/* FIX OVERFLOW MOBILE: C — permitir que el texto del proceso se reduzca. */}
                    <div className="min-w-0">
                      <h3 className="flex items-center gap-2 text-base font-semibold break-words">
                        {title}
                        <Icon className="h-4 w-4 text-[#FF5A1F]" aria-hidden />
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-[#565C63]">{text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Proyectos */}
            <section aria-labelledby="proyectos">
              <h2 id="proyectos" className="text-2xl font-semibold md:text-3xl" style={{ fontFamily: FONT_DISPLAY }}>
                Obras donde ya instalamos
              </h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-[#565C63]">
                Somos una empresa especializada en soluciones metalmecánicas para proyectos de construcción. Estos son dos de nuestros proyectos.
              </p>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {PROJECTS.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    className={`group block overflow-hidden border bg-white transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF5A1F] ${
                      p.isCta ? "border-[#FF5A1F]/30 hover:border-[#FF5A1F]" : "border-[#E3E1D8]"
                    }`}
                  >
                    <div className="relative h-44 bg-[#14161A]">
                      <Image src={p.img} alt={p.alt} fill sizes="(min-width: 640px) 320px, 100vw" className="object-cover" />
                      {p.isCta && (
                        <div className="absolute inset-0 bg-[#14161A]/60 flex items-center justify-center">
                          <span className="text-white font-semibold text-lg flex items-center gap-2" style={{ fontFamily: FONT_DISPLAY }}>
                            Ver todos <ArrowRight className="h-5 w-5" />
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-semibold">{p.title}</p>
                      <p className="mt-1 text-sm text-[#565C63]">{p.text}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#FF5A1F]">
                        {p.isCta ? "Ver portafolio" : "Ver proyecto"} <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Otras subcategorías */}
            <section aria-labelledby="otras-subcategorias">
              <h2 id="otras-subcategorias" className="text-2xl font-semibold md:text-3xl" style={{ fontFamily: FONT_DISPLAY }}>
                Otras subcategorías de Estructuras Metálicas
              </h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-[#565C63]">
                Además de techos y coberturas, dentro de Estructuras Metálicas fabricamos estas soluciones:
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {OTHER_SUBCATEGORIES.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/servicios/estructuras-metalicas#${sub.id}`}
                    className="group flex items-center gap-4 bg-white border border-[#E3E1D8] p-4 rounded-sm hover:border-[#FF5A1F]/40 hover:shadow-md transition-all"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm">
                      <Image
                        src={sub.img}
                        alt={sub.title}
                        fill
                        sizes="64px"
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    {/* FIX OVERFLOW MOBILE: B — ajustar títulos largos junto a la miniatura fija. */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-[#1E2126] group-hover:text-[#FF5A1F] transition-colors break-words">
                        {sub.title}
                      </h3>
                      <p className="text-xs text-[#565C63] line-clamp-2 mt-1">{sub.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[#8B8F86] transition-transform group-hover:translate-x-1" aria-hidden />
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
          {/* FIX OVERFLOW MOBILE: A — evitar que el sidebar imponga un ancho mínimo. */}
          <aside className="min-w-0 h-fit space-y-6 lg:sticky lg:top-24">
            <div className="bg-[#FF5A1F] p-6 text-white shadow-xl">
              <h3 className="text-xl font-semibold" style={{ fontFamily: FONT_DISPLAY }}>
                ¿Necesitas techar tu obra?
              </h3>
              <p className="mt-2 mb-6 text-sm text-white/90">
                Envíanos los planos o medidas y te cotizamos en menos de 24 horas.
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
                page="techos"
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
        {/* FIX MOBILE F1: reservar el área segura inferior del dispositivo. */}
        <div style={{ paddingBottom: "env(safe-area-inset-bottom)" }} className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-[#3A3F45] bg-[#14161A] lg:hidden">
          <WhatsAppLink
            href={WHATSAPP_URL}
            location="mobile_bar"
            page="techos"
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
