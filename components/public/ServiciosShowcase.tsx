"use client";

import { useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

const OBRAS = [
  {
    name: "Qantua",
    location: "Cercado de Lima",
    scope: "Barandas, estructuras y cerramientos",
    image: "/img/proyectos/qantua/28-vistaIntegralQantuaF1&F2.jpeg",
    alt: "Vista de las torres de Qantua con barandas y cerramientos ejecutados por LUDIER",
    href: "/proyectos/qantua",
  },
  {
    name: "Hotel Hilton",
    location: "Surco",
    scope: "Chutes metálicos para obra",
    image: "/img/proyectos/Hotel_Hilton/ChuteMetalicoHotelHilton_img1.jpeg",
    alt: "Chute metálico instalado por LUDIER en la obra del Hotel Hilton",
    href: "/proyectos/hilton",
  },
  {
    name: "Zendai",
    location: "La Victoria",
    scope: "Barandas metálicas para balcones",
    image: "/img/proyectos/zendai/zendai_img1.png",
    alt: "Barandas metálicas instaladas por LUDIER en el edificio Zendai",
    href: "/proyectos/zendai",
  },
];

export default function ServiciosShowcase() {
  const [active, setActive] = useState(0);
  const frame = useRef<HTMLDivElement>(null);
  const obra = OBRAS[active];

  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const element = frame.current;
    if (!element) return;
    const bounds = element.getBoundingClientRect();
    element.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
    element.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
  }

  return (
    <div className="ludier-showcase" role="region" aria-label="Explora obras reales de LUDIER">
      <div className="flex items-center justify-between gap-3 border-b border-[#3A3F45] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#C7CBD1]">
        <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 bg-[#FF5A1F]" aria-hidden />Del taller a la obra</span>
        <span>{String(active + 1).padStart(2, "0")} / 03</span>
      </div>
      <div ref={frame} onPointerMove={move} className="ludier-showcase-frame">
        <div key={obra.image} className="ludier-showcase-slide is-active">
          <Image
            src={obra.image}
            alt={obra.alt}
            fill
            sizes="(min-width: 1280px) 580px, (min-width: 1024px) 45vw, 100vw"
            loading="eager"
            className="object-cover"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#14161A] via-transparent to-black/10" aria-hidden />
        <div className="ludier-showcase-spotlight" aria-hidden />
        <div className="ludier-showcase-crosshair" aria-hidden>
          <svg viewBox="0 0 100 100" fill="none"><path d="M0 16V0H16M84 0H100V16M100 84V100H84M16 100H0V84" stroke="currentColor" strokeWidth="0.7" /><path className="ludier-showcase-trace" d="M12 72L38 45L60 58L88 23" stroke="currentColor" strokeWidth="0.5" strokeDasharray="130" /></svg>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6" aria-live="polite" aria-atomic="true">
          <p key={obra.name} className="ludier-showcase-caption">
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.14em] text-white/75">{obra.location}</span>
            <span className="block text-2xl font-semibold text-white">{obra.name}</span>
            <span className="mt-1 block text-sm text-white/85">{obra.scope}</span>
          </p>
          <Link href={obra.href} className="mt-4 inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5A1F]">
            Ver obra ejecutada <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-3 border-t border-[#3A3F45]">
        {OBRAS.map((project, index) => (
          <button
            key={project.name}
            type="button"
            aria-label={`Mostrar obra ${project.name}`}
            aria-pressed={index === active}
            onClick={() => setActive(index)}
            className={`ludier-showcase-tab ${index === active ? "is-active" : ""}`}
          >
            <span className="font-mono text-[10px] text-[#8A8F96]">0{index + 1}</span>
            <span className="text-xs font-medium">{project.name}</span>
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-[#3A3F45] px-4 py-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#8A8F96]">Explora nuestros trabajos</span>
        <div className="flex gap-1">
          <button type="button" aria-label="Obra anterior" onClick={() => setActive((active + OBRAS.length - 1) % OBRAS.length)} className="ludier-showcase-arrow"><ChevronLeft className="h-4 w-4" aria-hidden /></button>
          <button type="button" aria-label="Siguiente obra" onClick={() => setActive((active + 1) % OBRAS.length)} className="ludier-showcase-arrow"><ChevronRight className="h-4 w-4" aria-hidden /></button>
        </div>
      </div>
    </div>
  );
}
