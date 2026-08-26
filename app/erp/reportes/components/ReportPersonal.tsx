// app/reportes/components/ReportPersonal.tsx
"use client";

interface Trabajador {
  id: string;
  name: string;
  role: string;
  location: string;
  active: boolean;
  tipoPago: "DIARIO" | "MENSUAL" | string;
  tarifaDiaria?: number | string;
  tarifaMensual?: number | string;
  cuadrilla?: string | null;
  pagoPendiente?: boolean;
}

interface ReportPersonalProps {
  data: Trabajador[];
  isAdmin: boolean;
}

function tarifaDisplay(w: Trabajador): string {
  if (w.tipoPago === "MENSUAL") {
    return `S/ ${Number(w.tarifaMensual || 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}/mes`;
  }
  return `S/ ${Number(w.tarifaDiaria || 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}/día`;
}

export default function ReportPersonal({ data, isAdmin }: ReportPersonalProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-sm text-gray-500">
        No hay personal registrado para este proyecto
      </div>
    );
  }

  const total = data.length;
  const activos = data.filter((w) => w.active).length;
  const pagosPendientes = data.filter((w) => w.active && w.pagoPendiente).length;

  const roles = data.reduce<Record<string, number>>((acc, w) => {
    acc[w.role] = (acc[w.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      {/* Resumen */}
      <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border border-gray-200 rounded-md mb-4">
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Total personal</p>
          <p className="text-lg font-semibold text-gray-900">{total}</p>
        </div>
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Activos</p>
          <p className="text-lg font-semibold text-gray-900">
            {activos}
            <span className="text-sm font-normal text-gray-400"> / {total}</span>
          </p>
        </div>
        {isAdmin && (
          <div className="flex-1 px-4 py-3">
            <p className="text-xs text-gray-500 mb-0.5">Pagos pendientes</p>
            <p className={`text-lg font-semibold ${pagosPendientes > 0 ? "text-amber-700" : "text-gray-900"}`}>
              {pagosPendientes}
            </p>
          </div>
        )}
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Por rol</p>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
            {Object.entries(roles).map(([rol, count]) => (
              <span key={rol} className="text-sm text-gray-700">
                <span className="font-semibold text-gray-900">{count}</span> {rol}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/60">
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Nombre</th>
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Rol</th>
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Cuadrilla</th>
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Ubicación</th>
              {isAdmin && (
                <th className="text-right py-2.5 px-3 font-medium text-gray-500">Tarifa</th>
              )}
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((w) => (
              <tr key={w.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="py-2.5 px-3 text-gray-900 font-medium">{w.name}</td>
                <td className="py-2.5 px-3 text-gray-600">{w.role}</td>
                <td className="py-2.5 px-3 text-gray-500 text-xs">
                  {w.cuadrilla ?? <span className="text-gray-300">—</span>}
                </td>
                <td className="py-2.5 px-3 text-gray-600">{w.location}</td>
                {isAdmin && (
                  <td className="py-2.5 px-3 text-right text-gray-900 font-medium tabular-nums whitespace-nowrap">
                    {tarifaDisplay(w)}
                  </td>
                )}
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium ${
                        w.active ? "text-emerald-700" : "text-gray-500"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${w.active ? "bg-emerald-500" : "bg-gray-400"}`} />
                      {w.active ? "Activo" : "Inactivo"}
                    </span>
                    {isAdmin && w.active && w.pagoPendiente && (
                      <span className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded px-1.5 py-0.5">
                        Pago pendiente
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}