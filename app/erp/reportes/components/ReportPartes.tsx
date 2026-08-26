// app/reportes/components/ReportPartes.tsx
"use client";

import { useState } from "react";

interface ActividadTrabajador {
  worker: string;
  actividad: string;
  horas: number;
}

interface ParteDiario {
  id: string;
  fecha: string;
  supervisor?: string | null;
  resumen?: string | null;
  observaciones?: string | null;
  actividades: ActividadTrabajador[];
}

interface ReportPartesProps {
  data: ParteDiario[];
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${open ? "rotate-90" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function ReportPartes({ data }: ReportPartesProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-sm text-gray-500">
        No hay partes diarios registrados para este proyecto
      </div>
    );
  }

  const totalActividades = data.reduce((s, p) => s + p.actividades.length, 0);
  const totalHoras = data.reduce(
    (s, p) => s + p.actividades.reduce((sh, a) => sh + a.horas, 0),
    0
  );
  const trabajadoresUnicos = new Set(
    data.flatMap((p) => p.actividades.map((a) => a.worker))
  ).size;

  return (
    <div>
      {/* Resumen */}
      <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border border-gray-200 rounded-md mb-4">
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Total partes</p>
          <p className="text-lg font-semibold text-gray-900">{data.length}</p>
        </div>
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Actividades</p>
          <p className="text-lg font-semibold text-gray-900">{totalActividades}</p>
        </div>
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Trabajadores</p>
          <p className="text-lg font-semibold text-gray-900">{trabajadoresUnicos}</p>
        </div>
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Total horas</p>
          <p className="text-lg font-semibold text-gray-900">{totalHoras.toFixed(1)}h</p>
        </div>
      </div>

      {/* Lista de partes */}
      <div className="space-y-2">
        {data.map((p) => {
          const isOpen = expandedId === p.id;
          const horasParte = p.actividades.reduce((s, a) => s + a.horas, 0);

          return (
            <div key={p.id} className="border border-gray-200 rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedId(isOpen ? null : p.id)}
                className="w-full text-left p-4 hover:bg-gray-50/60 transition-colors"
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <ChevronIcon open={isOpen} />
                  <span className="text-sm font-semibold text-gray-900">
                    {new Date(p.fecha).toLocaleDateString("es-PE", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                  {p.supervisor && (
                    <>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs text-gray-500">{p.supervisor}</span>
                    </>
                  )}
                  <span className="text-gray-300">·</span>
                  <span className="text-xs text-gray-500">
                    {p.actividades.length}{" "}
                    {p.actividades.length === 1 ? "actividad" : "actividades"} · {horasParte.toFixed(1)}h
                  </span>
                </div>
                {p.resumen && (
                  <p className="text-sm text-gray-600 mt-2 ml-7 line-clamp-2">{p.resumen}</p>
                )}
              </button>

              {isOpen && (
                <div className="border-t border-gray-100 bg-gray-50/40 px-4 py-3">
                  {p.observaciones && (
                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded px-2.5 py-1.5 mb-3">
                      {p.observaciones}
                    </p>
                  )}
                  {p.actividades.length === 0 ? (
                    <p className="text-xs text-gray-400 py-1">Sin actividades registradas</p>
                  ) : (
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-gray-500">
                          <th className="text-left font-medium py-1.5 pr-3">Trabajador</th>
                          <th className="text-left font-medium py-1.5 pr-3">Actividad</th>
                          <th className="text-right font-medium py-1.5">Horas</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {p.actividades.map((a, idx) => (
                          <tr key={idx}>
                            <td className="py-1.5 pr-3 text-gray-900 font-medium">{a.worker}</td>
                            <td className="py-1.5 pr-3 text-gray-600">{a.actividad}</td>
                            <td className="py-1.5 text-right text-gray-700 tabular-nums">
                              {a.horas.toFixed(1)}h
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}