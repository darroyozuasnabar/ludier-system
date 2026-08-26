"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    ChevronLeft,
    Bell,
    BellOff,
    CheckCircle2,
    AlertCircle,
    Loader2,
    X,
    Clock,
    TrendingUp,
    AlertTriangle,
    Info,
    Check,
    Filter,
    Settings,
    Calendar,
    Users,
    Package,
    Building2,
    Zap,
    Flame,
    MessageSquare,
    Eye,
    EyeOff,
    Trash2,
    RefreshCw,
    Play,
    Sparkles,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Configuración de tipos de notificación
const TIPOS_NOTIFICACION = [
    { key: "INFO", label: "Información", icon: Info, color: "blue", bg: "bg-blue-50", border: "border-blue-200" },
    { key: "ALERTA", label: "Alerta", icon: AlertTriangle, color: "amber", bg: "bg-amber-50", border: "border-amber-200" },
    { key: "URGENTE", label: "Urgente", icon: Flame, color: "red", bg: "bg-red-50", border: "border-red-200" },
    { key: "EXITO", label: "Éxito", icon: CheckCircle2, color: "emerald", bg: "bg-emerald-50", border: "border-emerald-200" },
    { key: "ADVERTENCIA", label: "Advertencia", icon: AlertCircle, color: "orange", bg: "bg-orange-50", border: "border-orange-200" },
];

const CATEGORIAS = [
    { key: "PRODUCCION", label: "Producción", icon: Zap },
    { key: "OBRA", label: "Obra", icon: Building2 },
    { key: "COMPRAS", label: "Compras", icon: Package },
    { key: "PERSONAL", label: "Personal", icon: Users },
    { key: "FINANZAS", label: "Finanzas", icon: TrendingUp },
    { key: "SISTEMA", label: "Sistema", icon: Settings },
];

const getTipoInfo = (tipo: string) => TIPOS_NOTIFICACION.find(t => t.key === tipo) || TIPOS_NOTIFICACION[0];
const getCategoriaInfo = (categoria: string) => CATEGORIAS.find(c => c.key === categoria) || CATEGORIAS[0];

function KpiCard({ icon: Icon, label, value, sub, accent }: any) {
    return (
        <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent ?? "bg-zinc-50"}`}>
                    <Icon className="h-4 w-4 text-zinc-600" />
                </div>
                <span className="text-2xl font-bold text-zinc-900">{value}</span>
            </div>
            <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest mt-2">{label}</p>
            {sub && <p className="text-xs text-zinc-400 mt-0.5">{sub}</p>}
        </div>
    );
}

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
    return (
        <div className="mb-4">
            <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider">{children}</h2>
            {sub && <p className="text-xs text-zinc-400 mt-0.5">{sub}</p>}
        </div>
    );
}

function Toast({ type, msg, onClose }: { type: "ok" | "err"; msg: string; onClose: () => void }) {
    return (
        <div
            className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium border backdrop-blur-sm ${type === "ok"
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

export default function AlertasPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [generando, setGenerando] = useState(false);
    const [notificaciones, setNotificaciones] = useState<any[]>([]);
    const [noLeidas, setNoLeidas] = useState(0);
    const [filterTipo, setFilterTipo] = useState<string>("ALL");
    const [filterCategoria, setFilterCategoria] = useState<string>("ALL");
    const [filterLeidas, setFilterLeidas] = useState<string>("ALL");
    const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
    const [ultimaGeneracion, setUltimaGeneracion] = useState<string | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
        if (status === "authenticated") {
            loadNotificaciones();
            cargarNoLeidas();
        }
    }, [status]);

    const showToast = (type: "ok" | "err", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 4000);
    };

    const loadNotificaciones = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("Notificacion")
                .select("*")
                .order("fecha_creacion", { ascending: false });

            if (error) throw error;
            setNotificaciones(data || []);
        } catch (error) {
            console.error("Error cargando notificaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    const cargarNoLeidas = async () => {
        try {
            const { count, error } = await supabase
                .from("Notificacion")
                .select("*", { count: "exact", head: true })
                .eq("leida", false);

            if (!error && count !== null) {
                setNoLeidas(count);
            }
        } catch (error) {
            console.error("Error contando no leídas:", error);
        }
    };

    const marcarComoLeida = async (id: string) => {
        try {
            const { error } = await supabase
                .from("Notificacion")
                .update({ leida: true, fecha_lectura: new Date().toISOString() })
                .eq("id", id);

            if (error) throw error;

            setNotificaciones(prev =>
                prev.map(n => n.id === id ? { ...n, leida: true, fecha_lectura: new Date().toISOString() } : n)
            );
            setNoLeidas(prev => Math.max(0, prev - 1));
            showToast("ok", "Notificación marcada como leída");
        } catch (error) {
            console.error("Error marcando como leída:", error);
            showToast("err", "Error al marcar como leída");
        }
    };

    const marcarTodasComoLeidas = async () => {
        try {
            const { error } = await supabase
                .from("Notificacion")
                .update({ leida: true, fecha_lectura: new Date().toISOString() })
                .eq("leida", false);

            if (error) throw error;

            setNotificaciones(prev =>
                prev.map(n => ({ ...n, leida: true, fecha_lectura: new Date().toISOString() }))
            );
            setNoLeidas(0);
            showToast("ok", "Todas las notificaciones marcadas como leídas");
        } catch (error) {
            console.error("Error marcando todas como leídas:", error);
            showToast("err", "Error al marcar todas como leídas");
        }
    };

    const eliminarNotificacion = async (id: string) => {
        if (!confirm("¿Eliminar esta notificación?")) return;
        try {
            const { error } = await supabase
                .from("Notificacion")
                .delete()
                .eq("id", id);

            if (error) throw error;

            setNotificaciones(prev => prev.filter(n => n.id !== id));
            showToast("ok", "Notificación eliminada");
        } catch (error) {
            console.error("Error eliminando notificación:", error);
            showToast("err", "Error al eliminar");
        }
    };

    // 🔥 NUEVA FUNCIÓN: Generar alertas automáticas
    const generarAlertasAutomaticas = async () => {
        setGenerando(true);
        try {
            const response = await fetch('/api/alertas?action=generar', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Error al generar alertas');
            }

            showToast("ok", `${data.alertas_generadas || 0} alertas generadas automáticamente`);
            setUltimaGeneracion(new Date().toLocaleString());

            // Recargar notificaciones
            await loadNotificaciones();
            await cargarNoLeidas();
        } catch (error: any) {
            console.error("Error generando alertas:", error);
            showToast("err", error.message || "Error al generar alertas");
        } finally {
            setGenerando(false);
        }
    };

    // 🔥 NUEVA FUNCIÓN: Crear notificación de prueba manual
    const crearNotificacionPrueba = async () => {
        try {
            const response = await fetch('/api/alertas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    titulo: '🧪 Notificación de prueba',
                    mensaje: 'Esta es una notificación generada manualmente para probar el sistema. El sistema de alertas funciona correctamente.',
                    tipo: 'EXITO',
                    categoria: 'SISTEMA',
                    enlace: '/alertas',
                }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Error al crear notificación');
            }

            showToast("ok", "Notificación de prueba creada correctamente");
            await loadNotificaciones();
            await cargarNoLeidas();
        } catch (error: any) {
            console.error("Error creando notificación de prueba:", error);
            showToast("err", error.message || "Error al crear notificación");
        }
    };

    // Filtros
    const notificacionesFiltradas = notificaciones.filter(n => {
        if (filterTipo !== "ALL" && n.tipo !== filterTipo) return false;
        if (filterCategoria !== "ALL" && n.categoria !== filterCategoria) return false;
        if (filterLeidas === "LEIDAS" && !n.leida) return false;
        if (filterLeidas === "NO_LEIDAS" && n.leida) return false;
        return true;
    });

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
                <Loader2 className="h-7 w-7 animate-spin text-zinc-300" />
            </div>
        );
    }

    const urgentes = notificaciones.filter(n => n.tipo === "URGENTE" && !n.leida).length;

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
                            onClick={() => router.push("/dashboard")}
                            className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-700 text-sm transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Dashboard
                        </button>
                        <div className="h-4 w-px bg-zinc-200" />
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center relative">
                                <Bell className="h-3.5 w-3.5 text-white" />
                                {noLeidas > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                                        {noLeidas}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h1 className="text-sm font-bold text-zinc-900 leading-none">Notificaciones y Alertas</h1>
                                <p className="text-[10px] text-zinc-400 mt-0.5 uppercase tracking-wider">
                                    Centro de comunicaciones · LUDIER
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* 🔥 NUEVO: Botón generar alertas automáticas */}
                        <button
                            onClick={generarAlertasAutomaticas}
                            disabled={generando}
                            className="flex items-center gap-2 px-3 py-1.5 bg-violet-50 text-violet-700 text-xs font-medium rounded-lg hover:bg-violet-100 transition-colors disabled:opacity-50"
                        >
                            {generando ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <Sparkles className="h-3.5 w-3.5" />
                            )}
                            {generando ? "Generando..." : "Generar alertas"}
                        </button>

                        {/* 🔥 NUEVO: Botón notificación de prueba */}
                        <button
                            onClick={crearNotificacionPrueba}
                            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg hover:bg-emerald-100 transition-colors"
                        >
                            <Play className="h-3.5 w-3.5" />
                            Prueba
                        </button>

                        <button
                            onClick={marcarTodasComoLeidas}
                            disabled={noLeidas === 0}
                            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 text-zinc-700 text-xs font-medium rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
                        >
                            <Check className="h-3.5 w-3.5" />
                            Leer todas
                        </button>
                        <button
                            onClick={loadNotificaciones}
                            className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                            title="Actualizar"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                {/* 🔥 NUEVO: Info de última generación */}
                {ultimaGeneracion && (
                    <div className="max-w-7xl mx-auto px-6 pb-2">
                        <p className="text-[10px] text-zinc-400">
                            Última generación automática: {ultimaGeneracion}
                        </p>
                    </div>
                )}
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* KPIs */}
                <section>
                    <SectionTitle sub="Resumen de comunicaciones">Visión ejecutiva</SectionTitle>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <KpiCard
                            icon={Bell}
                            label="Total"
                            value={notificaciones.length}
                            sub="notificaciones registradas"
                            accent="bg-zinc-50"
                        />
                        <KpiCard
                            icon={Eye}
                            label="No leídas"
                            value={noLeidas}
                            sub="pendientes de revisión"
                            accent={noLeidas > 0 ? "bg-blue-50" : "bg-zinc-50"}
                        />
                        <KpiCard
                            icon={Flame}
                            label="Urgentes"
                            value={urgentes}
                            sub="requieren atención inmediata"
                            accent={urgentes > 0 ? "bg-red-50" : "bg-zinc-50"}
                        />
                        <KpiCard
                            icon={CheckCircle2}
                            label="Leídas"
                            value={notificaciones.length - noLeidas}
                            sub="revisadas"
                            accent="bg-emerald-50"
                        />
                    </div>
                </section>

                {/* Filtros */}
                <section className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-zinc-400" />
                            <span className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Filtros</span>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <select
                                value={filterTipo}
                                onChange={(e) => setFilterTipo(e.target.value)}
                                className="px-3 py-1.5 text-xs border border-zinc-200 rounded-lg bg-white text-zinc-700"
                            >
                                <option value="ALL">Todos los tipos</option>
                                {TIPOS_NOTIFICACION.map(t => (
                                    <option key={t.key} value={t.key}>{t.label}</option>
                                ))}
                            </select>
                            <select
                                value={filterCategoria}
                                onChange={(e) => setFilterCategoria(e.target.value)}
                                className="px-3 py-1.5 text-xs border border-zinc-200 rounded-lg bg-white text-zinc-700"
                            >
                                <option value="ALL">Todas las categorías</option>
                                {CATEGORIAS.map(c => (
                                    <option key={c.key} value={c.key}>{c.label}</option>
                                ))}
                            </select>
                            <select
                                value={filterLeidas}
                                onChange={(e) => setFilterLeidas(e.target.value)}
                                className="px-3 py-1.5 text-xs border border-zinc-200 rounded-lg bg-white text-zinc-700"
                            >
                                <option value="ALL">Todas</option>
                                <option value="NO_LEIDAS">No leídas</option>
                                <option value="LEIDAS">Leídas</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Lista de Notificaciones */}
                <section>
                    <SectionTitle sub={`${notificacionesFiltradas.length} de ${notificaciones.length} notificaciones`}>
                        Centro de notificaciones
                    </SectionTitle>

                    {notificacionesFiltradas.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-zinc-100 p-16 text-center">
                            <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center mx-auto mb-4">
                                <BellOff className="h-7 w-7 text-zinc-200" />
                            </div>
                            <p className="text-sm text-zinc-400">No hay notificaciones</p>
                            <p className="text-xs text-zinc-300 mt-1">
                                {filterTipo !== "ALL" || filterCategoria !== "ALL"
                                    ? "Prueba con otros filtros"
                                    : "Usa 'Generar alertas' para crear notificaciones automáticas"}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {notificacionesFiltradas.map((notif) => {
                                const tipoInfo = getTipoInfo(notif.tipo);
                                const catInfo = getCategoriaInfo(notif.categoria);
                                const Icon = tipoInfo.icon;
                                const CatIcon = catInfo.icon;

                                return (
                                    <div
                                        key={notif.id}
                                        className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${notif.leida
                                                ? "border-zinc-100 opacity-70"
                                                : "border-zinc-200 hover:border-zinc-300"
                                            }`}
                                    >
                                        <div className="p-5">
                                            <div className="flex items-start gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tipoInfo.bg}`}>
                                                    <Icon className={`h-5 w-5 text-${tipoInfo.color}-600`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <h3 className="text-sm font-bold text-zinc-900">{notif.titulo}</h3>
                                                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tipoInfo.bg} border ${tipoInfo.border} text-zinc-900`}>
                                                                    {tipoInfo.label}
                                                                </span>
                                                                <span className="text-[10px] text-zinc-700 flex items-center gap-1 font-medium">
                                                                    <CatIcon className="h-3 w-3 text-zinc-500" />
                                                                    {catInfo.label}
                                                                </span>
                                                                {!notif.leida && (
                                                                    <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                                        Nuevo
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-zinc-600 mt-1">{notif.mensaje}</p>
                                                            <div className="flex items-center gap-3 mt-2 text-[10px] text-zinc-400">
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="h-3 w-3" />
                                                                    {new Date(notif.fecha_creacion).toLocaleString("es-PE", {
                                                                        day: "2-digit",
                                                                        month: "short",
                                                                        hour: "2-digit",
                                                                        minute: "2-digit"
                                                                    })}
                                                                </span>
                                                                {notif.enlace && (
                                                                    <a
                                                                        href={notif.enlace}
                                                                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                                                                    >
                                                                        Ver detalles →
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-0.5 shrink-0">
                                                            {!notif.leida && (
                                                                <button
                                                                    onClick={() => marcarComoLeida(notif.id)}
                                                                    className="p-1.5 text-blue-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                                                    title="Marcar como leída"
                                                                >
                                                                    <Check className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => eliminarNotificacion(notif.id)}
                                                                className="p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Eliminar"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}