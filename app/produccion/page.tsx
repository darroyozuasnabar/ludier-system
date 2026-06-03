"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  Plus,
  Trash2,
  Pencil,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Factory,
  Users,
  ChevronDown,
  ChevronUp,
  Save,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Zap,
  Clock,
  Target,
  Activity,
  ArrowUp,
  ArrowRight,
  Flame,
  Shield,
  X,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ESTADOS_ORDEN = [
  { key: "PENDIENTE", label: "Pendiente", color: "neutral" },
  { key: "EN_PRODUCCION", label: "En producción", color: "blue" },
  { key: "EN_PINTURA", label: "En pintura", color: "violet" },
  { key: "EN_INSTALACION", label: "En instalación", color: "amber" },
  { key: "COMPLETADO", label: "Completado", color: "emerald" },
  { key: "PAUSADO", label: "Pausado", color: "red" },
];

const FLUJO_FABRICACION = [
  { paso: "Corte", fase: "fab" },
  { paso: "Armado", fase: "fab", bottleneck: true },
  { paso: "Soldadura", fase: "fab" },
  { paso: "Esmerilado", fase: "fab" },
  { paso: "Masillado", fase: "acab" },
  { paso: "Lijado", fase: "acab" },
  { paso: "Thinner", fase: "acab" },
  { paso: "Base epóxica", fase: "acab" },
  { paso: "Gloss mate", fase: "acab" },
];

const FLUJO_INSTALACION = [
  { paso: "Trazado", fase: "inst" },
  { paso: "Picado / hueco", fase: "inst" },
  { paso: "Presentación", fase: "inst" },
  { paso: "Soldadura", fase: "inst" },
  { paso: "Verificación", fase: "inst" },
  { paso: "Anclaje", fase: "inst" },
  { paso: "Poxi", fase: "inst" },
];

type OrdenForm = {
  nombre: string;
  tipo: string;
  cantidad: string;
  unidad: string;
  prioridad: string;
  estado: string;
  fechaInicio: string;
  fechaFin: string;
  observaciones: string;
};

const FORM_VACIO: OrdenForm = {
  nombre: "",
  tipo: "BARANDA",
  cantidad: "",
  unidad: "unidades",
  prioridad: "MEDIA",
  estado: "PENDIENTE",
  fechaInicio: new Date().toISOString().split("T")[0],
  fechaFin: "",
  observaciones: "",
};

// ─── Helpers de estilos ───────────────────────────────────────────────────────

const estadoBadge: Record<string, string> = {
  PENDIENTE: "bg-zinc-100 text-zinc-600 border border-zinc-200",
  EN_PRODUCCION: "bg-blue-50 text-blue-700 border border-blue-200",
  EN_PINTURA: "bg-violet-50 text-violet-700 border border-violet-200",
  EN_INSTALACION: "bg-amber-50 text-amber-700 border border-amber-200",
  COMPLETADO: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  PAUSADO: "bg-red-50 text-red-600 border border-red-200",
};

const prioridadConfig: Record<string, { style: string; dot: string }> = {
  ALTA: { style: "text-red-600 font-semibold", dot: "bg-red-500" },
  MEDIA: { style: "text-amber-600 font-semibold", dot: "bg-amber-400" },
  BAJA: { style: "text-zinc-400", dot: "bg-zinc-300" },
};

const getEstadoLabel = (key: string) =>
  ESTADOS_ORDEN.find((e) => e.key === key)?.label ?? key;

// ─── Barra de progreso de flujo ───────────────────────────────────────────────
const ESTADO_STEP: Record<string, number> = {
  PENDIENTE: 0,
  EN_PRODUCCION: 2,
  EN_PINTURA: 6,
  EN_INSTALACION: 8,
  COMPLETADO: 9,
  PAUSADO: -1,
};

function FlujoBadgeLine({ estado }: { estado: string }) {
  const step = ESTADO_STEP[estado] ?? 0;
  const total = FLUJO_FABRICACION.length;
  const pct = estado === "COMPLETADO" ? 100 : Math.round((step / total) * 100);
  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex-1 h-1 rounded-full bg-zinc-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            estado === "PAUSADO"
              ? "bg-red-400"
              : estado === "COMPLETADO"
              ? "bg-emerald-500"
              : "bg-blue-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] text-zinc-400 font-mono w-7 text-right">{pct}%</span>
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
  trend,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  trend?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent ?? "bg-zinc-50"}`}>
          <Icon className="h-4 w-4 text-zinc-600" />
        </div>
        {trend && (
          <span className="flex items-center gap-0.5 text-xs text-emerald-600 font-medium">
            <ArrowUp className="h-3 w-3" />
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-bold text-zinc-900 leading-none mt-1">{value}</p>
        {sub && <p className="text-xs text-zinc-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Sección de título ────────────────────────────────────────────────────────
function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider">{children}</h2>
      {sub && <p className="text-xs text-zinc-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function ProduccionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ordenes, setOrdenes] = useState<any[]>([]);
  const [produccionDiaria, setProduccionDiaria] = useState<any[]>([]);
  const [capacidades, setCapacidades] = useState<any[]>([]);
  const [cuadrillas, setCuadrillas] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState<OrdenForm>(FORM_VACIO);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [filterEstado, setFilterEstado] = useState<string>("ALL");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") loadData();
  }, [status]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordenesRes, prodRes, capRes, cuadrillasRes] = await Promise.all([
        supabase.from("OrdenProduccion").select("*").order("createdAt", { ascending: false }),
        supabase.from("ProduccionDiaria").select("*").order("fecha", { ascending: false }),
        supabase.from("CapacidadProductiva").select("*"),
        supabase.from("Cuadrilla").select("*"),
      ]);
      setOrdenes(ordenesRes.data || []);
      setProduccionDiaria(prodRes.data || []);
      setCapacidades(capRes.data || []);
      setCuadrillas(cuadrillasRes.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type: "ok" | "err", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSave = async () => {
    if (!form.nombre.trim()) {
      showToast("err", "Completa el nombre de la orden.");
      return;
    }
    setSaving(true);
    const payload = {
      nombre: form.nombre,
      tipo: form.tipo,
      cantidad: parseInt(form.cantidad) || 1,
      unidad: form.unidad,
      prioridad: form.prioridad,
      estado: form.estado,
      fechaInicio: form.fechaInicio,
      fechaFin: form.fechaFin || null,
      observaciones: form.observaciones || null,
    };
    let error;
    if (editingId) {
      ({ error } = await supabase.from("OrdenProduccion").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("OrdenProduccion").insert(payload));
    }
    setSaving(false);
    if (error) {
      showToast("err", "Error al guardar.");
    } else {
      showToast("ok", editingId ? "Orden actualizada." : "Orden creada.");
      setForm(FORM_VACIO);
      setShowForm(false);
      setEditingId(null);
      loadData();
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    await supabase.from("OrdenProduccion").update({ estado: newStatus }).eq("id", id);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta orden?")) return;
    await supabase.from("OrdenProduccion").delete().eq("id", id);
    loadData();
  };

  const handleEdit = (orden: any) => {
    setForm({
      nombre: orden.nombre,
      tipo: orden.tipo,
      cantidad: String(orden.cantidad),
      unidad: orden.unidad || "unidades",
      prioridad: orden.prioridad,
      estado: orden.estado,
      fechaInicio: orden.fechaInicio?.split("T")[0] || "",
      fechaFin: orden.fechaFin?.split("T")[0] || "",
      observaciones: orden.observaciones || "",
    });
    setEditingId(orden.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-zinc-300" />
          <p className="text-xs text-zinc-400 tracking-wider uppercase">Cargando producción</p>
        </div>
      </div>
    );
  }

  // ─── KPIs derivados ──────────────────────────────────────────────────────────
  const enProceso = ordenes.filter(
    (o) => o.estado === "EN_PRODUCCION" || o.estado === "EN_PINTURA" || o.estado === "EN_INSTALACION"
  ).length;
  const completados = ordenes.filter((o) => o.estado === "COMPLETADO").length;
  const pendientes = ordenes.filter((o) => o.estado === "PENDIENTE").length;
  const pausados = ordenes.filter((o) => o.estado === "PAUSADO").length;
  const capacidadBaranda = capacidades.find((c) => c.tipo === "BARANDA")?.cantidad_diaria ?? 5;

  // Producción diaria total
  const totalProdDiaria = produccionDiaria.reduce((acc, p) => acc + (p.cantidad ?? 0), 0);

  // Eficiencia (completados / total si hay órdenes)
  const eficiencia =
    ordenes.length > 0 ? Math.round((completados / ordenes.length) * 100) : 0;

  // Filtro de órdenes
  const ordenesFiltradas =
    filterEstado === "ALL" ? ordenes : ordenes.filter((o) => o.estado === filterEstado);

  // Alta prioridad activa
  const altaPrioridad = ordenes.filter(
    (o) => o.prioridad === "ALTA" && o.estado !== "COMPLETADO" && o.estado !== "PAUSADO"
  );

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">

      {/* ── Toast ─────────────────────────────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium border backdrop-blur-sm ${
            toast.type === "ok"
              ? "bg-emerald-50/95 text-emerald-800 border-emerald-200"
              : "bg-red-50/95 text-red-800 border-red-200"
          }`}
        >
          {toast.type === "ok" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
          )}
          {toast.msg}
          <button onClick={() => setToast(null)} className="ml-1 text-zinc-400 hover:text-zinc-600">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-700 text-sm transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Dashboard
            </button>
            <div className="h-4 w-px bg-zinc-200" />
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center">
                <Factory className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-zinc-900 leading-none">Panel de Producción</h1>
                <p className="text-[10px] text-zinc-400 mt-0.5 uppercase tracking-wider">Control de fabricación · LUDIER</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {pausados > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
                <AlertTriangle className="h-3.5 w-3.5" />
                {pausados} pausada{pausados > 1 ? "s" : ""}
              </div>
            )}
            <button
              onClick={() => {
                setForm(FORM_VACIO);
                setEditingId(null);
                setShowForm(!showForm);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-xs font-semibold rounded-xl hover:bg-zinc-800 transition-colors tracking-wide uppercase"
            >
              <Plus className="h-3.5 w-3.5" />
              Nueva orden
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">

        {/* ── Alerta de alta prioridad ──────────────────────────────────────────── */}
        {altaPrioridad.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <Flame className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-800">
                {altaPrioridad.length} orden{altaPrioridad.length > 1 ? "es" : ""} de alta prioridad activa{altaPrioridad.length > 1 ? "s" : ""}
              </p>
              <p className="text-xs text-red-600 mt-0.5">
                {altaPrioridad.map((o) => o.nombre).join(" · ")}
              </p>
            </div>
          </div>
        )}

        {/* ── KPIs principales ──────────────────────────────────────────────────── */}
        <section>
          <SectionTitle sub="Métricas clave del período actual">Visión ejecutiva</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard
              icon={Activity}
              label="En proceso"
              value={enProceso}
              sub="órdenes activas ahora"
              accent="bg-blue-50"
            />
            <KpiCard
              icon={CheckCircle}
              label="Completadas"
              value={completados}
              sub="este período"
              accent="bg-emerald-50"
              trend={completados > 0 ? `${eficiencia}% efic.` : undefined}
            />
            <KpiCard
              icon={Clock}
              label="Pendientes"
              value={pendientes}
              sub="sin iniciar"
              accent="bg-amber-50"
            />
            <KpiCard
              icon={BarChart3}
              label="Cap. diaria"
              value={`${capacidadBaranda} u.`}
              sub="barandas por día"
              accent="bg-zinc-50"
            />
          </div>
        </section>

        {/* ── Capacidades + producción registrada ──────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Capacidades */}
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
            <SectionTitle sub="Rendimiento por tipo de producto">Capacidad productiva</SectionTitle>
            <div className="space-y-3">
              {capacidades.map((cap) => {
                const pct = Math.min(100, Math.round((cap.cantidad_diaria / 100) * 100));
                return (
                  <div key={cap.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-zinc-700 uppercase tracking-wide">
                        {cap.tipo.replace("_", " ")}
                      </span>
                      <span className="text-xs text-zinc-500">
                        <span className="font-bold text-zinc-900">{cap.cantidad_diaria}</span>{" "}
                        {cap.unidad}/día · {cap.personal_requerido} personas
                      </span>
                    </div>
                    <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-zinc-800 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {capacidades.length === 0 && (
                <p className="text-xs text-zinc-300 py-4 text-center">Sin datos de capacidad</p>
              )}
            </div>
          </div>

          {/* Producción diaria */}
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <SectionTitle sub="Registro histórico de fabricación">Producción diaria</SectionTitle>
              <div className="text-right">
                <p className="text-2xl font-bold text-zinc-900">{totalProdDiaria}</p>
                <p className="text-[10px] text-zinc-400 uppercase tracking-wide">unidades totales</p>
              </div>
            </div>
            <div className="space-y-2">
              {produccionDiaria.slice(0, 5).map((prod) => (
                <div key={prod.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-colors">
                  <div>
                    <p className="text-xs font-semibold text-zinc-800">
                      {new Date(prod.fecha).toLocaleDateString("es-PE", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      {prod.trabajadores} · {prod.horas_trabajadas}h
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-px bg-zinc-200" />
                    <span className="text-base font-bold text-zinc-900">{prod.cantidad}</span>
                    <span className="text-[10px] text-zinc-400">{prod.tipo.replace("_", " ").toLowerCase()}s</span>
                  </div>
                </div>
              ))}
              {produccionDiaria.length === 0 && (
                <p className="text-xs text-zinc-300 py-4 text-center">Sin registros de producción diaria</p>
              )}
            </div>
          </div>
        </section>

        {/* ── Flujo de producción visual ────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
          <SectionTitle sub="9 pasos de fabricación + 7 pasos de instalación">Flujo de proceso</SectionTitle>
          <div className="space-y-5">

            {/* Fabricación */}
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Fabricación</p>
              <div className="flex flex-wrap gap-2">
                {FLUJO_FABRICACION.map((paso, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        paso.bottleneck
                          ? "bg-red-50 border border-red-200 text-red-700"
                          : "bg-zinc-50 border border-zinc-200 text-zinc-700"
                      }`}
                    >
                      <span className="text-[10px] text-zinc-300 font-mono">{String(i + 1).padStart(2, "0")}</span>
                      {paso.paso}
                      {paso.bottleneck && (
                        <span className="ml-1 text-[9px] bg-red-100 text-red-600 px-1 py-0.5 rounded font-bold uppercase tracking-wider">
                          ⚠ cuello
                        </span>
                      )}
                    </div>
                    {i < FLUJO_FABRICACION.length - 1 && (
                      <ArrowRight className="h-3 w-3 text-zinc-200 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Instalación */}
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Instalación</p>
              <div className="flex flex-wrap gap-2">
                {FLUJO_INSTALACION.map((paso, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-xs font-medium text-blue-700">
                      <span className="text-[10px] text-blue-300 font-mono">{String(i + 1).padStart(2, "0")}</span>
                      {paso.paso}
                    </div>
                    {i < FLUJO_INSTALACION.length - 1 && (
                      <ArrowRight className="h-3 w-3 text-zinc-200 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Cuadrillas ───────────────────────────────────────────────────────── */}
        {cuadrillas.length > 0 && (
          <section className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
            <SectionTitle sub="Equipos operativos activos">Cuadrillas</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cuadrillas.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                  <div className="w-9 h-9 rounded-xl bg-zinc-200 flex items-center justify-center">
                    <Users className="h-4 w-4 text-zinc-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-800">{c.nombre}</p>
                    <p className="text-xs text-zinc-400">{c.ubicacion}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full uppercase tracking-wide">
                      Activa
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Formulario nueva / editar orden ───────────────────────────────────── */}
        {showForm && (
          <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                  {editingId ? "Editar orden" : "Nueva orden de producción"}
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">Completa los datos del pedido</p>
              </div>
              <button
                onClick={() => { setShowForm(false); setEditingId(null); setForm(FORM_VACIO); }}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                  Nombre / producto *
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"
                  placeholder="Ej: Barandas Torre A, Cercos perimetrales..."
                />
              </div>

              {(
                [
                  {
                    label: "Tipo",
                    field: "tipo",
                    type: "select",
                    options: [
                      { value: "BARANDA", label: "Baranda" },
                      { value: "CERCO", label: "Cerco" },
                      { value: "ESTRUCTURA", label: "Estructura" },
                      { value: "ESCALERA", label: "Escalera" },
                    ],
                  },
                  {
                    label: "Cantidad",
                    field: "cantidad",
                    type: "number",
                  },
                  {
                    label: "Prioridad",
                    field: "prioridad",
                    type: "select",
                    options: [
                      { value: "BAJA", label: "Baja" },
                      { value: "MEDIA", label: "Media" },
                      { value: "ALTA", label: "Alta" },
                    ],
                  },
                  {
                    label: "Estado",
                    field: "estado",
                    type: "select",
                    options: ESTADOS_ORDEN.map((e) => ({ value: e.key, label: e.label })),
                  },
                  { label: "Fecha inicio", field: "fechaInicio", type: "date" },
                  { label: "Fecha fin estimada", field: "fechaFin", type: "date" },
                ] as any[]
              ).map((item) => (
                <div key={item.field}>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                    {item.label}
                  </label>
                  {item.type === "select" ? (
                    <select
                      value={(form as any)[item.field]}
                      onChange={(e) => setForm({ ...form, [item.field]: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"
                    >
                      {item.options.map((o: any) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={item.type}
                      min={item.type === "number" ? "0" : undefined}
                      value={(form as any)[item.field]}
                      onChange={(e) => setForm({ ...form, [item.field]: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"
                    />
                  )}
                </div>
              ))}

              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                  Observaciones
                </label>
                <textarea
                  rows={2}
                  value={form.observaciones}
                  onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors resize-none"
                  placeholder="Detalles adicionales..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-zinc-100">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white text-xs font-bold rounded-xl hover:bg-zinc-800 transition-colors uppercase tracking-wide disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Guardando..." : editingId ? "Actualizar" : "Crear orden"}
              </button>
              <button
                onClick={() => { setShowForm(false); setEditingId(null); setForm(FORM_VACIO); }}
                className="px-5 py-2.5 border border-zinc-200 text-zinc-600 bg-white rounded-xl hover:bg-zinc-50 text-xs font-semibold uppercase tracking-wide transition-colors"
              >
                Cancelar
              </button>
            </div>
          </section>
        )}

        {/* ── Lista de órdenes ──────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <SectionTitle sub={`${ordenesFiltradas.length} de ${ordenes.length} órdenes`}>
              Órdenes de producción
            </SectionTitle>

            {/* Filtros rápidos */}
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {[
                { key: "ALL", label: "Todas" },
                { key: "EN_PRODUCCION", label: "En prod." },
                { key: "EN_INSTALACION", label: "Instalac." },
                { key: "PENDIENTE", label: "Pendiente" },
                { key: "COMPLETADO", label: "Completadas" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilterEstado(f.key)}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors ${
                    filterEstado === f.key
                      ? "bg-zinc-900 text-white"
                      : "bg-white border border-zinc-200 text-zinc-500 hover:border-zinc-400"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {ordenesFiltradas.length === 0 ? (
            <div className="bg-white rounded-2xl border border-zinc-100 p-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center mx-auto mb-4">
                <Factory className="h-7 w-7 text-zinc-200" />
              </div>
              <p className="text-sm text-zinc-400">No hay órdenes en este filtro.</p>
              <p className="text-xs text-zinc-300 mt-1">
                {filterEstado === "ALL"
                  ? 'Crea la primera con "Nueva orden".'
                  : "Prueba con otro filtro."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {ordenesFiltradas.map((orden) => {
                const isExpanded = expandedId === orden.id;
                const pConfig = prioridadConfig[orden.prioridad] ?? prioridadConfig.BAJA;

                return (
                  <div
                    key={orden.id}
                    className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden hover:border-zinc-200 transition-colors"
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-4">

                        {/* Indicador de prioridad */}
                        <div className="flex flex-col items-center gap-1 pt-0.5">
                          <div className={`w-2 h-2 rounded-full ${pConfig.dot}`} />
                          <div className="w-px flex-1 bg-zinc-100 min-h-[24px]" />
                        </div>

                        {/* Contenido principal */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-sm font-bold text-zinc-900 truncate">{orden.nombre}</h3>
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${estadoBadge[orden.estado] ?? "bg-zinc-100 text-zinc-600"}`}>
                                  {getEstadoLabel(orden.estado)}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 mt-1 flex-wrap">
                                <span className="text-xs text-zinc-500">
                                  <span className="font-semibold text-zinc-700">{orden.cantidad}</span> {orden.unidad}
                                </span>
                                <span className="text-[10px] text-zinc-300">·</span>
                                <span className="text-xs text-zinc-400 uppercase tracking-wide">{orden.tipo}</span>
                                <span className="text-[10px] text-zinc-300">·</span>
                                <span className={`text-xs ${pConfig.style}`}>
                                  ↑ {orden.prioridad}
                                </span>
                                <span className="text-[10px] text-zinc-300">·</span>
                                <span className="text-xs text-zinc-400 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(orden.fechaInicio).toLocaleDateString("es-PE", {
                                    day: "2-digit", month: "short"
                                  })}
                                </span>
                              </div>
                              <FlujoBadgeLine estado={orden.estado} />
                            </div>

                            {/* Acciones */}
                            <div className="flex items-center gap-0.5 shrink-0">
                              <button
                                onClick={() => handleEdit(orden)}
                                className="p-1.5 text-zinc-300 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                                title="Editar"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(orden.id)}
                                className="p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => setExpandedId(isExpanded ? null : orden.id)}
                                className="p-1.5 text-zinc-300 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expandido */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-zinc-50 pl-6">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                                Observaciones
                              </p>
                              <p className="text-xs text-zinc-600">
                                {orden.observaciones || "Sin observaciones registradas."}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                                Fecha fin estimada
                              </p>
                              <p className="text-xs text-zinc-600">
                                {orden.fechaFin
                                  ? new Date(orden.fechaFin).toLocaleDateString("es-PE", {
                                      weekday: "long", day: "numeric", month: "long",
                                    })
                                  : "No definida"}
                              </p>
                            </div>
                          </div>

                          {/* Cambiar estado */}
                          <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                              Cambiar estado
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {ESTADOS_ORDEN.map((e) => (
                                <button
                                  key={e.key}
                                  onClick={() => handleUpdateStatus(orden.id, e.key)}
                                  className={`text-[10px] px-3 py-1.5 rounded-full font-semibold uppercase tracking-wide transition-all ${
                                    orden.estado === e.key
                                      ? `${estadoBadge[e.key]} ring-2 ring-offset-1 ring-zinc-300`
                                      : "bg-zinc-50 text-zinc-500 border border-zinc-200 hover:border-zinc-400 hover:text-zinc-700"
                                  }`}
                                >
                                  {e.label}
                                </button>
                              ))}
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