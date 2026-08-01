// app/reportes/components/ReportAvance.tsx
"use client";

interface Contrato {
  contrato: string;
  total: number;
  cobrado: number;
  pendiente: number;
  avance: number;
  estado: "COBRADO" | "ACTIVO" | string;
}

interface ReportAvanceProps {
  data: Contrato[];
  isAdmin: boolean;
}

export function ReportAvance({ data, isAdmin }: ReportAvanceProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-sm text-gray-500">
        No hay datos de avance de obra para este proyecto
      </div>
    );
  }

  const total = data.reduce((s, c) => s + c.total, 0);
  const cobrado = data.reduce((s, c) => s + c.cobrado, 0);
  const avanceGeneral = total > 0 ? (cobrado / total) * 100 : 0;

  return (
    <div>
      {/* Resumen — como fila de stats con separadores, no cards sueltas */}
      <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border border-gray-200 rounded-md mb-5">
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">
            {isAdmin ? "Total contratado" : "Contratos"}
          </p>
          <p className="text-lg font-semibold text-gray-900">
            {isAdmin ? `S/ ${total.toLocaleString("es-PE", { minimumFractionDigits: 2 })}` : data.length}
          </p>
        </div>
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Cobrado</p>
          <p className="text-lg font-semibold text-gray-900">
            {isAdmin ? `S/ ${cobrado.toLocaleString("es-PE", { minimumFractionDigits: 2 })}` : "—"}
          </p>
        </div>
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Avance general</p>
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold text-gray-900">{avanceGeneral.toFixed(1)}%</p>
            <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden max-w-[80px]">
              <div
                className="h-full bg-gray-900 rounded-full"
                style={{ width: `${Math.min(avanceGeneral, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/60">
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Contrato</th>
              {isAdmin && (
                <>
                  <th className="text-right py-2.5 px-3 font-medium text-gray-500">Total</th>
                  <th className="text-right py-2.5 px-3 font-medium text-gray-500">Cobrado</th>
                  <th className="text-right py-2.5 px-3 font-medium text-gray-500">Pendiente</th>
                </>
              )}
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Avance</th>
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((c, i) => (
              <tr key={c.contrato ?? i} className="hover:bg-gray-50/60 transition-colors">
                <td className="py-2.5 px-3 text-gray-900 font-medium">{c.contrato}</td>
                {isAdmin && (
                  <>
                    <td className="py-2.5 px-3 text-right text-gray-700 tabular-nums">
                      S/ {c.total.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-gray-700 tabular-nums">
                      S/ {c.cobrado.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-gray-700 tabular-nums">
                      S/ {c.pendiente.toFixed(2)}
                    </td>
                  </>
                )}
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-800 rounded-full"
                        style={{ width: `${Math.min(c.avance, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 tabular-nums">{c.avance.toFixed(0)}%</span>
                  </div>
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium ${
                      c.estado === "COBRADO" ? "text-emerald-700" : "text-amber-700"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        c.estado === "COBRADO" ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    {c.estado === "COBRADO" ? "Cobrado" : "Activo"}
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