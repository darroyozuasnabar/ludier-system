// app/reportes/components/ReportContratos.tsx
"use client";

interface Contrato {
  id: string;
  nombre: string;
  monto: number | string;
  fecha: string;
  tipo?: string;
  estado: "ACTIVO" | "FINALIZADO" | "CANCELADO" | string;
  ordenEstrategico?: number;
  costoReal?: number; // suma agregada desde CostoReal por contratoNombre
}

interface ReportContratosProps {
  data: Contrato[];
  isAdmin?: boolean;
}

const ESTADO_LABELS: Record<string, string> = {
  ACTIVO: "Activo",
  FINALIZADO: "Finalizado",
  CANCELADO: "Cancelado",
};

const ESTADO_DOT: Record<string, string> = {
  ACTIVO: "bg-blue-500",
  FINALIZADO: "bg-emerald-500",
  CANCELADO: "bg-gray-400",
};

const ESTADO_TEXT: Record<string, string> = {
  ACTIVO: "text-blue-700",
  FINALIZADO: "text-emerald-700",
  CANCELADO: "text-gray-500",
};

const PRIORITARIO_UMBRAL = 10; // orden_estrategico por debajo de esto se marca como prioritario

export default function ReportContratos({ data, isAdmin = true }: ReportContratosProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-sm text-gray-500">
        No hay contratos registrados para este proyecto
      </div>
    );
  }

  const total = data.reduce((s, c) => s + Number(c.monto), 0);
  const costoRealTotal = data.reduce((s, c) => s + (c.costoReal ?? 0), 0);
  const margenTotal = total - costoRealTotal;
  const margenPctTotal = total > 0 ? (margenTotal / total) * 100 : 0;
  const activos = data.filter((c) => c.estado === "ACTIVO").length;

  return (
    <div>
      {/* Resumen */}
      <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border border-gray-200 rounded-md mb-5">
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Total contratado</p>
          <p className="text-lg font-semibold text-gray-900">
            S/ {total.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Activos</p>
          <p className="text-lg font-semibold text-gray-900">
            {activos}
            <span className="text-sm font-normal text-gray-400"> / {data.length}</span>
          </p>
        </div>
        {isAdmin && (
          <>
            <div className="flex-1 px-4 py-3">
              <p className="text-xs text-gray-500 mb-0.5">Costo real</p>
              <p className="text-lg font-semibold text-gray-900">
                S/ {costoRealTotal.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="flex-1 px-4 py-3">
              <p className="text-xs text-gray-500 mb-0.5">Margen</p>
              <p className={`text-lg font-semibold ${margenTotal >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                {margenPctTotal.toFixed(1)}%
              </p>
            </div>
          </>
        )}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/60">
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Fecha</th>
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Contrato</th>
              <th className="text-right py-2.5 px-3 font-medium text-gray-500">Monto</th>
              {isAdmin && (
                <>
                  <th className="text-right py-2.5 px-3 font-medium text-gray-500">Costo real</th>
                  <th className="text-right py-2.5 px-3 font-medium text-gray-500">Margen</th>
                </>
              )}
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Tipo</th>
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((c) => {
              const monto = Number(c.monto);
              const costoReal = c.costoReal ?? 0;
              const tieneCosto = c.costoReal !== undefined && c.costoReal !== null;
              const margen = monto - costoReal;
              const margenPct = monto > 0 ? (margen / monto) * 100 : 0;
              const prioritario =
                c.ordenEstrategico !== undefined && c.ordenEstrategico < PRIORITARIO_UMBRAL;

              return (
                <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-2.5 px-3 text-gray-500 text-xs whitespace-nowrap">
                    {new Date(c.fecha).toLocaleDateString("es-PE")}
                  </td>
                  <td className="py-2.5 px-3 text-gray-900 font-medium">
                    <div className="flex items-center gap-1.5">
                      {c.nombre}
                      {prioritario && (
                        <span
                          title="Contrato prioritario"
                          className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"
                        />
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right text-gray-900 font-medium tabular-nums">
                    S/ {monto.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                  </td>
                  {isAdmin && (
                    <>
                      <td className="py-2.5 px-3 text-right text-gray-700 tabular-nums">
                        {tieneCosto
                          ? `S/ ${costoReal.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`
                          : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums">
                        {tieneCosto ? (
                          <span className={margen >= 0 ? "text-emerald-700" : "text-red-700"}>
                            {margenPct.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    </>
                  )}
                  <td className="py-2.5 px-3 text-gray-500 text-xs">{c.tipo || "Contrato"}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium ${
                        ESTADO_TEXT[c.estado] ?? "text-gray-600"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${ESTADO_DOT[c.estado] ?? "bg-gray-400"}`} />
                      {ESTADO_LABELS[c.estado] ?? c.estado}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200 bg-gray-50/60">
              <td colSpan={2} className="py-2.5 px-3 font-semibold text-gray-900">
                Total
              </td>
              <td className="py-2.5 px-3 text-right font-semibold text-gray-900 tabular-nums">
                S/ {total.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
              </td>
              {isAdmin && (
                <>
                  <td className="py-2.5 px-3 text-right font-semibold text-gray-900 tabular-nums">
                    S/ {costoRealTotal.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold tabular-nums">
                    <span className={margenTotal >= 0 ? "text-emerald-700" : "text-red-700"}>
                      {margenPctTotal.toFixed(1)}%
                    </span>
                  </td>
                </>
              )}
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}