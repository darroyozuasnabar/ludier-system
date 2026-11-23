"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle, ChevronDown, PhoneCall } from "lucide-react";
import Reveal from "@/components/public/Reveal";
import ScrollToLink from "@/components/public/ScrollToLink";
import ServiciosShowcase from "@/components/public/ServiciosShowcase";
import { useEffect, useState } from "react";

export default function ServiciosHero() {
  const [typedText, setTypedText] = useState("");
  const fullText = "metalmecánica";

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setTypedText(fullText);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#14161A] pb-16 pt-28 lg:pb-24 lg:pt-36">
      {/* Fondo de Grid y Glow */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute -left-40 top-20 h-[600px] w-[600px] rounded-full bg-[#FF5A1F] opacity-[0.08] blur-[100px]" />
      <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-[#FF5A1F] opacity-[0.05] blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-[#FF5A1F]">
                <span className="h-px w-8 bg-[#FF5A1F]" />
                Nuestros servicios · Lima, Perú
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="mt-6 text-5xl font-semibold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Servicios de{" "}
                <span className="text-[#FF5A1F]">
                  {typedText}
                  <span className="animate-pulse">|</span>
                </span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#B4B9BF]">
                Fabricamos e instalamos estructuras, barandas, escaleras, portones
                y chutes metálicos en Lima. Tú defines el proyecto; nosotros lo
                llevamos del plano a la obra.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <Link href="/contacto" className="ludier-button ludier-button-primary">
                  <PhoneCall className="h-5 w-5" aria-hidden /> Cotizar ahora
                </Link>
                <Link
                  href="/servicios/empresas-estructuras-metalicas"
                  className="ludier-button ludier-button-secondary ludier-button-secondary-dark"
                >
                  Soy constructora <ArrowRight className="h-5 w-5" aria-hidden />
                </Link>
              </div>
            </Reveal>
            <Reveal delay={400}>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#9AA0A6]">
                {["Más de 10 años de experiencia", "Fabricación según planos", "Montaje en obra"].map((text) => (
                  <span key={text} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#FF5A1F]" aria-hidden /> {text}
                  </span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={500}>
              <ScrollToLink
                targetId="catalogo-servicios"
                className="mt-12 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.12em] text-[#C7CBD1] hover:text-white transition-colors"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#3A3F45] bg-[#1D2024]">
                  <ChevronDown className="h-5 w-5" />
                </span>
                Explorar servicios
              </ScrollToLink>
            </Reveal>
          </div>
          <Reveal delay={300}>
            <ServiciosShowcase />
          </Reveal>
        </div>
      </div>
    </section>
  );
}