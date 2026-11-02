import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
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
  Ruler,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import WhatsAppLink from "@/components/public/WhatsAppLink";
import { proyectosData } from "@/lib/proyectos-data";

const SITE_URL = "https://grupoludier.com";
const PAGE_PATH = "/servicios/empresas-estructuras-metalicas";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const QUOTE_URL = "/contacto?from=landing-empresas";
const TITLE = "Empresas de Estructuras Metálicas en Lima | Fabricante LUDIER";
const DESCRIPTION =
  "LUDIER es una empresa peruana con más de 10 años de experiencia en fabricación e instalación de estructuras metálicas para constructoras. Homologados por Grupo LAR. Cotiza tu obra en 24h.";
const WHATSAPP_URL = `https://wa.me/51965391256?text=${encodeURIComponent(
  "Hola LUDIER, tengo planos de una obra en Lima y necesito una cotización formal de estructuras metálicas para mi constructora."
)}`;
const FONT_DISPLAY = "var(--font-display, Oswald, sans-serif)";
const FONT_BODY = "var(--font-body, Inter, sans-serif)";
const FONT_MONO = 'var(--font-mono, "JetBrains Mono", monospace)';
const HERO_IMAGE = "/img/proyectos/qantua/25-cobertura-policarbonato-ducto-gas-qantua.png";

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
  { icon: ShieldCheck, text: "Homologados ISO 9001, 14001, 45001, 37001" },
  { icon: HardHat, text: "Personal propio certificado" },
  { icon: Clock, text: "Respuesta en 24h" },
];

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Homologación y respaldo",
    text: "Homologados por Grupo LAR, con experiencia atendiendo los requerimientos de constructoras en proyectos como Qantua y Zendai.",
  },
  {
    icon: HardHat,
    title: "Cuadrillas propias",
    text: "Trabajamos con personal propio certificado, sin subcontratos. Coordinamos el montaje con el ingeniero residente y la supervisión de obra.",
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
    answer: "Contamos con homologación para trabajar con Grupo LAR. Cada constructora establece sus propios requisitos de evaluación; compártenos tu procedimiento para coordinar la revisión de la documentación técnica, comercial y de seguridad requerida.",
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

export default function EmpresasEstructurasMetalicasPage() {
  return (
    <div className="bg-[#F7F7F4] pt-16 text-[#1E2126] md:pt-20" style={{ fontFamily: FONT_BODY }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd).replace(/</g, "\\u003c") }}
      />

      {/* REDISEÑO B2B: foto de una intervención real y CTA antes de la imagen en mobile. */}
      <section aria-labelledby="titulo-empresas" className="relative overflow-hidden bg-[#14161A] px-4 pb-12 pt-7 text-white sm:px-6 lg:px-8 lg:pb-20 lg:pt-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#FF5A1F]" />
        <div className="relative mx-auto max-w-6xl">
          <nav aria-label="Migas de pan" className="mb-7 flex flex-wrap items-center gap-2 text-sm text-[#C8CDD2]">
            <Link href="/servicios" className="inline-flex min-h-11 items-center hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5A1F]">Servicios</Link>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <span>Proveedores para constructoras</span>
          </nav>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
            <div className="min-w-0">
              <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-[#C8CDD2]" style={{ fontFamily: FONT_MONO }}>
                <span className="h-px w-8 shrink-0 bg-[#FF5A1F]" aria-hidden="true" /> Tu aliado en obra
              </p>
              <h1 id="titulo-empresas" className="mt-5 break-words text-balance text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl" style={{ fontFamily: FONT_DISPLAY }}>
                Fabricante de <span className="text-[#FF5A1F]">Estructuras Metálicas</span> para Constructoras en Lima
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#C8CDD2] sm:text-lg">
                +10 años de experiencia, cuadrillas propias y homologados por Grupo LAR.
                Fabricación e instalación según tus planos, con coordinación directa
                con residentes de obra y equipos de compras.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href={QUOTE_URL} className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#FF5A1F] px-6 py-3.5 text-center font-semibold text-[#14161A] transition-colors hover:bg-[#FF7A44] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  Cotizar mi obra ahora <ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
                </Link>
                <Link href="#obras-respaldo" className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#59616B] px-5 py-3.5 text-center font-semibold hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5A1F]">
                  Ver obras ejecutadas <ArrowDownToLine className="h-4 w-4 shrink-0" aria-hidden="true" />
                </Link>
              </div>
            </div>
            <figure className="min-w-0 border border-[#3A3F45] bg-[#1D2024] p-3">
              <div className="relative aspect-[5/4] overflow-hidden lg:aspect-[4/5]">
                <Image src={HERO_IMAGE} alt="Estructura metálica con cobertura de policarbonato instalada por LUDIER en la azotea del proyecto Qantua" fill sizes="(min-width: 1280px) 480px, (min-width: 1024px) 45vw, 100vw" loading="eager" className="object-cover object-[center_80%]" />
                <span className="absolute left-3 top-3 flex items-center gap-2 bg-[#14161A]/90 px-3 py-2 text-xs font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-[#FF5A1F]" aria-hidden="true" /> Obra ejecutada por LUDIER
                </span>
              </div>
              <figcaption className="flex items-center justify-between gap-4 px-2 pt-3">
                <div className="min-w-0">
                  <p className="text-lg font-semibold" style={{ fontFamily: FONT_DISPLAY }}>Proyecto Qantua · Grupo LAR</p>
                  <p className="mt-1 text-sm text-[#C8CDD2]">Estructura y cobertura en azotea</p>
                </div>
                <Link href="/proyectos/qantua" aria-label="Ver el proyecto Qantua" className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center border border-[#59616B] hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5A1F]">
                  <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                </Link>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section aria-label="Respaldo para tu obra" className="border-b border-[#E3E1D8] bg-white px-4 sm:px-6 lg:px-8">
        <ul className="mx-auto grid max-w-6xl grid-cols-1 gap-5 py-7 md:grid-cols-3 md:gap-8">
          {TRUST_ITEMS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex min-w-0 items-center gap-4 text-sm font-semibold leading-relaxed">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#FF5A1F]/20 bg-[#FF5A1F]/10"><Icon className="h-6 w-6 text-[#B83B12]" aria-hidden="true" /></span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="por-que-elegirnos" className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-[#555B63]" style={{ fontFamily: FONT_MONO }}>Capacidad técnica y respaldo</p>
          <h2 id="por-que-elegirnos" className="text-balance text-3xl font-semibold sm:text-4xl" style={{ fontFamily: FONT_DISPLAY }}>
            Por qué las constructoras nos eligen
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <article key={title} className="min-w-0 border border-[#E3E1D8] border-t-2 border-t-[#FF5A1F] bg-white p-6">
                <Icon className="h-8 w-8 text-[#B83B12]" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-semibold" style={{ fontFamily: FONT_DISPLAY }}>{title}</h3>
                <p className="mt-3 text-base leading-relaxed text-[#555B63]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="obras-respaldo" className="border-y border-[#E3E1D8] bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-[#555B63]" style={{ fontFamily: FONT_MONO }}>Experiencia en campo</p>
              <h2 id="obras-respaldo" className="scroll-mt-28 text-balance text-3xl font-semibold sm:text-4xl" style={{ fontFamily: FONT_DISPLAY }}>
                Obras que nos respaldan
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#555B63]">
                Proyectos reales, alcances definidos y coordinación con constructoras en Lima.
              </p>
            </div>
            <Link href="/proyectos" className="inline-flex min-h-11 shrink-0 items-center gap-2 font-semibold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5A1F]">
              Ver portafolio <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {PROJECTS.map((project) => (
              <Link key={project.slug} href={`/proyectos/${project.slug}`} className="group flex min-w-0 flex-col border border-[#E3E1D8] bg-[#F7F7F4] transition-colors hover:border-[#FF5A1F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5A1F]">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={project.imagen}
                    alt={`${project.titulo}, proyecto atendido por LUDIER en Lima`}
                    fill
                    sizes="(min-width: 1280px) 368px, (min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="mb-3 flex items-center gap-2 text-xs font-medium text-[#555B63]"><MapPin className="h-4 w-4 shrink-0" aria-hidden="true" /> Lima, Perú</p>
                  <h3 className="text-2xl font-semibold group-hover:underline" style={{ fontFamily: FONT_DISPLAY }}>{project.titulo}</h3>
                  <p className="mt-2 text-sm text-[#555B63]">{project.cliente}</p>
                  <p className="mt-4 text-base leading-relaxed text-[#555B63]">{PROJECT_DESCRIPTIONS[project.slug]}</p>
                  <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 font-semibold text-[#B83B12]">
                    Ver intervención <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="servicios-fabricamos" className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-[#555B63]" style={{ fontFamily: FONT_MONO }}>De taller a obra</p>
          <h2 id="servicios-fabricamos" className="text-balance text-3xl font-semibold sm:text-4xl" style={{ fontFamily: FONT_DISPLAY }}>
            Servicios que fabricamos
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#555B63]">Revisa cada especialidad y compártenos las partidas que necesitas cotizar.</p>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ icon: Icon, title, text, href }) => (
              <li key={href} className="min-w-0">
                <Link href={href} className="group flex h-full min-h-11 flex-col border border-[#E3E1D8] bg-white p-6 transition-colors hover:border-[#FF5A1F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5A1F]">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center border border-[#E3E1D8] bg-[#F7F7F4]"><Icon className="h-6 w-6 text-[#B83B12]" aria-hidden="true" /></span>
                    <ArrowUpRight className="h-5 w-5 text-[#555B63]" aria-hidden="true" />
                  </div>
                  <h3 className="break-words text-xl font-semibold group-hover:underline" style={{ fontFamily: FONT_DISPLAY }}>{title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-[#555B63]">{text}</p>
                  <span className="mt-auto pt-5 text-sm font-semibold text-[#B83B12]">Ver servicio</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* REDISEÑO B2B: requisitos claros y contacto directo sin añadir otro formulario. */}
      <section aria-labelledby="que-enviar" className="px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 border border-[#3A3F45] bg-[#14161A] text-white lg:grid-cols-[1fr_1.1fr]">
          <div className="min-w-0 border-b border-[#3A3F45] p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
            <ClipboardList className="mb-6 h-9 w-9 text-[#FF5A1F]" aria-hidden="true" />
            <h2 id="que-enviar" className="text-balance text-3xl font-semibold sm:text-4xl" style={{ fontFamily: FONT_DISPLAY }}>Qué enviar para recibir tu cotización</h2>
            <p className="mt-4 text-base leading-relaxed text-[#C8CDD2]">Con esta información podemos evaluar el alcance y preparar una propuesta para tu equipo de compras.</p>
            <p className="mt-5 flex items-start gap-3 text-sm leading-relaxed text-[#C8CDD2]"><Ruler className="mt-0.5 h-5 w-5 shrink-0 text-[#FF5A1F]" aria-hidden="true" /> ¿Aún no tienes todo? Escríbenos y te ayudamos a definir lo que falta.</p>
          </div>
          <div className="min-w-0 p-6 sm:p-8 lg:p-10">
            <ul className="space-y-5">
              {QUOTE_CHECKLIST.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-[#E3E1D8]"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#FF5A1F]" aria-hidden="true" /><span>{item}</span></li>
              ))}
            </ul>
            <WhatsAppLink href={WHATSAPP_URL} location="landing-empresas-requisitos" page={PAGE_PATH} className="mt-8 inline-flex min-h-11 w-full items-center justify-center gap-2 bg-[#FF5A1F] px-5 py-3.5 text-center font-semibold text-[#14161A] transition-colors hover:bg-[#FF7A44] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" /> Enviar planos por WhatsApp
            </WhatsAppLink>
          </div>
        </div>
      </section>

      <section aria-labelledby="preguntas-frecuentes" className="border-t border-[#E3E1D8] bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div className="min-w-0">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-[#555B63]" style={{ fontFamily: FONT_MONO }}>Antes de contratar</p>
            <h2 id="preguntas-frecuentes" className="text-balance text-3xl font-semibold sm:text-4xl" style={{ fontFamily: FONT_DISPLAY }}>Preguntas frecuentes de constructoras</h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#555B63]">Seguridad, documentación y alcance: resolvemos las consultas de tu equipo antes de empezar.</p>
          </div>
          <div className="min-w-0 space-y-3">
            {FAQS.map(({ question, answer }) => (
              <details key={question} className="group border border-[#E3E1D8] bg-[#F7F7F4] open:border-[#B83B12]">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 p-5 text-base font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5A1F]">
                  <span className="min-w-0">{question}</span><ChevronRight className="h-5 w-5 shrink-0 text-[#B83B12] transition-transform group-open:rotate-90 motion-reduce:transition-none" aria-hidden="true" />
                </summary>
                <p className="px-5 pb-5 text-base leading-relaxed text-[#555B63]">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="cotizar-planos" className="bg-[#14161A] px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl pb-12 sm:pb-0">
          <h2 id="cotizar-planos" className="max-w-3xl text-balance text-3xl font-semibold sm:text-4xl" style={{ fontFamily: FONT_DISPLAY }}>
            ¿Tienes planos y necesitas una cotización formal?
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#C8CDD2]">
            Cuéntanos el alcance, la ubicación y el plazo de tu obra.
            Revisamos tus requerimientos y coordinamos contigo una propuesta técnica y comercial.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <WhatsAppLink href={WHATSAPP_URL} location="landing-empresas-final" page={PAGE_PATH} className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#FF5A1F] px-6 py-3.5 text-center font-semibold text-[#14161A] transition-colors hover:bg-[#FF7A44] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" /> Cotizar por WhatsApp
            </WhatsAppLink>
            <Link href={QUOTE_URL} className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#C8CDD2] px-6 py-3.5 text-center font-semibold hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5A1F]">
              <FileCheck className="h-5 w-5 shrink-0" aria-hidden="true" /> Enviar planos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
