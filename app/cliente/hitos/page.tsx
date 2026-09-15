"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Clock,
  Calendar,
  Loader2,
  CheckCircle2,
  Flag,
  TrendingUp,
} from "lucide-react";

const formatDateDisplay = (dateStr: string) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export default function ClienteHitosPage() {
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
          <p className="text-sm text-[#8B8680]">Cargando hitos…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-16">
        <p className="text-rose-700">{error || "No se pudieron cargar los hitos"}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-[#14213D] text-white rounded-full text-sm"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const { hitos, cronograma, project } = data;

  const hitosCompletados = hitos?.filter((h: any) => h.badge === "Completado").length || 0;
  const hitosTotal = hitos?.length || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#14213D] to-[#1E2E52] rounded-[28px] p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#C8A46B]/20 flex items-center justify-center">
            <Flag className="h-5 w-5 text-[#C8A46B]" />
          </div>
          <span className="text-xs uppercase tracking-[0.16em] text-[#C8A46B] font-medium">
            Hitos del proyecto
          </span>
        </div>
        <h1 className="text-3xl font-serif tracking-tight mb-2">
          {project?.name || "Proyecto"}
        </h1>
        <p className="text-white/60 text-sm">
          {hitosCompletados} de {hitosTotal} hitos completados
        </p>
      </div>

      {/* Progreso general */}
      <div className="bg-white rounded-[28px] shadow-sm p-7">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-serif text-[#22262B]">Progreso de hitos</h2>
          <span className="text-2xl font-bold text-[#22262B] tabular-nums">
            {hitosTotal > 0 ? Math.round((hitosCompletados / hitosTotal) * 100) : 0}%
          </span>
        </div>
        <div className="w-full h-3 bg-[#F0EDE7] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#C8A46B] to-[#B08D4F] rounded-full transition-all duration-1000"
            style={{
              width: `${hitosTotal > 0 ? (hitosCompletados / hitosTotal) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Línea de tiempo */}
      <div className="bg-white rounded-[28px] shadow-sm p-7">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-full bg-[#F1E7D3] flex items-center justify-center">
            <Clock className="h-4 w-4 text-[#B08D4F]" />
          </div>
          <h3 className="text-lg font-serif text-[#22262B]">Línea de tiempo</h3>
        </div>

        {hitos && hitos.length > 0 ? (
          <div className="space-y-6">
            {hitos.map((hito: any, idx: number) => {
              const isCompleted = hito.badge === "Completado";
              const isInProgress = hito.badge === "En progreso";

              return (
                <div key={hito.id} className="relative flex gap-4">
                  {idx < hitos.length - 1 && (
                    <div className="absolute left-[15px] top-9 bottom-0 w-px bg-[#F0EDE7]" />
                  )}
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full border-2 border-white shadow-sm flex-shrink-0 flex items-center justify-center ${
                      isCompleted
                        ? "bg-[#4C7A5E]"
                        : isInProgress
                          ? "bg-[#C8A46B]"
                          : "bg-gray-300"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    ) : isInProgress ? (
                      <TrendingUp className="h-4 w-4 text-white" />
                    ) : (
                      <Clock className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <p className="font-medium text-[#22262B]">{hito.title}</p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isCompleted
                            ? "bg-[#E8F1EB] text-[#4C7A5E]"
                            : isInProgress
                              ? "bg-[#F1E7D3] text-[#B08D4F]"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {hito.badge}
                      </span>
                    </div>
                    <p className="text-sm text-[#8B8680] mt-1">{hito.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-[#B0ABA3]">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDateDisplay(hito.fecha)}
                      </span>
                      {hito.porcentaje > 0 && (
                        <span className="font-medium text-[#4C7A5E]">
                          {hito.porcentaje}% completado
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-14 text-[#B0ABA3]">
            <Clock className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No hay hitos definidos</p>
          </div>
        )}
      </div>

      {/* Cronograma */}
      {cronograma && cronograma.length > 0 && (
        <div className="bg-white rounded-[28px] shadow-sm p-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-full bg-[#F1E7D3] flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-[#B08D4F]" />
            </div>
            <h3 className="text-lg font-serif text-[#22262B]">Cronograma</h3>
          </div>
          <div className="space-y-5">
            {cronograma.map((item: any) => {
              const pct = item.porcentaje || 0;
              let barColor = "bg-gray-300";
              if (pct >= 100) barColor = "bg-[#4C7A5E]";
              else if (pct >= 50) barColor = "bg-[#14213D]";
              else if (pct > 0) barColor = "bg-[#C8A46B]";
              return (
                <div key={item.id}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#22262B] font-medium">{item.title}</span>
                    <span className="text-[#22262B] font-medium tabular-nums">
                      {pct}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#F0EDE7] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}