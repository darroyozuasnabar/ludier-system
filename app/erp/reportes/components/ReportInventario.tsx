// app/reportes/components/ReportInventario.tsx
"use client";

interface ItemInventario {
  id: string;
  nombre: string;
  categoria: string;
  cantidad: number;
  stockMinimo: number;
  ubicacion: string;
  unidad: string;
  contenido?: string | null;
  proximoMantenimiento?: string | null;
}

interface ReportInventarioProps {
  data: ItemInventario[];
}

function mantenimientoVencido(item: ItemInventario): boolean {
  if (!item.proximoMantenimiento) return false;
  return new Date(item.proximoMantenimiento) < new Date();
}

function diasParaMantenimiento(fecha: string): number {
  const ms = new Date(fecha).getTime() - new Date().getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export default function ReportInventario({ data }: ReportInventarioProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-sm text-gray-500">
        No hay items en el inventario para este proyecto
      </div>
    );
  }

  const totalItems = data.length;
  const stockCritico = data.filter((item) => item.cantidad <= item.stockMinimo).length;
  const mantenimientoPendiente = data.filter(mantenimientoVencido).length;

  // Stock crítico y mantenimiento vencido primero, luego alfabético
  const sorted = [...data].sort((a, b) => {
    const aCritico = a.cantidad <= a.stockMinimo || mantenimientoVencido(a);
    const bCritico = b.cantidad <= b.stockMinimo || mantenimientoVencido(b);
    if (aCritico !== bCritico) return aCritico ? -1 : 1;
    return a.nombre.localeCompare(b.nombre);
  });

  return (
    <div>
      {/* Resumen */}
      <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border border-gray-200 rounded-md mb-4">
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Total items</p>
          <p className="text-lg font-semibold text-gray-900">{totalItems}</p>
        </div>
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Stock crítico</p>
          <p className={`text-lg font-semibold ${stockCritico > 0 ? "text-red-700" : "text-gray-900"}`}>
            {stockCritico}
          </p>
        </div>
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Mantenimiento vencido</p>
          <p className={`text-lg font-semibold ${mantenimientoPendiente > 0 ? "text-amber-700" : "text-gray-900"}`}>
            {mantenimientoPendiente}
          </p>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/60">
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Item</th>
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Categoría</th>
              <th className="text-right py-2.5 px-3 font-medium text-gray-500">Cantidad</th>
              <th className="text-right py-2.5 px-3 font-medium text-gray-500">Mínimo</th>
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Ubicación</th>
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Mantenimiento</th>
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((item) => {
              const stockBajo = item.cantidad <= item.stockMinimo;
              const vencido = mantenimientoVencido(item);
              const dias = item.proximoMantenimiento ? diasParaMantenimiento(item.proximoMantenimiento) : null;

              return (
                <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-2.5 px-3">
                    <p className="text-gray-900 font-medium">{item.nombre}</p>
                    {item.contenido && (
                      <p className="text-xs text-gray-400 mt-0.5">{item.contenido}</p>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-gray-500">{item.categoria}</td>
                  <td className="py-2.5 px-3 text-right font-medium text-gray-900 tabular-nums">
                    {item.cantidad} <span className="text-xs font-normal text-gray-400">{item.unidad || "un."}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-gray-500 tabular-nums">
                    {item.stockMinimo || 0}
                  </td>
                  <td className="py-2.5 px-3 text-gray-500">{item.ubicacion}</td>
                  <td className="py-2.5 px-3 text-xs">
                    {!item.proximoMantenimiento ? (
                      <span className="text-gray-300">—</span>
                    ) : vencido ? (
                      <span className="text-amber-600 font-medium">
                        Vencido hace {Math.abs(dias ?? 0)}d
                      </span>
                    ) : dias !== null && dias <= 7 ? (
                      <span className="text-amber-600">En {dias}d</span>
                    ) : (
                      <span className="text-gray-400">
                        {new Date(item.proximoMantenimiento).toLocaleDateString("es-PE")}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium ${
                        stockBajo ? "text-red-700" : "text-emerald-700"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${stockBajo ? "bg-red-500" : "bg-emerald-500"}`} />
                      {stockBajo ? "Stock bajo" : "Normal"}
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