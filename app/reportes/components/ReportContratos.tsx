// app/reportes/components/ReportContratos.tsx

"use client";

interface Contrato {
  fecha: string;
  nombre: string;
  monto: number | string;
  tipo?: string;
  estado: "COBRADO" | "PENDIENTE" | "ACTIVO" | string;
}

interface ReportContratosProps {
  data: Contrato[];
}

const ESTADO_LABELS: Record<string, string> = {
  COBRADO: "Cobrado",
  PENDIENTE: "Pendiente",
  ACTIVO: "Activo",
};

const ESTADO_DOT: Record<string, string> = {
  COBRADO: "bg-emerald-500",
  PENDIENTE: "bg-amber-500",
  ACTIVO: "bg-amber-500",
};

const ESTADO_TEXT: Record<string, string> = {
  COBRADO: "text-emerald-700",
  PENDIENTE: "text-amber-700",
  ACTIVO: "text-amber-700",
};

export default function ReportContratos({ data }: ReportContratosProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-sm text-gray-500">
        No hay contratos registrados para este proyecto
      </div>
    );
  }

  const total = data.reduce((s, c) => s + Number(c.monto), 0);
  const cobrados = data.filter((c) => c.estado === "COBRADO").length;
  const pendientes = data.filter((c) => c.estado === "PENDIENTE" || c.estado === "ACTIVO").length;

  return (
    <div>
      {/* Resumen */}
      <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border border-gray-200 rounded-md mb-5">
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Total contratos</p>
          <p className="text-lg font-semibold text-gray-900">{data.length}</p>
        </div>
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Cobrados</p>
          <p className="text-lg font-semibold text-gray-900">
            {cobrados}
            <span className="text-sm font-normal text-gray-400"> / {data.length}</span>
          </p>
        </div>
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Pendientes</p>
          <p className="text-lg font-semibold text-gray-900">{pendientes}</p>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/60">
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Fecha</th>
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Contrato</th>
              <th className="text-right py-2.5 px-3 font-medium text-gray-500">Monto</th>
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Tipo</th>
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((c, i) => (
              <tr key={`${c.nombre}-${i}`} className="hover:bg-gray-50/60 transition-colors">
                <td className="py-2.5 px-3 text-gray-500 text-xs whitespace-nowrap">
                  {new Date(c.fecha).toLocaleDateString("es-PE")}
                </td>
                <td className="py-2.5 px-3 text-gray-900 font-medium">{c.nombre}</td>
                <td className="py-2.5 px-3 text-right text-gray-900 font-medium tabular-nums">
                  S/ {Number(c.monto).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                </td>
                <td className="py-2.5 px-3 text-gray-500 text-xs">{c.tipo || "Contrato"}</td>
                <td className="py-2.5 px-3">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium ${
                      ESTADO_TEXT[c.estado] ?? "text-gray-600"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${ESTADO_DOT[c.estado] ?? "bg-gray-400"}`} />
                    {ESTADO_LABELS[c.estado] ?? c.estado ?? "Pendiente"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200 bg-gray-50/60">
              <td colSpan={2} className="py-2.5 px-3 font-semibold text-gray-900">
                Total
              </td>
              <td className="py-2.5 px-3 text-right font-semibold text-gray-900 tabular-nums">
                S/ {total.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
              </td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}