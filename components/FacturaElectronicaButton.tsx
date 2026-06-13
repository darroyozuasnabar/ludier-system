"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle, Download, FileText } from "lucide-react";
import Swal from "sweetalert2";

const formatCOP = (value: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(value);

interface FacturaElectronicaButtonProps {
  valorizacion: {
    id: string;
    period: string;
    netoCobrar: number;
    costoDirecto: number;
    igv: number;
    totalFactura: number;
    factura_emitida_sunat: boolean;
    factura_serie?: string;
    factura_numero?: string;
    factura_pdf_url?: string;
    factura_xml_url?: string;
    projectId: string;
  };
  onSuccess: () => void;
}

export function FacturaElectronicaButton({ valorizacion, onSuccess }: FacturaElectronicaButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleEmitirFactura = async () => {
    const result = await Swal.fire({
      title: '¿Emitir factura electrónica?',
      html: `
        <div class="text-left">
          <p>Vas a emitir factura para:</p>
          <p class="font-bold text-gray-900 my-2">${valorizacion.period}</p>
          <p>Monto: <span class="font-bold">${formatCOP(valorizacion.netoCobrar)}</span></p>
          <hr class="my-3">
          <p class="text-sm text-amber-600">⚠️ La factura se enviará a SUNAT.</p>
          <p class="text-sm text-gray-500 mt-2">Se generará el XML y PDF automáticamente.</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, emitir factura',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    
    try {
      const response = await fetch('/api/factura/emitir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          valorizacionId: valorizacion.id,
          projectId: valorizacion.projectId,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        await Swal.fire({
          title: '¡Factura emitida!',
          html: `
            <div class="text-center">
              <p class="text-lg font-bold text-gray-900">${data.serie}-${data.numero}</p>
              <p class="text-sm text-gray-600 mt-1">Monto: ${formatCOP(data.total)}</p>
              <div class="flex gap-2 justify-center mt-4">
                <a href="${data.pdf_url}" target="_blank" class="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                  <FileText className="h-3.5 w-3.5" /> Ver PDF
                </a>
                <a href="${data.xml_url}" target="_blank" class="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700">
                  <Download className="h-3.5 w-3.5" /> XML
                </a>
              </div>
            </div>
          `,
          icon: 'success',
          confirmButtonColor: '#22c55e',
        });
        onSuccess();
      } else {
        throw new Error(data.message || "Error al emitir factura");
      }
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo emitir la factura. Intenta de nuevo.',
        icon: 'error',
        confirmButtonColor: '#dc2626',
      });
    } finally {
      setLoading(false);
    }
  };

  // Si ya tiene factura emitida, mostrar solo enlaces de descarga
  if (valorizacion.factura_emitida_sunat) {
    return (
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
          <CheckCircle className="h-3 w-3" />
          Factura emitida
        </span>
        {valorizacion.factura_pdf_url && (
          <a
            href={valorizacion.factura_pdf_url}
            target="_blank"
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
          >
            <FileText className="h-3 w-3" /> PDF
          </a>
        )}
        {valorizacion.factura_xml_url && (
          <a
            href={valorizacion.factura_xml_url}
            target="_blank"
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
          >
            <Download className="h-3 w-3" /> XML
          </a>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleEmitirFactura}
      disabled={loading}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Send className="h-3.5 w-3.5" />
      )}
      {loading ? "Emitiendo..." : "Emitir factura electrónica"}
    </button>
  );
}