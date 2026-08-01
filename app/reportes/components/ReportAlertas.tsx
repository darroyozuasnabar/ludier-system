// app/reportes/components/ReportAlertas.tsx

"use client";

interface Alerta {
  title: string;
  description: string;
  priority: "ALTA" | "MEDIA" | "BAJA" | string;
  status?: "RESUELTO" | "PENDIENTE" | string;
  createdAt?: string;
}

interface ReportAlertasProps {
  data: Alerta[];
}

const PRIORIDAD_LABELS: Record<string, string> = {
  ALTA: "Urgente",
  MEDIA: "Media",
  BAJA: "Baja",
};

const PRIORIDAD_BORDER: Record<string, string> = {
  ALTA: "border-l-red-500",
  MEDIA: "border-l-amber-500",
  BAJA: "border-l-gray-300",
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

export default function ReportAlertas({ data }: ReportAlertasProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-sm text-gray-500">
        No hay alertas registradas para este proyecto
      </div>
    );
  }

  const urgentes = data.filter((a) => a.priority === "ALTA").length;
  const medias = data.filter((a) => a.priority === "MEDIA").length;
  const bajas = data.filter((a) => a.priority === "BAJA").length;

  return (
    <div>
      {/* Resumen */}
      <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border border-gray-200 rounded-md mb-4">
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Urgentes</p>
          <p className={`text-lg font-semibold ${urgentes > 0 ? "text-red-700" : "text-gray-900"}`}>
            {urgentes}
          </p>
        </div>
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Medias</p>
          <p className="text-lg font-semibold text-gray-900">{medias}</p>
        </div>
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Bajas</p>
          <p className="text-lg font-semibold text-gray-900">{bajas}</p>
        </div>
      </div>

      {/* Lista de alertas */}
      <div className="space-y-2">
        {data.map((a, i) => (
          <div
            key={i}
            className={`p-3 rounded-md border border-gray-200 border-l-[3px] ${
              PRIORIDAD_BORDER[a.priority] ?? "border-l-gray-300"
            } bg-white`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{a.title}</p>
                <p className="text-sm text-gray-600 mt-0.5">{a.description}</p>
                {a.createdAt && (
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(a.createdAt).toLocaleDateString("es-PE")}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium ${
                    PRIORIDAD_TEXT[a.priority] ?? "text-gray-500"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${PRIORIDAD_DOT[a.priority] ?? "bg-gray-400"}`} />
                  {PRIORIDAD_LABELS[a.priority] ?? a.priority}
                </span>
                <span
                  className={`text-xs ${
                    a.status === "RESUELTO" ? "text-emerald-600" : "text-gray-400"
                  }`}
                >
                  {a.status === "RESUELTO" ? "Resuelto" : "Pendiente"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}