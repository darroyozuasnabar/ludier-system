// lib/proyectos-data.ts
//
// Datos puros de proyectos — SIN "use client"
// Se pueden importar desde Client Components Y Server Components
// (necesario para que app/sitemap.ts funcione)

export type Proyecto = {
  id: number;
  slug: string;
  titulo: string;
  cliente: string;
  ubicacion: string;
  servicios: string[];
  resultado: string;
  imagen: string;
  categoria: "residencial" | "comercial" | "industrial";
};

export const proyectosData: Proyecto[] = [
  {
    id: 1,
    slug: "zendai",
    titulo: "Edificio Residencial 28 Pisos Zendai",
    cliente: "Grupo LAR",
    ubicacion: "La Victoria, Lima",
    categoria: "residencial",
    servicios: [
      "Chute metálico para evacuación de residuos",
      "Barandas metálicas de seguridad",
      "Pasamanos metálicos",
      "Montaje, anclaje y soldadura en obra",
      "Adecuaciones metalmecánicas complementarias",
    ],
    resultado:
      "Implementación exitosa que contribuyó a la seguridad, operatividad y avance eficiente del proyecto.",
    imagen: "/img/zendai.png",
  },
  {
    id: 2,
    slug: "lince",
    titulo: "Cerco Metálico Perimetral – Lince",
    cliente: "Flat Canevaro S.A.C.",
    ubicacion: "Lince, Lima",
    categoria: "comercial",
    servicios: [
      "Estructuras metálicas para cerramiento perimetral",
      "Postes y paneles metálicos",
      "Instalación y nivelación",
      "Anclaje, soldadura y refuerzo estructural",
      "Adecuaciones según requerimientos",
      "Acabados y protección anticorrosiva",
    ],
    resultado:
      "Mejora de la seguridad, control de accesos y protección del proyecto durante las distintas etapas.",
    imagen: "/img/Flat_Lince.png",
  },
  {
    id: 3,
    slug: "san-miguel",
    titulo: "Edificación Multifamiliar – San Miguel",
    cliente: "MDP Construcciones S.A.C.",
    ubicacion: "San Miguel, Lima",
    categoria: "residencial",
    servicios: [
      "Chute metálico para evacuación de residuos",
      "Componentes estructurales para chute",
      "Estructuras auxiliares de soporte",
      "Soldadura, anclaje y fijación estructural",
      "Supervisión de montaje",
      "Acabados y protección",
    ],
    resultado:
      "Mejora de la seguridad, eficiencia operativa y gestión de residuos durante el desarrollo del proyecto.",
    imagen: "/img/Edificio_SanMiguel.png",
  },
  {
    id: 4,
    slug: "surco",
    titulo: "Proyecto Residencial – Surco",
    cliente: "Grupo Percola S.A.C.",
    ubicacion: "Santiago de Surco, Lima",
    categoria: "residencial",
    servicios: [
      "Chute metálico para evacuación de residuos",
      "Componentes estructurales para chute",
      "Estructuras auxiliares de soporte",
      "Soldadura, anclaje y fijación estructural",
      "Supervisión de montaje",
      "Acabados y protección",
    ],
    resultado:
      "Implementación exitosa de sistemas metalmecánicos para apoyo a la construcción, mejorando seguridad, eficiencia y gestión de residuos.",
    imagen: "/img/Proyecto_Surco.png",
  },
  {
    id: 5,
    slug: "centro-lima",
    titulo: "Edificación Urbana – Centro de Lima",
    cliente: "MDP Construcciones S.A.C.",
    ubicacion: "Centro Histórico, Lima",
    categoria: "comercial",
    servicios: [
      "Chute metálico para evacuación de residuos",
      "Pasamanos metálicos para circulación segura",
      "Componentes estructurales complementarios",
      "Montaje, anclaje y soldadura en campo",
      "Elementos de seguridad para trabajos en altura",
      "Acabados y verificación de calidad",
    ],
    resultado:
      "Soluciones orientadas a la seguridad, operatividad y productividad en un entorno urbano de alta exigencia.",
    imagen: "/img/Edificacion_CentroLima.png",
  },
  {
    id: 6,
    slug: "qantua",
    titulo: "Proyecto Residencial QANTUA – Fase 1 y 2",
    cliente: "Grupo LAR",
    ubicacion: "Cercado de Lima",
    categoria: "residencial",
    servicios: [
      "Barandas para escaleras de emergencia",
      "Pasamanos adosados a pared",
      "Chute metálico para residuos",
      "Estructuras metálicas para azotea",
      "Vigas metálicas para locales comerciales",
      "Rejillas y estructuras para tragaluces",
      "Apertura y cerramiento de cercos",
      "Trazado, perforación, anclaje, montaje y soldadura",
      "Acabados industriales (anticorrosivo, pintura, gloss mate)",
      "Control de calidad y adecuaciones",
    ],
    resultado:
      "Participación exitosa en ambas fases, fortaleciendo la seguridad, funcionalidad y calidad de la obra, cumpliendo estándares y plazos.",
    imagen: "/img/Qantua.jpg",
  },
  {
    id: 7,
    slug: "hilton",
    titulo: "Hilton MDP – Chacarilla",
    cliente: "MDP CONSTRUCCIONES S.A.C.",
    ubicacion: "Chacarilla, Surco",
    categoria: "comercial",
    servicios: [
      "Fabricación e instalación de chute metálico de 19 pisos",
      "Estructuras de soporte para sistema de evacuación",
      "Anclajes y fijaciones estructurales",
      "Acabados anticorrosivos",
    ],
    resultado:
      "Instalación exitosa del sistema de evacuación de residuos para el proyecto Hilton MDP, mejorando la eficiencia y seguridad durante la construcción.",
    imagen: "/img/hilton-lima-miraflores.jpg",
  },
];