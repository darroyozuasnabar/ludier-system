"use client";

import { useEffect, useRef, useState, use, useCallback } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Shield,
  Gauge,
  DoorOpen,
  HardHat,
  Wrench,
  CheckCircle,
  Clock,
  PhoneCall,
  ShieldCheck,
  Users,
  Truck,
  Zap,
  Award,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";

const FONT_DISPLAY = 'var(--font-display, Oswald, ui-sans-serif, sans-serif)';
const FONT_BODY = 'var(--font-body, Inter, ui-sans-serif, system-ui, sans-serif)';
const FONT_MONO = 'var(--font-mono, "JetBrains Mono", ui-monospace, monospace)';

// ============================================================
// TIPOS
// ============================================================

type SubServicio = {
  nombre: string;
  descripcion: string;
  imagenes: string[]; // 🔥 Ahora es un array de imágenes
};

type Categoria = {
  slug: string;
  icon: any;
  title: string;
  description: string;
  subServicios: SubServicio[];
  image: string;
  tag: string;
  beneficios: string[];
};

// ============================================================
// COMPONENTE DE CARRUSEL
// ============================================================

function ImageCarousel({ 
  imagenes, 
  nombre,
  autoplayDelay = 4000 
}: { 
  imagenes: string[]; 
  nombre: string;
  autoplayDelay?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalImages = imagenes.length;
  const isMultiple = totalImages > 1;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  }, [totalImages]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  }, [totalImages]);

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay
  useEffect(() => {
    if (!isMultiple || !isPlaying || isHovering) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(goToNext, autoplayDelay);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isMultiple, isPlaying, isHovering, goToNext, autoplayDelay]);

  // Si solo hay una imagen, mostrarla sin carrusel
  if (!isMultiple) {
    return (
      <div className="relative h-48 overflow-hidden bg-[#14161A]">
        <img
          src={imagenes[0]}
          alt={nombre}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>
    );
  }

  return (
    <div
      className="relative h-48 overflow-hidden bg-[#14161A]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Contenedor de imágenes con transición suave */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {imagenes.map((img, idx) => (
          <div key={idx} className="min-w-full h-full relative flex-shrink-0">
            <img
              src={img}
              alt={`${nombre} - imagen ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Overlay de gradiente */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        ))}
      </div>

      {/* Indicadores de posición (puntos) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {imagenes.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "w-6 bg-[#FF5A1F]"
                : "w-1.5 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Ir a imagen ${idx + 1}`}
          />
        ))}
      </div>

      {/* Controles de navegación */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          goToPrev();
        }}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-all hover:scale-110"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          goToNext();
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-all hover:scale-110"
        aria-label="Siguiente"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Indicador de cuenta (ej: 1/3) */}
      <div className="absolute top-2 right-2 z-10 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-sm">
        {currentIndex + 1} / {totalImages}
      </div>

      {/* Botón de pausa/reproducir */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsPlaying(!isPlaying);
        }}
        className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-all hover:scale-110"
        aria-label={isPlaying ? "Pausar" : "Reproducir"}
      >
        {isPlaying ? (
          <Pause className="h-3.5 w-3.5" />
        ) : (
          <Play className="h-3.5 w-3.5 ml-0.5" />
        )}
      </button>
    </div>
  );
}

// ============================================================
// DATOS DE CATEGORÍAS CON SUB-SERVICIOS ENRIQUECIDOS
// ============================================================

const categorias: Categoria[] = [
  {
    slug: "estructuras-metalicas",
    icon: Building2,
    title: "Estructuras Metálicas",
    description:
      "Diseñamos, fabricamos e instalamos estructuras metálicas para proyectos residenciales, comerciales e industriales, garantizando resistencia, precisión y cumplimiento de los estándares de construcción.",
    image: "/img/estructurasMetalicas.png",
    tag: "11 servicios",
    beneficios: [
      "Resistencia estructural certificada",
      "Acabados anticorrosivos de alta durabilidad",
      "Fabricación con acero de primera calidad",
      "Instalación precisa por técnicos especializados",
    ],
    subServicios: [
      {
        nombre: "Estructuras para azotea",
        descripcion:
          "Fabricamos e instalamos estructuras metálicas para azoteas, diseñadas para soportar cargas y condiciones climáticas extremas. Ideales para instalación de tanques, equipos de aire acondicionado, paneles solares y sistemas de telecomunicaciones.",
        imagenes: ["/img/EstructurasAzotea.png"],
      },
      {
        nombre: "Coberturas metálicas",
        descripcion:
          "Coberturas ligeras y resistentes para techos, estacionamientos, patios y áreas de descanso. Diseñadas con perfiles de acero galvanizado que garantizan durabilidad y protección contra la intemperie.",
        imagenes: ["/img/coberturasMetalicas.jpg"],
      },
      {
        nombre: "Techos metálicos",
        descripcion:
          "Techos metálicos con paneles de alta calidad que ofrecen excelente aislación térmica y acústica. Perfectos para naves industriales, centros comerciales y edificios residenciales.",
        imagenes: ["/img/techosMetalicos.jpg", "/img/techosmetálicos_img2.jpg"],
      },
      {
        nombre: "Marquesinas",
        descripcion:
          "Marquesinas metálicas diseñadas para proteger accesos, entradas de vehículos y zonas de carga. Fabricadas con acero estructural y acabado anticorrosivo, garantizando larga vida útil.",
        imagenes: ["/img/Marquesinas_Metalicas.jpg"],
      },
      {
        nombre: "Plataformas metálicas",
        descripcion:
          "Plataformas de trabajo y acceso, fabricadas con perfiles de acero de alta resistencia. Ideales para mantenimiento industrial, pasarelas de acceso, escaleras de servicio y soporte de equipos.",
        imagenes: ["/img/Plataformas-metalicas.jpg", "/img/Plataformas-metalicas_img2.jpeg"],
      },
      {
        nombre: "Soportes metálicos",
        descripcion:
          "Soportes estructurales para tuberías, ductos, equipos de climatización y sistemas de energía. Diseñados con precisión para garantizar estabilidad y seguridad en cualquier instalación.",
        imagenes: ["/img/SoportesMetalicos.jpg"],
      },
      {
        nombre: "Vigas metálicas",
        descripcion:
          "Vigas de acero estructural para construcciones de gran altura y grandes luces. Fabricadas bajo estrictos controles dimensionales y soldadura certificada.",
        imagenes: ["/img/vigasMetalicas.jpg"],
      },
      {
        nombre: "Estructuras especiales",
        descripcion:
          "Diseñamos soluciones estructurales a medida para proyectos con requisitos particulares: estadios, puentes, pasarelas, pérgolas y elementos arquitectónicos de gran envergadura.",
        imagenes: ["/img/Estructuras_especiales.jpg"],
      },
      {
        nombre: "Estructuras para paneles solares",
        descripcion:
          "Estructuras metálicas diseñadas específicamente para el montaje de paneles solares, optimizando la inclinación y orientación para máxima eficiencia energética.",
        imagenes: ["/img/estructuraPanelesSolares.png"],
      },
      {
        nombre: "Cuartos metálicos para equipos",
        descripcion:
          "Cuartos modulares metálicos para alojar equipos eléctricos, bombas, generadores y sistemas de climatización. Ofrecen protección contra agentes externos y fácil acceso para mantenimiento.",
        imagenes: ["/img/cuartosMetalicos.jpg"],
      },
      {
        nombre: "Jaulas metálicas",
        descripcion:
          "Jaulas de seguridad para almacenamiento de materiales, protección de equipos y resguardo de áreas sensibles. Fabricadas con malla electrosoldada y perfiles de acero de alta resistencia.",
        imagenes: [
          "/img/Jaulas_metálicas.jpg",
          "/img/Jaulas_metálicas_img2.png",
          "/img/Jaulas_metálicas_img3.jpg",
        ],
      },
    ],
  },
  {
    slug: "barandas-pasamanos",
    icon: Shield,
    title: "Barandas y Pasamanos",
    description:
      "Fabricación e instalación de sistemas de protección y circulación metálica para edificios, condominios, centros comerciales e industrias.",
    image: "/img/barandaBalcones.jpg",
    tag: "8 servicios",
    beneficios: [
      "Diseño personalizado según proyecto",
      "Acabados gloss mate, epóxicos y electrostáticos",
      "Instalación con anclajes de alta resistencia",
      "Cumplimiento de normas de seguridad",
    ],
    subServicios: [
      {
        nombre: "Barandas metálicas",
        descripcion:
          "Barandas de seguridad y decorativas fabricadas con acero de alta calidad, ideales para balcones, escaleras, terrazas y pasarelas.",
        imagenes: ["/img/barandaBalcones.jpg"],
      },
      {
        nombre: "Barandas para balcones",
        descripcion:
          "Diseñamos barandas para balcones que combinan seguridad y estética, con acabados de alta calidad y resistencia a la intemperie.",
        imagenes: ["/img/barandaBalcones.jpg"],
      },
      {
        nombre: "Barandas de escaleras",
        descripcion:
          "Barandas para escaleras interiores y exteriores, fabricadas con perfiles de acero y acabados profesionales que garantizan durabilidad.",
        imagenes: ["/img/barandaBalcones.jpg"],
      },
      {
        nombre: "Barandas de azotea",
        descripcion:
          "Barandas de protección para azoteas, diseñadas para cumplir con las normativas de seguridad en alturas, con acabados anticorrosivos.",
        imagenes: ["/img/barandaBalcones.jpg"],
      },
      {
        nombre: "Barandas de seguridad",
        descripcion:
          "Soluciones de barandas de seguridad para áreas industriales, comerciales y residenciales, con diseño robusto y alta resistencia.",
        imagenes: ["/img/barandaBalcones.jpg"],
      },
      {
        nombre: "Pasamanos metálicos",
        descripcion:
          "Pasamanos metálicos para escaleras, rampas y pasillos, con diseño ergonómico y acabados de alta calidad.",
        imagenes: ["/img/barandaBalcones.jpg"],
      },
      {
        nombre: "Pasamanos para escaleras de emergencia",
        descripcion:
          "Pasamanos especiales para escaleras de emergencia, diseñados para evacuación rápida y segura.",
        imagenes: ["/img/barandaBalcones.jpg"],
      },
      {
        nombre: "Pasamanos adosados a muro",
        descripcion:
          "Pasamanos fijados directamente a muros, ideales para rampas, pasillos y áreas de circulación.",
        imagenes: ["/img/barandaBalcones.jpg"],
      },
    ],
  },
  {
    slug: "escaleras-metalicas",
    icon: Gauge,
    title: "Escaleras Metálicas",
    description:
      "Fabricamos soluciones metálicas para acceso, circulación y evacuación, adaptadas a cada proyecto y normativa.",
    image: "/img/escaleras-de-emergencia.jpg",
    tag: "6 servicios",
    beneficios: [
      "Diseño estructural certificado",
      "Pasamanos y barandas integradas",
      "Acabado profesional con pintura electrostática",
      "Instalación en obra por técnicos especializados",
    ],
    subServicios: [
      {
        nombre: "Escaleras metálicas",
        descripcion:
          "Fabricamos escaleras metálicas para todo tipo de proyectos, con diseño estructural y acabados de alta calidad.",
        imagenes: ["/img/escaleras-de-emergencia.jpg"],
      },
      {
        nombre: "Escaleras de emergencia",
        descripcion:
          "Escaleras de evacuación diseñadas para cumplir con las normativas de seguridad, con pasamanos integrados.",
        imagenes: ["/img/escaleras-de-emergencia.jpg"],
      },
      {
        nombre: "Escaleras marineras",
        descripcion:
          "Escaleras marineras para acceso a espacios confinados y áreas técnicas, fabricadas con perfiles de acero robustos.",
        imagenes: ["/img/escaleras-de-emergencia.jpg"],
      },
      {
        nombre: "Escaleras industriales",
        descripcion:
          "Escaleras industriales para plantas de producción, almacenes y naves, con diseño ergonómico y alta resistencia.",
        imagenes: ["/img/escaleras-de-emergencia.jpg"],
      },
      {
        nombre: "Plataformas con escaleras",
        descripcion:
          "Plataformas de acceso con escaleras integradas, ideales para mantenimiento de equipos y áreas elevadas.",
        imagenes: ["/img/escaleras-de-emergencia.jpg"],
      },
      {
        nombre: "Accesos técnicos",
        descripcion:
          "Soluciones de acceso para espacios técnicos, cuartos de máquinas y áreas de servicio.",
        imagenes: ["/img/escaleras-de-emergencia.jpg"],
      },
    ],
  },
  // Las demás categorías (puertas-portones, constructoras, fabricacion-medida)
  // las mantengo con una sola imagen por ahora, pero puedes actualizarlas
];

// ============================================================
// COMPONENTES
// ============================================================

function CornerMarks({ active = false }: { active?: boolean }) {
  const base = "pointer-events-none absolute h-3 w-3 transition-all duration-500";
  const border = active
    ? "border-[#FF5A1F] opacity-100"
    : "border-[#3A3F45] opacity-50";
  return (
    <>
      <span className={`${base} left-3 top-3 border-l-2 border-t-2 ${border}`} />
      <span className={`${base} right-3 top-3 border-r-2 border-t-2 ${border}`} />
      <span className={`${base} bottom-3 left-3 border-b-2 border-l-2 ${border}`} />
      <span className={`${base} bottom-3 right-3 border-b-2 border-r-2 ${border}`} />
    </>
  );
}

function useScrollReveal<T extends HTMLElement>(threshold = 0.12) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold, rootMargin: "-60px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// ============================================================
// PÁGINA DE DETALLE
// ============================================================

export default function ServicioDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();

  const categoria = categorias.find((c) => c.slug === slug);

  if (!categoria) {
    notFound();
  }

  const Icon = categoria.icon;
  const { ref: heroRef, inView: heroInView } = useScrollReveal<HTMLDivElement>(0.1);
  const { ref: gridRef, inView: gridInView } = useScrollReveal<HTMLDivElement>(0.1);
  const { ref: ctaRef, inView: ctaInView } = useScrollReveal<HTMLDivElement>(0.1);

  // Verificar si los sub-servicios tienen el formato con imágenes
  const isRichSubServicios = categoria.subServicios.length > 0 && 
    typeof categoria.subServicios[0] === 'object' && 
    'imagenes' in categoria.subServicios[0];

  return (
    <div className="min-h-screen bg-[#F7F7F4]" style={{ fontFamily: FONT_BODY }}>

      {/* ============================================================
          HERO - DETALLE DE CATEGORÍA
          ============================================================ */}
      <section className="relative overflow-hidden bg-[#14161A] py-24 lg:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[url('/img/grid-pattern.svg')] bg-repeat" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, #C7CBD1 0px, #C7CBD1 1px, transparent 1px, transparent 64px)",
          }}
        />
        <div
          className="pointer-events-none absolute -left-32 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #FF5A1F 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-[4px]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #FF5A1F 0px, #FF5A1F 14px, #14161A 14px, #14161A 28px)",
          }}
        />

        <div
          ref={heroRef}
          className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          style={{
            opacity: heroInView ? 1 : 0,
            transform: heroInView ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 text-sm text-[#8A8F96] hover:text-[#FF5A1F] transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a servicios
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span
                className="inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.22em] text-[#8A8F96]"
                style={{ fontFamily: FONT_MONO }}
              >
                <span className="h-px w-6 bg-[#FF5A1F]" />
                {categoria.tag}
              </span>
              <h1
                className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                {categoria.title}
              </h1>
              <p className="mt-4 text-lg text-[#9AA0A6] leading-relaxed">
                {categoria.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {categoria.beneficios.slice(0, 2).map((beneficio, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 text-xs text-[#8A8F96] bg-[#1D2024] px-3 py-1.5 rounded-sm border border-[#3A3F45]"
                  >
                    <CheckCircle className="h-3 w-3 text-[#FF5A1F]" />
                    {beneficio}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={`/contacto?servicio=${categoria.slug}`}
                  className="inline-flex items-center gap-2 bg-[#FF5A1F] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#FF5A1F]/20 transition-all hover:bg-[#FF7A44] hover:shadow-[#FF5A1F]/40 hover:-translate-y-1"
                >
                  <PhoneCall className="h-4 w-4" />
                  Cotizar este servicio
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-[#3A3F45] bg-[#1D2024]">
                <img
                  src={categoria.image}
                  alt={categoria.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[#FF5A1F]/20 border border-[#FF5A1F]/30">
                      <Icon className="h-6 w-6 text-[#FF5A1F]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{categoria.title}</p>
                      <p className="text-xs text-white/60">{categoria.tag}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SUB-SERVICIOS CON CARRUSEL DE IMÁGENES
          ============================================================ */}
      <section className="py-20 lg:py-28">
        <div
          ref={gridRef}
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          style={{
            opacity: gridInView ? 1 : 0,
            transform: gridInView ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div className="text-center mb-14">
            <span
              className="inline-block text-xs font-medium uppercase tracking-[0.2em] text-[#8B8F86] px-3 py-1 border border-[#E3E1D8]"
              style={{ fontFamily: FONT_MONO }}
            >
              Servicios incluidos
            </span>
            <h2
              className="mt-4 text-3xl font-semibold text-[#1E2126] sm:text-4xl"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              Todo lo que ofrecemos en{" "}
              <span className="text-[#FF5A1F]">{categoria.title}</span>
            </h2>
            <p className="mt-3 text-[#565C63] max-w-2xl mx-auto">
              Conoce la lista completa de servicios que ofrecemos dentro de esta
              categoría.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isRichSubServicios ? (
              // 🔥 Renderizado con carrusel de imágenes
              (categoria.subServicios as SubServicio[]).map((sub, index) => (
                <div
                  key={index}
                  className="group relative bg-white border border-[#E3E1D8] rounded-sm overflow-hidden transition-all duration-500 hover:border-[#FF5A1F]/30 hover:shadow-xl hover:-translate-y-2"
                  style={{
                    opacity: gridInView ? 1 : 0,
                    transform: gridInView ? "translateY(0)" : "translateY(30px)",
                    transition: `opacity 600ms cubic-bezier(0.16,1,0.3,1) ${index * 100}ms, transform 600ms cubic-bezier(0.16,1,0.3,1) ${index * 100}ms`,
                  }}
                >
                  <CornerMarks />
                  
                  {/* 🔥 Carrusel de imágenes */}
                  <ImageCarousel 
                    imagenes={sub.imagenes} 
                    nombre={sub.nombre}
                    autoplayDelay={4500}
                  />

                  <div className="p-5">
                    <h3
                      className="text-base font-semibold text-[#1E2126]"
                      style={{ fontFamily: FONT_DISPLAY }}
                    >
                      {sub.nombre}
                    </h3>
                    <p className="mt-2 text-sm text-[#565C63] leading-relaxed">
                      {sub.descripcion}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              // Renderizado simple (para categorías sin imágenes múltiples)
              (categoria.subServicios as any[]).map((sub, index) => (
                <div
                  key={index}
                  className="group relative flex items-start gap-4 p-4 bg-white border border-[#E3E1D8] rounded-sm transition-all hover:border-[#FF5A1F]/30 hover:shadow-md"
                  style={{
                    opacity: gridInView ? 1 : 0,
                    transform: gridInView ? "translateY(0)" : "translateY(30px)",
                    transition: `opacity 600ms cubic-bezier(0.16,1,0.3,1) ${index * 100}ms, transform 600ms cubic-bezier(0.16,1,0.3,1) ${index * 100}ms`,
                  }}
                >
                  <CornerMarks />
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-[#FF5A1F]/10 border border-[#FF5A1F]/20">
                    <CheckCircle className="h-4 w-4 text-[#FF5A1F]" />
                  </div>
                  <div>
                    <h3
                      className="text-sm font-semibold text-[#1E2126]"
                      style={{ fontFamily: FONT_DISPLAY }}
                    >
                      {typeof sub === 'string' ? sub : sub.nombre}
                    </h3>
                    <p className="text-xs text-[#8B8F86] mt-0.5">
                      Solución metalmecánica profesional
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ============================================================
          BENEFICIOS DESTACADOS CON ANIMACIÓN
          ============================================================ */}
      <section className="bg-[#14161A] py-20 lg:py-28 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[url('/img/grid-pattern.svg')] bg-repeat" />
        <div
          className="pointer-events-none absolute -right-32 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #FF5A1F 0%, transparent 70%)" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span
              className="inline-block text-xs font-medium uppercase tracking-[0.2em] text-[#8A8F96] px-3 py-1 border border-[#3A3F45]"
              style={{ fontFamily: FONT_MONO }}
            >
              Ventajas competitivas
            </span>
            <h2
              className="mt-4 text-3xl font-semibold text-white sm:text-4xl"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              ¿Por qué elegirnos para{" "}
              <span className="text-[#FF5A1F]">{categoria.title.toLowerCase()}</span>?
            </h2>
            <p className="mt-3 text-[#9AA0A6] max-w-2xl mx-auto">
              Estas son las razones por las que las principales constructoras
              confían en LUDIER.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categoria.beneficios.map((beneficio, index) => {
              const iconMap = {
                0: ShieldCheck,
                1: Truck,
                2: Users,
                3: Zap,
              };
              const IconComp = iconMap[index as keyof typeof iconMap] || ShieldCheck;
              return (
                <div
                  key={index}
                  className="group relative bg-[#1D2024] border border-[#3A3F45] p-6 rounded-sm transition-all duration-500 hover:border-[#FF5A1F]/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#FF5A1F]/5"
                  style={{
                    opacity: gridInView ? 1 : 0,
                    transform: gridInView ? "translateY(0)" : "translateY(30px)",
                    transition: `opacity 600ms cubic-bezier(0.16,1,0.3,1) ${(index + 1) * 150}ms, transform 600ms cubic-bezier(0.16,1,0.3,1) ${(index + 1) * 150}ms`,
                  }}
                >
                  <CornerMarks />
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm bg-[#FF5A1F]/10 border border-[#FF5A1F]/20">
                    <IconComp className="h-6 w-6 text-[#FF5A1F]" />
                  </div>
                  <h3
                    className="text-base font-semibold text-white"
                    style={{ fontFamily: FONT_DISPLAY }}
                  >
                    {beneficio}
                  </h3>
                  <p className="mt-2 text-xs text-[#8A8F96]">Garantizado en cada proyecto</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA FINAL
          ============================================================ */}
      <section className="bg-white py-20 lg:py-28">
        <div
          ref={ctaRef}
          className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8"
          style={{
            opacity: ctaInView ? 1 : 0,
            transform: ctaInView ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <span
            className="inline-block text-xs font-medium uppercase tracking-[0.2em] text-[#8B8F86] px-3 py-1 border border-[#E3E1D8]"
            style={{ fontFamily: FONT_MONO }}
          >
            Tu próximo proyecto
          </span>
          <h2
            className="mt-5 text-4xl font-semibold text-[#1E2126] sm:text-5xl"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            ¿Necesitas <span className="text-[#FF5A1F]">{categoria.title}</span>?
            <br />
            Cotiza sin compromiso
          </h2>
          <p className="mt-4 text-lg text-[#565C63] max-w-2xl mx-auto">
            Recibe una respuesta en menos de 24 horas. Te ayudamos a definir la
            mejor solución para tu proyecto.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={`/contacto?servicio=${categoria.slug}`}
              className="group inline-flex items-center gap-2 bg-[#FF5A1F] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#FF5A1F]/20 transition-all hover:bg-[#FF7A44] hover:shadow-[#FF5A1F]/40 hover:-translate-y-1"
            >
              <PhoneCall className="h-4 w-4" />
              Cotizar {categoria.title}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/proyectos"
              className="group inline-flex items-center gap-2 border border-[#E3E1D8] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-[#1E2126] transition-all hover:border-[#FF5A1F] hover:text-[#FF5A1F]"
            >
              Ver proyectos relacionados
            </Link>
          </div>

          <div className="mt-8 flex justify-center gap-6 text-xs text-[#8B8F86]">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Respuesta en 24h
            </span>
            <span className="text-[#E3E1D8]">|</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              Cotización sin compromiso
            </span>
            <span className="text-[#E3E1D8]">|</span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Asesoría personalizada
            </span>
          </div>
        </div>
      </section>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          section * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}