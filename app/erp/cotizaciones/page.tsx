"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  Plus,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Clock,
  TrendingUp,
  Building2,
  User,
  Calendar,
  Search,
  Filter,
  X,
  Download,
  Send,
  CheckCircle,
  Ban,
  RefreshCw,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const formatCOP = (value: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(value);

const ESTADOS_COTIZACION = [
  { key: "BORRADOR", label: "Borrador", color: "gray" },
  { key: "ENVIADA", label: "Enviada", color: "blue" },
  { key: "VISTA", label: "Vista", color: "indigo" },
  { key: "APROBADA", label: "Aprobada", color: "emerald" },
  { key: "RECHAZADA", label: "Rechazada", color: "red" },
  { key: "EXPIRADA", label: "Expirada", color: "amber" },
  { key: "CONVERTIDA_A_OBRA", label: "Convertida", color: "purple" },
];

const badgeColors: Record<string, string> = {
  gray: "bg-gray-100 text-gray-700",
  blue: "bg-blue-100 text-blue-700",
  indigo: "bg-indigo-100 text-indigo-700",
  emerald: "bg-emerald-100 text-emerald-700",
  red: "bg-red-100 text-red-700",
  amber: "bg-amber-100 text-amber-700",
  purple: "bg-purple-100 text-purple-700",
};

function KpiCard({ icon: Icon, label, value, sub, accent }: any) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent ?? "bg-zinc-50"}`}>
          <Icon className="h-4 w-4 text-zinc-600" />
        </div>
        <span className="text-2xl font-bold text-zinc-900">{value}</span>
      </div>
      <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest mt-2">{label}</p>
      {sub && <p className="text-xs text-zinc-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider">{children}</h2>
      {sub && <p className="text-xs text-zinc-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function Toast({ type, msg, onClose }: { type: "ok" | "err"; msg: string; onClose: () => void }) {
  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium border backdrop-blur-sm ${
        type === "ok"
          ? "bg-emerald-50/95 text-emerald-800 border-emerald-200"
          : "bg-red-50/95 text-red-800 border-red-200"
      }`}
    >
      {type === "ok" ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
      ) : (
        <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
      )}
      {msg}
      <button onClick={onClose} className="ml-1 text-zinc-400 hover:text-zinc-600">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function CotizacionesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const userRole = session?.user?.role || "VIEWER";
  const isAdmin = userRole === "FUNDADOR" || userRole === "ADMIN";

  const [loading, setLoading] = useState(true);
  const [cotizaciones, setCotizaciones] = useState<any[]>([]);
  const [filterEstado, setFilterEstado] = useState<string>("ALL");
  const [filterCliente, setFilterCliente] = useState<string>("");
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") loadCotizaciones();
  }, [status]);

  const showToast = (type: "ok" | "err", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const loadCotizaciones = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterEstado !== "ALL") params.append("estado", filterEstado);
      if (filterCliente) params.append("cliente", filterCliente);

      const response = await fetch(`/api/erp/cotizaciones?${params.toString()}`);
      const data = await response.json();

      if (!data.success) throw new Error(data.error);
      setCotizaciones(data.data || []);
    } catch (error) {
      console.error("Error cargando cotizaciones:", error);
      showToast("err", "Error al cargar cotizaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      showToast("err", "No tienes permiso para eliminar cotizaciones.");
      return;
    }
    if (!confirm("¿Eliminar esta cotización? (Solo disponible en estado BORRADOR)")) return;

    try {
      const response = await fetch(`/api/erp/cotizaciones/${id}`, { method: "DELETE" });
      const data = await response.json();

      if (!data.success) throw new Error(data.error);

      showToast("ok", "Cotización eliminada");
      loadCotizaciones();
    } catch (error: any) {
      showToast("err", error.message || "Error al eliminar");
    }
  };

  const handleEnviar = async (id: string) => {
    if (!isAdmin) {
      showToast("err", "No tienes permiso para enviar cotizaciones.");
      return;
    }
    try {
      const response = await fetch(`/api/erp/cotizaciones/${id}/enviar`, { method: "POST" });
      const data = await response.json();

      if (!data.success) throw new Error(data.error);

      showToast("ok", "Cotización marcada como enviada");
      loadCotizaciones();
    } catch (error: any) {
      showToast("err", error.message || "Error al enviar");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-zinc-300" />
      </div>
    );
  }

  const totalCotizaciones = cotizaciones.length;
  const aprobadas = cotizaciones.filter((c) => c.estado === "APROBADA" || c.estado === "CONVERTIDA_A_OBRA").length;
  const pendientes = cotizaciones.filter((c) => c.estado === "ENVIADA" || c.estado === "VISTA").length;
  const totalMonto = cotizaciones.reduce((sum, c) => sum + Number(c.total || 0), 0);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      {toast && (
        <Toast
          type={toast.type}
          msg={toast.msg}
          onClose={() => setToast(null)}
        />
      )}

      <header className="bg-white border-b border-zinc-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/erp/dashboard")}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-700 text-sm transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Dashboard
            </button>
            <div className="h-4 w-px bg-zinc-200" />
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center">
                <FileText className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-zinc-900 leading-none">Cotizaciones</h1>
                <p className="text-[10px] text-zinc-400 mt-0.5 uppercase tracking-wider">
                  Gestión comercial · LUDIER
                </p>
              </div>
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={() => router.push("/erp/cotizaciones/nueva")}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-xs font-semibold rounded-xl hover:bg-zinc-800 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Nueva cotización
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* KPIs - SOLO ADMIN */}
        {isAdmin ? (
          <section>
            <SectionTitle sub="Métricas comerciales">Visión ejecutiva</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KpiCard
                icon={FileText}
                label="Total cotizaciones"
                value={totalCotizaciones}
                sub="registradas"
                accent="bg-zinc-50"
              />
              <KpiCard
                icon={CheckCircle}
                label="Aprobadas"
                value={aprobadas}
                sub={`${totalCotizaciones > 0 ? Math.round((aprobadas / totalCotizaciones) * 100) : 0}% conversión`}
                accent="bg-emerald-50"
              />
              <KpiCard
                icon={Clock}
                label="Pendientes"
                value={pendientes}
                sub="en espera de respuesta"
                accent="bg-amber-50"
              />
              <KpiCard
                icon={TrendingUp}
                label="Monto total"
                value={formatCOP(totalMonto)}
                sub="cotizado"
                accent="bg-blue-50"
              />
            </div>
          </section>
        ) : (
          // FIELD_ENGINEER: solo 2 KPIs sin montos
          <section>
            <SectionTitle sub="Métricas comerciales">Visión ejecutiva</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KpiCard
                icon={FileText}
                label="Total cotizaciones"
                value={totalCotizaciones}
                sub="registradas"
                accent="bg-zinc-50"
              />
              <KpiCard
                icon={Clock}
                label="Pendientes"
                value={pendientes}
                sub="en espera de respuesta"
                accent="bg-amber-50"
              />
            </div>
          </section>
        )}

        {/* Filtros */}
        <section className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-zinc-400" />
              <span className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Filtros</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="px-3 py-1.5 text-xs border border-zinc-200 rounded-lg bg-white text-zinc-700"
              >
                <option value="ALL">Todos los estados</option>
                {ESTADOS_COTIZACION.map((e) => (
                  <option key={e.key} value={e.key}>{e.label}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={filterCliente}
                onChange={(e) => setFilterCliente(e.target.value)}
                className="px-3 py-1.5 text-xs border border-zinc-200 rounded-lg bg-white text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
              <button
                onClick={loadCotizaciones}
                className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                title="Actualizar"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Lista de Cotizaciones */}
        <section>
          <SectionTitle sub={`${cotizaciones.length} cotizaciones`}>Lista de cotizaciones</SectionTitle>

          {cotizaciones.length === 0 ? (
            <div className="bg-white rounded-2xl border border-zinc-100 p-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-7 w-7 text-zinc-200" />
              </div>
              <p className="text-sm text-zinc-400">No hay cotizaciones registradas</p>
              <p className="text-xs text-zinc-300 mt-1">
                Crea la primera con el botón "Nueva cotización"
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cotizaciones.map((cotizacion) => {
                const estadoInfo = ESTADOS_COTIZACION.find((e) => e.key === cotizacion.estado) || ESTADOS_COTIZACION[0];
                const isExpanded = expandedId === cotizacion.id;

                return (
                  <div
                    key={cotizacion.id}
                    className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden hover:border-zinc-200 transition-colors"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <p className="text-sm font-bold text-zinc-900">{cotizacion.numero}</p>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeColors[estadoInfo.color]}`}>
                              {estadoInfo.label}
                            </span>
                            <span className="text-xs text-zinc-400">{cotizacion.cliente}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(cotizacion.fecha_emision).toLocaleDateString("es-PE")}
                            </span>
                            {/* Monto SOLO para ADMIN */}
                            {isAdmin && (
                              <>
                                <span>·</span>
                                <span className="font-semibold text-zinc-900">{formatCOP(Number(cotizacion.total))}</span>
                                <span>·</span>
                                <span>{cotizacion.moneda || "PEN"}</span>
                              </>
                            )}
                            {cotizacion.project && (
                              <>
                                <span>·</span>
                                <span className="flex items-center gap-1">
                                  <Building2 className="h-3 w-3" />
                                  {cotizacion.project.name}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => router.push(`/erp/cotizaciones/${cotizacion.id}`)}
                            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                            title="Ver detalle"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {isAdmin && cotizacion.estado === "BORRADOR" && (
                            <button
                              onClick={() => router.push(`/erp/cotizaciones/${cotizacion.id}/editar`)}
                              className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          )}
                          {isAdmin && cotizacion.estado === "BORRADOR" && (
                            <button
                              onClick={() => handleDelete(cotizacion.id)}
                              className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                          {isAdmin && (cotizacion.estado === "BORRADOR" || cotizacion.estado === "VISTA") && (
                            <button
                              onClick={() => handleEnviar(cotizacion.id)}
                              className="p-1.5 text-blue-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Marcar como enviada"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : cotizacion.id)}
                            className="p-1.5 text-zinc-300 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-zinc-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Items</p>
                              <div className="space-y-1 max-h-48 overflow-y-auto">
                                {cotizacion.items && cotizacion.items.length > 0 ? (
                                  cotizacion.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between text-sm py-1 border-b border-zinc-50">
                                      <span className="text-zinc-700">{item.cantidad} x {item.descripcion}</span>
                                      {isAdmin && (
                                        <span className="font-medium text-zinc-900">{formatCOP(item.total)}</span>
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-zinc-400">Cargando items...</p>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Detalles</p>
                              {isAdmin ? (
                                <div className="space-y-1 text-sm">
                                  <p><span className="text-zinc-500">Subtotal:</span> <span className="font-medium">{formatCOP(Number(cotizacion.subtotal || 0))}</span></p>
                                  <p><span className="text-zinc-500">IGV (18%):</span> <span className="font-medium">{formatCOP(Number(cotizacion.igv || 0))}</span></p>
                                  <p><span className="text-zinc-500">Total:</span> <span className="font-bold text-zinc-900">{formatCOP(Number(cotizacion.total || 0))}</span></p>
                                </div>
                              ) : (
                                <div className="space-y-1 text-sm">
                                  <p className="text-zinc-500">Ver detalles en la cotización completa</p>
                                </div>
                              )}
                              {cotizacion.notas && (
                                <div className="mt-2 p-2 bg-zinc-50 rounded-lg">
                                  <p className="text-[10px] text-zinc-400">Notas</p>
                                  <p className="text-xs text-zinc-600">{cotizacion.notas}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}