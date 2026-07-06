"use client";

import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";

// Datos de proyectos destacados (puedes mover esto a un archivo separado si quieres)
const proyectosDestacados = [
  {
    id: "qantua",
    nombre: "Qantua - Fase 1 y 2",
    cliente: "Grupo LAR",
    monto: "S/ 543,667.29",
    descripcion:
      "Fabricación e instalación de barandas metálicas, pasamanos, estructuras de azotea, vigas comerciales y chute metálico para proyecto residencial multifamiliar de gran escala.",
    tags: ["Barandas", "Estructuras", "Chute Metálico"],
  },
  {
    id: "zendai",
    nombre: "Zendai",
    cliente: "Desarrollo Plaza Grau S.A.C.",
    monto: "S/ 173,855.30",
    descripcion:
      "Fabricación e instalación de barandas metálicas para fachada frontal, lateral izquierda y derecha, incluyendo parantes estructurales.",
    tags: ["Barandas", "Fachadas", "Estructuras"],
  },
  {
    id: "hilton",
    nombre: "Hilton MDP",
    cliente: "MDP CONSTRUCCIONES S.A.C.",
    monto: "S/ 20,768.00",
    descripcion:
      "Fabricación e instalación de chute metálico de 19 pisos para el proyecto Hilton MDP en Chacarilla, Surco.",
    tags: ["Chute Metálico", "Estructuras"],
  },
];

export default function Proyectos() {
  return (
    <section className="py-20 bg-gray-50" id="proyectos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-orange-500 bg-orange-50 px-4 py-2 rounded-full mb-4">
            Portafolio
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Proyectos que nos{" "}
            <span className="text-orange-500">respaldan</span>
          </h2>
          <p className="text-lg text-gray-600">
            Conoce algunos de los proyectos más importantes que hemos ejecutado
            con los más altos estándares de calidad.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {proyectosDestacados.map((proyecto) => (
            <div
              key={proyecto.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image / Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <Building2 className="h-12 w-12 text-gray-300" />
                </div>
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-lg">
                  <p className="text-xs font-semibold text-white">{proyecto.monto}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {proyecto.nombre}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{proyecto.cliente}</p>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {proyecto.descripcion}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {proyecto.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/proyectos/${proyecto.id}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors group/link"
                >
                  Ver más
                  <ArrowRight className="h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/proyectos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            Ver todos los proyectos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}