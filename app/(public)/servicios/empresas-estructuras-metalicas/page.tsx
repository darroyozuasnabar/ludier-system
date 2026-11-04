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

      {/* HERO CON DINAMISMO */}
      <section aria-labelledby="titulo-empresas" className="relative overflow-hidden bg-[#14161A] px-4 py-12 text-white lg:py-24">
        <Image src={HERO_IMAGE} alt="Vista del proyecto Qantua de Grupo LAR, donde LUDIER ejecutó trabajos metalmecánicos" fill sizes="100vw" loading="eager" className="object-cover object-[center_70%] opacity-40 transition-transform duration-[20s] ease-out hover:scale-110" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#14161A]/95 via-[#14161A]/85 to-[#14161A]/65" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#FF5A1F]" />
        
        <div className="relative mx-auto max-w-6xl">
          <nav aria-label="Migas de pan" className="mb-7 flex flex-wrap items-center gap-2 text-sm text-[#C8CDD2]">
            <Link href="/servicios" className="inline-flex min-h-11 items-center hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5A1F]">Servicios</Link>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <span>Proveedores para constructoras</span>
          </nav>
          
          <div className="max-w-3xl">
            <Reveal>
              <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-[#C8CDD2]" style={{ fontFamily: FONT_MONO }}>
                <span className="h-px w-8 shrink-0 bg-[#FF5A1F]" aria-hidden="true" /> Tu aliado en obra
              </p>
              <h1 id="titulo-empresas" className="mt-4 break-words text-balance text-4xl font-semibold leading-tight md:text-5xl" style={{ fontFamily: FONT_DISPLAY }}>
                Fabricante de <span className="text-[#FF5A1F]">Estructuras Metálicas</span> para Constructoras en Lima
              </h1>
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#C8CDD2] sm:text-lg">
                +10 años de experiencia, cuadrillas propias y homologados por Hodelpe para Grupo LAR.
                Fabricación e instalación según tus planos, con coordinación directa
                con residentes de obra y equipos de compras.
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
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href={QUOTE_URL} className="group ludier-button ludier-button-primary">
                  Cotizar mi obra ahora <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <Link href="#obras-respaldo" className="group ludier-button ludier-button-secondary ludier-button-secondary-dark">
                  Ver obras ejecutadas <ArrowDownToLine className="h-4 w-4 shrink-0 transition-transform group-hover:translate-y-1" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-label="Respaldo para tu obra" className="border-b border-[#E3E1D8] bg-white px-4 sm:px-6 lg:px-8">
        <ul className="mx-auto grid max-w-6xl grid-cols-1 gap-5 py-7 md:grid-cols-3 md:gap-8">
          {TRUST_ITEMS.map(({ icon: Icon, text }, index) => (
            <Reveal key={text} delay={index * 100}>
              <li className="flex min-w-0 items-center gap-4 text-sm font-semibold leading-relaxed">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#FF5A1F]/20 bg-[#FF5A1F]/10 transition-transform duration-300 hover:scale-110"><Icon className="h-6 w-6 text-[#B8390F]" aria-hidden="true" /></span>
                <span>{text}</span>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* CONTENIDO PRINCIPAL CON DINAMISMO */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 py-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-12">
          
          <Reveal>
            <section aria-labelledby="por-que-elegirnos">
              <div>
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-[#555B63]" style={{ fontFamily: FONT_MONO }}>Capacidad técnica y respaldo</p>
                <h2 id="por-que-elegirnos" className="text-balance text-2xl font-semibold md:text-3xl" style={{ fontFamily: FONT_DISPLAY }}>
                  Por qué las constructoras nos eligen
                </h2>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {BENEFITS.map(({ icon: Icon, title, text }) => (
                    <article key={title} className="group min-w-0 border-l-4 border-[#FF5A1F] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <Icon className="h-8 w-8 text-[#B8390F] transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                      <h3 className="mt-5 text-xl font-semibold" style={{ fontFamily: FONT_DISPLAY }}>{title}</h3>
                      <p className="mt-3 text-base leading-relaxed text-[#555B63]">{text}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section aria-labelledby="obras-respaldo">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-[#555B63]" style={{ fontFamily: FONT_MONO }}>Experiencia en campo</p>
                  <h2 id="obras-respaldo" className="scroll-mt-28 text-balance text-2xl font-semibold md:text-3xl" style={{ fontFamily: FONT_DISPLAY }}>
                    Obras que nos respaldan
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#555B63]">
                    Proyectos reales, alcances definidos y coordinación con constructoras en Lima.
                  </p>
                </div>
                <Link href="/proyectos" className="group inline-flex min-h-11 shrink-0 items-center gap-2 font-semibold hover:text-[#FF5A1F] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5A1F]">
                  Ver portafolio <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                {PROJECTS.map((project, index) => (
                  <Reveal key={project.slug} delay={index * 100}>
                    <Link href={`/proyectos/${project.slug}`} className="group flex min-w-0 flex-col h-full border border-[#E3E1D8] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#FF5A1F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5A1F]">
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <Image
                          src={project.imagen}
                          alt={`${project.titulo}, proyecto atendido por LUDIER en Lima`}
                          fill
                          sizes="(min-width: 1280px) 240px, (min-width: 1024px) 22vw, (min-width: 768px) 33vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <p className="mb-3 flex items-center gap-2 text-xs font-medium text-[#555B63]"><MapPin className="h-4 w-4 shrink-0" aria-hidden="true" /> Lima, Perú</p>
                        <h3 className="break-words text-xl font-semibold group-hover:text-[#FF5A1F] transition-colors" style={{ fontFamily: FONT_DISPLAY }}>{project.titulo}</h3>
                        <p className="mt-2 text-sm text-[#555B63]">{project.cliente}</p>
                        <p className="mt-4 text-base leading-relaxed text-[#555B63]">{PROJECT_DESCRIPTIONS[project.slug]}</p>
                        <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 font-semibold text-[#B8390F]">
                          Ver intervención <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section aria-labelledby="servicios-fabricamos">
              <div>
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-[#555B63]" style={{ fontFamily: FONT_MONO }}>De taller a obra</p>
                <h2 id="servicios-fabricamos" className="text-balance text-2xl font-semibold md:text-3xl" style={{ fontFamily: FONT_DISPLAY }}>
                  Servicios que fabricamos
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#555B63]">Revisa cada especialidad y compártenos las partidas que necesitas cotizar.</p>
                <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {SERVICES.map(({ icon: Icon, title, text, href }, index) => (
                    <Reveal key={href} delay={index * 100}>
                      <li className="min-w-0 h-full">
                        <Link href={href} className="group flex h-full min-h-11 flex-col border border-[#E3E1D8] bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#FF5A1F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5A1F]">
                          <div className="mb-5 flex items-center justify-between gap-4">
                            <span className="flex h-12 w-12 items-center justify-center border border-[#E3E1D8] bg-[#F7F7F4] transition-colors group-hover:bg-[#FFF3EC]"><Icon className="h-6 w-6 text-[#B8390F] transition-transform group-hover:scale-110" aria-hidden="true" /></span>
                            <ArrowUpRight className="h-5 w-5 text-[#555B63] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
                          </div>
                          <h3 className="break-words text-xl font-semibold group-hover:text-[#FF5A1F] transition-colors" style={{ fontFamily: FONT_DISPLAY }}>{title}</h3>
                          <p className="mt-3 text-base leading-relaxed text-[#555B63]">{text}</p>
                          <span className="mt-auto pt-5 text-sm font-semibold text-[#B8390F]">Ver servicio</span>
                        </Link>
                      </li>
                    </Reveal>
                  ))}
                </ul>
              </div>
            </section>
          </Reveal>

          {/* SECCIÓN DE REQUISITOS CON FONDO OSCURO Y BORDE ANIMADO */}
          <Reveal>
            <section aria-labelledby="que-enviar" className="relative bg-[#14161A] p-6 text-white sm:p-8 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF5A1F]/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
              <div className="relative min-w-0">
                <ClipboardList className="mb-6 h-9 w-9 text-[#FF5A1F] transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                <h2 id="que-enviar" className="text-balance text-2xl font-semibold" style={{ fontFamily: FONT_DISPLAY }}>Qué enviar para recibir tu cotización</h2>
                <p className="mt-4 text-base leading-relaxed text-[#C8CDD2]">Con esta información podemos evaluar el alcance y preparar una propuesta para tu equipo de compras.</p>
                <p className="mt-5 flex items-start gap-3 text-sm leading-relaxed text-[#C8CDD2]"><Ruler className="mt-0.5 h-5 w-5 shrink-0 text-[#FF5A1F]" aria-hidden="true" /> ¿Aún no tienes todo? Escríbenos y te ayudamos a definir lo que falta.</p>
                
                <ul className="mt-6 space-y-5">
                  {QUOTE_CHECKLIST.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-[#E3E1D8]"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#FF5A1F]" aria-hidden="true" /><span>{item}</span></li>
                  ))}
                </ul>
                <WhatsAppLink href={WHATSAPP_URL} location="landing-empresas-requisitos" page={PAGE_PATH} className="ludier-button ludier-button-primary mt-8 w-full group/btn">
                  <MessageCircle className="h-5 w-5 shrink-0 transition-transform group-hover/btn:rotate-12" aria-hidden="true" /> Enviar planos por WhatsApp
                </WhatsAppLink>
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section aria-labelledby="preguntas-frecuentes">
              <div className="space-y-6">
                <div className="min-w-0">
                  <p className="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-[#555B63]" style={{ fontFamily: FONT_MONO }}>Antes de contratar</p>
                  <h2 id="preguntas-frecuentes" className="text-balance text-2xl font-semibold md:text-3xl" style={{ fontFamily: FONT_DISPLAY }}>Preguntas frecuentes de constructoras</h2>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-[#555B63]">Seguridad, documentación y alcance: resolvemos las consultas de tu equipo antes de empezar.</p>
                </div>
                <div className="min-w-0 space-y-3">
                  {FAQS.map(({ question, answer }) => (
                    <details key={question} className="group border border-[#E3E1D8] bg-white open:border-[#B8390F] transition-colors">
                      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 p-5 text-base font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5A1F]">
                        <span className="min-w-0 group-hover:text-[#FF5A1F] transition-colors">{question}</span><ChevronRight className="h-5 w-5 shrink-0 text-[#B8390F] transition-transform group-open:rotate-90 motion-reduce:transition-none" aria-hidden="true" />
                      </summary>
                      <p className="px-5 pb-5 text-base leading-relaxed text-[#555B63]">{answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            </section>
          </Reveal>

        </div>
        
        {/* SIDEBAR CON DINAMISMO */}
        <Reveal delay={400} className="min-w-0 h-fit space-y-6 lg:sticky lg:top-24">
          <div className="bg-[#FF5A1F] p-6 text-[#14161A] shadow-xl">
            <h2 className="text-xl font-semibold" style={{ fontFamily: FONT_DISPLAY }}>¿Buscas un proveedor para tu obra?</h2>
            <p className="mb-6 mt-2 text-sm leading-relaxed">Compártenos planos, metrados y fechas. Te damos una primera respuesta en 24 horas.</p>
            <Link href={QUOTE_URL} className="block min-h-11 bg-white px-4 py-3 text-center text-sm font-bold hover:bg-[#F7F7F4] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14161A]">Solicitar cotización</Link>
            <WhatsAppLink href={WHATSAPP_URL} location="landing-empresas-sidebar" page={PAGE_PATH} className="mt-3 flex min-h-11 items-center justify-center gap-2 border border-[#14161A]/60 px-4 py-3 text-sm font-semibold hover:bg-white/20 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14161A]">
              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" /> Cotizar por WhatsApp
            </WhatsAppLink>
          </div>
          <div className="border border-[#E3E1D8] bg-white p-6">
            <h2 className="mb-4 text-base font-semibold" style={{ fontFamily: FONT_DISPLAY }}>Contacto directo</h2>
            <ul className="space-y-3 text-sm text-[#565C63]">
              <li><a href={`tel:${PHONE_TEL}`} className="flex min-h-11 items-center gap-2 hover:text-[#FF5A1F] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5A1F]"><PhoneCall className="h-4 w-4 shrink-0 text-[#B8390F]" aria-hidden="true" />{PHONE_DISPLAY}</a></li>
              <li className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#B8390F]" aria-hidden="true" /><span>Lunes a viernes, 8 a. m. a 6 p. m.</span></li>
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#B8390F]" aria-hidden="true" /><span>San Juan de Miraflores, Lima</span></li>
            </ul>
          </div>
        </Reveal>
      </div>

      <Reveal>
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
              <WhatsAppLink href={WHATSAPP_URL} location="landing-empresas-final" page={PAGE_PATH} className="ludier-button ludier-button-primary group/btn">
                <MessageCircle className="h-5 w-5 shrink-0 transition-transform group-hover/btn:rotate-12" aria-hidden="true" /> Cotizar por WhatsApp
              </WhatsAppLink>
              <Link href={QUOTE_URL} className="ludier-button ludier-button-secondary ludier-button-secondary-dark group/btn">
                <FileCheck className="h-5 w-5 shrink-0 transition-transform group-hover/btn:scale-110" aria-hidden="true" /> Enviar planos
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}