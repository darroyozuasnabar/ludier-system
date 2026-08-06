// app/reportes/components/ReportAlertas.tsx
"use client";

interface Alerta {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: string;
  prioridad: "ALTA" | "MEDIA" | "BAJA" | string;
  estado: "PENDIENTE" | "CORREGIDO" | "VERIFICADO" | string;
  origen?: string | null;
  responsable?: string | null;
  fechaDeteccion: string;
  fechaLimite?: string | null;
  costoRetrabajo?: number;
}

interface ReportAlertasProps {
  data: Alerta[];
  isAdmin?: boolean;
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

const ESTADO_LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente",
  CORREGIDO: "Corregido",
  VERIFICADO: "Verificado",
};

function isVencida(a: Alerta): boolean {
  if (!a.fechaLimite || a.estado === "VERIFICADO") return false;
  return new Date(a.fechaLimite) < new Date();
}

function diasParaVencer(fechaLimite: string): number {
  const ms = new Date(fechaLimite).getTime() - new Date().getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export default function ReportAlertas({ data, isAdmin = true }: ReportAlertasProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-sm text-gray-500">
        No hay observaciones de calidad registradas para este proyecto
      </div>
    );
  }

  const urgentes = data.filter((a) => a.prioridad === "ALTA").length;
  const vencidas = data.filter(isVencida).length;
  const pendientes = data.filter((a) => a.estado === "PENDIENTE").length;
  const costoTotal = data.reduce((s, a) => s + (a.costoRetrabajo || 0), 0);

  // Vencidas primero, luego por prioridad, luego por fecha límite más próxima
  const ordenPrioridad: Record<string, number> = { ALTA: 0, MEDIA: 1, BAJA: 2 };
  const sorted = [...data].sort((a, b) => {
    const av = isVencida(a) ? 0 : 1;
    const bv = isVencida(b) ? 0 : 1;
    if (av !== bv) return av - bv;
    const ap = ordenPrioridad[a.prioridad] ?? 3;
    const bp = ordenPrioridad[b.prioridad] ?? 3;
    if (ap !== bp) return ap - bp;
    return new Date(a.fechaDeteccion).getTime() - new Date(b.fechaDeteccion).getTime();
  });

  return (
    <div>
      {/* Resumen */}
      <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border border-gray-200 rounded-md mb-4">
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Vencidas</p>
          <p className={`text-lg font-semibold ${vencidas > 0 ? "text-red-700" : "text-gray-900"}`}>
            {vencidas}
          </p>
        </div>
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Urgentes</p>
          <p className="text-lg font-semibold text-gray-900">{urgentes}</p>
        </div>
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Pendientes</p>
          <p className="text-lg font-semibold text-gray-900">
            {pendientes}
            <span className="text-sm font-normal text-gray-400"> / {data.length}</span>
          </p>
        </div>
        {isAdmin && costoTotal > 0 && (
          <div className="flex-1 px-4 py-3">
            <p className="text-xs text-gray-500 mb-0.5">Costo de retrabajos</p>
            <p className="text-lg font-semibold text-gray-900">
              S/ {costoTotal.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
            </p>
          </div>
        )}
      </div>

      {/* Lista de alertas */}
      <div className="space-y-2">
        {sorted.map((a) => {
          const vencida = isVencida(a);
          const dias = a.fechaLimite ? diasParaVencer(a.fechaLimite) : null;

          return (
            <div
              key={a.id}
              className={`p-3 rounded-md border border-gray-200 border-l-[3px] ${
                vencida ? "border-l-red-600 bg-red-50/30" : PRIORIDAD_BORDER[a.prioridad] ?? "border-l-gray-300"
              } bg-white`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-gray-900">{a.titulo}</p>
                    {a.tipo && (
                      <span className="text-xs text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">
                        {a.tipo}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{a.descripcion}</p>
                  <div className="flex items-center gap-3 flex-wrap mt-1.5 text-xs text-gray-400">
                    <span>{new Date(a.fechaDeteccion).toLocaleDateString("es-PE")}</span>
                    {a.responsable && (
                      <>
                        <span className="text-gray-300">·</span>
                        <span>{a.responsable}</span>
                      </>
                    )}
                    {a.origen && (
                      <>
                        <span className="text-gray-300">·</span>
                        <span>{a.origen}</span>
                      </>
                    )}
                    {isAdmin && a.costoRetrabajo ? (
                      <>
                        <span className="text-gray-300">·</span>
                        <span>S/ {a.costoRetrabajo.toFixed(2)} en retrabajo</span>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium ${
                      PRIORIDAD_TEXT[a.prioridad] ?? "text-gray-500"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${PRIORIDAD_DOT[a.prioridad] ?? "bg-gray-400"}`} />
                    {PRIORIDAD_LABELS[a.prioridad] ?? a.prioridad}
                  </span>
                  {vencida ? (
                    <span className="text-xs font-medium text-red-600">
                      Vencida hace {Math.abs(dias ?? 0)}d
                    </span>
                  ) : dias !== null && dias <= 3 && a.estado !== "VERIFICADO" ? (
                    <span className="text-xs font-medium text-amber-600">Vence en {dias}d</span>
                  ) : (
                    <span className="text-xs text-gray-400">
                      {ESTADO_LABELS[a.estado] ?? a.estado}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}