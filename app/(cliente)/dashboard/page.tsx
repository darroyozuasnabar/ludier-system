"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Building2,
  Calendar,
  Camera,
  Clock,
  Loader2,
  TrendingUp,
  MapPin,
  CalendarDays,
  DollarSign,
  Image,
  Flag,
  BarChart3,
  CheckCircle2,
  X,
} from "lucide-react";

// ─── Paleta / tokens ─────────────────────────────────────────────
// navy #14213D · navy-light #1E2E52 · gold #C8A46B · gold-soft #F1E7D3
// cream #FAF8F4 · ink #22262B · muted #8B8680 · sage #4C7A5E

// ─── Formateadores ──────────────────────────────────────────────
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

// ─── Encabezado de sección editorial ─────────────────────────────
function SectionLabel({ icon: Icon, label, meta }: { icon: any; label: string; meta?: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#F1E7D3] flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4 text-[#B08D4F]" />
        </div>
        <h3 className="text-lg font-serif text-[#22262B] tracking-tight">{label}</h3>
      </div>
      {meta && <span className="text-xs text-[#8B8680]">{meta}</span>}
    </div>
  );
}

// ─── Anillo de avance, elegante y sin fricción visual ────────────
function ProgressRing({ value }: { value: number }) {
  const [animated, setAnimated] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setAnimated(value);
      return;
    }
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimated(value * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(animated, 100) / 100) * circumference;

  return (
    <div className="relative w-[104px] h-[104px] shrink-0">
      <svg viewBox="0 0 104 104" className="w-full h-full -rotate-90">
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8CE9B" />
            <stop offset="100%" stopColor="#C8A46B" />
          </linearGradient>
        </defs>
        <circle cx="52" cy="52" r={radius} stroke="white" strokeOpacity={0.15} strokeWidth="6" fill="none" />
        <circle
          cx="52"
          cy="52"
          r={radius}
          stroke="url(#goldGradient)"
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="motion-safe:transition-[stroke-dashoffset] motion-safe:duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-serif text-white tabular-nums tracking-tight">
          {animated.toFixed(0)}%
        </span>
        <span className="text-[10px] uppercase tracking-[0.16em] text-white/50 mt-1">Avance</span>
      </div>
    </div>
  );
}

// ─── Lightbox de foto, con animación de entrada ──────────────────
function PhotoLightbox({ foto, onClose }: { foto: any; onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10 bg-[#14213D]/70 backdrop-blur-sm motion-safe:animate-[lightboxFade_0.25s_ease-out]"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 md:top-8 md:right-8 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
        aria-label="Cerrar"
      >
        <X className="h-5 w-5" />
      </button>

      <div
        className="relative max-w-4xl w-full max-h-[85vh] motion-safe:animate-[lightboxZoom_0.3s_cubic-bezier(0.16,1,0.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={foto.url}
          alt={foto.nombre}
          className="w-full h-full max-h-[85vh] object-contain rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]"
        />
        <div className="absolute left-0 right-0 bottom-0 rounded-b-2xl bg-gradient-to-t from-black/70 via-black/20 to-transparent p-5 flex items-center justify-between">
          <div>
            <p className="text-white font-medium">{foto.categoria}</p>
            <p className="text-white/60 text-xs mt-0.5">{formatDateDisplay(foto.fecha_subida)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Componente principal ──────────────────────────────────────
export default function ClienteDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFoto, setSelectedFoto] = useState<any>(null);

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
      fetchDashboard();
    }
  }, [status, session]);

  const fetchDashboard = async () => {
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
          <p className="text-sm text-[#8B8680]">Cargando tu proyecto…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F4]">
        <div className="text-center p-10 bg-white rounded-3xl shadow-[0_8px_40px_-12px_rgba(20,33,61,0.15)] max-w-sm">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-rose-700 font-medium">{error || "No se pudo cargar el dashboard"}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2.5 bg-[#14213D] text-white rounded-full text-sm font-medium hover:bg-[#1E2E52] transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const { project, hitos, fotos, valorizaciones, cronograma } = data;
  const avance = project?.avance || 0;

  // Próximo hito (no completado)
  const hitosNoCompletados = hitos?.filter((h: any) => h.badge !== "Completado") || [];
  const proximoHito = hitosNoCompletados?.[0] || null;

  // Última valorización
  const ultimaVal = project?.ultimaValorizacion || null;

  // Fotos de la semana
  const fotosSemana = fotos?.filter((f: any) => {
    const diff = (new Date().getTime() - new Date(f.fecha_subida).getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }) || [];

  const fotosPorCategoria = fotosSemana.reduce((acc: any, f: any) => {
    acc[f.categoria] = (acc[f.categoria] || 0) + 1;
    return acc;
  }, {});

  // ─── Render ──────────────────────────────────────────────────
  return (
    <div className="space-y-8 bg-[#FAF8F4]">
      {/* ============================================================
          TARJETA DE PROYECTO Y AVANCE
          ============================================================ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#14213D] via-[#1A2A4A] to-[#0F1830] rounded-[28px] shadow-[0_20px_60px_-20px_rgba(20,33,61,0.5)] p-8 md:p-10 text-white motion-safe:animate-[fadeIn_0.5s_ease-out]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C8A46B]/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#C8A46B] text-xs font-medium uppercase tracking-[0.14em]">
              <Building2 className="h-3.5 w-3.5" />
              <span>Proyecto</span>
            </div>
            <h1 className="text-3xl md:text-[2.6rem] font-serif tracking-tight leading-tight">
              {project?.name || "Proyecto"}
            </h1>
            <p className="text-white/60 text-base">Cliente: {project?.client || "—"}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/55 pt-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {project?.location || "Ubicación no especificada"}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Inicio: {formatDateDisplay(project?.startDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                Fin estimado: {formatDateDisplay(project?.expectedEndDate)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-white/[0.06] backdrop-blur-sm rounded-3xl px-7 py-5 border border-white/10 self-start md:self-auto">
            <ProgressRing value={avance} />
            <div className="hidden sm:block border-l border-white/15 pl-6">
              <p className="text-sm text-white/85 font-medium">Progreso financiero</p>
              <p className="text-xs text-white/45 mt-1 max-w-[150px] leading-relaxed">
                Basado en cobros vs. contratos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          GRID DE MÉTRICAS
          ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Próximo hito */}
        <div className="bg-white rounded-3xl shadow-[0_2px_20px_-8px_rgba(20,33,61,0.1)] p-6 hover:shadow-[0_8px_30px_-8px_rgba(200,164,107,0.35)] transition-shadow duration-300">
          <div className="w-9 h-9 rounded-full bg-[#F1E7D3] flex items-center justify-center mb-4">
            <Flag className="h-4 w-4 text-[#B08D4F]" />
          </div>
          <p className="text-xs uppercase tracking-[0.1em] text-[#8B8680] mb-2">Próximo hito</p>
          {proximoHito ? (
            <>
              <p className="text-base font-medium text-[#22262B]">{proximoHito.title}</p>
              <p className="text-sm text-[#8B8680] mt-0.5">{formatDateDisplay(proximoHito.fecha)}</p>
              <p className="text-xs text-[#B0ABA3] mt-2 line-clamp-2">{proximoHito.description}</p>
            </>
          ) : (
            <div className="flex items-center gap-2 text-[#8B8680]">
              <CheckCircle2 className="h-5 w-5 text-[#4C7A5E]" />
              <span>¡Todos completados!</span>
            </div>
          )}
        </div>

        {/* Última valorización */}
        <div className="bg-white rounded-3xl shadow-[0_2px_20px_-8px_rgba(20,33,61,0.1)] p-6 hover:shadow-[0_8px_30px_-8px_rgba(200,164,107,0.35)] transition-shadow duration-300">
          <div className="w-9 h-9 rounded-full bg-[#F1E7D3] flex items-center justify-center mb-4">
            <DollarSign className="h-4 w-4 text-[#B08D4F]" />
          </div>
          <p className="text-xs uppercase tracking-[0.1em] text-[#8B8680] mb-2">Última valorización</p>
          {ultimaVal ? (
            <>
              <p className="text-base font-medium text-[#22262B] truncate">
                {ultimaVal.period || "Sin período"}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span
                  className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium
                  ${ultimaVal.status === "COBRADA" ? "bg-[#E8F1EB] text-[#4C7A5E]" :
                    ultimaVal.status === "PENDIENTE" ? "bg-[#F1E7D3] text-[#B08D4F]" :
                    "bg-gray-100 text-gray-600"}`}
                >
                  {ultimaVal.status || "PENDIENTE"}
                </span>
                {ultimaVal.fechaCobro && (
                  <span className="text-xs text-[#B0ABA3]">
                    {formatDateDisplay(ultimaVal.fechaCobro)}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-[#22262B] mt-3 tabular-nums">
                {formatPEN(ultimaVal.totalFactura || 0)}
              </p>
            </>
          ) : (
            <p className="text-sm text-[#B0ABA3]">Sin valorizaciones</p>
          )}
        </div>

        {/* Fotos nuevas */}
        <div className="bg-white rounded-3xl shadow-[0_2px_20px_-8px_rgba(20,33,61,0.1)] p-6 hover:shadow-[0_8px_30px_-8px_rgba(200,164,107,0.35)] transition-shadow duration-300">
          <div className="w-9 h-9 rounded-full bg-[#F1E7D3] flex items-center justify-center mb-4">
            <Image className="h-4 w-4 text-[#B08D4F]" />
          </div>
          <p className="text-xs uppercase tracking-[0.1em] text-[#8B8680] mb-2">Fotos esta semana</p>
          <p className="text-3xl font-serif text-[#22262B] tabular-nums">{fotosSemana.length}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {Object.entries(fotosPorCategoria).map(([cat, count]) => (
              <span key={cat} className="text-xs bg-[#FAF8F4] px-2.5 py-1 rounded-full text-[#8B8680]">
                {String(count)} {cat}
              </span>
            ))}
            {fotosSemana.length === 0 && (
              <span className="text-xs text-[#B0ABA3]">Sin fotos recientes</span>
            )}
          </div>
        </div>

        {/* Estado del proyecto */}
        <div className="bg-white rounded-3xl shadow-[0_2px_20px_-8px_rgba(20,33,61,0.1)] p-6 hover:shadow-[0_8px_30px_-8px_rgba(200,164,107,0.35)] transition-shadow duration-300">
          <div className="w-9 h-9 rounded-full bg-[#F1E7D3] flex items-center justify-center mb-4">
            <BarChart3 className="h-4 w-4 text-[#B08D4F]" />
          </div>
          <p className="text-xs uppercase tracking-[0.1em] text-[#8B8680] mb-2">Estado</p>
          <p className="text-base font-medium text-[#22262B]">{project?.status || "ACTIVO"}</p>
          <p className="text-sm text-[#8B8680]">
            {avance < 30 ? "En etapa inicial" : avance < 70 ? "En ejecución" : "Avanzado"}
          </p>
          <p className="text-xs text-[#B0ABA3] mt-3">
            Actualizado: {new Date().toLocaleString("es-PE")}
          </p>
        </div>
      </div>

      {/* ============================================================
          GALERÍA DE FOTOS
          ============================================================ */}
      <div className="bg-white rounded-[28px] shadow-[0_2px_20px_-8px_rgba(20,33,61,0.1)] p-7">
        <SectionLabel icon={Camera} label="Galería de fotos" meta={`${fotos?.length || 0} fotos totales`} />
        {fotos && fotos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {fotos.slice(0, 8).map((foto: any) => (
              <div
                key={foto.id}
                onClick={() => setSelectedFoto(foto)}
                className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF8F4] group cursor-pointer ring-1 ring-black/5"
              >
                <img
                  src={foto.url}
                  alt={foto.nombre}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 ring-0 group-hover:ring-2 ring-inset ring-[#C8A46B] rounded-2xl transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <div>
                    <p className="text-xs text-white font-medium truncate">{foto.categoria}</p>
                    <p className="text-[10px] text-white/70">{formatDateDisplay(foto.fecha_subida)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-14 text-[#B0ABA3]">
            <Image className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No hay fotos disponibles</p>
          </div>
        )}
      </div>

      {/* ============================================================
          TABLA DE VALORIZACIONES
          ============================================================ */}
      <div className="bg-white rounded-[28px] shadow-[0_2px_20px_-8px_rgba(20,33,61,0.1)] p-7">
        <SectionLabel icon={DollarSign} label="Resumen de valorizaciones" />
        {valorizaciones && valorizaciones.length > 0 ? (
          <div className="overflow-x-auto -mx-3 px-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-[#8B8680] uppercase tracking-[0.08em] border-b border-[#F0EDE7]">
                  <th className="px-4 py-3 text-left font-medium">N.°</th>
                  <th className="px-4 py-3 text-left font-medium">Período</th>
                  <th className="px-4 py-3 text-left font-medium">Estado</th>
                  <th className="px-4 py-3 text-left font-medium">Fecha cobro</th>
                  <th className="px-4 py-3 text-right font-medium">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F3EF]">
                {valorizaciones.map((v: any, idx: number) => (
                  <tr key={v.id} className="transition-colors hover:bg-[#FAF8F4]">
                    <td className="px-4 py-3.5 font-medium text-[#22262B]">{v.numero ?? "—"}</td>
                    <td className="px-4 py-3.5 text-[#5B5750] max-w-xs truncate">{v.period || "—"}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium
                        ${v.status === "COBRADA" ? "bg-[#E8F1EB] text-[#4C7A5E]" :
                          v.status === "PENDIENTE" ? "bg-[#F1E7D3] text-[#B08D4F]" :
                          v.status === "VENCIDA" ? "bg-rose-50 text-rose-600" :
                          "bg-gray-100 text-gray-600"}`}
                      >
                        {v.status || "PENDIENTE"}
                      </span>
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

      {/* ============================================================
          LÍNEA DE TIEMPO – HITOS
          ============================================================ */}
      <div className="bg-white rounded-[28px] shadow-[0_2px_20px_-8px_rgba(20,33,61,0.1)] p-7">
        <SectionLabel icon={Clock} label="Línea de tiempo del proyecto" />
        {hitos && hitos.length > 0 ? (
          <div className="space-y-6">
            {hitos.map((hito: any, idx: number) => (
              <div key={hito.id} className="relative flex gap-4">
                {idx < hitos.length - 1 && (
                  <div className="absolute left-[11px] top-7 bottom-0 w-px bg-[#F0EDE7]" />
                )}
                <div
                  className="relative z-10 w-5 h-5 rounded-full border-2 border-white shadow-sm flex-shrink-0 mt-1"
                  style={{ backgroundColor: hito.badge_color || "#C8A46B" }}
                />
                <div className="flex-1 pb-6">
                  <p className="font-medium text-[#22262B]">{hito.title}</p>
                  <p className="text-sm text-[#8B8680] mt-0.5">{hito.description}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                    <span className="flex items-center gap-1 text-[#B0ABA3]">
                      <Calendar className="h-3 w-3" />
                      {formatDateDisplay(hito.fecha)}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium
                      ${hito.badge === "Completado" ? "bg-[#E8F1EB] text-[#4C7A5E]" :
                        hito.badge === "En progreso" ? "bg-[#F1E7D3] text-[#B08D4F]" :
                        "bg-gray-100 text-gray-600"}`}
                    >
                      {hito.badge}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-14 text-[#B0ABA3]">
            <Clock className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No hay hitos definidos</p>
          </div>
        )}
      </div>

      {/* ============================================================
          CRONOGRAMA
          ============================================================ */}
      <div className="bg-white rounded-[28px] shadow-[0_2px_20px_-8px_rgba(20,33,61,0.1)] p-7">
        <SectionLabel icon={TrendingUp} label="Cronograma del proyecto" />
        {cronograma && cronograma.length > 0 ? (
          <div className="space-y-5">
            {cronograma.map((item: any) => {
              const pct = item.porcentaje || 0;
              let barColor = "bg-gray-300";
              if (pct >= 100) barColor = "bg-[#4C7A5E]";
              else if (pct >= 50) barColor = "bg-[#14213D]";
              else if (pct > 0) barColor = "bg-[#C8A46B]";
              return (
                <div key={item.id}>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#22262B] font-medium">{item.title}</span>
                    <span className="text-[#22262B] font-medium tabular-nums">{pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#F0EDE7] rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full rounded-full motion-safe:transition-all motion-safe:duration-1000 ease-out ${barColor}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-14 text-[#B0ABA3]">
            <TrendingUp className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No hay cronograma definido</p>
          </div>
        )}
      </div>

      {/* ============================================================
          PIE DE PÁGINA
          ============================================================ */}
      <div className="text-center text-xs text-[#B0ABA3] pt-4 pb-2">
        Este panel es de uso exclusivo del cliente. Los datos son sensibles y confidenciales.
      </div>

      {selectedFoto && (
        <PhotoLightbox foto={selectedFoto} onClose={() => setSelectedFoto(null)} />
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lightboxFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes lightboxZoom {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}