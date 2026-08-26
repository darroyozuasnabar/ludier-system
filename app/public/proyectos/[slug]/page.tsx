// app/proyectos/[slug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { proyectosData } from "@/components/public/Proyectos"; // ✅ Ruta corregida
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Users,
  CheckCircle,
  Wrench,
  Shield,
  ExternalLink,
} from "lucide-react";

const FONT_DISPLAY = "var(--font-display, Oswald, sans-serif)";
const FONT_BODY = "var(--font-body, Inter, sans-serif)";
const FONT_MONO = 'var(--font-mono, "JetBrains Mono", monospace)';

// Mapeo de clientes a URLs
const clienteURLs: Record<string, string> = {
  "Grupo LAR": "https://grupolar.pe/",
  "MDP CONSTRUCCIONES S.A.C.": "https://mdpconstrucciones.com.pe/",
  "Flat Canevaro S.A.C.": "https://flat-peru.com/",
};

export default function ProyectoDetalle() {
  const { slug } = useParams();
  const proyecto = proyectosData.find((p) => p.slug === slug);

  if (!proyecto) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F4]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#1E2126]">
            Proyecto no encontrado
          </h1>
          <Link
            href="/proyectos"
            className="mt-4 inline-flex items-center gap-2 text-[#FF5A1F] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a proyectos
          </Link>
        </div>
      </div>
    );
  }

  const clienteURL = clienteURLs[proyecto.cliente] || null;

  return (
    <div
      className="min-h-screen bg-[#F7F7F4]"
      style={{ fontFamily: FONT_BODY }}
    >
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link
          href="/proyectos"
          className="inline-flex items-center gap-2 text-[#FF5A1F] hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a proyectos
        </Link>

        <h1
          className="text-4xl font-bold text-[#1E2126] mb-4"
          style={{ fontFamily: FONT_DISPLAY }}
        >
          {proyecto.titulo}
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-[#FF5A1F] mt-0.5" />
            <div>
              <p className="text-xs text-[#8B8F86] uppercase tracking-wider">
                Cliente
              </p>
              <p className="font-medium text-[#1E2126]">{proyecto.cliente}</p>
              {clienteURL && (
                <a
                  href={clienteURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-1 text-sm text-[#FF5A1F] hover:underline transition-colors"
                >
                  Visitar sitio web <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#FF5A1F] mt-0.5" />
            <div>
              <p className="text-xs text-[#8B8F86] uppercase tracking-wider">
                Ubicación
              </p>
              <p className="font-medium text-[#1E2126]">{proyecto.ubicacion}</p>
            </div>
          </div>
        </div>

        <div className="relative h-96 rounded-sm overflow-hidden border border-[#E3E1D8] mb-8">
          <img
            src={proyecto.imagen}
            alt={proyecto.titulo}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="bg-white p-6 rounded-sm border border-[#E3E1D8] mb-8">
          <h2
            className="text-xl font-semibold mb-3 text-[#1E2126]"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            Servicios ejecutados
          </h2>
          <ul className="grid sm:grid-cols-2 gap-2">
            {proyecto.servicios.map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-[#1E2126]" // ✅ Texto oscuro
              >
                <CheckCircle className="w-4 h-4 text-[#FF5A1F] shrink-0 mt-0.5" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#FF5A1F]/5 p-6 rounded-sm border border-[#FF5A1F]/20">
          <h2
            className="text-xl font-semibold mb-2 text-[#1E2126]"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            Resultado
          </h2>
          <p className="text-[#1E2126]">{proyecto.resultado}</p> {/* ✅ Texto oscuro */}
        </div>

        {clienteURL && (
          <div className="mt-8 pt-6 border-t border-[#E3E1D8] text-center">
            <a
              href={clienteURL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#FF5A1F] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#FF5A1F]/20 transition-all hover:bg-[#FF7A44] hover:shadow-[#FF5A1F]/40 hover:-translate-y-1"
            >
              <Building2 className="w-4 h-4" />
              Visitar sitio del cliente
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}