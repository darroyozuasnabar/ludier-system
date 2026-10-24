// lib/blog-posts.ts
//
// Fuente de verdad de los artículos del blog.
// Cada artículo se renderiza en /blog/[slug] con SEO + JSON-LD.
//
// Para agregar un artículo nuevo:
//   1. Agregar un objeto al array POSTS
//   2. Guardar la imagen en /public/img/
//   3. El sitemap se actualiza automáticamente

export type BlogPost = {
  id: number;
  slug: string;
  titulo: string;
  extracto: string;
  contenido: string; // HTML
  fecha: string; // "15 de Junio, 2024"
  fechaISO: string; // "2024-06-15" (para SEO/JSON-LD)
  tiempoLectura: string; // "5 min"
  categoria: string;
  imagen: string;
  autor: string;
  autorRol?: string;
  keywords: string[];
  metaDescription: string;
};

export const POSTS: BlogPost[] = [
  // ============================================================
  // 1. ESTRUCTURAS METÁLICAS (SEO target principal)
  // ============================================================
  {
    id: 1,
    slug: "como-elegir-estructuras-metalicas-lima",
    titulo: "Cómo elegir estructuras metálicas para tu proyecto en Lima (Guía 2026)",
    extracto:
      "Guía completa para elegir estructuras metálicas en Lima: tipos, materiales, normativas, costos y errores comunes. Por LUDIER.",
    contenido: `
      <p>Elegir las estructuras metálicas correctas puede ser la diferencia entre un proyecto que dura 30 años y uno que empieza a fallar en 5. En Lima, donde la humedad costera, los sismos y la demanda de construcción vertical son factores críticos, esta decisión es aún más importante.</p>

      <p>En esta guía te compartimos todo lo que necesitás saber antes de contratar un fabricante de estructuras metálicas: desde los tipos disponibles hasta los errores más comunes que vemos en obra, basados en más de 10 años fabricando para las principales constructoras del Perú.</p>

      <h2>¿Qué son las estructuras metálicas y para qué se usan?</h2>

      <p>Las estructuras metálicas son sistemas constructivos formados por perfiles de acero (vigas, columnas, diagonales) unidos por soldadura, pernos o remaches. Se usan cuando se necesita:</p>

      <ul>
        <li><strong>Grandes luces sin columnas intermedias</strong> (naves industriales, coberturas de estacionamientos, techos de estadios)</li>
        <li><strong>Construcción rápida</strong> (se prefabrica en taller y se monta en obra en días, no semanas)</li>
        <li><strong>Resistencia sísmica superior</strong> (el acero disipa energía y se comporta mejor que el concreto en sismos severos)</li>
        <li><strong>Precisión dimensional</strong> (tolerancias milimétricas en taller, imposibles de lograr en concreto in situ)</li>
        <li><strong>Ampliaciones y refuerzos</strong> (agregar un piso a un edificio existente sin demoler todo)</li>
      </ul>

      <h2>Tipos de estructuras metálicas más comunes en Lima</h2>

      <h3>1. Estructuras para azotea</h3>
      <p>Ideales para soportar tanques de agua, paneles solares, equipos de aire acondicionado y sistemas de telecomunicaciones. En Lima, donde muchos edificios tienen azoteas subutilizadas, este tipo de estructura permite aprovechar ese espacio sin sobrecargar los muros existentes.</p>

      <h3>2. Coberturas metálicas</h3>
      <p>Techos ligeros para estacionamientos, patios, áreas comunes. Se fabrican con perfiles galvanizados que resisten la humedad costera de Lima mucho mejor que otros materiales.</p>

      <h3>3. Plataformas y pasarelas</h3>
      <p>Sistemas de acceso para mantenimiento industrial, escaleras de servicio y pasarelas entre edificios. Muy demandadas por plantas industriales y centros comerciales.</p>

      <h3>4. Vigas y refuerzos estructurales</h3>
      <p>Se instalan cuando un edificio existente necesita soportar más carga, cuando se elimina un muro portante o cuando se agrega un nivel adicional.</p>

      <h3>5. Estructuras especiales</h3>
      <p>Marquesinas, pérgolas, jaulas de seguridad, cuartos metálicos para equipos. Cada proyecto con requerimientos particulares necesita una solución a medida.</p>

      <h2>¿Qué acero se usa en Lima? Materiales y acabados</h2>

      <p>El acero estructural en Perú se rige por la norma ASTM A36 (el más común) y ASTM A992 (para aplicaciones de alta resistencia). Los acabados más usados son:</p>

      <ul>
        <li><strong>Acero negro:</strong> el más económico, requiere pintura inmediata. Ideal para estructuras internas no expuestas.</li>
        <li><strong>Galvanizado en caliente:</strong> recubrimiento de zinc que resiste la corrosión por décadas. Obligatorio para estructuras expuestas a la humedad costera de Lima.</li>
        <li><strong>Pintura epóxica:</strong> acabado de alta resistencia química. Ideal para plantas industriales y ambientes agresivos.</li>
        <li><strong>Pintura electrostática:</strong> acabado decorativo, ideal para barandas y elementos visibles.</li>
      </ul>

      <blockquote>En LUDIER, la regla es simple: si la estructura va a estar expuesta a la intemperie en Lima, lleva galvanizado o pintura epóxica. Sin excepciones.</blockquote>

      <h2>Normativas que debe cumplir tu estructura</h2>

      <p>Todo fabricante serio debe cumplir con:</p>

      <ul>
        <li><strong>Norma E.090 de Estructuras Metálicas (RNE):</strong> regula el diseño, fabricación y montaje de estructuras de acero en Perú.</li>
        <li><strong>Norma E.030 de Diseño Sismorresistente:</strong> obliga a que las estructuras resistan sismos sin colapsar.</li>
        <li><strong>Norma AWS D1.1:</strong> certifica los procedimientos de soldadura que se usan en taller.</li>
        <li><strong>Norma E.020 de Cargas:</strong> define las cargas mínimas (viento, uso, peso propio) que deben soportar.</li>
      </ul>

      <p>Si un fabricante no puede mostrarte certificados de soldadores o no conoce estas normas, buscá otro. Una estructura mal fabricada puede poner en riesgo vidas.</p>

      <h2>¿Cuánto cuesta una estructura metálica en Lima?</h2>

      <p>El precio de una estructura metálica en Lima no es un valor fijo, ya que depende de múltiples factores. Sin embargo, para darte una referencia real, estos son los rangos que manejamos en el mercado peruano:</p>

      <ul>
        <li><strong>Estructuras livianas (techos, coberturas):</strong> El precio puede oscilar entre <strong>S/ 180 y S/ 280 por m²</strong>, o calcularse entre <strong>S/ 8 y S/ 11.50 por kg instalado</strong>.</li>
        <li><strong>Estructuras para azotea y plataformas:</strong> Para proyectos de mayor complejidad, el costo puede partir desde los <strong>S/ 120 por m²</strong> y aumentar según la altura y la carga que deba soportar.</li>
        <li><strong>Refuerzos estructurales:</strong> Se cotizan caso por caso, ya que dependen de la evaluación de la estructura existente.</li>
      </ul>

      <p>El precio final depende de: cantidad de acero (kg), tipo de acabado (galvanizado, epóxico, etc.), complejidad del montaje, altura de instalación y plazo de entrega.</p>

      <p>Para darte un precio real y competitivo, necesitamos:</p>
      <ol>
        <li>Planos o descripción detallada del proyecto</li>
        <li>Ubicación y altura de instalación</li>
        <li>Plazo de entrega esperado</li>
      </ol>

      <p><a href="/contacto?servicio=estructuras-metalicas">Solicitá tu cotización sin compromiso</a> — te respondemos en menos de 24 horas.</p>

      <h2>Los 5 errores más comunes al contratar</h2>

      <ul>
        <li><strong>1. Elegir por precio y no por calidad:</strong> un fabricante barato que no certifica soldaduras puede costarte el doble después, en retrabajos o en un accidente.</li>
        <li><strong>2. No verificar el tipo de acero:</strong> hay proveedores que mezclan A36 con aceros reciclados sin trazabilidad. Siempre pedí certificado de calidad del acero.</li>
        <li><strong>3. No planificar los acabados desde el inicio:</strong> cambiar de acero negro a galvanizado después del montaje puede costar 3x más.</li>
        <li><strong>4. Ignorar el mantenimiento futuro:</strong> una estructura galvanizada puede durar 30 años sin mantenimiento; una con pintura básica requiere repintado cada 2-3 años.</li>
        <li><strong>5. No pedir visitas de obra:</strong> un buen fabricante visita la obra antes de cotizar y después de instalar. Si solo te cotiza por teléfono, desconfiá.</li>
      </ul>

      <h2>¿Por qué elegir LUDIER para tu proyecto?</h2>

      <p>Más de 10 años fabricando estructuras metálicas para las principales constructoras del Perú. Algunos números:</p>

      <ul>
        <li><strong>20+ proyectos ejecutados</strong> (edificios de hasta 28 pisos como Zendai, proyecto QANTUA, chutes metálicos para Hilton MDP)</li>
        <li><strong>95% cumplimiento de plazos</strong> — entregamos cuando decimos</li>
        <li><strong>Soldadores certificados</strong> y taller propio con control de calidad dimensional y de soldadura</li>
        <li><strong>Garantía escrita</strong> sobre la estructura y los acabados</li>
      </ul>

      <p>Si tenés un proyecto en mente — sea una cobertura pequeña para tu casa o una nave industrial completa — <a href="/contacto?servicio=estructuras-metalicas">pedí tu cotización sin compromiso</a>. Te respondemos en menos de 24 horas.</p>

      <h2>Preguntas frecuentes</h2>

      <h3>¿Cuánto tiempo tarda fabricar una estructura metálica?</h3>
      <p>Depende del tamaño. Una cobertura residencial: 1-2 semanas. Una estructura industrial mediana: 3-6 semanas. Proyectos grandes (edificios, naves): 2-3 meses.</p>

      <h3>¿Se puede instalar en un edificio ya habitado?</h3>
      <p>Sí. La mayoría de nuestras obras son en edificios ocupados. El montaje se planifica por etapas para minimizar molestias y se coordina con la administración.</p>

      <h3>¿Ofrecen mantenimiento después de instalar?</h3>
      <p>Sí. Ofrecemos planes de mantenimiento preventivo anuales para estructuras expuestas, con inspección de soldaduras, retoque de pintura y verificación de anclajes.</p>

      <h3>¿Trabajan en toda Lima o solo en algunos distritos?</h3>
      <p>Cubrimos toda Lima Metropolitana: San Juan de Miraflores, Cercado, La Victoria, Surco, Miraflores, San Isidro, San Borja, Chorrillos, Lince y más. También atendemos provincias para proyectos grandes.</p>

      <!-- 👇 LINK BUILDING INTERNO: Blog → Landing B2B -->
      <div style="margin-top: 40px; padding: 24px; background-color: #FFF3EC; border-left: 4px solid #FF5A1F;">
        <p style="margin: 0 0 12px 0; font-weight: 600; color: #1E2126;">¿Necesitas cotizar estructuras metálicas para tu obra?</p>
        <p style="margin: 0 0 16px 0; color: #565C63;">Visita nuestra ficha técnica completa con materiales, normativas y casos de éxito.</p>
        <a href="/servicios/estructuras-metalicas" style="display: inline-block; padding: 12px 24px; background-color: #FF5A1F; color: white; text-decoration: none; font-weight: 600; border-radius: 2px;">Ver ficha técnica de estructuras metálicas →</a>
      </div>
    `,
    fecha: "15 de Octubre, 2026",
    fechaISO: "2026-10-15",
    tiempoLectura: "8 min",
    categoria: "Estructuras",
    imagen: "/img/estructurasMetalicas.png",
    autor: "Equipo LUDIER",
    autorRol: "Ingeniería y fabricación",
    keywords: [
      "estructuras metálicas lima",
      "fabricación estructuras metálicas perú",
      "precio estructuras metálicas",
      "coberturas metálicas lima",
      "estructuras para azotea",
      "vigas metálicas lima",
    ],
    metaDescription:
      "Guía completa para elegir estructuras metálicas en Lima: tipos, materiales, normativas y precios 2026. Fabricación certificada por LUDIER.",
  },

  // ============================================================
  // 2. CHUTES METÁLICOS (SEO target principal)
  // ============================================================
  {
    id: 2,
    slug: "chutes-metalicos-construccion-guia",
    titulo: "Chutes metálicos para construcción: Guía completa 2026",
    extracto:
      "Todo sobre chutes metálicos: tipos, normativas, precios y cómo elegir el mejor para tu obra. Guía técnica por LUDIER.",
    contenido: `
      <p>Si trabajás en construcción vertical, sabés que la gestión de residuos es uno de los mayores dolores de cabeza. Los chutes metálicos se han convertido en la solución estándar para evacuar escombros de forma rápida, segura y eficiente en edificios de mediana y gran altura.</p>

      <p>En esta guía te explicamos todo lo que necesitás saber antes de contratar chutes metálicos para tu obra: tipos, materiales, normativas, precios de referencia y errores comunes. Basado en más de 10 años instalando chutes en proyectos como el Hilton MDP (19 pisos) y QANTUA.</p>

      <h2>¿Qué es un chute metálico y para qué sirve?</h2>

      <p>Un chute metálico es un ducto vertical fabricado con planchas de acero, que se instala en obras de construcción para evacuar escombros, residuos de demolición y materiales desde los pisos superiores hacia un contenedor en planta baja o sótano.</p>

      <p>Funciona por gravedad: los residuos se arrojan por la boca del chute en cada piso y caen directamente al punto de acopio, evitando el transporte manual por escaleras o montacargas.</p>

      <h3>Usos principales</h3>

      <ul>
        <li>Evacuación de escombros en edificios en construcción (concreto, ladrillo, cerámica)</li>
        <li>Retiro de residuos de demolición en remodelaciones de altura</li>
        <li>Limpieza de entrepisos antes de vaciados o acabados</li>
        <li>Retiro de material sobrante en obra gruesa</li>
      </ul>

      <h2>Tipos de chutes metálicos</h2>

      <h3>1. Chute recto (estándar)</h3>
      <p>El más común. Se compone de tramos rectos de 1.5 m a 3 m que se ensamblan verticalmente. Ideal para edificios de hasta 15 pisos sin desviaciones horizontales. Fabricado con planchas de acero galvanizado de 1.5 mm a 2 mm.</p>

      <h3>2. Chute con curva o codo</h3>
      <p>Se usa cuando el punto de acopio no está alineado verticalmente con el punto de descarga. Los codos permiten desviar el chute hasta 45° o 90° para adaptarse a la geometría de la obra.</p>

      <h3>3. Chute con compuertas múltiples</h3>
      <p>Cada tramo tiene una compuerta de acceso en cada piso. Los operarios abren la compuerta, arrojan el residuo y la cierran. Evita que los residuos caigan accidentalmente por aberturas no controladas.</p>

      <h3>4. Chute con sistema de amortiguación</h3>
      <p>Para alturas mayores a 20 pisos, se instalan deflectores internos cada 5-6 metros para reducir la velocidad de caída y evitar daños al chute o al contenedor de acopio.</p>

      <h2>Materiales y acabados</h2>

      <p>Los chutes se fabrican con distintos tipos de acero según la agresividad del residuo:</p>

      <ul>
        <li><strong>Acero galvanizado:</strong> el estándar. Resiste la corrosión y la abrasión. Duración estimada: 5-8 obras.</li>
        <li><strong>Acero al carbono con pintura epóxica:</strong> opción económica para obras cortas. Duración: 1-2 obras.</li>
        <li><strong>Acero inoxidable:</strong> para residuos corrosivos o ambientes muy húmedos. Mayor costo, mayor duración.</li>
        <li><strong>Acero con recubrimiento de poliuretano:</strong> reduce el ruido y la abrasión. Ideal para zonas residenciales.</li>
      </ul>

      <blockquote>En LUDIER fabricamos chutes con acero galvanizado de 1.8 mm como estándar. Es el balance óptimo entre durabilidad, peso y costo.</blockquote>

      <h2>Normativas y requisitos de seguridad</h2>

      <p>Los chutes metálicos en Perú deben cumplir con:</p>

      <ul>
        <li><strong>Norma G.050 de Seguridad durante la Construcción (RNE):</strong> regula la instalación de chutes y sistemas de evacuación de residuos en obra.</li>
        <li><strong>Norma E.090 de Estructuras Metálicas:</strong> aplica a la fabricación y anclaje del chute a la estructura del edificio.</li>
        <li><strong>Protocolos internos de la constructora:</strong> muchas constructoras grandes (Cosapi, Graña y Montero, Besalco) tienen requisitos adicionales.</li>
      </ul>

      <p>Los requisitos técnicos mínimos que debe cumplir un chute bien instalado:</p>

      <ul>
        <li>Anclaje estructural cada 6 metros como máximo</li>
        <li>Compuertas con sistema de cierre automático en cada piso</li>
        <li>Boca de descarga con sistema de amortiguación o cortina</li>
        <li>Señalización en cada piso (zona de carga, prohibido asomarse)</li>
        <li>Inspección visual antes de cada jornada</li>
      </ul>

      <h2>¿Cuánto cuesta un chute metálico en Lima?</h2>

      <p>El precio de un chute metálico depende de 4 factores principales:</p>

      <ul>
        <li><strong>Altura total del chute:</strong> se cotiza por metro lineal instalado. Rango típico: <strong>S/ 280 a S/ 450 por metro lineal</strong>.</li>
        <li><strong>Cantidad de compuertas:</strong> cada compuerta adicional suma entre S/ 150 y S/ 300 según tipo.</li>
        <li><strong>Tipo de acero:</strong> galvanizado es el estándar, inoxidable puede subir 40-60% el costo.</li>
        <li><strong>Complejidad del montaje:</strong> chutes en esquina, con codos o con curvas aumentan el costo.</li>
      </ul>

      <p><strong>Referencia orientativa:</strong> un chute para un edificio de 15 pisos (45 metros lineales), con 15 compuertas y acero galvanizado, suele estar entre <strong>S/ 15,000 y S/ 22,000</strong> instalado.</p>

      <p>El precio final depende de: cantidad de tramos, sistema de anclaje requerido, plazo de entrega, y si se incluye mantenimiento durante la obra.</p>

      <p>Para darte un precio real y competitivo, necesitamos:</p>
      <ol>
        <li>Número de pisos y altura total</li>
        <li>Planos o ubicación del chute en planta</li>
        <li>Duración estimada de la obra</li>
      </ol>

      <p><a href="/contacto?servicio=cercos-cerramientos">Solicitá tu cotización sin compromiso</a> — te respondemos en menos de 24 horas.</p>

      <h2>Errores comunes al contratar chutes metálicos</h2>

      <ul>
        <li><strong>1. No verificar la altura real del chute:</strong> muchos fabricantes cotizan sin subir a la azotea. La altura desde el último piso hasta el contenedor puede variar 5-10 metros.</li>
        <li><strong>2. Ignorar el tipo de residuo:</strong> un chute para concreto no es lo mismo que uno para cerámica o para residuos mixtos. El espesor del acero cambia.</li>
        <li><strong>3. No prever el mantenimiento:</strong> los chutes se desgastan y necesitan reparación durante la obra. Contratá con alguien que ofrezca servicio técnico.</li>
        <li><strong>4. Subestimar el tiempo de instalación:</strong> un chute de 15 pisos tarda entre 2 y 4 días en montarse completamente. Planificá con margen.</li>
        <li><strong>5. No exigir certificados:</strong> pedí siempre certificado de calidad del acero y protocolo de soldadura del fabricante.</li>
      </ul>

      <h2>¿Por qué elegir LUDIER para tu obra?</h2>

      <p>Más de 10 años fabricando e instalando chutes metálicos para las principales constructoras del Perú:</p>

      <ul>
        <li><strong>Hilton MDP (19 pisos):</strong> chute metálico completo con 19 compuertas, instalado en tiempo récord</li>
        <li><strong>Proyecto QANTUA:</strong> sistema de chutes con sistema de amortiguación para alta altura</li>
        <li><strong>20+ obras entregadas</strong> en Lima Metropolitana</li>
        <li><strong>Fabricación en taller propio</strong> con control de calidad dimensional y de soldadura</li>
        <li><strong>Servicio técnico durante la obra</strong> (reparaciones, ajustes, retiro al finalizar)</li>
      </ul>

      <p>Si tu obra necesita chutes metálicos — ya sea para un edificio de 10 pisos o un rascacielos de 25 — <a href="/contacto?servicio=cercos-cerramientos">pedí tu cotización sin compromiso</a>. Te respondemos en menos de 24 horas.</p>

      <h2>Preguntas frecuentes</h2>

      <h3>¿Cuánto tiempo tarda instalar un chute metálico?</h3>
      <p>Un chute de 10 pisos: 1-2 días. Un chute de 20 pisos: 3-4 días. Edificios con geometría compleja (codos, curvas) pueden tardar 1 día más.</p>

      <h3>¿Se puede reutilizar un chute en otra obra?</h3>
      <p>Sí. Los chutes de acero galvanizado pueden reutilizarse 5-8 veces si se manipulan con cuidado. Los chutes con acabado económico suelen durar 1-2 obras.</p>

      <h3>¿El chute incluye el contenedor de acopio?</h3>
      <p>No. El contenedor o tolva de descarga es responsabilidad de la constructora. Nosotros instalamos el chute desde la azotea o último piso hasta la altura que nos indiques (normalmente planta baja o sótano).</p>

      <h3>¿Ofrecen mantenimiento durante la obra?</h3>
      <p>Sí. Ofrecemos planes de mantenimiento con visitas semanales para inspección de soldaduras, ajuste de anclajes y reparación de compuertas.</p>

      <h3>¿Trabajan en toda Lima o solo en algunos distritos?</h3>
      <p>Cubrimos toda Lima Metropolitana. También atendemos proyectos en provincias para obras grandes (más de 15 pisos).</p>

      <!-- 👇 LINK BUILDING INTERNO: Blog → Landing B2B (Chutes) -->
      <div style="margin-top: 40px; padding: 24px; background-color: #FFF3EC; border-left: 4px solid #FF5A1F;">
        <p style="margin: 0 0 12px 0; font-weight: 600; color: #1E2126;">¿Necesitas cotizar chutes metálicos para tu obra?</p>
        <p style="margin: 0 0 16px 0; color: #565C63;">Visita nuestra ficha técnica completa con tipos de chutes, casos de éxito (Hilton MDP, Qantua Fase 3) y proceso de montaje.</p>
        <a href="/servicios/chutes-metalicos-para-construccion" style="display: inline-block; padding: 12px 24px; background-color: #FF5A1F; color: white; text-decoration: none; font-weight: 600; border-radius: 2px;">Ver ficha técnica de chutes metálicos →</a>
      </div>
    `,
    fecha: "14 de Octubre, 2026",
    fechaISO: "2026-10-14",
    tiempoLectura: "7 min",
    categoria: "Sistemas",
    imagen: "/img/chutesMetalicos.webp",
    autor: "Equipo LUDIER",
    autorRol: "Ingeniería y fabricación",
    keywords: [
      "chutes metálicos",
      "chutes para construcción",
      "chutes para escombros",
      "chute metálico edificio",
      "evacuación residuos obra",
      "chutes de obra Lima",
    ],
    metaDescription:
      "Guía completa sobre chutes metálicos para construcción: tipos, materiales, normativas y precios en Lima 2026. Fabricación por LUDIER.",
  },

  // ============================================================
  // 3. BARANDAS PARA BALCONES (SEO target principal)
  // ============================================================
  {
    id: 3,
    slug: "barandas-metalicas-balcones-guia",
    titulo: "Barandas metálicas para balcones: tipos, precios y normativas (2026)",
    extracto:
      "Todo sobre barandas metálicas para balcones: tipos, materiales, precios y normativas. Guía técnica por LUDIER.",
    contenido: `
      <p>Las barandas de balcón son uno de los elementos más importantes de cualquier edificio residencial. No solo cumplen una función de seguridad crítica, sino que también definen la estética de la fachada y la personalidad del proyecto.</p>

      <p>En esta guía te explicamos todo lo que necesitás saber antes de contratar barandas metálicas para balcones: tipos, materiales, normativas, precios de referencia y errores comunes. Basado en más de 10 años instalando barandas en proyectos como Zendai, QANTUA y otros edificios residenciales en Lima.</p>

      <h2>¿Por qué elegir barandas metálicas y no otros materiales?</h2>

      <p>Cuando se trata de balcones, las opciones más comunes son: barandas metálicas, de vidrio templado, de madera o de concreto. Las metálicas tienen ventajas específicas:</p>

      <ul>
        <li><strong>Resistencia estructural:</strong> el acero soporta cargas mayores que la madera y no se astilla ni se dobla.</li>
        <li><strong>Bajo mantenimiento:</strong> con galvanizado o pintura electrostática, duran décadas sin intervención.</li>
        <li><strong>Diseño personalizable:</strong> desde líneas minimalistas hasta patrones decorativos. Cualquier diseño es posible.</li>
        <li><strong>Costo accesible:</strong> 30-40% más económicas que las de vidrio templado, sin perder elegancia.</li>
        <li><strong>Resistencia sísmica:</strong> el acero disipa energía durante sismos, a diferencia del vidrio o la madera.</li>
      </ul>

      <h2>Tipos de barandas metálicas para balcones</h2>

      <h3>1. Barandas de tubos horizontales</h3>
      <p>El diseño más clásico y económico. Se fabrican con tubos de acero de distintos diámetros (2", 1.5", 1") unidos horizontalmente. Ideales para balcones residenciales y comerciales. Duración: 15-20 años con mantenimiento básico.</p>

      <h3>2. Barandas de barrotes verticales</h3>
      <p>Barrotes verticales soldados a un pasamanos superior y una base inferior. Diseño moderno y limpio. Permiten mayor visibilidad y son ideales para balcones con vista. Muy populares en edificios contemporáneos.</p>

      <h3>3. Barandas tipo malla</h3>
      <p>Se usa malla electrosoldada entre los parantes principales. Diseño industrial, económico y de fácil mantenimiento. Ideales para proyectos con presupuesto ajustado o zonas de servicio.</p>

      <h3>4. Barandas con vidrio templado + estructura metálica</h3>
      <p>Combinan vidrio templado de 10 mm con parantes de acero. Diseño premium, máxima visibilidad. Costo más alto, pero es la opción preferida en proyectos residenciales de alta gama.</p>

      <h3>5. Barandas con diseños personalizados</h3>
      <p>Patrones geométricos, cortes láser, diseños arquitectónicos específicos. Cada proyecto con requerimientos únicos necesita una solución a medida.</p>

      <h2>Materiales y acabados</h2>

      <p>El acero es el material base. Los acabados determinan la duración y estética:</p>

      <ul>
        <li><strong>Pintura electrostática:</strong> el acabado más común. Resiste la intemperie, se aplica en polvo y se hornea. Duración: 10-15 años con retoques.</li>
        <li><strong>Galvanizado en caliente:</strong> recubrimiento de zinc que resiste la corrosión por décadas. Ideal para zonas costeras o de alta humedad.</li>
        <li><strong>Pintura epóxica:</strong> alta resistencia química y mecánica. Ideal para zonas industriales o de alto tránsito.</li>
        <li><strong>Acero inoxidable:</strong> acabado premium que no requiere mantenimiento. Mayor costo pero máxima durabilidad.</li>
        <li><strong>Acabado gloss mate:</strong> pintura decorativa de alta calidad. Ideal para barandas visibles en fachadas.</li>
      </ul>

      <blockquote>En Lima, donde la humedad costera es alta, siempre recomendamos galvanizado + pintura electrostática o galvanizado + epóxico. El costo adicional se paga solo en la primera década.</blockquote>

      <h2>Normativas para barandas de balcón en Perú</h2>

      <p>Las barandas metálicas para balcones deben cumplir con la <strong>Norma E.020 de Cargas</strong> y la <strong>Norma G.050 de Seguridad durante la Construcción</strong> del Reglamento Nacional de Edificaciones (RNE):</p>

      <ul>
        <li><strong>Altura mínima:</strong> 1.00 m desde el nivel del piso terminado hasta el pasamanos superior</li>
        <li><strong>Resistencia horizontal:</strong> 75 kg/m aplicado en cualquier punto del pasamanos</li>
        <li><strong>Separación entre barrotes:</strong> máxima 12 cm (para evitar paso de niños)</li>
        <li><strong>Carga vertical:</strong> 100 kg en cualquier punto del pasamanos</li>
        <li><strong>Anclaje:</strong> al menos 2 puntos por metro lineal, con pernos de expansión de 3/8" mínimo</li>
      </ul>

      <p>Para balcones en edificios comerciales o de uso público, las exigencias pueden ser mayores. Consultá siempre con un ingeniero estructural antes de instalar.</p>

      <h2>¿Cuánto cuestan las barandas metálicas para balcones en Lima?</h2>

      <p>El precio depende de 4 factores: tipo de diseño, acabado, cantidad de metros lineales y complejidad del montaje.</p>

      <ul>
        <li><strong>Barandas de tubos horizontales (acero negro + pintura):</strong> desde <strong>S/ 180 por metro lineal</strong></li>
        <li><strong>Barandas de barrotes verticales (galvanizado + electrostática):</strong> desde <strong>S/ 280 por metro lineal</strong></li>
        <li><strong>Barandas con malla electrosoldada:</strong> desde <strong>S/ 220 por metro lineal</strong></li>
        <li><strong>Barandas con vidrio templado + estructura metálica:</strong> desde <strong>S/ 650 por metro lineal</strong></li>
        <li><strong>Diseños personalizados:</strong> cotización caso por caso según planos</li>
      </ul>

      <p><strong>Referencia orientativa:</strong> un balcón típico de 4 metros lineales con baranda de barrotes verticales galvanizada + electrostática puede costar entre <strong>S/ 1,100 y S/ 1,400</strong> instalado.</p>

      <p>El precio final depende de: cantidad total de metros lineales, tipo de acabado, cantidad de anclajes requeridos, y plazo de entrega.</p>

      <p>Para darte un precio real y competitivo, necesitamos:</p>
      <ol>
        <li>Medidas del balcón (metros lineales)</li>
        <li>Tipo de diseño deseado (o referencia visual)</li>
        <li>Ubicación y accesibilidad del balcón</li>
      </ol>

      <p><a href="/contacto?servicio=barandas-pasamanos">Solicitá tu cotización sin compromiso</a> — te respondemos en menos de 24 horas.</p>

      <h2>Errores comunes al contratar barandas para balcones</h2>

      <ul>
        <li><strong>1. Elegir por precio y no por calidad:</strong> una baranda barata puede fallar en 3-5 años y poner en riesgo vidas. Priorizá fabricantes certificados.</li>
        <li><strong>2. Ignorar el tipo de acero:</strong> algunos proveedores usan acero reciclado sin trazabilidad. Siempre pedí certificado de calidad.</li>
        <li><strong>3. No verificar las normativas:</strong> algunas barandas no cumplen con la altura mínima o separación entre barrotes. Esto puede causar problemas legales.</li>
        <li><strong>4. Olvidar el mantenimiento:</strong> una baranda bien acabada puede durar 20 años; una con acabado económico requiere repintado cada 2 años.</li>
        <li><strong>5. No pedir visita técnica:</strong> un buen fabricante visita el balcón antes de cotizar para verificar medidas y tipo de anclaje.</li>
      </ul>

      <h2>¿Por qué elegir LUDIER para tus barandas de balcón?</h2>

      <p>Más de 10 años instalando barandas metálicas en proyectos residenciales y comerciales del Perú:</p>

      <ul>
        <li><strong>Edificio Residencial Zendai:</strong> barandas de balcón con barrotes verticales, galvanizadas y con acabado electrostático</li>
        <li><strong>Proyecto QANTUA:</strong> barandas de seguridad con diseño personalizado</li>
        <li><strong>20+ proyectos ejecutados</strong> con cumplimiento del 95% de plazos</li>
        <li><strong>Fabricación en taller propio</strong> con control dimensional y de soldadura</li>
        <li><strong>Garantía escrita</strong> sobre estructura y acabados</li>
      </ul>

      <p>Si tenés un balcón nuevo, una remodelación o querés renovar las barandas existentes, <a href="/contacto?servicio=barandas-pasamanos">pedí tu cotización sin compromiso</a>. Te respondemos en menos de 24 horas.</p>

      <h2>Preguntas frecuentes</h2>

      <h3>¿Cuánto tiempo tarda fabricar e instalar barandas de balcón?</h3>
      <p>Barandas estándar: 1-2 semanas de fabricación + 2-4 días de instalación. Diseños personalizados: 2-4 semanas de fabricación.</p>

      <h3>¿Qué mantenimiento requiere una baranda metálica?</h3>
      <p>Barandas galvanizadas o inoxidables: revisión anual + limpieza. Barandas con pintura: retoque cada 2-3 años en zonas expuestas.</p>

      <h3>¿Puedo cambiar el diseño si ya está fabricada?</h3>
      <p>No, una vez fabricada la estructura no se puede modificar. Es clave definir el diseño antes de fabricar. Ofrecemos planos y renders previos para aprobación.</p>

      <h3>¿Instalan en departamentos ya habitados?</h3>
      <p>Sí. La mayoría de nuestras obras son en departamentos ocupados. Coordinamos horarios y protegemos las áreas comunes durante el trabajo.</p>

      <h3>¿Ofrecen garantía?</h3>
      <p>Sí. Ofrecemos garantía escrita de 2 años sobre estructura y acabados, y ofrecemos planes de mantenimiento opcional.</p>

      <!-- 👇 LINK BUILDING INTERNO: Blog → Landing B2B (Acero Inoxidable) -->
      <div style="margin-top: 40px; padding: 24px; background-color: #FFF3EC; border-left: 4px solid #FF5A1F;">
        <p style="margin: 0 0 12px 0; font-weight: 600; color: #1E2126;">¿Buscas barandas de acero inoxidable para tu obra?</p>
        <p style="margin: 0 0 16px 0; color: #565C63;">Conoce nuestra ficha técnica completa con comparativa de materiales (304 vs 316), casos de éxito (Zendai, Qantua) y proceso de instalación.</p>
        <a href="/servicios/barandas-acero-inoxidable" style="display: inline-block; padding: 12px 24px; background-color: #FF5A1F; color: white; text-decoration: none; font-weight: 600; border-radius: 2px;">Ver ficha técnica de barandas inoxidable →</a>
      </div>
    `,
    fecha: "13 de Octubre, 2026",
    fechaISO: "2026-10-13",
    tiempoLectura: "8 min",
    categoria: "Diseño",
    imagen: "/img/barandaBalcones.jpg",
    autor: "Equipo LUDIER",
    autorRol: "Diseño y fabricación",
    keywords: [
      "barandas metálicas para balcones",
      "barandas para balcones Lima",
      "barandas de seguridad",
      "barandas de acero balcón",
      "precio barandas metálicas",
      "barandas de balcón Perú",
    ],
    metaDescription:
      "Guía completa sobre barandas metálicas para balcones: tipos, materiales, normativas y precios en Lima 2026. Fabricación certificada por LUDIER.",
  },

  // ============================================================
  // 4. SEGURIDAD EN OBRAS (REESCRITO)
  // ============================================================
  {
    id: 4,
    slug: "seguridad-en-obras-construccion",
    titulo: "Seguridad en obras de construcción: 7 prácticas obligatorias (2026)",
    extracto:
      "Guía práctica de seguridad en obras: EPP, protocolos, normativas y errores comunes. Basado en 10+ años de experiencia en LUDIER.",
    contenido: `
      <p>La seguridad en obras de construcción no es opcional. En el Perú, los accidentes laborales en construcción representan una de las principales causas de lesiones y muertes en el sector. Y sin embargo, la mayoría son prevenibles.</p>

      <p>En LUDIER, hemos implementado protocolos que han reducido los incidentes en un 85% en nuestros proyectos. En esta guía compartimos las 7 prácticas que consideramos **no negociables** en cualquier obra, desde una cobertura residencial hasta un edificio de 25 pisos.</p>

      <h2>¿Por qué es tan importante la seguridad en obra?</h2>

      <p>Los datos son contundentes:</p>

      <ul>
        <li><strong>Caídas de altura:</strong> son la causa #1 de muertes en construcción a nivel mundial</li>
        <li><strong>Golpes por objetos:</strong> la segunda causa más común de lesiones graves</li>
        <li><strong>Electrocución:</strong> frecuente en obras con instalaciones eléctricas provisionales</li>
        <li><strong>Atrapamiento:</strong> común en excavaciones y estructuras colapsadas</li>
      </ul>

      <p>Pero el impacto no es solo humano. Una obra con accidentes tiene:</p>

      <ul>
        <li>Paralizaciones por investigación de SUNAFIL</li>
        <li>Multas que pueden superar los S/ 100,000</li>
        <li>Pérdida de credibilidad ante el cliente</li>
        <li>Retrasos que afectan todo el cronograma</li>
      </ul>

      <blockquote>En LUDIER, la regla es simple: si una tarea no se puede hacer con seguridad, no se hace. Sin excepciones, sin importar la presión de plazo.</blockquote>

      <h2>Las 7 prácticas obligatorias</h2>

      <h3>1. EPP completo y certificado</h3>
      <p>Todo trabajador debe contar con Equipo de Protección Personal certificado y en buen estado:</p>
      <ul>
        <li><strong>Casco:</strong> obligatorio siempre, con barbiquejo</li>
        <li><strong>Arnés y línea de vida:</strong> obligatorios en trabajos sobre 1.80 m</li>
        <li><strong>Guantes:</strong> según tipo de tarea (soldadura, manipulación, corte)</li>
        <li><strong>Botas de seguridad:</strong> con punta de acero y suela antideslizante</li>
        <li><strong>Lentes de protección:</strong> para corte, soldadura y esmerilado</li>
        <li><strong>Protección auditiva:</strong> en zonas con ruido sobre 85 dB</li>
      </ul>

      <h3>2. Charla diaria de seguridad (5 minutos)</h3>
      <p>Antes de comenzar cada jornada, el supervisor debe realizar una charla de 5 minutos con todo el equipo:</p>
      <ul>
        <li>Revisión de las tareas del día</li>
        <li>Identificación de riesgos específicos</li>
        <li>Recordatorio de protocolos aplicables</li>
        <li>Verificación de EPP</li>
      </ul>

      <h3>3. Análisis de Trabajo Seguro (ATS)</h3>
      <p>Para cada tarea crítica (trabajos en altura, izaje de cargas, espacios confinados) se debe realizar un ATS escrito:</p>
      <ul>
        <li>Descripción del trabajo</li>
        <li>Riesgos identificados</li>
        <li>Controles implementados</li>
        <li>Responsables</li>
        <li>Firmas de los involucrados</li>
      </ul>

      <h3>4. Protecciones colectivas</h3>
      <p>Antes que cualquier EPP, las protecciones colectivas son la primera línea de defensa:</p>
      <ul>
        <li><strong>Barandas perimetrales:</strong> en todos los bordes de losa y aberturas</li>
        <li><strong>Redes de seguridad:</strong> en trabajos en fachadas</li>
        <li><strong>Plataformas de trabajo:</strong> con superficies antideslizantes</li>
        <li><strong>Señalización:</strong> cintas, conos y letreros en zonas de riesgo</li>
      </ul>

      <h3>5. Capacitación continua</h3>
      <p>La seguridad no se improvisa. En LUDIER realizamos:</p>
      <ul>
        <li><strong>Inducción:</strong> 8 horas antes del primer día en obra</li>
        <li><strong>Entrenamientos mensuales:</strong> uso de EPP, primeros auxilios, evacuación</li>
        <li><strong>Cursos específicos:</strong> trabajos en altura, izaje, espacios confinados</li>
        <li><strong>Simulacros:</strong> al menos 2 por año</li>
      </ul>

      <h3>6. Inspecciones periódicas</h3>
      <p>Las inspecciones detectan riesgos antes de que se conviertan en accidentes:</p>
      <ul>
        <li><strong>Diaria:</strong> revisión visual de EPP y zonas de trabajo</li>
        <li><strong>Semanal:</strong> inspección de andamios, escaleras y equipos</li>
        <li><strong>Mensual:</strong> auditoría completa del sistema de gestión</li>
        <li><strong>Trimestral:</strong> auditoría externa por especialista</li>
      </ul>

      <h3>7. Protocolo de emergencia</h3>
      <p>Todo el personal debe saber qué hacer ante una emergencia:</p>
      <ul>
        <li>Ubicación de extintores y botiquín</li>
        <li>Rutas de evacuación señalizadas</li>
        <li>Punto de reunión en caso de evacuación</li>
        <li>Números de emergencia visibles (SAMU 106, Bomberos 116)</li>
        <li>Responsable de primeros auxilios por turno</li>
      </ul>

      <h2>Normativas aplicables en Perú</h2>

      <p>La seguridad en obras en Perú se rige por:</p>

      <ul>
        <li><strong>Norma G.050 de Seguridad durante la Construcción (RNE):</strong> regula EPP, protecciones colectivas, señalización y protocolos</li>
        <li><strong>Ley 29783 de Seguridad y Salud en el Trabajo:</strong> obliga a implementar un Sistema de Gestión de Seguridad</li>
        <li><strong>D.S. 005-2012-TR:</strong> reglamento de la Ley 29783</li>
        <li><strong>Normas sectoriales:</strong> según el tipo de obra (edificación, minería, industria)</li>
      </ul>

      <p>El incumplimiento puede generar multas de hasta 200 UIT (S/ 1,030,000) y paralización de la obra.</p>

      <h2>Errores comunes en seguridad de obra</h2>

      <ul>
        <li><strong>1. Priorizar plazo sobre seguridad:</strong> "terminemos esto rápido aunque no esté seguro" es la frase que precede a la mayoría de los accidentes</li>
        <li><strong>2. EPP en mal estado:</strong> cascos vencidos, arneses sin revisión, guantes rotos. El EPP vencido no protege</li>
        <li><strong>3. Falta de supervisión:</strong> sin un supervisor con autoridad, los protocolos no se cumplen</li>
        <li><strong>4. No reportar incidentes:</strong> los casi-accidentes son oportunidades de aprendizaje. Ocultarlos garantiza repetirlos</li>
        <li><strong>5. Trabajadores sin capacitación:</strong> un trabajador nuevo sin inducción es un riesgo para él y para el equipo</li>
      </ul>

      <h2>¿Por qué elegir LUDIER para tu obra?</h2>

      <p>La seguridad es parte de nuestra cultura, no un requisito que cumplimos para auditorías:</p>

      <ul>
        <li><strong>85% reducción de incidentes</strong> en los últimos 3 años</li>
        <li><strong>20+ obras sin accidentes graves</strong> en Lima Metropolitana</li>
        <li><strong>Personal certificado</strong> en trabajos en altura y espacios confinados</li>
        <li><strong>Supervisores con experiencia</strong> en proyectos de gran altura (Zendai, Hilton MDP, QANTUA)</li>
        <li><strong>Protocolos auditables</strong> que cumplen con SUNAFIL y las principales constructoras del país</li>
      </ul>

      <p>Si buscás un fabricante de estructuras metálicas que se tome la seguridad en serio, <a href="/contacto?servicio=estructuras-metalicas">pedí tu cotización sin compromiso</a>. Te respondemos en menos de 24 horas.</p>

      <h2>Preguntas frecuentes</h2>

      <h3>¿Quién es responsable de la seguridad en obra?</h3>
      <p>La seguridad es responsabilidad de todos: el empleador (brindar EPP y capacitación), el supervisor (hacer cumplir los protocolos) y cada trabajador (usar el EPP y reportar riesgos).</p>

      <h3>¿Cada cuánto hay que renovar el EPP?</h3>
      <p>Depende del tipo de EPP. Los cascos: cada 2-3 años. Arneses: revisión anual, cambio cada 5 años o antes si hay impacto. Botas: según desgaste.</p>

      <h3>¿Qué hacer si hay un accidente en obra?</h3>
      <p>Primero: atención médica inmediata. Segundo: reportar el incidente al supervisor. Tercero: no mover nada hasta que se investigue. Cuarto: documentar con fotos y testimonios.</p>

      <h3>¿Es obligatorio tener un protocolo escrito?</h3>
      <p>Sí. La Ley 29783 exige que toda obra tenga un Sistema de Gestión de Seguridad documentado. Las constructoras grandes suelen auditar a sus subcontratistas.</p>

      <h3>¿Trabajan con constructoras que tienen sus propios protocolos?</h3>
      <p>Sí. Nos adaptamos a los protocolos específicos de cada constructora (Cosapi, Graña y Montero, Besalco, etc.) y cumplimos con sus auditorías.</p>
    `,
    fecha: "20 de Septiembre, 2026",
    fechaISO: "2026-09-20",
    tiempoLectura: "7 min",
    categoria: "Seguridad",
    imagen: "/img/seguridadObra.jpg",
    autor: "Equipo LUDIER",
    autorRol: "Seguridad y operaciones",
    keywords: [
      "seguridad en obras",
      "EPP construcción",
      "seguridad construcción vertical",
      "protocolos de seguridad obra",
      "normativa G.050",
      "Ley 29783 construcción",
    ],
    metaDescription:
      "Guía completa de seguridad en obras de construcción: EPP, protocolos, normativas peruanas y 7 prácticas obligatorias. Por LUDIER.",
  },

  // ============================================================
  // 5. FABRICACIÓN A MEDIDA (REESCRITO)
  // ============================================================
  {
    id: 5,
    slug: "fabricacion-metalica-medida-guia",
    titulo: "Fabricación metálica a medida: Guía completa 2026",
    extracto:
      "Cómo funciona la fabricación metálica a medida: tipos, materiales, proceso paso a paso y errores comunes. Guía por LUDIER.",
    contenido: `
      <p>La fabricación metálica a medida es lo que diferencia un proyecto estándar de uno completamente personalizado. Cuando tenés un plano específico, un requerimiento técnico particular o una pieza que no existe en el mercado, la fabricación a medida es la única solución.</p>

      <p>En esta guía te explicamos cómo funciona el proceso de fabricación metálica a medida, qué elementos se pueden fabricar, cuánto cuesta y cómo elegir al fabricante correcto. Basado en más de 10 años fabricando piezas personalizadas para las principales constructoras del Perú.</p>

      <h2>¿Qué es la fabricación metálica a medida?</h2>

      <p>Es el proceso de diseño, fabricación e instalación de piezas o estructuras metálicas según especificaciones técnicas únicas del cliente. A diferencia de la fabricación estándar (donde comprás un producto con dimensiones fijas), la fabricación a medida permite:</p>

      <ul>
        <li><strong>Adaptar la pieza</strong> a las dimensiones exactas del espacio disponible</li>
        <li><strong>Cumplir con planos específicos</strong> proporcionados por el cliente o su ingeniero</li>
        <li><strong>Optimizar el diseño</strong> para el uso específico (carga, tránsito, resistencia)</li>
        <li><strong>Integrar acabados personalizados</strong> (color, textura, protección)</li>
      </ul>

      <h2>¿Qué elementos se pueden fabricar a medida?</h2>

      <p>Prácticamente cualquier elemento metálico puede fabricarse a medida. Los más comunes:</p>

      <h3>1. Rejillas metálicas</h3>
      <p>Rejillas de acero para pisos, pasarelas, áreas de drenaje y ventilación. Fabricadas con perfiles de alta resistencia y acabados anticorrosivos. Dimensiones totalmente personalizadas.</p>

      <h3>2. Sumideros metálicos</h3>
      <p>Sumideros de acero para sistemas de drenaje industrial, plantas de proceso y obras civiles. Diseñados según especificaciones técnicas del proyecto.</p>

      <h3>3. Tapas metálicas</h3>
      <p>Tapas de acero para registros, cámaras, pozos y buzones. Con sistemas de seguridad, bisagras y cerraduras personalizadas.</p>

      <h3>4. Bastidores y soportes</h3>
      <p>Bastidores metálicos para soporte de equipos, maquinaria, paneles eléctricos o cualquier estructura que necesite anclaje específico.</p>

      <h3>5. Racks industriales</h3>
      <p>Racks de almacenamiento diseñados para las dimensiones y capacidades específicas de cada almacén. Modulares y personalizables.</p>

      <h3>6. Elementos arquitectónicos</h3>
      <p>Pérgolas, marquesinas, barandas decorativas, paneles ornamentales, letreros y cualquier elemento metálico con diseño único.</p>

      <h3>7. Piezas especiales para la industria</h3>
      <p>Componentes específicos para plantas de producción, minería, alimentaria o cualquier sector que requiera piezas metálicas no comerciales.</p>

      <h2>El proceso paso a paso</h2>

      <h3>Paso 1: Análisis del requerimiento</h3>
      <p>El primer paso es entender exactamente qué necesita el cliente. Esto implica:</p>
      <ul>
        <li>Revisar planos, especificaciones técnicas o fotos del espacio</li>
        <li>Visitar la obra si es necesario para verificar medidas reales</li>
        <li>Definir requisitos funcionales (carga, tránsito, ambiente)</li>
        <li>Definir requisitos estéticos (color, acabado, integración)</li>
      </ul>

      <h3>Paso 2: Diseño y optimización</h3>
      <p>Con la información recopilada, se diseña la solución:</p>
      <ul>
        <li>Cálculo estructural (si aplica)</li>
        <li>Selección del tipo de acero y espesor</li>
        <li>Definición de acabados</li>
        <li>Planos de fabricación para aprobación del cliente</li>
      </ul>

      <h3>Paso 3: Fabricación en taller</h3>
      <p>Una vez aprobado el diseño, comienza la fabricación:</p>
      <ul>
        <li>Corte de perfiles y planchas según planos</li>
        <li>Soldadura por soldadores certificados</li>
        <li>Control dimensional (tolerancias milimétricas)</li>
        <li>Aplicación de acabados (galvanizado, pintura, etc.)</li>
      </ul>

      <h3>Paso 4: Control de calidad</h3>
      <p>Antes de entregar, cada pieza pasa por:</p>
      <ul>
        <li>Verificación dimensional</li>
        <li>Inspección visual de soldaduras</li>
        <li>Verificación de acabados</li>
        <li>Fotografías de respaldo</li>
      </ul>

      <h3>Paso 5: Entrega e instalación</h3>
      <p>La pieza se entrega en obra (o se instala directamente si el cliente lo requiere):</p>
      <ul>
        <li>Transporte hasta el punto de instalación</li>
        <li>Montaje por personal especializado</li>
        <li>Ajustes finales</li>
        <li>Documentación de entrega</li>
      </ul>

      <h2>Materiales y acabados</h2>

      <p>Los materiales más comunes en fabricación a medida:</p>

      <ul>
        <li><strong>Acero al carbono (A36):</strong> el más común, versátil y económico</li>
        <li><strong>Acero galvanizado:</strong> resistente a la corrosión, ideal para exteriores</li>
        <li><strong>Acero inoxidable:</strong> para ambientes agresivos (químico, alimentario, marino)</li>
        <li><strong>Aluminio:</strong> cuando se busca bajo peso y resistencia a la corrosión</li>
      </ul>

      <p>Acabados disponibles:</p>

      <ul>
        <li><strong>Pintura electrostática:</strong> acabado en polvo horneado, resistente y decorativo</li>
        <li><strong>Galvanizado en caliente:</strong> recubrimiento de zinc para máxima durabilidad</li>
        <li><strong>Pintura epóxica:</strong> alta resistencia química</li>
        <li><strong>Pintura poliuretano:</strong> máxima resistencia a la intemperie y UV</li>
      </ul>

      <h2>¿Cuánto cuesta la fabricación metálica a medida?</h2>

      <p>El precio varía muchísimo según el tipo de pieza, cantidad de acero, acabado y complejidad. Como referencia orientativa:</p>

      <ul>
        <li><strong>Rejillas metálicas:</strong> desde <strong>S/ 180 por m²</strong> (galvanizadas)</li>
        <li><strong>Sumideros y tapas:</strong> desde <strong>S/ 250 por unidad</strong> (según tamaño)</li>
        <li><strong>Bastidores industriales:</strong> desde <strong>S/ 400 por unidad</strong> (tamaño estándar)</li>
        <li><strong>Racks modulares:</strong> desde <strong>S/ 350 por nivel</strong> según capacidad</li>
        <li><strong>Elementos arquitectónicos:</strong> cotización caso por caso</li>
      </ul>

      <p>El precio final depende de: cantidad de acero (kg), complejidad del diseño, tipo de acabado, cantidad de piezas y plazo de entrega.</p>

      <p>Para darte un precio real y competitivo, necesitamos:</p>
      <ol>
        <li>Planos o descripción detallada</li>
        <li>Cantidad de piezas</li>
        <li>Plazo de entrega esperado</li>
      </ol>

      <p><a href="/contacto?servicio=fabricacion-medida">Solicitá tu cotización sin compromiso</a> — te respondemos en menos de 24 horas.</p>

      <h2>Errores comunes al contratar fabricación a medida</h2>

      <ul>
        <li><strong>1. No definir bien las especificaciones:</strong> "algo así como esto" no es suficiente. Necesitás planos o al menos medidas exactas</li>
        <li><strong>2. Elegir solo por precio:</strong> un fabricante barato que no certifica soldaduras puede entregarte una pieza que falle en 6 meses</li>
        <li><strong>3. No verificar la experiencia del taller:</strong> pedí referencias, fotos de trabajos similares, certificaciones</li>
        <li><strong>4. Ignorar los acabados:</strong> un elemento exterior en acero negro sin protección se oxida en semanas en Lima</li>
        <li><strong>5. No planificar los plazos:</strong> la fabricación a medida toma más tiempo que un producto estándar. Planificá con margen</li>
      </ul>

      <h2>¿Por qué elegir LUDIER para tu fabricación a medida?</h2>

      <p>Más de 10 años fabricando piezas personalizadas para las principales constructoras del Perú:</p>

      <ul>
        <li><strong>Taller propio</strong> equipado con maquinaria de corte, doblado y soldadura de última generación</li>
        <li><strong>Soldadores certificados</strong> y control de calidad dimensional en cada pieza</li>
        <li><strong>Capacidad de producción</strong> para proyectos pequeños (1-10 piezas) y grandes (100+ piezas)</li>
        <li><strong>Experiencia en sectores</strong> construcción, industria, minería y arquitectura</li>
        <li><strong>Garantía escrita</strong> sobre fabricación y acabados</li>
      </ul>

      <p>Si tenés un plano, una idea o un requerimiento específico, <a href="/contacto?servicio=fabricacion-medida">pedí tu cotización sin compromiso</a>. Te respondemos en menos de 24 horas.</p>

      <h2>Preguntas frecuentes</h2>

      <h3>¿Cuánto tiempo tarda la fabricación a medida?</h3>
      <p>Piezas simples: 3-7 días. Piezas medianas: 1-3 semanas. Proyectos grandes o complejos: 3-6 semanas.</p>

      <h3>¿Puedo fabricar una sola pieza?</h3>
      <p>Sí. Aceptamos proyectos desde 1 unidad. Aunque el costo unitario es más alto que en producción en serie, seguimos siendo competitivos.</p>

      <h3>¿Qué necesito para pedir una cotización?</h3>
      <p>Ideal: planos con dimensiones y especificaciones. Si no tenés planos: fotos, medidas básicas y una idea del uso. Nosotros te ayudamos a definir el resto.</p>

      <h3>¿Hacen envíos fuera de Lima?</h3>
      <p>Sí. Realizamos envíos a todo el Perú para proyectos medianos y grandes. Coordinamos el transporte con el cliente.</p>

      <h3>¿Ofrecen garantía?</h3>
      <p>Sí. Ofrecemos garantía escrita de 1-2 años según el tipo de pieza y acabado.</p>

      <!-- 👇 LINK BUILDING INTERNO: Blog → Landing B2B (Fabricación a medida) -->
      <div style="margin-top: 40px; padding: 24px; background-color: #FFF3EC; border-left: 4px solid #FF5A1F;">
        <p style="margin: 0 0 12px 0; font-weight: 600; color: #1E2126;">¿Tienes un plano o pieza especial que fabricar?</p>
        <p style="margin: 0 0 16px 0; color: #565C63;">Conoce nuestra ficha técnica de fabricación metálica a medida: rejillas, sumideros, tapas, bastidores, racks y elementos arquitectónicos personalizados.</p>
        <a href="/servicios/fabricacion-medida" style="display: inline-block; padding: 12px 24px; background-color: #FF5A1F; color: white; text-decoration: none; font-weight: 600; border-radius: 2px;">Ver ficha técnica de fabricación a medida →</a>
      </div>
    `,
    fecha: "10 de Septiembre, 2026",
    fechaISO: "2026-09-10",
    tiempoLectura: "6 min",
    categoria: "Fabricación",
    imagen: "/img/Estructuras_especiales.jpg",
    autor: "Equipo LUDIER",
    autorRol: "Ingeniería y fabricación",
    keywords: [
      "fabricación metálica a medida",
      "elementos metálicos personalizados",
      "rejillas metálicas",
      "sumideros metálicos",
      "bastidores industriales",
      "fabricación según planos",
    ],
    metaDescription:
      "Guía completa sobre fabricación metálica a medida: elementos, proceso, precios y errores comunes. Fabricación en taller propio por LUDIER.",
  },

  // ============================================================
  // 6. NORMATIVAS (REESCRITO)
  // ============================================================
  {
    id: 6,
    slug: "normativas-construccion-peru-guia",
    titulo: "Normativas de construcción en Perú: Guía completa 2026",
    extracto:
      "Todo sobre normativas de construcción en Perú: RNE, E.030, E.020, E.090, G.050 y su aplicación práctica. Guía por LUDIER.",
    contenido: `
      <p>Si trabajás en construcción en Perú, sabés que las normativas no son un detalle menor. Son la diferencia entre una obra legal, segura y bien ejecutada, y una obra con multas, paralizaciones y riesgos legales.</p>

      <p>En esta guía te explicamos las principales normativas que rigen la construcción en Perú, cómo aplican a estructuras metálicas y qué necesitás saber antes de iniciar un proyecto. Basado en más de 10 años ejecutando obras para las principales constructoras del país.</p>

      <h2>¿Qué es el Reglamento Nacional de Edificaciones (RNE)?</h2>

      <p>El RNE es el documento rector de la construcción en Perú. Fue aprobado por D.S. 011-2006-VIVIENDA y contiene las normas técnicas que rigen el diseño, construcción y mantenimiento de edificaciones.</p>

      <p>Se organiza en 3 títulos:</p>

      <ul>
        <li><strong>Título I - Generalidades:</strong> disposiciones generales, responsabilidades, sanciones</li>
        <li><strong>Título II - Habilitaciones urbanas:</strong> diseño de vías, servicios, espacios públicos</li>
        <li><strong>Título III - Edificaciones:</strong> normas técnicas específicas (E.020, E.030, E.050, E.060, E.090, G.050, etc.)</li>
      </ul>

      <p>Su cumplimiento es obligatorio para cualquier proyecto de construcción, ampliación o remodelación en el país.</p>

      <h2>Normas específicas para estructuras metálicas</h2>

      <h3>Norma E.090 de Estructuras Metálicas</h3>
      <p>Es la norma clave para cualquier proyecto con acero estructural. Regula:</p>
      <ul>
        <li>Diseño de elementos estructurales de acero</li>
        <li>Fabricación y soldadura</li>
        <li>Montaje y control de calidad</li>
        <li>Conexiones (soldadas y apernadas)</li>
        <li>Protección contra corrosión e incendio</li>
      </ul>

      <p>Todo fabricante serio de estructuras metálicas debe conocer y aplicar esta norma.</p>

      <h3>Norma E.030 de Diseño Sismorresistente</h3>
      <p>Perú es un país sísmico. La E.030 regula:</p>
      <ul>
        <li>Zonificación sísmica del territorio</li>
        <li>Parámetros de diseño según zona y tipo de suelo</li>
        <li>Requisitos de rigidez y ductilidad</li>
        <li>Desplazamientos máximos permitidos</li>
      </ul>

      <p>En Lima (zona 4), las exigencias sísmicas son las más altas del país. Cualquier estructura metálica en Lima debe cumplir con E.030.</p>

      <h3>Norma E.020 de Cargas</h3>
      <p>Define las cargas mínimas que debe soportar una estructura:</p>
      <ul>
        <li>Cargas muertas (peso propio, elementos permanentes)</li>
        <li>Cargas vivas (uso, ocupación, mobiliario)</li>
        <li>Carga de viento</li>
        <li>Cargas sísmicas (complementaria a E.030)</li>
      </ul>

      <h3>Norma E.050 de Suelos y Cimentaciones</h3>
      <p>Regula los estudios de suelos y el diseño de cimentaciones. Fundamenta las cargas que transmitirá la estructura metálica al terreno.</p>

      <h3>Norma E.060 de Concreto Armado</h3>
      <p>Aunque regula el concreto, aplica a estructuras mixtas (acero + concreto) que son comunes en edificación moderna.</p>

      <h2>Normativas de seguridad en obra</h2>

      <h3>Norma G.050 de Seguridad durante la Construcción</h3>
      <p>Es la norma clave para seguridad en obra. Regula:</p>
      <ul>
        <li>Equipos de Protección Personal (EPP)</li>
        <li>Protecciones colectivas (barandas, redes, plataformas)</li>
        <li>Señalización y demarcación</li>
        <li>Protocolos para trabajos de riesgo (altura, izaje, excavaciones)</li>
        <li>Primeros auxilios y emergencias</li>
      </ul>

      <p>Su incumplimiento puede generar multas de hasta 200 UIT y paralización de obra por SUNAFIL.</p>

      <h3>Ley 29783 de Seguridad y Salud en el Trabajo</h3>
      <p>Complementa la G.050. Obliga a toda empresa del sector construcción a:</p>
      <ul>
        <li>Implementar un Sistema de Gestión de Seguridad y Salud en el Trabajo (SGSST)</li>
        <li>Capacitar a los trabajadores</li>
        <li>Realizar exámenes médicos ocupacionales</li>
        <li>Reportar accidentes a SUNAFIL</li>
      </ul>

      <h2>Otras normativas relevantes</h2>

      <ul>
        <li><strong>Norma E.070 de Albañilería:</strong> aplica cuando hay muros de albañilería complementarios</li>
        <li><strong>Norma E.040 de Vidrio:</strong> para proyectos con fachadas de vidrio o barandas con vidrio templado</li>
        <li><strong>Norma EM.010 de Instalaciones Eléctricas:</strong> para instalaciones eléctricas en obra</li>
        <li><strong>Norma IS.010 de Instalaciones Sanitarias:</strong> para instalaciones de agua y desagüe</li>
        <li><strong>Código Nacional de Electricidad:</strong> para conexiones eléctricas provisionales en obra</li>
      </ul>

      <h2>¿Cómo afectan estas normativas a tu proyecto?</h2>

      <p>Si vas a construir o remodelar:</p>

      <ul>
        <li><strong>Necesitás un ingeniero estructural</strong> que diseñe según E.030, E.020 y E.090</li>
        <li><strong>Necesitás un estudio de suelos</strong> según E.050 (excepto proyectos menores)</li>
        <li><strong>Necesitás permisos municipales</strong> que verifican cumplimiento del RNE</li>
        <li><strong>Necesitás contratar fabricantes certificados</strong> que apliquen las normas</li>
        <li><strong>Necesitás protocolos de seguridad</strong> según G.050 y Ley 29783</li>
      </ul>

      <p>Si sos fabricante o contratista:</p>

      <ul>
        <li><strong>Debés cumplir con E.090</strong> en el diseño y fabricación</li>
        <li><strong>Debés certificar soldadores</strong> según AWS D1.1</li>
        <li><strong>Debés implementar SGSST</strong> según Ley 29783</li>
        <li><strong>Debés reportar accidentes</strong> a SUNAFIL en 24 horas</li>
      </ul>

      <h2>Errores comunes con normativas</h2>

      <ul>
        <li><strong>1. Ignorar E.030:</strong> construir sin diseño sismorresistente puede ser catastrófico en un sismo</li>
        <li><strong>2. No verificar certificaciones:</strong> contratar fabricantes sin certificado de soldadores AWS</li>
        <li><strong>3. Omitir permisos municipales:</strong> construir sin licencia puede generar demolición</li>
        <li><strong>4. No actualizar normativas:</strong> las normas se actualizan periódicamente. Trabajar con versiones viejas genera incumplimiento</li>
        <li><strong>5. No documentar:</strong> sin expediente técnico, cualquier observación de SUNAFIL se convierte en multa</li>
      </ul>

      <h2>¿Por qué elegir LUDIER para tu proyecto?</h2>

      <p>Cumplir con las normativas es parte de nuestro ADN:</p>

      <ul>
        <li><strong>Ingenieros colegiados</strong> que diseñan según RNE y normativa vigente</li>
        <li><strong>Soldadores certificados</strong> según AWS D1.1</li>
        <li><strong>SGSST implementado</strong> según Ley 29783</li>
        <li><strong>Protocolos auditables</strong> por SUNAFIL y por las principales constructoras del país</li>
        <li><strong>20+ proyectos entregados</strong> sin observaciones de cumplimiento</li>
      </ul>

      <p>Si tu proyecto requiere estructuras metálicas que cumplan con todas las normativas peruanas, <a href="/contacto?servicio=estructuras-metalicas">pedí tu cotización sin compromiso</a>. Te respondemos en menos de 24 horas.</p>

      <h2>Preguntas frecuentes</h2>

      <h3>¿Quién fiscaliza el cumplimiento de las normativas?</h3>
      <p>Depende del tipo de obra. Municipalidades: en construcción urbana. SUNAFIL: en seguridad laboral. INDECI: en edificios de uso público. Ministerio de Vivienda: en programas estatales.</p>

      <h3>¿Las normativas son las mismas en todas las regiones?</h3>
      <p>El RNE es nacional, pero algunas normas tienen parámetros regionales. Por ejemplo, E.030 tiene zonificación sísmica por departamento, y E.020 tiene variaciones de carga de viento por zona.</p>

      <h3>¿Cada cuánto se actualizan las normativas?</h3>
      <p>No hay periodicidad fija. Se actualizan cuando hay avances técnicos, nuevos materiales o lecciones aprendidas de sismos y accidentes. Las actualizaciones se publican en El Peruano.</p>

      <h3>¿Necesito un ingeniero para una estructura metálica pequeña?</h3>
      <p>Para una cobertura residencial simple puede no ser obligatorio. Para estructuras que soporten cargas importantes (edificios, naves industriales, plataformas), siempre es necesario un ingeniero estructural colegiado.</p>

      <h3>¿Ofrecen asesoría en normativas?</h3>
      <p>Sí. Nuestro equipo de ingeniería puede asesorarte sobre qué normativas aplican a tu proyecto y cómo cumplirlas.</p>
    `,
    fecha: "1 de Septiembre, 2026",
    fechaISO: "2026-09-01",
    tiempoLectura: "8 min",
    categoria: "Normativas",
    imagen: "/img/normasdeSeguridad.png",
    autor: "Equipo LUDIER",
    autorRol: "Normativas y cumplimiento",
    keywords: [
      "normativas construcción perú",
      "RNE Perú",
      "norma E.030",
      "norma E.090",
      "norma G.050",
      "Ley 29783 construcción",
    ],
    metaDescription:
      "Guía completa de normativas de construcción en Perú: RNE, E.030, E.020, E.090, G.050 y Ley 29783. Aplicación práctica por LUDIER.",
  },


    // ============================================================
  // 7. ESCALERAS METÁLICAS (SEO target principal)
  // ============================================================
  {
    id: 7,
    slug: "escaleras-metalicas-edificios-guia",
    titulo: "Escaleras metálicas para edificios: tipos, normativas y precios (2026)",
    extracto:
      "Guía completa sobre escaleras metálicas: tipos, materiales, normativas y precios. Fabricación por LUDIER.",
    contenido: `
      <p>Las escaleras metálicas son uno de los elementos más críticos en cualquier edificio. No solo cumplen una función de circulación vertical, sino que también son componentes clave de los sistemas de evacuación en caso de emergencia. Una escalera mal diseñada o instalada puede poner en riesgo vidas.</p>

      <p>En esta guía te explicamos todo lo que necesitás saber antes de contratar escaleras metálicas: tipos, materiales, normativas peruanas y precios de referencia. Basado en más de 10 años fabricando escaleras para proyectos como Zendai, QANTUA y otras obras en Lima.</p>

      <h2>¿Qué son las escaleras metálicas y por qué elegirlas?</h2>

      <p>Las escaleras metálicas son sistemas de circulación vertical fabricados con perfiles de acero (largueros, peldaños, pasamanos) que permiten el acceso entre niveles de un edificio. Se usan tanto en interiores como en exteriores.</p>

      <p>Sus ventajas frente a otros materiales:</p>

      <ul>
        <li><strong>Resistencia estructural:</strong> el acero soporta cargas mucho mayores que la madera o el concreto liviano</li>
        <li><strong>Rapidez de instalación:</strong> se prefabrican en taller y se montan en obra en días</li>
        <li><strong>Diseño personalizable:</strong> desde escaleras utilitarias hasta diseños arquitectónicos de alta gama</li>
        <li><strong>Bajo mantenimiento:</strong> con galvanizado o pintura electrostática, duran décadas</li>
        <li><strong>Resistencia sísmica:</strong> el acero disipa energía durante sismos sin colapsar</li>
      </ul>

      <h2>Tipos de escaleras metálicas</h2>

      <h3>1. Escaleras de emergencia</h3>
      <p>Son las más críticas. Se instalan en fachadas o patios interiores de edificios y deben cumplir con estrictas normativas de seguridad. Diseñadas para evacuación rápida en caso de sismo o incendio. Incluyen pasamanos continuos, peldaños antideslizantes y descansos cada 3-4 metros.</p>

      <h3>2. Escaleras marineras</h3>
      <p>Escaleras de fuerte inclinación (60-75°) que se usan para acceso a espacios confinados, azoteas, tanques o equipos industriales. Fabricadas con perfiles robustos y peldaños tipo escalón. Ideales donde el espacio horizontal es limitado.</p>

      <h3>3. Escaleras industriales</h3>
      <p>Diseñadas para plantas de producción, almacenes, naves industriales y minería. Soportan tránsito intensivo y cargas pesadas. Se fabrican con acero galvanizado o con acabados epóxicos para resistir ambientes agresivos.</p>

      <h3>4. Escaleras de acceso a azotea</h3>
      <p>Permiten el acceso a techos para mantenimiento de equipos (tanques, paneles solares, aire acondicionado). Suelen combinarse con plataformas y barandas de protección según normativa.</p>

      <h3>5. Escaleras decorativas</h3>
      <p>Para interiores residenciales o comerciales de alta gama. Diseños minimalistas con peldaños flotantes, largueros ocultos o combinaciones de acero + madera + vidrio. Tan funcionales como estéticas.</p>

      <h2>Materiales y acabados</h2>

      <p>El acero es la base de toda escalera metálica. Los tipos más comunes:</p>

      <ul>
        <li><strong>Acero al carbono (A36):</strong> el más común. Económico y resistente. Requiere pintura o galvanizado para exteriores.</li>
        <li><strong>Acero galvanizado:</strong> con recubrimiento de zinc. Resiste la corrosión por décadas. Ideal para escaleras de emergencia expuestas.</li>
        <li><strong>Acero inoxidable:</strong> para ambientes agresivos (costa, industria química). Mayor costo, mayor durabilidad.</li>
      </ul>

      <p>Acabados disponibles:</p>

      <ul>
        <li><strong>Pintura electrostática:</strong> acabado en polvo horneado. Duradero y decorativo. Colores personalizables.</li>
        <li><strong>Galvanizado en caliente:</strong> máxima protección anticorrosiva. Obligatorio para escaleras de emergencia exteriores.</li>
        <li><strong>Pintura epóxica:</strong> alta resistencia química. Ideal para plantas industriales.</li>
        <li><strong>Pintura poliuretano:</strong> máxima resistencia a la intemperie y UV.</li>
      </ul>

      <blockquote>En LUDIER, toda escalera de emergencia exterior lleva galvanizado + pintura electrostática. Es la única forma de garantizar 20+ años sin óxido en la costa limeña.</blockquote>

      <h2>Normativas para escaleras metálicas en Perú</h2>

      <p>Las escaleras metálicas deben cumplir con:</p>

      <ul>
        <li><strong>Norma E.090 de Estructuras Metálicas (RNE):</strong> regula diseño y fabricación de escaleras de acero</li>
        <li><strong>Norma A.130 de Requisitos de Seguridad:</strong> regula escaleras de emergencia en edificaciones</li>
        <li><strong>Norma G.050 de Seguridad durante la Construcción:</strong> para escaleras provisionales de obra</li>
        <li><strong>Norma E.030 de Diseño Sismorresistente:</strong> obliga a que las escaleras resistan sismos sin colapsar</li>
      </ul>

      <p>Requisitos técnicos mínimos de una escalera de emergencia:</p>

      <ul>
        <li><strong>Ancho mínimo:</strong> 1.20 m para uso residencial, 1.50 m para uso público</li>
        <li><strong>Contrahuella:</strong> entre 16 y 18 cm</li>
        <li><strong>Huella (peldaño):</strong> entre 28 y 30 cm</li>
        <li><strong>Pasamanos:</strong> altura 0.90-1.00 m, continuo</li>
        <li><strong>Descansos:</strong> cada 3-4 metros de altura</li>
        <li><strong>Peldaños antideslizantes:</strong> obligatorios en exteriores</li>
      </ul>

      <h2>¿Cuánto cuesta una escalera metálica en Lima?</h2>

      <p>El precio depende de 4 factores principales:</p>

      <ul>
        <li><strong>Tipo de escalera:</strong> de emergencia, marinera, industrial o decorativa</li>
        <li><strong>Metros lineales:</strong> se cotiza por metro de desarrollo vertical</li>
        <li><strong>Acabado:</strong> acero negro, galvanizado, epóxico o inoxidable</li>
        <li><strong>Complejidad del montaje:</strong> altura, acceso, andamios requeridos</li>
      </ul>

      <p><strong>Rangos de referencia (2026):</strong></p>

      <ul>
        <li><strong>Escaleras marineras:</strong> desde <strong>S/ 380 por metro lineal</strong></li>
        <li><strong>Escaleras industriales:</strong> desde <strong>S/ 450 por metro lineal</strong></li>
        <li><strong>Escaleras de emergencia con pasamanos:</strong> desde <strong>S/ 650 por metro lineal</strong></li>
        <li><strong>Escaleras decorativas personalizadas:</strong> cotización caso por caso</li>
      </ul>

      <p><strong>Referencia orientativa:</strong> una escalera de emergencia de 15 metros (5 pisos) con pasamanos, galvanizada y con peldaños antideslizantes suele estar entre <strong>S/ 10,000 y S/ 14,000</strong> instalada.</p>

      <p>Para darte un precio real y competitivo, necesitamos:</p>
      <ol>
        <li>Número de pisos o altura total</li>
        <li>Ubicación (interior, exterior, fachada)</li>
        <li>Requerimiento de uso (emergencia, industrial, decorativa)</li>
      </ol>

      <p><a href="/contacto?servicio=escaleras-metalicas">Solicitá tu cotización sin compromiso</a> — te respondemos en menos de 24 horas.</p>

      <h2>Errores comunes al contratar escaleras metálicas</h2>

      <ul>
        <li><strong>1. No verificar normativa de emergencia:</strong> muchas escaleras no cumplen con la A.130 y pueden generar problemas con INDECI o la municipalidad.</li>
        <li><strong>2. Elegir por precio:</strong> una escalera mal fabricada es un riesgo de vida. Priorizá fabricantes certificados.</li>
        <li><strong>3. Ignorar el acabado:</strong> una escalera exterior sin galvanizado se oxida en meses en Lima.</li>
        <li><strong>4. No planificar el montaje:</strong> escaleras de gran altura requieren andamios, permisos y coordinación. Planificá con margen.</li>
        <li><strong>5. No pedir visita técnica:</strong> un buen fabricante visita el lugar antes de cotizar para verificar accesos y anclajes.</li>
      </ul>

      <h2>¿Por qué elegir LUDIER para tu escalera metálica?</h2>

      <p>Más de 10 años fabricando escaleras metálicas para las principales constructoras del Perú:</p>

      <ul>
        <li><strong>Edificio Zendai:</strong> escaleras de emergencia galvanizadas con pasamanos</li>
        <li><strong>Proyecto QANTUA:</strong> escaleras de servicio y acceso a azotea</li>
        <li><strong>Hilton MDP:</strong> escaleras industriales para mantenimiento</li>
        <li><strong>20+ obras entregadas</strong> en Lima Metropolitana</li>
        <li><strong>Fabricación en taller propio</strong> con control dimensional y de soldadura</li>
        <li><strong>Garantía escrita</strong> sobre estructura y acabados</li>
      </ul>

      <p>Si tu proyecto necesita escaleras metálicas — ya sea para emergencia, uso industrial o diseño arquitectónico — <a href="/contacto?servicio=escaleras-metalicas">pedí tu cotización sin compromiso</a>. Te respondemos en menos de 24 horas.</p>

      <h2>Preguntas frecuentes</h2>

      <h3>¿Cuánto tiempo tarda fabricar e instalar una escalera metálica?</h3>
      <p>Escaleras estándar: 1-2 semanas de fabricación + 2-4 días de instalación. Escaleras de emergencia para edificios altos: 3-5 semanas de fabricación + 1-2 semanas de instalación.</p>

      <h3>¿Las escaleras de emergencia necesitan permiso municipal?</h3>
      <p>Sí. En Lima, cualquier escalera de emergencia en fachada requiere autorización municipal. La normativa A.130 es la referencia para el diseño.</p>

      <h3>¿Qué mantenimiento requiere una escalera metálica?</h3>
      <p>Galvanizadas o inoxidables: revisión anual + limpieza. Con pintura: retoque cada 2-3 años en zonas expuestas.</p>

      <h3>¿Pueden instalar en edificios habitados?</h3>
      <p>Sí. La mayoría de nuestras obras son en edificios ocupados. Coordinamos horarios y protegemos las áreas comunes durante el trabajo.</p>

      <h3>¿Ofrecen garantía?</h3>
      <p>Sí. Ofrecemos garantía escrita de 2 años sobre estructura y acabados, y ofrecemos planes de mantenimiento opcional.</p>

      <!-- 👇 LINK BUILDING INTERNO: Blog → Landing B2B (Escaleras metálicas) -->
      <div style="margin-top: 40px; padding: 24px; background-color: #FFF3EC; border-left: 4px solid #FF5A1F;">
        <p style="margin: 0 0 12px 0; font-weight: 600; color: #1E2126;">¿Necesitas cotizar escaleras metálicas para tu obra?</p>
        <p style="margin: 0 0 16px 0; color: #565C63;">Visita nuestra ficha técnica de escaleras metálicas: de emergencia, marineras, industriales y de acceso a azotea.</p>
        <a href="/servicios/escaleras-metalicas" style="display: inline-block; padding: 12px 24px; background-color: #FF5A1F; color: white; text-decoration: none; font-weight: 600; border-radius: 2px;">Ver ficha técnica de escaleras metálicas →</a>
      </div>
    `,
    fecha: "12 de Octubre, 2026",
    fechaISO: "2026-10-12",
    tiempoLectura: "8 min",
    categoria: "Escaleras",
    imagen: "/img/escalerasMetalicas.jpg",
    autor: "Equipo LUDIER",
    autorRol: "Ingeniería y fabricación",
    keywords: [
      "escaleras metálicas",
      "escaleras metálicas lima",
      "escaleras de emergencia",
      "escaleras marineras",
      "escaleras industriales perú",
      "precio escaleras metálicas",
    ],
    metaDescription:
      "Guía completa sobre escaleras metálicas para edificios: tipos, materiales, normativas y precios en Lima 2026. Fabricación certificada por LUDIER.",
  },

  // ============================================================
  // 8. PORTONES METÁLICOS (SEO target principal)
  // ============================================================
  {
    id: 8,
    slug: "portones-metalicos-tipos-precios-guia",
    titulo: "Portones metálicos: tipos, precios y cómo elegir el mejor (2026)",
    extracto:
      "Todo sobre portones metálicos: tipos, materiales, automatización y precios. Guía técnica por LUDIER.",
    contenido: `
      <p>El portón es la primera impresión de cualquier propiedad. No solo cumple una función de seguridad, sino que también define la estética de la fachada. Un portón metálico bien diseñado puede transformar la percepción de un edificio o casa.</p>

      <p>En esta guía te explicamos todo lo que necesitás saber antes de contratar portones metálicos: tipos, materiales, sistemas de automatización, precios de referencia y errores comunes. Basado en más de 10 años fabricando portones para proyectos residenciales, comerciales e industriales en Lima.</p>

      <h2>¿Qué son los portones metálicos y por qué elegirlos?</h2>

      <p>Un portón metálico es una estructura de acero que cierra el acceso principal de una propiedad (casa, edificio, planta industrial, estacionamiento). Se fabrican con perfiles de acero y pueden ser manuales o automatizados.</p>

      <p>Ventajas frente a otros materiales:</p>

      <ul>
        <li><strong>Seguridad:</strong> el acero es el material más resistente a intentos de intrusión</li>
        <li><strong>Durabilidad:</strong> con galvanizado o pintura electrostática, duran décadas</li>
        <li><strong>Diseño personalizable:</strong> desde líneas minimalistas hasta patrones decorativos</li>
        <li><strong>Bajo mantenimiento:</strong> no se astillan, no se hinchan, no se pudren</li>
        <li><strong>Automatización:</strong> se integran fácilmente con sistemas de apertura automática</li>
      </ul>

      <h2>Tipos de portones metálicos</h2>

      <h3>1. Portones corredizos</h3>
      <p>El tipo más común en Lima. Se deslizan horizontalmente sobre rieles o ruedas. Ideales para accesos con espacio lateral disponible. Pueden ser manuales o automatizados con motor y control remoto. Soportan portones de hasta 8 metros de ancho.</p>

      <h3>2. Portones basculantes</h3>
      <p>Se levantan basculando sobre un eje superior. No requieren espacio lateral, ideales para accesos donde no hay lugar para deslizar. Pueden ser de una o dos hojas. Muy usados en cocheras residenciales y estacionamientos comerciales.</p>

      <h3>3. Portones abatibles</h3>
      <p>Se abren hacia adentro o hacia afuera como puertas tradicionales, pero con estructura metálica. Se usan cuando el espacio lateral es amplio. Se automatizan con brazos hidráulicos o motores de eje.</p>

      <h3>4. Portones seccionales</h3>
      <p>Formados por paneles horizontales que se levantan y se pliegan sobre el techo. Ideales para cocheras con altura limitada o donde no hay espacio lateral ni frontal. Muy comunes en edificios modernos.</p>

      <h3>5. Portones automáticos</h3>
      <p>Cualquiera de los tipos anteriores puede automatizarse con:</p>
      <ul>
        <li>Motor de riel (para corredizos)</li>
        <li>Motor de eje (para basculantes y abatibles)</li>
        <li>Control remoto, botonera o app móvil</li>
        <li>Sensores de seguridad y fotocélulas</li>
      </ul>

      <h2>Materiales y acabados</h2>

      <p>El acero es la base. Los tipos más comunes:</p>

      <ul>
        <li><strong>Acero al carbono (A36):</strong> el más usado. Económico y resistente. Requiere acabado protector.</li>
        <li><strong>Acero galvanizado:</strong> con recubrimiento de zinc. Resiste la corrosión por décadas. Ideal para fachadas expuestas.</li>
        <li><strong>Aluminio:</strong> más liviano y sin óxido. Ideal para portones automatizados de gran tamaño.</li>
        <li><strong>Acero inoxidable:</strong> para proyectos premium. No requiere mantenimiento pero es 3-4x más caro.</li>
      </ul>

      <p>Acabados disponibles:</p>

      <ul>
        <li><strong>Pintura electrostática:</strong> el estándar. Colores personalizables, resistente a la intemperie.</li>
        <li><strong>Galvanizado + pintura:</strong> máxima protección para fachadas expuestas a humedad costera.</li>
        <li><strong>Acabado madera (tipo wood):</strong> pintura con textura imitación madera. Estética cálida con durabilidad del acero.</li>
        <li><strong>Acabado forja:</strong> detalles decorativos tipo hierro forjado. Ideal para proyectos residenciales de alta gama.</li>
      </ul>

      <blockquote>En Lima, siempre recomendamos galvanizado + pintura electrostática para portones de fachada. El costo adicional se paga solo con los años sin mantenimiento.</blockquote>

      <h2>Consideraciones de seguridad</h2>

      <p>Un portón metálico debe cumplir con criterios de seguridad:</p>

      <ul>
        <li><strong>Altura mínima:</strong> 1.80 m para residencial, 2.20 m para comercial e industrial</li>
        <li><strong>Estructura reforzada:</strong> perfiles de al menos 2 mm de espesor</li>
        <li><strong>Anclajes sólidos:</strong> al piso y a los muros laterales, con pernos de expansión</li>
        <li><strong>Sistema antipalanca:</strong> para portones corredizos, con guía inferior y superior</li>
        <li><strong>Automatización segura:</strong> con fotocélulas y sensor de obstáculos</li>
      </ul>

      <p>Para portones de gran tamaño o uso industrial, se recomienda consultar con un ingeniero estructural antes de la fabricación.</p>

      <h2>¿Cuánto cuesta un portón metálico en Lima?</h2>

      <p>El precio depende de 5 factores:</p>

      <ul>
        <li><strong>Tipo de portón:</strong> corredizo, basculante, abatible o seccional</li>
        <li><strong>Dimensiones:</strong> se cotiza por metro cuadrado de superficie</li>
        <li><strong>Acabado:</strong> acero negro, galvanizado, inoxidable o con diseño personalizado</li>
        <li><strong>Automatización:</strong> manual o con motor (suma S/ 2,500 - S/ 6,000 según tipo)</li>
        <li><strong>Complejidad del montaje:</strong> instalación estándar o con requerimientos especiales</li>
      </ul>

      <p><strong>Rangos de referencia (2026):</strong></p>

      <ul>
        <li><strong>Portón corredizo estándar (acero negro + pintura):</strong> desde <strong>S/ 380 por m²</strong></li>
        <li><strong>Portón corredizo galvanizado + electrostática:</strong> desde <strong>S/ 520 por m²</strong></li>
        <li><strong>Portón basculante:</strong> desde <strong>S/ 450 por m²</strong></li>
        <li><strong>Portón seccional:</strong> desde <strong>S/ 650 por m²</strong></li>
        <li><strong>Automatización con motor:</strong> desde <strong>S/ 2,500</strong> (depende del peso del portón)</li>
      </ul>

      <p><strong>Referencia orientativa:</strong> un portón corredizo de 4 metros de ancho por 2 metros de alto, galvanizado con pintura electrostática y automatizado con motor, suele estar entre <strong>S/ 6,500 y S/ 9,500</strong> instalado.</p>

      <p>Para darte un precio real y competitivo, necesitamos:</p>
      <ol>
        <li>Dimensiones del vano (ancho x alto)</li>
        <li>Tipo de portón deseado</li>
        <li>Ubicación y accesibilidad del acceso</li>
      </ol>

      <p><a href="/contacto?servicio=puertas-portones">Solicitá tu cotización sin compromiso</a> — te respondemos en menos de 24 horas.</p>

      <h2>Errores comunes al contratar portones metálicos</h2>

      <ul>
        <li><strong>1. No verificar la calidad del acero:</strong> algunos proveedores usan perfiles delgados que se doblan al primer impacto.</li>
        <li><strong>2. Ignorar el acabado para fachada:</strong> un portón exterior sin galvanizado se oxida en meses en Lima.</li>
        <li><strong>3. Elegir automatización barata:</strong> motores económicos fallan en 1-2 años y no tienen repuestos.</li>
        <li><strong>4. No prever el mantenimiento:</strong> los portones automatizados requieren revisión anual (engrase, ajuste de sensores).</li>
        <li><strong>5. No pedir visita técnica:</strong> un buen fabricante mide el vano y verifica el estado del piso antes de cotizar.</li>
      </ul>

      <h2>¿Por qué elegir LUDIER para tu portón metálico?</h2>

      <p>Más de 10 años fabricando portones para proyectos residenciales, comerciales e industriales en Lima:</p>

      <ul>
        <li><strong>Edificio Zendai:</strong> portones de estacionamiento automatizados</li>
        <li><strong>Proyecto QANTUA:</strong> portones corredizos con acabado electrostático</li>
        <li><strong>Más de 50 portones instalados</strong> en Lima Metropolitana</li>
        <li><strong>Fabricación en taller propio</strong> con control dimensional y de soldadura</li>
        <li><strong>Automatización con motores de marcas reconocidas</strong> (Nice, FAAC, Peccinin, PPA)</li>
        <li><strong>Garantía escrita</strong> sobre estructura, acabados y automatización</li>
      </ul>

      <p>Si tenés un proyecto de portón nuevo o querés renovar el existente, <a href="/contacto?servicio=puertas-portones">pedí tu cotización sin compromiso</a>. Te respondemos en menos de 24 horas.</p>

      <h2>Preguntas frecuentes</h2>

      <h3>¿Cuánto tiempo tarda fabricar e instalar un portón metálico?</h3>
      <p>Portones estándar: 1-2 semanas de fabricación + 1-2 días de instalación. Portones con automatización: sumar 3-5 días para integración.</p>

      <h3>¿Se puede automatizar un portón existente?</h3>
      <p>Sí, siempre que la estructura esté en buen estado y sea compatible con el motor. Un técnico debe evaluar el portón antes de la instalación del motor.</p>

      <h3>¿Qué mantenimiento requiere un portón metálico?</h3>
      <p>Portones manuales: revisión anual + retoque de pintura cada 2-3 años. Automatizados: revisión semestral (engrase de rieles, ajuste de sensores).</p>

      <h3>¿Qué garantía ofrecen?</h3>
      <p>Sí. Ofrecemos garantía escrita de 2 años sobre estructura y acabados, y 1 año sobre el motor de automatización (según marca).</p>

      <h3>¿Trabajan con empresas, edificios o solo residencial?</h3>
      <p>Los tres. Fabricamos portones residenciales, comerciales (locales, oficinas) e industriales (plantas, almacenes, naves).</p>

      <!-- 👇 LINK BUILDING INTERNO: Blog → Landing B2B (Puertas y Portones) -->
      <div style="margin-top: 40px; padding: 24px; background-color: #FFF3EC; border-left: 4px solid #FF5A1F;">
        <p style="margin: 0 0 12px 0; font-weight: 600; color: #1E2126;">¿Necesitas cotizar portones metálicos para tu obra?</p>
        <p style="margin: 0 0 16px 0; color: #565C63;">Visita nuestra ficha técnica de puertas, portones y cerramientos: tipos, automatización y precios.</p>
        <a href="/servicios/puertas-portones" style="display: inline-block; padding: 12px 24px; background-color: #FF5A1F; color: white; text-decoration: none; font-weight: 600; border-radius: 2px;">Ver ficha técnica de portones metálicos →</a>
      </div>
    `,
    fecha: "11 de Octubre, 2026",
    fechaISO: "2026-10-11",
    tiempoLectura: "8 min",
    categoria: "Puertas y Portones",
    imagen: "/img/portones.jpeg",
    autor: "Equipo LUDIER",
    autorRol: "Diseño y fabricación",
    keywords: [
      "portones metálicos",
      "portones metálicos lima",
      "portones corredizos",
      "portones automáticos",
      "precio portones metálicos",
      "portones para cochera",
    ],
    metaDescription:
      "Guía completa sobre portones metálicos: tipos, materiales, automatización y precios en Lima 2026. Fabricación certificada por LUDIER.",
  },

  // ============================================================
  // 9. CERCOS PERIMETRALES (SEO target principal)
  // ============================================================
  {
    id: 9,
    slug: "cercos-perimetrales-industrial-guia",
    titulo: "Cercos perimetrales para industrias y constructoras: Guía 2026",
    extracto:
      "Todo sobre cercos perimetrales: tipos, materiales, normativas y precios. Para industrias, constructoras y proyectos residenciales.",
    contenido: `
      <p>Los cercos perimetrales son la primera línea de seguridad de cualquier propiedad industrial, comercial o residencial. En sectores como construcción, minería y manufactura, un cerco bien diseñado no es un lujo: es una necesidad operativa y legal.</p>

      <p>En esta guía te explicamos todo lo que necesitás saber antes de contratar cercos perimetrales: tipos, materiales, normativas y precios de referencia. Basado en más de 10 años fabricando cerramientos para las principales constructoras del Perú.</p>

      <h2>¿Qué son los cercos perimetrales?</h2>

      <p>Los cercos perimetrales son estructuras metálicas que delimitan y protegen un área específica (terreno, planta industrial, obra en construcción). A diferencia de los cercos decorativos, los perimetrales priorizan:</p>

      <ul>
        <li><strong>Seguridad:</strong> impedir el ingreso no autorizado</li>
        <li><strong>Delimitación:</strong> marcar claramente los límites de la propiedad</li>
        <li><strong>Control de acceso:</strong> definir puntos de entrada y salida</li>
        <li><strong>Cumplimiento normativo:</strong> muchas industrias requieren cerco perimetral obligatorio</li>
      </ul>

      <h2>Tipos de cercos perimetrales</h2>

      <h3>1. Cercos de malla electrosoldada</h3>
      <p>El tipo más común para industrias y obras. Se componen de paneles de malla galvanizada sostenidos por postes metálicos. Opciones con o sin alambre de púas superior. Económicos, rápidos de instalar y de larga duración.</p>

      <h3>2. Cercos de rejas metálicas</h3>
      <p>Estructuras de barrotes verticales u horizontales, soldados a marcos de acero. Diseño más robusto que la malla. Se usan en propiedades residenciales de alta gama y algunos sectores industriales que requieren mayor seguridad visual.</p>

      <h3>3. Cercos tipo panel</h3>
      <p>Paneles prefabricados que se atornillan entre postes. Rápida instalación y desmontaje. Ideales para obras temporales o donde se prevé reubicar el cerco.</p>

      <h3>4. Cercos de seguridad industrial</h3>
      <p>Sistemas reforzados para plantas industriales, subestaciones eléctricas, depósitos y áreas de alta seguridad. Incluyen alambre de púas, sensores de intrusión y a veces concertinas.</p>

      <h3>5. Cerramientos temporales para obra</h3>
      <p>Estructuras livianas que se instalan al inicio de la obra y se retiran al final. Se usan para delimitar el perímetro de construcción y proteger a los transeúntes. Regulados por la Norma G.050.</p>

      <h2>Materiales y acabados</h2>

      <p>Los materiales más comunes:</p>

      <ul>
        <li><strong>Acero galvanizado:</strong> el estándar de la industria. Resiste la corrosión por décadas.</li>
        <li><strong>Acero al carbono con pintura:</strong> opción económica para obras temporales.</li>
        <li><strong>Malla electrosoldada galvanizada:</strong> resistente a la intemperie, ideal para industria.</li>
        <li><strong>Aluminio:</strong> liviano y sin óxido. Se usa en aplicaciones específicas.</li>
      </ul>

      <p>Acabados disponibles:</p>

      <ul>
        <li><strong>Galvanizado en caliente:</strong> máxima protección anticorrosiva. Obligatorio para exterior.</li>
        <li><strong>Pintura electrostática:</strong> acabado decorativo sobre galvanizado.</li>
        <li><strong>Pintura epóxica:</strong> para ambientes industriales agresivos.</li>
      </ul>

      <blockquote>En LUDIER, todo cerco perimetral exterior va galvanizado + pintura electrostática como estándar. Es la única forma de garantizar 15+ años sin óxido en la costa limeña.</blockquote>

      <h2>Normativas y requisitos</h2>

      <p>Los cercos perimetrales deben cumplir con:</p>

      <ul>
        <li><strong>Norma G.050 de Seguridad durante la Construcción:</strong> regula cerramientos de obra</li>
        <li><strong>Norma A.130 de Requisitos de Seguridad:</strong> aplica a propiedades de uso público</li>
        <li><strong>Reglamentos sectoriales:</strong> minería (DS 024-2016-EM), industria (D.S. 42-F), energía (subestaciones)</li>
        <li><strong>Reglamentos municipales:</strong> algunos distritos exigen cercos perimetrales en terrenos sin construir</li>
      </ul>

      <p>Requisitos técnicos mínimos de un cerco industrial:</p>

      <ul>
        <li><strong>Altura:</strong> 2.00-3.00 m según tipo de instalación</li>
        <li><strong>Postes:</strong> cada 2.5-3 m, con refuerzos en esquinas</li>
        <li><strong>Cimentación:</strong> dados de concreto para postes</li>
        <li><strong>Alambre superior:</strong> opcional en industrias, obligatorio en instalaciones críticas</li>
        <li><strong>Señalización:</strong> letreros de "prohibido el paso" cada 20 m</li>
      </ul>

      <h2>¿Cuánto cuesta un cerco perimetral en Lima?</h2>

      <p>El precio depende de 4 factores:</p>

      <ul>
        <li><strong>Tipo de cerco:</strong> malla, panel, reja, industrial reforzado</li>
        <li><strong>Altura:</strong> cuanto más alto, mayor cantidad de material</li>
        <li><strong>Metros lineales:</strong> se cotiza por metro lineal instalado</li>
        <li><strong>Acabado:</strong> galvanizado, electrostático o epóxico</li>
      </ul>

      <p><strong>Rangos de referencia (2026):</strong></p>

      <ul>
        <li><strong>Cerco temporal de obra (malla + postes livianos):</strong> desde <strong>S/ 95 por metro lineal</strong></li>
        <li><strong>Cerco de malla electrosoldada galvanizada (2 m):</strong> desde <strong>S/ 180 por metro lineal</strong></li>
        <li><strong>Cerco de rejas metálicas (2 m):</strong> desde <strong>S/ 320 por metro lineal</strong></li>
        <li><strong>Cerco de seguridad industrial (2.5 m + alambre):</strong> desde <strong>S/ 420 por metro lineal</strong></li>
        <li><strong>Cerco tipo panel modular:</strong> desde <strong>S/ 250 por metro lineal</strong></li>
      </ul>

      <p><strong>Referencia orientativa:</strong> un cerco de malla electrosoldada galvanizada de 2 metros de altura para un terreno de 100 metros lineales puede costar entre <strong>S/ 18,000 y S/ 24,000</strong> instalado.</p>

      <p>El precio final depende de: tipo de terreno, accesibilidad, tipo de postes, cantidad de esquinas y portones requeridos.</p>

      <p>Para darte un precio real y competitivo, necesitamos:</p>
      <ol>
        <li>Metros lineales del perímetro</li>
        <li>Tipo de cerco requerido</li>
        <li>Planos o ubicación del terreno</li>
      </ol>

      <p><a href="/contacto?servicio=cercos-cerramientos">Solicitá tu cotización sin compromiso</a> — te respondemos en menos de 24 horas.</p>

      <h2>Errores comunes al contratar cercos perimetrales</h2>

      <ul>
        <li><strong>1. No verificar el galvanizado:</strong> algunos proveedores usan acero pintado que no es galvanizado. Dura 1-2 años vs los 15+ años de un galvanizado real.</li>
        <li><strong>2. Ignorar la cimentación:</strong> los postes sin dados de concreto se aflojan con el tiempo y el cerco se cae.</li>
        <li><strong>3. No prever portones:</strong> todo cerco necesita al menos 1-2 portones de acceso. Si no se cotizan desde el inicio, suman después.</li>
        <li><strong>4. Elegir por precio:</strong> un cerco barato puede ser vulnerado en minutos. Priorizá fabricantes con experiencia en seguridad.</li>
        <li><strong>5. No pedir visita técnica:</strong> el estado del terreno (pendiente, tipo de suelo) afecta la instalación. Un buen fabricante visita antes de cotizar.</li>
      </ul>

      <h2>¿Por qué elegir LUDIER para tu cerco perimetral?</h2>

      <p>Más de 10 años fabricando cercos perimetrales para constructoras, industrias y proyectos residenciales del Perú:</p>

      <ul>
        <li><strong>Proyecto Zendai:</strong> cerco perimetral de obra en La Victoria</li>
        <li><strong>Proyecto QANTUA:</strong> cerramiento temporal y barandas de seguridad</li>
        <li><strong>Hilton MDP:</strong> cerco industrial con sistema de seguridad reforzado</li>
        <li><strong>20+ obras entregadas</strong> en Lima Metropolitana</li>
        <li><strong>Fabricación en taller propio</strong> con control dimensional y de soldadura</li>
        <li><strong>Servicio de instalación y mantenimiento</strong> durante la obra</li>
      </ul>

      <p>Si tu obra o industria necesita cercos perimetrales — ya sea para obra temporal, cerramiento permanente o seguridad reforzada — <a href="/contacto?servicio=cercos-cerramientos">pedí tu cotización sin compromiso</a>. Te respondemos en menos de 24 horas.</p>

      <h2>Preguntas frecuentes</h2>

      <h3>¿Cuánto tiempo tarda instalar un cerco perimetral?</h3>
      <p>Cerco de malla estándar: 100 metros lineales en 5-7 días. Cercos industriales reforzados: 1-2 semanas. Cercos con cimentación especial: sumar 3-5 días.</p>

      <h3>¿Se puede mover un cerco de obra de una ubicación a otra?</h3>
      <p>Sí. Los cercos tipo panel modular están diseñados para desmontarse y reinstalarse. Los cercos de malla fija son más difíciles de mover pero también es posible con planificación.</p>

      <h3>¿Ofrecen mantenimiento durante la obra?</h3>
      <p>Sí. Ofrecemos planes de mantenimiento con visitas periódicas para revisar postes, ajustar paneles y reparar daños.</p>

      <h3>¿Instalan cercos en terrenos con pendiente?</h3>
      <p>Sí. Los postes se adaptan a la pendiente del terreno con anclajes diferenciados. En pendientes muy pronunciadas se usan postes telescópicos o muros de contención.</p>

      <h3>¿Pueden instalar un cerco perimetral con portón incluido?</h3>
      <p>Sí. Fabricamos cerco + portón como solución integral. El portón puede ser manual o automatizado según necesidad.</p>

      <!-- 👇 LINK BUILDING INTERNO: Blog → Landing B2B (Cercos y cerramientos) -->
      <div style="margin-top: 40px; padding: 24px; background-color: #FFF3EC; border-left: 4px solid #FF5A1F;">
        <p style="margin: 0 0 12px 0; font-weight: 600; color: #1E2126;">¿Necesitas cercos perimetrales para tu obra o industria?</p>
        <p style="margin: 0 0 16px 0; color: #565C63;">Visita nuestra ficha técnica de cercos, cerramientos y soluciones para constructoras.</p>
        <a href="/servicios/cercos-cerramientos" style="display: inline-block; padding: 12px 24px; background-color: #FF5A1F; color: white; text-decoration: none; font-weight: 600; border-radius: 2px;">Ver ficha técnica de cercos perimetrales →</a>
      </div>
    `,
    fecha: "10 de Octubre, 2026",
    fechaISO: "2026-10-10",
    tiempoLectura: "8 min",
    categoria: "Cerramientos",
    imagen: "/img/cercosPerimetricos.jpg",
    autor: "Equipo LUDIER",
    autorRol: "Ingeniería y fabricación",
    keywords: [
      "cercos perimetrales",
      "cerco perimetral industrial",
      "cerramiento de obra",
      "malla electrosoldada",
      "cerco para constructoras",
      "precio cerco perimetral",
    ],
    metaDescription:
      "Guía completa sobre cercos perimetrales para industrias y constructoras: tipos, materiales, normativas y precios en Lima 2026. Por LUDIER.",
  },

];

// ============================================================
// HELPERS
// ============================================================

/** Obtener un post por slug */
export function getPostBySlug(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

/** Obtener todos los slugs (para generateStaticParams) */
export function getAllSlugs(): string[] {
  return POSTS.map((p) => p.slug);
}

/** Obtener posts ordenados por fecha (más reciente primero) */
export function getPostsSorted(): BlogPost[] {
  return [...POSTS].sort((a, b) => b.fechaISO.localeCompare(a.fechaISO));
}