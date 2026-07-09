"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  MapPin,
  Users,
  CheckCircle,
  ArrowRight,
  X,
  Wrench,
  Shield,
  Home,
  Briefcase,
  Factory,
  Calendar,
  Award,
  PhoneCall,
  ExternalLink,
} from "lucide-react";

// ============================================================
// TIPOGRAFÍAS
// ============================================================
const FONT_DISPLAY = 'var(--font-display, Oswald, ui-sans-serif, sans-serif)';
const FONT_BODY = 'var(--font-body, Inter, ui-sans-serif, system-ui, sans-serif)';
const FONT_MONO = 'var(--font-mono, "JetBrains Mono", ui-monospace, monospace)';

// ============================================================
// TIPOS Y DATOS (EXPORTADOS)
// ============================================================
export type Proyecto = {
  id: number;
  slug: string; // NUEVO
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
    cliente: "Desarrollo Inmobiliario FG S.A.C.",
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
  // ... (todos los demás proyectos con slug)
  // Asegúrate de agregar slug a todos
];

// ============================================================
// COLORES Y BADGES POR CATEGORÍA
// ============================================================
const categoriaEstilos = {
  residencial: {
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    border: "border-blue-500/30",
    icon: Home,
  },
  comercial: {
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    border: "border-purple-500/30",
    icon: Briefcase,
  },
  industrial: {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    border: "border-amber-500/30",
    icon: Factory,
  },
};

// ============================================================
// COMPONENTE CornerMarks
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

// ============================================================
// HOOK useScrollReveal (animación única y suave)
// ============================================================
function useScrollReveal<T extends HTMLElement>(threshold = 0.12) {
  const ref = useRef<T | null>(null);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasBeenVisible) {
          setHasBeenVisible(true);
        }
      },
      { threshold, rootMargin: "-60px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, hasBeenVisible]);

  return { ref, inView: hasBeenVisible };
}

// ============================================================
// MODAL MEJORADO (con animación y botón a detalle)
// ============================================================
const ModalProyecto = ({
  proyecto,
  onClose,
}: {
  proyecto: Proyecto | null;
  onClose: () => void;
}) => {
  const router = useRouter();
  if (!proyecto) return null;
  const CatIcon = categoriaEstilos[proyecto.categoria].icon;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleVerCompleto = () => {
    onClose();
    router.push(`/proyectos/${proyecto.slug}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-[#1D2024] border border-[#3A3F45] rounded-sm max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "modalEnter 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        <CornerMarks active />

        {/* Cabecera con gradiente */}
        <div className="sticky top-0 flex justify-between items-start p-6 bg-gradient-to-r from-[#FF5A1F] to-[#D94A14] text-white z-10 rounded-t-sm">
          <h3
            className="text-2xl font-semibold pr-8"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            {proyecto.titulo}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-sm transition-colors shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Imagen más grande */}
          <div className="relative h-80 rounded-sm overflow-hidden border border-[#3A3F45]">
            <img
              src={proyecto.imagen}
              alt={proyecto.titulo}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-sm">
              <CatIcon className="w-4 h-4 text-white" />
              <span className="text-white text-xs font-semibold uppercase tracking-wider">
                {proyecto.categoria}
              </span>
            </div>
          </div>

          {/* Cliente y ubicación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#14161A] p-4 rounded-sm border border-[#3A3F45]">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-[#FF5A1F] mt-0.5" />
              <div>
                <p
                  className="text-xs text-[#8A8F96] uppercase tracking-wider"
                  style={{ fontFamily: FONT_MONO }}
                >
                  Cliente
                </p>
                <p className="font-medium text-white">{proyecto.cliente}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#FF5A1F] mt-0.5" />
              <div>
                <p
                  className="text-xs text-[#8A8F96] uppercase tracking-wider"
                  style={{ fontFamily: FONT_MONO }}
                >
                  Ubicación
                </p>
                <p className="font-medium text-white">{proyecto.ubicacion}</p>
              </div>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <p
              className="text-sm font-semibold text-[#C7CBD1] mb-3 flex items-center gap-2"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              <Wrench className="w-5 h-5 text-[#FF5A1F]" /> Servicios ejecutados
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {proyecto.servicios.map((servicio, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-[#9AA0A6] bg-[#14161A] p-2 rounded-sm border border-[#3A3F45]"
                >
                  <CheckCircle className="w-4 h-4 text-[#FF5A1F] shrink-0 mt-0.5" />
                  <span>{servicio}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Resultado */}
          <div className="bg-[#14161A] p-4 rounded-sm border border-[#3A3F45]">
            <p
              className="text-sm font-semibold text-[#C7CBD1] mb-1 flex items-center gap-2"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              <Shield className="w-5 h-5 text-[#FF5A1F]" /> Resultado
            </p>
            <p className="text-[#9AA0A6] leading-relaxed">{proyecto.resultado}</p>
          </div>

          {/* Botón para ver proyecto completo */}
          <button
            onClick={handleVerCompleto}
            className="w-full flex items-center justify-center gap-2 bg-[#FF5A1F] py-3 text-sm font-semibold uppercase tracking-wide text-white transition-all hover:bg-[#FF7A44]"
          >
            <ExternalLink className="w-4 h-4" />
            Ver proyecto completo
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalEnter {
          0% {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};


// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function Proyectos() {
  const [filtro, setFiltro] = useState<string>("todos");
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<Proyecto | null>(
    null
  );
  const { ref: heroRef, inView: heroInView } = useScrollReveal<HTMLDivElement>(0.1);
  const { ref: gridRef, inView: gridInView } = useScrollReveal<HTMLDivElement>(0.1);
  const { ref: ctaRef, inView: ctaInView } = useScrollReveal<HTMLDivElement>(0.1);

  const categorias = [
    { key: "todos", label: "Todos", icon: null },
    { key: "residencial", label: "Residencial", icon: Home },
    { key: "comercial", label: "Comercial", icon: Briefcase },
    { key: "industrial", label: "Industrial", icon: Factory },
  ];

  const proyectosFiltrados =
    filtro === "todos"
      ? proyectosData
      : proyectosData.filter((p) => p.categoria === filtro);

  const stats = [
    { value: "20+", label: "Proyectos ejecutados", icon: Building2 },
    { value: "20+", label: "Clientes confían en nosotros", icon: Users },
    { value: "10+", label: "Años de experiencia", icon: Calendar },
    { value: "100%", label: "Satisfacción garantizada", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F4]" style={{ fontFamily: FONT_BODY }}>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#14161A] py-28 lg:py-36">
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[url('/img/grid-pattern.svg')] bg-repeat" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, #C7CBD1 0px, #C7CBD1 1px, transparent 1px, transparent 64px)",
          }}
        />
        <div
          className="pointer-events-none absolute -left-32 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full opacity-[0.08]"
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
            transition:
              "opacity 900ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div className="max-w-3xl">
            <span
              className="inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.22em] text-[#8A8F96]"
              style={{ fontFamily: FONT_MONO }}
            >
              <span className="h-px w-6 bg-[#FF5A1F]" />
              Nuestros proyectos
            </span>
            <h1
              className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              Obras que
              <br />
              <span className="relative inline-block">
                <span className="text-[#FF5A1F]">construyen</span>
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#FF5A1F]/30 rounded-full blur-sm" />
              </span>
              <br />
              confianza
            </h1>
            <p className="mt-6 text-lg text-[#9AA0A6] max-w-xl leading-relaxed">
              Conoce los proyectos más destacados en los que hemos participado,
              desde grandes edificios hasta soluciones personalizadas.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 bg-[#FF5A1F] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#FF5A1F]/20 transition-all hover:bg-[#FF7A44] hover:shadow-[#FF5A1F]/40 hover:-translate-y-1"
              >
                <PhoneCall className="h-4 w-4" />
                Cotizar ahora
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-xs text-[#8A8F96]">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-[#FF5A1F]" />
                Más de 10 años de experiencia
              </span>
              <span className="text-[#3A3F45]">|</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-[#FF5A1F]" />
                40+ proyectos ejecutados
              </span>
              <span className="text-[#3A3F45]">|</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-[#FF5A1F]" />
                95% cumplimiento de plazos
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ESTADÍSTICAS */}
      <section className="py-12 bg-white border-b border-[#E3E1D8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="flex flex-col items-center p-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[#FF5A1F]/10 border border-[#FF5A1F]/20">
                    <Icon className="h-6 w-6 text-[#FF5A1F]" />
                  </div>
                  <p
                    className="mt-3 text-2xl font-semibold text-[#1E2126]"
                    style={{ fontFamily: FONT_DISPLAY }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-sm text-[#565C63]">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FILTROS Y GRID */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Filtros */}
          <div
            ref={gridRef}
            className="flex flex-wrap justify-center gap-3 mb-12"
            style={{
              opacity: gridInView ? 1 : 0,
              transform: gridInView ? "translateY(0)" : "translateY(20px)",
              transition:
                "opacity 900ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {categorias.map((cat) => {
              const Icon = cat.icon;
              const isActive = filtro === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setFiltro(cat.key)}
                  className={`flex items-center gap-2 px-5 py-2 text-xs font-medium uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-[#FF5A1F] text-white shadow-lg shadow-[#FF5A1F]/30"
                      : "bg-white text-[#565C63] border border-[#E3E1D8] hover:border-[#FF5A1F]/40 hover:bg-[#F7F7F4]"
                  }`}
                  style={{ fontFamily: FONT_MONO }}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Grid con animación individual por tarjeta */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {proyectosFiltrados.map((proyecto, index) => {
              const CatIcon = categoriaEstilos[proyecto.categoria].icon;
              const [cardVisible, setCardVisible] = useState(false);
              const cardRef = useRef<HTMLDivElement>(null);

              useEffect(() => {
                const observer = new IntersectionObserver(
                  ([entry]) => {
                    if (entry.isIntersecting && !cardVisible) {
                      setCardVisible(true);
                    }
                  },
                  { threshold: 0.1, rootMargin: "-40px 0px -40px 0px" }
                );
                if (cardRef.current) observer.observe(cardRef.current);
                return () => observer.disconnect();
              }, [cardVisible]);

              return (
                <div
                  key={proyecto.id}
                  ref={cardRef}
                  className="group relative bg-white border border-[#E3E1D8] rounded-sm overflow-hidden cursor-pointer transition-all hover:border-[#FF5A1F]/40 hover:shadow-xl hover:-translate-y-2"
                  onClick={() => setProyectoSeleccionado(proyecto)}
                  style={{
                    opacity: cardVisible ? 1 : 0,
                    transform: cardVisible ? "translateY(0)" : "translateY(30px)",
                    transition: `opacity 800ms cubic-bezier(0.16,1,0.3,1) ${index * 100}ms, transform 800ms cubic-bezier(0.16,1,0.3,1) ${index * 100}ms`,
                  }}
                >
                  <CornerMarks />

                  <div className="relative h-56 overflow-hidden bg-[#14161A]">
                    <img
                      src={proyecto.imagen}
                      alt={proyecto.titulo}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-sm">
                      <CatIcon className="w-3 h-3 text-white" />
                      <span
                        className="text-[10px] font-medium text-white uppercase tracking-wider"
                        style={{ fontFamily: FONT_MONO }}
                      >
                        {proyecto.categoria}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3
                      className="text-lg font-semibold text-[#1E2126] line-clamp-1 group-hover:text-[#FF5A1F] transition-colors"
                      style={{ fontFamily: FONT_DISPLAY }}
                    >
                      {proyecto.titulo}
                    </h3>
                    <p className="text-sm text-[#565C63] flex items-center gap-1 mt-1 mb-3">
                      <Building2 className="w-4 h-4" />
                      {proyecto.cliente}
                    </p>
                    <p className="text-sm text-[#8B8F86] flex items-center gap-1 mb-4">
                      <MapPin className="w-4 h-4 text-[#FF5A1F]" />
                      {proyecto.ubicacion}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#FF5A1F] flex items-center gap-1 group-hover:gap-2 transition-all">
                        Ver detalles <ArrowRight className="w-4 h-4" />
                      </span>
                      <span className="text-[10px] text-[#8B8F86] bg-[#F7F7F4] px-3 py-1 rounded-sm border border-[#E3E1D8]">
                        {proyecto.servicios.length} servicios
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {proyectosFiltrados.length === 0 && (
            <p className="text-center text-[#565C63] py-10">No hay proyectos en esta categoría.</p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16 lg:py-20 border-t border-[#E3E1D8]">
        <div
          ref={ctaRef}
          className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8"
          style={{
            opacity: ctaInView ? 1 : 0,
            transform: ctaInView ? "translateY(0)" : "translateY(20px)",
            transition:
              "opacity 900ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <h2
            className="text-3xl font-semibold text-[#1E2126]"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            ¿Tienes un proyecto en mente?
          </h2>
          <p className="mt-3 text-[#565C63] max-w-xl mx-auto">
            Cuéntanos qué necesitas y te ayudaremos a encontrar la mejor solución
            metalmecánica para tu proyecto.
          </p>
          <Link
            href="/contacto"
            className="mt-6 inline-flex items-center gap-2 bg-[#FF5A1F] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#FF5A1F]/20 transition-all hover:bg-[#FF7A44] hover:shadow-[#FF5A1F]/40 hover:-translate-y-1"
          >
            <PhoneCall className="h-4 w-4" />
            Cotizar ahora
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="mt-4 flex justify-center gap-4 text-xs text-[#8B8F86]">
            <span>✓ Respuesta en 24h</span>
            <span>✓ Cotización sin compromiso</span>
            <span>✓ Asesoría personalizada</span>
          </div>
        </div>
      </section>

      {/* MODAL MEJORADO */}
      {proyectoSeleccionado && (
        <ModalProyecto
          proyecto={proyectoSeleccionado}
          onClose={() => setProyectoSeleccionado(null)}
        />
      )}

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          section * {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}