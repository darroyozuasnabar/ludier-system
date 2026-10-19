// lib/proyectos-data.ts
//
// Datos puros de proyectos — SIN "use client"
// Se pueden importar desde Client Components Y Server Components

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
  // 1. QANTUA
  {
    id: 6,
    slug: "qantua",
    titulo: "Proyecto Qantua (Fases 1 y 2)",
    cliente: "Desarrollo Plaza Grau S.A.C. / Grupo LAR",
    ubicacion: "Cercado de Lima (Av. Grau / Jr. Azángaro / Jr. Lampa)",
    categoria: "residencial",
    servicios: [
      "Portones y Cerramientos: Fabricación e instalación de portones metálicos, cerramientos perimetrales de Aluzinc TR4 de gran altura, malla Raschell desmontable y cerco estructural ASTM A36.",
      "Barandas, Pasamanos y Escaleras: Instalación masiva de barandas en balcones, rampas y techos, pasamanos de alta resistencia, escaleras de evacuación y escaleras de gato galvanizadas con canastilla de protección.",
      "Chutes Metálicos: Fabricación, instalación, mantenimiento y desmontaje de chutes de escombros para las 6 torres del proyecto (Fases 1 y 2).",
      "Estructuras Complementarias: Montaje de techos metálicos, estructuras y techado de policarbonato en ductos de gas, fabricación de anclajes para ascensores y ganchos de izaje.",
      "Elementos de Seguridad y Detalle: Suministro de racks para bicicletas, ciclopuertos, escotillas hidráulicas, rejillas electrosoldadas, rejillas de sumidero, tapas de canaleta y cerramiento de vanos en fachadas.",
      "Trabajos Auxiliares y Modificaciones: Apertura y cierre temporal de cercos, desmontaje de almacenes de ascensores, reparación de portones corredizos, estructuras para lavaderos y modificaciones estructurales en obra."
    ],
    resultado:
      "Participación integral y continua en ambas fases del proyecto. LUDIER se consolidó como el proveedor estratégico de Grupo LAR, demostrando una capacidad operativa inigualable para ejecutar desde la seguridad perimetral de la obra hasta los acabados arquitectónicos finales y estructuras de alta complejidad.",
    imagen: "/img/Qantua.jpg",
  },
  // 2. ZENDAI
  {
    id: 1,
    slug: "zendai",
    titulo: "Edificio Zendai",
    cliente: "Desarrollo Inmobiliario FG S.A.C. / Grupo LAR",
    ubicacion: "Santa Catalina, La Victoria, Lima",
    categoria: "residencial",
    servicios: [
      "Fabricación e instalación de barandas metálicas de seguridad en balcones de fachada frontal y laterales.",
      "Suministro de barandas con tubo cuadrado estructural, guarderas y acabado epóxico color negro.",
      "Instalación de parantes metálicos de alta resistencia con planchas de anclaje.",
      "Fabricación e instalación de chute metálico para evacuación de residuos en edificio de 28 pisos.",
      "Cumplimiento de rigurosos estándares corporativos de seguridad, incluyendo SCTR y EPP para todo el personal."
    ],
    resultado:
      "Consolidación como proveedor corporativo del Grupo LAR. Se demostró la capacidad técnica para fabricar e instalar sistemas de seguridad metálicos de gran escala en un edificio de 28 pisos, cumpliendo estrictamente con los estándares de calidad y seguridad exigidos por la gran minería y construcción.",
    imagen: "/img/zendai.png",
  },
  // 3. HILTON
  {
    id: 7,
    slug: "hilton",
    titulo: "Hotel Hilton",
    cliente: "MDP CONSTRUCCIONES S.A.C.",
    ubicacion: "Chacarilla, Surco",
    categoria: "comercial",
    servicios: [
      "Fabricación e instalación de sistema integral de chute metálico para evacuación de escombros.",
      "Estructura vertical con recorrido en 19 pisos y sótano, incluyendo suministro de materiales y montaje en obra.",
      "Fabricación de curva de empalme en primer piso con plancha rolada de 2.5 mm de espesor y fijación estructural.",
      "Diseño de anclajes, soportería y refuerzos para garantizar la seguridad y estabilidad del sistema en altura.",
      "Acabados anticorrosivos y control de calidad en soldadura."
    ],
    resultado:
      "Instalación exitosa del sistema de evacuación de residuos para el proyecto Hotel Hilton MDP. LUDIER demostró su capacidad de ingeniería al fabricar e instalar un chute metálico de 19 pisos con una curva de empalme fabricada con plancha rolada de alta precisión, garantizando la eficiencia operativa y la seguridad durante la construcción del hotel.",
    imagen: "/img/hilton-lima-miraflores.jpg",
  },
  // 4. EDIFICIO ECHENIQUE
  {
    id: 8,
    slug: "edificio-echenique-355",
    titulo: "Edificio Echenique 355",
    cliente: "Zonum Inmobiliaria",
    ubicacion: "Lima", 
    categoria: "comercial",
    servicios: [
      "Retiro y desplazamiento de cerco metálico 70 cm hacia la vereda (10 ml)",
      "Traslado e instalación de puerta pequeña",
      "Cierre de espacio libre con plancha metálica",
      "Cerramiento de laterales generados por el desplazamiento",
    ],
    resultado:
      "Modificación integral del cerramiento metálico para optimizar el acceso y la seguridad del edificio, incluyendo el desplazamiento de la estructura existente y el cierre de nuevos espacios.",
    imagen: "/img/EDIFICIO ECHENIQUE 355_Proyecto.png",
  },
  // 5. CERCO LINCE (Resto de proyectos)
  {
    id: 2,
    slug: "lince",
    titulo: "Cerco Perimetral Lince",
    cliente: "Flat Canevaro S.A.C.",
    ubicacion: "Lince, Lima",
    categoria: "comercial",
    servicios: [
      "Estructuras metálicas para cerramiento perimetral",
      "Postes y paneles metálicos",
      "Instalación y nivelación",
      "Anclaje, soldadura y refuerzo estructural",
      "Acabados y protección anticorrosiva",
    ],
    resultado:
      "Mejora de la seguridad, control de accesos y protección del proyecto durante las distintas etapas.",
    imagen: "/img/Flat_Lince.png",
  },
  // 6. SAN MIGUEL
  {
    id: 3,
    slug: "san-miguel",
    titulo: "Edificio San Miguel",
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
  // 7. SURCO
  {
    id: 4,
    slug: "surco",
    titulo: "Proyecto Surco",
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
  // 8. CENTRO DE LIMA
  {
    id: 5,
    slug: "centro-lima",
    titulo: "Edificio Centro de Lima",
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
];