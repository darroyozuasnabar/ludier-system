"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronLeft, Plus, Trash2, Pencil, CheckCircle2, AlertCircle,
  Loader2, Package, Wrench, HardHat, Users, Calendar, ChevronDown,
  ChevronUp, Save, Search, HandMetal, Repeat, AlertTriangle, Eye,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CATEGORIAS = [
  { key: "EPP",                    label: "Equipos de Protección Personal", icon: HardHat,  color: "blue"   },
  { key: "HERRAMIENTAS_ELECTRICAS", label: "Herramientas Eléctricas",        icon: Wrench,   color: "violet" },
  { key: "DISCOS_CONSUMIBLES",      label: "Discos y Consumibles",           icon: Wrench,   color: "amber"  },
  { key: "EQUIPOS_MEDICION",        label: "Equipos de Medición",            icon: Eye,      color: "emerald"},
  { key: "EXTENSIONES_CABLES",      label: "Extensiones y Cables",           icon: Repeat,   color: "gray"   },
  { key: "CAJAS_HERRAMIENTAS",      label: "Cajas de Herramientas",          icon: Package,  color: "purple" },
  { key: "OTROS",                   label: "Otros Equipos",                  icon: Wrench,   color: "slate"  },
];

const badgeColors: Record<string, string> = {
  blue:    "bg-blue-100 text-blue-700",
  violet:  "bg-violet-100 text-violet-700",
  amber:   "bg-amber-100 text-amber-700",
  emerald: "bg-emerald-100 text-emerald-700",
  gray:    "bg-gray-100 text-gray-700",
  purple:  "bg-purple-100 text-purple-700",
  slate:   "bg-slate-100 text-slate-700",
  red:     "bg-red-100 text-red-700",
};

const UBICACIONES = [
  { key: "TALLER_HUACHIPA", label: "Taller Huachipa" },
  { key: "OBRA_QANTUA",     label: "Obra Qantua"     },
  { key: "OFICINA",         label: "Oficina"          },
  { key: "CHILCA",          label: "Chilca (futura)"  },
  { key: "EN_PRESTAMO",     label: "En préstamo"      },
];

// ─── clases compartidas para todos los campos ─────────────────────────────────
const INPUT  = "w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent";
const SELECT = "w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none";
const LABEL  = "block text-xs font-semibold text-gray-700 mb-1";

type ItemForm = {
  nombre: string; categoria: string; cantidad: string;
  ubicacion: string; unidad: string; stock_minimo: string; contenido: string;
};

const FORM_VACIO: ItemForm = {
  nombre: "", categoria: "OTROS", cantidad: "",
  ubicacion: "OBRA_QANTUA", unidad: "unidades", stock_minimo: "", contenido: "",
};

export default function InventarioPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading,               setLoading]               = useState(true);
  const [saving,                setSaving]                = useState(false);
  const [inventario,            setInventario]            = useState<any[]>([]);
  const [prestamos,             setPrestamos]             = useState<any[]>([]);
  const [mantenimientos,        setMantenimientos]        = useState<any[]>([]);
  const [showForm,              setShowForm]              = useState(false);
  const [editingId,             setEditingId]             = useState<string | null>(null);
  const [expandedId,            setExpandedId]            = useState<string | null>(null);
  const [categoriaFiltro,       setCategoriaFiltro]       = useState("TODOS");
  const [searchTerm,            setSearchTerm]            = useState("");
  const [form,                  setForm]                  = useState<ItemForm>(FORM_VACIO);
  const [toast,                 setToast]                 = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [showPrestamoForm,      setShowPrestamoForm]      = useState(false);
  const [showMantenimientoForm, setShowMantenimientoForm] = useState(false);
  const [selectedItem,          setSelectedItem]          = useState<any>(null);
  const [prestamoForm,          setPrestamoForm]          = useState({ trabajador: "", fechaDevolucion: "" });
  const [mantenimientoForm,     setMantenimientoForm]     = useState({ tipo: "", descripcion: "", fechaProximo: "" });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated")   loadData();
  }, [status]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [invR, prestR, mantR] = await Promise.all([
        supabase.from("Inventario").select("*").order("nombre"),
        supabase.from("Prestamo").select("*").order("fechaPrestamo", { ascending: false }),
        supabase.from("Mantenimiento").select("*").order("fecha", { ascending: false }),
      ]);
      setInventario(invR.data || []);
      setPrestamos(prestR.data || []);
      setMantenimientos(mantR.data || []);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type: "ok" | "err", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSave = async () => {
    if (!form.nombre.trim()) { showToast("err", "Completa el nombre del elemento."); return; }
    setSaving(true);
    const payload = {
      nombre: form.nombre, categoria: form.categoria,
      cantidad: parseInt(form.cantidad) || 0, ubicacion: form.ubicacion,
      unidad: form.unidad, stock_minimo: parseInt(form.stock_minimo) || 0,
      contenido: form.contenido || null,
    };
    const { error } = editingId
      ? await supabase.from("Inventario").update(payload).eq("id", editingId)
      : await supabase.from("Inventario").insert(payload);
    setSaving(false);
    if (error) { showToast("err", "Error al guardar."); return; }
    showToast("ok", editingId ? "Elemento actualizado." : "Elemento agregado.");
    setForm(FORM_VACIO); setShowForm(false); setEditingId(null); loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este elemento del inventario?")) return;
    await supabase.from("Inventario").delete().eq("id", id);
    loadData();
  };

  const handleEdit = (item: any) => {
    setForm({
      nombre: item.nombre, categoria: item.categoria,
      cantidad: String(item.cantidad), ubicacion: item.ubicacion,
      unidad: item.unidad || "unidades",
      stock_minimo: String(item.stock_minimo || 0), contenido: item.contenido || "",
    });
    setEditingId(item.id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrestamo = async () => {
    if (!selectedItem || !prestamoForm.trabajador) { showToast("err", "Completa el nombre del trabajador."); return; }
    if (selectedItem.cantidad < 1) { showToast("err", "No hay stock disponible."); return; }
    setSaving(true);
    const { error } = await supabase.from("Prestamo").insert({
      item_id: selectedItem.id, item_nombre: selectedItem.nombre,
      trabajador: prestamoForm.trabajador,
      fechaPrestamo: new Date().toISOString().split("T")[0],
      fechaDevolucion: prestamoForm.fechaDevolucion || null, estado: "ACTIVO",
    });
    if (!error) {
      await supabase.from("Inventario")
        .update({ cantidad: selectedItem.cantidad - 1, ubicacion: "EN_PRESTAMO" })
        .eq("id", selectedItem.id);
      showToast("ok", "Préstamo registrado.");
      setShowPrestamoForm(false); setSelectedItem(null);
      setPrestamoForm({ trabajador: "", fechaDevolucion: "" }); loadData();
    } else { showToast("err", "Error al registrar préstamo."); }
    setSaving(false);
  };

  const handleDevolucion = async (prestamoId: string, itemId: string) => {
    await supabase.from("Prestamo")
      .update({ estado: "DEVUELTO", fechaDevolucionReal: new Date().toISOString().split("T")[0] })
      .eq("id", prestamoId);
    const item = inventario.find(i => i.id === itemId);
    if (item) await supabase.from("Inventario")
      .update({ cantidad: item.cantidad + 1, ubicacion: "OBRA_QANTUA" })
      .eq("id", itemId);
    showToast("ok", "Devolución registrada."); loadData();
  };

  const handleMantenimiento = async () => {
    if (!selectedItem || !mantenimientoForm.tipo) { showToast("err", "Completa el tipo de mantenimiento."); return; }
    setSaving(true);
    const { error } = await supabase.from("Mantenimiento").insert({
      item_id: selectedItem.id, item_nombre: selectedItem.nombre,
      tipo: mantenimientoForm.tipo, descripcion: mantenimientoForm.descripcion,
      fecha: new Date().toISOString().split("T")[0],
      fechaProximo: mantenimientoForm.fechaProximo || null,
    });
    if (!error) {
      showToast("ok", "Mantenimiento registrado.");
      setShowMantenimientoForm(false); setSelectedItem(null);
      setMantenimientoForm({ tipo: "", descripcion: "", fechaProximo: "" }); loadData();
    } else { showToast("err", "Error al registrar mantenimiento."); }
    setSaving(false);
  };

  const itemsFiltrados = inventario.filter(item => {
    if (categoriaFiltro !== "TODOS" && item.categoria !== categoriaFiltro) return false;
    if (searchTerm && !item.nombre.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const totalItems       = inventario.length;
  const itemsStockBajo   = inventario.filter(i => i.cantidad <= i.stock_minimo && i.stock_minimo > 0).length;
  const prestamosActivos = prestamos.filter(p => p.estado === "ACTIVO").length;

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // ─── shared modal wrapper ─────────────────────────────────────────────────
  const Modal = ({ title, subtitle, children, onConfirm, confirmLabel }: {
    title: string; subtitle?: string; children: React.ReactNode;
    onConfirm: () => void; confirmLabel: string;
  }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="px-6 py-5 space-y-4">{children}</div>
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onConfirm}
            disabled={saving}
            className="flex-1 bg-gray-900 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {saving ? "Registrando..." : confirmLabel}
          </button>
          <button
            onClick={() => { setShowPrestamoForm(false); setShowMantenimientoForm(false); setSelectedItem(null); }}
            className="flex-1 border border-gray-200 text-gray-700 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50 bg-white transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );

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
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Dashboard
            </button>
            <div className="h-4 w-px bg-gray-200" />
            <div>
              <h1 className="text-base font-bold text-gray-900">Inventario y Activos</h1>
              <p className="text-xs text-gray-500">Control de herramientas, equipos y materiales</p>
            </div>
          </div>
          <button
            onClick={() => { setForm(FORM_VACIO); setEditingId(null); setShowForm(!showForm); }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
          >
            <Plus className="h-4 w-4" /> Nuevo elemento
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Package,       color: "text-gray-500",   bg: "bg-gray-100",    label: "Total elementos",   value: totalItems,         valueCls: "text-gray-900" },
            { icon: AlertTriangle, color: "text-amber-500",  bg: "bg-amber-50",    label: "Stock bajo",        value: itemsStockBajo,     valueCls: "text-amber-600" },
            { icon: HandMetal,     color: "text-blue-500",   bg: "bg-blue-50",     label: "Préstamos activos", value: prestamosActivos,   valueCls: "text-blue-600"  },
            { icon: Wrench,        color: "text-purple-500", bg: "bg-purple-50",   label: "Mantenimientos",    value: mantenimientos.length, valueCls: "text-purple-600" },
          ].map(({ icon: Icon, color, bg, label, value, valueCls }, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
              <p className={`text-2xl font-bold ${valueCls}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {["TODOS", ...CATEGORIAS.map(c => c.key)].map(key => (
              <button
                key={key}
                onClick={() => setCategoriaFiltro(key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  categoriaFiltro === key
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {key === "TODOS" ? "Todos" : CATEGORIAS.find(c => c.key === key)?.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar elemento..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 w-64"
            />
          </div>
        </div>

        {/* ── FORMULARIO CREAR / EDITAR ──────────────────────────────── */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900">
                {editingId ? "Editar elemento" : "Nuevo elemento"}
              </h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); setForm(FORM_VACIO); }}
                className="text-gray-400 hover:text-gray-700 text-xs border border-gray-200 px-3 py-1 rounded-lg">
                Cancelar
              </button>
            </div>
            <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="md:col-span-2">
                <label className={LABEL}>Nombre *</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={e => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ej: Martillo, Taladro, Casco..."
                  className={INPUT}
                />
              </div>

              <div>
                <label className={LABEL}>Categoría</label>
                <select
                  value={form.categoria}
                  onChange={e => setForm({ ...form, categoria: e.target.value })}
                  className={SELECT}
                >
                  {CATEGORIAS.map(cat => (
                    <option key={cat.key} value={cat.key} className="text-gray-900 bg-white">
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={LABEL}>Ubicación</label>
                <select
                  value={form.ubicacion}
                  onChange={e => setForm({ ...form, ubicacion: e.target.value })}
                  className={SELECT}
                >
                  {UBICACIONES.map(ubi => (
                    <option key={ubi.key} value={ubi.key} className="text-gray-900 bg-white">
                      {ubi.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={LABEL}>Cantidad</label>
                <input
                  type="number"
                  min="0"
                  value={form.cantidad}
                  onChange={e => setForm({ ...form, cantidad: e.target.value })}
                  placeholder="0"
                  className={INPUT}
                />
              </div>

              <div>
                <label className={LABEL}>Unidad de medida</label>
                <input
                  type="text"
                  value={form.unidad}
                  onChange={e => setForm({ ...form, unidad: e.target.value })}
                  placeholder="unidades, pares, kg, caja..."
                  className={INPUT}
                />
              </div>

              <div>
                <label className={LABEL}>Stock mínimo (alerta)</label>
                <input
                  type="number"
                  min="0"
                  value={form.stock_minimo}
                  onChange={e => setForm({ ...form, stock_minimo: e.target.value })}
                  placeholder="0"
                  className={INPUT}
                />
              </div>

              <div className="md:col-span-2">
                <label className={LABEL}>Contenido (para cajas o kits)</label>
                <textarea
                  rows={2}
                  value={form.contenido}
                  onChange={e => setForm({ ...form, contenido: e.target.value })}
                  placeholder="Ej: Martillos, alicates, brocas..."
                  className={INPUT}
                />
              </div>
            </div>

            <div className="px-6 pb-5 flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Guardando..." : editingId ? "Actualizar" : "Crear elemento"}
              </button>
            </div>
          </div>
        )}

        {/* ── LISTA ─────────────────────────────────────────────────── */}
        <div className="space-y-3">
          {itemsFiltrados.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <Package className="h-12 w-12 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No hay elementos que coincidan.</p>
            </div>
          ) : itemsFiltrados.map(item => {
            const isExpanded    = expandedId === item.id;
            const catInfo       = CATEGORIAS.find(c => c.key === item.categoria);
            const isStockBajo   = item.cantidad <= item.stock_minimo && item.stock_minimo > 0;
            const prestamosItem = prestamos.filter(p => p.item_id === item.id && p.estado === "ACTIVO");
            const mantItem      = mantenimientos.filter(m => m.item_id === item.id);

            return (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    {/* Icon + info */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        catInfo ? badgeColors[catInfo.color].split(" ")[0] : "bg-gray-100"
                      }`}>
                        {catInfo
                          ? <catInfo.icon className={`h-5 w-5 ${badgeColors[catInfo.color].split(" ")[1]}`} />
                          : <Package className="h-5 w-5 text-gray-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-sm font-bold text-gray-900">{item.nombre}</h3>
                          {isStockBajo && (
                            <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                              STOCK BAJO
                            </span>
                          )}
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${badgeColors[catInfo?.color || "gray"]}`}>
                            {catInfo?.label || item.categoria}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span className={`font-semibold ${isStockBajo ? "text-red-600" : "text-gray-800"}`}>
                            {item.cantidad} {item.unidad}
                          </span>
                          <span>·</span>
                          <span>{UBICACIONES.find(u => u.key === item.ubicacion)?.label || item.ubicacion}</span>
                          {item.stock_minimo > 0 && (
                            <><span>·</span><span>Mín. {item.stock_minimo} {item.unidad}</span></>
                          )}
                        </div>
                        {item.contenido && (
                          <p className="text-xs text-gray-400 mt-1 truncate">Contenido: {item.contenido}</p>
                        )}
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => { setSelectedItem(item); setShowPrestamoForm(true); }}
                        title="Registrar préstamo"
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <HandMetal className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => { setSelectedItem(item); setShowMantenimientoForm(true); }}
                        title="Registrar mantenimiento"
                        className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <Wrench className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        title="Editar"
                        className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        title="Eliminar"
                        className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                      {prestamosItem.length > 0 && (
                        <div>
                          <p className="text-xs font-bold text-gray-700 mb-2">Préstamos activos</p>
                          <div className="space-y-2">
                            {prestamosItem.map(p => (
                              <div key={p.id} className="flex items-center justify-between text-sm p-3 bg-blue-50 rounded-xl border border-blue-100">
                                <div>
                                  <span className="font-semibold text-gray-900">{p.trabajador}</span>
                                  <span className="text-xs text-gray-500 ml-2">
                                    {new Date(p.fechaPrestamo).toLocaleDateString("es-PE")}
                                  </span>
                                  {p.fechaDevolucion && (
                                    <span className="text-xs text-gray-500 ml-2">
                                      Dev. est.: {new Date(p.fechaDevolucion).toLocaleDateString("es-PE")}
                                    </span>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleDevolucion(p.id, item.id)}
                                  className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-3 py-1 rounded-lg hover:bg-emerald-200 transition-colors"
                                >
                                  Marcar devolución
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {mantItem.length > 0 && (
                        <div>
                          <p className="text-xs font-bold text-gray-700 mb-2">Historial de mantenimiento</p>
                          <div className="space-y-2">
                            {mantItem.map(m => (
                              <div key={m.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-semibold text-gray-800">{m.tipo}</span>
                                  <span className="text-xs text-gray-400">{new Date(m.fecha).toLocaleDateString("es-PE")}</span>
                                </div>
                                {m.descripcion && <p className="text-xs text-gray-500 mt-1">{m.descripcion}</p>}
                                {m.fechaProximo && (
                                  <p className="text-xs text-amber-600 font-medium mt-1">
                                    Próximo: {new Date(m.fechaProximo).toLocaleDateString("es-PE")}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {prestamosItem.length === 0 && mantItem.length === 0 && (
                        <p className="text-xs text-gray-400 text-center py-2">Sin préstamos activos ni mantenimientos.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ── MODAL PRÉSTAMO ────────────────────────────────────────────── */}
      {showPrestamoForm && selectedItem && (
        <Modal
          title="Registrar préstamo"
          subtitle={`Elemento: ${selectedItem.nombre}`}
          onConfirm={handlePrestamo}
          confirmLabel="Registrar préstamo"
        >
          <div>
            <label className={LABEL}>Trabajador *</label>
            <input
              type="text"
              value={prestamoForm.trabajador}
              onChange={e => setPrestamoForm({ ...prestamoForm, trabajador: e.target.value })}
              placeholder="Ej: Jhonatan, Miki, Sebastián..."
              className={INPUT}
              autoFocus
            />
          </div>
          <div>
            <label className={LABEL}>Fecha de devolución estimada</label>
            <input
              type="date"
              value={prestamoForm.fechaDevolucion}
              onChange={e => setPrestamoForm({ ...prestamoForm, fechaDevolucion: e.target.value })}
              className={INPUT}
            />
          </div>
        </Modal>
      )}

      {/* ── MODAL MANTENIMIENTO ───────────────────────────────────────── */}
      {showMantenimientoForm && selectedItem && (
        <Modal
          title="Registrar mantenimiento"
          subtitle={`Equipo: ${selectedItem.nombre}`}
          onConfirm={handleMantenimiento}
          confirmLabel="Registrar mantenimiento"
        >
          <div>
            <label className={LABEL}>Tipo *</label>
            <select
              value={mantenimientoForm.tipo}
              onChange={e => setMantenimientoForm({ ...mantenimientoForm, tipo: e.target.value })}
              className={SELECT}
            >
              <option value="" className="text-gray-400 bg-white">Seleccionar tipo...</option>
              <option value="PREVENTIVO"  className="text-gray-900 bg-white">Preventivo</option>
              <option value="CORRECTIVO"  className="text-gray-900 bg-white">Correctivo</option>
              <option value="CALIBRACION" className="text-gray-900 bg-white">Calibración</option>
            </select>
          </div>
          <div>
            <label className={LABEL}>Descripción</label>
            <textarea
              rows={2}
              value={mantenimientoForm.descripcion}
              onChange={e => setMantenimientoForm({ ...mantenimientoForm, descripcion: e.target.value })}
              placeholder="Ej: Cambio de disco, lubricación, calibración..."
              className={INPUT}
            />
          </div>
          <div>
            <label className={LABEL}>Próximo mantenimiento</label>
            <input
              type="date"
              value={mantenimientoForm.fechaProximo}
              onChange={e => setMantenimientoForm({ ...mantenimientoForm, fechaProximo: e.target.value })}
              className={INPUT}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}