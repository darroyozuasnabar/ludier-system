"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import Link from "next/link";

const projects = [
  { title: "Proyecto Qantua", img: "/img/Qantua.jpg", link: "/proyectos/qantua" },
  { title: "Hotel Hilton", img: "/img/hilton-lima-miraflores.jpg", link: "/proyectos/hilton" },
  { title: "Edificio Zendai", img: "/img/zendai.png", link: "/proyectos/zendai" },
];

export default function ServiciosShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Sensibilidad del 3D (más alto = más inclinación)
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center"
      style={{ perspective: "1000px" }}
    >
      <div
        className="grid w-full max-w-lg grid-cols-1 gap-4 transition-transform duration-200 ease-out sm:grid-cols-2"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {projects.map((project, i) => (
          <Link
            key={i}
            href={project.link}
            className={`group relative overflow-hidden rounded-xl border border-[#3A3F45] bg-[#1D2024] shadow-2xl transition-all duration-500 ${
              i === 0 ? "sm:col-span-2 aspect-[2/1]" : "aspect-[4/3]"
            }`}
            style={{ transform: "translateZ(20px)" }}
          >
            <Image
              src={project.img}
              alt={project.title}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-sm font-semibold text-white">{project.title}</p>
              <p className="mt-1 text-xs text-[#FF5A1F] font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Ver proyecto →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}