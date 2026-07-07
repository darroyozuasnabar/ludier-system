"use client";

import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Linkedin,
  Youtube,
  Facebook,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

const footerLinks = [
  {
    title: "Empresa",
    links: [
      { label: "Nosotros", href: "/nosotros" },
      { label: "Servicios", href: "/servicios" },
      { label: "Proyectos", href: "/proyectos" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
  {
    title: "Servicios",
    links: [
      { label: "Barandas Metálicas", href: "/servicios#barandas" },
      { label: "Escaleras Metálicas", href: "/servicios#escaleras" },
      { label: "Estructuras Metálicas", href: "/servicios#estructuras" },
      { label: "Portones y Cercos", href: "/servicios#portones" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Preguntas Frecuentes", href: "/faq" },
      { label: "Testimonios", href: "/testimonios" },
      { label: "Política de Privacidad", href: "/privacidad" },
    ],
  },
];

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
];

function CornerMarks({ className = "" }: { className?: string }) {
  return (
    <>
      <span
        className={`pointer-events-none absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-[#FF5A1F]/0 transition-colors duration-300 group-hover:border-[#FF5A1F]/70 ${className}`}
      />
      <span
        className={`pointer-events-none absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-[#FF5A1F]/0 transition-colors duration-300 group-hover:border-[#FF5A1F]/70 ${className}`}
      />
      <span
        className={`pointer-events-none absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-[#FF5A1F]/0 transition-colors duration-300 group-hover:border-[#FF5A1F]/70 ${className}`}
      />
      <span
        className={`pointer-events-none absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-[#FF5A1F]/0 transition-colors duration-300 group-hover:border-[#FF5A1F]/70 ${className}`}
      />
    </>
  );
}

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden bg-[#14161A] text-[#C7CBD1]"
      style={{ fontFamily: "var(--font-body, Inter, ui-sans-serif, system-ui, sans-serif)" }}
    >
      {/* Franja de seguridad diagonal */}
      <div
        className="h-[6px] w-full"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #FF5A1F 0px, #FF5A1F 14px, #14161A 14px, #14161A 28px)",
        }}
        aria-hidden="true"
      />

      {/* Textura de fondo */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, #C7CBD1 0px, #C7CBD1 1px, transparent 1px, transparent 64px)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full opacity-[0.08]"
        style={{
          background: "radial-gradient(circle, #FF5A1F 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Cuerpo principal - SIN BARA DE ESTADÍSTICAS */}
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Marca con logo real */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-3.5">
              <img
                src="/img/logo-ludier.png"
                alt="LUDIER - Construcciones Generales"
                width={80}
                height={80}
                className="h-20 w-20 shrink-0 object-contain"
              />
              <div>
                <span
                  className="block text-2xl font-semibold leading-tight tracking-tight text-white"
                  style={{ fontFamily: "var(--font-display, Oswald, ui-sans-serif, sans-serif)" }}
                >
                  LUDIER
                </span>
                <span className="block text-[11px] font-medium uppercase leading-none tracking-[0.18em] text-[#8A8F96]">
                  Construcciones Generales
                </span>
              </div>
            </Link>

            <p className="max-w-xs text-sm leading-relaxed text-[#9AA0A6]">
              Fabricación e instalación de soluciones metalmecánicas de alta
              calidad en Perú.
            </p>

            <a
              href="https://wa.me/51930747399?text=Hola%20LUDIER%2C%20quiero%20cotizar%20un%20proyecto"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-sm bg-[#25D366] px-4 py-2.5 text-sm font-medium text-[#0B1A0F] shadow-lg shadow-[#25D366]/10 transition-all duration-300 hover:bg-[#1FB855] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
            >
              <MessageCircle className="h-4 w-4" />
              Contáctanos por WhatsApp
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </a>

            <div className="flex gap-2.5 pt-1">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-sm border border-[#3A3F45] bg-[#1D2024] text-[#9AA0A6] transition-all duration-300 hover:border-[#FF5A1F] hover:text-[#FF5A1F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A1F]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Columnas de enlaces */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3
                className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-white"
                style={{ fontFamily: "var(--font-display, Oswald, ui-sans-serif, sans-serif)" }}
              >
                {group.title}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-sm text-[#9AA0A6] transition-colors duration-200 hover:text-[#FF5A1F]"
                    >
                      <span className="h-px w-0 bg-[#FF5A1F] transition-all duration-200 group-hover:w-2.5" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Placa de contacto */}
        <div className="mt-10 border-t border-[#3A3F45] pt-8">
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-[#3A3F45] bg-[#3A3F45] md:grid-cols-3">
            <div className="group relative flex items-center gap-3 bg-[#1D2024] p-4 transition-colors hover:bg-[#22262B]">
              <CornerMarks />
              <Phone className="h-5 w-5 shrink-0 text-[#FF5A1F]" strokeWidth={1.75} />
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7379]">Teléfono</p>
                <a
                  href="tel:+51930747399"
                  className="text-sm font-medium text-[#D4D4D8] transition-colors hover:text-white"
                >
                  +51 930 747 399
                </a>
              </div>
            </div>
            <div className="group relative flex items-center gap-3 bg-[#1D2024] p-4 transition-colors hover:bg-[#22262B]">
              <CornerMarks />
              <Mail className="h-5 w-5 shrink-0 text-[#FF5A1F]" strokeWidth={1.75} />
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7379]">Correo</p>
                <a
                  href="mailto:ernestoarroyo1969@hotmail.com"
                  className="text-sm font-medium text-[#D4D4D8] transition-colors hover:text-white"
                >
                  ernestoarroyo1969@hotmail.com
                </a>
              </div>
            </div>
            <div className="group relative flex items-center gap-3 bg-[#1D2024] p-4 transition-colors hover:bg-[#22262B]">
              <CornerMarks />
              <MapPin className="h-5 w-5 shrink-0 text-[#FF5A1F]" strokeWidth={1.75} />
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7379]">Ubicación</p>
                <p className="text-sm font-medium text-[#D4D4D8]">Lima, Perú</p>
              </div>
            </div>
          </div>
        </div>

        {/* Línea inferior */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[#3A3F45] pt-6 sm:flex-row">
          <p className="text-xs text-[#6E7379]">
            © {new Date().getFullYear()} LUDIER · Construcciones Generales. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4 text-xs text-[#6E7379]">
            <Link href="/privacidad" className="transition-colors hover:text-[#C7CBD1]">
              Política de Privacidad
            </Link>
            <span className="text-[#3A3F45]">|</span>
            <Link href="/terminos" className="transition-colors hover:text-[#C7CBD1]">
              Términos y Condiciones
            </Link>
            <span className="text-[#3A3F45]">|</span>
            <Link href="/contacto" className="transition-colors hover:text-[#C7CBD1]">
              Contacto
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center text-[10px] tracking-wider text-[#4A4F55]">
          Construyendo soluciones metálicas seguras, eficientes y duraderas para el desarrollo de proyectos que transforman la ciudad.
        </div>
      </div>
    </footer>
  );
}