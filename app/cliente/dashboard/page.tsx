"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Building2,
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  Loader2,
  TrendingUp,
  MapPin,
  CalendarDays,
  DollarSign,
  Image,
  Flag,
  BarChart3,
} from "lucide-react";
import { signOut } from "next-auth/react";

const formatPEN = (value: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(value);

const formatDate = (date: string) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-3 text-sm text-gray-500">Cargando tu proyecto...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">{error || "No se pudo cargar el dashboard"}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const { project, hitos, fotos, valorizaciones, cronograma } = data;
  const avance = project?.avance || 0;

  // Próximo hito: el primero con fecha futura o el más cercano
  const proximoHito = hitos?.find((h: any) => new Date(h.fecha) > new Date()) || hitos?.[0];

  // Última valorización
  const ultimaVal = project?.ultimaValorizacion || null;

  // Fotos nuevas esta semana (contar las de los últimos 7 días)
  const fotosSemana = fotos?.filter((f: any) => {
    const diff = (new Date().getTime() - new Date(f.fecha_subida).getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }) || [];

  const fotosPorCategoria = fotosSemana.reduce((acc: any, f: any) => {
    acc[f.categoria] = (acc[f.categoria] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* Resumen del proyecto */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{project?.name || "Proyecto"}</h2>
            <p className="text-sm text-gray-500">Cliente: {project?.client || "—"}</p>
            <div className="flex flex-wrap items-center gap-4 mt-1 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {project?.location || "Ubicación no especificada"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Inicio: {formatDate(project?.startDate)}
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                Fin estimado: {formatDate(project?.expectedEndDate)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Avance total</p>
              <p className="text-3xl font-bold text-gray-900">{avance.toFixed(1)}%</p>
            </div>
            <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-900 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(avance, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Próximo hito */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider mb-2">
            <Flag className="h-4 w-4" />
            Próximo hito
          </div>
          {proximoHito ? (
            <>
              <p className="text-base font-semibold text-gray-900">{proximoHito.title}</p>
              <p className="text-sm text-gray-500">{formatDate(proximoHito.fecha)}</p>
              <p className="text-xs text-gray-400 mt-1">{proximoHito.description}</p>
            </>
          ) : (
            <p className="text-sm text-gray-400">No hay hitos definidos</p>
          )}
        </div>

        {/* Valorización actual */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider mb-2">
            <DollarSign className="h-4 w-4" />
            Última valorización
          </div>
          {ultimaVal ? (
            <>
              <p className="text-base font-semibold text-gray-900">
                N.° {ultimaVal.period || "—"}
              </p>
              <p className="text-sm text-gray-500">
                Estado: <span className="font-medium">{ultimaVal.status || "PENDIENTE"}</span>
              </p>
              {ultimaVal.fechaCobro && (
                <p className="text-xs text-gray-400">
                  Cobro: {formatDate(ultimaVal.fechaCobro)}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Monto: {formatPEN(ultimaVal.totalFactura || 0)}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-400">Sin valorizaciones</p>
          )}
        </div>

        {/* Fotos nuevas */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider mb-2">
            <Image className="h-4 w-4" />
            Fotos nuevas esta semana
          </div>
          <p className="text-2xl font-bold text-gray-900">{fotosSemana.length}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(fotosPorCategoria).map(([cat, count]) => (
              <span key={cat} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                {String(count)} {cat}
              </span>
            ))}
            {fotosSemana.length === 0 && (
              <span className="text-xs text-gray-400">Sin fotos recientes</span>
            )}
          </div>
        </div>

        {/* Estado del proyecto */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider mb-2">
            <BarChart3 className="h-4 w-4" />
            Estado
          </div>
          <p className="text-base font-semibold text-gray-900">
            {project?.status || "ACTIVO"}
          </p>
          <p className="text-sm text-gray-500">
            {avance < 30 ? "En etapa inicial" : avance < 70 ? "En ejecución" : "Avanzado"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Última actualización: {new Date().toLocaleString("es-PE")}
          </p>
        </div>
      </div>

      {/* Galería de fotos (miniaturas) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Camera className="h-4 w-4" />
          Galería de fotos
          <span className="text-xs font-normal text-gray-400 ml-2">
            {fotos?.length || 0} fotos totales
          </span>
        </h3>
        {fotos && fotos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {fotos.slice(0, 8).map((foto: any) => (
              <div key={foto.id} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100 group">
                <img
                  src={foto.url}
                  alt={foto.nombre}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                  <p className="text-xs text-white truncate">{foto.categoria}</p>
                  <p className="text-[10px] text-gray-300">{formatDate(foto.fecha_subida)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">No hay fotos disponibles</p>
        )}
      </div>

      {/* Tabla de valorizaciones */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Resumen de valorizaciones
        </h3>
        {valorizaciones && valorizaciones.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">N.°</th>
                  <th className="px-4 py-2 text-left">Período</th>
                  <th className="px-4 py-2 text-left">Estado</th>
                  <th className="px-4 py-2 text-left">Fecha cobro</th>
                  <th className="px-4 py-2 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {valorizaciones.map((v: any) => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-gray-900">{v.period || "—"}</td>
                    <td className="px-4 py-2 text-gray-600">{v.period || "—"}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        v.status === "COBRADA" ? "bg-green-100 text-green-700" :
                        v.status === "PENDIENTE" ? "bg-yellow-100 text-yellow-700" :
                        v.status === "VENCIDA" ? "bg-red-100 text-red-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {v.status || "PENDIENTE"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-600">{v.fechaCobro ? formatDate(v.fechaCobro) : "—"}</td>
                    <td className="px-4 py-2 text-right font-medium text-gray-900">{formatPEN(v.totalFactura || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">No hay valorizaciones registradas</p>
        )}
      </div>

      {/* Línea de tiempo / hitos */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Línea de tiempo / hitos del proyecto
        </h3>
        {hitos && hitos.length > 0 ? (
          <div className="space-y-4">
            {hitos.map((hito: any) => (
              <div key={hito.id} className="flex items-start gap-4 border-b border-gray-100 pb-4 last:border-0">
                <div className="w-3 h-3 rounded-full mt-1.5" style={{ backgroundColor: hito.badge_color || "#9CA3AF" }} />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{hito.title}</p>
                  <p className="text-sm text-gray-500">{hito.description}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                    <span>Fecha planificada: {formatDate(hito.fecha)}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {hito.badge}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">No hay hitos definidos</p>
        )}
      </div>

      {/* Cronograma con barras de avance (opcional) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Cronograma del proyecto
        </h3>
        {cronograma && cronograma.length > 0 ? (
          <div className="space-y-3">
            {cronograma.map((item: any) => (
              <div key={item.id}>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.title}</span>
                  <span className="text-gray-900 font-medium">{item.porcentaje || 0}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-gray-900 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(item.porcentaje || 0, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">No hay cronograma definido</p>
        )}
      </div>

      {/* Pie de página (confidencial) */}
      <div className="text-center text-xs text-gray-400 border-t border-gray-200 pt-6">
        Este panel es de uso exclusivo del cliente. Los datos son sensibles y confidenciales.
      </div>
    </div>
  );
}