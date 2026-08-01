// app/reportes/components/ReportAvance.tsx
"use client";

import { useState } from "react";

interface ValorizacionResumen {
  id: string;
  period: string;
  avancePct: number;
  netoCobrar: number;
  totalFactura: number;
  garantia: number;
  status: "PENDIENTE" | "COBRADO" | string;
  fechaEmision: string;
  fechaCobro?: string | null;
  facturaEmitidaSunat: boolean;
  facturaSerie?: string | null;
  facturaNumero?: string | null;
}

interface ContratoAvance {
  contratoId: string;
  contrato: string;
  total: number;
  cobrado: number;
  pendiente: number;
  garantiaRetenida: number;
  estado: "COBRADO" | "ACTIVO" | string;
  numValorizaciones: number;
  ultimaValorizacion: {
    avancePct: number;
    status: string;
    period: string;
    fechaEmision: string;
  } | null;
  valorizaciones?: ValorizacionResumen[]; // se cargan al expandir, si no vienen ya
}

interface ReportAvanceProps {
  data: ContratoAvance[];
  isAdmin: boolean;
}

const ESTADO_DOT: Record<string, string> = {
  COBRADO: "bg-emerald-500",
  ACTIVO: "bg-amber-500",
  PENDIENTE: "bg-amber-500",
};

const ESTADO_TEXT: Record<string, string> = {
  COBRADO: "text-emerald-700",
  ACTIVO: "text-amber-700",
  PENDIENTE: "text-amber-700",
};

const ESTADO_LABEL: Record<string, string> = {
  COBRADO: "Cobrado",
  ACTIVO: "Activo",
  PENDIENTE: "Pendiente",
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-90" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function ReportAvance({ data, isAdmin }: ReportAvanceProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-sm text-gray-500">
        No hay datos de avance de obra para este proyecto
      </div>
    );
  }

  const total = data.reduce((s, c) => s + c.total, 0);
  const cobrado = data.reduce((s, c) => s + c.cobrado, 0);
  const garantiaRetenida = data.reduce((s, c) => s + c.garantiaRetenida, 0);
  const avanceGeneral = total > 0 ? (cobrado / total) * 100 : 0;

  return (
    <div>
      {/* Resumen */}
      <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border border-gray-200 rounded-md mb-5">
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">
            {isAdmin ? "Total contratado" : "Contratos"}
          </p>
          <p className="text-lg font-semibold text-gray-900">
            {isAdmin
              ? `S/ ${total.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`
              : data.length}
          </p>
        </div>
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Cobrado</p>
          <p className="text-lg font-semibold text-gray-900">
            {isAdmin
              ? `S/ ${cobrado.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`
              : "—"}
          </p>
        </div>
        {isAdmin && (
          <div className="flex-1 px-4 py-3">
            <p className="text-xs text-gray-500 mb-0.5">Garantía retenida</p>
            <p className="text-lg font-semibold text-gray-900">
              S/ {garantiaRetenida.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
            </p>
          </div>
        )}
        <div className="flex-1 px-4 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Avance general</p>
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold text-gray-900">{avanceGeneral.toFixed(1)}%</p>
            <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden max-w-[80px]">
              <div
                className="h-full bg-gray-900 rounded-full"
                style={{ width: `${Math.min(avanceGeneral, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/60">
              <th className="w-8"></th>
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Contrato</th>
              {isAdmin && (
                <>
                  <th className="text-right py-2.5 px-3 font-medium text-gray-500">Total</th>
                  <th className="text-right py-2.5 px-3 font-medium text-gray-500">Cobrado</th>
                  <th className="text-right py-2.5 px-3 font-medium text-gray-500">Pendiente</th>
                </>
              )}
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Avance</th>
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Valorizaciones</th>
              <th className="text-left py-2.5 px-3 font-medium text-gray-500">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((c) => {
              const isOpen = expandedId === c.contratoId;
              const avance = c.ultimaValorizacion?.avancePct ?? 0;
              const pendiente = c.total - c.cobrado;

              return (
                <>
                  <tr
                    key={c.contratoId}
                    onClick={() => setExpandedId(isOpen ? null : c.contratoId)}
                    className="hover:bg-gray-50/60 transition-colors cursor-pointer"
                  >
                    <td className="pl-3">
                      <ChevronIcon open={isOpen} />
                    </td>
                    <td className="py-2.5 px-3 text-gray-900 font-medium">{c.contrato}</td>
                    {isAdmin && (
                      <>
                        <td className="py-2.5 px-3 text-right text-gray-700 tabular-nums">
                          S/ {c.total.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-gray-700 tabular-nums">
                          S/ {c.cobrado.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-gray-700 tabular-nums">
                          S/ {pendiente.toFixed(2)}
                        </td>
                      </>
                    )}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gray-800 rounded-full"
                            style={{ width: `${Math.min(avance, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 tabular-nums">
                          {avance.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-gray-500 text-xs">
                      {c.numValorizaciones}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium ${
                          ESTADO_TEXT[c.estado] ?? "text-gray-600"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            ESTADO_DOT[c.estado] ?? "bg-gray-400"
                          }`}
                        />
                        {ESTADO_LABEL[c.estado] ?? c.estado}
                      </span>
                    </td>
                  </tr>

                  {isOpen && (
                    <tr key={`${c.contratoId}-detail`}>
                      <td colSpan={isAdmin ? 8 : 5} className="bg-gray-50/40 px-4 py-3">
                        {!c.valorizaciones || c.valorizaciones.length === 0 ? (
                          <p className="text-xs text-gray-400 py-2">
                            Este contrato aún no tiene valorizaciones registradas
                          </p>
                        ) : (
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="text-gray-500">
                                <th className="text-left font-medium py-1.5 pr-3">Período</th>
                                <th className="text-left font-medium py-1.5 pr-3">Avance</th>
                                {isAdmin && (
                                  <th className="text-right font-medium py-1.5 pr-3">
                                    Neto a cobrar
                                  </th>
                                )}
                                {isAdmin && (
                                  <th className="text-right font-medium py-1.5 pr-3">Garantía</th>
                                )}
                                <th className="text-left font-medium py-1.5 pr-3">Emisión</th>
                                <th className="text-left font-medium py-1.5 pr-3">Cobro</th>
                                <th className="text-left font-medium py-1.5 pr-3">Factura SUNAT</th>
                                <th className="text-left font-medium py-1.5">Estado</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {c.valorizaciones.map((v) => (
                                <tr key={v.id}>
                                  <td className="py-1.5 pr-3 text-gray-700">{v.period}</td>
                                  <td className="py-1.5 pr-3 text-gray-700 tabular-nums">
                                    {v.avancePct.toFixed(1)}%
                                  </td>
                                  {isAdmin && (
                                    <td className="py-1.5 pr-3 text-right text-gray-700 tabular-nums">
                                      S/ {v.netoCobrar.toFixed(2)}
                                    </td>
                                  )}
                                  {isAdmin && (
                                    <td className="py-1.5 pr-3 text-right text-gray-700 tabular-nums">
                                      S/ {v.garantia.toFixed(2)}
                                    </td>
                                  )}
                                  <td className="py-1.5 pr-3 text-gray-500">
                                    {new Date(v.fechaEmision).toLocaleDateString("es-PE")}
                                  </td>
                                  <td className="py-1.5 pr-3 text-gray-500">
                                    {v.fechaCobro
                                      ? new Date(v.fechaCobro).toLocaleDateString("es-PE")
                                      : "—"}
                                  </td>
                                  <td className="py-1.5 pr-3">
                                    {v.facturaEmitidaSunat ? (
                                      <span className="text-emerald-700">
                                        {v.facturaSerie}-{v.facturaNumero}
                                      </span>
                                    ) : (
                                      <span className="text-gray-400">Sin emitir</span>
                                    )}
                                  </td>
                                  <td className="py-1.5">
                                    <span
                                      className={`inline-flex items-center gap-1 font-medium ${
                                        ESTADO_TEXT[v.status] ?? "text-gray-600"
                                      }`}
                                    >
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full ${
                                          ESTADO_DOT[v.status] ?? "bg-gray-400"
                                        }`}
                                      />
                                      {ESTADO_LABEL[v.status] ?? v.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}