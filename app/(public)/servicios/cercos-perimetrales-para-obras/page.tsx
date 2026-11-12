import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Factory,
  Fence,
  FileCheck,
  HardHat,
  MapPin,
  MessageCircle,
  PhoneCall,
  Ruler,
  ShieldCheck,
  Truck,
} from "lucide-react";
import WhatsAppLink from "@/components/public/WhatsAppLink";
import Reveal from "@/components/public/Reveal";

const SITE_URL = "https://grupoludier.com";
const PAGE_PATH = "/servicios/cercos-perimetrales-para-obras";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const QUOTE_URL = "/contacto?from=landing-cercos";
const TITLE = "Cerco Perimetral para Obra en Lima | Fase 0 | LUDIER";
const DESCRIPTION =
  "Instalamos tu cerco perimetral desde la Fase 0. Infraestructura y experiencia para escalar a chutes, barandas y estructuras. Norma G.050. Cotiza en 24h.";
const WHATSAPP_URL = `https://wa.me/51965391256?text=${encodeURIComponent(
  "Hola LUDIER, necesito cotizar un cerco perimetral para mi obra. ¿Me pueden ayudar?"
)}`;

const FONT_DISPLAY = "var(--font-display, Oswald, sans-serif)";
const FONT_BODY = "var(--font-body, Inter, sans-serif)";
const FONT_MONO = 'var(--font-mono, "JetBrains Mono", monospace)';
const PHONE_DISPLAY = "+51 965 391 256";
const PHONE_TEL = "+51965391256";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "cerco perimetral para obra",
    "cerramientos temporales",
    "instalacion de cerco perimetral",
    "cercos perimetrales para constructoras",
    "fase 0 de obra",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "LUDIER",
    locale: "es_PE",
    type: "website",
    images: [{ url: "/img/proyectos/qantua/28-vistaIntegralQantuaF1&F2.jpeg", alt: "Cerco perimetral instalado por LUDIER en obra" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/img/proyectos/qantua/28-vistaIntegralQantuaF1&F2.jpeg"],
  },
};

const TRUST_ITEMS = [
  { icon: ShieldCheck, text: "Homologados por Hodelpe" },
  { icon: HardHat, text: "Personal propio" },
  { icon: Clock, text: "Respuesta en 24h" },
  { icon: FileCheck, text: "Cumplimiento G.050" },
];

const FASES = [
  {
    fase: "Fase 0",
    title: "Cerco Perimetral",
    text: "Instalamos el cerco que protege tu obra desde el día 1. Delimitación, seguridad y cumplimiento normativo desde el inicio.",
    icon: Fence,
    color: "bg-[#FF5A1F]",
  },
  {
    fase: "Fase 15%",
    title: "Chutes Metálicos",
    text: "Evacuamos los escombros de forma segura y eficiente. El sistema que mantiene tu obra limpia y operativa.",
    icon: Truck,
    color: "bg-[#FF5A1F]/80",
  },
  {
    fase: "Fase 50%",
    title: "Barandas y Estructuras",
    text: "Cerramos la obra con los acabados metalmecánicos de mayor exigencia. Calidad que se ve y se siente.",
    icon: Factory,
    color: "bg-[#FF5A1F]/60",
  },
];

const PROJECTS = [
  {
    title: "Proyecto Qantua",
    cliente: "Grupo LAR",
    img: "/img/Qantua.jpg",
    text: "En Qantua instalamos el cerco perimetral y, durante la obra, ejecutamos los chutes y las barandas de todas las torres. Un solo proveedor para múltiples fases.",
    href: "/proyectos/qantua",
  },
  {
    title: "Proyecto Zendai",
    cliente: "Grupo LAR",
    img: "/img/zendai.png",
    text: "En Zendai instalamos las barandas de seguridad en los balcones. Capacidad para ejecutar acabados de alta exigencia.",
    href: "/proyectos/zendai",
  },
  {
    title: "Hotel Hilton",
    cliente: "MDP Construcciones",
    img: "/img/hilton-lima-miraflores.jpg",
    text: "En el Hilton instalamos el chute metálico de 19 pisos. Capacidad para ejecutar sistemas de evacuación de gran altura.",
    href: "/proyectos/hilton",
  },
];

const PRICES = [
  { tipo: "Cerco temporal de obra (malla + postes livianos)", precio: "Desde S/ 95 / ml" },
  { tipo: "Cerco de malla electrosoldada galvanizada (2 m)", precio: "Desde S/ 180 / ml" },
  { tipo: "Cerco de rejas metálicas (2 m)", precio: "Desde S/ 320 / ml" },
  { tipo: "Cerco de seguridad industrial (2.5 m + alambre)", precio: "Desde S/ 420 / ml" },
  { tipo: "Cerco tipo panel modular", precio: "Desde S/ 250 / ml" },
];

const FAQS = [
  { q: "¿Cuánto tiempo tarda instalar un cerco perimetral?", a: "Cerco de malla estándar: 100 metros lineales en 5-7 días. Cercos industriales reforzados: 1-2 semanas. Cercos con cimentación especial: sumar 3-5 días." },
  { q: "¿Se puede mover un cerco de obra de una ubicación a otra?", a: "Sí. Los cercos tipo panel modular están diseñados para desmontarse y reinstalarse. Los cercos de malla fija son más difíciles de mover pero también es posible con planificación." },
  { q: "¿Ofrecen mantenimiento durante la obra?", a: "Sí. Ofrecemos planes de mantenimiento con visitas periódicas para revisar postes, ajustar paneles y reparar daños." },
  { q: "¿Pueden instalar un cerco perimetral con portón incluido?", a: "Sí. Fabricamos cerco + portón como solución integral. El portón puede ser manual o automatizado según necesidad." },
];

const serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Fabricación e instalación de cercos perimetrales para obras",
  serviceType: "Cerco perimetral para construcción",
  description: DESCRIPTION,
  url: PAGE_URL,
  areaServed: "Lima",
  provider: {
    "@type": "Organization",
    "@id": `${SITE_URL}/#business`,
    name: "CONSTRUCCIONES GENERALES LUDIER E.I.R.L.",
    url: SITE_URL,
    telephone: "+51965391256",
  },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Servicios", item: `${SITE_URL}/servicios` },
    { "@type": "ListItem", position: 3, name: "Cerco Perimetral", item: PAGE_URL },
  ],
};

export default function CercosPerimetralesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, "\\u003c") }} />

      <main className="min-h-screen bg-[#F7F7F4] pb-24 text-[#1E2126] lg:pb-0" style={{ fontFamily: FONT_BODY }}>
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#14161A] px-4 py-16 text-white lg:py-24">
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -top-[50%] -left-[50%] h-[200%] w-[200%] animate-[spin_20s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0%,transparent_70%,#FF5A1F_100%)] opacity-20 blur-3xl" />
            <div className="absolute inset-0 bg-[#14161A]/80 backdrop-blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-6xl">
            <nav aria-label="Migas de pan" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-[#8A8F96]">
              <Link href="/servicios" className="inline-flex items-center gap-2 transition-colors hover:text-[#FF5A1F]">
                <ArrowLeft className="h-4 w-4" aria-hidden /> Servicios
              </Link>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <span className="text-white/80">Cerco Perimetral</span>
            </nav>

            <div className="max-w-3xl">
              <Reveal>
                <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-[#FF5A1F]" style={{ fontFamily: FONT_MONO }}>
                  <span className="h-px w-8 shrink-0 bg-[#FF5A1F]" aria-hidden /> Fase 0 de tu obra
                </p>
                <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl" style={{ fontFamily: FONT_DISPLAY }}>
                  El Cerco Perimetral es la <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A1F] to-[#FFB347]">Fase 0</span> de tu Obra
                </h1>
              </Reveal>
              <Reveal delay={100}>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#C8CDD2]">
                  Instalamos el cerco con los mismos estándares con los que fabricamos tus chutes y estructuras. Tenemos la infraestructura y la experiencia para ejecutar todas las etapas de tu obra, empezando por el cerco perimetral y escalando según tus necesidades.
                </p>
              </Reveal>
              <Reveal delay={200}>
                <ul className="mt-6 space-y-2 text-sm text-white/90">
                  {["Instalación en 5-7 días para 100 ml", "Cumplimiento Norma G.050", "Fabricación en taller propio"].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FF5A1F]" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={300}>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link href={QUOTE_URL} className="group relative inline-flex min-h-14 items-center justify-center overflow-hidden rounded-full bg-[#FF5A1F] px-8 font-bold text-white transition-all hover:scale-105 hover:bg-[#FF7A44] hover:shadow-[0_0_40px_rgba(255,90,31,0.4)]">
                    <span className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]"><div className="relative h-full w-8 bg-white/20" /></span>
                    Cotizar mi cerco ahora <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <WhatsAppLink href={WHATSAPP_URL} location="hero" page={PAGE_PATH} className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/40">
                    <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp
                  </WhatsAppLink>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* FRANJA DE CONFIANZA CON GLASSMORPHISM */}
        <section aria-label="Respaldo para tu obra" className="relative z-10 -mt-8 px-4 sm:px-6 lg:px-8">
          <ul className="mx-auto grid max-w-5xl grid-cols-1 gap-4 rounded-2xl border border-white/40 bg-white/70 p-6 shadow-2xl backdrop-blur-xl md:grid-cols-4">
            {TRUST_ITEMS.map(({ icon: Icon, text }, index) => (
              <Reveal key={text} delay={index * 70}>
                <li className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFF3EC] to-[#FFE4D6] shadow-inner"><Icon className="h-6 w-6 text-[#B8390F]" /></span>
                  <span className="font-semibold text-[#1E2126]">{text}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* CONTENIDO PRINCIPAL */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 py-16 lg:grid-cols-3">
          <div className="min-w-0 space-y-16 lg:col-span-2">
            {/* FASES */}
            <Reveal>
              <section aria-labelledby="fases">
                <h2 id="fases" className="text-3xl font-semibold md:text-4xl" style={{ fontFamily: FONT_DISPLAY }}>
                  Un Proveedor, Múltiples Fases
                </h2>
                <p className="mt-4 max-w-2xl text-[#565C63]">
                  Entramos en la Fase 0 con el cerco. Si tu obra lo requiere, tenemos la capacidad para ejecutar las siguientes partidas metalmecánicas.
                </p>
                <div className="mt-8 grid gap-6 md:grid-cols-3">
                  {FASES.map(({ fase, title, text, icon: Icon, color }, index) => (
                    <Reveal key={fase} delay={index * 100}>
                      <div className="group relative overflow-hidden rounded-2xl border border-[#E3E1D8] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                        <div className={`absolute left-0 top-0 h-1 w-full ${color}`} />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#FF5A1F]">{fase}</span>
                        <Icon className="mt-4 h-10 w-10 text-[#FF5A1F]" />
                        <h3 className="mt-4 text-xl font-bold" style={{ fontFamily: FONT_DISPLAY }}>{title}</h3>
                        <p className="mt-2 text-sm text-[#565C63]">{text}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </section>
            </Reveal>

            {/* PROYECTOS */}
            <Reveal>
              <section aria-labelledby="obras">
                <h2 id="obras" className="text-3xl font-semibold md:text-4xl" style={{ fontFamily: FONT_DISPLAY }}>
                  Obras que lo Demuestran
                </h2>
                <div className="mt-8 grid gap-6 md:grid-cols-3">
                  {PROJECTS.map((p, index) => (
                    <Reveal key={p.title} delay={index * 100}>
                      <Link href={p.href} className="group block h-full overflow-hidden rounded-2xl border border-[#E3E1D8] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                        <div className="relative aspect-[4/3] w-full overflow-hidden">
                          <Image src={p.img} alt={p.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-bold" style={{ fontFamily: FONT_DISPLAY }}>{p.title}</h3>
                          <p className="text-sm text-[#FF5A1F]">{p.cliente}</p>
                          <p className="mt-2 text-sm text-[#565C63]">{p.text}</p>
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              </section>
            </Reveal>

            {/* PRECIOS */}
            <Reveal>
              <section aria-labelledby="precios" className="rounded-2xl border border-[#E3E1D8] bg-white p-6 sm:p-8">
                <h2 id="precios" className="text-2xl font-semibold" style={{ fontFamily: FONT_DISPLAY }}>
                  Precios de Referencia (2026)
                </h2>
                <p className="mt-2 text-sm text-[#565C63]">El precio final depende de la altura, metros lineales y tipo de terreno.</p>
                <ul className="mt-6 divide-y divide-[#E3E1D8]">
                  {PRICES.map((p) => (
                    <li key={p.tipo} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-sm font-medium text-[#1E2126]">{p.tipo}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-[#FF5A1F]">{p.precio}</span>
                        <Link href={QUOTE_URL} className="rounded-full bg-[#F7F7F4] px-3 py-1 text-xs font-semibold text-[#1E2126] transition-colors hover:bg-[#FF5A1F] hover:text-white">
                          Cotizar
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>

            {/* FAQ */}
            <Reveal>
              <section aria-labelledby="faq">
                <h2 id="faq" className="text-2xl font-semibold md:text-3xl" style={{ fontFamily: FONT_DISPLAY }}>
                  Preguntas Frecuentes
                </h2>
                <div className="mt-6 space-y-3">
                  {FAQS.map((f) => (
                    <details key={f.q} className="group border border-[#E3E1D8] bg-white p-4 open:border-[#FF5A1F]/50 transition-colors">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
                        <span className="group-hover:text-[#FF5A1F] transition-colors">{f.q}</span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-[#FF5A1F] transition-transform group-open:rotate-90" />
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed text-[#565C63]">{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            </Reveal>
          </div>

          {/* SIDEBAR STICKY */}
          <Reveal delay={400} className="min-w-0 h-fit space-y-6 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-3xl border border-white/50 bg-white/60 p-6 shadow-xl backdrop-blur-xl">
              <h3 className="text-xl font-semibold" style={{ fontFamily: FONT_DISPLAY }}>¿Necesitas cercar tu obra?</h3>
              <p className="mt-2 mb-6 text-sm text-[#565C63]">Envíanos los metros lineales y el tipo de cerco. Te cotizamos en menos de 24 horas.</p>
              <Link href={QUOTE_URL} className="block bg-[#FF5A1F] px-4 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-[#FF7A44]">
                Solicitar cotización
              </Link>
              <WhatsAppLink href={WHATSAPP_URL} location="sidebar" page={PAGE_PATH} className="mt-3 flex items-center justify-center gap-2 border border-[#E3E1D8] bg-white/50 px-4 py-3 text-sm font-semibold text-[#1E2126] backdrop-blur-md transition-all hover:bg-white">
                <MessageCircle className="h-4 w-4 text-[#25D366]" /> WhatsApp
              </WhatsAppLink>
            </div>
            <div className="border border-[#E3E1D8] bg-white p-6">
              <h3 className="mb-4 text-base font-semibold" style={{ fontFamily: FONT_DISPLAY }}>Contacto directo</h3>
              <ul className="space-y-3 text-sm text-[#565C63]">
                <li><a href={`tel:${PHONE_TEL}`} className="flex items-center gap-2 hover:text-[#FF5A1F]"><PhoneCall className="h-4 w-4 text-[#FF5A1F]" /> {PHONE_DISPLAY}</a></li>
                <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-[#FF5A1F]" /> Lun-Vie, 8 a.m. - 6 p.m.</li>
                <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#FF5A1F]" /> San Juan de Miraflores, Lima</li>
              </ul>
            </div>
          </Reveal>
        </div>

        {/* BARRA FIJA MÓVIL */}
        <div style={{ paddingBottom: "env(safe-area-inset-bottom)" }} className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-[#3A3F45] bg-[#14161A] lg:hidden">
          <WhatsAppLink href={WHATSAPP_URL} location="mobile_bar" page={PAGE_PATH} className="flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-white">
            <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
          </WhatsAppLink>
          <Link href={QUOTE_URL} className="flex items-center justify-center gap-2 bg-[#FF5A1F] py-3.5 text-sm font-semibold text-white">
            <ClipboardList className="h-4 w-4" aria-hidden /> Cotizar
          </Link>
        </div>
      </main>
    </>
  );
}