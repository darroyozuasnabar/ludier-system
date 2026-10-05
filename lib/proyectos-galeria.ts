// lib/proyectos-galeria.ts
//
// Metadatos de la galería de fotos y videos por proyecto.
// Fuente única de verdad para la landing (carpeta pública + JSON estático).
//
// Cuando agregues fotos nuevas:
//   1. Coloca el archivo en public/img/proyectos/<slug>/
//   2. Añade una entrada en el array `fotos` de ese proyecto
//
// Cuando agregues videos nuevos:
//   1. Coloca el archivo en public/img/proyectos/<slug>/videos/
//   2. Añade una entrada en el array `videos` de ese proyecto

export type CategoriaFoto =
  | "barandas"
  | "instalacion"
  | "estructuras"
  | "cercos"
  | "mobiliario";

export type FotoGaleria = {
  /** Ruta pública desde /public — ej: "/img/proyectos/qantua/01-..." */
  src: string;
  /** Título corto, visible en el lightbox */
  titulo: string;
  /** Descripción larga, visible en el lightbox */
  descripcion: string;
  /** Categoría para filtros */
  categoria: CategoriaFoto;
  /** Texto alternativo para SEO y accesibilidad */
  alt: string;
  /** Orden dentro de la categoría (opcional) */
  orden?: number;
};

export type VideoGaleria = {
  /** Ruta pública desde /public — ej: "/img/proyectos/qantua/videos/..." */
  src: string;
  /** Título corto */
  titulo: string;
  /** Descripción */
  descripcion: string;
  /** Ruta pública del poster/thumbnail (opcional) */
  poster?: string;
  /** Duración formateada — solo informativo */
  duracion?: string;
};

export type GaleriaProyecto = {
  fotos: FotoGaleria[];
  videos: VideoGaleria[];
};

export const CATEGORIAS_INFO: Record<
  CategoriaFoto,
  { label: string; color: string }
> = {
  barandas: { label: "Barandas", color: "orange" },
  instalacion: { label: "Instalación", color: "blue" },
  estructuras: { label: "Estructuras metálicas", color: "amber" },
  cercos: { label: "Cercos y cerramientos", color: "gray" },
  mobiliario: { label: "Mobiliario metálico", color: "emerald" },
};

// ═══════════════════════════════════════════════════════════════════════════
// GALERÍA POR PROYECTO
// ═══════════════════════════════════════════════════════════════════════════

export const GALERIAS: Record<string, GaleriaProyecto> = {
  // ───────────────────────────────────────────────────────────────────────
  // QANTUA — Fase 1 y 2
  // ───────────────────────────────────────────────────────────────────────
  qantua: {
    fotos: [
      {
        src: "/img/proyectos/qantua/01-barandas-balcones-qantua.png",
        titulo: "Barandas metálicas para balcones residenciales",
        descripcion:
          "Las barandas metálicas en acabado negro mate aportan seguridad, estructura y carácter arquitectónico a las Torres A, B y C de Qantua Fase 1. Su diseño uniforme realza la fachada y genera una identidad visual moderna en todo el conjunto residencial.",
        categoria: "barandas",
        alt: "Barandas metálicas negro mate para balcones en Qantua Fase 1",
      },
      {
        src: "/img/proyectos/qantua/01-pasamanos-escalera-residencial-qantua-fase-2.png",
        titulo: "Barandas y pasamanos para escaleras residenciales",
        descripcion:
          "Barandas metálicas y pasamanos en acabado negro mate para escaleras residenciales de Qantua Fase 2. Su diseño moderno aporta seguridad en la circulación peatonal, define el recorrido arquitectónico de la escalera y se integra visualmente con los acabados contemporáneos del proyecto.",
        categoria: "barandas",
        alt: "Barandas y pasamanos metálicos para escaleras en Qantua Fase 2",
      },
      {
        src: "/img/proyectos/qantua/02-torres-barandas-balcones-qantua-fase-1.png",
        titulo: "Barandas para balcones en torres residenciales",
        descripcion:
          "Fabricación e instalación de barandas metálicas para balcones en las Torres A y B de Qantua Fase 1. El acabado negro mate, la uniformidad de montaje y la integración con la arquitectura residencial convierten a las barandas en un elemento distintivo de la fachada del proyecto.",
        categoria: "barandas",
        alt: "Barandas metálicas para balcones en torres A y B de Qantua Fase 1",
      },
      {
        src: "/img/proyectos/qantua/03-instalacion-barandas-escalera-emergencia-qantua.png",
        titulo: "Instalación de barandas para escaleras de emergencia",
        descripcion:
          "Proceso de fabricación e instalación de barandas metálicas para escaleras de emergencia en Qantua Fase 1. La imagen muestra la etapa de montaje en obra, donde se realizan trabajos de alineación, soldadura y fijación de la estructura metálica para garantizar seguridad, resistencia y cumplimiento de los requerimientos del proyecto.",
        categoria: "instalacion",
        alt: "Instalación de barandas metálicas para escaleras de emergencia en Qantua",
      },
      {
        src: "/img/proyectos/qantua/04-cobertura-ducto-policarbanato-qantua.png",
        titulo: "Estructura metálica con cobertura de policarbonato",
        descripcion:
          "Fabricación e instalación de estructura metálica con cobertura de policarbonato para la protección de un ducto técnico en la azotea de Qantua Fase 1. La solución resguarda la infraestructura del edificio frente a la exposición ambiental, mientras que las barandas metálicas perimetrales contribuyen a la seguridad y delimitación de las áreas de circulación y mantenimiento en cubierta.",
        categoria: "estructuras",
        alt: "Estructura metálica con cobertura de policarbonato en Qantua Fase 1",
      },
      {
        src: "/img/proyectos/qantua/05-instalacion-barandas-balcones-qantua-fase-2.png",
        titulo: "Instalación de barandas para balcones en obra",
        descripcion:
          "Barandas metálicas para balcones instaladas durante la etapa de construcción de Qantua Fase 2. La imagen muestra la uniformidad de montaje y alineación de cada módulo antes de la ejecución de los acabados finales de fachada, evidenciando la precisión del proceso de fabricación e instalación en obra.",
        categoria: "instalacion",
        alt: "Instalación de barandas metálicas para balcones en Qantua Fase 2",
      },
      {
        src: "/img/proyectos/qantua/06-proceso-barandas-balcones-azotea-qantua-fase-2.png",
        titulo: "Proceso de instalación de barandas en edificio multifamiliar",
        descripcion:
          "Vista frontal de una torre de Qantua Fase 2 durante su etapa de construcción. La imagen muestra las barandas metálicas instaladas en los balcones residenciales, mientras que en la azotea se observan sistemas provisionales de protección previos a la instalación de las barandas definitivas. El conjunto evidencia el avance de los trabajos metalmecánicos y la integración progresiva de los elementos de seguridad del proyecto.",
        categoria: "instalacion",
        alt: "Proceso de instalación de barandas metálicas en azotea de Qantua Fase 2",
      },
      {
        src: "/img/proyectos/qantua/07-barandas-balcones-proceso-constructivo-qantua-fase-2.png",
        titulo: "Barandas para balcones en proceso constructivo",
        descripcion:
          "Vista de una torre de Qantua Fase 2 durante su etapa de construcción, con las barandas metálicas de balcones ya instaladas antes de la ejecución de los acabados finales de fachada. La imagen evidencia la uniformidad de montaje y la alineación de los módulos.",
        categoria: "instalacion",
        alt: "Barandas metálicas para balcones en proceso constructivo en Qantua Fase 2",
      },
      {
        src: "/img/proyectos/qantua/08-barandas-balcones-rampas-qantua-fase-1.png",
        titulo: "Barandas para balcones y rampas de acceso",
        descripcion:
          "Vista interior de Qantua Fase 1 que muestra barandas metálicas en acabado negro mate instaladas en balcones residenciales y rampas de circulación. La imagen destaca la uniformidad del diseño, la integración arquitectónica de los elementos metálicos y la continuidad visual del acabado en las distintas áreas del proyecto.",
        categoria: "barandas",
        alt: "Barandas metálicas para balcones y rampas de acceso en Qantua Fase 1",
      },
      {
        src: "/img/proyectos/qantua/09-rampas-circulacion-barandas-qantua-fase-1.png",
        titulo: "Barandas para rampas de circulación peatonal",
        descripcion:
          "Barandas metálicas en acabado negro mate instaladas en las rampas de circulación de Qantua Fase 1. La imagen destaca la continuidad del diseño, la seguridad en el desplazamiento peatonal y la integración de los elementos metálicos con la arquitectura del conjunto residencial.",
        categoria: "barandas",
        alt: "Barandas metálicas para rampas de circulación en Qantua Fase 1",
      },
      {
        src: "/img/proyectos/qantua/10-barandas-rampas-circulacion-qantua-fase-1.png",
        titulo: "Barandas negro mate para rampas de circulación",
        descripcion:
          "Barandas metálicas en acabado negro mate instaladas en las rampas de circulación de Qantua Fase 1. La imagen destaca la continuidad del sistema de protección, la adaptación de las barandas a los cambios de nivel y su integración con las áreas comunes y residenciales del proyecto.",
        categoria: "barandas",
        alt: "Barandas metálicas negro mate para rampas de circulación en Qantua Fase 1",
      },
      {
        src: "/img/proyectos/qantua/11-barandas-balcones-fachada-terminada-qantua-fase-1.png",
        titulo: "Barandas para balcones en fachada terminada",
        descripcion:
          "Barandas metálicas en acabado negro mate instaladas en los balcones de Qantua Fase 1. La imagen destaca la uniformidad del diseño, la alineación de los módulos y su integración con la fachada terminada, aportando seguridad y una estética contemporánea al conjunto residencial.",
        categoria: "barandas",
        alt: "Barandas metálicas para balcones en fachada terminada de Qantua Fase 1",
      },
      {
        src: "/img/proyectos/qantua/12-cerco-perimetrico-aluzinc-qantua.png",
        titulo: "Cerco perimétrico de aluzinc",
        descripcion:
          "Cerco perimétrico de aluzinc instalado para la delimitación y separación entre Qantua Fase 1 y Qantua Fase 2. La solución proporciona cerramiento temporal y control visual durante el desarrollo de las obras, integrándose con las áreas comunes y espacios exteriores del proyecto.",
        categoria: "cercos",
        alt: "Cerco perimétrico de aluzinc entre Qantua Fase 1 y Fase 2",
      },
      {
        src: "/img/proyectos/qantua/13-vigas-metalicas-locales-comerciales-qantua.png",
        titulo: "Vigas metálicas para locales comerciales",
        descripcion:
          "Fabricación e instalación de vigas metálicas estructurales para los locales comerciales ubicados en la fachada exterior de Qantua. La estructura fue diseñada para soportar las futuras áreas comerciales del proyecto, garantizando estabilidad, adecuada transferencia de cargas e integración con la arquitectura del conjunto multifamiliar. La imagen muestra una etapa de montaje en obra previa a la ejecución de acabados y cerramientos.",
        categoria: "estructuras",
        alt: "Vigas metálicas estructurales para locales comerciales en Qantua",
      },
      {
        src: "/img/proyectos/qantua/14-rejilla-metalica-ventilacion-ducto-qantua-fase-1.png",
        titulo: "Rejilla metálica para ventilación de ducto técnico",
        descripcion:
          "Fabricación e instalación de rejilla metálica de aluminio para ventilación y protección de ducto técnico en Qantua Fase 1. La solución permite la circulación permanente del aire hacia los espacios técnicos del edificio, contribuyendo al correcto funcionamiento de las instalaciones y manteniendo una integración estética con las áreas comunes y acabados arquitectónicos del proyecto.",
        categoria: "estructuras",
        alt: "Rejilla metálica para ventilación de ducto técnico en Qantua Fase 1",
      },
      {
        src: "/img/proyectos/qantua/15-estructura-metalica-mesa-proceso-qantua-fase-2.png",
        titulo: "Estructura metálica para mesa integrada",
        descripcion:
          "Proceso de fabricación e instalación de estructura metálica para mesa integrada en un departamento de Qantua Fase 2. La imagen muestra la base estructural en acero con acabado negro mate durante la etapa previa a la colocación de la superficie final, evidenciando los trabajos de fabricación, soldadura y acondicionamiento realizados para garantizar estabilidad, resistencia y una correcta integración con el diseño interior del ambiente.",
        categoria: "mobiliario",
        alt: "Estructura metálica para mesa integrada en Qantua Fase 2",
      },
      {
        src: "/img/proyectos/qantua/16-barandas-azotea-proceso-instalacion-qantua-fase-2.png",
        titulo: "Proceso de instalación de barandas en azotea",
        descripcion:
          "Proceso de fabricación e instalación de barandas metálicas para la azotea de Qantua Fase 2. La imagen muestra una etapa inicial de montaje en obra, donde los módulos metálicos se encuentran parcialmente instalados y en proceso de alineación y fijación. Estos elementos están destinados a brindar protección perimetral y seguridad en las áreas de circulación y mantenimiento de la cubierta del edificio.",
        categoria: "instalacion",
        alt: "Proceso de instalación de barandas metálicas en azotea de Qantua Fase 2",
      },
      {
        src: "/img/proyectos/qantua/17-barandas-rampa-circulacion-qantua-fase-2.png",
        titulo: "Barandas para rampa de circulación peatonal",
        descripcion:
          "Barandas metálicas en acabado negro mate instaladas en la rampa de circulación peatonal de Qantua Fase 2. El sistema proporciona seguridad en los desplazamientos, delimita las áreas de circulación y se integra visualmente con la arquitectura contemporánea del proyecto, manteniendo uniformidad con los demás elementos metálicos del conjunto residencial.",
        categoria: "barandas",
        alt: "Barandas metálicas para rampa de circulación peatonal en Qantua Fase 2",
      },
      {
        src: "/img/proyectos/qantua/18-barandas-azotea-con-base-anticorrosiva-qantua-fase-2.png",
        titulo: "Barandas para azotea con base anticorrosiva",
        descripcion:
          "Barandas metálicas instaladas en la azotea de Qantua Fase 2 durante la etapa de acondicionamiento previo al acabado final. La imagen muestra los elementos metálicos con aplicación de base anticorrosiva, tratamiento que contribuye a la protección de la estructura frente a la humedad y la exposición ambiental, garantizando mayor durabilidad y adecuado desempeño en cubierta.",
        categoria: "instalacion",
        alt: "Barandas metálicas para azotea con base anticorrosiva en Qantua Fase 2",
      },
    ],
    videos: [
      // Descomentar y ajustar cuando subas los videos
      // {
      //   src: "/img/proyectos/qantua/videos/recorrido-qantua.mp4",
      //   titulo: "Recorrido por Qantua Fase 2",
      //   descripcion: "Recorrido completo por la obra terminada de Qantua Fase 2.",
      //   poster: "/img/proyectos/qantua/11-barandas-balcones-fachada-terminada-qantua-fase-1.png",
      //   duracion: "1:20",
      // },
      // {
      //   src: "/img/proyectos/qantua/videos/instalacion-timelapse.mp4",
      //   titulo: "Timelapse de instalación",
      //   descripcion: "Proceso de instalación en cámara rápida.",
      //   poster: "/img/proyectos/qantua/05-instalacion-barandas-balcones-qantua-fase-2.png",
      //   duracion: "0:35",
      // },
    ],
  },

  // Los demás proyectos no tienen galería por ahora.
  // Cuando agregues fotos, añade la entrada aquí.
};

/** Retorna la galería de un proyecto o null si no existe. */
export function getGaleriaProyecto(slug: string): GaleriaProyecto | null {
  return GALERIAS[slug] ?? null;
}