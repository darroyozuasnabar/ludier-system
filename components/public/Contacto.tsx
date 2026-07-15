"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
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
  Mail,
  Clock,
  Send,
} from "lucide-react";

// ============================================================
// TIPOGRAFÍAS
// ============================================================
const FONT_DISPLAY = 'var(--font-display, Oswald, ui-sans-serif, sans-serif)';
const FONT_BODY = 'var(--font-body, Inter, ui-sans-serif, system-ui, sans-serif)';
const FONT_MONO = 'var(--font-mono, "JetBrains Mono", ui-monospace, monospace)';

// ============================================================
// TIPOS
// ============================================================
type ContactInfo = {
  id: number;
  icon: any;
  titulo: string;
  contenido: string;
  detalle: string;
};

// ============================================================
// DATOS DE CONTACTO
// ============================================================
const contactInfoData: ContactInfo[] = [
  {
    id: 1,
    icon: MapPin,
    titulo: "Dirección",
    contenido: "Lima, Perú",
    detalle: "Oficina principal en SJM",
  },
  {
    id: 2,
    icon: PhoneCall,
    titulo: "Teléfono / WhatsApp",
    contenido: "+51 930 747 399",
    detalle: "Respuesta inmediata",
  },
  {
    id: 3,
    icon: Mail,
    titulo: "Correo electrónico",
    contenido: "ernestoarroyo1969@hotmail.com",
    detalle: "Consultas y cotizaciones",
  },
  {
    id: 4,
    icon: Clock,
    titulo: "Horario de atención",
    contenido: "Lun - Vie: 8:00 am - 6:00 pm",
    detalle: "Sábados con cita previa",
  },
];

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
// SUBCOMPONENTE: ContactInfoCard (maneja su propia animación)
// ============================================================
const ContactInfoCard = ({
  info,
  index,
}: {
  info: ContactInfo;
  index: number;
}) => {
  const Icon = info.icon;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 800 + index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className="group relative bg-white border border-[#E3E1D8] rounded-sm overflow-hidden transition-all hover:border-[#FF5A1F]/40 hover:shadow-xl hover:-translate-y-2"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 800ms cubic-bezier(0.16,1,0.3,1), transform 800ms cubic-bezier(0.16,1,0.3,1)`,
      }}
    >
      <CornerMarks />
      <div className="p-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-[#FF5A1F]/10 border border-[#FF5A1F]/20">
          <Icon className="h-5 w-5 text-[#FF5A1F]" />
        </div>
        <div>
          <h3
            className="text-sm font-semibold text-[#1E2126]"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            {info.titulo}
          </h3>
          <p className="text-base font-medium text-[#1E2126]">{info.contenido}</p>
          <p className="text-sm text-[#8B8F86]">{info.detalle}</p>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function Contacto() {
  const [formState, setFormState] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);

  const { ref: heroRef, inView: heroInView } = useScrollReveal<HTMLDivElement>(0.1);
  const { ref: gridRef, inView: gridInView } = useScrollReveal<HTMLDivElement>(0.1);
  const { ref: ctaRef, inView: ctaInView } = useScrollReveal<HTMLDivElement>(0.1);

  // 🔥 FORZAR NAVBAR OSCURO DESDE EL INICIO (SOLO PARA ESTA PÁGINA)
  useEffect(() => {
    const navbar = document.querySelector('header');
    if (navbar) {
      navbar.style.backgroundColor = '#14161A';
      navbar.style.borderBottom = '1px solid #3A3F45';
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  // Reemplaza la función handleSubmit por esta:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validación básica
  if (!formState.nombre || !formState.email || !formState.asunto || !formState.mensaje) {
    alert('Por favor, completa todos los campos obligatorios.');
    return;
  }

  setCargando(true);

  try {
    const response = await fetch('/api/contacto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formState),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al enviar el mensaje');
    }

    setEnviado(true);
    setFormState({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' });
    setTimeout(() => setEnviado(false), 5000);
  } catch (error: any) {
    alert(error.message || 'Ocurrió un error al enviar el mensaje. Inténtalo nuevamente.');
  } finally {
    setCargando(false);
  }
};

  const stats = [
    { value: "24h", label: "Tiempo de respuesta", icon: Clock },
    { value: "100%", label: "Satisfacción garantizada", icon: Shield },
    { value: "40+", label: "Proyectos ejecutados", icon: Building2 },
    { value: "20+", label: "Clientes activos", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F4]" style={{ fontFamily: FONT_BODY }}>
      {/* ============================================================
          HERO - IDÉNTICO A PROYECTOS
          ============================================================ */}
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
              Contáctanos
            </span>
            <h1
              className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              ¿Listo para tu
              <br />
              <span className="relative inline-block">
                <span className="text-[#FF5A1F]">próximo proyecto</span>
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#FF5A1F]/30 rounded-full blur-sm" />
              </span>
              ?
            </h1>
            <p className="mt-6 text-lg text-[#9AA0A6] max-w-xl leading-relaxed">
              Cuéntanos tu idea, solicita una cotización o resuelve tus dudas técnicas.
              Nuestro equipo está listo para ayudarte.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="tel:+51930747399"
                className="inline-flex items-center gap-2 bg-[#FF5A1F] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#FF5A1F]/20 transition-all hover:bg-[#FF7A44] hover:shadow-[#FF5A1F]/40 hover:-translate-y-1"
              >
                <PhoneCall className="h-4 w-4" />
                Llamar ahora
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-xs text-[#8A8F96]">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-[#FF5A1F]" />
                Respuesta en 24h
              </span>
              <span className="text-[#3A3F45]">|</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-[#FF5A1F]" />
                Cotización sin compromiso
              </span>
              <span className="text-[#3A3F45]">|</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-[#FF5A1F]" />
                Asesoría personalizada
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          ESTADÍSTICAS - IDÉNTICO A PROYECTOS
          ============================================================ */}
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

      {/* ============================================================
          CONTACTO - GRID DE INFORMACIÓN + FORMULARIO
          ============================================================ */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            ref={gridRef}
            className="grid lg:grid-cols-2 gap-8"
            style={{
              opacity: gridInView ? 1 : 0,
              transform: gridInView ? "translateY(0)" : "translateY(30px)",
              transition:
                "opacity 900ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {/* ===== COLUMNA IZQUIERDA: TARJETAS DE INFORMACIÓN ===== */}
            <div className="space-y-6">
              {contactInfoData.map((info, index) => (
                <ContactInfoCard key={info.id} info={info} index={index} />
              ))}

              {/* Sello de calidad LUDIER */}
              <div className="group relative bg-[#14161A] border border-[#3A3F45] p-6 rounded-sm overflow-hidden transition-all hover:border-[#FF5A1F]/40 hover:shadow-xl">
                <CornerMarks active />
                <div className="text-center">
                  <Building2 className="h-8 w-8 text-[#FF5A1F] mx-auto mb-2" />
                  <p
                    className="text-white text-sm font-semibold"
                    style={{ fontFamily: FONT_DISPLAY }}
                  >
                    CONSTRUCCIONES GENERALES LUDIER
                  </p>
                  <p className="text-[#8A8F96] text-xs">Soluciones metalmecánicas desde 2016</p>
                  <div className="mt-3 flex justify-center gap-3 text-[10px] text-[#6E7379]">
                    <span>✓ Calidad garantizada</span>
                    <span>✓ Entrega puntual</span>
                    <span>✓ 100% conformidad</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== COLUMNA DERECHA: FORMULARIO ===== */}
            <div className="bg-white border border-[#E3E1D8] rounded-sm p-6 md:p-8 shadow-sm">
              <h2
                className="text-2xl font-semibold text-[#1E2126] mb-2"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                Envíanos un mensaje
              </h2>
              <p className="text-sm text-[#8B8F86] mb-6">
                Completa el formulario y te responderemos en menos de 24 horas.
              </p>

              {enviado ? (
                <div className="bg-green-50 border border-green-200 rounded-sm p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-green-700">¡Mensaje enviado!</h3>
                  <p className="text-green-600">Nos pondremos en contacto contigo pronto.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nombre" className="block text-sm font-medium text-[#1E2126] mb-1">
                        Nombre completo *
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formState.nombre}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-[#E3E1D8] rounded-sm focus:border-[#FF5A1F] focus:outline-none transition-colors bg-[#F7F7F4]"
                        placeholder="Ej. Juan Pérez"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#1E2126] mb-1">
                        Correo electrónico *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-[#E3E1D8] rounded-sm focus:border-[#FF5A1F] focus:outline-none transition-colors bg-[#F7F7F4]"
                        placeholder="ejemplo@correo.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-[#1E2126] mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formState.telefono}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-[#E3E1D8] rounded-sm focus:border-[#FF5A1F] focus:outline-none transition-colors bg-[#F7F7F4]"
                      placeholder="+51 999 999 999"
                    />
                  </div>
                  <div>
                    <label htmlFor="asunto" className="block text-sm font-medium text-[#1E2126] mb-1">
                      Asunto *
                    </label>
                    <input
                      type="text"
                      id="asunto"
                      name="asunto"
                      value={formState.asunto}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-[#E3E1D8] rounded-sm focus:border-[#FF5A1F] focus:outline-none transition-colors bg-[#F7F7F4]"
                      placeholder="Ej. Cotización de barandas"
                    />
                  </div>
                  <div>
                    <label htmlFor="mensaje" className="block text-sm font-medium text-[#1E2126] mb-1">
                      Mensaje *
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      rows={5}
                      value={formState.mensaje}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-[#E3E1D8] rounded-sm focus:border-[#FF5A1F] focus:outline-none transition-colors bg-[#F7F7F4] resize-none"
                      placeholder="Describe tu proyecto o consulta..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={cargando}
                    className="w-full flex items-center justify-center gap-2 bg-[#FF5A1F] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#FF5A1F]/20 transition-all hover:bg-[#FF7A44] hover:shadow-[#FF5A1F]/40 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {cargando ? (
                      <>
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Enviar mensaje
                      </>
                    )}
                  </button>
                  <p className="text-xs text-[#8B8F86] text-center">
                    * Campos obligatorios. Tu información está segura con nosotros.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA FINAL - IDÉNTICO A PROYECTOS
          ============================================================ */}
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
            ¿Prefieres llamarnos?
          </h2>
          <p className="mt-3 text-[#565C63] max-w-xl mx-auto">
            Estamos disponibles de lunes a viernes para atenderte directamente.
          </p>
          <Link
            href="tel:+51930747399"
            className="mt-6 inline-flex items-center gap-2 bg-[#FF5A1F] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#FF5A1F]/20 transition-all hover:bg-[#FF7A44] hover:shadow-[#FF5A1F]/40 hover:-translate-y-1"
          >
            <PhoneCall className="h-4 w-4" />
            +51 930 747 399
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="mt-4 flex justify-center gap-4 text-xs text-[#8B8F86]">
            <span>✓ Respuesta inmediata</span>
            <span>✓ WhatsApp 24/7</span>
            <span>✓ Sin costo adicional</span>
          </div>
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