// components/public/Blog.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle,
  Users,
  BookOpen,
  TrendingUp,
} from "lucide-react";

const FONT_DISPLAY = 'var(--font-display, Oswald, ui-sans-serif, sans-serif)';
const FONT_BODY = 'var(--font-body, Inter, ui-sans-serif, system-ui, sans-serif)';
const FONT_MONO = 'var(--font-mono, "JetBrains Mono", ui-monospace, monospace)';

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

// ✅ POSTS CON CONTENIDO Y AUTOR PARA LA PÁGINA DE DETALLE
const posts = [
  {
    id: 1,
    titulo: "Beneficios de las estructuras metálicas en proyectos residenciales",
    extracto:
      "Descubre por qué las estructuras metálicas son la mejor opción para edificaciones modernas y duraderas.",
    contenido: `
      <p>Las estructuras metálicas han revolucionado la construcción residencial en los últimos años. Su versatilidad, resistencia y durabilidad las convierten en la opción preferida por arquitectos e ingenieros.</p>
      <h2>Ventajas principales</h2>
      <ul>
        <li><strong>Resistencia estructural:</strong> El acero ofrece una relación resistencia-peso excepcional, permitiendo diseños más audaces y espacios abiertos.</li>
        <li><strong>Rapidez de construcción:</strong> La prefabricación en taller reduce los tiempos de obra hasta un 40% en comparación con sistemas tradicionales.</li>
        <li><strong>Sostenibilidad:</strong> El acero es 100% reciclable y los procesos de fabricación modernos reducen significativamente la huella de carbono.</li>
        <li><strong>Flexibilidad arquitectónica:</strong> Permite crear espacios sin columnas intermedias, ideal para diseños modernos y abiertos.</li>
      </ul>
      <p>En LUDIER, hemos desarrollado estructuras metálicas para proyectos residenciales de todos los tamaños, desde viviendas unifamiliares hasta edificios de 28 pisos como el proyecto Zendai en La Victoria.</p>
      <p>Nuestro equipo de ingeniería trabaja con software de última generación para garantizar la precisión y seguridad de cada estructura.</p>
    `,
    fecha: "15 de Junio, 2024",
    tiempoLectura: "5 min",
    categoria: "Estructuras",
    imagen: "/img/BeneficiosEstructurasMetalicas.jpg",
    slug: "beneficios-estructuras-metalicas",
    autor: "Ing. Carlos Mendoza",
  },
  {
    id: 2,
    titulo: "Seguridad en obras de construcción: Buenas prácticas",
    extracto:
      "Conoce las medidas de seguridad más importantes para proteger a tu equipo en proyectos de construcción vertical.",
    contenido: `
      <p>La seguridad en obras de construcción es un aspecto crítico que no puede ser descuidado. En LUDIER, hemos implementado protocolos rigurosos que han reducido los incidentes en un 85% en nuestros proyectos.</p>
      <h2>Medidas esenciales</h2>
      <ul>
        <li><strong>EPP certificado:</strong> Todos nuestros trabajadores cuentan con equipo de protección personal de última generación, incluyendo cascos, arneses, guantes y calzado de seguridad.</li>
        <li><strong>Capacitación continua:</strong> Realizamos charlas diarias de seguridad y entrenamientos prácticos mensuales.</li>
        <li><strong>Barandas y protecciones:</strong> Instalamos barandas de seguridad temporales en todos los bordes y aberturas, siguiendo las normativas vigentes.</li>
        <li><strong>Análisis de riesgos:</strong> Antes de cada actividad, realizamos un análisis detallado de riesgos y establecemos controles específicos.</li>
      </ul>
      <p>La seguridad no es un gasto, es una inversión que protege a nuestro equipo y garantiza la continuidad de los proyectos.</p>
    `,
    fecha: "22 de Mayo, 2024",
    tiempoLectura: "4 min",
    categoria: "Seguridad",
    imagen: "/img/seguridadObra.jpg",
    slug: "seguridad-en-obras",
    autor: "Ing. José Ramírez",
  },
  {
    id: 3,
    titulo: "Chutes metálicos: Sistema eficiente para evacuación de residuos",
    extracto:
      "Cómo los chutes metálicos optimizan la gestión de residuos en edificios de gran altura.",
    contenido: `
      <p>La gestión de residuos en proyectos de construcción vertical es uno de los mayores desafíos operativos. Los chutes metálicos han demostrado ser la solución más eficiente y segura.</p>
      <h2>Beneficios del sistema de chutes</h2>
      <ul>
        <li><strong>Eficiencia:</strong> Reducen el tiempo de evacuación de residuos en un 70%, permitiendo que la obra avance más rápido.</li>
        <li><strong>Seguridad:</strong> Eliminan el riesgo de caídas al transportar escombros manualmente por las escaleras.</li>
        <li><strong>Higiene:</strong> Mantienen la obra limpia y ordenada, reduciendo el riesgo de accidentes por materiales acumulados.</li>
        <li><strong>Versatilidad:</strong> Se adaptan a diferentes alturas y configuraciones de edificios.</li>
      </ul>
      <p>En LUDIER hemos instalado chutes metálicos en proyectos como el edificio Hilton MDP (19 pisos) y el proyecto QANTUA, garantizando una evacuación rápida y segura.</p>
    `,
    fecha: "10 de Abril, 2024",
    tiempoLectura: "6 min",
    categoria: "Sistemas",
    imagen: "/img/chutesMetalicos.webp",
    slug: "chutes-metalicos-eficientes",
    autor: "Ing. Diego Arroyo",
  },
  {
    id: 4,
    titulo: "Barandas y pasamanos: Diseño y funcionalidad",
    extracto:
      "La importancia de las barandas en la seguridad y estética de los proyectos arquitectónicos.",
    contenido: `
      <p>Las barandas y pasamanos son elementos esenciales que combinan seguridad y diseño arquitectónico. En LUDIER, entendemos que una baranda bien diseñada puede transformar un espacio.</p>
      <h2>Claves para un diseño exitoso</h2>
      <ul>
        <li><strong>Seguridad ante todo:</strong> Cumplimos con todas las normativas de seguridad, garantizando alturas y separaciones adecuadas.</li>
        <li><strong>Estética y personalización:</strong> Ofrecemos una amplia gama de diseños, desde líneas minimalistas hasta patrones más elaborados.</li>
        <li><strong>Acabados de calidad:</strong> Aplicamos pintura electrostática, anticorrosiva y acabados gloss mate para garantizar durabilidad.</li>
        <li><strong>Instalación precisa:</strong> Nuestros técnicos aseguran una fijación perfecta a la estructura, sin vibraciones ni holguras.</li>
      </ul>
      <p>Hemos instalado barandas en proyectos emblemáticos como el Edificio Residencial Zendai y el proyecto QANTUA, siempre con resultados impecables.</p>
    `,
    fecha: "28 de Marzo, 2024",
    tiempoLectura: "3 min",
    categoria: "Diseño",
    imagen: "/img/barandaBalcones.jpg",
    slug: "barandas-pasamanos-diseno",
    autor: "Arq. Andrea Paredes",
  },
  {
    id: 5,
    titulo: "Fabricación a medida: Soluciones personalizadas para cada proyecto",
    extracto:
      "Cómo la fabricación a medida permite adaptar las soluciones metalmecánicas a cada necesidad.",
    contenido: `
      <p>Cada proyecto es único, y en LUDIER lo entendemos. La fabricación a medida es nuestro fuerte, permitiéndonos desarrollar soluciones que se ajustan perfectamente a los requerimientos de cada cliente.</p>
      <h2>Nuestro proceso de fabricación a medida</h2>
      <ul>
        <li><strong>Análisis detallado:</strong> Estudiamos los planos y especificaciones técnicas para entender las necesidades exactas del proyecto.</li>
        <li><strong>Diseño y optimización:</strong> Nuestro equipo de ingeniería utiliza software avanzado para diseñar la solución más eficiente.</li>
        <li><strong>Fabricación de precisión:</strong> Contamos con taller propio equipado con maquinaria de última generación.</li>
        <li><strong>Control de calidad:</strong> Cada pieza pasa por rigurosos controles dimensionales y de soldadura antes de ser entregada.</li>
      </ul>
      <p>Desde rejillas hasta estructuras complejas, hemos fabricado soluciones para proyectos de todos los tamaños, siempre con la calidad que nos caracteriza.</p>
    `,
    fecha: "15 de Febrero, 2024",
    tiempoLectura: "4 min",
    categoria: "Fabricación",
    imagen: "/img/Estructuras_especiales.jpg",
    slug: "fabricacion-medida-soluciones",
    autor: "Ing. Pedro Torres",
  },
  {
    id: 6,
    titulo: "Normativas de construcción vertical en Perú",
    extracto:
      "Lo que todo constructor debe saber sobre las normativas vigentes para proyectos de gran altura.",
    contenido: `
      <p>La construcción vertical en Perú está regulada por un conjunto de normativas que garantizan la seguridad y calidad de las edificaciones. Conocerlas es fundamental para cualquier proyecto.</p>
      <h2>Normativas clave</h2>
      <ul>
        <li><strong>Reglamento Nacional de Edificaciones (RNE):</strong> Establece los requisitos mínimos para el diseño, construcción y mantenimiento de edificaciones.</li>
        <li><strong>Norma E.030 de Diseño Sismorresistente:</strong> Específica para zonas sísmicas como la nuestra, define los criterios para garantizar la resistencia ante terremotos.</li>
        <li><strong>Norma E.020 de Cargas:</strong> Define las cargas mínimas que deben soportar las estructuras, incluyendo viento, nieve y uso.</li>
        <li><strong>Normas de seguridad en altura:</strong> Establecen los requisitos para barandas, escaleras de emergencia y sistemas de evacuación.</li>
      </ul>
      <p>En LUDIER, aseguramos que todas nuestras estructuras cumplan con estas normativas, garantizando la seguridad y durabilidad de cada proyecto.</p>
    `,
    fecha: "2 de Enero, 2024",
    tiempoLectura: "7 min",
    categoria: "Normativas",
    imagen: "/img/normasdeSeguridad.png",
    slug: "normativas-construccion-peru",
    autor: "Abog. María Fernanda Torres",
  },
];

const BlogCard = ({
  post,
  index,
}: {
  post: typeof posts[0];
  index: number;
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 800 + index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 800ms cubic-bezier(0.16,1,0.3,1), transform 800ms cubic-bezier(0.16,1,0.3,1)`,
      }}
    >
      <div className="group relative bg-white border border-[#E3E1D8] rounded-sm overflow-hidden transition-all hover:border-[#FF5A1F]/40 hover:shadow-xl hover:-translate-y-2">
        <CornerMarks />
        <div className="relative h-48 overflow-hidden bg-[#14161A]">
          <img
            src={post.imagen}
            alt={post.titulo}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-sm">
            <span
              className="text-[10px] font-medium text-white uppercase tracking-wider"
              style={{ fontFamily: FONT_MONO }}
            >
              {post.categoria}
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 text-xs text-[#8B8F86] mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {post.fecha}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.tiempoLectura}
            </span>
          </div>
          <h3
            className="text-lg font-semibold text-[#1E2126] group-hover:text-[#FF5A1F] transition-colors line-clamp-2"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            {post.titulo}
          </h3>
          <p className="mt-2 text-sm text-[#565C63] line-clamp-2">{post.extracto}</p>
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[#FF5A1F]">
            <span>Leer más</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function Blog() {
  const { ref: heroRef, inView: heroInView } = useScrollReveal<HTMLDivElement>(0.1);
  const { ref: gridRef, inView: gridInView } = useScrollReveal<HTMLDivElement>(0.1);
  const { ref: ctaRef, inView: ctaInView } = useScrollReveal<HTMLDivElement>(0.1);

  const stats = [
    { value: "6+", label: "Artículos publicados", icon: BookOpen },
    { value: "95%", label: "Contenido útil", icon: TrendingUp },
    { value: "100%", label: "Actualizado", icon: CheckCircle },
    { value: "200+", label: "Lectores mensuales", icon: Users },
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
              Blog / Novedades
            </span>
            <h1
              className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              Novedades y
              <br />
              <span className="relative inline-block">
                <span className="text-[#FF5A1F]">conocimiento</span>
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#FF5A1F]/30 rounded-full blur-sm" />
              </span>
            </h1>
            <p className="mt-6 text-lg text-[#9AA0A6] max-w-xl leading-relaxed">
              Artículos, guías y novedades sobre estructuras metálicas, seguridad
              en obra y tendencias en construcción.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs text-[#8A8F96]">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-[#FF5A1F]" />
                Artículos técnicos
              </span>
              <span className="text-[#3A3F45]">|</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-[#FF5A1F]" />
                Actualizado semanalmente
              </span>
              <span className="text-[#3A3F45]">|</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-[#FF5A1F]" />
                Contenido experto
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

      {/* GRID DE ARTÍCULOS */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            ref={gridRef}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            style={{
              opacity: gridInView ? 1 : 0,
              transform: gridInView ? "translateY(0)" : "translateY(30px)",
              transition:
                "opacity 900ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {posts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
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
            Cuéntanos tu idea y te ayudaremos a encontrar la mejor solución metalmecánica.
          </p>
          <Link
            href="/contacto"
            className="mt-6 inline-flex items-center gap-2 bg-[#FF5A1F] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#FF5A1F]/20 transition-all hover:bg-[#FF7A44] hover:shadow-[#FF5A1F]/40 hover:-translate-y-1"
          >
            <CheckCircle className="h-4 w-4" />
            Cotizar ahora
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

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

// ============================================================
// EXPORTAR DATOS PARA REUTILIZACIÓN EN LA PÁGINA DE DETALLE
// ============================================================
export { posts };