// app/proyectos/[slug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { proyectosData } from "../../../components/public/Proyectos";
import Link from "next/link";
import { ArrowLeft, Building2, MapPin, Users, CheckCircle, Wrench, Shield } from "lucide-react";

const FONT_DISPLAY = 'var(--font-display, Oswald, sans-serif)';
const FONT_BODY = 'var(--font-body, Inter, sans-serif)';

export default function ProyectoDetalle() {
  const { slug } = useParams();
  const proyecto = proyectosData.find(p => p.slug === slug); // Agrega un campo "slug" a tus datos

  if (!proyecto) return <div className="p-10 text-center">Proyecto no encontrado</div>;

  return (
    <div className="min-h-screen bg-[#F7F7F4]" style={{ fontFamily: FONT_BODY }}>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/proyectos" className="inline-flex items-center gap-2 text-[#FF5A1F] hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" /> Volver a proyectos
        </Link>

        <h1 className="text-4xl font-bold text-[#1E2126] mb-4" style={{ fontFamily: FONT_DISPLAY }}>
          {proyecto.titulo}
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-[#FF5A1F]" />
            <div>
              <p className="text-xs text-[#8B8F86] uppercase">Cliente</p>
              <p className="font-medium">{proyecto.cliente}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#FF5A1F]" />
            <div>
              <p className="text-xs text-[#8B8F86] uppercase">Ubicación</p>
              <p className="font-medium">{proyecto.ubicacion}</p>
            </div>
          </div>
        </div>

        <div className="relative h-96 rounded-sm overflow-hidden border border-[#E3E1D8] mb-8">
          <img src={proyecto.imagen} alt={proyecto.titulo} className="w-full h-full object-cover" />
        </div>

        <div className="bg-white p-6 rounded-sm border border-[#E3E1D8] mb-8">
          <h2 className="text-xl font-semibold mb-3" style={{ fontFamily: FONT_DISPLAY }}>Servicios ejecutados</h2>
          <ul className="grid sm:grid-cols-2 gap-2">
            {proyecto.servicios.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#565C63]">
                <CheckCircle className="w-4 h-4 text-[#FF5A1F] shrink-0 mt-0.5" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#FF5A1F]/5 p-6 rounded-sm border border-[#FF5A1F]/20">
          <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: FONT_DISPLAY }}>Resultado</h2>
          <p className="text-[#565C63]">{proyecto.resultado}</p>
        </div>
      </div>
    </div>
  );
}