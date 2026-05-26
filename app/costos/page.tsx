"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Trash2,
  Save,
  ChevronLeft,
  Package,
  Users,
  Truck,
  AlertCircle,
  CheckCircle2,
  Loader2,
  BarChart3,
  ChevronDown,
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

// ── Contratos disponibles (mismo array que el dashboard) ──
const CONTRATOS_REALES = [
  { id: 1,  nombre: "Carpintería metálica Qantua",    monto: 178926.10, estado: "COBRADO",  tipo: "CONTRATO"    },
  { id: 2,  nombre: "Desmontaje malla Raschell",       monto: 1200.00,   estado: "COBRADO",  tipo: "SERVICIO"    },
  { id: 3,  nombre: "Adicionales Zendai",              monto: 56370.00,  estado: "COBRADO",  tipo: "ADENDA"      },
  { id: 4,  nombre: "Techos metálicos y cercos",       monto: 5470.00,   estado: "COBRADO",  tipo: "ADENDA"      },
  { id: 5,  nombre: "Apoyo operativo especializado",   monto: 18668.72,  estado: "COBRADO",  tipo: "SERVICIO"    },
  { id: 6,  nombre: "Cerco perimetral Fase 2",         monto: 55000.00,  estado: "COBRADO",  tipo: "CONTRATO"    },
  { id: 7,  nombre: "Desmontaje y retiro chutes",      monto: 1300.00,   estado: "PENDIENTE",tipo: "SERVICIO"    },
  { id: 8,  nombre: "Desmontaje y montaje cerco",      monto: 18000.00,  estado: "COBRADO",  tipo: "SERVICIO"    },
  { id: 9,  nombre: "Cerramiento y mantenimiento",     monto: 16600.00,  estado: "COBRADO",  tipo: "SERVICIO"    },
  { id: 10, nombre: "Contrato Qantua Fase 2",          monto: 543667.29, estado: "PENDIENTE",tipo: "VALORIZACION"},
];

// ── Categorías de costo ──
const CATEGORIAS = [
  {
    key: "materiales",
    label: "Materiales",
    icon: Package,
    color: "blue",
    campos: [
      { key: "fierro",      label: "Fierro / Acero" },
      { key: "pintura",     label: "Pintura y acabados" },
      { key: "galvanizado", label: "Galvanizado" },
    ],
  },
  {
    key: "manoObra",
    label: "Mano de obra",
    icon: Users,
    color: "violet",
    campos: [
      { key: "manoObra", label: "Mano de obra total" },
    ],
  },
  {
    key: "otros",
    label: "Otros gastos",
    icon: Truck,
    color: "amber",
    campos: [
      { key: "transporte",  label: "Transporte / Flete" },
      { key: "instalacion", label: "Instalación en obra" },
      { key: "desperdicio", label: "Merma / Desperdicio" },
      { key: "retrabajos",  label: "Retrabajos / Correcciones" },
    ],
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  blue:   { bg: "bg-blue-50",   border: "border-blue-100",   text: "text-blue-700",   icon: "bg-blue-100"   },
  violet: { bg: "bg-violet-50", border: "border-violet-100", text: "text-violet-700", icon: "bg-violet-100" },
  amber:  { bg: "bg-amber-50",  border: "border-amber-100",  text: "text-amber-700",  icon: "bg-amber-100"  },
};

type CamposCosto = {
  contratoNombre: string;
  descripcion: string;
  fecha: string;
  fierro: string; pintura: string; galvanizado: string;
  manoObra: string;
  transporte: string; instalacion: string; desperdicio: string; retrabajos: string;
};

const CAMPOS_VACIOS: CamposCosto = {
  contratoNombre: "",
  descripcion: "",
  fecha: new Date().toISOString().split("T")[0],
  fierro: "", pintura: "", galvanizado: "",
  manoObra: "",
  transporte: "", instalacion: "", desperdicio: "", retrabajos: "",
};

// ── Margen por contrato: ingreso = monto del contrato, costo = suma de CostoReal ──
function calcMargen(contrato: typeof CONTRATOS_REALES[0], costos: any[]) {
  const costoContrato = costos
    .filter((c) => c.contratoNombre === contrato.nombre)
    .reduce((s, c) =>
      s + Number(c.fierro) + Number(c.pintura) + Number(c.galvanizado)
        + Number(c.manoObra)
        + Number(c.transporte) + Number(c.instalacion)
        + Number(c.desperdicio) + Number(c.retrabajos), 0);
  return { costo: costoContrato, margen: contrato.monto - costoContrato };
}

export default function CostosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [projectId, setProjectId]   = useState<string>("");
  const [historial, setHistorial]   = useState<any[]>([]);
  const [form, setForm]             = useState<CamposCosto>(CAMPOS_VACIOS);
  const [saving, setSaving]         = useState(false);
  const [toast, setToast]           = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [loading, setLoading]       = useState(true);
  // Qué contrato está expandido en el resumen
  const [expandedContrato, setExpandedContrato] = useState<string | null>(null);
  // Filtro del historial derecho
  const [filtroContrato, setFiltroContrato] = useState<string>("TODOS");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") loadData();
  }, [status]);

  const loadData = async () => {
    setLoading(true);
    const { data: proj } = await supabase
      .from("Project")
      .select("id")
      .eq("name", "Qantua - Fase 02")
      .maybeSingle();

    if (proj) {
      setProjectId(proj.id);
      const { data: costos } = await supabase
        .from("CostoReal")
        .select("*")
        .eq("projectId", proj.id)
        .order("fecha", { ascending: false });
      setHistorial(costos || []);
    }
    setLoading(false);
  };

  const parse = (v: string) => parseFloat(v.replace(",", ".")) || 0;

  const totalForm = () =>
    parse(form.fierro) + parse(form.pintura) + parse(form.galvanizado) +
    parse(form.manoObra) +
    parse(form.transporte) + parse(form.instalacion) +
    parse(form.desperdicio) + parse(form.retrabajos);

  const totalRegistro = (c: any) =>
    Number(c.fierro) + Number(c.pintura) + Number(c.galvanizado) +
    Number(c.manoObra) +
    Number(c.transporte) + Number(c.instalacion) +
    Number(c.desperdicio) + Number(c.retrabajos);

  const handleSave = async () => {
    if (!projectId) return;
    if (!form.contratoNombre) {
      setToast({ type: "err", msg: "Selecciona el contrato al que pertenece este costo." });
      setTimeout(() => setToast(null), 4000);
      return;
    }
    if (!form.descripcion.trim()) {
      setToast({ type: "err", msg: "Agrega una descripción para identificar este registro." });
      setTimeout(() => setToast(null), 4000);
      return;
    }
    if (totalForm() === 0) {
      setToast({ type: "err", msg: "Ingresa al menos un costo antes de guardar." });
      setTimeout(() => setToast(null), 4000);
      return;
    }

    setSaving(true);
    const payload = {
      projectId,
      contratoNombre: form.contratoNombre,
      descripcion:    form.descripcion,
      fecha:          form.fecha,
      fierro:         parse(form.fierro),
      pintura:        parse(form.pintura),
      galvanizado:    parse(form.galvanizado),
      manoObra:       parse(form.manoObra),
      transporte:     parse(form.transporte),
      instalacion:    parse(form.instalacion),
      desperdicio:    parse(form.desperdicio),
      retrabajos:     parse(form.retrabajos),
    };

    const { error } = await supabase.from("CostoReal").insert(payload);
    setSaving(false);

    if (error) {
      setToast({ type: "err", msg: "Error al guardar. Intenta de nuevo." });
    } else {
      setToast({ type: "ok", msg: `Costo registrado en "${form.contratoNombre}".` });
      setForm(CAMPOS_VACIOS);
      loadData();
    }
    setTimeout(() => setToast(null), 4000);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("CostoReal").delete().eq("id", id);
    loadData();
  };

  // ── Totales globales ──
  const totalGlobal = historial.reduce((s, c) => s + totalRegistro(c), 0);
  const totalMateriales = historial.reduce(
    (s, c) => s + Number(c.fierro) + Number(c.pintura) + Number(c.galvanizado), 0
  );
  const totalMO     = historial.reduce((s, c) => s + Number(c.manoObra), 0);
  const totalOtros  = historial.reduce(
    (s, c) => s + Number(c.transporte) + Number(c.instalacion) + Number(c.desperdicio) + Number(c.retrabajos), 0
  );

  // Contratos que tienen al menos un registro de costo
  const contratosConCostos = CONTRATOS_REALES.filter((ct) =>
    historial.some((c) => c.contratoNombre === ct.nombre)
  );

  // Historial filtrado para el panel derecho
  const historialFiltrado = filtroContrato === "TODOS"
    ? historial
    : historial.filter((c) => c.contratoNombre === filtroContrato);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
          toast.type === "ok"
            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
            : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          {toast.type === "ok"
            ? <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            : <AlertCircle className="h-4 w-4 text-red-600" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Dashboard
            </button>
            <div className="h-4 w-px bg-gray-200" />
            <div>
              <h1 className="text-base font-bold text-gray-900">Costos por contrato</h1>
              <p className="text-xs text-gray-500">Margen real por servicio · Qantua F2</p>
            </div>
          </div>
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* ── KPIs globales (solo si hay datos) ── */}
        {historial.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Costos totales</p>
              <p className="text-xl font-bold text-gray-900">{formatCOP(totalGlobal)}</p>
              <p className="text-xs text-gray-400 mt-1">{historial.length} registros · {contratosConCostos.length} contratos</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Materiales</p>
              <p className="text-xl font-bold text-blue-700">{formatCOP(totalMateriales)}</p>
              <p className="text-xs text-gray-400 mt-1">
                {totalGlobal > 0 ? ((totalMateriales / totalGlobal) * 100).toFixed(0) : 0}% del total
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Mano de obra</p>
              <p className="text-xl font-bold text-violet-700">{formatCOP(totalMO)}</p>
              <p className="text-xs text-gray-400 mt-1">
                {totalGlobal > 0 ? ((totalMO / totalGlobal) * 100).toFixed(0) : 0}% del total
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Retrabajos acum.</p>
              <p className="text-xl font-bold text-red-600">
                {formatCOP(historial.reduce((s, c) => s + Number(c.retrabajos), 0))}
              </p>
              <p className="text-xs text-gray-400 mt-1">Costo de correcciones</p>
            </div>
          </div>
        )}

        {/* ── Resumen de margen por contrato (solo si hay datos) ── */}
        {contratosConCostos.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              Margen por contrato
            </h2>
            <div className="space-y-3">
              {contratosConCostos.map((ct) => {
                const { costo, margen } = calcMargen(ct, historial);
                const margenPct = ct.monto > 0 ? (margen / ct.monto) * 100 : 0;
                const isExpanded = expandedContrato === ct.nombre;
                const registros = historial.filter((c) => c.contratoNombre === ct.nombre);

                return (
                  <div key={ct.id} className="border border-gray-100 rounded-xl overflow-hidden">
                    {/* Cabecera del contrato */}
                    <button
                      onClick={() => setExpandedContrato(isExpanded ? null : ct.nombre)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-600">#{ct.id}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{ct.nombre}</p>
                          <p className="text-xs text-gray-400">
                            Ingreso: {formatCOP(ct.monto)} · {registros.length} registro{registros.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={`text-sm font-bold ${margen >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                            {margen >= 0 ? "+" : ""}{formatCOP(margen)}
                          </p>
                          <p className={`text-xs font-medium ${margen >= 0 ? "text-emerald-500" : "text-red-400"}`}>
                            {margenPct.toFixed(1)}% margen
                          </p>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </div>
                    </button>

                    {/* Barra de margen */}
                    <div className="px-4 pb-3">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${margen >= 0 ? "bg-emerald-500" : "bg-red-400"}`}
                          style={{ width: `${Math.min(Math.abs(margenPct), 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                        <span>Costo: {formatCOP(costo)}</span>
                        <span>Ingreso: {formatCOP(ct.monto)}</span>
                      </div>
                    </div>

                    {/* Registros detallados (expandible) */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-2">
                        {registros.map((r) => {
                          const tot = totalRegistro(r);
                          const mat = Number(r.fierro) + Number(r.pintura) + Number(r.galvanizado);
                          const mo  = Number(r.manoObra);
                          const ot  = Number(r.transporte) + Number(r.instalacion) + Number(r.desperdicio) + Number(r.retrabajos);
                          return (
                            <div key={r.id} className="bg-white rounded-lg border border-gray-100 p-3 flex items-start justify-between">
                              <div>
                                <p className="text-xs font-medium text-gray-900">{r.descripcion}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">
                                  {new Date(r.fecha).toLocaleDateString("es-PE")}
                                </p>
                                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                                  {mat > 0 && <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full">Mat. {formatCOP(mat)}</span>}
                                  {mo  > 0 && <span className="text-[10px] bg-violet-50 text-violet-700 px-1.5 py-0.5 rounded-full">MO {formatCOP(mo)}</span>}
                                  {ot  > 0 && <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-full">Otros {formatCOP(ot)}</span>}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-900">{formatCOP(tot)}</span>
                                <button onClick={() => handleDelete(r.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Formulario + Historial filtrado ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Formulario */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-5">
              <h2 className="text-sm font-semibold text-gray-900">Nuevo registro de costo</h2>

              {/* Selector de contrato — lo más importante */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                  Contrato / Servicio *
                </label>
                <select
                  value={form.contratoNombre}
                  onChange={(e) => setForm({ ...form, contratoNombre: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-900"
                >
                  <option value="">— Selecciona el contrato —</option>
                  {CONTRATOS_REALES.map((ct) => (
                    <option key={ct.id} value={ct.nombre}>
                      #{ct.id} · {ct.nombre} ({formatCOP(ct.monto)})
                    </option>
                  ))}
                </select>
                {form.contratoNombre && (
                  <div className="mt-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 text-xs text-gray-500">
                    Ingreso de referencia:{" "}
                    <span className="font-semibold text-gray-900">
                      {formatCOP(
                        CONTRATOS_REALES.find((c) => c.nombre === form.contratoNombre)?.monto || 0
                      )}
                    </span>
                    {" "}· Los costos que registres se restarán de este monto para calcular el margen.
                  </div>
                )}
              </div>

              {/* Descripción y fecha */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-700 mb-1.5 block">Descripción *</label>
                  <input
                    type="text"
                    placeholder="Ej: Compra fierro semana 21, Planilla mayo..."
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1.5 block">Fecha</label>
                  <input
                    type="date"
                    value={form.fecha}
                    onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                    className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                  />
                </div>
                <div className="flex items-end">
                  <div className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-400">Total este registro</p>
                    <p className="text-base font-bold text-gray-900">{formatCOP(totalForm())}</p>
                  </div>
                </div>
              </div>

              {/* Categorías */}
              {CATEGORIAS.map((cat) => {
                const c = colorMap[cat.color];
                const Icon = cat.icon;
                return (
                  <div key={cat.key} className={`${c.bg} ${c.border} border rounded-xl p-4`}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-7 h-7 ${c.icon} rounded-lg flex items-center justify-center`}>
                        <Icon className={`h-3.5 w-3.5 ${c.text}`} />
                      </div>
                      <h3 className={`text-sm font-semibold ${c.text}`}>{cat.label}</h3>
                    </div>
                    <div className={`grid grid-cols-${cat.campos.length === 1 ? "1" : "2"} gap-3`}>
                      {cat.campos.map((campo) => (
                        <div key={campo.key}>
                          <label className="text-xs text-gray-500 mb-1 block">{campo.label}</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">S/</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              value={(form as any)[campo.key]}
                              onChange={(e) => setForm({ ...form, [campo.key]: e.target.value })}
                              className="w-full pl-8 pr-3 py-2 text-sm border border-white bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Guardando..." : "Guardar registro"}
              </button>
            </div>
          </div>

          {/* Historial filtrable */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-900">Historial</h2>
                <span className="text-xs text-gray-400">{historialFiltrado.length} registros</span>
              </div>

              {/* Filtro por contrato */}
              <select
                value={filtroContrato}
                onChange={(e) => setFiltroContrato(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white text-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="TODOS">Todos los contratos</option>
                {CONTRATOS_REALES.map((ct) => (
                  <option key={ct.id} value={ct.nombre}>#{ct.id} · {ct.nombre}</option>
                ))}
              </select>

              {historialFiltrado.length === 0 ? (
                <div className="text-center py-10">
                  <BarChart3 className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">
                    {historial.length === 0
                      ? "Aún no hay costos registrados."
                      : "Sin registros para este contrato."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                  {historialFiltrado.map((c) => {
                    const tot = totalRegistro(c);
                    const mat = Number(c.fierro) + Number(c.pintura) + Number(c.galvanizado);
                    const mo  = Number(c.manoObra);
                    const ot  = Number(c.transporte) + Number(c.instalacion) + Number(c.desperdicio) + Number(c.retrabajos);
                    return (
                      <div key={c.id} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <p className="text-xs font-semibold text-gray-500">{c.contratoNombre}</p>
                            <p className="text-sm font-medium text-gray-900 leading-tight">{c.descripcion}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {new Date(c.fecha).toLocaleDateString("es-PE")}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900">{formatCOP(tot)}</span>
                            <button onClick={() => handleDelete(c.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="flex gap-1.5 flex-wrap mt-2">
                          {mat > 0 && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Mat. {formatCOP(mat)}</span>}
                          {mo  > 0 && <span className="text-xs bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full">MO {formatCOP(mo)}</span>}
                          {ot  > 0 && <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">Otros {formatCOP(ot)}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {historialFiltrado.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-gray-600">Total filtrado</span>
                    <span className="text-gray-900">
                      {formatCOP(historialFiltrado.reduce((s, c) => s + totalRegistro(c), 0))}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Tip retrabajos */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-amber-800">Tip: registra retrabajos por contrato</p>
                  <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                    Si un contrato tiene muchos retrabajos, el margen cae drásticamente. Registrarlo por separado te permite saber exactamente cuál te está costando más.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}