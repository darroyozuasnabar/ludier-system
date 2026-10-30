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
} from "lucide-react";
import WhatsAppLink from "@/components/public/WhatsAppLink";

const SITE_URL = "https://grupoludier.com";
const PAGE_URL = `${SITE_URL}/servicios/barandas-acero-inoxidable`;
const PHONE_DISPLAY = "+51 965 391 256";
const PHONE_TEL = "+51965391256";
const WHATSAPP_URL = `https://wa.me/51965391256?text=${encodeURIComponent(
  "Hola LUDIER, quiero cotizar barandas de acero inoxidable para una obra."
)}`;
const QUOTE_URL = "/contacto?servicio=barandas-acero-inoxidable";

const FONT_DISPLAY = "var(--font-display, Oswald, sans-serif)";
const FONT_BODY = "var(--font-body, Inter, sans-serif)";
const FONT_MONO = 'var(--font-mono, "JetBrains Mono", monospace)';

// ============================================================
// SEO
// ============================================================
export const metadata: Metadata = {
  title: "Barandas de Acero Inoxidable 304 en Lima | LUDIER",
  description:
    "Fabricamos e instalamos barandas de acero inoxidable 304 para edificios multifamiliares y obras en Lima. Montaje con personal propio. Envía tus planos y recibe cotización en 24 horas.",
  keywords: [
    "barandas de acero inoxidable",
    "barandas de acero inoxidable 304",
    "barandas de acero inoxidable lima",
    "barandas para constructoras",
    "barandas metálicas para balcones lima",
    "proveedor de barandas para obras",
    "instalación de barandas en obra",
  ],
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Barandas de Acero Inoxidable para Constructoras | LUDIER",
    description:
      "Fabricación y montaje de barandas de acero inoxidable para proyectos multifamiliares en Lima.",
    url: PAGE_URL,
    siteName: "LUDIER",
    locale: "es_PE",
    type: "website",
    images: [
      {
        url: "/img/proyectos/zendai/zendai_img2.jpg",
        width: 1200,
        height: 630,
        alt: "Barandas de acero inoxidable instaladas en balcones por LUDIER",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Barandas de Acero Inoxidable 304 en Lima | LUDIER",
    description: "Fabricación y montaje de barandas de acero inoxidable 304 para constructoras.",
    images: ["/img/proyectos/zendai/zendai_img2.jpg"],
  },
};

// ============================================================
// CONTENIDO
// ============================================================
const FAQS = [
  {
    q: "¿Qué necesitan para cotizar mi obra?",
    a: "Con los planos de arquitectura (PDF o DWG) o un metrado de barandas por metro lineal, la altura requerida y el tipo de acero ya podemos cotizar. Si aún no tienes definido el material, te recomendamos según la ubicación del proyecto.",
  },
  {
    q: "¿Cuál es la diferencia entre acero inoxidable 304 y 316?",
    a: "El 304 es el estándar para la mayoría de proyectos en Lima y ofrece muy buena resistencia a la corrosión. El 316 incluye molibdeno y resiste mejor ambientes marinos o industriales agresivos, como edificios frente al mar, pero su costo es mayor.",
  },
  {
    q: "¿Cuándo conviene inoxidable y cuándo acero al carbono con pintura epóxica?",
    a: "El acero al carbono con pintura epóxica es una opción más económica para zonas protegidas o interiores. En balcones y terrazas expuestos a humedad, el inoxidable evita repintados y retoques con el tiempo.",
  },
  {
    q: "¿Las barandas cumplen la normativa de seguridad?",
    a: "Fabricamos según el Reglamento Nacional de Edificaciones y las especificaciones técnicas de cada proyecto: altura, separación entre elementos y anclajes se definen con tu supervisión antes de producir.",
  },
  {
    q: "¿Realizan el montaje en obra?",
    a: "Sí. Contamos con personal propio para el montaje y coordinamos con la supervisión de la constructora para asegurar una instalación y un acabado conformes.",
  },
];

const MATERIALS = [
  { name: "Acero al carbono + epóxica", use: "Interiores y zonas protegidas", corrosion: "Media; requiere retoques", cost: "Menor" },
  { name: "Inoxidable 304", use: "Balcones, terrazas y escaleras en general", corrosion: "Alta", cost: "Medio", featured: true },
  { name: "Inoxidable 316", use: "Frente al mar y ambientes agresivos", corrosion: "Muy alta", cost: "Mayor" },
];

const PROCESS = [
  { icon: ClipboardList, title: "Envías planos o metrado", text: "Revisamos el alcance, alturas y tipo de acabado." },
  { icon: Ruler, title: "Cotización y detalle técnico", text: "Propuesta con material, acabado y plazo de entrega." },
  { icon: Factory, title: "Fabricación en taller", text: "Producción por tramos, alineada al avance de tu obra." },
  { icon: Wrench, title: "Montaje en obra", text: "Instalación con personal propio y coordinación con supervisión." },
];

const QUOTE_CHECKLIST = [
  "Planos de arquitectura (PDF o DWG) o metrado en metros lineales",
  "Ubicación del proyecto (distrito y cercanía al mar)",
  "Tipo de baranda: balcón, escalera, terraza o pasamanos",
  "Fecha en que necesitas el inicio del montaje",
];

const PROJECTS = [
  {
    href: "/proyectos/zendai",
    img: "/img/zendai.png",
    alt: "Barandas metálicas en balcones del proyecto Zendai, La Victoria",
    title: "Proyecto Zendai · La Victoria",
    text: "Suministro e instalación de barandas metálicas en balcones de un edificio de 28 pisos.",
  },
  {
    href: "/proyectos/qantua",
    img: "/img/Qantua.jpg",
    alt: "Barandas, pasamanos y escaleras del proyecto Qantua, Cercado de Lima",
    title: "Proyecto Qantua · Cercado de Lima",
    text: "Barandas, pasamanos y escaleras para las Torres de la Fase 1 y Fase 2.",
  },
];

const OTHER_SUBCATEGORIES = [
  {
    slug: "barandas-pasamanos",
    title: "Barandas metálicas",
    description: "Barandas de seguridad y decorativas para balcones, escaleras y terrazas.",
    img: "/img/Barandasmetálicas.png",
  },
  {
    slug: "barandas-pasamanos",
    title: "Pasamanos metálicos",
    description: "Pasamanos para escaleras, rampas y pasillos con diseño ergonómico.",
    img: "/img/PasmanosMetalicos.jpg",
  },
  {
    slug: "barandas-pasamanos",
    title: "Barandas para balcones",
    description: "Diseños que combinan seguridad y estética para balcones residenciales.",
    img: "/img/Qantua1_foto2.jpg",
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
        page="barandas-inoxidable"
        className="inline-flex items-center gap-2 border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <MessageCircle className="h-4 w-4" aria-hidden /> Escribir por WhatsApp
      </WhatsAppLink>
    </div>
  );
}

// ============================================================
// PÁGINA
// ============================================================
export default function BarandasInoxidablePage() {
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Fabricación e instalación de barandas de acero inoxidable",
    serviceType: "Barandas metálicas para construcción",
    description:
      "Fabricación y montaje en obra de barandas de acero inoxidable 304 para balcones, escaleras y terrazas en proyectos de construcción en Lima.",
    url: PAGE_URL,
    image: `${SITE_URL}/img/proyectos/zendai/zendai_img2.jpg`,
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
      { "@type": "ListItem", position: 3, name: "Barandas de acero inoxidable", item: PAGE_URL },
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
              <span className="text-white/80">Barandas de acero inoxidable</span>
            </nav>

            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-[#FF5A1F]">Para constructoras e inmobiliarias</p>
                <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl" style={{ fontFamily: FONT_DISPLAY }}>
                  Barandas de acero inoxidable para obras y constructoras en Lima
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#B4B9BF]">
                  Fabricamos e instalamos <strong className="text-white">barandas de acero inoxidable</strong> 304 y 316 para balcones, escaleras y terrazas en proyectos residenciales y comerciales de Lima. Tú nos envías los planos; nosotros entregamos la baranda instalada, con el avance que tu obra necesita.
                </p>

                <ul className="mt-6 space-y-2 text-sm text-white/90">
                  {[
                    "Acero inoxidable 304, con opción 316 para zonas marinas",
                    "Montaje con personal propio, coordinado con tu supervisión",
                    "Cotización en 24 horas con planos o metrado",
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
                  src="/img/proyectos/zendai/zendai_img2.jpg"
                  alt="Barandas de acero inoxidable instaladas en balcones de un proyecto residencial en Lima"
                  fill
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <figcaption className="absolute bottom-4 left-4 right-4">
                  <p className="text-sm font-semibold">Proyecto Zendai, La Victoria</p>
                  <p className="text-xs text-white/70">Barandas metálicas y de acero inoxidable</p>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* FRANJA DE CONFIANZA */}
        <section className="border-b border-[#E3E1D8] bg-white py-5" aria-label="Por qué trabajar con LUDIER">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 md:grid-cols-4">
            {[
              { icon: ShieldCheck, label: "Acero inoxidable 304 y 316" },
              { icon: HardHat, label: "Montaje con personal propio" },
              { icon: Clock, label: "Respuesta en 24 horas" },
              { icon: Building2, label: "Obras multifamiliares en Lima" },
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
                ¿Qué material elegir para tus barandas de acero inoxidable?
              </h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-[#565C63]">
                En Lima la humedad y la brisa marina desgastan el acero convencional. Fabricamos barandas de acero inoxidable en grado 304 o 316, y también en acero al carbono con pintura epóxica como alternativa más económica. Esta es la guía rápida para decidir:
              </p>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse bg-white text-left text-sm">
                  <caption className="sr-only">Comparación de materiales para barandas de acero inoxidable</caption>
                  <thead>
                    <tr className="border-b border-[#E3E1D8] bg-[#EFEEE8] text-[#1E2126]">
                      <th scope="col" className="p-3 font-semibold">Material</th>
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
                  { icon: CheckCircle2, title: "Durabilidad en exteriores", text: "El inoxidable evita repintados y retoques frecuentes en balcones y terrazas expuestos." },
                  { icon: FileCheck, title: "Diseño según normativa", text: "Alturas, separaciones y anclajes conforme al RNE y a las especificaciones de tu proyecto." },
                  { icon: HardHat, title: "Montaje en obra", text: "Personal propio para instalar en edificios en construcción, coordinado con tu supervisión." },
                  { icon: ShieldCheck, title: "Acabado a elección", text: "Brillante o satinado, según el criterio de arquitectura." },
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} className="border-l-4 border-[#FF5A1F] bg-white p-5">
                    <Icon className="mb-2 h-5 w-5 text-[#FF5A1F]" aria-hidden />
                    <h3 className="text-base font-semibold">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#565C63]">{text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ¿Por qué elegir acero inoxidable? (NUEVO BLOQUE SEO) */}
            <section aria-labelledby="por-que-inoxidable">
              <h2 id="por-que-inoxidable" className="text-2xl font-semibold md:text-3xl" style={{ fontFamily: FONT_DISPLAY }}>
                ¿Por qué elegir barandas de acero inoxidable?
              </h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-[#565C63]">
                Las barandas de acero inoxidable son la solución preferida por constructoras e inmobiliarias para proyectos de alta exigencia. Sus ventajas frente al acero al carbono con pintura o al hierro forjado son claras:
              </p>

              <ul className="mt-5 max-w-2xl space-y-3 text-[#565C63]">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#FF5A1F]" aria-hidden />
                  <span><strong className="text-[#1E2126]">Resistencia superior a la corrosión:</strong> el inoxidable 304 resiste la humedad costera de Lima por décadas, sin óxido ni repintados.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#FF5A1F]" aria-hidden />
                  <span><strong className="text-[#1E2126]">Mantenimiento mínimo:</strong> a diferencia del acero pintado, no requiere repintado cada 2-3 años. Solo limpieza periódica.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#FF5A1F]" aria-hidden />
                  <span><strong className="text-[#1E2126]">Estética premium:</strong> el acabado brillante o satinado del acero inoxidable aporta valor arquitectónico a la fachada.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#FF5A1F]" aria-hidden />
                  <span><strong className="text-[#1E2126]">Cumplimiento normativo:</strong> fabricamos según el RNE y las especificaciones técnicas de tu proyecto.</span>
                </li>
              </ul>
            </section>

            {/* Proceso */}
            <section aria-labelledby="proceso">
              <h2 id="proceso" className="text-2xl font-semibold md:text-3xl" style={{ fontFamily: FONT_DISPLAY }}>
                Cómo fabricamos e instalamos tus barandas de acero inoxidable
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

            {/* Proyectos */}
            <section aria-labelledby="proyectos">
              <h2 id="proyectos" className="text-2xl font-semibold md:text-3xl" style={{ fontFamily: FONT_DISPLAY }}>
                Obras donde ya instalamos barandas de acero inoxidable
              </h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-[#565C63]">
                Somos una empresa especializada en soluciones metalmecánicas para proyectos de construcción. Contamos con experiencia comprobada en carpintería metálica para edificios multifamiliares. Estos son dos de nuestros proyectos.
              </p>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
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

            {/* Otras subcategorías */}
            <section aria-labelledby="otras-subcategorias">
              <h2 id="otras-subcategorias" className="text-2xl font-semibold md:text-3xl" style={{ fontFamily: FONT_DISPLAY }}>
                Otras subcategorías de Barandas y Pasamanos
              </h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-[#565C63]">
                ¿Buscas otro tipo de baranda o pasamanos? Estas son las otras soluciones que ofrecemos dentro de esta categoría:
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {OTHER_SUBCATEGORIES.map((sub, i) => (
                  <Link
                    key={i}
                    href={`/servicios/${sub.slug}`}
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
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-[#1E2126] group-hover:text-[#FF5A1F] transition-colors">
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
                Preguntas frecuentes sobre barandas de acero inoxidable
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
                ¿Tienes los planos de tu obra?
              </h3>
              <p className="mt-2 mb-6 text-sm text-white/90">
                Envíalos o comparte el metrado y te respondemos en menos de 24 horas.
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
                page="barandas-inoxidable"
                className="mt-3 flex items-center justify-center gap-2 border border-white/60 px-4 py-3 text-sm font-semibold transition-colors hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
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
            page="barandas-inoxidable"
            className="flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-white"
          >
            <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
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
