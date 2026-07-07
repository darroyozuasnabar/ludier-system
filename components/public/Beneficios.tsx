// components/public/Beneficios.tsx
"use client";

import { Shield, Award, Clock, Users, ThumbsUp, Wrench } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const beneficios = [
  {
    icon: Shield,
    titulo: "Calidad garantizada",
    descripcion: "Acabados superiores y materiales de primera calidad en cada proyecto.",
  },
  {
    icon: Clock,
    titulo: "Cumplimiento de plazos",
    descripcion: "Entregas puntuales gracias a una planificación rigurosa.",
  },
  {
    icon: Users,
    titulo: "Equipo especializado",
    descripcion: "Personal técnico certificado con años de experiencia.",
  },
  {
    icon: Award,
    titulo: "Experiencia comprobada",
    descripcion: "Más de 10 años en el sector y 20+ proyectos ejecutados.",
  },
];

function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

export default function Beneficios() {
  const { ref, inView } = useScrollReveal<HTMLDivElement>();

  return (
    <section className="bg-[#14161A] py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 650ms ease-out, transform 650ms ease-out",
          }}
        >
          {beneficios.map((beneficio, index) => {
            const Icon = beneficio.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 border border-[#3A3F45] bg-[#1D2024] rounded-sm transition-colors hover:border-[#FF5A1F]/40"
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-sm bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 mb-4">
                  <Icon className="h-6 w-6 text-[#FF5A1F]" />
                </div>
                <h3
                  className="text-lg font-semibold text-white mb-2"
                  style={{
                    fontFamily: "var(--font-display, Oswald, ui-sans-serif, sans-serif)",
                  }}
                >
                  {beneficio.titulo}
                </h3>
                <p className="text-sm text-[#9AA0A6] leading-relaxed">
                  {beneficio.descripcion}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}