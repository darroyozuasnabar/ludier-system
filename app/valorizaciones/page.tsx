"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Receipt,
  TrendingUp,
  Calendar,
  FileCheck,
  Banknote,
  ChevronDown,
  ChevronUp,
  Pencil,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const formatCOP = (v: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(v);

// ──────────────────────────────────────────────────────────────────────────────
// Constantes del contrato Qantua F2
// ──────────────────────────────────────────────────────────────────────────────
const IGV_PCT = 0.18;
const GARANTIA_PCT = 0.05;
const COSTO_DIRECTO_TOTAL = 484984.2;

// Estados de una valorización y su flujo
const ESTADOS = [
  { key: "BORRADOR",  label: "Borrador",  color: "gray",   desc: "En preparación" },
  { key: "EMITIDA",   label: "Emitida",   color: "blue",   desc: "Enviada al cliente" },
  { key: "FIRMADA",   label: "Firmada",   color: "violet", desc: "PDF firmado recibido" },
  { key: "COBRADA",   label: "Cobrada",   color: "emerald",desc: "Dinero en cuenta" },
];

const badgeColors: Record<string, string> = {
  gray:    "bg-gray-100 text-gray-700",
  blue:    "bg-blue-100 text-blue-700",
  violet:  "bg-violet-100 text-violet-700",
  emerald: "bg-emerald-100 text-emerald-700",
  amber:   "bg-amber-100 text-amber-700",
};

type ValForm = {
  period: string;
  costoDirecto: string;
  fechaEmision: string;
  status: string;
  fechaCobro: string;
  notas: string;
};

const FORM_VACIO: ValForm = {
  period: "",
  costoDirecto: "",
  fechaEmision: new Date().toISOString().split("T")[0],
  status: "BORRADOR",
  fechaCobro: "",
  notas: "",
};

export default function ValorizacionesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [projectId, setProjectId] = useState("");
  const [valorizaciones, setValorizaciones] = useState<any[]>([]);
  const [contratoConfig, setContratoConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState<ValForm>(FORM_VACIO);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

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

      const { data: vals } = await supabase
        .from("Valorizacion")
        .select("*")
        .eq("projectId", proj.id)
        .order("fechaEmision", { ascending: true });
      setValorizaciones(vals || []);

      const { data: config } = await supabase
        .from("ConfiguracionContrato")
        .select("*")
        .eq("project_id", proj.id)
        .maybeSingle();
      setContratoConfig(config);
    }
    setLoading(false);
  };

  // Cálculos derivados del monto ingresado
  const costoNum = parseFloat(form.costoDirecto.replace(",", ".")) || 0;
  const igvCalc = costoNum * IGV_PCT;
  const totalFacturaCalc = costoNum + igvCalc;
  const garantiaCalc = costoNum * GARANTIA_PCT;
  const netoCalc = totalFacturaCalc - garantiaCalc;

  // Acumulado valorizado
  const totalVAlorizado = valorizaciones.reduce(
    (s, v) => s + Number(v.costoDirecto), 0
  );
  const avancePct = COSTO_DIRECTO_TOTAL > 0
    ? (totalVAlorizado / COSTO_DIRECTO_TOTAL) * 100
    : 0;
  const totalCobrado = valorizaciones
    .filter((v) => v.status === "COBRADA")
    .reduce((s, v) => s + Number(v.netoCobrar), 0);
  const totalPendienteCobro = valorizaciones
    .filter((v) => v.status !== "COBRADA")
    .reduce((s, v) => s + Number(v.netoCobrar), 0);

  const handleSave = async () => {
    if (!projectId) return;
    if (!form.period.trim() || !form.costoDirecto) {
      setToast({ type: "err", msg: "Completa el período y el monto de costo directo." });
      setTimeout(() => setToast(null), 4000);
      return;
    }

    setSaving(true);

    const payload = {
      projectId,
      period: form.period,
      costoDirecto: costoNum,
      igv: igvCalc,
      totalFactura: totalFacturaCalc,
      garantia: garantiaCalc,
      netoCobrar: netoCalc,
      avancePct: COSTO_DIRECTO_TOTAL > 0
        ? ((costoNum / COSTO_DIRECTO_TOTAL) * 100).toFixed(2)
        : "0",
      status: form.status,
      fechaEmision: form.fechaEmision,
      fechaCobro: form.fechaCobro || null,
      notas: form.notas || null,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase
        .from("Valorizacion")
        .update(payload)
        .eq("id", editingId));
    } else {
      ({ error } = await supabase.from("Valorizacion").insert(payload));
    }

    setSaving(false);
    if (error) {
      setToast({ type: "err", msg: "Error al guardar. Revisa los datos." });
    } else {
      setToast({ type: "ok", msg: editingId ? "Valorización actualizada." : "Valorización creada correctamente." });
      setForm(FORM_VACIO);
      setShowForm(false);
      setEditingId(null);
      loadData();
    }
    setTimeout(() => setToast(null), 4000);
  };

  const handleEdit = (v: any) => {
    setForm({
      period: v.period,
      costoDirecto: String(v.costoDirecto),
      fechaEmision: v.fechaEmision?.split("T")[0] || "",
      status: v.status,
      fechaCobro: v.fechaCobro?.split("T")[0] || "",
      notas: v.notas || "",
    });
    setEditingId(v.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const updates: any = { status: newStatus };
    if (newStatus === "COBRADA") {
      updates.fechaCobro = new Date().toISOString().split("T")[0];
    }
    await supabase.from("Valorizacion").update(updates).eq("id", id);
    loadData();
  };

  const getNextStatus = (current: string) => {
    const idx = ESTADOS.findIndex((e) => e.key === current);
    return idx < ESTADOS.length - 1 ? ESTADOS[idx + 1] : null;
  };

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
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
            toast.type === "ok"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {toast.type === "ok"
            ? <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            : <AlertCircle className="h-4 w-4 text-red-600" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
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
              <h1 className="text-base font-bold text-gray-900">Valorizaciones</h1>
              <p className="text-xs text-gray-500">Qantua Fase 02 · Contrato S/ 543,667.29</p>
            </div>
          </div>
          <button
            onClick={() => {
              setForm(FORM_VACIO);
              setEditingId(null);
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nueva valorización
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* KPIs del contrato */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Avance valorizado</p>
            <p className="text-xl font-bold text-gray-900">{avancePct.toFixed(2)}%</p>
            <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-900 rounded-full"
                style={{ width: `${Math.min(avancePct, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">{formatCOP(totalVAlorizado)} de {formatCOP(COSTO_DIRECTO_TOTAL)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Valorizaciones</p>
            <p className="text-xl font-bold text-gray-900">{valorizaciones.length}</p>
            <p className="text-xs text-gray-400 mt-1">
              {valorizaciones.filter((v) => v.status === "COBRADA").length} cobradas
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total cobrado</p>
            <p className="text-xl font-bold text-emerald-700">{formatCOP(totalCobrado)}</p>
            <p className="text-xs text-gray-400 mt-1">Neto recibido</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Pendiente de cobro</p>
            <p className="text-xl font-bold text-amber-700">{formatCOP(totalPendienteCobro)}</p>
            <p className="text-xs text-gray-400 mt-1">
              {valorizaciones.filter((v) => v.status !== "COBRADA").length} valoriz. activas
            </p>
          </div>
        </div>

        {/* Formulario nueva / editar valorización */}
        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 mb-5">
              {editingId ? "Editar valorización" : "Nueva valorización"}
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-5">
              {/* Período */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                  Período *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Marzo 2026, Abril 2026..."
                  value={form.period}
                  onChange={(e) => setForm({ ...form, period: e.target.value })}
                  className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                />
              </div>

              {/* Fecha de emisión */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                  Fecha de emisión
                </label>
                <input
                  type="date"
                  value={form.fechaEmision}
                  onChange={(e) => setForm({ ...form, fechaEmision: e.target.value })}
                  className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                />
              </div>

              {/* Costo directo */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                  Costo directo (s/IGV) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">S/</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={form.costoDirecto}
                    onChange={(e) => setForm({ ...form, costoDirecto: e.target.value })}
                    className="w-full pl-8 pr-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                  />
                </div>
              </div>

              {/* Estado */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">Estado</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                >
                  {ESTADOS.map((e) => (
                    <option key={e.key} value={e.key}>{e.label} — {e.desc}</option>
                  ))}
                </select>
              </div>

              {/* Fecha cobro (solo si COBRADA) */}
              {form.status === "COBRADA" && (
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                    Fecha de cobro real
                  </label>
                  <input
                    type="date"
                    value={form.fechaCobro}
                    onChange={(e) => setForm({ ...form, fechaCobro: e.target.value })}
                    className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                  />
                </div>
              )}

              {/* Notas */}
              <div className={form.status === "COBRADA" ? "" : "col-span-2"}>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                  Notas (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Observaciones, pendientes, etc."
                  value={form.notas}
                  onChange={(e) => setForm({ ...form, notas: e.target.value })}
                  className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                />
              </div>
            </div>

            {/* Preview de cálculos */}
            {costoNum > 0 && (
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Preview — estructura de pago
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-[10px] text-gray-400">Costo directo</p>
                    <p className="text-sm font-bold text-gray-900">{formatCOP(costoNum)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">IGV 18%</p>
                    <p className="text-sm font-semibold text-blue-700">+ {formatCOP(igvCalc)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Total factura</p>
                    <p className="text-sm font-semibold text-gray-700">{formatCOP(totalFacturaCalc)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Fondo garantía 5%</p>
                    <p className="text-sm font-semibold text-amber-700">− {formatCOP(garantiaCalc)}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-600">Neto a cobrar</p>
                  <p className="text-lg font-bold text-teal-700">{formatCOP(netoCalc)}</p>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Avance este período: {COSTO_DIRECTO_TOTAL > 0
                    ? ((costoNum / COSTO_DIRECTO_TOTAL) * 100).toFixed(2)
                    : "0"}% del contrato
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileCheck className="h-4 w-4" />}
                {saving ? "Guardando..." : editingId ? "Actualizar" : "Crear valorización"}
              </button>
              <button
                onClick={() => { setShowForm(false); setEditingId(null); setForm(FORM_VACIO); }}
                className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista de valorizaciones */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">
            Valorizaciones registradas
          </h2>

          {valorizaciones.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
              <Receipt className="h-12 w-12 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No hay valorizaciones registradas aún.</p>
              <p className="text-xs text-gray-300 mt-1">
                Crea la primera con el botón "Nueva valorización".
              </p>
            </div>
          ) : (
            valorizaciones.map((v, idx) => {
              const estadoInfo = ESTADOS.find((e) => e.key === v.status) || ESTADOS[0];
              const nextStatus = getNextStatus(v.status);
              const isExpanded = expandedId === v.id;

              return (
                <div
                  key={v.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* Cabecera */}
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {/* Número */}
                        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-white">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-semibold text-gray-900">
                              Val. N°{String(idx + 1).padStart(2, "0")} · {v.period}
                            </h3>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeColors[estadoInfo.color]}`}>
                              {estadoInfo.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Emitida: {new Date(v.fechaEmision).toLocaleDateString("es-PE")}
                            {v.fechaCobro && ` · Cobrada: ${new Date(v.fechaCobro).toLocaleDateString("es-PE")}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-base font-bold text-teal-700">{formatCOP(Number(v.netoCobrar))}</p>
                          <p className="text-xs text-gray-400">neto a cobrar</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(v)}
                            className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : v.id)}
                            className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Flujo de estado visual */}
                    <div className="flex items-center gap-1 mt-4">
                      {ESTADOS.map((e, i) => {
                        const estadoIdx = ESTADOS.findIndex((s) => s.key === v.status);
                        const done = i <= estadoIdx;
                        return (
                          <div key={e.key} className="flex items-center gap-1 flex-1">
                            <div className={`flex-1 h-1.5 rounded-full ${done ? "bg-gray-900" : "bg-gray-100"}`} />
                            {i === ESTADOS.length - 1 && (
                              <div className={`w-2 h-2 rounded-full ${done ? "bg-gray-900" : "bg-gray-200"}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between mt-1">
                      {ESTADOS.map((e) => (
                        <span key={e.key} className="text-[9px] text-gray-400">{e.label}</span>
                      ))}
                    </div>
                  </div>

                  {/* Detalle expandible */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-[10px] text-gray-400">Costo directo</p>
                          <p className="text-sm font-semibold">{formatCOP(Number(v.costoDirecto))}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400">IGV (18%)</p>
                          <p className="text-sm font-semibold text-blue-700">+ {formatCOP(Number(v.igv))}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400">Total factura</p>
                          <p className="text-sm font-semibold">{formatCOP(Number(v.totalFactura))}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400">Garantía (5%)</p>
                          <p className="text-sm font-semibold text-amber-700">− {formatCOP(Number(v.garantia))}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500">Neto a cobrar</p>
                          <p className="text-base font-bold text-teal-700">{formatCOP(Number(v.netoCobrar))}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Avance acumulado</p>
                          <p className="text-base font-bold text-gray-900">{Number(v.avancePct).toFixed(2)}%</p>
                        </div>
                      </div>
                      {v.notas && (
                        <p className="text-xs text-gray-500 mt-3 italic">📝 {v.notas}</p>
                      )}

                      {/* Avanzar estado */}
                      {nextStatus && (
                        <button
                          onClick={() => handleUpdateStatus(v.id, nextStatus.key)}
                          className="mt-4 w-full flex items-center justify-center gap-2 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-white transition-colors"
                        >
                          <TrendingUp className="h-4 w-4" />
                          Marcar como "{nextStatus.label}" — {nextStatus.desc}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Barra de progreso del contrato */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Progreso del contrato Qantua F2</h3>
            <span className="text-sm font-bold text-gray-900">{avancePct.toFixed(2)}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gray-900 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(avancePct, 100)}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-400">Costo directo total</p>
              <p className="text-sm font-bold text-gray-900">{formatCOP(COSTO_DIRECTO_TOTAL)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Valorizado</p>
              <p className="text-sm font-bold text-gray-900">{formatCOP(totalVAlorizado)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Saldo por valorizar</p>
              <p className="text-sm font-bold text-amber-700">
                {formatCOP(Math.max(0, COSTO_DIRECTO_TOTAL - totalVAlorizado))}
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}