"use client";

import { Wrench, Shield, Building2, DoorOpen, Fence, Gauge, ArrowRight } from "lucide-react";
import Link from "next/link";

const servicios = [
  { icon: Building2, title: "Estructuras Metálicas", description: "Fabricación e instalación de estructuras metálicas para proyectos residenciales, comerciales e industriales.", color: "orange" },
  { icon: Shield, title: "Barandas Metálicas", description: "Barandas de seguridad y decorativas para balcones, escaleras y terrazas con acabados de alta calidad.", color: "blue" },
  { icon: Gauge, title: "Escaleras Metálicas", description: "Escaleras de evacuación, marineras y comerciales con diseño estructural y acabado profesional.", color: "emerald" },
  { icon: DoorOpen, title: "Portones y Puertas", description: "Portones metálicos, puertas de seguridad y cerramientos para proyectos residenciales e industriales.", color: "purple" },
  { icon: Fence, title: "Cercos y Cerramientos", description: "Cercos metálicos, cerramientos perimetrales y mallas de seguridad para obras y propiedades.", color: "amber" },
  { icon: Wrench, title: "Fabricación a Medida", description: "Soluciones personalizadas: rejillas, racks, estructuras para ascensores y elementos complementarios.", color: "red" },
];

const colorMap: Record<string, string> = {
  orange: "bg-orange-50 text-orange-600 border-orange-200",
  blue: "bg-blue-50 text-blue-600 border-blue-200",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
  purple: "bg-purple-50 text-purple-600 border-purple-200",
  amber: "bg-amber-50 text-amber-600 border-amber-200",
  red: "bg-red-50 text-red-600 border-red-200",
};

export default function Servicios() {
  return (
    <section className="py-20 bg-white" id="servicios">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-orange-500 bg-orange-50 px-4 py-2 rounded-full mb-4">Nuestros Servicios</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Soluciones integrales en <span className="text-orange-500">metalmecánica</span></h2>
          <p className="text-lg text-gray-600">Ofrecemos servicios de fabricación e instalación de estructuras metálicas con los más altos estándares de calidad y seguridad.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicios.map((servicio, index) => {
            const Icon = servicio.icon;
            return (
              <div key={index} className="group relative p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 border ${colorMap[servicio.color]}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{servicio.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{servicio.description}</p>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 rounded-b-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>
            );
          })}
        </div>
        <div className="text-center mt-12">
          <Link href="/contacto" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200/50">
            Cotizar ahora <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}