"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  Circle,
  ArrowRight,
} from "lucide-react";
import { signOut } from "next-auth/react";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
          <p className="text-sm text-gray-500 font-medium">Cargando tu proyecto...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-sm">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-red-600 font-medium">{error || "No se pudo cargar el dashboard"}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
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
    <div className="space-y-8">

      {/* ============================================================
          TARJETA DE PROYECTO Y AVANCE (con gradiente y anillo)
          ============================================================ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl shadow-2xl p-6 md:p-8 text-white">
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Información del proyecto */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-200 text-sm font-medium">
              <Building2 className="h-4 w-4" />
              <span>Proyecto</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {project?.name || "Proyecto"}
            </h1>
            <p className="text-indigo-200 text-lg">Cliente: {project?.client || "—"}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-indigo-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {project?.location || "Ubicación no especificada"}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Inicio: {formatDateDisplay(project?.startDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                Fin estimado: {formatDateDisplay(project?.expectedEndDate)}
              </span>
            </div>
          </div>

          {/* Avance con anillo circular */}
          <div className="flex items-center gap-6 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-white/20"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (avance / 100) * 251.2}
                  className="text-indigo-300 transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{avance.toFixed(1)}%</span>
                <span className="text-[10px] uppercase tracking-wider text-indigo-300">Avance</span>
              </div>
            </div>
            <div className="hidden sm:block border-l border-white/20 pl-6">
              <p className="text-sm text-indigo-200 font-medium">Progreso financiero</p>
              <p className="text-xs text-indigo-300/80">Basado en cobros vs contratos</p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          GRID DE MÉTRICAS
          ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Próximo hito */}
        <div className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-3">
            <Flag className="h-4 w-4" />
            Próximo hito
          </div>
          {proximoHito ? (
            <>
              <p className="text-base font-semibold text-gray-800">{proximoHito.title}</p>
              <p className="text-sm text-gray-500 mt-0.5">{formatDateDisplay(proximoHito.fecha)}</p>
              <p className="text-xs text-gray-400 mt-2 line-clamp-2">{proximoHito.description}</p>
            </>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>¡Todos completados!</span>
            </div>
          )}
        </div>

        {/* Última valorización */}
        <div className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-3">
            <DollarSign className="h-4 w-4" />
            Última valorización
          </div>
          {ultimaVal ? (
            <>
              <p className="text-base font-semibold text-gray-800 truncate">
                {ultimaVal.period || "Sin período"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${ultimaVal.status === "COBRADA" ? "bg-green-100 text-green-700" :
                    ultimaVal.status === "PENDIENTE" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-600"}`}>
                  {ultimaVal.status || "PENDIENTE"}
                </span>
                {ultimaVal.fechaCobro && (
                  <span className="text-xs text-gray-400">
                    Cobro: {formatDateDisplay(ultimaVal.fechaCobro)}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {formatPEN(ultimaVal.totalFactura || 0)}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-400">Sin valorizaciones</p>
          )}
        </div>

        {/* Fotos nuevas */}
        <div className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-3">
            <Image className="h-4 w-4" />
            Fotos nuevas esta semana
          </div>
          <p className="text-3xl font-bold text-gray-800">{fotosSemana.length}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {Object.entries(fotosPorCategoria).map(([cat, count]) => (
              <span key={cat} className="text-xs bg-gray-100 px-2.5 py-1 rounded-full text-gray-600">
                {String(count)} {cat}
              </span>
            ))}
            {fotosSemana.length === 0 && (
              <span className="text-xs text-gray-400">Sin fotos recientes</span>
            )}
          </div>
        </div>

        {/* Estado del proyecto */}
        <div className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-3">
            <BarChart3 className="h-4 w-4" />
            Estado
          </div>
          <p className="text-base font-semibold text-gray-800">
            {project?.status || "ACTIVO"}
          </p>
          <p className="text-sm text-gray-500">
            {avance < 30 ? "En etapa inicial" : avance < 70 ? "En ejecución" : "Avanzado"}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Última actualización: {new Date().toLocaleString("es-PE")}
          </p>
        </div>
      </div>

      {/* ============================================================
          GALERÍA DE FOTOS
          ============================================================ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Camera className="h-5 w-5 text-indigo-600" />
          <h3 className="text-sm font-semibold text-gray-800">Galería de fotos</h3>
          <span className="text-xs text-gray-400 ml-2">
            {fotos?.length || 0} fotos totales
          </span>
        </div>
        {fotos && fotos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {fotos.slice(0, 8).map((foto: any) => (
              <div
                key={foto.id}
                className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100 group cursor-pointer"
              >
                <img
                  src={foto.url}
                  alt={foto.nombre}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <div>
                    <p className="text-xs text-white font-medium truncate">{foto.categoria}</p>
                    <p className="text-[10px] text-white/70">{formatDateDisplay(foto.fecha_subida)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <Image className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No hay fotos disponibles</p>
          </div>
        )}
      </div>

      {/* ============================================================
          TABLA DE VALORIZACIONES
          ============================================================ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <DollarSign className="h-5 w-5 text-indigo-600" />
          <h3 className="text-sm font-semibold text-gray-800">Resumen de valorizaciones</h3>
        </div>
        {valorizaciones && valorizaciones.length > 0 ? (
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-medium">N.°</th>
                  <th className="px-4 py-3 text-left font-medium">Período</th>
                  <th className="px-4 py-3 text-left font-medium">Estado</th>
                  <th className="px-4 py-3 text-left font-medium">Fecha cobro</th>
                  <th className="px-4 py-3 text-right font-medium">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {valorizaciones.map((v: any, idx: number) => (
                  <tr
                    key={v.id}
                    className={`transition-colors hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">{v.numero ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{v.period || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${v.status === "COBRADA" ? "bg-green-100 text-green-700" :
                          v.status === "PENDIENTE" ? "bg-yellow-100 text-yellow-700" :
                          v.status === "VENCIDA" ? "bg-red-100 text-red-700" :
                          "bg-gray-100 text-gray-600"}`}>
                        {v.status || "PENDIENTE"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {v.fechaCobro ? formatDateDisplay(v.fechaCobro) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-800">
                      {formatPEN(v.totalFactura || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <DollarSign className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No hay valorizaciones registradas</p>
          </div>
        )}
      </div>

      {/* ============================================================
          LÍNEA DE TIEMPO – HITOS
          ============================================================ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Clock className="h-5 w-5 text-indigo-600" />
          <h3 className="text-sm font-semibold text-gray-800">Línea de tiempo / hitos del proyecto</h3>
        </div>
        {hitos && hitos.length > 0 ? (
          <div className="space-y-6">
            {hitos.map((hito: any, idx: number) => (
              <div key={hito.id} className="relative flex gap-4">
                {/* Línea conectora vertical */}
                {idx < hitos.length - 1 && (
                  <div className="absolute left-[11px] top-7 bottom-0 w-0.5 bg-gray-200" />
                )}
                {/* Indicador circular */}
                <div
                  className="relative z-10 w-5 h-5 rounded-full border-2 border-white shadow-sm flex-shrink-0 mt-1"
                  style={{ backgroundColor: hito.badge_color || "#9CA3AF" }}
                />
                <div className="flex-1 pb-6">
                  <p className="font-semibold text-gray-800">{hito.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{hito.description}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDateDisplay(hito.fecha)}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                      ${hito.badge === "Completado" ? "bg-green-100 text-green-700" :
                        hito.badge === "En progreso" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-600"}`}>
                      {hito.badge}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <Clock className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No hay hitos definidos</p>
          </div>
        )}
      </div>

      {/* ============================================================
          CRONOGRAMA CON BARRAS DE PROGRESO
          ============================================================ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="h-5 w-5 text-indigo-600" />
          <h3 className="text-sm font-semibold text-gray-800">Cronograma del proyecto</h3>
        </div>
        {cronograma && cronograma.length > 0 ? (
          <div className="space-y-4">
            {cronograma.map((item: any) => {
              const pct = item.porcentaje || 0;
              let barColor = "bg-gray-300";
              if (pct >= 100) barColor = "bg-green-500";
              else if (pct >= 50) barColor = "bg-indigo-500";
              else if (pct > 0) barColor = "bg-yellow-400";
              return (
                <div key={item.id}>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 font-medium">{item.title}</span>
                    <span className="text-gray-900 font-semibold">{pct}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mt-1.5">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <TrendingUp className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No hay cronograma definido</p>
          </div>
        )}
      </div>

      {/* ============================================================
          PIE DE PÁGINA
          ============================================================ */}
      <div className="text-center text-xs text-gray-400 border-t border-gray-200 pt-6 mt-2">
        Este panel es de uso exclusivo del cliente. Los datos son sensibles y confidenciales.
      </div>
    </div>
  );
}