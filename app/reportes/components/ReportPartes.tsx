// app/reportes/components/ReportPartes.tsx

"use client";

interface ParteDiario {
  fecha: string;
  actividades: number;
  horas: number;
  supervisor?: string;
  resumen?: string;
}

interface ReportPartesProps {
  data: ParteDiario[];
}

export default function ReportPartes({ data }: ReportPartesProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-sm text-gray-500">
        No hay partes diarios registrados para este proyecto
      </div>
    );
  }

  const totalActividades = data.reduce((s, p) => s + p.actividades, 0);
  const totalHoras = data.reduce((s, p) => s + p.horas, 0);

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
          <p className="text-xs text-gray-500 mb-0.5">Total horas</p>
          <p className="text-lg font-semibold text-gray-900">{totalHoras.toFixed(1)}h</p>
        </div>
      </div>

      {/* Lista de partes */}
      <div className="space-y-2">
        {data.map((p, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-md p-4 hover:bg-gray-50/60 transition-colors"
          >
            <div className="flex items-center gap-3 flex-wrap">
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
                {p.actividades} {p.actividades === 1 ? "actividad" : "actividades"} · {p.horas.toFixed(1)}h
              </span>
            </div>
            {p.resumen && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">{p.resumen}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}