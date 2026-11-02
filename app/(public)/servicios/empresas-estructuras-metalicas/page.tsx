import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Factory,
  FileCheck,
  HardHat,
  MessageCircle,
  ShieldCheck,
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
  { title: "Techos metálicos", href: "/servicios/estructuras-metalicas-para-techos" },
  { title: "Barandas metálicas y de acero inoxidable", href: "/servicios/barandas-acero-inoxidable" },
  { title: "Escaleras metálicas", href: "/servicios/escaleras-metalicas" },
  { title: "Chutes metálicos", href: "/servicios/chutes-metalicos-para-construccion" },
  { title: "Cercos y cerramientos", href: "/servicios/cercos-cerramientos" },
  { title: "Fabricación a medida", href: "/servicios/fabricacion-medida" },
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

      <section aria-labelledby="titulo-empresas" className="bg-[#14161A] px-4 py-12 text-white sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <Link href="/servicios" className="inline-flex min-h-11 items-center gap-2 text-sm text-[#C8CDD2] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5A1F]">
            Servicios / Proveedores para constructoras
          </Link>
          <h1 id="titulo-empresas" className="mt-5 max-w-4xl break-words text-balance text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl" style={{ fontFamily: FONT_DISPLAY }}>
            Fabricante de Estructuras Metálicas para Constructoras en Lima
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#C8CDD2] sm:text-lg">
            +10 años de experiencia, cuadrillas propias y homologados por Grupo LAR.
            Fabricamos e instalamos soluciones metalmecánicas según tus planos,
            con coordinación directa con residentes de obra y equipos de compras.
          </p>
          <Link href={QUOTE_URL} className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 bg-[#FF5A1F] px-6 py-3.5 text-center font-semibold text-[#14161A] transition-colors hover:bg-[#FF7A44] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            Cotizar mi obra ahora <ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section aria-label="Respaldo para tu obra" className="border-b border-[#E3E1D8] bg-white px-4 sm:px-6 lg:px-8">
        <ul className="mx-auto grid max-w-6xl grid-cols-1 gap-5 py-7 md:grid-cols-3 md:gap-8">
          {TRUST_ITEMS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex min-w-0 items-center gap-3 text-sm font-semibold leading-relaxed">
              <Icon className="h-6 w-6 shrink-0 text-[#FF5A1F]" aria-hidden="true" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="por-que-elegirnos" className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 id="por-que-elegirnos" className="text-balance text-3xl font-semibold sm:text-4xl" style={{ fontFamily: FONT_DISPLAY }}>
            Por qué las constructoras nos eligen
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <article key={title} className="min-w-0 border border-[#E3E1D8] bg-white p-6">
                <Icon className="h-8 w-8 text-[#FF5A1F]" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-semibold" style={{ fontFamily: FONT_DISPLAY }}>{title}</h3>
                <p className="mt-3 text-base leading-relaxed text-[#555B63]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="obras-respaldo" className="border-y border-[#E3E1D8] bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 id="obras-respaldo" className="text-balance text-3xl font-semibold sm:text-4xl" style={{ fontFamily: FONT_DISPLAY }}>
            Obras que nos respaldan
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#555B63]">
            Conoce los trabajos ejecutados por LUDIER para proyectos de construcción en Lima.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {PROJECTS.map((project) => (
              <Link key={project.slug} href={`/proyectos/${project.slug}`} className="group flex min-w-0 flex-col border border-[#E3E1D8] bg-[#F7F7F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5A1F]">
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
                  <h3 className="text-2xl font-semibold group-hover:underline" style={{ fontFamily: FONT_DISPLAY }}>{project.titulo}</h3>
                  <p className="mt-2 text-sm text-[#555B63]">{project.cliente}</p>
                  <p className="mt-4 text-base leading-relaxed text-[#555B63]">{PROJECT_DESCRIPTIONS[project.slug]}</p>
                  <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 font-semibold">
                    Ver proyecto <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="servicios-fabricamos" className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 id="servicios-fabricamos" className="text-balance text-3xl font-semibold sm:text-4xl" style={{ fontFamily: FONT_DISPLAY }}>
            Servicios que fabricamos
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <li key={service.href} className="min-w-0">
                <Link href={service.href} className="flex min-h-11 h-full items-center gap-3 border border-[#E3E1D8] bg-white p-5 font-semibold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5A1F]">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#555B63]" aria-hidden="true" />
                  <span className="min-w-0 break-words">{service.title}</span>
                </Link>
              </li>
            ))}
          </ul>
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
