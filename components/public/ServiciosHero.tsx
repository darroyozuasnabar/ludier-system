"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, ChevronDown, PhoneCall } from "lucide-react";
import Reveal from "@/components/public/Reveal";
import ScrollToLink from "@/components/public/ScrollToLink";
import ServiciosShowcase from "@/components/public/ServiciosShowcase";

const SPECIALTY = "metalmecánica";

export default function ServiciosHero() {
  const [typed, setTyped] = useState(SPECIALTY);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;

    const updateMotion = () => {
      clearInterval(timer);
      setReducedMotion(motion.matches);
      if (motion.matches) {
        setTyped(SPECIALTY);
        return;
      }

      let length = 0;
      setTyped("");
      timer = setInterval(() => {
        length += 1;
        setTyped(SPECIALTY.slice(0, length));
        if (length === SPECIALTY.length) clearInterval(timer);
      }, 300);
    };

    updateMotion();
    motion.addEventListener("change", updateMotion);
    return () => {
      clearInterval(timer);
      motion.removeEventListener("change", updateMotion);
    };
  }, []);

  return (
    <section className="ludier-services-hero relative overflow-hidden bg-[#14161A] pb-16 pt-28 lg:pb-24 lg:pt-36">
      <div className="ludier-services-grid" aria-hidden />
      <div className="ludier-services-glow" aria-hidden />
      <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-[#FF5A1F]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14">
          <div>
            <Reveal>
              <p className="ludier-eyebrow text-[#C7CBD1]" style={{ fontFamily: "var(--font-mono)" }}>
                <span className="h-px w-6 bg-[#FF5A1F]" aria-hidden />
                Nuestros servicios · Lima, Perú
              </p>
            </Reveal>
            <Reveal delay={70}>
              <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.25rem] xl:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
                Servicios de<br />{" "}
                <span className="relative inline-block text-[#FF5A1F]">
                  <span className="invisible">{SPECIALTY}</span>
                  <span className="sr-only">{SPECIALTY}</span>
                  <span aria-hidden="true" className="absolute inset-y-0 left-0">
                    {typed}
                    {!reducedMotion && typed === SPECIALTY && (
                      <span className="absolute left-full top-0 animate-pulse motion-reduce:hidden">|</span>
                    )}
                  </span>
                </span>
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#B4B9BF] sm:text-lg" style={{ fontFamily: "var(--font-body)" }}>
                Fabricamos e instalamos estructuras, barandas, escaleras, portones
                y chutes metálicos en Lima. Tú defines el proyecto; nosotros lo
                llevamos del plano a la obra.
              </p>
            </Reveal>
            <Reveal delay={210}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href="/contacto" className="ludier-button ludier-button-primary" style={{ fontFamily: "var(--font-body)" }}>
                  <PhoneCall className="h-4 w-4" aria-hidden /> Cotizar ahora
                </Link>
                <Link href="/servicios/empresas-estructuras-metalicas" className="ludier-button ludier-button-secondary ludier-button-secondary-dark" style={{ fontFamily: "var(--font-body)" }}>
                  Soy constructora <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </Reveal>
            <Reveal delay={280}>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-xs text-[#9AA0A6]" style={{ fontFamily: "var(--font-body)" }}>
                {["Más de 10 años de experiencia", "Fabricación según planos", "Montaje en obra"].map((text) => (
                  <span key={text} className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 shrink-0 text-[#FF5A1F]" aria-hidden /> {text}
                  </span>
                ))}
              </div>
            </Reveal>
            <ScrollToLink targetId="catalogo-servicios" className="ludier-explore-link mt-9 inline-flex min-h-11 items-center gap-3 text-xs font-medium uppercase tracking-[0.12em] text-[#C7CBD1]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#3A3F45]" aria-hidden><ChevronDown className="h-4 w-4" /></span>
              Explorar servicios
            </ScrollToLink>
          </div>
          <Reveal delay={120}>
            <ServiciosShowcase />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
