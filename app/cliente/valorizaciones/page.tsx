"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  DollarSign,
  Loader2,
  TrendingUp,
  CheckCircle2,
  Clock,
  FileText,
} from "lucide-react";

const formatPEN = (value: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(value);

const formatDateDisplay = (dateStr: string) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function ClienteValorizacionesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/cliente/login");
      return;
    }
    if (status === "authenticated" && session?.user?.role !== "CLIENTE") {
      router.push("/dashboard");
      return;
    }
    if (status === "authenticated") {
      fetchData();
    }
  }, [status, session]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/cliente/dashboard");
      if (!res.ok) throw new Error("Error al cargar datos");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F4]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-9 w-9 animate-spin text-[#C8A46B]" />
          <p className="text-sm text-[#8B8680]">Cargando valorizaciones…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-16">
        <p className="text-rose-700">{error || "No se pudieron cargar las valorizaciones"}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-[#14213D] text-white rounded-full text-sm"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const { valorizaciones, project } = data;

  const totalValorizado = valorizaciones
    ?.filter((v: any) => v.status === "COBRADA")
    .reduce((sum: number, v: any) => sum + Number(v.totalFactura || 0), 0) || 0;

  const totalPendiente = valorizaciones
    ?.filter((v: any) => v.status !== "COBRADA")
    .reduce((sum: number, v: any) => sum + Number(v.totalFactura || 0), 0) || 0;

  const totalGeneral = totalValorizado + totalPendiente;

  const cobradas = valorizaciones?.filter((v: any) => v.status === "COBRADA").length || 0;
  const pendientes = valorizaciones?.filter((v: any) => v.status !== "COBRADA").length || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#14213D] to-[#1E2E52] rounded-[28px] p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#C8A46B]/20 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-[#C8A46B]" />
          </div>
          <span className="text-xs uppercase tracking-[0.16em] text-[#C8A46B] font-medium">
            Valorizaciones
          </span>
        </div>
        <h1 className="text-3xl font-serif tracking-tight mb-2">
          {project?.name || "Proyecto"}
        </h1>
        <p className="text-white/60 text-sm">
          Resumen de cobros y estados de facturación
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <div className="w-9 h-9 rounded-full bg-[#E8F1EB] flex items-center justify-center mb-4">
            <CheckCircle2 className="h-4 w-4 text-[#4C7A5E]" />
          </div>
          <p className="text-xs uppercase tracking-[0.1em] text-[#8B8680] mb-2">
            Total cobrado
          </p>
          <p className="text-2xl font-serif text-[#22262B] tabular-nums">
            {formatPEN(totalValorizado)}
          </p>
          <p className="text-xs text-[#B0ABA3] mt-1">
            {cobradas} valorizaciones
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6">
          <div className="w-9 h-9 rounded-full bg-[#F1E7D3] flex items-center justify-center mb-4">
            <Clock className="h-4 w-4 text-[#B08D4F]" />
          </div>
          <p className="text-xs uppercase tracking-[0.1em] text-[#8B8680] mb-2">
            Pendiente de cobro
          </p>
          <p className="text-2xl font-serif text-[#22262B] tabular-nums">
            {formatPEN(totalPendiente)}
          </p>
          <p className="text-xs text-[#B0ABA3] mt-1">
            {pendientes} valorizaciones
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6">
          <div className="w-9 h-9 rounded-full bg-[#E8F1EB] flex items-center justify-center mb-4">
            <TrendingUp className="h-4 w-4 text-[#4C7A5E]" />
          </div>
          <p className="text-xs uppercase tracking-[0.1em] text-[#8B8680] mb-2">
            Total general
          </p>
          <p className="text-2xl font-serif text-[#22262B] tabular-nums">
            {formatPEN(totalGeneral)}
          </p>
          <p className="text-xs text-[#B0ABA3] mt-1">
            {valorizaciones?.length || 0} registros
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6">
          <div className="w-9 h-9 rounded-full bg-[#F1E7D3] flex items-center justify-center mb-4">
            <FileText className="h-4 w-4 text-[#B08D4F]" />
          </div>
          <p className="text-xs uppercase tracking-[0.1em] text-[#8B8680] mb-2">
            Avance de cobro
          </p>
          <p className="text-2xl font-serif text-[#22262B] tabular-nums">
            {totalGeneral > 0 ? Math.round((totalValorizado / totalGeneral) * 100) : 0}%
          </p>
          <p className="text-xs text-[#B0ABA3] mt-1">
            del total valorizado
          </p>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-[28px] shadow-sm p-7">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-full bg-[#F1E7D3] flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-[#B08D4F]" />
          </div>
          <h3 className="text-lg font-serif text-[#22262B]">Detalle de valorizaciones</h3>
        </div>

        {valorizaciones && valorizaciones.length > 0 ? (
          <div className="overflow-x-auto -mx-3 px-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-[#8B8680] uppercase tracking-[0.08em] border-b border-[#F0EDE7]">
                  <th className="px-4 py-3 text-left font-medium">N.°</th>
                  <th className="px-4 py-3 text-left font-medium">Período</th>
                  <th className="px-4 py-3 text-left font-medium">Estado</th>
                  <th className="px-4 py-3 text-left font-medium">Emisión</th>
                  <th className="px-4 py-3 text-left font-medium">Cobro</th>
                  <th className="px-4 py-3 text-right font-medium">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F3EF]">
                {valorizaciones.map((v: any) => (
                  <tr key={v.id} className="transition-colors hover:bg-[#FAF8F4]">
                    <td className="px-4 py-3.5 font-medium text-[#22262B]">
                      {v.numero ?? "—"}
                    </td>
                    <td className="px-4 py-3.5 text-[#5B5750] max-w-xs truncate">
                      {v.period || "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${
                          v.status === "COBRADA"
                            ? "bg-[#E8F1EB] text-[#4C7A5E]"
                            : v.status === "FIRMADA"
                              ? "bg-[#F1E7D3] text-[#B08D4F]"
                              : v.status === "PENDIENTE"
                                ? "bg-[#F1E7D3] text-[#B08D4F]"
                                : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {v.status === "FIRMADA" ? "Próxima a cobrar" : (v.status || "PENDIENTE")}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[#8B8680]">
                      {formatDateDisplay(v.fechaEmision)}
                    </td>
                    <td className="px-4 py-3.5 text-[#8B8680]">
                      {v.fechaCobro ? formatDateDisplay(v.fechaCobro) : "—"}
                    </td>
                    <td className="px-4 py-3.5 text-right font-medium text-[#22262B] tabular-nums">
                      {formatPEN(v.totalFactura || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-14 text-[#B0ABA3]">
            <DollarSign className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No hay valorizaciones registradas</p>
          </div>
        )}
      </div>
    </div>
  );
}