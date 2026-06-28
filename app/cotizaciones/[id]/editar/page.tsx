"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import {
  ChevronLeft,
  Plus,
  Trash2,
  Save,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Search,
  FileText,
  Info,
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

const UNIDADES = [
  { value: "ML", label: "ML (Metros lineales)" },
  { value: "UND", label: "UND (Unidades)" },
  { value: "M2", label: "M2 (Metros cuadrados)" },
  { value: "KG", label: "KG (Kilogramos)" },
  { value: "GLB", label: "GLB (Global)" },
  { value: "HR", label: "HR (Horas)" },
  { value: "LOT", label: "LOT (Lote)" },
];

type ItemForm = {
  id: string;
  descripcion: string;
  cantidad: number;
  unidad: string;
  precio_unitario: number;
  descuento: number;
  total: number;
};

type CotizacionForm = {
  project_id: string;
  cliente: string;
  cliente_ruc: string;
  cliente_contacto: string;
  cliente_telefono: string;
  cliente_email: string;
  cliente_direccion: string;
  fecha_emision: string;
  fecha_validez: string;
  condiciones: string;
  notas: string;
  moneda: string;
  tipo_cambio: number;
};

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

export default function EditarCotizacionPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  const [form, setForm] = useState<CotizacionForm>({
    project_id: "",
    cliente: "",
    cliente_ruc: "",
    cliente_contacto: "",
    cliente_telefono: "",
    cliente_email: "",
    cliente_direccion: "",
    fecha_emision: new Date().toISOString().split("T")[0],
    fecha_validez: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    condiciones: "",
    notas: "",
    moneda: "PEN",
    tipo_cambio: 1,
  });

  const [items, setItems] = useState<ItemForm[]>([]);
  const [newItem, setNewItem] = useState<ItemForm>({
    id: "",
    descripcion: "",
    cantidad: 1,
    unidad: "UND",
    precio_unitario: 0,
    descuento: 0,
    total: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      loadProyectos();
      loadCotizacion();
    }
  }, [status, params.id]);

  const loadProyectos = async () => {
    try {
      const { data } = await supabase
        .from("Project")
        .select("id, name, client")
        .order("name");
      setProyectos(data || []);
    } catch (error) {
      console.error("Error cargando proyectos:", error);
    }
  };

  const loadCotizacion = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cotizaciones/${params.id}`);
      const data = await response.json();

      if (!data.success) throw new Error(data.error);

      const cotizacion = data.data;

      setForm({
        project_id: cotizacion.project_id || "",
        cliente: cotizacion.cliente || "",
        cliente_ruc: cotizacion.cliente_ruc || "",
        cliente_contacto: cotizacion.cliente_contacto || "",
        cliente_telefono: cotizacion.cliente_telefono || "",
        cliente_email: cotizacion.cliente_email || "",
        cliente_direccion: cotizacion.cliente_direccion || "",
        fecha_emision: cotizacion.fecha_emision?.split("T")[0] || new Date().toISOString().split("T")[0],
        fecha_validez: cotizacion.fecha_validez?.split("T")[0] || "",
        condiciones: cotizacion.condiciones || "",
        notas: cotizacion.notas || "",
        moneda: cotizacion.moneda || "PEN",
        tipo_cambio: cotizacion.tipo_cambio || 1,
      });

      if (data.data.items) {
        setItems(
          data.data.items.map((item: any) => ({
            id: item.id,
            descripcion: item.descripcion,
            cantidad: item.cantidad,
            unidad: item.unidad,
            precio_unitario: item.precio_unitario,
            descuento: item.descuento || 0,
            total: item.total,
          }))
        );
      }
    } catch (error: any) {
      showToast("err", error.message || "Error al cargar la cotización");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type: "ok" | "err", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  // Cálculo de totales
  const calcularTotales = () => {
    let subtotal = 0;
    items.forEach((item) => {
      const totalItem = (item.cantidad * item.precio_unitario) - (item.descuento || 0);
      item.total = totalItem;
      subtotal += totalItem;
    });
    return subtotal;
  };

  const subtotal = calcularTotales();
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  // Agregar item
  const agregarItem = () => {
    if (!newItem.descripcion.trim()) {
      showToast("err", "Ingresa una descripción");
      return;
    }
    if (newItem.cantidad <= 0) {
      showToast("err", "La cantidad debe ser mayor a 0");
      return;
    }
    if (newItem.precio_unitario <= 0) {
      showToast("err", "El precio unitario debe ser mayor a 0");
      return;
    }

    const itemTotal = (newItem.cantidad * newItem.precio_unitario) - (newItem.descuento || 0);

    setItems([
      ...items,
      {
        ...newItem,
        id: `item-${Date.now()}`,
        total: itemTotal,
      },
    ]);

    setNewItem({
      id: "",
      descripcion: "",
      cantidad: 1,
      unidad: "UND",
      precio_unitario: 0,
      descuento: 0,
      total: 0,
    });
  };

  const eliminarItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Guardar cotización
  const guardarCotizacion = async () => {
    if (!form.cliente.trim()) {
      showToast("err", "El cliente es requerido");
      return;
    }
    if (items.length === 0) {
      showToast("err", "Agrega al menos un item");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        project_id: form.project_id || null,
        items: items.map((item) => ({
          descripcion: item.descripcion,
          cantidad: item.cantidad,
          unidad: item.unidad,
          precio_unitario: item.precio_unitario,
          descuento: item.descuento || 0,
          total: item.total,
        })),
      };

      const response = await fetch(`/api/cotizaciones/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.success) throw new Error(data.error);

      showToast("ok", "Cotización actualizada exitosamente");
      setTimeout(() => router.push(`/cotizaciones/${params.id}`), 1000);
    } catch (error: any) {
      showToast("err", error.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-zinc-300" />
      </div>
    );
  }

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
              onClick={() => router.push(`/cotizaciones/${params.id}`)}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-700 text-sm transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Volver
            </button>
            <div className="h-4 w-px bg-zinc-200" />
            <div>
              <h1 className="text-sm font-bold text-zinc-900 leading-none">Editar cotización</h1>
              <p className="text-[10px] text-zinc-400 mt-0.5 uppercase tracking-wider">
                Modifica los datos del pedido
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/cotizaciones/${params.id}`)}
              className="px-4 py-2 border border-zinc-200 text-zinc-600 text-xs font-medium rounded-lg hover:bg-zinc-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={guardarCotizacion}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Guardando..." : "Actualizar cotización"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Datos del cliente */}
        <section className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider mb-4">1. Datos del cliente</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                Cliente <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.cliente}
                onChange={(e) => setForm({ ...form, cliente: e.target.value })}
                className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"
                placeholder="Nombre del cliente"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                RUC
              </label>
              <input
                type="text"
                value={form.cliente_ruc}
                onChange={(e) => setForm({ ...form, cliente_ruc: e.target.value })}
                className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"
                placeholder="12345678901"
                maxLength={11}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                Contacto
              </label>
              <input
                type="text"
                value={form.cliente_contacto}
                onChange={(e) => setForm({ ...form, cliente_contacto: e.target.value })}
                className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"
                placeholder="Nombre del contacto"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                Teléfono
              </label>
              <input
                type="text"
                value={form.cliente_telefono}
                onChange={(e) => setForm({ ...form, cliente_telefono: e.target.value })}
                className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"
                placeholder="999-888-777"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                value={form.cliente_email}
                onChange={(e) => setForm({ ...form, cliente_email: e.target.value })}
                className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"
                placeholder="cliente@empresa.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                Dirección
              </label>
              <input
                type="text"
                value={form.cliente_direccion}
                onChange={(e) => setForm({ ...form, cliente_direccion: e.target.value })}
                className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"
                placeholder="Dirección del cliente"
              />
            </div>
          </div>
        </section>

        {/* Proyecto y fechas */}
        <section className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider mb-4">2. Proyecto y fechas</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                Proyecto asociado
              </label>
              <select
                value={form.project_id}
                onChange={(e) => setForm({ ...form, project_id: e.target.value })}
                className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"
              >
                <option value="">— Sin proyecto específico —</option>
                {proyectos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.client})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                Fecha de emisión
              </label>
              <input
                type="date"
                value={form.fecha_emision}
                onChange={(e) => setForm({ ...form, fecha_emision: e.target.value })}
                className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                Fecha de validez
              </label>
              <input
                type="date"
                value={form.fecha_validez}
                onChange={(e) => setForm({ ...form, fecha_validez: e.target.value })}
                className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                Moneda
              </label>
              <select
                value={form.moneda}
                onChange={(e) => setForm({ ...form, moneda: e.target.value })}
                className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"
              >
                <option value="PEN">PEN - Soles</option>
                <option value="USD">USD - Dólares</option>
              </select>
            </div>

            {form.moneda === "USD" && (
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                  Tipo de cambio
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={form.tipo_cambio}
                  onChange={(e) => setForm({ ...form, tipo_cambio: parseFloat(e.target.value) || 1 })}
                  className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"
                />
              </div>
            )}
          </div>
        </section>

        {/* Items */}
        <section className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider mb-4">3. Items de la cotización</h2>

          <div className="grid grid-cols-12 gap-2 mb-3">
            <div className="col-span-5">
              <input
                type="text"
                placeholder="Descripción del item"
                value={newItem.descripcion}
                onChange={(e) => setNewItem({ ...newItem, descripcion: e.target.value })}
                className="w-full px-3 py-2 text-sm text-zinc-900 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"
              />
            </div>
            <div className="col-span-2">
              <input
                type="number"
                placeholder="Cant."
                value={newItem.cantidad}
                onChange={(e) => setNewItem({ ...newItem, cantidad: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm text-zinc-900 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"
              />
            </div>
            <div className="col-span-2">
              <select
                value={newItem.unidad}
                onChange={(e) => setNewItem({ ...newItem, unidad: e.target.value })}
                className="w-full px-3 py-2 text-sm text-zinc-900 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"
              >
                {UNIDADES.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <input
                type="number"
                placeholder="Precio unit."
                step="0.01"
                value={newItem.precio_unitario}
                onChange={(e) => setNewItem({ ...newItem, precio_unitario: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm text-zinc-900 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"
              />
            </div>
            <div className="col-span-1">
              <button
                onClick={agregarItem}
                className="w-full px-3 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors h-[42px] flex items-center justify-center"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {items.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    <th className="text-left p-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Descripción</th>
                    <th className="text-center p-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Cant.</th>
                    <th className="text-center p-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Und.</th>
                    <th className="text-right p-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">P. Unit.</th>
                    <th className="text-right p-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Descuento</th>
                    <th className="text-right p-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total</th>
                    <th className="text-center p-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                      <td className="p-3 text-zinc-800">{item.descripcion}</td>
                      <td className="p-3 text-center text-zinc-800">{item.cantidad}</td>
                      <td className="p-3 text-center text-zinc-500">{item.unidad}</td>
                      <td className="p-3 text-right text-zinc-800">{formatCOP(item.precio_unitario)}</td>
                      <td className="p-3 text-right text-zinc-500">{item.descuento > 0 ? formatCOP(item.descuento) : "-"}</td>
                      <td className="p-3 text-right font-semibold text-zinc-900">{formatCOP(item.total)}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => eliminarItem(item.id)}
                          className="text-zinc-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-zinc-50 border-t border-zinc-200">
                  <tr>
                    <td colSpan={5} className="p-3 text-right font-medium text-zinc-700">Subtotal:</td>
                    <td className="p-3 text-right font-semibold text-zinc-900">{formatCOP(subtotal)}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colSpan={5} className="p-3 text-right font-medium text-zinc-700">IGV (18%):</td>
                    <td className="p-3 text-right font-semibold text-zinc-900">{formatCOP(igv)}</td>
                    <td></td>
                  </tr>
                  <tr className="border-t border-zinc-300">
                    <td colSpan={5} className="p-3 text-right font-bold text-zinc-900 text-base">TOTAL:</td>
                    <td className="p-3 text-right font-bold text-emerald-700 text-base">{formatCOP(total)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </section>

        {/* Condiciones y notas */}
        <section className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider mb-4">4. Condiciones y notas</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                Condiciones
              </label>
              <textarea
                rows={4}
                value={form.condiciones}
                onChange={(e) => setForm({ ...form, condiciones: e.target.value })}
                className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors resize-none"
                placeholder="Condiciones de pago, plazos de entrega, garantías..."
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                Notas adicionales
              </label>
              <textarea
                rows={4}
                value={form.notas}
                onChange={(e) => setForm({ ...form, notas: e.target.value })}
                className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors resize-none"
                placeholder="Información adicional, observaciones, alcances..."
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}