// app/reportes/components/ReportProduccion.tsx
"use client";

interface OrdenProduccion {
  nombre: string;
  tipo: string;
  cantidad: number;
  base_completada: boolean;
  acabado_completado: boolean;
  estado: "COMPLETADO" | "EN_PRODUCCION" | "EN_INSTALACION" | "EN_PINTURA" | "PAUSADO" | string;
}

interface ReportProduccionProps {
  data: OrdenProduccion[];
}

const ESTADO_LABELS: Record<string, string> = {
  COMPLETADO: "Completado",
  EN_PRODUCCION: "En producción",
  EN_INSTALACION: "En instalación",
  EN_PINTURA: "En pintura",
  PAUSADO: "Pausado",
};

const ESTADO_STYLES: Record<string, string> = {
  COMPLETADO: "text-emerald-700 bg-emerald-500",
  EN_PRODUCCION: "text-blue-700 bg-blue-500",
  EN_INSTALACION: "text-blue-700 bg-blue-500",
  EN_PINTURA: "text-purple-700 bg-purple-500",
  PAUSADO: "text-red-700 bg-red-500",
};

function CheckMark({ done }: { done: boolean }) {
  return (
    <svg
      className={`w-4 h-4 mx-auto ${done ? "text-emerald-600" : "text-gray-300"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      {done ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      )}
    </svg>
  );
}

export function ReportProduccion({ data }: ReportProduccionProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-sm text-gray-500">
        No hay órdenes de producción para este proyecto
      </div>
    );
  }

  const completados = data.filter((o) => o.estado === "COMPLETADO").length;
  const enProceso = data.filter(
    (o) => o.estado === "EN_PRODUCCION" || o.estado === "EN_INSTALACION"
  ).length;

  return (
    <div>
      {/* Resumen */}
      <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border border-gray-200 rounded-md mb-5">
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Total órdenes</p>
          <p className="text-lg font-semibold text-gray-900">{data.length}</p>
        </div>
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Completadas</p>
          <p className="text-lg font-semibold text-gray-900">
            {completados}
            <span className="text-sm font-normal text-gray-400"> / {data.length}</span>
          </p>
        </div>
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">En proceso</p>
          <p className="text-lg font-semibold text-gray-900">{enProceso}</p>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/60">
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Orden</th>
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Tipo</th>
              <th className="text-right py-2.5 px-3 font-medium text-gray-500">Cantidad</th>
              <th className="text-center py-2.5 px-3 font-medium text-gray-500">Base</th>
              <th className="text-center py-2.5 px-3 font-medium text-gray-500">Acabado</th>
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((o, i) => (
              <tr key={`${o.nombre}-${i}`} className="hover:bg-gray-50/60 transition-colors">
                <td className="py-2.5 px-3 text-gray-900 font-medium">{o.nombre}</td>
                <td className="py-2.5 px-3 text-gray-500 text-xs">{o.tipo}</td>
                <td className="py-2.5 px-3 text-right text-gray-700 font-medium tabular-nums">
                  {o.cantidad}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <CheckMark done={o.base_completada} />
                </td>
                <td className="py-2.5 px-3 text-center">
                  <CheckMark done={o.acabado_completado} />
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium ${
                      ESTADO_STYLES[o.estado]?.split(" ")[0] ?? "text-gray-700"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        ESTADO_STYLES[o.estado]?.split(" ")[1] ?? "bg-gray-400"
                      }`}
                    />
                    {ESTADO_LABELS[o.estado] ?? o.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}