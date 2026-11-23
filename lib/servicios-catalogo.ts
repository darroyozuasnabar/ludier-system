import {
  ArrowDownToLine,
  Building2,
  DoorOpen,
  Gauge,
  Shield,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type ServicioCatalogo = {
  slug: string;
  href: string;
  icon: LucideIcon;
  code: string;
  title: string;
  description: string;
  tag: string;
  image: string;
  imageAlt: string;
  linkLabel: string;
  relatedLinks: { label: string; href: string }[];
};

// La portada y el listado comparten categorías, destinos y servicios relacionados.
// Las páginas especializadas siguen accesibles sin duplicar líneas de negocio.
export const SERVICIOS_CATALOGO: ServicioCatalogo[] = [
  {
    slug: "estructuras-metalicas",
    href: "/servicios/estructuras-metalicas",
    icon: Building2,
    code: "EST–01",
    title: "Estructuras metálicas",
    description:
      "Fabricación y montaje de estructuras para techos, coberturas, plataformas y soportes, según los planos y el alcance de tu proyecto.",
    tag: "Estructuras",
    image: "/img/estructurasMetalicas.png",
    imageAlt: "Estructuras metálicas para techos y coberturas",
    linkLabel: "Ver estructuras metálicas",
    relatedLinks: [
      { label: "Techos y coberturas metálicas", href: "/servicios/estructuras-metalicas-para-techos" },
    ],
  },
  {
    slug: "barandas-pasamanos",
    href: "/servicios/barandas-pasamanos",
    icon: Shield,
    code: "BAR–02",
    title: "Barandas y pasamanos",
    description:
      "Barandas metálicas y pasamanos para balcones, escaleras y terrazas. Fabricación a medida e instalación coordinada con tu obra.",
    tag: "Seguridad",
    image: "/img/barandaBalcones.jpg",
    imageAlt: "Barandas metálicas instaladas en balcones",
    linkLabel: "Ver barandas y pasamanos",
    relatedLinks: [
      { label: "Barandas de acero inoxidable", href: "/servicios/barandas-acero-inoxidable" },
    ],
  },
  {
    slug: "escaleras-metalicas",
    href: "/servicios/escaleras-metalicas",
    icon: Gauge,
    code: "ESC–03",
    title: "Escaleras metálicas",
    description:
      "Escaleras de emergencia, marineras e industriales para acceso y evacuación. Fabricación y montaje según los requerimientos del proyecto.",
    tag: "Accesos",
    image: "/img/escaleras-de-emergencia.jpg",
    imageAlt: "Escalera metálica de emergencia con pasamanos",
    linkLabel: "Ver escaleras metálicas",
    relatedLinks: [],
  },
  {
    slug: "puertas-portones",
    href: "/servicios/puertas-portones",
    icon: DoorOpen,
    code: "PUE–04",
    title: "Puertas, portones y cercos",
    description:
      "Puertas de seguridad, portones metálicos y cercos permanentes para controlar accesos y proteger edificios, locales e instalaciones industriales.",
    tag: "Cerramientos",
    image: "/img/portones.jpeg",
    imageAlt: "Portón metálico para control de accesos",
    linkLabel: "Ver puertas, portones y cercos",
    relatedLinks: [],
  },
  {
    slug: "chutes-metalicos-para-construccion",
    href: "/servicios/chutes-metalicos-para-construccion",
    icon: ArrowDownToLine,
    code: "OBR–05",
    title: "Chutes y protecciones para obra",
    description:
      "Chutes metálicos para evacuar escombros, con instalación y desmontaje. Complementa tu obra con protecciones provisionales y cerramientos temporales.",
    tag: "Equipamiento de obra",
    image: "/img/chutesMetalicos.webp",
    imageAlt: "Chute metálico para evacuación de escombros en obra",
    linkLabel: "Ver chutes metálicos",
    relatedLinks: [
      { label: "Cercos y cerramientos temporales", href: "/servicios/cercos-cerramientos" },
    ],
  },
  {
    slug: "fabricacion-medida",
    href: "/servicios/fabricacion-medida",
    icon: Wrench,
    code: "FAB–06",
    title: "Fabricación a medida",
    description:
      "Rejillas, tapas, sumideros, racks y soportes especiales. Fabricamos piezas metálicas según planos, medidas y especificaciones de tu proyecto.",
    tag: "Según planos",
    image: "/img/soldaduraPersonalizada.jpg",
    imageAlt: "Trabajos de soldadura para fabricación metálica a medida",
    linkLabel: "Ver fabricación a medida",
    relatedLinks: [],
  },
];
