"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Building2,
  Calendar,
  Camera,
  Clock,
  Loader2,
  TrendingUp,
  MapPin,
  CalendarDays,
  DollarSign,
  Image,
  Flag,
  BarChart3,
  CheckCircle2,
  Gauge,
  Ruler,
} from "lucide-react";

// ─── Paleta / tokens ─────────────────────────────────────────────
// steel-900 #10151C · steel-800 #16212E · steel-700 #22384A
// paper     #FAFAF8 · line #E1E5EA
// amber     #E8961E (acento primario) · rust #B14A22 (acento secundario)
// ok #3D8361 · warn #D9A441 · danger #C1462D

// ─── Formateadores ──────────────────────────────────────────────
const formatPEN = (value: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(value);

const formatDateDisplay = (dateStr: string) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// ─── Marcas de esquina (crop marks estilo plano técnico) ────────
function CornerMarks({ tone = "amber" }: { tone?: "amber" | "paper" }) {
  const color = tone === "amber" ? "border-amber-400/80" : "border-white/40";
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <span className={`absolute -top-px -left-px w-2.5 h-2.5 border-t-2 border-l-2 ${color}`} />
      <span className={`absolute -top-px -right-px w-2.5 h-2.5 border-t-2 border-r-2 ${color}`} />
      <span className={`absolute -bottom-px -left-px w-2.5 h-2.5 border-b-2 border-l-2 ${color}`} />
      <span className={`absolute -bottom-px -right-px w-2.5 h-2.5 border-b-2 border-r-2 ${color}`} />
    </div>
  );
}

// ─── Encabezado de sección estilo "rótulo de plano" ──────────────
function SectionLabel({
  icon: Icon,
  label,
  meta,
}: {
  icon: any;
  label: string;
  meta?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex items-center gap-2 shrink-0">
        <Icon className="h-4 w-4 text-amber-600" />
        <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-[0.14em]">
          {label}
        </h3>
      </div>
      <div className="h-px flex-1 bg-slate-200" />
      {meta && (
        <span className="text-[11px] font-mono text-slate-400 tracking-wide shrink-0">
          {meta}
        </span>
      )}
    </div>
  );
}

// ─── Gauge técnico de avance (con ticks tipo manómetro) ──────────
function AvanceGauge({ value }: { value: number }) {
  const [animated, setAnimated] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setAnimated(value);
      return;
    }

    const duration = 1100;
    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimated(from + (value - from) * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(animated, 100) / 100) * circumference;

  const ticks = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 360) / 24;
    const rad = (angle * Math.PI) / 180;
    const isMajor = i % 6 === 0;
    const rOuter = 52;
    const rInner = isMajor ? 47 : 49.5;
    return {
      x1: 56 + rOuter * Math.sin(rad),
      y1: 56 - rOuter * Math.cos(rad),
      x2: 56 + rInner * Math.sin(rad),
      y2: 56 - rInner * Math.cos(rad),
      isMajor,
    };
  });

  return (
    <div className="relative w-[112px] h-[112px] shrink-0">
      <svg viewBox="0 0 112 112" className="w-full h-full -rotate-90">
        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke="white"
            strokeOpacity={t.isMajor ? 0.35 : 0.15}
            strokeWidth={t.isMajor ? 1.4 : 1}
          />
        ))}
        <circle cx="56" cy="56" r={radius} stroke="white" strokeOpacity={0.15} strokeWidth="7" fill="none" />
        <circle
          cx="56"
          cy="56"
          r={radius}
          stroke="#E8961E"
          strokeWidth="7"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="motion-safe:transition-[stroke-dashoffset] motion-safe:duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white font-mono tabular-nums tracking-tight">
          {animated.toFixed(1)}
          <span className="text-sm text-amber-400">%</span>
        </span>
        <span className="text-[9px] uppercase tracking-[0.18em] text-indigo-200/70 mt-0.5">
          Avance
        </span>
      </div>
    </div>
  );
}

// ─── Componente principal ──────────────────────────────────────
export default function ClienteDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/cliente/login");
      return;
    }
    if (status === "authenticated" && session?.user?.role !== "CLIENTE") {
      router.push("/dashboard");
      return;
    }
    if (status === "authenticated") {
      fetchDashboard();
    }
  }, [status, session]);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/cliente/dashboard");
      if (!res.ok) throw new Error("Error al cargar datos");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full border-2 border-amber-400/20" />
            <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
          </div>
          <p className="text-xs font-mono uppercase tracking-[0.14em] text-slate-400">
            Cargando proyecto…
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <div className="relative text-center p-8 bg-white rounded-lg shadow-sm border border-slate-200 max-w-sm">
          <CornerMarks tone="amber" />
          <div className="text-5xl mb-4">😕</div>
          <p className="text-rose-700 font-medium text-sm">{error || "No se pudo cargar el dashboard"}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const { project, hitos, fotos, valorizaciones, cronograma } = data;
  const avance = project?.avance || 0;

  // Próximo hito (no completado)
  const hitosNoCompletados = hitos?.filter((h: any) => h.badge !== "Completado") || [];
  const proximoHito = hitosNoCompletados?.[0] || null;

  // Última valorización
  const ultimaVal = project?.ultimaValorizacion || null;

  // Fotos de la semana
  const fotosSemana = fotos?.filter((f: any) => {
    const diff = (new Date().getTime() - new Date(f.fecha_subida).getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }) || [];

  const fotosPorCategoria = fotosSemana.reduce((acc: any, f: any) => {
    acc[f.categoria] = (acc[f.categoria] || 0) + 1;
    return acc;
  }, {});

  // ─── Render ──────────────────────────────────────────────────
  return (
    <div
      className="space-y-8 relative"
      style={{
        backgroundImage:
          "linear-gradient(#00000006 1px, transparent 1px), linear-gradient(90deg, #00000006 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        backgroundPosition: "-1px -1px",
      }}
    >
      {/* ============================================================
          TARJETA DE PROYECTO Y AVANCE — estilo cajetín de plano
          ============================================================ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#16212E] via-[#182633] to-[#0F1720] rounded-xl shadow-xl border-t-4 border-amber-500 motion-safe:animate-[fadeIn_0.5s_ease-out]">
        <CornerMarks tone="paper" />
        {/* grid técnica de fondo */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

        <div className="relative z-[1] p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Información del proyecto */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-[11px] font-mono uppercase tracking-[0.16em]">
                <Building2 className="h-3.5 w-3.5" />
                <span>Proyecto</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                {project?.name || "Proyecto"}
              </h1>
              <p className="text-indigo-200/80 text-base">Cliente: {project?.client || "—"}</p>
            </div>

            {/* Gauge de avance */}
            <div className="flex items-center gap-5 bg-white/[0.06] backdrop-blur-sm rounded-lg px-5 py-4 border border-white/10 self-start">
              <AvanceGauge value={avance} />
              <div className="hidden sm:block border-l border-white/15 pl-5">
                <p className="text-sm text-indigo-100 font-medium">Progreso financiero</p>
                <p className="text-xs text-indigo-300/70 mt-0.5 max-w-[140px]">
                  Basado en cobros vs. contratos
                </p>
              </div>
            </div>
          </div>

          {/* Cajetín inferior — datos clave como ficha técnica */}
          <div className="mt-7 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-4">
            {[
              { icon: MapPin, label: "Ubicación", value: project?.location || "No especificada" },
              { icon: Calendar, label: "Inicio", value: formatDateDisplay(project?.startDate) },
              { icon: CalendarDays, label: "Fin estimado", value: formatDateDisplay(project?.expectedEndDate) },
              { icon: BarChart3, label: "Estado", value: project?.status || "ACTIVO" },
            ].map((f, i) => (
              <div key={i}>
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.14em] text-indigo-300/60">
                  <f.icon className="h-3 w-3" />
                  {f.label}
                </div>
                <p className="text-sm text-white font-medium mt-1 truncate">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================
          GRID DE MÉTRICAS
          ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Próximo hito */}
        <div className="group relative bg-white rounded-lg border border-slate-200 p-5 hover:border-amber-300 hover:shadow-md transition-all duration-200">
          <CornerMarks tone="amber" />
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase tracking-[0.14em] mb-3">
            <span className="flex items-center gap-1.5">
              <Flag className="h-3.5 w-3.5" />
              Próximo hito
            </span>
          </div>
          {proximoHito ? (
            <>
              <p className="text-base font-semibold text-slate-800">{proximoHito.title}</p>
              <p className="text-sm font-mono text-slate-500 mt-0.5 tabular-nums">
                {formatDateDisplay(proximoHito.fecha)}
              </p>
              <p className="text-xs text-slate-400 mt-2 line-clamp-2">{proximoHito.description}</p>
            </>
          ) : (
            <div className="flex items-center gap-2 text-slate-400">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span>¡Todos completados!</span>
            </div>
          )}
        </div>

        {/* Última valorización */}
        <div className="group relative bg-white rounded-lg border border-slate-200 p-5 hover:border-amber-300 hover:shadow-md transition-all duration-200">
          <CornerMarks tone="amber" />
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono uppercase tracking-[0.14em] mb-3">
            <DollarSign className="h-3.5 w-3.5" />
            Última valorización
          </div>
          {ultimaVal ? (
            <>
              <p className="text-base font-semibold text-slate-800 truncate">
                {ultimaVal.period || "Sin período"}
              </p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium
                  ${ultimaVal.status === "COBRADA" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                    ultimaVal.status === "PENDIENTE" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                    "bg-slate-100 text-slate-600 border border-slate-200"}`}
                >
                  {ultimaVal.status || "PENDIENTE"}
                </span>
                {ultimaVal.fechaCobro && (
                  <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                    {formatDateDisplay(ultimaVal.fechaCobro)}
                  </span>
                )}
              </div>
              <p className="text-sm font-mono text-slate-700 mt-2.5 tabular-nums font-semibold">
                {formatPEN(ultimaVal.totalFactura || 0)}
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-400">Sin valorizaciones</p>
          )}
        </div>

        {/* Fotos nuevas */}
        <div className="group relative bg-white rounded-lg border border-slate-200 p-5 hover:border-amber-300 hover:shadow-md transition-all duration-200">
          <CornerMarks tone="amber" />
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono uppercase tracking-[0.14em] mb-3">
            <Image className="h-3.5 w-3.5" />
            Fotos esta semana
          </div>
          <p className="text-3xl font-bold text-slate-800 font-mono tabular-nums">{fotosSemana.length}</p>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {Object.entries(fotosPorCategoria).map(([cat, count]) => (
              <span key={cat} className="text-[11px] font-mono bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-slate-600">
                {String(count)} {cat}
              </span>
            ))}
            {fotosSemana.length === 0 && (
              <span className="text-xs text-slate-400">Sin fotos recientes</span>
            )}
          </div>
        </div>

        {/* Estado del proyecto */}
        <div className="group relative bg-white rounded-lg border border-slate-200 p-5 hover:border-amber-300 hover:shadow-md transition-all duration-200">
          <CornerMarks tone="amber" />
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono uppercase tracking-[0.14em] mb-3">
            <Gauge className="h-3.5 w-3.5" />
            Estado
          </div>
          <p className="text-base font-semibold text-slate-800">
            {project?.status || "ACTIVO"}
          </p>
          <p className="text-sm text-slate-500">
            {avance < 30 ? "En etapa inicial" : avance < 70 ? "En ejecución" : "Avanzado"}
          </p>
          <p className="text-[11px] font-mono text-slate-400 mt-2.5 tabular-nums">
            Act. {new Date().toLocaleString("es-PE")}
          </p>
        </div>
      </div>

      {/* ============================================================
          GALERÍA DE FOTOS
          ============================================================ */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <SectionLabel icon={Camera} label="Galería fotográfica" meta={`${fotos?.length || 0} archivos`} />
        {fotos && fotos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {fotos.slice(0, 8).map((foto: any) => (
              <div
                key={foto.id}
                className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100 group/photo cursor-pointer"
              >
                <img
                  src={foto.url}
                  alt={foto.nombre}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover/photo:scale-105"
                />
                <div className="absolute inset-0 ring-0 group-hover/photo:ring-2 ring-inset ring-amber-400 transition-all duration-200" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <div>
                    <p className="text-xs text-white font-medium truncate">{foto.categoria}</p>
                    <p className="text-[10px] text-white/70 font-mono">{formatDateDisplay(foto.fecha_subida)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <Image className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No hay fotos disponibles</p>
          </div>
        )}
      </div>

      {/* ============================================================
          TABLA DE VALORIZACIONES
          ============================================================ */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <SectionLabel icon={DollarSign} label="Resumen de valorizaciones" />
        {valorizaciones && valorizaciones.length > 0 ? (
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] text-slate-400 font-mono uppercase tracking-[0.12em] border-b border-slate-200">
                  <th className="px-4 py-3 text-left font-medium">N.°</th>
                  <th className="px-4 py-3 text-left font-medium">Período</th>
                  <th className="px-4 py-3 text-left font-medium">Estado</th>
                  <th className="px-4 py-3 text-left font-medium">Fecha cobro</th>
                  <th className="px-4 py-3 text-right font-medium">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {valorizaciones.map((v: any, idx: number) => (
                  <tr
                    key={v.id}
                    className={`transition-colors hover:bg-amber-50/40 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                  >
                    <td className="px-4 py-3 font-mono font-medium text-slate-800 tabular-nums">{v.numero ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{v.period || "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium
                        ${v.status === "COBRADA" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                          v.status === "PENDIENTE" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                          v.status === "VENCIDA" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                          "bg-slate-100 text-slate-600 border border-slate-200"}`}
                      >
                        {v.status || "PENDIENTE"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono tabular-nums">
                      {v.fechaCobro ? formatDateDisplay(v.fechaCobro) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-slate-800 tabular-nums">
                      {formatPEN(v.totalFactura || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <DollarSign className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No hay valorizaciones registradas</p>
          </div>
        )}
      </div>

      {/* ============================================================
          LÍNEA DE TIEMPO – HITOS (estilo línea de cota)
          ============================================================ */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <SectionLabel icon={Clock} label="Línea de tiempo del proyecto" />
        {hitos && hitos.length > 0 ? (
          <div className="space-y-6">
            {hitos.map((hito: any, idx: number) => (
              <div key={hito.id} className="relative flex gap-4">
                {idx < hitos.length - 1 && (
                  <div className="absolute left-[11px] top-7 bottom-0 w-px bg-slate-200" />
                )}
                <div
                  className="relative z-10 w-5 h-5 rounded-full border-2 border-white shadow-sm flex-shrink-0 mt-1 ring-1 ring-slate-200"
                  style={{ backgroundColor: hito.badge_color || "#9CA3AF" }}
                />
                <div className="flex-1 pb-6">
                  <p className="font-semibold text-slate-800">{hito.title}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{hito.description}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs">
                    <span className="flex items-center gap-1 font-mono text-slate-400 tabular-nums">
                      <Calendar className="h-3 w-3" />
                      {formatDateDisplay(hito.fecha)}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium
                      ${hito.badge === "Completado" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                        hito.badge === "En progreso" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                        "bg-slate-100 text-slate-600 border border-slate-200"}`}
                    >
                      {hito.badge}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <Clock className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No hay hitos definidos</p>
          </div>
        )}
      </div>

      {/* ============================================================
          CRONOGRAMA — barras estilo regla graduada
          ============================================================ */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <SectionLabel icon={Ruler} label="Cronograma del proyecto" />
        {cronograma && cronograma.length > 0 ? (
          <div className="space-y-5">
            {cronograma.map((item: any) => {
              const pct = item.porcentaje || 0;
              let barColor = "bg-slate-300";
              if (pct >= 100) barColor = "bg-emerald-500";
              else if (pct >= 50) barColor = "bg-[#22384A]";
              else if (pct > 0) barColor = "bg-amber-400";
              return (
                <div key={item.id}>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700 font-medium">{item.title}</span>
                    <span className="text-slate-900 font-mono font-semibold tabular-nums">{pct}%</span>
                  </div>
                  <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                    <div
                      className={`h-full rounded-full motion-safe:transition-all motion-safe:duration-1000 ease-out ${barColor}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 px-px">
                    {[0, 25, 50, 75, 100].map((mark) => (
                      <span key={mark} className="w-px h-1.5 bg-slate-200" />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <TrendingUp className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No hay cronograma definido</p>
          </div>
        )}
      </div>

      {/* ============================================================
          PIE DE PÁGINA
          ============================================================ */}
      <div className="text-center text-[11px] font-mono text-slate-400 border-t border-dashed border-slate-200 pt-6 mt-2 uppercase tracking-wide">
        Panel de uso exclusivo del cliente · Datos sensibles y confidenciales
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}