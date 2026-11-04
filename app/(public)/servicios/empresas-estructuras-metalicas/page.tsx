import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowDownToLine,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Factory,
  Fence,
  FileCheck,
  Gauge,
  HardHat,
  MapPin,
  MessageCircle,
  PhoneCall,
  Ruler,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import WhatsAppLink from "@/components/public/WhatsAppLink";
import Reveal from "@/components/public/Reveal";
import { proyectosData } from "@/lib/proyectos-data";

const SITE_URL = "https://grupoludier.com";
const PAGE_PATH = "/servicios/empresas-estructuras-metalicas";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const QUOTE_URL = "/contacto?from=landing-empresas";
const TITLE = "Empresas de Estructuras Metálicas en Lima | Fabricante LUDIER";
const DESCRIPTION =
  "LUDIER es una empresa peruana con más de 10 años de experiencia en fabricación e instalación de estructuras metálicas para constructoras. Homologados por Hodelpe para Grupo LAR. Cotiza tu obra en 24h.";
const WHATSAPP_URL = `https://wa.me/51965391256?text=${encodeURIComponent(
  "Hola LUDIER, tengo planos de una obra en Lima y necesito una cotización formal de estructuras metálicas para mi constructora."
)}`;
const FONT_DISPLAY = "var(--font-display, Oswald, sans-serif)";
const FONT_BODY = "var(--font-body, Inter, sans-serif)";
const FONT_MONO = 'var(--font-mono, "JetBrains Mono", monospace)';
const HERO_IMAGE = "/img/proyectos/qantua/28-vistaIntegralQantuaF1&F2.jpeg";
const PHONE_DISPLAY = "+51 965 391 256";
const PHONE_TEL = "+51965391256";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "empresas de estructuras metalicas en lima",
    "fabricacion de estructuras metalicas lima",
    "fabricante de estructuras metalicas",
    "proveedor de estructuras metalicas para constructoras",
    "estructuras metalicas para obras",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "LUDIER",
    locale: "es_PE",
    type: "website",
    images: [{ url: "/img/Qantua.jpg", alt: "Proyecto Qantua de Grupo LAR, obra atendida por LUDIER" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/img/Qantua.jpg"],
  },
};

const TRUST_ITEMS = [
  { icon: ShieldCheck, text: "Homologados por Hodelpe" },
  { icon: HardHat, text: "Personal propio" },
  { icon: Clock, text: "Respuesta en 24h" },
];

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Homologación y respaldo",
    text: "Homologados por Hodelpe, con experiencia atendiendo los requerimientos de constructoras en proyectos como Qantua y Zendai de Grupo LAR.",
  },
  {
    icon: HardHat,
    title: "Cuadrillas propias",
    text: "Trabajamos con personal propio, sin subcontratos. Coordinamos el montaje con el ingeniero residente y la supervisión de obra.",
  },
  {
    icon: FileCheck,
    title: "Cumplimiento normativo",
    text: "Fabricación y montaje según planos y las exigencias aplicables del RNE, incluida la E.030 de diseño sismorresistente y la G.050 de seguridad durante la construcción.",
  },
  {
    icon: Factory,
    title: "Taller propio",
    text: "Fabricación a medida y control de calidad en nuestro taller. Revisamos dimensiones, soldaduras y acabados antes de coordinar la entrega en obra.",
  },
];

const PROJECT_DESCRIPTIONS: Record<string, string> = {
  qantua: "Estructuras complementarias, barandas, cerramientos y chutes para las fases 1 y 2 del proyecto de Grupo LAR.",
  zendai: "Fabricación e instalación de barandas metálicas de seguridad en balcones para un proyecto de Grupo LAR.",
  "catalina-tower": "Instalación y desmontaje de un chute metálico de evacuación de residuos en un edificio de 10 pisos.",
};
const PROJECTS = proyectosData.filter((project) =>
  ["qantua", "zendai", "catalina-tower"].includes(project.slug)
);

const SERVICES = [
  { icon: Building2, title: "Techos metálicos", text: "Estructuras y coberturas para naves, almacenes y azoteas.", href: "/servicios/estructuras-metalicas-para-techos" },
  { icon: ShieldCheck, title: "Barandas metálicas y de acero inoxidable", text: "Protección para escaleras, balcones y áreas de circulación.", href: "/servicios/barandas-acero-inoxidable" },
  { icon: Gauge, title: "Escaleras metálicas", text: "Accesos técnicos, escaleras de emergencia e industriales.", href: "/servicios/escaleras-metalicas" },
  { icon: ArrowDownToLine, title: "Chutes metálicos", text: "Fabricación, instalación y desmontaje para evacuación de residuos.", href: "/servicios/chutes-metalicos-para-construccion" },
  { icon: Fence, title: "Cercos y cerramientos", text: "Cerramientos perimetrales y protecciones para tu obra.", href: "/servicios/cercos-cerramientos" },
  { icon: Wrench, title: "Fabricación a medida", text: "Rejillas, tapas, soportes y elementos metálicos según planos.", href: "/servicios/fabricacion-medida" },
];

const QUOTE_CHECKLIST = [
  "Planos o croquis en PDF o DWG, si los tienes disponibles.",
  "Ubicación de la obra, distrito y datos de contacto del responsable.",
  "Metrados, cantidades, materiales y acabados requeridos.",
  "Alcance: fabricación, suministro, montaje o servicio integral.",
  "Cronograma de entrega, condiciones de acceso y requisitos de seguridad.",
];

const FAQS = [
  {
    question: "¿El personal cuenta con SCTR y equipos de seguridad?",
    answer: "Sí. El personal asignado a obra cuenta con SCTR y equipos de protección personal. Coordinamos con tu equipo de seguridad la verificación de la documentación y los requisitos de ingreso antes de iniciar el montaje.",
  },
  {
    question: "¿Cómo es el proceso de homologación con mi constructora?",
    answer: "Contamos con homologación por Hodelpe para trabajar con Grupo LAR. Cada constructora establece sus propios requisitos de evaluación; compártenos tu procedimiento para coordinar la revisión de la documentación técnica, comercial y de seguridad requerida.",
  },
  {
    question: "¿En cuánto tiempo recibiré una cotización formal?",
    answer: "Te damos una primera respuesta en 24 horas. El plazo de la cotización formal depende de los planos, metrados y especificaciones disponibles. Si necesitamos una visita técnica o información adicional, lo coordinamos contigo antes de cerrar la propuesta.",
  },
  {
    question: "¿Puedo contratar solo la fabricación o también el montaje?",
    answer: "Podemos cotizar fabricación, suministro y montaje de acuerdo con el alcance de tu proyecto. Indica qué partidas necesitas y las fechas de entrega para definir responsabilidades, materiales y coordinación en obra desde la propuesta.",
  },
];

const serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Fabricación e instalación de estructuras metálicas para constructoras en Lima",
  serviceType: "Fabricación de estructuras metálicas para constructoras",
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
      <Link href={QUOTE_URL} className="ludier-button ludier-button-primary">
        <ClipboardList className="h-4 w-4" aria-hidden /> Cotizar mi proyecto
      </Link>
      <WhatsAppLink
        href={WHATSAPP_URL}
        location="hero"
        page={PAGE_PATH}
        className="ludier-button ludier-button-secondary ludier-button-secondary-dark"
      >
        <MessageCircle className="h-4 w-4" aria-hidden /> Escribir por WhatsApp
      </WhatsAppLink>
    </div>
  );
}

export default function EmpresasEstructurasMetalicasPage() {
  return (
    <>
      <JsonLd data={serviceLd} />

      <main className="min-h-screen bg-[#F7F7F4] pb-24 text-[#1E2126] lg:pb-0" style={{ fontFamily: FONT_BODY }}>
        {/* HERO con la foto de Qantua Integral */}
        <section className="relative overflow-hidden bg-[#14161A] px-4 py-16 text-white lg:py-24">
          <Image
            src={HERO_IMAGE}
            alt="Vista del proyecto Qantua de Grupo LAR, donde LUDIER ejecutó trabajos metalmecánicos"
            fill
            sizes="100vw"
            className="object-cover object-[center_70%] opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#14161A]/95 via-[#14161A]/85 to-[#14161A]/65" />
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
              <span className="text-white/80">Proveedores para Constructoras</span>
            </nav>

            <div className="max-w-3xl">
              <Reveal>
                <p className="text-sm font-medium text-[#FF5A1F]">Para constructoras y proyectos industriales</p>
                <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl" style={{ fontFamily: FONT_DISPLAY }}>
                  Fabricante de Estructuras Metálicas para Constructoras en Lima
                </h1>
              </Reveal>
              <Reveal delay={100}>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#B4B9BF]">
                  +10 años de experiencia, cuadrillas propias y homologados por Hodelpe para Grupo LAR. Fabricación e instalación según tus planos, con coordinación directa con residentes de obra y equipos de compras.
                </p>
              </Reveal>
              <Reveal delay={200}>
                <ul className="mt-6 space-y-2 text-sm text-white/90">
                  {["Fabricación y montaje según planos y especificaciones", "Personal propio, coordinado con tu supervisión", "Experiencia en Qantua, Zendai y Catalina Tower"].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FF5A1F]" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={300}>
                <CtaButtons className="mt-8" />
              </Reveal>
            </div>
          </div>
        </section>

        {/* FRANJA DE CONFIANZA */}
        <Reveal delay={300}>
          <section className="border-b border-[#E3E1D8] bg-white py-5" aria-label="Respaldo para tu obra">
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 md:grid-cols-3">
              {TRUST_ITEMS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center justify-center gap-2 text-sm font-medium">
                  <Icon className="h-5 w-5 shrink-0 text-[#FF5A1F]" aria-hidden="true" />
                  {text}
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* CONTENIDO PRINCIPAL */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 py-16 lg:grid-cols-3">
          <div className="min-w-0 space-y-16 lg:col-span-2">

            {/* Por qué elegirnos */}
            <Reveal>
              <section aria-labelledby="por-que-elegirnos">
                <h2 id="por-que-elegirnos" className="text-2xl font-semibold md:text-3xl" style={{ fontFamily: FONT_DISPLAY }}>
                  Por qué las constructoras nos eligen
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {BENEFITS.map(({ icon: Icon, title, text }) => (
                    <div key={title} className="border-l-4 border-[#FF5A1F] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <Icon className="mb-2 h-5 w-5 text-[#FF5A1F]" aria-hidden="true" />
                      <h3 className="text-base font-semibold">{title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-[#565C63]">{text}</p>
                    </div>
                  ))}
                </div>
              </section>
            </Reveal>

            {/* Proyectos */}
            <Reveal>
              <section aria-labelledby="obras-respaldo">
                <h2 id="obras-respaldo" className="text-2xl font-semibold md:text-3xl" style={{ fontFamily: FONT_DISPLAY }}>
                  Obras que nos respaldan
                </h2>
                <p className="mt-4 max-w-2xl leading-relaxed text-[#565C63]">
                  Proyectos reales, alcances definidos y coordinación con constructoras en Lima.
                </p>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {PROJECTS.map((project, index) => (
                    <Reveal key={project.slug} delay={index * 100}>
                      <Link
                        href={`/proyectos/${project.slug}`}
                        className="group block overflow-hidden border border-[#E3E1D8] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#FF5A1F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF5A1F]"
                      >
                        <div className="relative h-44 bg-[#14161A]">
                          <Image
                            src={project.imagen}
                            alt={`${project.titulo}, proyecto atendido por LUDIER en Lima`}
                            fill
                            sizes="(min-width: 768px) 33vw, 100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-sm font-semibold">{project.titulo}</p>
                          <p className="mt-1 text-sm text-[#565C63]">{project.cliente}</p>
                          <p className="mt-2 text-xs text-[#565C63] line-clamp-2">{PROJECT_DESCRIPTIONS[project.slug]}</p>
                          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#FF5A1F]">
                            Ver proyecto <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                          </span>
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              </section>
            </Reveal>

            {/* Servicios */}
            <Reveal>
              <section aria-labelledby="servicios-fabricamos">
                <h2 id="servicios-fabricamos" className="text-2xl font-semibold md:text-3xl" style={{ fontFamily: FONT_DISPLAY }}>
                  Servicios que fabricamos
                </h2>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {SERVICES.map(({ icon: Icon, title, text, href }, index) => (
                    <Reveal key={href} delay={index * 100}>
                      <li className="h-full">
                        <Link
                          href={href}
                          className="group flex h-full flex-col border border-[#E3E1D8] bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#FF5A1F]"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <span className="flex h-10 w-10 items-center justify-center border border-[#E3E1D8] bg-[#F7F7F4] transition-colors group-hover:bg-[#FFF3EC]">
                              <Icon className="h-5 w-5 text-[#B8390F] transition-transform group-hover:scale-110" aria-hidden="true" />
                            </span>
                            <ArrowUpRight className="h-4 w-4 text-[#555B63] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
                          </div>
                          <h3 className="text-sm font-semibold group-hover:text-[#FF5A1F] transition-colors" style={{ fontFamily: FONT_DISPLAY }}>{title}</h3>
                          <p className="mt-2 text-xs text-[#565C63]">{text}</p>
                        </Link>
                      </li>
                    </Reveal>
                  ))}
                </ul>
              </section>
            </Reveal>

            {/* Qué enviar */}
            <Reveal>
              <section aria-labelledby="que-enviar" className="bg-[#14161A] p-8 text-white">
                <h2 id="que-enviar" className="text-2xl font-semibold" style={{ fontFamily: FONT_DISPLAY }}>
                  Qué enviar para recibir tu cotización
                </h2>
                <p className="mt-4 text-sm text-white/80">Con esta información podemos evaluar el alcance y preparar una propuesta para tu equipo de compras.</p>
                <ul className="mt-5 space-y-3">
                  {QUOTE_CHECKLIST.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-white/90">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FF5A1F]" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-sm text-white/70">¿Aún no tienes todo? Escríbenos igual y te ayudamos a definir el alcance.</p>
                <CtaButtons className="mt-6" />
              </section>
            </Reveal>

            {/* FAQ */}
            <Reveal>
              <section aria-labelledby="faq">
                <h2 id="faq" className="text-2xl font-semibold md:text-3xl" style={{ fontFamily: FONT_DISPLAY }}>
                  Preguntas frecuentes de constructoras
                </h2>
                <div className="mt-6 space-y-3">
                  {FAQS.map(({ question, answer }) => (
                    <details key={question} className="group border border-[#E3E1D8] bg-white p-4 open:border-[#FF5A1F]/50 transition-colors">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
                        <span className="group-hover:text-[#FF5A1F] transition-colors">{question}</span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-[#FF5A1F] transition-transform group-open:rotate-90" aria-hidden="true" />
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed text-[#565C63]">{answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            </Reveal>
          </div>

          {/* SIDEBAR */}
          <Reveal delay={400} className="min-w-0 h-fit space-y-6 lg:sticky lg:top-24">
            <div className="bg-[#FF5A1F] p-6 text-white shadow-xl">
              <h3 className="text-xl font-semibold" style={{ fontFamily: FONT_DISPLAY }}>
                ¿Buscas un proveedor para tu obra?
              </h3>
              <p className="mt-2 mb-6 text-sm text-white/90">
                Compártenos planos, metrados y fechas. Te damos una primera respuesta en 24 horas.
              </p>
              <Link
                href={QUOTE_URL}
                className="block bg-white px-4 py-3 text-center text-sm font-bold text-[#FF5A1F] transition-colors hover:bg-[#F7F7F4]"
              >
                Solicitar cotización
              </Link>
              <WhatsAppLink
                href={WHATSAPP_URL}
                location="sidebar"
                page={PAGE_PATH}
                className="mt-3 flex items-center justify-center gap-2 border border-white/60 px-4 py-3 text-sm font-semibold transition-colors hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
              </WhatsAppLink>
            </div>
            <div className="border border-[#E3E1D8] bg-white p-6">
              <h3 className="mb-4 text-base font-semibold" style={{ fontFamily: FONT_DISPLAY }}>
                Contacto directo
              </h3>
              <ul className="space-y-3 text-sm text-[#565C63]">
                <li>
                  <a href={`tel:${PHONE_TEL}`} className="flex items-center gap-2 hover:text-[#FF5A1F] transition-colors">
                    <PhoneCall className="h-4 w-4 text-[#FF5A1F]" aria-hidden="true" />
                    {PHONE_DISPLAY}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#FF5A1F]" aria-hidden="true" />
                  Lunes a viernes, 8 a. m. a 6 p. m.
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#FF5A1F]" aria-hidden="true" />
                  San Juan de Miraflores, Lima
                </li>
              </ul>
            </div>
          </Reveal>
        </div>

        {/* BARRA FIJA MÓVIL */}
        <div
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-[#3A3F45] bg-[#14161A] lg:hidden"
        >
          <WhatsAppLink
            href={WHATSAPP_URL}
            location="mobile_bar"
            page={PAGE_PATH}
            className="flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-white"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
          </WhatsAppLink>
          <Link
            href={QUOTE_URL}
            className="flex items-center justify-center gap-2 bg-[#FF5A1F] py-3.5 text-sm font-semibold text-white"
          >
            <ClipboardList className="h-4 w-4" aria-hidden="true" /> Cotizar
          </Link>
        </div>
      </main>
    </>
  );
}