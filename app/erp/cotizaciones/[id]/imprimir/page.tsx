"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Printer, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
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
  BORRADOR: { label: "Borrador", color: "text-gray-500" },
  ENVIADA: { label: "Enviada", color: "text-blue-600" },
  VISTA: { label: "Vista", color: "text-indigo-600" },
  APROBADA: { label: "Aprobada", color: "text-emerald-600" },
  RECHAZADA: { label: "Rechazada", color: "text-red-600" },
  EXPIRADA: { label: "Expirada", color: "text-amber-600" },
  CONVERTIDA_A_OBRA: { label: "Convertida a Obra", color: "text-purple-600" },
};

export default function ImprimirCotizacionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cotizacion, setCotizacion] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCotizacion = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/cotizaciones/${id}`);
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        setCotizacion(data.data);
      } catch (err: any) {
        setError(err.message || "Error al cargar la cotización");
      } finally {
        setLoading(false);
      }
    };
    loadCotizacion();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-300" />
      </div>
    );
  }

  if (error || !cotizacion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-sm text-zinc-600">{error || "Cotización no encontrada"}</p>
          <button
            onClick={() => router.push("/cotizaciones")}
            className="mt-4 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" /> Volver a cotizaciones
          </button>
        </div>
      </div>
    );
  }

  const estadoInfo = ESTADOS_COTIZACION[cotizacion.estado] || ESTADOS_COTIZACION.BORRADOR;
  const subtotal = cotizacion.items?.reduce((sum: number, item: any) => sum + Number(item.total || 0), 0) || 0;
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      {/* Barra de acción (no se imprime) */}
      <div className="bg-white border-b border-zinc-200 sticky top-0 z-10 print:hidden">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push(`/cotizaciones/${id}`)}
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" /> Volver
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <Printer className="h-4 w-4" /> Imprimir / PDF
          </button>
        </div>
      </div>

      {/* Contenido imprimible */}
      <div className="max-w-4xl mx-auto px-6 py-10 print:py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8 print:shadow-none print:border-0">
          {/* Encabezado */}
          <div className="flex justify-between items-start border-b border-zinc-200 pb-6 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">Cotización</h1>
              <p className="text-sm text-zinc-500 mt-1">N° {cotizacion.numero || "S/N"}</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-zinc-700">LUDIER</div>
              <div className="text-xs text-zinc-500">Construcciones Generales LUDIER</div>
              <div className="text-xs text-zinc-500">RUC: 20562348291</div>
              <div className="text-xs text-zinc-500">Lima, Perú</div>
            </div>
          </div>

          {/* Datos del cliente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Cliente</p>
              <p className="text-sm font-medium text-zinc-900">{cotizacion.cliente}</p>
              {cotizacion.cliente_ruc && (
                <p className="text-sm text-zinc-600">RUC: {cotizacion.cliente_ruc}</p>
              )}
              {cotizacion.cliente_direccion && (
                <p className="text-sm text-zinc-600">{cotizacion.cliente_direccion}</p>
              )}
            </div>
            <div className="text-right md:text-left">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Fechas</p>
              <p className="text-sm text-zinc-700">Emisión: {new Date(cotizacion.fecha_emision).toLocaleDateString("es-PE")}</p>
              {cotizacion.fecha_validez && (
                <p className="text-sm text-zinc-700">Validez: {new Date(cotizacion.fecha_validez).toLocaleDateString("es-PE")}</p>
              )}
              <p className="text-sm text-zinc-700">Estado: <span className={estadoInfo.color}>{estadoInfo.label}</span></p>
            </div>
          </div>

          {/* Items */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="text-left py-2 px-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Descripción</th>
                  <th className="text-right py-2 px-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Cant.</th>
                  <th className="text-right py-2 px-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Unidad</th>
                  <th className="text-right py-2 px-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider">P. Unit.</th>
                  <th className="text-right py-2 px-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Descuento</th>
                  <th className="text-right py-2 px-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody>
                {(cotizacion.items || []).map((item: any, idx: number) => (
                  <tr key={idx} className="border-b border-zinc-100">
                    <td className="py-2 px-1 text-zinc-800">{item.descripcion}</td>
                    <td className="py-2 px-1 text-right text-zinc-800">{item.cantidad}</td>
                    <td className="py-2 px-1 text-right text-zinc-500">{item.unidad || "-"}</td>
                    <td className="py-2 px-1 text-right text-zinc-800">{formatCOP(Number(item.precio_unitario))}</td>
                    <td className="py-2 px-1 text-right text-zinc-500">{item.descuento > 0 ? formatCOP(Number(item.descuento)) : "-"}</td>
                    <td className="py-2 px-1 text-right font-medium text-zinc-900">{formatCOP(Number(item.total))}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5} className="py-2 px-1 text-right font-medium text-zinc-700">Subtotal</td>
                  <td className="py-2 px-1 text-right font-medium text-zinc-900">{formatCOP(subtotal)}</td>
                </tr>
                <tr>
                  <td colSpan={5} className="py-2 px-1 text-right font-medium text-zinc-700">IGV (18%)</td>
                  <td className="py-2 px-1 text-right font-medium text-zinc-900">{formatCOP(igv)}</td>
                </tr>
                <tr className="border-t-2 border-zinc-300">
                  <td colSpan={5} className="py-3 px-1 text-right font-bold text-zinc-900 text-base">TOTAL</td>
                  <td className="py-3 px-1 text-right font-bold text-emerald-700 text-base">{formatCOP(total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Notas y condiciones */}
          {(cotizacion.condiciones || cotizacion.notas) && (
            <div className="border-t border-zinc-200 pt-4 mt-4 text-sm text-zinc-600">
              {cotizacion.condiciones && (
                <div className="mb-2">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Condiciones</p>
                  <p className="whitespace-pre-wrap">{cotizacion.condiciones}</p>
                </div>
              )}
              {cotizacion.notas && (
                <div>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Notas</p>
                  <p className="whitespace-pre-wrap">{cotizacion.notas}</p>
                </div>
              )}
            </div>
          )}

          {/* Pie de página */}
          <div className="border-t border-zinc-200 mt-6 pt-4 text-center text-xs text-zinc-400">
            Cotización generada automáticamente · LUDIER · {new Date().toLocaleString("es-PE")}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            margin: 0;
            padding: 0;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-0 {
            border: 0 !important;
          }
          .print\\:py-6 {
            padding-top: 1.5rem !important;
            padding-bottom: 1.5rem !important;
          }
          .no-print {
            display: none !important;
          }
          .bg-white {
            background: white !important;
          }
          .rounded-2xl {
            border-radius: 0 !important;
          }
          .border {
            border: 0 !important;
          }
          .shadow-sm {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}