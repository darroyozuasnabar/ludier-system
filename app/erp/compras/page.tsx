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
  ShoppingCart,
  Truck,
  Package,
  Users,
  Building2,
  ChevronDown,
  ChevronUp,
  Save,
  X,
  Eye,
  FileText,
  Send,
  Check,
  Clock,
  TrendingUp,
  Calendar,
  Search,
  Filter,
  Printer,
  Download,
  UserPlus,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import Swal from "sweetalert2";

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

const ESTADOS_OC = [
  { key: "BORRADOR", label: "Borrador", color: "gray" },
  { key: "EMITIDA", label: "Emitida", color: "blue" },
  { key: "PARCIAL", label: "Recepción parcial", color: "amber" },
  { key: "COMPLETADA", label: "Completada", color: "emerald" },
  { key: "ANULADA", label: "Anulada", color: "red" },
];

const badgeColors: Record<string, string> = {
  gray: "bg-gray-100 text-gray-700",
  blue: "bg-blue-100 text-blue-700",
  amber: "bg-amber-100 text-amber-700",
  emerald: "bg-emerald-100 text-emerald-700",
  red: "bg-red-100 text-red-700",
};

type OrdenCompraForm = {
  proveedor_id: string;
  project_id: string;
  fecha_emision: string;
  fecha_entrega: string;
  tipo: string;
  notas: string;
  items: any[];
};

const FORM_VACIO: OrdenCompraForm = {
  proveedor_id: "",
  project_id: "",
  fecha_emision: new Date().toISOString().split("T")[0],
  fecha_entrega: "",
  tipo: "MATERIALES",
  notas: "",
  items: [],
};

// ============================================================
// MODAL PARA CREAR NUEVO PROVEEDOR (CORREGIDO)
// ============================================================
function NuevoProveedorModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (proveedor: any) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    ruc: "",
    razon_social: "",
    contacto: "",
    telefono: "",
    email: "",
    direccion: "",
    condiciones_pago: "CONTADO",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar RUC (11 dígitos)
      if (form.ruc.length !== 11 || !/^\d+$/.test(form.ruc)) {
        Swal.fire({
          icon: "warning",
          title: "RUC inválido",
          text: "El RUC debe tener 11 dígitos numéricos",
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("Proveedor")
        .insert({
          ruc: form.ruc,
          razon_social: form.razon_social,
          contacto: form.contacto || null,
          telefono: form.telefono || null,
          email: form.email || null,
          direccion: form.direccion || null,
          condiciones_pago: form.condiciones_pago,
          activo: true,
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          Swal.fire({
            icon: "warning",
            title: "RUC duplicado",
            text: "Ya existe un proveedor con este RUC",
          });
        } else {
          throw error;
        }
        setLoading(false);
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Proveedor creado",
        text: `Se creó correctamente: ${data.razon_social}`,
        timer: 2000,
        showConfirmButton: false,
      });

      onSuccess(data);
      onClose();
      setForm({
        ruc: "",
        razon_social: "",
        contacto: "",
        telefono: "",
        email: "",
        direccion: "",
        condiciones_pago: "CONTADO",
      });
    } catch (error) {
      console.error("Error al crear proveedor:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el proveedor. Verifica los datos.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-gray-600" />
            Nuevo Proveedor
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">
              RUC <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.ruc}
              onChange={(e) => setForm({ ...form, ruc: e.target.value.replace(/\D/g, "") })}
              className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none bg-white"
              placeholder="12345678901"
              required
              maxLength={11}
            />
            <p className="text-[10px] text-gray-400 mt-1">11 dígitos numéricos</p>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">
              Razón Social <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.razon_social}
              onChange={(e) => setForm({ ...form, razon_social: e.target.value })}
              className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none bg-white"
              placeholder="Nombre de la empresa"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Contacto</label>
            <input
              type="text"
              value={form.contacto}
              onChange={(e) => setForm({ ...form, contacto: e.target.value })}
              className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none bg-white"
              placeholder="Nombre del representante"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Teléfono</label>
              <input
                type="text"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none bg-white"
                placeholder="999-888-777"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none bg-white"
                placeholder="contacto@empresa.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Dirección</label>
            <input
              type="text"
              value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none bg-white"
              placeholder="Av. Principal 123"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Condiciones de Pago</label>
            <select
              value={form.condiciones_pago}
              onChange={(e) => setForm({ ...form, condiciones_pago: e.target.value })}
              className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none bg-white"
            >
              <option value="CONTADO" className="text-gray-900">Contado</option>
              <option value="CREDITO_15" className="text-gray-900">Crédito 15 días</option>
              <option value="CREDITO_30" className="text-gray-900">Crédito 30 días</option>
              <option value="CREDITO_45" className="text-gray-900">Crédito 45 días</option>
              <option value="CREDITO_60" className="text-gray-900">Crédito 60 días</option>
              <option value="ANTICIPO_50" className="text-gray-900">50% Anticipo - 50% Contraentrega</option>
              <option value="ANTICIPO_30" className="text-gray-900">30% Anticipo - 70% Contraentrega</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {loading ? "Creando..." : "Crear Proveedor"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function ComprasPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ordenes, setOrdenes] = useState<any[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState<OrdenCompraForm>(FORM_VACIO);
  const [tempItems, setTempItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({
    producto: "",
    cantidad: "",
    precio_unitario: "",
    unidad: "UNIDAD",
    descripcion: "",
  });
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [filterEstado, setFilterEstado] = useState<string>("ALL");
  const [showProveedorModal, setShowProveedorModal] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") loadData();
  }, [status]);

  const showToastMsg = (type: "ok" | "err", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordenesRes, proveedoresRes, proyectosRes] = await Promise.all([
        supabase.from("OrdenCompra").select("*, Proveedor(*), Project(*)").order("createdAt", { ascending: false }),
        supabase.from("Proveedor").select("*").eq("activo", true).order("razon_social"),
        supabase.from("Project").select("*").in("status", ["ACTIVO", "EN_PRODUCCION"]).order("name"),
      ]);

      setOrdenes(ordenesRes.data || []);
      setProveedores(proveedoresRes.data || []);
      setProyectos(proyectosRes.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    if (!newItem.producto.trim() || !newItem.cantidad || !newItem.precio_unitario) {
      showToastMsg("err", "Completa producto, cantidad y precio");
      return;
    }

    const cantidad = parseFloat(newItem.cantidad);
    const precio = parseFloat(newItem.precio_unitario);
    const subtotal = cantidad * precio;

    setTempItems([
      ...tempItems,
      {
        id: `temp-${Date.now()}`,
        producto: newItem.producto,
        descripcion: newItem.descripcion,
        cantidad,
        unidad: newItem.unidad,
        precio_unitario: precio,
        subtotal,
      },
    ]);

    setNewItem({
      producto: "",
      cantidad: "",
      precio_unitario: "",
      unidad: "UNIDAD",
      descripcion: "",
    });
  };

  const handleRemoveItem = (index: number) => {
    setTempItems(tempItems.filter((_, i) => i !== index));
  };

  const calcularTotales = () => {
    const subtotal = tempItems.reduce((sum, item) => sum + item.subtotal, 0);
    const igv = subtotal * 0.18;
    const total = subtotal + igv;
    return { subtotal, igv, total };
  };

  const handleSaveOrden = async () => {
    if (!form.proveedor_id) {
      showToastMsg("err", "Selecciona un proveedor");
      return;
    }
    if (tempItems.length === 0) {
      showToastMsg("err", "Agrega al menos un item");
      return;
    }

    setSaving(true);

    const { subtotal, igv, total } = calcularTotales();

    // Generar número de orden
    const ano = new Date().getFullYear();
    const nextNumero = ordenes.length + 1;
    const numero = `OC-${ano}-${nextNumero.toString().padStart(4, "0")}`;

    const payload = {
      numero,
      proveedor_id: form.proveedor_id,
      project_id: form.project_id || null,
      fecha_emision: form.fecha_emision,
      fecha_entrega: form.fecha_entrega || null,
      tipo: form.tipo,
      estado: "BORRADOR",
      subtotal,
      igv,
      total,
      notas: form.notas || null,
    };

    let error;
    let ordenId;

    if (editingId) {
      ({ error } = await supabase.from("OrdenCompra").update(payload).eq("id", editingId));
      ordenId = editingId;
    } else {
      const { data, error: insertError } = await supabase
        .from("OrdenCompra")
        .insert(payload)
        .select();
      error = insertError;
      if (data) ordenId = data[0].id;
    }

    if (error) {
      showToastMsg("err", "Error al guardar la orden");
      setSaving(false);
      return;
    }

    // Guardar items
    if (!editingId) {
      for (const item of tempItems) {
        await supabase.from("OrdenCompraItem").insert({
          orden_compra_id: ordenId,
          producto: item.producto,
          descripcion: item.descripcion,
          cantidad: item.cantidad,
          unidad: item.unidad,
          precio_unitario: item.precio_unitario,
          subtotal: item.subtotal,
          cantidad_recibida: 0,
        });
      }
    }

    setSaving(false);
    showToastMsg("ok", editingId ? "Orden actualizada" : "Orden creada correctamente");
    setForm(FORM_VACIO);
    setTempItems([]);
    setShowForm(false);
    setEditingId(null);
    loadData();
  };

  const handleEdit = (orden: any) => {
    setForm({
      proveedor_id: orden.proveedor_id,
      project_id: orden.project_id || "",
      fecha_emision: orden.fecha_emision.split("T")[0],
      fecha_entrega: orden.fecha_entrega?.split("T")[0] || "",
      tipo: orden.tipo,
      notas: orden.notas || "",
      items: [],
    });
    setEditingId(orden.id);
    setShowForm(true);
    loadOrdenItems(orden.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const loadOrdenItems = async (ordenId: string) => {
    const { data } = await supabase
      .from("OrdenCompraItem")
      .select("*")
      .eq("orden_compra_id", ordenId);
    setTempItems(data || []);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    await supabase.from("OrdenCompra").update({ estado: newStatus }).eq("id", id);
    loadData();
  };

  // ============================================================
  // MANEJAR PROVEEDOR CREADO DESDE MODAL
  // ============================================================
  const handleProveedorCreado = (nuevoProveedor: any) => {
    setProveedores((prev) => [...prev, nuevoProveedor]);
    setForm({ ...form, proveedor_id: nuevoProveedor.id });
    showToastMsg("ok", `Proveedor "${nuevoProveedor.razon_social}" agregado`);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const ordenesFiltradas =
    filterEstado === "ALL" ? ordenes : ordenes.filter((o) => o.estado === filterEstado);
  const totalOrdenes = ordenes.reduce((sum, o) => sum + Number(o.total), 0);
  const ordenesPendientes = ordenes.filter(
    (o) => o.estado !== "COMPLETADA" && o.estado !== "ANULADA"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
            toast.type === "ok"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {toast.type === "ok" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          {toast.msg}
        </div>
      )}

      {/* MODAL DE NUEVO PROVEEDOR */}
      <NuevoProveedorModal
        isOpen={showProveedorModal}
        onClose={() => setShowProveedorModal(false)}
        onSuccess={handleProveedorCreado}
      />

      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/erp/dashboard")}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Dashboard
            </button>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
                <ShoppingCart className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900 leading-none">
                  Compras y Logística
                </h1>
                <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">
                  Órdenes de compra · Proveedores · Recepciones
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setForm(FORM_VACIO);
              setTempItems([]);
              setEditingId(null);
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-xl hover:bg-gray-800 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Nueva orden de compra
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="h-4 w-4 text-gray-400" />
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Total órdenes
              </p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{ordenes.length}</p>
            <p className="text-xs text-gray-400 mt-1">
              {formatCOP(totalOrdenes)} en compras
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Pendientes
              </p>
            </div>
            <p className="text-2xl font-bold text-amber-700">
              {ordenesPendientes}
            </p>
            <p className="text-xs text-gray-400 mt-1">por completar</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-gray-400" />
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Proveedores
              </p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {proveedores.length}
            </p>
            <p className="text-xs text-gray-400 mt-1">registrados</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4 text-gray-400" />
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Proyectos activos
              </p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {proyectos.length}
            </p>
            <p className="text-xs text-gray-400 mt-1">en ejecución</p>
          </div>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-gray-900">
                {editingId
                  ? "Editar orden de compra"
                  : "Nueva orden de compra"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setTempItems([]);
                  setForm(FORM_VACIO);
                  setEditingId(null);
                }}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              {/* PROVEEDOR CON BOTÓN PARA CREAR NUEVO */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                  Proveedor <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={form.proveedor_id}
                    onChange={(e) =>
                      setForm({ ...form, proveedor_id: e.target.value })
                    }
                    className="flex-1 px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                  >
                    <option value="" className="text-gray-900">
                      — Seleccionar proveedor —
                    </option>
                    {proveedores.map((p) => (
                      <option key={p.id} value={p.id} className="text-gray-900">
                        {p.razon_social} ({p.ruc})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowProveedorModal(true)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap"
                    title="Crear nuevo proveedor"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Nuevo
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  ¿No encuentras el proveedor? Crea uno nuevo con el botón
                  "Nuevo"
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                  Proyecto
                </label>
                <select
                  value={form.project_id}
                  onChange={(e) =>
                    setForm({ ...form, project_id: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                >
                  <option value="" className="text-gray-900">
                    — Sin proyecto específico —
                  </option>
                  {proyectos.map((p) => (
                    <option key={p.id} value={p.id} className="text-gray-900">
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                  Fecha de emisión
                </label>
                <input
                  type="date"
                  value={form.fecha_emision}
                  onChange={(e) =>
                    setForm({ ...form, fecha_emision: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                  Fecha de entrega estimada
                </label>
                <input
                  type="date"
                  value={form.fecha_entrega}
                  onChange={(e) =>
                    setForm({ ...form, fecha_entrega: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                  Tipo de compra
                </label>
                <select
                  value={form.tipo}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                  className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                >
                  <option value="MATERIALES" className="text-gray-900">
                    Materiales
                  </option>
                  <option value="HERRAMIENTAS" className="text-gray-900">
                    Herramientas
                  </option>
                  <option value="SERVICIOS" className="text-gray-900">
                    Servicios
                  </option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                  Notas
                </label>
                <textarea
                  rows={2}
                  value={form.notas}
                  onChange={(e) => setForm({ ...form, notas: e.target.value })}
                  className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none bg-white"
                  placeholder="Instrucciones adicionales..."
                />
              </div>
            </div>

            {/* Items */}
            <div className="border-t border-gray-100 pt-4 mb-4">
              <p className="text-xs font-semibold text-gray-700 mb-3">
                Items de la orden
              </p>
              <div className="grid grid-cols-12 gap-2 mb-2">
                <div className="col-span-4">
                  <input
                    type="text"
                    placeholder="Producto"
                    value={newItem.producto}
                    onChange={(e) =>
                      setNewItem({ ...newItem, producto: e.target.value })
                    }
                    className="w-full px-2 py-1.5 text-xs text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    placeholder="Cantidad"
                    value={newItem.cantidad}
                    onChange={(e) =>
                      setNewItem({ ...newItem, cantidad: e.target.value })
                    }
                    className="w-full px-2 py-1.5 text-xs text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Precio unit."
                    value={newItem.precio_unitario}
                    onChange={(e) =>
                      setNewItem({ ...newItem, precio_unitario: e.target.value })
                    }
                    className="w-full px-2 py-1.5 text-xs text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    placeholder="Unidad"
                    value={newItem.unidad}
                    onChange={(e) =>
                      setNewItem({ ...newItem, unidad: e.target.value })
                    }
                    className="w-full px-2 py-1.5 text-xs text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                  />
                </div>
                <div className="col-span-2">
                  <button
                    onClick={handleAddItem}
                    className="w-full px-2 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Agregar
                  </button>
                </div>
                <div className="col-span-12">
                  <input
                    type="text"
                    placeholder="Descripción (opcional)"
                    value={newItem.descripcion}
                    onChange={(e) =>
                      setNewItem({ ...newItem, descripcion: e.target.value })
                    }
                    className="w-full px-2 py-1.5 text-xs text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                  />
                </div>
              </div>

              {tempItems.length > 0 && (
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-2 text-gray-700">
                          Producto
                        </th>
                        <th className="text-center p-2 text-gray-700">
                          Cant.
                        </th>
                        <th className="text-center p-2 text-gray-700">
                          Und.
                        </th>
                        <th className="text-right p-2 text-gray-700">
                          Precio unit.
                        </th>
                        <th className="text-right p-2 text-gray-700">
                          Subtotal
                        </th>
                        <th className="text-center p-2 text-gray-700"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {tempItems.map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-100">
                          <td className="p-2">
                            <p className="font-medium text-gray-900">
                              {item.producto}
                            </p>
                            {item.descripcion && (
                              <p className="text-[10px] text-gray-400">
                                {item.descripcion}
                              </p>
                            )}
                          </td>
                          <td className="p-2 text-center text-gray-900">
                            {item.cantidad}
                          </td>
                          <td className="p-2 text-center text-gray-900">
                            {item.unidad}
                          </td>
                          <td className="p-2 text-right text-gray-900">
                            {formatCOP(item.precio_unitario)}
                          </td>
                          <td className="p-2 text-right font-medium text-gray-900">
                            {formatCOP(item.subtotal)}
                          </td>
                          <td className="p-2 text-center">
                            <button
                              onClick={() => handleRemoveItem(idx)}
                              className="text-gray-300 hover:text-red-500"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={4} className="p-2 text-right font-medium text-gray-700">
                          Subtotal:{" "}
                        </td>
                        <td className="p-2 text-right font-medium text-gray-900">
                          {formatCOP(calcularTotales().subtotal)}
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan={4} className="p-2 text-right font-medium text-gray-700">
                          IGV (18%):{" "}
                        </td>
                        <td className="p-2 text-right font-medium text-gray-900">
                          {formatCOP(calcularTotales().igv)}
                        </td>
                        <td></td>
                      </tr>
                      <tr className="border-t border-gray-200">
                        <td colSpan={4} className="p-2 text-right font-bold text-gray-900">
                          TOTAL:{" "}
                        </td>
                        <td className="p-2 text-right font-bold text-teal-700">
                          {formatCOP(calcularTotales().total)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={handleSaveOrden}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving
                  ? "Guardando..."
                  : editingId
                  ? "Actualizar orden"
                  : "Crear orden"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setTempItems([]);
                  setForm(FORM_VACIO);
                  setEditingId(null);
                }}
                className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista de órdenes */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-900">
                Órdenes de compra
              </h3>
              <span className="text-xs text-gray-400">
                {ordenes.length} registros
              </span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white text-gray-900"
              >
                <option value="ALL" className="text-gray-900">
                  Todos los estados
                </option>
                {ESTADOS_OC.map((e) => (
                  <option key={e.key} value={e.key} className="text-gray-900">
                    {e.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {ordenesFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">
                No hay órdenes de compra registradas
              </p>
              <p className="text-xs text-gray-300 mt-1">
                Crea la primera con el botón "Nueva orden de compra"
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {ordenesFiltradas.map((orden) => {
                const estadoInfo =
                  ESTADOS_OC.find((e) => e.key === orden.estado) ||
                  ESTADOS_OC[0];
                const isExpanded = expandedId === orden.id;
                const proveedor = proveedores.find(
                  (p) => p.id === orden.proveedor_id
                );
                const proyecto = proyectos.find(
                  (p) => p.id === orden.project_id
                );

                return (
                  <div
                    key={orden.id}
                    className="p-5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="text-sm font-bold text-gray-900">
                            {orden.numero}
                          </p>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              badgeColors[estadoInfo.color]
                            }`}
                          >
                            {estadoInfo.label}
                          </span>
                          <span className="text-xs text-gray-400">
                            {orden.tipo}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">
                          {proveedor?.razon_social || "Sin proveedor"}
                        </p>
                        {proyecto && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            Proyecto: {proyecto.name}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          <span>
                            Emisión:{" "}
                            {new Date(orden.fecha_emision).toLocaleDateString(
                              "es-PE"
                            )}
                          </span>
                          {orden.fecha_entrega && (
                            <span>
                              Entrega:{" "}
                              {new Date(orden.fecha_entrega).toLocaleDateString(
                                "es-PE"
                              )}
                            </span>
                          )}
                          <span>Total: {formatCOP(Number(orden.total))}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(orden)}
                          className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            setExpandedId(isExpanded ? null : orden.id)
                          }
                          className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase mb-1">
                              Items
                            </p>
                            <div className="space-y-1 max-h-48 overflow-y-auto">
                              {orden.items?.length > 0 ? (
                                orden.items.map((item: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between text-sm py-1 border-b border-gray-50"
                                  >
                                    <span className="text-gray-700">
                                      {item.cantidad} x {item.producto}
                                    </span>
                                    <span className="font-medium text-gray-900">
                                      {formatCOP(item.subtotal)}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-gray-400">
                                  Cargando items...
                                </p>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase mb-1">
                              Notas
                            </p>
                            <p className="text-sm text-gray-600">
                              {orden.notas || "Sin observaciones"}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          {orden.estado !== "COMPLETADA" &&
                            orden.estado !== "ANULADA" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleUpdateStatus(orden.id, "EMITIDA")
                                  }
                                  className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                  Marcar como emitida
                                </button>
                                <button
                                  onClick={() =>
                                    handleUpdateStatus(orden.id, "COMPLETADA")
                                  }
                                  className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
                                >
                                  Marcar como completada
                                </button>
                              </>
                            )}
                          {orden.estado !== "ANULADA" &&
                            orden.estado !== "COMPLETADA" && (
                              <button
                                onClick={() =>
                                  handleUpdateStatus(orden.id, "ANULADA")
                                }
                                className="text-xs bg-red-50 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                              >
                                Anular orden
                              </button>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}