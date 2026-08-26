// app/reportes/components/ReportFilters.tsx
"use client";

interface ProjectOption {
  id: string;
  name: string;
  client?: string;
  status?: "ACTIVO" | "FINALIZADO" | "CANCELADO" | string;
}

interface ReportFiltersProps {
  projects: ProjectOption[];
  selectedProject: string;
  onProjectChange: (id: string) => void;
  periodo: string;
  onPeriodoChange: (value: string) => void;
  fechaDesde?: string;
  fechaHasta?: string;
  onFechaDesdeChange?: (value: string) => void;
  onFechaHastaChange?: (value: string) => void;
  loading: boolean;
  onGenerate: () => void;
  lastGeneratedAt?: Date | null;
}

const PERIODOS = [
  { value: "mes", label: "Mes actual" },
  { value: "mes_pasado", label: "Mes pasado" },
  { value: "trimestre", label: "Trimestre" },
  { value: "anio", label: "Año" },
  { value: "personalizado", label: "Personalizado" },
];

export default function ReportFilters({
  projects,
  selectedProject,
  onProjectChange,
  periodo,
  onPeriodoChange,
  fechaDesde,
  fechaHasta,
  onFechaDesdeChange,
  onFechaHastaChange,
  loading,
  onGenerate,
  lastGeneratedAt,
}: ReportFiltersProps) {
  const esPersonalizado = periodo === "personalizado";

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex flex-col lg:flex-row lg:items-end gap-4">
        {/* Proyecto */}
        <div className="flex-1 min-w-[220px]">
          <label htmlFor="proyecto" className="text-sm font-medium text-gray-700 block mb-1.5">
            Proyecto
          </label>
          <select
            id="proyecto"
            value={selectedProject}
            onChange={(e) => onProjectChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
                {p.client ? ` — ${p.client}` : ""}
                {p.status && p.status !== "ACTIVO" ? ` (${p.status === "FINALIZADO" ? "Finalizado" : "Cancelado"})` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Período — toggle */}
        <div className="flex-1 min-w-[320px]">
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            Período
          </label>
          <div className="inline-flex rounded-md border border-gray-300 bg-gray-50 p-0.5 w-full">
            {PERIODOS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => onPeriodoChange(p.value)}
                className={`flex-1 px-3 py-1.5 text-sm font-medium rounded transition-colors whitespace-nowrap ${
                  periodo === p.value
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Botón Generar */}
        <div className="lg:w-auto">
          <button
            onClick={onGenerate}
            disabled={loading || (esPersonalizado && (!fechaDesde || !fechaHasta))}
            className="w-full lg:w-auto px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 active:bg-gray-950 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            {loading ? "Generando..." : "Generar"}
          </button>
        </div>
      </div>

      {/* Rango de fechas — solo si el período es personalizado */}
      {esPersonalizado && (
        <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="flex-1 min-w-[160px]">
            <label htmlFor="fechaDesde" className="text-sm font-medium text-gray-700 block mb-1.5">
              Desde
            </label>
            <input
              id="fechaDesde"
              type="date"
              value={fechaDesde ?? ""}
              max={fechaHasta}
              onChange={(e) => onFechaDesdeChange?.(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>
          <div className="flex-1 min-w-[160px]">
            <label htmlFor="fechaHasta" className="text-sm font-medium text-gray-700 block mb-1.5">
              Hasta
            </label>
            <input
              id="fechaHasta"
              type="date"
              value={fechaHasta ?? ""}
              min={fechaDesde}
              onChange={(e) => onFechaHastaChange?.(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>
        </div>
      )}

      {/* Info real de última generación */}
      {lastGeneratedAt && !loading && (
        <p className="text-xs text-gray-400 mt-3">
          Último reporte generado a las{" "}
          {lastGeneratedAt.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}
        </p>
      )}
    </div>
  );
}