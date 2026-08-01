// app/reportes/components/ReportInventario.tsx

"use client";

interface ItemInventario {
  nombre: string;
  categoria: string;
  cantidad: number;
  stock_minimo: number;
  ubicacion: string;
  unidad: string;
}

interface ReportInventarioProps {
  data: ItemInventario[];
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
  const stockCritico = data.filter((item) => item.cantidad <= item.stock_minimo).length;

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
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/60">
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Item</th>
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Categoría</th>
              <th className="text-right py-2.5 px-3 font-medium text-gray-500">Cantidad</th>
              <th className="text-right py-2.5 px-3 font-medium text-gray-500">Stock mínimo</th>
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Ubicación</th>
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Unidad</th>
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item, i) => {
              const isCritico = item.cantidad <= item.stock_minimo;
              return (
                <tr key={`${item.nombre}-${i}`} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-2.5 px-3 text-gray-900 font-medium">{item.nombre}</td>
                  <td className="py-2.5 px-3 text-gray-500">{item.categoria}</td>
                  <td className="py-2.5 px-3 text-right font-medium text-gray-900 tabular-nums">
                    {item.cantidad}
                  </td>
                  <td className="py-2.5 px-3 text-right text-gray-500 tabular-nums">
                    {item.stock_minimo || 0}
                  </td>
                  <td className="py-2.5 px-3 text-gray-500">{item.ubicacion}</td>
                  <td className="py-2.5 px-3 text-gray-500">{item.unidad || "unidades"}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium ${
                        isCritico ? "text-red-700" : "text-emerald-700"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isCritico ? "bg-red-500" : "bg-emerald-500"}`} />
                      {isCritico ? "⚠️ Stock bajo" : "✅ Normal"}
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