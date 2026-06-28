"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import {
  ChevronLeft,
  Printer,
  Send,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Calendar,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Plus,
  RefreshCw,
  Download,
  ArrowUpRight,
  History,
  MessageSquare,
  Eye,
  Ban,
  TrendingUp,
  DollarSign,
  Package,
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

const ESTADOS_COTIZACION: Record<string, { label: string; color: string; icon: any }> = {
  BORRADOR: { label: "Borrador", color: "bg-gray-100 text-gray-700 border-gray-200", icon: FileText },
  ENVIADA: { label: "Enviada", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Send },
  VISTA: { label: "Vista", color: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: Eye },
  APROBADA: { label: "Aprobada", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle },
  RECHAZADA: { label: "Rechazada", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
  EXPIRADA: { label: "Expirada", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  CONVERTIDA_A_OBRA: { label: "Convertida a obra", color: "bg-purple-100 text-purple-700 border-purple-200", icon: ArrowUpRight },
};

const TIPOS_SEGUIMIENTO = [
  { value: "LLAMADA", label: "📞 Llamada" },
  { value: "EMAIL", label: "📧 Email" },
  { value: "REUNION", label: "🤝 Reunión" },
  { value: "WHATSAPP", label: "💬 WhatsApp" },
  { value: "VISITA", label: "🏗️ Visita" },
  { value: "NOTA", label: "📝 Nota" },
];

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
        <XCircle className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function CotizacionDetallePage({ 
  params 
}: { 
  params: Promise<{ id: string }>  // 🔥 CAMBIO: Promise
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 🔥 CORRECCIÓN: Usar React.use() para desestructurar params
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cotizacion, setCotizacion] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [seguimiento, setSeguimiento] = useState<any[]>([]);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [showSeguimientoForm, setShowSeguimientoForm] = useState(false);
  const [nuevoSeguimiento, setNuevoSeguimiento] = useState({
    tipo: "NOTA",
    descripcion: "",
    proximo_contacto: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") loadCotizacion();
  }, [status, id]); // 🔥 CAMBIO: usar id en lugar de params.id

  const showToast = (type: "ok" | "err", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const loadCotizacion = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cotizaciones/${id}`); // 🔥 Usar id
      const data = await response.json();

      console.log('📄 Datos de cotización:', data);

      if (!data.success) throw new Error(data.error);

      setCotizacion(data.data);
      setItems(data.data?.items || []);
      setSeguimiento(data.data?.seguimiento || []);
    } catch (error: any) {
      console.error("Error cargando cotización:", error);
      showToast("err", error.message || "Error al cargar la cotización");
    } finally {
      setLoading(false);
    }
  };

  const handleEnviar = async () => {
    try {
      const response = await fetch(`/api/cotizaciones/${id}/enviar`, { // 🔥 Usar id
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();

      if (!data.success) throw new Error(data.error);

      showToast("ok", "Cotización marcada como enviada");
      loadCotizacion();
    } catch (error: any) {
      showToast("err", error.message || "Error al enviar");
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar esta cotización? (Solo disponible en estado BORRADOR)")) return;

    try {
      const response = await fetch(`/api/cotizaciones/${id}`, { // 🔥 Usar id
        method: "DELETE" 
      });
      const data = await response.json();

      if (!data.success) throw new Error(data.error);

      showToast("ok", "Cotización eliminada");
      router.push("/cotizaciones");
    } catch (error: any) {
      showToast("err", error.message || "Error al eliminar");
    }
  };

  const handleConvertir = async () => {
    if (!cotizacion) return;

    const projectName = prompt(
      "Nombre del proyecto:",
      `Obra - ${cotizacion.cliente} - ${new Date().getFullYear()}`
    );

    if (!projectName) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/cotizaciones/${id}/convertir`, { // 🔥 Usar id
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: projectName,
          fecha_inicio: new Date().toISOString().split("T")[0],
        }),
      });

      const data = await response.json();

      if (!data.success) throw new Error(data.error);

      showToast("ok", "✅ Obra y contrato creados exitosamente");
      loadCotizacion();

      setTimeout(() => {
        router.push(`/obras/${data.data.project.id}`);
      }, 1500);
    } catch (error: any) {
      showToast("err", error.message || "Error al convertir");
    } finally {
      setSaving(false);
    }
  };

  const handleAgregarSeguimiento = async () => {
    if (!nuevoSeguimiento.descripcion.trim()) {
      showToast("err", "Ingresa una descripción");
      return;
    }

    try {
      const response = await fetch(`/api/cotizaciones/${id}/seguimiento`, { // 🔥 Usar id
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoSeguimiento),
      });

      const data = await response.json();

      if (!data.success) throw new Error(data.error);

      showToast("ok", "Seguimiento agregado");
      setShowSeguimientoForm(false);
      setNuevoSeguimiento({
        tipo: "NOTA",
        descripcion: "",
        proximo_contacto: "",
      });
      loadCotizacion();
    } catch (error: any) {
      showToast("err", error.message || "Error al agregar seguimiento");
    }
  };

  const handleCambiarEstado = async (nuevoEstado: string) => {
    try {
      const response = await fetch(`/api/cotizaciones/${id}`, { // 🔥 Usar id
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      const data = await response.json();

      if (!data.success) throw new Error(data.error);

      showToast("ok", `Estado actualizado a ${ESTADOS_COTIZACION[nuevoEstado]?.label || nuevoEstado}`);
      loadCotizacion();
    } catch (error: any) {
      showToast("err", error.message || "Error al actualizar estado");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-zinc-300" />
      </div>
    );
  }

  if (!cotizacion) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-zinc-200 mx-auto mb-3" />
          <p className="text-sm text-zinc-400">Cotización no encontrada</p>
          <button
            onClick={() => router.push("/cotizaciones")}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Volver a cotizaciones
          </button>
        </div>
      </div>
    );
  }

  const estadoInfo = ESTADOS_COTIZACION[cotizacion.estado] || ESTADOS_COTIZACION.BORRADOR;
  const EstadoIcon = estadoInfo.icon;
  const puedeEditar = cotizacion.estado === "BORRADOR";
  const puedeEliminar = cotizacion.estado === "BORRADOR";
  const puedeEnviar = ["BORRADOR", "VISTA"].includes(cotizacion.estado);
  const puedeAprobar = cotizacion.estado === "ENVIADA" || cotizacion.estado === "VISTA";
  const puedeConvertir = cotizacion.estado === "APROBADA";

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
              onClick={() => router.push("/cotizaciones")}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-700 text-sm transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Cotizaciones
            </button>
            <div className="h-4 w-px bg-zinc-200" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-zinc-900 leading-none">{cotizacion.numero}</h1>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${estadoInfo.color} border`}>
                  <EstadoIcon className="h-3 w-3 inline mr-1" />
                  {estadoInfo.label}
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-0.5 uppercase tracking-wider">
                {cotizacion.cliente}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {puedeEnviar && (
              <button
                onClick={handleEnviar}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
                Marcar enviada
              </button>
            )}
            {puedeAprobar && (
              <button
                onClick={() => handleCambiarEstado("APROBADA")}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg hover:bg-emerald-100 transition-colors"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Aprobar
              </button>
            )}
            {puedeAprobar && (
              <button
                onClick={() => handleCambiarEstado("RECHAZADA")}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors"
              >
                <Ban className="h-3.5 w-3.5" />
                Rechazar
              </button>
            )}
            {puedeConvertir && (
              <button
                onClick={handleConvertir}
                disabled={saving}
                className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ArrowRight className="h-3.5 w-3.5" />
                )}
                {saving ? "Convirtiendo..." : "Convertir a obra"}
              </button>
            )}
            {puedeEditar && (
              <button
                onClick={() => router.push(`/cotizaciones/${id}/editar`)} // 🔥 Usar id
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 text-zinc-700 text-xs font-medium rounded-lg hover:bg-zinc-200 transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
                Editar
              </button>
            )}
            {puedeEliminar && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Eliminar
              </button>
            )}
            <button
              onClick={loadCotizacion}
              className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
              title="Actualizar"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Resumen rápido */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5">
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Total</p>
            <p className="text-2xl font-bold text-zinc-900">{formatCOP(Number(cotizacion.total))}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{cotizacion.moneda || "PEN"}</p>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5">
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Items</p>
            <p className="text-2xl font-bold text-zinc-900">{items.length}</p>
            <p className="text-xs text-zinc-500 mt-0.5">partidas</p>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5">
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Emisión</p>
            <p className="text-sm font-semibold text-zinc-900">
              {new Date(cotizacion.fecha_emision).toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
            {cotizacion.fecha_validez && (
              <p className="text-xs text-zinc-500 mt-0.5">
                Validez: {new Date(cotizacion.fecha_validez).toLocaleDateString("es-PE", {
                  day: "2-digit",
                  month: "short",
                })}
              </p>
            )}
          </div>
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5">
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Proyecto</p>
            {cotizacion.project ? (
              <>
                <p className="text-sm font-semibold text-zinc-900 truncate">{cotizacion.project.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{cotizacion.project.client}</p>
              </>
            ) : (
              <p className="text-sm text-zinc-400">No asociado</p>
            )}
          </div>
        </div>

        {/* Cliente */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <User className="h-4 w-4" />
            Cliente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <Building2 className="h-4 w-4 text-zinc-400 mt-0.5" />
              <div>
                <p className="text-xs text-zinc-400">Cliente</p>
                <p className="text-sm font-medium text-zinc-800">{cotizacion.cliente}</p>
              </div>
            </div>
            {cotizacion.cliente_ruc && (
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-zinc-400 mt-0.5" />
                <div>
                  <p className="text-xs text-zinc-400">RUC</p>
                  <p className="text-sm font-medium text-zinc-800">{cotizacion.cliente_ruc}</p>
                </div>
              </div>
            )}
            {cotizacion.cliente_contacto && (
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-zinc-400 mt-0.5" />
                <div>
                  <p className="text-xs text-zinc-400">Contacto</p>
                  <p className="text-sm font-medium text-zinc-800">{cotizacion.cliente_contacto}</p>
                </div>
              </div>
            )}
            {cotizacion.cliente_telefono && (
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-zinc-400 mt-0.5" />
                <div>
                  <p className="text-xs text-zinc-400">Teléfono</p>
                  <p className="text-sm font-medium text-zinc-800">{cotizacion.cliente_telefono}</p>
                </div>
              </div>
            )}
            {cotizacion.cliente_email && (
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-zinc-400 mt-0.5" />
                <div>
                  <p className="text-xs text-zinc-400">Email</p>
                  <p className="text-sm font-medium text-zinc-800">{cotizacion.cliente_email}</p>
                </div>
              </div>
            )}
            {cotizacion.cliente_direccion && (
              <div className="flex items-start gap-2 md:col-span-2">
                <MapPin className="h-4 w-4 text-zinc-400 mt-0.5" />
                <div>
                  <p className="text-xs text-zinc-400">Dirección</p>
                  <p className="text-sm font-medium text-zinc-800">{cotizacion.cliente_direccion}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Items
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="text-left p-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">#</th>
                  <th className="text-left p-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Descripción</th>
                  <th className="text-center p-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Cant.</th>
                  <th className="text-center p-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Und.</th>
                  <th className="text-right p-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">P. Unit.</th>
                  <th className="text-right p-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total</th>
                </tr>
              </thead>
              <tbody>
                {items && items.length > 0 ? (
                  items.map((item, idx) => (
                    <tr key={item.id || idx} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                      <td className="p-3 text-zinc-400 text-center">{idx + 1}</td>
                      <td className="p-3 text-zinc-800">{item.descripcion}</td>
                      <td className="p-3 text-center text-zinc-800">{item.cantidad}</td>
                      <td className="p-3 text-center text-zinc-500">{item.unidad}</td>
                      <td className="p-3 text-right text-zinc-800">{formatCOP(item.precio_unitario)}</td>
                      <td className="p-3 text-right font-semibold text-zinc-900">{formatCOP(item.total)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-sm text-zinc-400">
                      No hay items registrados
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-zinc-50 border-t border-zinc-200">
                <tr>
                  <td colSpan={5} className="p-3 text-right font-medium text-zinc-700">Subtotal:</td>
                  <td className="p-3 text-right font-semibold text-zinc-900">{formatCOP(Number(cotizacion.subtotal))}</td>
                </tr>
                <tr>
                  <td colSpan={5} className="p-3 text-right font-medium text-zinc-700">IGV (18%):</td>
                  <td className="p-3 text-right font-semibold text-zinc-900">{formatCOP(Number(cotizacion.igv))}</td>
                </tr>
                <tr className="border-t border-zinc-300">
                  <td colSpan={5} className="p-3 text-right font-bold text-zinc-900 text-base">TOTAL:</td>
                  <td className="p-3 text-right font-bold text-emerald-700 text-base">{formatCOP(Number(cotizacion.total))}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Condiciones y notas */}
        {(cotizacion.condiciones || cotizacion.notas) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cotizacion.condiciones && (
              <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
                <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Condiciones
                </h2>
                <p className="text-sm text-zinc-600 whitespace-pre-wrap">{cotizacion.condiciones}</p>
              </div>
            )}
            {cotizacion.notas && (
              <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
                <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Notas adicionales
                </h2>
                <p className="text-sm text-zinc-600 whitespace-pre-wrap">{cotizacion.notas}</p>
              </div>
            )}
          </div>
        )}

        {/* Seguimiento */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-2">
              <History className="h-4 w-4" />
              Seguimiento
            </h2>
            <button
              onClick={() => setShowSeguimientoForm(!showSeguimientoForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Agregar seguimiento
            </button>
          </div>

          {showSeguimientoForm && (
            <div className="mb-4 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">
                    Tipo
                  </label>
                  <select
                    value={nuevoSeguimiento.tipo}
                    onChange={(e) =>
                      setNuevoSeguimiento({ ...nuevoSeguimiento, tipo: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm text-zinc-900 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  >
                    {TIPOS_SEGUIMIENTO.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">
                    Próximo contacto
                  </label>
                  <input
                    type="date"
                    value={nuevoSeguimiento.proximo_contacto}
                    onChange={(e) =>
                      setNuevoSeguimiento({ ...nuevoSeguimiento, proximo_contacto: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm text-zinc-900 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">
                    Descripción *
                  </label>
                  <textarea
                    rows={2}
                    value={nuevoSeguimiento.descripcion}
                    onChange={(e) =>
                      setNuevoSeguimiento({ ...nuevoSeguimiento, descripcion: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm text-zinc-900 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none"
                    placeholder="Detalles del seguimiento..."
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleAgregarSeguimiento}
                  className="px-4 py-2 bg-zinc-900 text-white text-xs font-medium rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  Guardar seguimiento
                </button>
                <button
                  onClick={() => setShowSeguimientoForm(false)}
                  className="px-4 py-2 border border-zinc-200 text-zinc-600 text-xs font-medium rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {seguimiento && seguimiento.length > 0 ? (
            <div className="space-y-3">
              {seguimiento.map((s, idx) => (
                <div key={s.id || idx} className="flex items-start gap-3 p-3 bg-zinc-50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4 text-zinc-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-zinc-800">{s.tipo}</span>
                      <span className="text-[10px] text-zinc-400">
                        {new Date(s.fecha).toLocaleString("es-PE", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {s.proximo_contacto && (
                        <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          Próximo: {new Date(s.proximo_contacto).toLocaleDateString("es-PE")}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-600 mt-0.5">{s.descripcion}</p>
                    {s.realizado_por && (
                      <p className="text-[10px] text-zinc-400 mt-1">Por: {s.realizado_por}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-400 text-center py-4">Sin seguimiento registrado</p>
          )}
        </div>
      </main>
    </div>
  );
}