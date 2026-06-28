"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

const ESTADOS_COTIZACION: Record<string, { label: string; color: string }> = {
  BORRADOR: { label: "Borrador", color: "bg-gray-100 text-gray-700" },
  ENVIADA: { label: "Enviada", color: "bg-blue-100 text-blue-700" },
  VISTA: { label: "Vista", color: "bg-indigo-100 text-indigo-700" },
  APROBADA: { label: "Aprobada", color: "bg-emerald-100 text-emerald-700" },
  RECHAZADA: { label: "Rechazada", color: "bg-red-100 text-red-700" },
  EXPIRADA: { label: "Expirada", color: "bg-amber-100 text-amber-700" },
  CONVERTIDA_A_OBRA: { label: "Convertida a obra", color: "bg-purple-100 text-purple-700" },
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
        <XCircle className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function CotizacionDetallePage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [cotizacion, setCotizacion] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [seguimiento, setSeguimiento] = useState<any[]>([]);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") loadCotizacion();
  }, [status, params.id]);

  const showToast = (type: "ok" | "err", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const loadCotizacion = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cotizaciones/${params.id}`);
      const data = await response.json();

      if (!data.success) throw new Error(data.error);

      setCotizacion(data.data);
      setItems(data.data.items || []);
      setSeguimiento(data.data.seguimiento || []);
    } catch (error: any) {
      showToast("err", error.message || "Error al cargar la cotización");
    } finally {
      setLoading(false);
    }
  };

  const handleEnviar = async () => {
    try {
      const response = await fetch(`/api/cotizaciones/${params.id}/enviar`, { method: "POST" });
      const data = await response.json();

      if (!data.success) throw new Error(data.error);

      showToast("ok", "Cotización marcada como enviada");
      loadCotizacion();
    } catch (error: any) {
      showToast("err", error.message || "Error al enviar");
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar esta cotización?")) return;

    try {
      const response = await fetch(`/api/cotizaciones/${params.id}`, { method: "DELETE" });
      const data = await response.json();

      if (!data.success) throw new Error(data.error);

      showToast("ok", "Cotización eliminada");
      router.push("/cotizaciones");
    } catch (error: any) {
      showToast("err", error.message || "Error al eliminar");
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
        </div>
      </div>
    );
  }

  const estadoInfo = ESTADOS_COTIZACION[cotizacion.estado] || ESTADOS_COTIZACION.BORRADOR;
  const puedeEditar = cotizacion.estado === "BORRADOR";
  const puedeEliminar = cotizacion.estado === "BORRADOR";
  const puedeEnviar = ["BORRADOR", "VISTA"].includes(cotizacion.estado);

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
              <h1 className="text-sm font-bold text-zinc-900 leading-none">{cotizacion.numero}</h1>
              <p className="text-[10px] text-zinc-400 mt-0.5 uppercase tracking-wider">
                {cotizacion.cliente}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {puedeEnviar && (
              <button
                onClick={handleEnviar}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
                Marcar como enviada
              </button>
            )}
            {puedeEditar && (
              <button
                onClick={() => router.push(`/cotizaciones/${params.id}/editar`)}
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
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Resumen */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Estado</p>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${estadoInfo.color}`}>
                {estadoInfo.label}
              </span>
            </div>
            <div>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Total</p>
              <p className="text-2xl font-bold text-zinc-900">{formatCOP(Number(cotizacion.total))}</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Fechas</p>
              <p className="text-sm text-zinc-600">
                Emisión: {new Date(cotizacion.fecha_emision).toLocaleDateString("es-PE")}
              </p>
              {cotizacion.fecha_validez && (
                <p className="text-sm text-zinc-600">
                  Validez: {new Date(cotizacion.fecha_validez).toLocaleDateString("es-PE")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Cliente */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider mb-4">Cliente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-zinc-400 mt-0.5" />
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
          <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider mb-4">Items</h2>
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
                {items.map((item, idx) => (
                  <tr key={item.id || idx} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                    <td className="p-3 text-zinc-400 text-center">{idx + 1}</td>
                    <td className="p-3 text-zinc-800">{item.descripcion}</td>
                    <td className="p-3 text-center text-zinc-800">{item.cantidad}</td>
                    <td className="p-3 text-center text-zinc-500">{item.unidad}</td>
                    <td className="p-3 text-right text-zinc-800">{formatCOP(item.precio_unitario)}</td>
                    <td className="p-3 text-right font-semibold text-zinc-900">{formatCOP(item.total)}</td>
                  </tr>
                ))}
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
                <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider mb-2">Condiciones</h2>
                <p className="text-sm text-zinc-600 whitespace-pre-wrap">{cotizacion.condiciones}</p>
              </div>
            )}
            {cotizacion.notas && (
              <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
                <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider mb-2">Notas</h2>
                <p className="text-sm text-zinc-600 whitespace-pre-wrap">{cotizacion.notas}</p>
              </div>
            )}
          </div>
        )}

        {/* Seguimiento */}
        {seguimiento.length > 0 && (
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider mb-4">Seguimiento</h2>
            <div className="space-y-3">
              {seguimiento.map((s, idx) => (
                <div key={s.id || idx} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4 text-zinc-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-800">{s.tipo}</p>
                    <p className="text-sm text-zinc-600">{s.descripcion}</p>
                    <p className="text-xs text-zinc-400 mt-1">
                      {new Date(s.fecha).toLocaleString("es-PE")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}