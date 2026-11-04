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

export default function EmpresasEstructurasMetalicasPage() {
  return (
    <div className="bg-[#F7F7F4] pt-16 text-[#1E2126] md:pt-20" style={{ fontFamily: FONT_BODY }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd).replace(/</g, "\\u003c") }}
      />

      {/* HERO CON EFECTO AURORA Y GLASSMORPHISM */}
      <section aria-labelledby="titulo-empresas" className="relative overflow-hidden bg-[#14161A] px-4 py-16 text-white lg:py-28">
        {/* Aurora Background */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-[50%] -left-[50%] h-[200%] w-[200%] animate-[spin_20s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0%,transparent_70%,#FF5A1F_100%)] opacity-20 blur-3xl" />
          <div className="absolute inset-0 bg-[#14161A]/80 backdrop-blur-3xl" />
        </div>
        
        <div className="relative mx-auto max-w-6xl">
          <nav aria-label="Migas de pan" className="mb-7 flex flex-wrap items-center gap-2 text-sm text-[#C8CDD2]">
            <Link href="/servicios" className="inline-flex min-h-11 items-center hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5A1F]">Servicios</Link>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <span>Proveedores para constructoras</span>
          </nav>
          
          <div className="max-w-3xl">
            <Reveal>
              <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-[#FF5A1F]" style={{ fontFamily: FONT_MONO }}>
                <span className="h-px w-8 shrink-0 bg-[#FF5A1F]" aria-hidden="true" /> Tu aliado en obra
              </p>
              <h1 id="titulo-empresas" className="mt-4 break-words text-balance text-4xl font-semibold leading-tight md:text-6xl" style={{ fontFamily: FONT_DISPLAY }}>
                Fabricante de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A1F] to-[#FFB347]">Estructuras Metálicas</span> para Constructoras en Lima
              </h1>
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#C8CDD2]">
                +10 años de experiencia, cuadrillas propias y homologados por Hodelpe para Grupo LAR.
                Fabricación e instalación según tus planos.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <ul className="mt-6 space-y-2 text-sm text-white/90">
                {["Fabricación y montaje según planos y especificaciones", "Personal propio, coordinado con tu supervisión", "Experiencia en Qantua, Zendai y Catalina Tower"].map((item) => (
                  <li key={item} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FF5A1F]" aria-hidden="true" /><span>{item}</span></li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href={QUOTE_URL} className="group relative inline-flex min-h-14 items-center justify-center overflow-hidden rounded-full bg-[#FF5A1F] px-8 font-bold text-white transition-all hover:scale-105 hover:bg-[#FF7A44] hover:shadow-[0_0_40px_rgba(255,90,31,0.4)]">
                  <span className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]"><div className="relative h-full w-8 bg-white/20" /></span>
                  Cotizar mi obra ahora <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="#obras-respaldo" className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/40">
                  Ver obras ejecutadas
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE CONFIANZA CON GLASSMORPHISM */}
      <section aria-label="Respaldo para tu obra" className="relative z-10 -mt-8 px-4 sm:px-6 lg:px-8">
        <ul className="mx-auto grid max-w-5xl grid-cols-1 gap-4 rounded-2xl border border-white/40 bg-white/70 p-6 shadow-2xl backdrop-blur-xl md:grid-cols-3">
          {TRUST_ITEMS.map(({ icon: Icon, text }, index) => (
            <Reveal key={text} delay={index * 100}>
              <li className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFF3EC] to-[#FFE4D6] shadow-inner"><Icon className="h-7 w-7 text-[#B8390F]" /></span>
                <span className="font-semibold text-[#1E2126]">{text}</span>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 py-16 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-20">
          
          <Reveal>
            <section aria-labelledby="por-que-elegirnos">
              <h2 id="por-que-elegirnos" className="text-3xl font-semibold md:text-4xl" style={{ fontFamily: FONT_DISPLAY }}>Por qué las constructoras nos eligen</h2>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {BENEFITS.map(({ icon: Icon, title, text }) => (
                  <article key={title} className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FFF3EC] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <Icon className="relative z-10 h-10 w-10 text-[#FF5A1F] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
                    <h3 className="relative z-10 mt-6 text-xl font-bold" style={{ fontFamily: FONT_DISPLAY }}>{title}</h3>
                    <p className="relative z-10 mt-3 text-[#555B63]">{text}</p>
                  </article>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section aria-labelledby="obras-respaldo">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <h2 id="obras-respaldo" className="text-3xl font-semibold md:text-4xl" style={{ fontFamily: FONT_DISPLAY }}>Obras que nos respaldan</h2>
                <Link href="/proyectos" className="group inline-flex items-center gap-2 font-semibold text-[#FF5A1F] hover:underline">Ver portafolio <ArrowRight className="transition-transform group-hover:translate-x-1" /></Link>
              </div>
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                {PROJECTS.map((project, index) => (
                  <Reveal key={project.slug} delay={index * 100}>
                    <Link href={`/proyectos/${project.slug}`} className="group relative block h-full overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(255,90,31,0.3)]">
                      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-transparent via-[#FF5A1F]/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ maskImage: "linear-gradient(#fff, #fff)", maskComposite: "exclude" }} />
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl">
                        <Image src={project.imagen} alt={`${project.titulo}, proyecto atendido por LUDIER en Lima`} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                      </div>
                      <div className="relative p-6">
                        <h3 className="text-xl font-bold" style={{ fontFamily: FONT_DISPLAY }}>{project.titulo}</h3>
                        <p className="mt-2 text-sm font-medium text-[#FF5A1F]">{project.cliente}</p>
                        <p className="mt-4 text-sm text-[#555B63] line-clamp-3">{PROJECT_DESCRIPTIONS[project.slug]}</p>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section aria-labelledby="servicios-fabricamos">
              <h2 id="servicios-fabricamos" className="text-3xl font-semibold md:text-4xl" style={{ fontFamily: FONT_DISPLAY }}>Servicios que fabricamos</h2>
              <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {SERVICES.map(({ icon: Icon, title, text, href }, index) => (
                  <Reveal key={href} delay={index * 100}>
                    <li className="h-full">
                      <Link href={href} className="group flex h-full flex-col rounded-2xl border border-[#E3E1D8] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#FF5A1F]">
                        <div className="mb-5 flex items-center justify-between">
                          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F7F7F4] transition-colors group-hover:bg-[#FFF3EC]"><Icon className="h-6 w-6 text-[#B8390F] transition-transform group-hover:scale-110" /></span>
                          <ArrowUpRight className="h-5 w-5 text-[#555B63] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </div>
                        <h3 className="text-xl font-bold group-hover:text-[#FF5A1F] transition-colors" style={{ fontFamily: FONT_DISPLAY }}>{title}</h3>
                        <p className="mt-3 text-sm text-[#555B63]">{text}</p>
                        <span className="mt-auto pt-5 text-sm font-semibold text-[#B8390F]">Ver servicio</span>
                      </Link>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </section>
          </Reveal>

          <Reveal>
            <section aria-labelledby="que-enviar" className="relative overflow-hidden rounded-3xl bg-[#14161A] p-8 text-white sm:p-12">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FF5A1F] opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40" />
              <div className="relative z-10 grid gap-10 lg:grid-cols-2 lg:items-center">
                <div>
                  <h2 id="que-enviar" className="text-3xl font-semibold" style={{ fontFamily: FONT_DISPLAY }}>Qué enviar para recibir tu cotización</h2>
                  <p className="mt-4 text-[#C8CDD2]">Con esta información podemos evaluar el alcance y preparar una propuesta para tu equipo de compras.</p>
                  <WhatsAppLink href={WHATSAPP_URL} location="landing-empresas-requisitos" page={PAGE_PATH} className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#FF5A1F] px-6 py-3 font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,90,31,0.6)]">
                    <MessageCircle className="h-5 w-5" /> Enviar planos por WhatsApp
                  </WhatsAppLink>
                </div>
                <ul className="space-y-4">
                  {QUOTE_CHECKLIST.map((item) => (
                    <li key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors hover:bg-white/10">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#FF5A1F]" />
                      <span className="text-sm text-[#E3E1D8]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section aria-labelledby="preguntas-frecuentes">
              <h2 id="preguntas-frecuentes" className="text-3xl font-semibold md:text-4xl" style={{ fontFamily: FONT_DISPLAY }}>Preguntas frecuentes de constructoras</h2>
              <div className="mt-8 space-y-4">
                {FAQS.map(({ question, answer }) => (
                  <details key={question} className="group overflow-hidden rounded-2xl border border-[#E3E1D8] bg-white transition-all duration-300 open:border-[#FF5A1F] open:shadow-lg">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 text-lg font-semibold transition-colors hover:text-[#FF5A1F]">
                      <span>{question}</span>
                      <ChevronRight className="h-5 w-5 shrink-0 text-[#FF5A1F] transition-transform duration-300 group-open:rotate-90" />
                    </summary>
                    <p className="px-6 pb-6 text-[#555B63]">{answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </Reveal>

        </div>
        
        {/* SIDEBAR CON GLASSMORPHISM */}
        <Reveal delay={400} className="min-w-0 h-fit lg:sticky lg:top-28">
          <div className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/60 p-8 shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-2xl font-bold" style={{ fontFamily: FONT_DISPLAY }}>¿Buscas un proveedor para tu obra?</h2>
              <p className="mt-3 text-sm text-[#555B63]">Compártenos planos, metrados y fechas. Te damos una primera respuesta en 24 horas.</p>
              <Link href={QUOTE_URL} className="mt-6 flex min-h-12 items-center justify-center rounded-xl bg-[#FF5A1F] font-bold text-white transition-all hover:scale-105 hover:bg-[#FF7A44] hover:shadow-lg">Solicitar cotización</Link>
              <WhatsAppLink href={WHATSAPP_URL} location="landing-empresas-sidebar" page={PAGE_PATH} className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#E3E1D8] bg-white/50 font-semibold text-[#1E2126] backdrop-blur-md transition-all hover:bg-white">
                <MessageCircle className="h-5 w-5 text-[#25D366]" /> Cotizar por WhatsApp
              </WhatsAppLink>
              <hr className="my-6 border-[#E3E1D8]" />
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3"><PhoneCall className="h-5 w-5 text-[#FF5A1F]" /> <span className="font-semibold">{PHONE_DISPLAY}</span></li>
                <li className="flex items-center gap-3"><Clock className="h-5 w-5 text-[#FF5A1F]" /> <span>Lunes a viernes, 8 a. m. a 6 p. m.</span></li>
                <li className="flex items-center gap-3"><MapPin className="h-5 w-5 text-[#FF5A1F]" /> <span>San Juan de Miraflores, Lima</span></li>
              </ul>
            </div>
          </div>
        </Reveal>
      </div>

      {/* CTA FINAL CON BRILLO */}
      <Reveal>
        <section aria-labelledby="cotizar-planos" className="relative overflow-hidden bg-[#14161A] px-4 py-20 text-white sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FF5A1F]/10 via-transparent to-transparent opacity-50" />
          <div className="relative mx-auto max-w-6xl text-center">
            <h2 id="cotizar-planos" className="mx-auto max-w-3xl text-4xl font-semibold md:text-5xl" style={{ fontFamily: FONT_DISPLAY }}>
              ¿Tienes planos y necesitas una <span className="text-[#FF5A1F]">cotización formal</span>?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[#C8CDD2]">
              Cuéntanos el alcance, la ubicación y el plazo de tu obra.
              Revisamos tus requerimientos y coordinamos contigo una propuesta técnica y comercial.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <WhatsAppLink href={WHATSAPP_URL} location="landing-empresas-final" page={PAGE_PATH} className="group inline-flex min-h-14 items-center gap-3 rounded-full bg-[#FF5A1F] px-8 font-bold text-white transition-all hover:scale-105 hover:bg-[#FF7A44] hover:shadow-[0_0_30px_rgba(255,90,31,0.5)]">
                <MessageCircle className="h-5 w-5 transition-transform group-hover:rotate-12" /> Cotizar por WhatsApp
              </WhatsAppLink>
              <Link href={QUOTE_URL} className="inline-flex min-h-14 items-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/40">
                <FileCheck className="h-5 w-5" /> Enviar planos
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}