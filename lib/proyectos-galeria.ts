// lib/proyectos-galeria.ts
//
// Metadatos de la galería de fotos y videos por proyecto.
// Fuente única de verdad para la landing (carpeta pública + JSON estático).

export type CategoriaFoto =
  | "barandas"
  | "instalacion"
  | "estructuras"
  | "cercos"
  | "mobiliario"
  | "proyecto_terminado";

export type EtapaFoto = "antes" | "proceso" | "despues" | "final";

// ─── Galería plana ─────────────────────────────────────────────────────────
export type FotoGaleria = {
  src: string;
  titulo: string;
  descripcion: string;
  categoria: CategoriaFoto;
  alt: string;
  orden?: number;
};

// ─── Servicios (carrusel antes/después) ────────────────────────────────────
export type FotoServicio = {
  src: string;
  etapa: EtapaFoto;
  alt: string;
};

export type ServicioGaleria = {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: "antes-despues" | "proceso" | "final";
  fotos: FotoServicio[];
};

// ─── Videos ────────────────────────────────────────────────────────────────
export type VideoGaleria = {
  src: string;
  titulo: string;
  descripcion: string;
  poster?: string;
  duracion?: string;
};

// ─── Galería completa por proyecto ─────────────────────────────────────────
export type GaleriaProyecto = {
  servicios: ServicioGaleria[];
  fotos: FotoGaleria[];
  videos: VideoGaleria[];
};

// ─── Info de categorías (galería plana) ────────────────────────────────────
export const CATEGORIAS_INFO: Record<
  CategoriaFoto,
  { label: string; color: string }
> = {
  barandas: { label: "Barandas", color: "orange" },
  instalacion: { label: "Instalación", color: "blue" },
  estructuras: { label: "Estructuras metálicas", color: "amber" },
  cercos: { label: "Cercos y cerramientos", color: "gray" },
  mobiliario: { label: "Mobiliario metálico", color: "emerald" },
  proyecto_terminado: { label: "Proyecto Terminado", color: "green" },
};

// ─── Info de etapas (carrusel servicios) ───────────────────────────────────
export const ETAPAS_INFO: Record<
  EtapaFoto,
  { label: string; color: string }
> = {
  antes: { label: "Antes", color: "gray" },
  proceso: { label: "Instalación", color: "blue" },
  despues: { label: "Después", color: "emerald" },
  final: { label: "Final", color: "orange" },
};

// ═══════════════════════════════════════════════════════════════════════════
// GALERÍA POR PROYECTO
// ═══════════════════════════════════════════════════════════════════════════

export const GALERIAS: Record<string, GaleriaProyecto> = {
  zendai: {
    servicios: [
      {
        id: "barandas-balcones",
        titulo: "Barandas metálicas para balcones residenciales",
        descripcion:
          "Fabricación e instalación de barandas metálicas de seguridad para los balcones del Edificio Residencial Zendai. La solución aporta protección estructural, cumple con las normativas de seguridad en altura y define la estética de la fachada del edificio.",
        tipo: "antes-despues",
        fotos: [
          {
            src: "/img/proyectos/zendai/zendai_construccion.jpg",
            etapa: "antes",
            alt: "Balcones del edificio Zendai durante la etapa de construcción antes de la instalación de barandas",
          },
          {
            src: "/img/proyectos/zendai/zendai_img2.jpg",
            etapa: "despues",
            alt: "Barandas metálicas instaladas y terminadas en los balcones del Edificio Zendai",
          },
        ],
      },
    ],
    fotos: [
      {
        src: "/img/proyectos/zendai/zendai_img1.png",
        titulo: "Barandas metálicas para balcones en Zendai",
        descripcion:
          "Vista de las barandas metálicas instaladas en los balcones del Edificio Residencial Zendai, aportando seguridad y un diseño moderno a la fachada.",
        categoria: "barandas",
        alt: "Barandas metálicas en balcones del edificio Zendai",
      },
      {
        src: "/img/proyectos/zendai/zendai_imagen3.jpg",
        titulo: "Detalle de barandas y estructura metálica",
        descripcion:
          "Detalle de los trabajos de carpintería metálica realizados en el proyecto Zendai, mostrando la precisión en soldadura y acabados.",
        categoria: "estructuras",
        alt: "Detalle de instalación de barandas en Zendai",
      },
      {
        src: "/img/proyectos/zendai/zendai_img2.jpg",
        titulo: "Acabado final de barandas en balcones",
        descripcion:
          "Vista final de las barandas metálicas terminadas en los balcones del Edificio Zendai, resaltando la uniformidad del diseño y la integración con la fachada terminada.",
        categoria: "barandas",
        alt: "Acabado final de barandas metálicas en Zendai",
      },
    ],
    videos: [],
  },

  qantua: {
    servicios: [
      {
        id: "barandas-azotea",
        titulo: "Barandas metálicas para azotea",
        descripcion:
          "Fabricación e instalación de barandas metálicas en acabado negro mate para la protección de áreas técnicas en la azotea. La solución proporciona seguridad perimetral para labores de inspección y mantenimiento en cubierta.",
        tipo: "antes-despues",
        fotos: [
          {
            src: "/img/proyectos/qantua/16-barandas-azotea-proceso-instalacion-qantua-fase-2.png",
            etapa: "antes",
            alt: "Azotea en proceso de instalación de barandas metálicas en Qantua Fase 2",
          },
          {
            src: "/img/proyectos/qantua/26-barandas-azotea-terminadas-qantua.png",
            etapa: "despues",
            alt: "Barandas metálicas terminadas en azotea de Qantua Fase 2",
          },
        ],
      },
      {
        id: "tapas-cuarto-bombas",
        titulo: "Tapas metálicas para cuarto de bombas",
        descripcion:
          "Fabricación e instalación de tapas metálicas registrables en plancha estriada para el cuarto de bombas. Diseñadas para permitir acceso seguro a áreas técnicas de mantenimiento e inspección.",
        tipo: "antes-despues",
        fotos: [
          {
            src: "/img/proyectos/qantua/20-cuarto-bombas-antes-instalacion-tapas-metalicas.png",
            etapa: "antes",
            alt: "Cuarto de bombas antes de la instalación de tapas metálicas en Qantua",
          },
          {
            src: "/img/proyectos/qantua/24-tapas-metalicas-cuarto-bombas-qantua.png",
            etapa: "despues",
            alt: "Tapas metálicas instaladas en cuarto de bombas de Qantua",
          },
        ],
      },
      {
        id: "cobertura-policarbonato",
        titulo: "Cobertura de policarbonato para ducto de gas",
        descripcion:
          "Fabricación e instalación de estructura metálica y cobertura de policarbonato para la protección de ductos técnicos en azotea. Resguarda la infraestructura del edificio frente a la exposición ambiental.",
        tipo: "antes-despues",
        fotos: [
          {
            src: "/img/proyectos/qantua/21-estructura-metalica-ducto-antes-qantua-fase-1.png",
            etapa: "antes",
            alt: "Ducto antes de la instalación de cobertura de policarbonato en Qantua Fase 1",
          },
          {
            src: "/img/proyectos/qantua/25-cobertura-policarbonato-ducto-gas-qantua.png",
            etapa: "despues",
            alt: "Cobertura de policarbonato instalada en ducto de gas de Qantua",
          },
        ],
      },
      {
        id: "barandas-balcones",
        titulo: "Barandas para balcones residenciales",
        descripcion:
          "Fabricación e instalación de barandas metálicas en acabado negro mate para balcones residenciales de las Torres A, B y C de Qantua. El diseño uniforme realza la fachada y aporta seguridad estructural, integrando una identidad visual moderna a todo el conjunto.",
        tipo: "antes-despues",
        fotos: [
          {
            src: "/img/proyectos/qantua/05-instalacion-barandas-balcones-qantua-fase-2.png",
            etapa: "antes",
            alt: "Instalación de barandas metálicas para balcones durante la etapa de construcción en Qantua Fase 2",
          },
          {
            src: "/img/proyectos/qantua/01-barandas-balcones-qantua.png",
            etapa: "despues",
            alt: "Barandas metálicas en acabado negro mate terminadas en balcones de Qantua Fase 1",
          },
        ],
      },
      {
        id: "mesa-isla",
        titulo: "Estructura metálica para mesa integrada",
        descripcion:
          "Fabricación e instalación de estructura metálica tubular para soporte de mesa integrada en departamentos residenciales de Qantua Fase 2. La combinación funcional y de diseño en acabado negro mate se integra al mobiliario interior del ambiente.",
        tipo: "antes-despues",
        fotos: [
          {
            src: "/img/proyectos/qantua/15-estructura-metalica-mesa-proceso-qantua-fase-2.png",
            etapa: "antes",
            alt: "Estructura metálica para mesa integrada durante el proceso de fabricación en Qantua Fase 2",
          },
          {
            src: "/img/proyectos/qantua/22-estructura-metalica-mesa-departamento-qantua.png",
            etapa: "despues",
            alt: "Estructura metálica para mesa integrada terminada en departamento de Qantua Fase 2",
          },
        ],
      },
      {
        id: "escaleras-emergencia",
        titulo: "Escaleras de emergencia con barandas metálicas",
        descripcion:
          "Fabricación e instalación de barandas metálicas para escaleras de emergencia en Qantua Fase 1. El sistema garantiza la seguridad y evacuación del edificio, cumpliendo con las normativas vigentes.",
        tipo: "antes-despues",
        fotos: [
          {
            src: "/img/proyectos/qantua/03-instalacion-barandas-escalera-emergencia-qantua.png",
            etapa: "antes",
            alt: "Instalación de barandas metálicas para escaleras de emergencia en Qantua Fase 1",
          },
          {
            src: "/img/proyectos/qantua/27-escaleras-de-emergencia_acabado.jpg",
            etapa: "despues",
            alt: "Acabado final de escaleras de emergencia con barandas metálicas en Qantua",
          },
        ],
      },
    ],

    fotos: [
      {
        src: "/img/proyectos/qantua/28-vistaIntegralQantuaF1&F2.jpeg",
        titulo: "Vista integral de Qantua Fase 1 y Qantua Fase 2",
        descripcion:
          "Vista panorámica del proyecto Qantua que muestra el conjunto residencial conformado por las torres de Qantua Fase 1 y Qantua Fase 2. La imagen permite apreciar la integración arquitectónica de ambas etapas, así como las barandas metálicas instaladas en balcones, áreas comunes y espacios de circulación, elementos fabricados e instalados por LUDIER como parte de los trabajos metalmecánicos desarrollados para el proyecto.",
        categoria: "proyecto_terminado",
        alt: "Vista panorámica de las torres de Qantua Fase 1 y Fase 2",
      },
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
          "Fabricación e instalación de estructura metálica con cobertura de policarbonato para la protección de un ducto técnico en la azotea de Qantua Fase 1. La solución resguarda la infraestructura del edificio frente a la exposición ambiental.",
        categoria: "estructuras",
        alt: "Estructura metálica con cobertura de policarbonato en Qantua Fase 1",
      },
      {
        src: "/img/proyectos/qantua/05-instalacion-barandas-balcones-qantua-fase-2.png",
        titulo: "Instalación de barandas para balcones en obra",
        descripcion:
          "Barandas metálicas para balcones instaladas durante la etapa de construcción de Qantua Fase 2. La imagen muestra la uniformidad de montaje y alineación de cada módulo antes de la ejecución de los acabados finales de fachada.",
        categoria: "instalacion",
        alt: "Instalación de barandas metálicas para balcones en Qantua Fase 2",
      },
      {
        src: "/img/proyectos/qantua/06-proceso-barandas-balcones-azotea-qantua-fase-2.png",
        titulo: "Proceso de instalación de barandas en edificio multifamiliar",
        descripcion:
          "Vista frontal de una torre de Qantua Fase 2 durante su etapa de construcción. La imagen muestra las barandas metálicas instaladas en los balcones residenciales, mientras que en la azotea se observan sistemas provisionales de protección previos a la instalación de las barandas definitivas.",
        categoria: "instalacion",
        alt: "Proceso de instalación de barandas metálicas en azotea de Qantua Fase 2",
      },
      {
        src: "/img/proyectos/qantua/07-barandas-balcones-proceso-constructivo-qantua-fase-2.png",
        titulo: "Barandas para balcones en proceso constructivo",
        descripcion:
          "Vista de una torre de Qantua Fase 2 durante su etapa de construcción, con las barandas metálicas de balcones ya instaladas antes de la ejecución de los acabados finales de fachada.",
        categoria: "instalacion",
        alt: "Barandas metálicas para balcones en proceso constructivo en Qantua Fase 2",
      },
      {
        src: "/img/proyectos/qantua/08-barandas-balcones-rampas-qantua-fase-1.png",
        titulo: "Barandas para balcones y rampas de acceso",
        descripcion:
          "Vista interior de Qantua Fase 1 que muestra barandas metálicas en acabado negro mate instaladas en balcones residenciales y rampas de circulación. La imagen destaca la uniformidad del diseño y la integración arquitectónica de los elementos metálicos.",
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
          "Barandas metálicas en acabado negro mate instaladas en las rampas de circulación de Qantua Fase 1. La imagen destaca la continuidad del sistema de protección y la adaptación de las barandas a los cambios de nivel.",
        categoria: "barandas",
        alt: "Barandas metálicas negro mate para rampas de circulación en Qantua Fase 1",
      },
      {
        src: "/img/proyectos/qantua/11-barandas-balcones-fachada-terminada-qantua-fase-1.png",
        titulo: "Barandas para balcones en fachada terminada",
        descripcion:
          "Barandas metálicas en acabado negro mate instaladas en los balcones de Qantua Fase 1. La imagen destaca la uniformidad del diseño, la alineación de los módulos y su integración con la fachada terminada.",
        categoria: "barandas",
        alt: "Barandas metálicas para balcones en fachada terminada de Qantua Fase 1",
      },
      {
        src: "/img/proyectos/qantua/12-cerco-perimetrico-aluzinc-qantua.png",
        titulo: "Cerco perimétrico de aluzinc",
        descripcion:
          "Cerco perimétrico de aluzinc instalado para la delimitación y separación entre Qantua Fase 1 y Qantua Fase 2. La solución proporciona cerramiento temporal y control visual durante el desarrollo de las obras.",
        categoria: "cercos",
        alt: "Cerco perimétrico de aluzinc entre Qantua Fase 1 y Fase 2",
      },
      {
        src: "/img/proyectos/qantua/13-vigas-metalicas-locales-comerciales-qantua.png",
        titulo: "Vigas metálicas para locales comerciales",
        descripcion:
          "Fabricación e instalación de vigas metálicas estructurales para los locales comerciales ubicados en la fachada exterior de Qantua. La estructura fue diseñada para soportar las futuras áreas comerciales del proyecto.",
        categoria: "estructuras",
        alt: "Vigas metálicas estructurales para locales comerciales en Qantua",
      },
      {
        src: "/img/proyectos/qantua/14-rejilla-metalica-ventilacion-ducto-qantua-fase-1.png",
        titulo: "Rejilla metálica para ventilación de ducto técnico",
        descripcion:
          "Fabricación e instalación de rejilla metálica de aluminio para ventilación y protección de ducto técnico en Qantua Fase 1. La solución permite la circulación permanente del aire hacia los espacios técnicos del edificio.",
        categoria: "estructuras",
        alt: "Rejilla metálica para ventilación de ducto técnico en Qantua Fase 1",
      },
      {
        src: "/img/proyectos/qantua/15-estructura-metalica-mesa-proceso-qantua-fase-2.png",
        titulo: "Estructura metálica para mesa integrada",
        descripcion:
          "Proceso de fabricación e instalación de estructura metálica para mesa integrada en un departamento de Qantua Fase 2. La imagen muestra la base estructural en acero con acabado negro mate durante la etapa previa a la colocación de la superficie final.",
        categoria: "mobiliario",
        alt: "Estructura metálica para mesa integrada en Qantua Fase 2",
      },
      {
        src: "/img/proyectos/qantua/16-barandas-azotea-proceso-instalacion-qantua-fase-2.png",
        titulo: "Proceso de instalación de barandas en azotea",
        descripcion:
          "Proceso de fabricación e instalación de barandas metálicas para la azotea de Qantua Fase 2. La imagen muestra una etapa inicial de montaje en obra, donde los módulos metálicos se encuentran parcialmente instalados y en proceso de alineación y fijación.",
        categoria: "instalacion",
        alt: "Proceso de instalación de barandas metálicas en azotea de Qantua Fase 2",
      },
      {
        src: "/img/proyectos/qantua/17-barandas-rampa-circulacion-qantua-fase-2.png",
        titulo: "Barandas para rampa de circulación peatonal",
        descripcion:
          "Barandas metálicas en acabado negro mate instaladas en la rampa de circulación peatonal de Qantua Fase 2. El sistema proporciona seguridad en los desplazamientos y delimita las áreas de circulación.",
        categoria: "barandas",
        alt: "Barandas metálicas para rampa de circulación peatonal en Qantua Fase 2",
      },
      {
        src: "/img/proyectos/qantua/18-barandas-azotea-con-base-anticorrosiva-qantua-fase-2.png",
        titulo: "Barandas para azotea con base anticorrosiva",
        descripcion:
          "Barandas metálicas instaladas en la azotea de Qantua Fase 2 durante la etapa de acondicionamiento previo al acabado final. La imagen muestra los elementos metálicos con aplicación de base anticorrosiva.",
        categoria: "instalacion",
        alt: "Barandas metálicas para azotea con base anticorrosiva en Qantua Fase 2",
      },
      {
        src: "/img/proyectos/qantua/19-instalacion-pasamanos-locales-comerciales-qantua-fase-2.png",
        titulo: "Instalación de pasamanos en locales comerciales",
        descripcion:
          "Instalación de pasamanos metálicos en escaleras de circulación para locales comerciales de Qantua Fase 2. Diseño moderno en acabado negro mate.",
        categoria: "instalacion",
        alt: "Instalación de pasamanos metálicos en locales comerciales de Qantua Fase 2",
      },
      {
        src: "/img/proyectos/qantua/20-cuarto-bombas-antes-instalacion-tapas-metalicas.png",
        titulo: "Cuarto de bombas antes de instalación de tapas",
        descripcion:
          "Estado del cuarto de bombas previo a la instalación de tapas metálicas registrables en plancha estriada.",
        categoria: "instalacion",
        alt: "Cuarto de bombas antes de la instalación de tapas metálicas en Qantua",
      },
      {
        src: "/img/proyectos/qantua/21-estructura-metalica-ducto-antes-qantua-fase-1.png",
        titulo: "Ducto antes de cobertura de policarbonato",
        descripcion:
          "Estado del ducto técnico en azotea de Qantua Fase 1 previo a la instalación de la cobertura de policarbonato.",
        categoria: "estructuras",
        alt: "Ducto técnico antes de la cobertura de policarbonato en Qantua Fase 1",
      },
      {
        src: "/img/proyectos/qantua/22-estructura-metalica-mesa-departamento-qantua.png",
        titulo: "Estructura metálica para mesa integrada",
        descripcion:
          "Fabricación e instalación de estructura metálica tubular para soporte de mesa integrada en departamentos residenciales de Qantua Fase 2.",
        categoria: "mobiliario",
        alt: "Estructura metálica para mesa integrada en departamento de Qantua Fase 2",
      },
      {
        src: "/img/proyectos/qantua/23-rejilla-metalica-ducto-tecnico-qantua.png",
        titulo: "Rejilla metálica para ducto técnico",
        descripcion:
          "Fabricación e instalación de rejillas metálicas para ductos técnicos en las torres de Qantua Fase 1 y Fase 2.",
        categoria: "estructuras",
        alt: "Rejilla metálica instalada en ducto técnico de Qantua",
      },
      {
        src: "/img/proyectos/qantua/24-tapas-metalicas-cuarto-bombas-qantua.png",
        titulo: "Tapas metálicas para cuarto de bombas",
        descripcion:
          "Tapas metálicas registrables en plancha estriada instaladas en el cuarto de bombas de Qantua.",
        categoria: "estructuras",
        alt: "Tapas metálicas instaladas en cuarto de bombas de Qantua",
      },
      {
        src: "/img/proyectos/qantua/25-cobertura-policarbonato-ducto-gas-qantua.png",
        titulo: "Cobertura de policarbonato para ducto de gas",
        descripcion:
          "Cobertura de policarbonato instalada sobre estructura metálica para protección del ducto de gas en azotea.",
        categoria: "estructuras",
        alt: "Cobertura de policarbonato instalada en ducto de gas de Qantua",
      },
      {
        src: "/img/proyectos/qantua/26-barandas-azotea-terminadas-qantua.png",
        titulo: "Barandas para azotea terminadas",
        descripcion:
          "Barandas metálicas en acabado negro mate instaladas y terminadas en azotea de Qantua Fase 2 para protección perimetral.",
        categoria: "barandas",
        alt: "Barandas metálicas terminadas en azotea de Qantua Fase 2",
      },
    ],

    videos: [
      {
        src: "/img/proyectos/qantua/recorridoQantua.mp4",
        titulo: "Recorrido por las barandas de balcones en Qantua",
        descripcion:
          "Video grabado desde la azotea del proyecto, mostrando una vista panorámica de las barandas metálicas instaladas en los balcones de Qantua, con un enfoque hacia abajo para apreciar el acabado y la magnitud de la obra.",
        poster: "/img/proyectos/qantua/28-vistaIntegralQantuaF1&F2.jpeg",
      },
      {
        src: "/img/proyectos/qantua/VistaIntegralQantuaF1_amp_F2.mp4",
        titulo: "Vista integral de Qantua Fase 1 y Qantua Fase 2",
        descripcion:
          "Vista panorámica en video del conjunto residencial, apreciando la integración arquitectónica de las torres y los elementos metálicos fabricados e instalados por LUDIER.",
        poster: "/img/proyectos/qantua/28-vistaIntegralQantuaF1&F2.jpeg",
      },
    ],
  },

  hilton: {
    servicios: [
      {
        id: "chute-metalico-19-pisos",
        titulo: "Chute metálico para evacuación de residuos - 19 pisos",
        descripcion:
          "Fabricación e instalación de sistema de chute metálico para la evacuación de residuos en el proyecto Hotel Hilton MDP. La estructura de 19 pisos fue diseñada para optimizar la gestión de escombros durante la construcción, garantizando seguridad y eficiencia operativa.",
        tipo: "final",
        fotos: [
          {
            src: "/img/proyectos/Hotel_Hilton/ChuteMetalicoHotelHilton_img1.jpeg",
            etapa: "final",
            alt: "Chute metálico instalado en el Hotel Hilton MDP de 19 pisos",
          },
        ],
      },
    ],
    fotos: [
      {
        src: "/img/proyectos/Hotel_Hilton/ChuteMetalicoHotelHilton_img1.jpeg",
        titulo: "Chute metálico de 19 pisos para Hotel Hilton MDP",
        descripcion:
          "Fabricación e instalación de chute metálico para evacuación de residuos en el proyecto Hotel Hilton MDP, ubicado en Chacarilla, Surco. La estructura de 19 pisos fue diseñada para optimizar la gestión de escombros durante la construcción, garantizando seguridad y eficiencia operativa.",
        categoria: "estructuras",
        alt: "Chute metálico instalado en el Hotel Hilton MDP de 19 pisos",
      },
    ],
    videos: [
      {
        src: "/img/proyectos/Hotel_Hilton/FuncionamientoChuteVideo.mp4",
        titulo: "Funcionamiento del chute metálico - Hotel Hilton MDP",
        descripcion:
          "Video demostrativo del funcionamiento del chute metálico instalado en el Hotel Hilton MDP. El sistema permite la evacuación eficiente y segura de residuos desde los pisos superiores hasta el punto de acopio en planta baja, optimizando la gestión de escombros durante la construcción.",
        poster: "/img/proyectos/Hotel_Hilton/ChuteMetalicoHotelHilton_img1.jpeg",
      },
    ],
  },

  "edificio-echenique-355": {
    servicios: [
      {
        id: "modificacion-cerramiento",
        titulo: "Modificación y reubicación de puerta y cerramiento metálico",
        descripcion:
          "Retiro y desplazamiento de cerco metálico 70 cm hacia la vereda (10 ml). Incluye el traslado e instalación de la puerta pequeña, cierre del espacio libre sobrante con plancha metálica y el cerramiento de los laterales generados por el desplazamiento.",
        tipo: "final",
        fotos: [
          {
            src: "/img/EDIFICIO ECHENIQUE 355_Proyecto.png",
            etapa: "final",
            alt: "Modificación de cerramiento metálico en Edificio Echenique 355",
          },
        ],
      },
    ],
    fotos: [
      {
        src: "/img/EDIFICIO ECHENIQUE 355_Proyecto.png",
        titulo: "Modificación de Cerramiento Metálico – Edificio Echenique 355",
        descripcion:
          "Trabajo de modificación y reubicación de puerta y cerramiento metálico. Se realizó el retiro y desplazamiento de cerco metálico 70 cm hacia la vereda (10 ml), traslado e instalación de la puerta pequeña, cierre del espacio libre sobrante con plancha metálica y el cerramiento de los laterales generados por el desplazamiento.",
        categoria: "cercos",
        alt: "Edificio Echenique 355 - Modificación de cerramiento metálico",
      },
    ],
    videos: [],
  },

  // 👇 PROYECTO ELANT FASE 3 (SIN PROCESO CONSTRUCTIVO, SOLO FOTOS)
  "elant-fase-3": {
    servicios: [], // 👈 Vacío para que no salga la sección "Proceso Constructivo"
    fotos: [
      {
        src: "/img/proyectos/Elant/puerta-metalica-azul-pasillo-interior.jpg",
        titulo: "Puerta metálica de seguridad para pasillos interiores",
        descripcion:
          "Fabricación e instalación de puerta metálica con acabado azul en pasillo interior. Diseño robusto de herrería que optimiza el control de accesos y brinda seguridad al tránsito peatonal en la obra.",
        categoria: "instalacion",
        alt: "Puerta metálica azul instalada en pasillo interior del Proyecto Elant",
      },
      {
        src: "/img/proyectos/Elant/puerta-metalica-azul-con-refuerzos-verticales.png",
        titulo: "Puerta metálica con refuerzos verticales de alta resistencia",
        descripcion:
          "Estructura de puerta metálica reforzada con perfiles verticales para máxima resistencia al impacto. Solución ideal para áreas de alto tráfico que requieren durabilidad y seguridad extrema.",
        categoria: "estructuras",
        alt: "Puerta metálica reforzada con perfiles verticales en Elant Fase 3",
      },
      {
        src: "/img/proyectos/Elant/fabricacion-tapa-metalica-abatible-en-puerta.png",
        titulo: "Fabricación de tapa metálica abatible para pase de tubería",
        descripcion:
          "Solución precisa de carpintería metálica diseñada para el pase seguro de mangueras de bombeo de concreto. Incluye fabricación de marco y sistema de cierre abatible para mantener la hermeticidad del área.",
        categoria: "instalacion",
        alt: "Tapa metálica abatible fabricada para pase de tubería de concreto",
      },
      {
        src: "/img/proyectos/Elant/fabricacion-tapa-metalica-abatible-acceso-sotano.png",
        titulo: "Tapa abatible metálica para acceso a sótano",
        descripcion:
          "Habilitación de acceso seguro hacia sótano mediante la fabricación e instalación de una tapa metálica abatible de alta resistencia. Diseñada para soportar cargas y facilitar el ingreso del personal de obra.",
        categoria: "estructuras",
        alt: "Tapa metálica abatible instalada en acceso a sótano del Proyecto Elant",
      },
    ],
    videos: [],
  },

    // 👇 PROYECTO DISTRITO 34 (SOLO FOTOS DE DETALLE)
  "distrito-34": {
    servicios: [], // Sin carrusel antes/después, solo galería
    fotos: [
      {
        src: "/img/proyectos/Distrito34/PuertaInstaladaDistrito34.png",
        titulo: "Puerta peatonal metálica instalada con chapa de seguridad",
        descripcion:
          "Fabricación e instalación de puerta peatonal metálica en el Proyecto Distrito 34. Incluye refuerzos estructurales, bisagras de alta resistencia y cerradura de seguridad para garantizar el control de accesos en la obra.",
        categoria: "instalacion",
        alt: "Puerta peatonal metálica instalada con chapa de seguridad en Distrito 34",
      },
      {
        src: "/img/proyectos/Distrito34/puertaMetalicaDistrito34.jpg",
        titulo: "Puerta metálica abatible para acceso principal",
        descripcion:
          "Detalle de la puerta metálica abatible fabricada a medida e instalada en el acceso principal del Proyecto Distrito 34. Acabado anticorrosivo y diseño robusto para alto tránsito.",
        categoria: "instalacion",
        alt: "Puerta metálica abatible instalada en acceso principal de Distrito 34",
      },
      {
        src: "/img/proyectos/Distrito34/RetirodeCercoDistrito34.png",
        titulo: "Retiro y corte de cerco metálico para habilitación de portón",
        descripcion:
          "Trabajos de corte y retiro de la hoja de cerco metálico existente para habilitar el espacio del nuevo portón abatible, cumpliendo con los protocolos de seguridad en obra y el posterior cerramiento de la estructura.",
        categoria: "estructuras",
        alt: "Retiro y corte de cerco metálico en el Proyecto Distrito 34",
      },
    ],
    videos: [],
  },
};

/** Retorna la galería de un proyecto o null si no existe. */
export function getGaleriaProyecto(slug: string): GaleriaProyecto | null {
  return GALERIAS[slug] ?? null;
}