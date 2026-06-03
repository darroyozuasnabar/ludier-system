"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Trash2, Save, ChevronLeft, Package, Users, Truck,
  AlertCircle, CheckCircle2, Loader2, BarChart3, ChevronDown, Scissors,
  Pencil, X, Check,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const fmt = (n: number) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", minimumFractionDigits: 2 }).format(n);

const CONTRATOS_REALES = [
  { id: 1,  nombre: "Carpintería metálica Qantua",    monto: 178926.10, tipo: "CONTRATO"     },
  { id: 2,  nombre: "Desmontaje malla Raschell",       monto: 1200.00,   tipo: "SERVICIO"     },
  { id: 3,  nombre: "Adicionales Zendai",              monto: 56370.00,  tipo: "ADENDA"       },
  { id: 4,  nombre: "Techos metálicos y cercos",       monto: 5470.00,   tipo: "ADENDA"       },
  { id: 5,  nombre: "Apoyo operativo especializado",   monto: 18668.72,  tipo: "SERVICIO"     },
  { id: 6,  nombre: "Cerco perimetral Fase 2",         monto: 55000.00,  tipo: "CONTRATO"     },
  { id: 7,  nombre: "Desmontaje y retiro chutes",      monto: 1300.00,   tipo: "SERVICIO"     },
  { id: 8,  nombre: "Desmontaje y montaje cerco",      monto: 18000.00,  tipo: "SERVICIO"     },
  { id: 9,  nombre: "Cerramiento y mantenimiento",     monto: 16600.00,  tipo: "SERVICIO"     },
  { id: 10, nombre: "Contrato Qantua Fase 2",          monto: 543667.29, tipo: "VALORIZACION" },
];

// ─── Categorías de costo ──────────────────────────────────────────────────────
const CATEGORIAS = [
  {
    key: "materiales",
    label: "Materiales",
    icon: Package,
    color: "blue",
    campos: [
      { key: "fierro",      label: "Fierro / Acero"     },
      { key: "pintura",     label: "Pintura y acabados" },
      { key: "galvanizado", label: "Galvanizado"        },
    ],
  },
  {
    key: "consumibles",
    label: "Consumibles",
    icon: Scissors,
    color: "rose",
    campos: [
      { key: "discos",       label: "Discos de corte / desbaste" },
      { key: "electrodos",   label: "Electrodos / alambre MIG"   },
      { key: "oxicorte",     label: "Gas / Oxicorte"             },
      { key: "otrosConsumibles", label: "Otros consumibles"      },
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
      { key: "transporte",  label: "Transporte / Flete"       },
      { key: "instalacion", label: "Instalación en obra"      },
      { key: "desperdicio", label: "Merma / Desperdicio"      },
      { key: "retrabajos",  label: "Retrabajos / Correcciones"},
    ],
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; icon: string; ring: string }> = {
  blue:   { bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-800",   icon: "bg-blue-100",   ring: "focus:ring-blue-400"   },
  rose:   { bg: "bg-rose-50",   border: "border-rose-200",   text: "text-rose-800",   icon: "bg-rose-100",   ring: "focus:ring-rose-400"   },
  violet: { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-800", icon: "bg-violet-100", ring: "focus:ring-violet-400" },
  amber:  { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-800",  icon: "bg-amber-100",  ring: "focus:ring-amber-400"  },
};

// ─── Clase compartida para TODOS los inputs ───────────────────────────────────
// text-gray-900 + bg-white forzados para evitar campos invisibles
const INPUT_BASE = "w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent";
const INPUT_MONTO = "w-full pl-8 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent";
const SELECT_BASE = "w-full px-3 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent";
const LABEL_BASE  = "text-xs font-semibold text-gray-700 mb-1.5 block";

type CamposCosto = {
  contratoNombre: string; descripcion: string; fecha: string;
  fierro: string; pintura: string; galvanizado: string;
  discos: string; electrodos: string; oxicorte: string; otrosConsumibles: string;
  manoObra: string;
  transporte: string; instalacion: string; desperdicio: string; retrabajos: string;
};

const VACIO: CamposCosto = {
  contratoNombre: "", descripcion: "",
  fecha: new Date().toISOString().split("T")[0],
  fierro: "", pintura: "", galvanizado: "",
  discos: "", electrodos: "", oxicorte: "", otrosConsumibles: "",
  manoObra: "",
  transporte: "", instalacion: "", desperdicio: "", retrabajos: "",
};

function calcMargen(contrato: typeof CONTRATOS_REALES[0], costos: any[]) {
  const costo = costos
    .filter(c => c.contratoNombre === contrato.nombre)
    .reduce((s, c) =>
      s + Number(c.fierro)      + Number(c.pintura)     + Number(c.galvanizado)
        + Number(c.discos||0)   + Number(c.electrodos||0) + Number(c.oxicorte||0) + Number(c.otrosConsumibles||0)
        + Number(c.manoObra)
        + Number(c.transporte)  + Number(c.instalacion)
        + Number(c.desperdicio) + Number(c.retrabajos), 0);
  return { costo, margen: contrato.monto - costo };
}

export default function CostosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [projectId,        setProjectId]        = useState("");
  const [historial,        setHistorial]        = useState<any[]>([]);
  const [form,             setForm]             = useState<CamposCosto>(VACIO);
  const [saving,           setSaving]           = useState(false);
  const [loading,          setLoading]          = useState(true);
  const [toast,            setToast]            = useState<{ type: "ok"|"err"; msg: string }|null>(null);
  const [expandedContrato, setExpandedContrato] = useState<string|null>(null);
  const [filtroContrato,   setFiltroContrato]   = useState("TODOS");
  const [editingId,        setEditingId]        = useState<string|null>(null);
  const [editForm,         setEditForm]         = useState({ descripcion: "", contratoNombre: "", fecha: "" });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated")   loadData();
  }, [status]);

  const loadData = async () => {
    setLoading(true);
    const { data: proj } = await supabase
      .from("Project").select("id").eq("name", "Qantua - Fase 02").maybeSingle();
    if (proj) {
      setProjectId(proj.id);
      const { data } = await supabase
        .from("CostoReal").select("*").eq("projectId", proj.id)
        .order("fecha", { ascending: false });
      setHistorial(data || []);
    }
    setLoading(false);
  };

  const parse = (v: string) => parseFloat(v.replace(",", ".")) || 0;

  const totalForm = () =>
    parse(form.fierro) + parse(form.pintura) + parse(form.galvanizado) +
    parse(form.discos) + parse(form.electrodos) + parse(form.oxicorte) + parse(form.otrosConsumibles) +
    parse(form.manoObra) +
    parse(form.transporte) + parse(form.instalacion) + parse(form.desperdicio) + parse(form.retrabajos);

  const totalReg = (c: any) =>
    Number(c.fierro)     + Number(c.pintura)      + Number(c.galvanizado) +
    Number(c.discos||0)  + Number(c.electrodos||0) + Number(c.oxicorte||0) + Number(c.otrosConsumibles||0) +
    Number(c.manoObra) +
    Number(c.transporte) + Number(c.instalacion)  + Number(c.desperdicio) + Number(c.retrabajos);

  const showToast = (type: "ok"|"err", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const startEdit = (c: any) => {
    setEditingId(c.id);
    setEditForm({ descripcion: c.descripcion, contratoNombre: c.contratoNombre, fecha: c.fecha });
  };

  const handleUpdate = async () => {
    if (!editForm.descripcion.trim()) { showToast("err", "La descripción no puede estar vacía."); return; }
    setSaving(true);
    const { error } = await supabase
      .from("CostoReal")
      .update({ descripcion: editForm.descripcion, contratoNombre: editForm.contratoNombre, fecha: editForm.fecha })
      .eq("id", editingId!);
    setSaving(false);
    if (error) { showToast("err", "Error al actualizar."); }
    else { showToast("ok", "Registro actualizado."); setEditingId(null); loadData(); }
  };

  const handleSave = async () => {
    if (!projectId) return;
    if (!form.contratoNombre) { showToast("err", "Selecciona el contrato."); return; }
    if (!form.descripcion.trim()) { showToast("err", "Agrega una descripción."); return; }
    if (totalForm() === 0) { showToast("err", "Ingresa al menos un costo."); return; }

    setSaving(true);
    const { error } = await supabase.from("CostoReal").insert({
      projectId, contratoNombre: form.contratoNombre, descripcion: form.descripcion, fecha: form.fecha,
      fierro: parse(form.fierro), pintura: parse(form.pintura), galvanizado: parse(form.galvanizado),
      discos: parse(form.discos), electrodos: parse(form.electrodos),
      oxicorte: parse(form.oxicorte), otrosConsumibles: parse(form.otrosConsumibles),
      manoObra: parse(form.manoObra),
      transporte: parse(form.transporte), instalacion: parse(form.instalacion),
      desperdicio: parse(form.desperdicio), retrabajos: parse(form.retrabajos),
    });
    setSaving(false);
    if (error) { showToast("err", "Error al guardar."); }
    else { showToast("ok", `Costo registrado en "${form.contratoNombre}".`); setForm(VACIO); loadData(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este registro?")) return;
    await supabase.from("CostoReal").delete().eq("id", id);
    loadData();
  };

  // ─── Totales globales ─────────────────────────────────────────────────────
  const totalGlobal       = historial.reduce((s, c) => s + totalReg(c), 0);
  const totalMateriales   = historial.reduce((s, c) => s + Number(c.fierro) + Number(c.pintura) + Number(c.galvanizado), 0);
  const totalConsumibles  = historial.reduce((s, c) => s + Number(c.discos||0) + Number(c.electrodos||0) + Number(c.oxicorte||0) + Number(c.otrosConsumibles||0), 0);
  const totalMO           = historial.reduce((s, c) => s + Number(c.manoObra), 0);
  const totalRetrabajos   = historial.reduce((s, c) => s + Number(c.retrabajos), 0);

  const contratosConCostos = CONTRATOS_REALES.filter(ct => historial.some(c => c.contratoNombre === ct.nombre));
  const historialFiltrado  = filtroContrato === "TODOS" ? historial : historial.filter(c => c.contratoNombre === filtroContrato);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
          toast.type === "ok"
            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
            : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          {toast.type === "ok" ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertCircle className="h-4 w-4 text-red-600" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10" style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/")} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm transition-colors">
              <ChevronLeft className="h-4 w-4" /> Dashboard
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <div>
              <h1 className="text-base font-bold text-slate-900">Costos por contrato</h1>
              <p className="text-xs text-slate-500">Margen real por servicio · Qantua F2</p>
            </div>
          </div>
          <div className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-sm">L</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">

        {/* KPIs */}
        {historial.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Costos totales",   value: fmt(totalGlobal),      sub: `${historial.length} registros · ${contratosConCostos.length} contratos`, color: "text-slate-900" },
              { label: "Materiales",        value: fmt(totalMateriales),  sub: `${totalGlobal > 0 ? ((totalMateriales/totalGlobal)*100).toFixed(0) : 0}% del total`, color: "text-blue-700" },
              { label: "Consumibles",       value: fmt(totalConsumibles), sub: `${totalGlobal > 0 ? ((totalConsumibles/totalGlobal)*100).toFixed(0) : 0}% del total`, color: "text-rose-700" },
              { label: "Retrabajos acum.", value: fmt(totalRetrabajos),  sub: "Costo de correcciones", color: "text-red-600" },
            ].map((k, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5" style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{k.label}</p>
                <p className={`text-xl font-bold leading-tight ${k.color}`}>{k.value}</p>
                <p className="text-xs text-slate-400 mt-1">{k.sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* Margen por contrato */}
        {contratosConCostos.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}>
            <div className="px-6 py-4 border-b border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Margen por contrato</p>
            </div>
            <div className="divide-y divide-slate-50">
              {contratosConCostos.map(ct => {
                const { costo, margen } = calcMargen(ct, historial);
                const margenPct = ct.monto > 0 ? (margen / ct.monto) * 100 : 0;
                const isExpanded = expandedContrato === ct.nombre;
                const registros  = historial.filter(c => c.contratoNombre === ct.nombre);

                return (
                  <div key={ct.id}>
                    <button
                      onClick={() => setExpandedContrato(isExpanded ? null : ct.nombre)}
                      className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-400 w-6">#{ct.id}</span>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{ct.nombre}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Ingreso: {fmt(ct.monto)} · {registros.length} registro{registros.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-5">
                        {/* Mini barra */}
                        <div className="hidden sm:block w-24">
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${margen >= 0 ? "bg-emerald-500" : "bg-red-400"}`}
                              style={{ width: `${Math.min(Math.abs(margenPct), 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
                            <span>{fmt(costo)}</span>
                            <span>{fmt(ct.monto)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${margen >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                            {margen >= 0 ? "+" : ""}{fmt(margen)}
                          </p>
                          <p className={`text-xs font-semibold ${margen >= 0 ? "text-emerald-500" : "text-red-400"}`}>
                            {margenPct.toFixed(1)}% margen
                          </p>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`} />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="bg-slate-50 px-6 pb-4 space-y-2 border-t border-slate-100">
                        <div className="pt-3" />
                        {registros.map(r => {
                          const tot  = totalReg(r);
                          const mat  = Number(r.fierro) + Number(r.pintura) + Number(r.galvanizado);
                          const cons = Number(r.discos||0) + Number(r.electrodos||0) + Number(r.oxicorte||0) + Number(r.otrosConsumibles||0);
                          const mo   = Number(r.manoObra);
                          const ot   = Number(r.transporte) + Number(r.instalacion) + Number(r.desperdicio) + Number(r.retrabajos);
                          return (
                            <div key={r.id} className="bg-white rounded-xl border border-slate-100 p-4 flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900 truncate">{r.descripcion}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{new Date(r.fecha).toLocaleDateString("es-PE")}</p>
                                <div className="flex gap-1.5 mt-2 flex-wrap">
                                  {mat  > 0 && <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-medium">Mat. {fmt(mat)}</span>}
                                  {cons > 0 && <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded-full font-medium">Cons. {fmt(cons)}</span>}
                                  {mo   > 0 && <span className="text-[10px] bg-violet-50 text-violet-700 border border-violet-100 px-2 py-0.5 rounded-full font-medium">MO {fmt(mo)}</span>}
                                  {ot   > 0 && <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full font-medium">Otros {fmt(ot)}</span>}
                                </div>
                              </div>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <span className="text-sm font-bold text-slate-900">{fmt(tot)}</span>
                                <button onClick={() => handleDelete(r.id)} className="text-slate-300 hover:text-red-500 transition-colors">
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

        {/* Formulario + Historial */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── FORMULARIO ─────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}>
              <div className="px-6 py-4 border-b border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nuevo registro de costo</p>
              </div>
              <div className="px-6 py-5 space-y-5">

                {/* Contrato */}
                <div>
                  <label className={LABEL_BASE}>Contrato / Servicio *</label>
                  <select
                    value={form.contratoNombre}
                    onChange={e => setForm({ ...form, contratoNombre: e.target.value })}
                    className={SELECT_BASE}
                  >
                    <option value="" className="text-gray-400">— Selecciona el contrato —</option>
                    {CONTRATOS_REALES.map(ct => (
                      <option key={ct.id} value={ct.nombre} className="text-gray-900">
                        #{ct.id} · {ct.nombre} ({fmt(ct.monto)})
                      </option>
                    ))}
                  </select>
                  {form.contratoNombre && (
                    <div className="mt-2 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                      Ingreso de referencia:{" "}
                      <span className="font-bold text-slate-900">
                        {fmt(CONTRATOS_REALES.find(c => c.nombre === form.contratoNombre)?.monto || 0)}
                      </span>
                      {" "}· Los costos se restarán de este monto para calcular el margen.
                    </div>
                  )}
                </div>

                {/* Descripción + fecha */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className={LABEL_BASE}>Descripción *</label>
                    <input
                      type="text"
                      placeholder="Ej: Compra fierro semana 21, Planilla mayo..."
                      value={form.descripcion}
                      onChange={e => setForm({ ...form, descripcion: e.target.value })}
                      className={INPUT_BASE}
                    />
                  </div>
                  <div>
                    <label className={LABEL_BASE}>Fecha</label>
                    <input
                      type="date"
                      value={form.fecha}
                      onChange={e => setForm({ ...form, fecha: e.target.value })}
                      className={INPUT_BASE}
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="w-full px-4 py-3 bg-slate-800 rounded-xl">
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-0.5">Total este registro</p>
                      <p className="text-lg font-bold text-white">{fmt(totalForm())}</p>
                    </div>
                  </div>
                </div>

                {/* Categorías */}
                {CATEGORIAS.map(cat => {
                  const c = colorMap[cat.color];
                  const Icon = cat.icon;
                  const cols = cat.campos.length === 1 ? "grid-cols-1" : cat.campos.length === 2 ? "grid-cols-2" : "grid-cols-2";
                  return (
                    <div key={cat.key} className={`${c.bg} border ${c.border} rounded-xl p-4`}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-7 h-7 ${c.icon} rounded-lg flex items-center justify-center`}>
                          <Icon className={`h-3.5 w-3.5 ${c.text}`} />
                        </div>
                        <h3 className={`text-sm font-bold ${c.text}`}>{cat.label}</h3>
                      </div>
                      <div className={`grid ${cols} gap-3`}>
                        {cat.campos.map(campo => (
                          <div key={campo.key}>
                            <label className="text-xs font-medium text-slate-600 mb-1.5 block">{campo.label}</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-semibold pointer-events-none">S/</span>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                value={(form as any)[campo.key]}
                                onChange={e => setForm({ ...form, [campo.key]: e.target.value })}
                                className={INPUT_MONTO}
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
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50"
                  style={{ boxShadow: "0 4px 12px rgba(15,23,42,0.2)" }}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? "Guardando..." : "Guardar registro de costo"}
                </button>
              </div>
            </div>
          </div>

          {/* ── HISTORIAL ──────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}>
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Historial</p>
                <span className="text-xs text-slate-400">{historialFiltrado.length} registros</span>
              </div>
              <div className="px-5 pt-4">
                <select
                  value={filtroContrato}
                  onChange={e => setFiltroContrato(e.target.value)}
                  className={SELECT_BASE + " mb-4"}
                >
                  <option value="TODOS" className="text-gray-900">Todos los contratos</option>
                  {CONTRATOS_REALES.map(ct => (
                    <option key={ct.id} value={ct.nombre} className="text-gray-900">#{ct.id} · {ct.nombre}</option>
                  ))}
                </select>
              </div>

              {historialFiltrado.length === 0 ? (
                <div className="text-center py-10 px-5">
                  <BarChart3 className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">
                    {historial.length === 0 ? "Aún no hay costos registrados." : "Sin registros para este contrato."}
                  </p>
                </div>
              ) : (
                <div className="px-5 pb-5 space-y-3 max-h-[520px] overflow-y-auto">
                  {historialFiltrado.map(c => {
                    const tot      = totalReg(c);
                    const mat      = Number(c.fierro) + Number(c.pintura) + Number(c.galvanizado);
                    const cons     = Number(c.discos||0) + Number(c.electrodos||0) + Number(c.oxicorte||0) + Number(c.otrosConsumibles||0);
                    const mo       = Number(c.manoObra);
                    const ot       = Number(c.transporte) + Number(c.instalacion) + Number(c.desperdicio) + Number(c.retrabajos);
                    const isEditing = editingId === c.id;

                    return (
                      <div key={c.id} className={`border rounded-xl p-4 transition-all ${isEditing ? "border-slate-400 bg-slate-50 ring-2 ring-slate-200" : "border-slate-100 hover:border-slate-200"}`}>

                        {isEditing ? (
                          /* ── MODO EDICIÓN ── */
                          <div className="space-y-3">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Editando registro</p>

                            <div>
                              <label className="text-xs font-semibold text-slate-600 mb-1 block">Contrato</label>
                              <select
                                value={editForm.contratoNombre}
                                onChange={e => setEditForm({ ...editForm, contratoNombre: e.target.value })}
                                className={SELECT_BASE}
                              >
                                {CONTRATOS_REALES.map(ct => (
                                  <option key={ct.id} value={ct.nombre} className="text-gray-900">
                                    #{ct.id} · {ct.nombre}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="text-xs font-semibold text-slate-600 mb-1 block">Descripción</label>
                              <input
                                type="text"
                                value={editForm.descripcion}
                                onChange={e => setEditForm({ ...editForm, descripcion: e.target.value })}
                                className={INPUT_BASE}
                                autoFocus
                              />
                            </div>

                            <div>
                              <label className="text-xs font-semibold text-slate-600 mb-1 block">Fecha</label>
                              <input
                                type="date"
                                value={editForm.fecha}
                                onChange={e => setEditForm({ ...editForm, fecha: e.target.value })}
                                className={INPUT_BASE}
                              />
                            </div>

                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={handleUpdate}
                                disabled={saving}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
                              >
                                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                                {saving ? "Guardando..." : "Guardar cambios"}
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-white bg-white transition-colors flex items-center gap-1"
                              >
                                <X className="h-3.5 w-3.5" /> Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* ── MODO LECTURA ── */
                          <>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-slate-400 font-medium truncate">{c.contratoNombre}</p>
                                <p className="text-sm font-semibold text-slate-900 leading-tight">{c.descripcion}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{new Date(c.fecha).toLocaleDateString("es-PE")}</p>
                              </div>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <span className="text-sm font-bold text-slate-900">{fmt(tot)}</span>
                                <button
                                  onClick={() => startEdit(c)}
                                  title="Editar descripción y contrato"
                                  className="p-1.5 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(c.id)}
                                  title="Eliminar registro"
                                  className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                            <div className="flex gap-1.5 flex-wrap">
                              {mat  > 0 && <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-medium">Mat. {fmt(mat)}</span>}
                              {cons > 0 && <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded-full font-medium">Cons. {fmt(cons)}</span>}
                              {mo   > 0 && <span className="text-[10px] bg-violet-50 text-violet-700 border border-violet-100 px-2 py-0.5 rounded-full font-medium">MO {fmt(mo)}</span>}
                              {ot   > 0 && <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full font-medium">Otros {fmt(ot)}</span>}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {historialFiltrado.length > 0 && (
                <div className="px-5 py-4 border-t border-slate-100 flex justify-between text-sm font-semibold">
                  <span className="text-slate-500">Total filtrado</span>
                  <span className="text-slate-900">{fmt(historialFiltrado.reduce((s, c) => s + totalReg(c), 0))}</span>
                </div>
              )}
            </div>

            {/* Tip */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-amber-800">Registra consumibles por separado</p>
                  <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                    Discos, electrodos y gas suelen perderse en el costo general. Al registrarlos aparte, puedes ver exactamente cuánto consumen por contrato y cotizar mejor la próxima vez.
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