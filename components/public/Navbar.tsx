"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

/**
 * Marcas de esquina — mismo elemento firma que en el Hero y el Footer.
 * Enmarcan el logo; se "activan" en naranja al hacer hover, como si
 * el cursor estuviera enfocando una lámina de plano.
 */
function CornerFrame() {
  const base =
    "pointer-events-none absolute h-2 w-2 border-[#FF5A1F]/0 transition-colors duration-300 group-hover:border-[#FF5A1F]";
  return (
    <>
      <span className={`${base} -left-1.5 -top-1.5 border-l-2 border-t-2`} />
      <span className={`${base} -right-1.5 -top-1.5 border-r-2 border-t-2`} />
      <span className={`${base} -bottom-1.5 -left-1.5 border-b-2 border-l-2`} />
      <span className={`${base} -bottom-1.5 -right-1.5 border-b-2 border-r-2`} />
    </>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cierra el menú mobile al cambiar de ruta (ej. botón atrás del navegador)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Bloquea el scroll del body mientras el menú mobile está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Cierra con Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href));

  // Índice de la página activa, tipo "lámina N de un juego de planos"
  const activeIndex = navItems.findIndex((item) => isActive(item.href));
  const pageNumber = String(activeIndex >= 0 ? activeIndex + 1 : 1).padStart(2, "0");
  const totalPages = String(navItems.length).padStart(2, "0");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "border-b border-[#3A3F45] bg-[#14161A]/95 shadow-2xl backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      {/* Degradado de respaldo cuando el header es transparente, para que el
          logo y los links se lean bien sobre cualquier fondo de página */}
      {!isScrolled && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 to-transparent"
          aria-hidden="true"
        />
      )}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-[height] duration-300 ${
            isScrolled ? "h-16" : "h-16 md:h-20"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="group flex shrink-0 items-center gap-3">
            <div className="relative h-10 w-10 shrink-0">
              <CornerFrame />
              <img
                src="/img/logo-ludier.png"
                alt="LUDIER"
                width={40}
                height={40}
                className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div>
              <span
                className="block text-xl font-semibold tracking-tight text-white"
                style={{ fontFamily: "var(--font-display, Oswald, ui-sans-serif, sans-serif)" }}
              >
                LUDIER
              </span>
              <span className="block text-[9px] font-medium uppercase leading-none tracking-[0.18em] text-[#8A8F96]">
                Soluciones Metalmecánicas
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 md:flex" aria-label="Navegación principal">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5A1F] ${
                  isActive(item.href) ? "text-[#FF5A1F]" : "text-[#C7CBD1] hover:text-white"
                }`}
                style={{ fontFamily: "var(--font-body, Inter, ui-sans-serif, system-ui, sans-serif)" }}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
                {/* Línea indicadora tipo plano técnico */}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] w-full origin-left transition-transform duration-300 ${
                    isActive(item.href)
                      ? "scale-x-100 bg-[#FF5A1F]"
                      : "scale-x-0 bg-[#FF5A1F] group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}

            {/* Lectura tipo "lámina X de Y" — el mismo lenguaje del cuadro de
                rotulación de la vitrina del Hero, aplicado a la navegación */}
            <div
              className="hidden items-baseline gap-1.5 border-l border-[#3A3F45] pl-5 text-[10px] uppercase tracking-[0.1em] text-[#6E7379] lg:flex"
              style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', ui-monospace, monospace)" }}
              aria-hidden="true"
            >
              <span>Lám.</span>
              <span className="text-[#C7CBD1]">
                {pageNumber}/{totalPages}
              </span>
            </div>

            {/* 🔥 BOTÓN INGRESAR (NUEVO) */}
            <Link
              href="/login"
              className="px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-[#FF5A1F] border border-[#FF5A1F] rounded-lg transition-all duration-300 hover:bg-[#FF5A1F]/10 hover:border-[#FF7A44] hover:text-[#FF7A44] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              style={{ fontFamily: "var(--font-body, Inter, ui-sans-serif, system-ui, sans-serif)" }}
            >
              Ingresar
            </Link>

            <Link
              href="/contacto"
              className="group relative overflow-hidden bg-[#FF5A1F] px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#FF5A1F]/20 transition-all duration-300 hover:bg-[#FF7A44] hover:shadow-[#FF5A1F]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              style={{ fontFamily: "var(--font-body, Inter, ui-sans-serif, system-ui, sans-serif)" }}
            >
              <span className="relative z-10">Cotizar ahora</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 transition-colors duration-200 hover:bg-[#3A3F45]/30 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF5A1F] md:hidden"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu — se lee como un índice de láminas de un juego de planos */}
      <div
        id="mobile-menu"
        className={`overflow-hidden border-b border-[#3A3F45] bg-[#14161A]/98 backdrop-blur-xl transition-all duration-300 ease-in-out md:hidden ${
          isOpen ? "max-h-screen" : "max-h-0 border-b-0"
        }`}
      >
        <div className="space-y-1 px-4 py-6">
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                isActive(item.href)
                  ? "bg-[#FF5A1F]/10 text-[#FF5A1F]"
                  : "text-[#C7CBD1] hover:bg-[#3A3F45]/30 hover:text-white"
              }`}
            >
              <span
                className="text-[10px] tracking-[0.1em] text-[#6E7379]"
                style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', ui-monospace, monospace)" }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              {item.label}
            </Link>
          ))}

          {/* 🔥 BOTÓN INGRESAR (móvil) */}
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="mt-4 block rounded-lg border border-[#FF5A1F] px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide text-[#FF5A1F] transition-colors duration-200 hover:bg-[#FF5A1F]/10"
          >
            Ingresar al sistema
          </Link>

          <Link
            href="/contacto"
            onClick={() => setIsOpen(false)}
            className="mt-2 block rounded-lg bg-[#FF5A1F] px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-[#FF7A44]"
          >
            Cotizar ahora
          </Link>
        </div>
      </div>

      {/* Línea de progreso sutil en la parte inferior al hacer scroll */}
      {isScrolled && (
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-[#FF5A1F] via-[#FF7A44] to-[#FF5A1F] opacity-60" />
      )}
    </header>
  );
}