// app/reportes/components/ReportProduccion.tsx
"use client";

interface OrdenProduccion {
  id: string;
  nombre: string;
  tipo: string;
  cantidad: number;
  unidad?: string;
  prioridad: "ALTA" | "MEDIA" | "BAJA" | string;
  estado: "COMPLETADO" | "EN_PRODUCCION" | "EN_INSTALACION" | "EN_PINTURA" | "PAUSADO" | string;
  fechaFin?: string | null;
  observaciones?: string | null;
  baseCompletada: boolean;
  acabadoCompletado: boolean;
  capacidadDiaria?: number | null;
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

const ESTADO_DOT: Record<string, string> = {
  COMPLETADO: "bg-emerald-500",
  EN_PRODUCCION: "bg-blue-500",
  EN_INSTALACION: "bg-blue-500",
  EN_PINTURA: "bg-purple-500",
  PAUSADO: "bg-red-500",
};

const ESTADO_TEXT: Record<string, string> = {
  COMPLETADO: "text-emerald-700",
  EN_PRODUCCION: "text-blue-700",
  EN_INSTALACION: "text-blue-700",
  EN_PINTURA: "text-purple-700",
  PAUSADO: "text-red-700",
};

const PRIORIDAD_DOT: Record<string, string> = {
  ALTA: "bg-red-500",
  MEDIA: "bg-amber-500",
  BAJA: "bg-gray-400",
};

const PRIORIDAD_TEXT: Record<string, string> = {
  ALTA: "text-red-700",
  MEDIA: "text-amber-700",
  BAJA: "text-gray-500",
};

const PRIORIDAD_LABELS: Record<string, string> = {
  ALTA: "Alta",
  MEDIA: "Media",
  BAJA: "Baja",
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

function isVencida(o: OrdenProduccion): boolean {
  if (!o.fechaFin || o.estado === "COMPLETADO") return false;
  return new Date(o.fechaFin) < new Date();
}

export default function ReportProduccion({ data }: ReportProduccionProps) {
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
  const vencidas = data.filter(isVencida).length;

  const ordenPrioridad: Record<string, number> = { ALTA: 0, MEDIA: 1, BAJA: 2 };
  const sorted = [...data].sort((a, b) => {
    const av = isVencida(a) ? 0 : 1;
    const bv = isVencida(b) ? 0 : 1;
    if (av !== bv) return av - bv;
    const ap = ordenPrioridad[a.prioridad] ?? 3;
    const bp = ordenPrioridad[b.prioridad] ?? 3;
    return ap - bp;
  });

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
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Vencidas</p>
          <p className={`text-lg font-semibold ${vencidas > 0 ? "text-red-700" : "text-gray-900"}`}>
            {vencidas}
          </p>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/60">
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Orden</th>
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Prioridad</th>
              <th className="text-right py-2.5 px-3 font-medium text-gray-500">Cantidad</th>
              <th className="text-center py-2.5 px-3 font-medium text-gray-500">Base</th>
              <th className="text-center py-2.5 px-3 font-medium text-gray-500">Acabado</th>
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Entrega</th>
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((o) => {
              const vencida = isVencida(o);
              const diasEstimados =
                o.capacidadDiaria && o.capacidadDiaria > 0
                  ? Math.ceil(o.cantidad / o.capacidadDiaria)
                  : null;

              return (
                <tr key={o.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-2.5 px-3">
                    <p className="text-gray-900 font-medium">{o.nombre}</p>
                    <p className="text-xs text-gray-400">
                      {o.tipo}
                      {diasEstimados !== null && ` · ~${diasEstimados}d al ritmo actual`}
                    </p>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium ${
                        PRIORIDAD_TEXT[o.prioridad] ?? "text-gray-500"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${PRIORIDAD_DOT[o.prioridad] ?? "bg-gray-400"}`} />
                      {PRIORIDAD_LABELS[o.prioridad] ?? o.prioridad}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-gray-700 font-medium tabular-nums">
                    {o.cantidad} <span className="text-xs font-normal text-gray-400">{o.unidad || "un."}</span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <CheckMark done={o.baseCompletada} />
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <CheckMark done={o.acabadoCompletado} />
                  </td>
                  <td className="py-2.5 px-3 text-xs">
                    {!o.fechaFin ? (
                      <span className="text-gray-300">—</span>
                    ) : vencida ? (
                      <span className="text-red-600 font-medium">
                        {new Date(o.fechaFin).toLocaleDateString("es-PE")}
                      </span>
                    ) : (
                      <span className="text-gray-500">
                        {new Date(o.fechaFin).toLocaleDateString("es-PE")}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium ${
                        ESTADO_TEXT[o.estado] ?? "text-gray-700"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${ESTADO_DOT[o.estado] ?? "bg-gray-400"}`} />
                      {ESTADO_LABELS[o.estado] ?? o.estado}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}