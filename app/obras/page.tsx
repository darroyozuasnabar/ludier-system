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
  Building2,
  Calendar,
  Users,
  Clock,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Save,
  X,
  FileText,
  Receipt,
  HardHat,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import Swal from "sweetalert2";

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

// Estados de obra
const ESTADOS_OBRA = [
  { key: "COTIZACION", label: "Cotización", color: "gray" },
  { key: "EN_PRODUCCION", label: "En producción", color: "blue" },
  { key: "EN_INSTALACION", label: "En instalación", color: "amber" },
  { key: "PAUSADO", label: "Pausado", color: "red" },
  { key: "COMPLETADO", label: "Completado", color: "emerald" },
];

const badgeColors: Record<string, string> = {
  gray: "bg-gray-100 text-gray-700",
  blue: "bg-blue-100 text-blue-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
  emerald: "bg-emerald-100 text-emerald-700",
};

type ObraForm = {
  name: string;
  client: string;
  clientType: string;
  valorization: string;
  status: string;
  startDate: string;
  expectedEndDate: string;
  location: string;
  description: string;
};

const FORM_VACIO: ObraForm = {
  name: "",
  client: "",
  clientType: "INMOBILIARIA",
  valorization: "",
  status: "COTIZACION",
  startDate: new Date().toISOString().split("T")[0],
  expectedEndDate: "",
  location: "",
  description: "",
};

export default function ObrasPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [obras, setObras] = useState<any[]>([]);
  const [contratos, setContratos] = useState<any[]>([]);
  const [proyectosMap, setProyectosMap] = useState<Record<string, any>>({});
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState<ObraForm>(FORM_VACIO);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") loadData();
  }, [status]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Obtener todos los contratos de la BD
      const { data: contratosData } = await supabase
        .from("Contrato")
        .select("*")
        .order("fecha", { ascending: false });
      setContratos(contratosData || []);

      // 2. Obtener los IDs de proyectos únicos de los contratos
      const projectIds = [...new Set(contratosData?.map(c => c.project_id).filter(Boolean) || [])];
      
      // 3. Obtener los proyectos (obras) desde la tabla Project
      const { data: projectsData } = await supabase
        .from("Project")
        .select("*")
        .in("id", projectIds.length ? projectIds : [""]);
      
      const projectsMap: Record<string, any> = {};
      projectsData?.forEach(p => { projectsMap[p.id] = p; });
      setProyectosMap(projectsMap);

      // 4. Construir la lista de obras (proyectos + contratos agrupados)
      const obrasList = (projectsData || []).map(project => ({
        ...project,
        contratos: contratosData?.filter(c => c.project_id === project.id) || [],
        totalContratos: contratosData?.filter(c => c.project_id === project.id).reduce((sum, c) => sum + Number(c.monto), 0) || 0,
        contratosCobrados: contratosData?.filter(c => c.project_id === project.id && c.estado === "COBRADO").length || 0,
        contratosPendientes: contratosData?.filter(c => c.project_id === project.id && c.estado === "PENDIENTE").length || 0,
      }));
      
      setObras(obrasList);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const showToastMsg = (type: "ok" | "err", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.client.trim()) {
      showToastMsg("err", "Completa el nombre de la obra y el cliente.");
      return;
    }

    setSaving(true);

    const payload = {
      name: form.name,
      client: form.client,
      clientType: form.clientType,
      valorization: parseFloat(form.valorization) || 0,
      status: form.status,
      startDate: form.startDate,
      expectedEndDate: form.expectedEndDate || null,
      location: form.location || null,
      description: form.description || null,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase
        .from("Project")
        .update(payload)
        .eq("id", editingId));
    } else {
      ({ error } = await supabase.from("Project").insert(payload));
    }

    setSaving(false);
    if (error) {
      showToastMsg("err", "Error al guardar. Intenta de nuevo.");
    } else {
      showToastMsg("ok", editingId ? "Obra actualizada." : "Obra creada correctamente.");
      setForm(FORM_VACIO);
      setShowForm(false);
      setEditingId(null);
      loadData();
    }
  };

  const handleEdit = (obra: any) => {
    setForm({
      name: obra.name,
      client: obra.client,
      clientType: obra.clientType || "INMOBILIARIA",
      valorization: String(obra.valorization),
      status: obra.status,
      startDate: obra.startDate?.split("T")[0] || "",
      expectedEndDate: obra.expectedEndDate?.split("T")[0] || "",
      location: obra.location || "",
      description: obra.description || "",
    });
    setEditingId(obra.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string, name: string) => {
    // SweetAlert de confirmación
    const result = await Swal.fire({
      title: '¿Eliminar obra?',
      html: `Estás por eliminar <strong>${name}</strong>.<br>Se perderán los datos asociados (contratos, trabajos, costos).`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setSaving(true);
    
    try {
      // Primero eliminar los contratos asociados
      const { error: contratosError } = await supabase
        .from("Contrato")
        .delete()
        .eq("project_id", id);
      
      if (contratosError) throw contratosError;

      // Luego eliminar la obra
      const { error: projectError } = await supabase
        .from("Project")
        .delete()
        .eq("id", id);
      
      if (projectError) throw projectError;

      await Swal.fire({
        title: '¡Eliminada!',
        text: 'La obra ha sido eliminada correctamente.',
        icon: 'success',
        confirmButtonColor: '#10b981',
        timer: 2000,
        showConfirmButton: true,
      });
      
      loadData();
    } catch (error: any) {
      console.error("Error deleting:", error);
      
      await Swal.fire({
        title: 'No se puede eliminar',
        html: 'Esta obra tiene <strong>costos registrados</strong> u otros datos asociados.<br>Primero elimina los costos y luego la obra.',
        icon: 'error',
        confirmButtonColor: '#dc2626',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    await supabase.from("Project").update({ status: newStatus }).eq("id", id);
    loadData();
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const totalContratosGeneral = contratos.reduce((sum, c) => sum + Number(c.monto), 0);
  const totalCobradoGeneral = contratos.filter(c => c.estado === "COBRADO").reduce((sum, c) => sum + Number(c.monto), 0);
  const obrasActivas = obras.filter(o => o.status !== "COMPLETADO").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
            toast.type === "ok"
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

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Dashboard
            </button>
            <div className="h-4 w-px bg-gray-200" />
            <div>
              <h1 className="text-base font-bold text-gray-900">Gestión de Obras</h1>
              <p className="text-xs text-gray-500">Proyectos activos y su seguimiento</p>
            </div>
          </div>
          <button
            onClick={() => {
              setForm(FORM_VACIO);
              setEditingId(null);
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nueva obra
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Formulario nueva / editar obra */}
        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 mb-5">
              {editingId ? "Editar obra" : "Nueva obra"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                  Nombre de la obra *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Qantua - Fase 02"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                  Cliente *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Desarrollo Plaza Grau S.A.C."
                  value={form.client}
                  onChange={(e) => setForm({ ...form, client: e.target.value })}
                  className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                  Tipo de cliente
                </label>
                <select
                  value={form.clientType}
                  onChange={(e) => setForm({ ...form, clientType: e.target.value })}
                  className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                >
                  <option value="INMOBILIARIA">Inmobiliaria</option>
                  <option value="CONSTRUCTORA">Constructora</option>
                  <option value="CORPORATIVO">Corporativo</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                  Valorización total (S/)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">S/</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={form.valorization}
                    onChange={(e) => setForm({ ...form, valorization: e.target.value })}
                    className="w-full pl-8 pr-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">Estado</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                >
                  {ESTADOS_OBRA.map((e) => (
                    <option key={e.key} value={e.key}>{e.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">Fecha de inicio</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">Fecha fin estimada</label>
                <input
                  type="date"
                  value={form.expectedEndDate}
                  onChange={(e) => setForm({ ...form, expectedEndDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">Ubicación</label>
                <input
                  type="text"
                  placeholder="Ej: Cercado de Lima"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">Descripción</label>
                <textarea
                  rows={3}
                  placeholder="Detalles del proyecto..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Guardando..." : editingId ? "Actualizar" : "Crear obra"}
              </button>
              <button
                onClick={() => { setShowForm(false); setEditingId(null); setForm(FORM_VACIO); }}
                className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-4 w-4 text-gray-400" />
              <p className="text-xs text-gray-400 uppercase tracking-wider">Obras activas</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{obrasActivas}</p>
            <p className="text-xs text-gray-400 mt-1">de {obras.length} totales</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Receipt className="h-4 w-4 text-gray-400" />
              <p className="text-xs text-gray-400 uppercase tracking-wider">Contratos</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{contratos.length}</p>
            <p className="text-xs text-gray-400 mt-1">{contratos.filter(c => c.estado === "COBRADO").length} cobrados</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              <p className="text-xs text-gray-400 uppercase tracking-wider">Facturación total</p>
            </div>
            <p className="text-2xl font-bold text-emerald-700">{formatCOP(totalCobradoGeneral)}</p>
            <p className="text-xs text-gray-400 mt-1">cobrado de {formatCOP(totalContratosGeneral)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-gray-400" />
              <p className="text-xs text-gray-400 uppercase tracking-wider">Clientes</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {new Set(obras.map(o => o.client).filter(Boolean)).size}
            </p>
            <p className="text-xs text-gray-400 mt-1">corporativos</p>
          </div>
        </div>

        {/* Lista de obras */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">
            Obras y proyectos ({obras.length})
          </h2>

          {obras.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
              <Building2 className="h-12 w-12 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No hay obras registradas aún.</p>
              <p className="text-xs text-gray-300 mt-1">
                Crea la primera con el botón "Nueva obra".
              </p>
            </div>
          ) : (
            obras.map((obra) => {
              const estadoInfo = ESTADOS_OBRA.find((e) => e.key === obra.status) || ESTADOS_OBRA[0];
              const isExpanded = expandedId === obra.id;
              const valorization = Number(obra.valorization);

              return (
                <div key={obra.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* Cabecera */}
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                          <HardHat className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-semibold text-gray-900">{obra.name}</h3>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeColors[estadoInfo.color]}`}>
                              {estadoInfo.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{obra.client}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            📍 {obra.location || "Ubicación no especificada"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-base font-bold text-gray-900">{formatCOP(valorization)}</p>
                          {obra.contratos?.length > 0 && (
                            <p className="text-xs text-gray-400">{obra.contratos.length} contratos asociados</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(obra)}
                            className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(obra.id, obra.name)}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : obra.id)}
                            className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Detalle expandible */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-[10px] text-gray-400 flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> Inicio
                            </p>
                            <p className="text-sm font-medium">
                              {obra.startDate ? new Date(obra.startDate).toLocaleDateString("es-PE") : "No definida"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> Fin estimado
                            </p>
                            <p className="text-sm font-medium">
                              {obra.expectedEndDate 
                                ? new Date(obra.expectedEndDate).toLocaleDateString("es-PE")
                                : "No definida"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 flex items-center gap-1">
                              <Receipt className="h-3 w-3" /> Contratos
                            </p>
                            <p className="text-sm font-medium">
                              {obra.contratosCobrados || 0} cobrados · {obra.contratosPendientes || 0} pendientes
                            </p>
                          </div>
                        </div>

                        {obra.description && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <p className="text-xs text-gray-500">{obra.description}</p>
                          </div>
                        )}

                        {/* Contratos asociados a esta obra */}
                        {obra.contratos && obra.contratos.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs font-semibold text-gray-700 mb-2">Contratos de este proyecto:</p>
                            <div className="space-y-1.5 max-h-48 overflow-y-auto">
                              {obra.contratos.map((c: any) => (
                                <div key={c.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <FileText className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                    <span className="text-gray-700 truncate">{c.nombre}</span>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className="font-medium text-gray-900">{formatCOP(Number(c.monto))}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                      c.estado === "COBRADO" 
                                        ? "bg-emerald-100 text-emerald-700" 
                                        : "bg-amber-100 text-amber-700"
                                    }`}>
                                      {c.estado === "COBRADO" ? "Cobrado" : "Pendiente"}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between text-sm font-semibold">
                              <span className="text-gray-600">Total contratos</span>
                              <span className="text-gray-900">{formatCOP(obra.totalContratos || 0)}</span>
                            </div>
                          </div>
                        )}

                        {/* Cambiar estado */}
                        <div className="mt-4">
                          <p className="text-xs font-medium text-gray-500 mb-2">Cambiar estado:</p>
                          <div className="flex flex-wrap gap-2">
                            {ESTADOS_OBRA.map((e) => (
                              <button
                                key={e.key}
                                onClick={() => handleUpdateStatus(obra.id, e.key)}
                                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                                  obra.status === e.key
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
                </div>
              );
            })
          )}
        </div>

      </main>
    </div>
  );
}