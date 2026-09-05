"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    ChevronLeft,
    Plus,
    Trash2,
    Pencil,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ClipboardCheck,
    AlertTriangle,
    Clock,
    Users,
    Calendar,
    FileText,
    ChevronDown,
    ChevronUp,
    Save,
    X,
    Eye,
    Camera,
    Filter,
    Search,
    TrendingUp,
    Building2,
    Check,
    XCircle,
    Clock as ClockIcon,
    Flag,
    Upload,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import Swal from "sweetalert2";
import { FotoUploader } from "@/components/FotoUploader";

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

const TIPOS_OBSERVACION = [
    { key: "RETRABAJO", label: "Retrabajo", color: "red" },
    { key: "OBSERVACION", label: "Observación", color: "amber" },
    { key: "DEFECTO", label: "Defecto", color: "orange" },
    { key: "NO_CONFORMIDAD", label: "No conformidad", color: "violet" },
];

const PRIORIDADES = [
    { key: "BAJA", label: "Baja", color: "gray" },
    { key: "MEDIA", label: "Media", color: "blue" },
    { key: "ALTA", label: "Alta", color: "orange" },
    { key: "CRITICA", label: "Crítica", color: "red" },
];

const ESTADOS = [
    { key: "PENDIENTE", label: "Pendiente", color: "gray" },
    { key: "EN_PROCESO", label: "En proceso", color: "blue" },
    { key: "CORREGIDO", label: "Corregido", color: "amber" },
    { key: "VERIFICADO", label: "Verificado", color: "violet" },
    { key: "CERRADO", label: "Cerrado", color: "emerald" },
];

const badgeColors: Record<string, string> = {
    gray: "bg-gray-100 text-gray-700",
    blue: "bg-blue-100 text-blue-700",
    amber: "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
    red: "bg-red-100 text-red-700",
    violet: "bg-violet-100 text-violet-700",
    orange: "bg-orange-100 text-orange-700",
};

const ORIGENES = [
    { key: "PRODUCCION", label: "Producción" },
    { key: "INSTALACION", label: "Instalación" },
    { key: "PINTURA", label: "Pintura" },
    { key: "MATERIALES", label: "Materiales" },
    { key: "DISEÑO", label: "Diseño" },
    { key: "OTRO", label: "Otro" },
];

type ObservacionForm = {
    project_id: string;
    titulo: string;
    descripcion: string;
    tipo: string;
    prioridad: string;
    origen: string;
    responsable_id: string;
    verificador_id: string;
    fecha_deteccion: string;
    fecha_limite: string;
    costo_retrabajo: string;
    horas_retrabajo: string;
    observaciones: string;
    fotos: {
        problema: string[];
        correccion: string[];
        verificacion: string[];
    };
};

const FORM_VACIO: ObservacionForm = {
    project_id: "",
    titulo: "",
    descripcion: "",
    tipo: "OBSERVACION",
    prioridad: "MEDIA",
    origen: "PRODUCCION",
    responsable_id: "",
    verificador_id: "",
    fecha_deteccion: new Date().toISOString().split("T")[0],
    fecha_limite: "",
    costo_retrabajo: "",
    horas_retrabajo: "",
    observaciones: "",
    fotos: {
        problema: [],
        correccion: [],
        verificacion: [],
    },
};

export default function CalidadPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [observaciones, setObservaciones] = useState<any[]>([]);
    const [proyectos, setProyectos] = useState<any[]>([]);
    const [workers, setWorkers] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [form, setForm] = useState<ObservacionForm>(FORM_VACIO);
    const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
    const [filterEstado, setFilterEstado] = useState<string>("ALL");
    const [filterTipo, setFilterTipo] = useState<string>("ALL");
    const [filterPrioridad, setFilterPrioridad] = useState<string>("ALL");
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<"observaciones" | "checklist" | "reportes">("observaciones");

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
        if (status === "authenticated") loadData();
    }, [status]);

    const showToastMsg = (type: "ok" | "err", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 4000);
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const [obsRes, proyectosRes, workersRes] = await Promise.all([
                supabase
                    .from("ObservacionCalidad")
                    .select("*, Project(*), responsable:Worker!ObservacionCalidad_responsable_id_fkey(*), verificador:Worker!ObservacionCalidad_verificador_id_fkey(*)")
                    .order("fecha_deteccion", { ascending: false }),
                supabase.from("Project").select("*").in("status", ["ACTIVO", "EN_PRODUCCION"]).order("name"),
                supabase.from("Worker").select("*").eq("active", true).order("name"),
            ]);

            setObservaciones(obsRes.data || []);
            setProyectos(proyectosRes.data || []);
            setWorkers(workersRes.data || []);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!form.titulo.trim() || !form.descripcion.trim() || !form.project_id) {
            showToastMsg("err", "Completa título, descripción y proyecto");
            return;
        }

        setSaving(true);

        const payload = {
            project_id: form.project_id,
            titulo: form.titulo,
            descripcion: form.descripcion,
            tipo: form.tipo,
            prioridad: form.prioridad,
            origen: form.origen || null,
            responsable_id: form.responsable_id || null,
            verificador_id: form.verificador_id || null,
            fecha_deteccion: form.fecha_deteccion,
            fecha_limite: form.fecha_limite || null,
            costo_retrabajo: parseFloat(form.costo_retrabajo) || 0,
            horas_retrabajo: parseFloat(form.horas_retrabajo) || 0,
            observaciones: form.observaciones || null,
            estado: "PENDIENTE",
            fotos: form.fotos || { problema: [], correccion: [], verificacion: [] },
        };

        let error;
        if (editingId) {
            ({ error } = await supabase.from("ObservacionCalidad").update(payload).eq("id", editingId));
        } else {
            ({ error } = await supabase.from("ObservacionCalidad").insert(payload));
        }

        setSaving(false);
        if (error) {
            showToastMsg("err", "Error al guardar la observación");
            console.error(error);
        } else {
            showToastMsg("ok", editingId ? "Observación actualizada" : "Observación registrada correctamente");
            setForm(FORM_VACIO);
            setShowForm(false);
            setEditingId(null);
            loadData();
        }
    };

    const handleEdit = (obs: any) => {
        setForm({
            project_id: obs.project_id,
            titulo: obs.titulo,
            descripcion: obs.descripcion,
            tipo: obs.tipo,
            prioridad: obs.prioridad,
            origen: obs.origen || "",
            responsable_id: obs.responsable_id || "",
            verificador_id: obs.verificador_id || "",
            fecha_deteccion: obs.fecha_deteccion?.split("T")[0] || "",
            fecha_limite: obs.fecha_limite?.split("T")[0] || "",
            costo_retrabajo: String(obs.costo_retrabajo || ""),
            horas_retrabajo: String(obs.horas_retrabajo || ""),
            observaciones: obs.observaciones || "",
            fotos: obs.fotos || { problema: [], correccion: [], verificacion: [] },
        });
        setEditingId(obs.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: '¿Eliminar observación?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (!result.isConfirmed) return;

        await supabase.from("ObservacionCalidad").delete().eq("id", id);
        loadData();
        showToastMsg("ok", "Observación eliminada");
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        const updates: any = { estado: newStatus };
        if (newStatus === "CORREGIDO") {
            updates.fecha_correccion = new Date().toISOString().split("T")[0];
        } else if (newStatus === "VERIFICADO") {
            updates.fecha_verificacion = new Date().toISOString().split("T")[0];
        }

        await supabase.from("ObservacionCalidad").update(updates).eq("id", id);
        loadData();
    };

    const getStatusInfo = (status: string) => {
        return ESTADOS.find(e => e.key === status) || ESTADOS[0];
    };

    const getTipoInfo = (tipo: string) => {
        return TIPOS_OBSERVACION.find(t => t.key === tipo) || TIPOS_OBSERVACION[0];
    };

    const getPrioridadInfo = (prioridad: string) => {
        return PRIORIDADES.find(p => p.key === prioridad) || PRIORIDADES[0];
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    const observacionesFiltradas = observaciones.filter(obs => {
        if (filterEstado !== "ALL" && obs.estado !== filterEstado) return false;
        if (filterTipo !== "ALL" && obs.tipo !== filterTipo) return false;
        if (filterPrioridad !== "ALL" && obs.prioridad !== filterPrioridad) return false;
        if (searchTerm && !obs.titulo.toLowerCase().includes(searchTerm.toLowerCase()) && !obs.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    const totalObservaciones = observaciones.length;
    const pendientes = observaciones.filter(o => o.estado === "PENDIENTE" || o.estado === "EN_PROCESO").length;
    const criticas = observaciones.filter(o => o.prioridad === "CRITICA" && o.estado !== "CERRADO").length;
    const retrabajos = observaciones.filter(o => o.tipo === "RETRABAJO").length;

    return (
        <div className="min-h-screen bg-gray-50">
            {toast && (
                <div
                    className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${toast.type === "ok"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                        }`}
                >
                    {toast.type === "ok"
                        ? <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        : <AlertCircle className="h-4 w-4 text-red-600" />}
                    {toast.msg}
                </div>
            )}

            <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push("/erp/dashboard")}
                            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Dashboard
                        </button>
                        <div className="h-4 w-px bg-gray-200" />
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
                                <ClipboardCheck className="h-3.5 w-3.5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-sm font-bold text-gray-900 leading-none">Control de Calidad</h1>
                                <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">
                                    Observaciones · Retrabajos · Checklists
                                </p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setForm(FORM_VACIO);
                            setEditingId(null);
                            setShowForm(!showForm);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Nueva observación
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 pt-4">
                <div className="border-b border-gray-200 bg-white rounded-t-xl">
                    <div className="flex gap-1 px-4">
                        <button
                            onClick={() => setActiveTab("observaciones")}
                            className={`px-4 py-2.5 text-xs font-medium transition-all ${activeTab === "observaciones"
                                    ? "border-b-2 border-gray-900 text-gray-900"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            📋 Observaciones
                        </button>
                        <button
                            onClick={() => setActiveTab("checklist")}
                            className={`px-4 py-2.5 text-xs font-medium transition-all ${activeTab === "checklist"
                                    ? "border-b-2 border-gray-900 text-gray-900"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            ✅ Checklists
                        </button>
                        <button
                            onClick={() => setActiveTab("reportes")}
                            className={`px-4 py-2.5 text-xs font-medium transition-all ${activeTab === "reportes"
                                    ? "border-b-2 border-gray-900 text-gray-900"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            📊 Reportes
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <ClipboardCheck className="h-4 w-4 text-gray-400" />
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Total observaciones</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{totalObservaciones}</p>
                        <p className="text-xs text-gray-400 mt-1">{retrabajos} retrabajos</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Pendientes</p>
                        </div>
                        <p className="text-2xl font-bold text-amber-700">{pendientes}</p>
                        <p className="text-xs text-gray-400 mt-1">por atender</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-gray-400" />
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Críticas</p>
                        </div>
                        <p className="text-2xl font-bold text-red-700">{criticas}</p>
                        <p className="text-xs text-gray-400 mt-1">prioridad crítica</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="h-4 w-4 text-gray-400" />
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Cerradas</p>
                        </div>
                        <p className="text-2xl font-bold text-emerald-700">
                            {observaciones.filter(o => o.estado === "CERRADO").length}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">completadas</p>
                    </div>
                </div>

                {/* ── TAB: OBSERVACIONES ────────────────────────────────────── */}
                {activeTab === "observaciones" && (
                    <>
                        {/* Filtros */}
                        <div className="flex flex-wrap gap-2 items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                                <select
                                    value={filterEstado}
                                    onChange={(e) => setFilterEstado(e.target.value)}
                                    className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white text-gray-900"
                                >
                                    <option value="ALL">Todos los estados</option>
                                    {ESTADOS.map((e) => (
                                        <option key={e.key} value={e.key}>{e.label}</option>
                                    ))}
                                </select>
                                <select
                                    value={filterTipo}
                                    onChange={(e) => setFilterTipo(e.target.value)}
                                    className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white text-gray-900"
                                >
                                    <option value="ALL">Todos los tipos</option>
                                    {TIPOS_OBSERVACION.map((t) => (
                                        <option key={t.key} value={t.key}>{t.label}</option>
                                    ))}
                                </select>
                                <select
                                    value={filterPrioridad}
                                    onChange={(e) => setFilterPrioridad(e.target.value)}
                                    className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white text-gray-900"
                                >
                                    <option value="ALL">Todas las prioridades</option>
                                    {PRIORIDADES.map((p) => (
                                        <option key={p.key} value={p.key}>{p.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar observación..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-3 py-1.5 text-xs text-gray-900 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 w-64"
                                />
                            </div>
                        </div>

                        {/* Formulario */}
                        {showForm && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-sm font-semibold text-gray-900">
                                        {editingId ? "Editar observación" : "Nueva observación de calidad"}
                                    </h2>
                                    <button
                                        onClick={() => { setShowForm(false); setForm(FORM_VACIO); setEditingId(null); }}
                                        className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-medium text-gray-700 mb-1.5 block">Título *</label>
                                        <input
                                            type="text"
                                            placeholder="Ej: Desplome en baranda Torre A"
                                            value={form.titulo}
                                            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                                            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-medium text-gray-700 mb-1.5 block">Descripción *</label>
                                        <textarea
                                            rows={3}
                                            placeholder="Describe el problema encontrado..."
                                            value={form.descripcion}
                                            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                                            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 mb-1.5 block">Proyecto *</label>
                                        <select
                                            value={form.project_id}
                                            onChange={(e) => setForm({ ...form, project_id: e.target.value })}
                                            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                                        >
                                            <option value="">— Seleccionar —</option>
                                            {proyectos.map((p) => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 mb-1.5 block">Tipo</label>
                                        <select
                                            value={form.tipo}
                                            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                                            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                                        >
                                            {TIPOS_OBSERVACION.map((t) => (
                                                <option key={t.key} value={t.key}>{t.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 mb-1.5 block">Prioridad</label>
                                        <select
                                            value={form.prioridad}
                                            onChange={(e) => setForm({ ...form, prioridad: e.target.value })}
                                            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                                        >
                                            {PRIORIDADES.map((p) => (
                                                <option key={p.key} value={p.key}>{p.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 mb-1.5 block">Origen</label>
                                        <select
                                            value={form.origen}
                                            onChange={(e) => setForm({ ...form, origen: e.target.value })}
                                            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                                        >
                                            {ORIGENES.map((o) => (
                                                <option key={o.key} value={o.key}>{o.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 mb-1.5 block">Fecha de detección</label>
                                        <input
                                            type="date"
                                            value={form.fecha_deteccion}
                                            onChange={(e) => setForm({ ...form, fecha_deteccion: e.target.value })}
                                            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 mb-1.5 block">Fecha límite</label>
                                        <input
                                            type="date"
                                            value={form.fecha_limite}
                                            onChange={(e) => setForm({ ...form, fecha_limite: e.target.value })}
                                            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 mb-1.5 block">Responsable (corrección)</label>
                                        <select
                                            value={form.responsable_id}
                                            onChange={(e) => setForm({ ...form, responsable_id: e.target.value })}
                                            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                                        >
                                            <option value="">— Asignar responsable —</option>
                                            {workers.map((w) => (
                                                <option key={w.id} value={w.id}>{w.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 mb-1.5 block">Verificador</label>
                                        <select
                                            value={form.verificador_id}
                                            onChange={(e) => setForm({ ...form, verificador_id: e.target.value })}
                                            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                                        >
                                            <option value="">— Asignar verificador —</option>
                                            {workers.map((w) => (
                                                <option key={w.id} value={w.id}>{w.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 mb-1.5 block">Costo de retrabajo (S/)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={form.costo_retrabajo}
                                            onChange={(e) => setForm({ ...form, costo_retrabajo: e.target.value })}
                                            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 mb-1.5 block">Horas de retrabajo</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.5"
                                            placeholder="0.0"
                                            value={form.horas_retrabajo}
                                            onChange={(e) => setForm({ ...form, horas_retrabajo: e.target.value })}
                                            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-medium text-gray-700 mb-1.5 block">Observaciones adicionales</label>
                                        <textarea
                                            rows={2}
                                            value={form.observaciones}
                                            onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                                            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white resize-none"
                                            placeholder="Notas adicionales..."
                                        />
                                    </div>


                                    {/* Fotos - siempre visible */}
                                    <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                                        <p className="text-xs font-semibold text-gray-700 mb-3">📸 Evidencias fotográficas</p>
                                        <p className="text-xs text-amber-600 mb-2">
                                            {!editingId ? "💡 Guarda primero la observación para poder subir fotos" : "Sube fotos del problema, corrección y verificación"}
                                        </p>
                                        <FotoUploader
                                            observacionId={editingId || "temp"}
                                            fotos={form.fotos || { problema: [], correccion: [], verificacion: [] }}
                                            onFotosChange={(nuevasFotos) => setForm({ ...form, fotos: nuevasFotos })}
                                            disabled={saving || !editingId}
                                        />  
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                        {saving ? "Guardando..." : editingId ? "Actualizar" : "Guardar observación"}
                                    </button>
                                    <button
                                        onClick={() => { setShowForm(false); setForm(FORM_VACIO); setEditingId(null); }}
                                        className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Lista de observaciones */}
                        <div className="space-y-4">
                            {observacionesFiltradas.length === 0 ? (
                                <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
                                    <ClipboardCheck className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                                    <p className="text-sm text-gray-400">No hay observaciones registradas</p>
                                    <p className="text-xs text-gray-300 mt-1">Usa el botón "Nueva observación" para comenzar</p>
                                </div>
                            ) : (
                                observacionesFiltradas.map((obs) => {
                                    const isExpanded = expandedId === obs.id;
                                    const statusInfo = getStatusInfo(obs.estado);
                                    const tipoInfo = getTipoInfo(obs.tipo);
                                    const prioridadInfo = getPrioridadInfo(obs.prioridad);
                                    const proyecto = proyectos.find(p => p.id === obs.project_id);
                                    const responsable = workers.find(w => w.id === obs.responsable_id);
                                    const verificador = workers.find(w => w.id === obs.verificador_id);

                                    return (
                                        <div key={obs.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                            <div className="p-5">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap mb-2">
                                                            <h3 className="text-sm font-semibold text-gray-900">{obs.titulo}</h3>
                                                            <span className={`text-xs px-2 py-0.5 rounded-full ${badgeColors[statusInfo.color]}`}>
                                                                {statusInfo.label}
                                                            </span>
                                                            <span className={`text-xs px-2 py-0.5 rounded-full ${badgeColors[tipoInfo.color]}`}>
                                                                {tipoInfo.label}
                                                            </span>
                                                            <span className={`text-xs px-2 py-0.5 rounded-full ${badgeColors[prioridadInfo.color]}`}>
                                                                {prioridadInfo.label}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600">{obs.descripcion}</p>
                                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                                            <span>📅 {new Date(obs.fecha_deteccion).toLocaleDateString("es-PE")}</span>
                                                            {proyecto && <span>🏗️ {proyecto.name}</span>}
                                                            {responsable && <span>👤 Resp: {responsable.name}</span>}
                                                            {obs.costo_retrabajo > 0 && <span>💰 {formatCOP(obs.costo_retrabajo)}</span>}
                                                            {obs.horas_retrabajo > 0 && <span>⏱️ {obs.horas_retrabajo}h</span>}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 flex-shrink-0 ml-4">
                                                        <button
                                                            onClick={() => handleEdit(obs)}
                                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(obs.id)}
                                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setExpandedId(isExpanded ? null : obs.id)}
                                                            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                                        >
                                                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {isExpanded && (
                                                <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <p className="text-[10px] text-gray-400 uppercase">Origen</p>
                                                            <p className="text-sm text-gray-700">{obs.origen || "No especificado"}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-gray-400 uppercase">Responsable</p>
                                                            <p className="text-sm text-gray-700">{responsable?.name || "Sin asignar"}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-gray-400 uppercase">Verificador</p>
                                                            <p className="text-sm text-gray-700">{verificador?.name || "Sin asignar"}</p>
                                                        </div>
                                                        {obs.fecha_limite && (
                                                            <div>
                                                                <p className="text-[10px] text-gray-400 uppercase">Fecha límite</p>
                                                                <p className="text-sm text-gray-700">{new Date(obs.fecha_limite).toLocaleDateString("es-PE")}</p>
                                                            </div>
                                                        )}
                                                        {obs.fecha_correccion && (
                                                            <div>
                                                                <p className="text-[10px] text-gray-400 uppercase">Fecha corrección</p>
                                                                <p className="text-sm text-emerald-700">{new Date(obs.fecha_correccion).toLocaleDateString("es-PE")}</p>
                                                            </div>
                                                        )}
                                                        {obs.fecha_verificacion && (
                                                            <div>
                                                                <p className="text-[10px] text-gray-400 uppercase">Fecha verificación</p>
                                                                <p className="text-sm text-violet-700">{new Date(obs.fecha_verificacion).toLocaleDateString("es-PE")}</p>
                                                            </div>
                                                        )}
                                                        {obs.observaciones && (
                                                            <div className="md:col-span-3">
                                                                <p className="text-[10px] text-gray-400 uppercase">Observaciones</p>
                                                                <p className="text-sm text-gray-600">{obs.observaciones}</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Galería de fotos en el detalle expandido */}
                                                    {obs.fotos && (
                                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                                            <p className="text-xs font-medium text-gray-700 mb-2">📸 Evidencias</p>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                                {obs.fotos.problema?.map((url: string, idx: number) => (
                                                                    <div key={idx} className="relative">
                                                                        <img
                                                                            src={url}
                                                                            alt={`Problema ${idx + 1}`}
                                                                            className="w-full h-20 object-cover rounded-lg border border-red-200"
                                                                        />
                                                                        <span className="absolute bottom-1 left-1 text-[8px] bg-red-500 text-white px-1 rounded">Problema</span>
                                                                    </div>
                                                                ))}
                                                                {obs.fotos.correccion?.map((url: string, idx: number) => (
                                                                    <div key={idx} className="relative">
                                                                        <img
                                                                            src={url}
                                                                            alt={`Corrección ${idx + 1}`}
                                                                            className="w-full h-20 object-cover rounded-lg border border-green-200"
                                                                        />
                                                                        <span className="absolute bottom-1 left-1 text-[8px] bg-green-500 text-white px-1 rounded">Corrección</span>
                                                                    </div>
                                                                ))}
                                                                {obs.fotos.verificacion?.map((url: string, idx: number) => (
                                                                    <div key={idx} className="relative">
                                                                        <img
                                                                            src={url}
                                                                            alt={`Verificación ${idx + 1}`}
                                                                            className="w-full h-20 object-cover rounded-lg border border-blue-200"
                                                                        />
                                                                        <span className="absolute bottom-1 left-1 text-[8px] bg-blue-500 text-white px-1 rounded">Verificación</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                                        <p className="text-xs font-medium text-gray-500 mb-2">Cambiar estado:</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {ESTADOS.map((e) => (
                                                                <button
                                                                    key={e.key}
                                                                    onClick={() => handleUpdateStatus(obs.id, e.key)}
                                                                    className={`text-xs px-3 py-1.5 rounded-full transition-colors ${obs.estado === e.key
                                                                            ? `${badgeColors[e.color]} ring-2 ring-offset-1 ring-gray-300`
                                                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                                        }`}
                                                                >
                                                                    {e.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </>
                )}

                {/* ── TAB: CHECKLIST ────────────────────────────────────────── */}
                {activeTab === "checklist" && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm text-center py-12">
                        <ClipboardCheck className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700">Checklists en desarrollo</h3>
                        <p className="text-sm text-gray-400 mt-2">Próximamente: Gestión de checklists por producto</p>
                    </div>
                )}

                {/* ── TAB: REPORTES ─────────────────────────────────────────── */}
                {activeTab === "reportes" && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm text-center py-12">
                        <FileText className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700">Reportes de calidad</h3>
                        <p className="text-sm text-gray-400 mt-2">Próximamente: Reportes y estadísticas de calidad</p>
                    </div>
                )}
            </main>
        </div>
    );
}