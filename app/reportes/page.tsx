"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  AlertTriangle,
  Calendar,
  FileText,
  Download,
  Printer,
  RefreshCw,
  Filter,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── CONFIGURACIÓN DE REPORTES ────────────────────────────────────────────

const REPORTS_BY_ROLE: Record<string, any[]> = {
  FUNDADOR: [
    { id: "avance", label: "📈 Avance de Obra", icon: TrendingUp },
    { id: "produccion", label: "🏗️ Producción", icon: BarChart3 },
    { id: "contratos", label: "📄 Contratos", icon: FileText },
    { id: "personal", label: "👷 Personal", icon: Users },
    { id: "alertas", label: "⚠️ Alertas", icon: AlertTriangle },
  ],
  ADMIN: [
    { id: "avance", label: "📈 Avance de Obra", icon: TrendingUp },
    { id: "produccion", label: "🏗️ Producción", icon: BarChart3 },
    { id: "contratos", label: "📄 Contratos", icon: FileText },
    { id: "personal", label: "👷 Personal", icon: Users },
    { id: "alertas", label: "⚠️ Alertas", icon: AlertTriangle },
  ],
  FIELD_ENGINEER: [
    { id: "avance", label: "📈 Avance de Obra", icon: TrendingUp },
    { id: "produccion", label: "🏗️ Producción", icon: BarChart3 },
    { id: "personal", label: "👷 Personal", icon: Users },
    { id: "alertas", label: "⚠️ Alertas", icon: AlertTriangle },
  ],
  PRODUCTION: [
    { id: "produccion", label: "🏗️ Producción", icon: BarChart3 },
    { id: "alertas", label: "⚠️ Alertas", icon: AlertTriangle },
  ],
};

// ─── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────

export default function ReportesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = session?.user?.role || "VIEWER";
  const isAdmin = role === "FUNDADOR" || role === "ADMIN";

  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState("avance");
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [periodo, setPeriodo] = useState("mes");
  const [formatoExport, setFormatoExport] = useState("csv");
  const [reportData, setReportData] = useState<any>(null);
  const [generated, setGenerated] = useState(false);

  const availableReports = REPORTS_BY_ROLE[role] || [];

  // ─── CARGAR PROYECTOS ──────────────────────────────────────────────────

  useEffect(() => {
    if (status === "authenticated") {
      loadProjects();
    }
  }, [status]);

  const loadProjects = async () => {
    const { data } = await supabase.from("Project").select("id, name").order("name");
    setProjects(data || []);
    if (data && data.length > 0) {
      setSelectedProject(data[0].id);
    }
  };

  // ─── GENERAR REPORTE ───────────────────────────────────────────────────

  const handleGenerarReporte = async () => {
    setLoading(true);
    setGenerated(false);
    try {
      let data: any = null;
      const projectId = selectedProject;

      switch (selectedReport) {
        case "avance":
          data = await loadAvanceObra(projectId);
          break;
        case "produccion":
          data = await loadProduccion(projectId);
          break;
        case "contratos":
          data = await loadContratos(projectId);
          break;
        case "personal":
          data = await loadPersonal(projectId);
          break;
        case "alertas":
          data = await loadAlertas(projectId);
          break;
      }
      setReportData(data);
      setGenerated(true);
    } catch (error) {
      console.error("Error loading report:", error);
    } finally {
      setLoading(false);
    }
  };

  // ─── FUNCIONES DE CARGA DE DATOS ──────────────────────────────────────

  const loadAvanceObra = async (projectId: string) => {
    const { data: contratos } = await supabase
      .from("Contrato")
      .select("id, nombre, monto, estado")
      .eq("project_id", projectId);

    const { data: valorizaciones } = await supabase
      .from("Valorizacion")
      .select("contrato_id, totalFactura, netoCobrar, status")
      .eq("projectId", projectId);

    return contratos?.map(c => {
      const vals = valorizaciones?.filter(v => v.contrato_id === c.id) || [];
      const cobrado = vals.filter(v => v.status === "COBRADO").reduce((s, v) => s + Number(v.netoCobrar), 0);
      const pendiente = vals.filter(v => v.status !== "COBRADO").reduce((s, v) => s + Number(v.netoCobrar), 0);
      return {
        ...c,
        cobrado,
        pendiente,
        total: Number(c.monto),
        avance: Number(c.monto) > 0 ? (cobrado / Number(c.monto)) * 100 : 0,
      };
    }) || [];
  };

  const loadProduccion = async (projectId: string) => {
    const { data } = await supabase
      .from("OrdenProduccion")
      .select("nombre, tipo, cantidad, estado, base_completada, acabado_completado")
      .eq("project_id", projectId);
    return data || [];
  };

  const loadContratos = async (projectId: string) => {
    const { data } = await supabase
      .from("Contrato")
      .select("nombre, monto, fecha, estado, tipo")
      .eq("project_id", projectId)
      .order("fecha", { ascending: false });
    return data || [];
  };

  const loadPersonal = async (projectId: string) => {
    const { data: workers } = await supabase
      .from("Worker")
      .select("name, role, location, active, tarifa_diaria")
      .order("name");
    return { workers: workers || [] };
  };

  const loadAlertas = async (projectId: string) => {
    const { data } = await supabase
      .from("Alert")
      .select("title, description, priority, status, createdAt")
      .eq("projectId", projectId)
      .order("priority", { ascending: false });
    return data || [];
  };

  // ─── EXPORTAR ──────────────────────────────────────────────────────────

  const handleExportar = () => {
    if (!reportData || !generated) return;

    if (formatoExport === "csv") {
      const headers = Object.keys(reportData[0] || {}).join(",");
      const rows = reportData.map((r: any) => Object.values(r).join(","));
      const csv = [headers, ...rows].join("\n");
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedReport}_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (formatoExport === "pdf") {
      alert("📄 Exportación a PDF (próximamente)");
    }
  };

  // ─── RENDER ────────────────────────────────────────────────────────────

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* ─── HEADER ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📊 Reportes</h1>
            <p className="text-sm text-gray-500">Selecciona filtros y genera reportes personalizados</p>
          </div>
          <div className="flex items-center gap-3">
            {generated && reportData && reportData.length > 0 && (
              <>
                <select
                  value={formatoExport}
                  onChange={(e) => setFormatoExport(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-900"
                >
                  <option value="csv">📄 CSV</option>
                  <option value="pdf">📄 PDF (próximamente)</option>
                </select>
                <button
                  onClick={handleExportar}
                  className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Exportar
                </button>
              </>
            )}
          </div>
        </div>

        {/* ─── FILTROS ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Proyecto */}
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">
                Proyecto
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-900"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Tipo de reporte */}
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">
                Reporte
              </label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-900"
              >
                {availableReports.map((r) => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* Período */}
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">
                Período
              </label>
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-900"
              >
                <option value="mes">📅 Mes actual</option>
                <option value="mes_pasado">📅 Mes pasado</option>
                <option value="trimestre">📅 Último trimestre</option>
                <option value="anio">📅 Último año</option>
                <option value="custom">📅 Personalizado</option>
              </select>
            </div>

            {/* Botón generar */}
            <div className="flex items-end">
              <button
                onClick={handleGenerarReporte}
                disabled={loading}
                className="w-full px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {loading ? "Generando..." : "Generar Reporte"}
              </button>
            </div>
          </div>
        </div>

        {/* ─── RESULTADOS ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Generando reporte...</p>
            </div>
          ) : !generated ? (
            <div className="p-12 text-center">
              <Filter className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Selecciona los filtros y haz clic en "Generar Reporte"</p>
              <p className="text-xs text-gray-400 mt-1">Los datos se mostrarán aquí</p>
            </div>
          ) : !reportData || (Array.isArray(reportData) && reportData.length === 0) ? (
            <div className="p-12 text-center">
              <p className="text-gray-500">No hay datos disponibles para este reporte</p>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {availableReports.find(r => r.id === selectedReport)?.label}
                  <span className="text-sm font-normal text-gray-400 ml-2">
                    ({reportData.length} registros)
                  </span>
                </h2>
                <span className="text-xs text-gray-400">
                  Generado: {new Date().toLocaleString("es-PE")}
                </span>
              </div>

              {selectedReport === "avance" && (
                <AvanceObraTable data={reportData} isAdmin={isAdmin} />
              )}
              {selectedReport === "produccion" && (
                <ProduccionTable data={reportData} />
              )}
              {selectedReport === "contratos" && (
                <ContratosTable data={reportData} />
              )}
              {selectedReport === "personal" && (
                <PersonalTable data={reportData} isAdmin={isAdmin} />
              )}
              {selectedReport === "alertas" && (
                <AlertasTable data={reportData} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── TABLAS DE REPORTES ────────────────────────────────────────────────────

function AvanceObraTable({ data, isAdmin }: { data: any[]; isAdmin: boolean }) {
  const total = data.reduce((s, c) => s + c.total, 0);
  const cobrado = data.reduce((s, c) => s + c.cobrado, 0);

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-500">Total contratos</p>
          <p className="text-xl font-bold text-gray-900">S/ {total.toFixed(2)}</p>
        </div>
        <div className="bg-emerald-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-500">Cobrado</p>
          <p className="text-xl font-bold text-emerald-700">S/ {cobrado.toFixed(2)}</p>
        </div>
        <div className="bg-amber-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-500">Avance</p>
          <p className="text-xl font-bold text-amber-700">{total > 0 ? ((cobrado / total) * 100).toFixed(1) : 0}%</p>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left py-2 px-3 font-medium text-gray-600">Contrato</th>
            <th className="text-right py-2 px-3 font-medium text-gray-600">Total</th>
            <th className="text-right py-2 px-3 font-medium text-gray-600">Cobrado</th>
            <th className="text-right py-2 px-3 font-medium text-gray-600">Pendiente</th>
            <th className="text-center py-2 px-3 font-medium text-gray-600">Avance</th>
            <th className="text-center py-2 px-3 font-medium text-gray-600">Estado</th>
          </tr>
        </thead>
        <tbody>
          {data.map((c, i) => (
            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="py-2 px-3 text-gray-800">{c.nombre}</td>
              <td className="py-2 px-3 text-right font-medium">S/ {c.total.toFixed(2)}</td>
              <td className="py-2 px-3 text-right text-emerald-700">S/ {c.cobrado.toFixed(2)}</td>
              <td className="py-2 px-3 text-right text-amber-700">S/ {c.pendiente.toFixed(2)}</td>
              <td className="py-2 px-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-800 rounded-full" style={{ width: `${Math.min(c.avance, 100)}%` }} />
                  </div>
                  <span className="text-xs font-medium">{c.avance.toFixed(0)}%</span>
                </div>
              </td>
              <td className="py-2 px-3 text-center">
                <span className={`text-xs px-2 py-0.5 rounded-full ${c.estado === "COBRADO" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                  {c.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProduccionTable({ data }: { data: any[] }) {
  const total = data.reduce((s, o) => s + Number(o.cantidad), 0);
  const completados = data.filter(o => o.estado === "COMPLETADO").length;

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-500">Total órdenes</p>
          <p className="text-xl font-bold text-gray-900">{data.length}</p>
        </div>
        <div className="bg-emerald-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-500">Completadas</p>
          <p className="text-xl font-bold text-emerald-700">{completados}</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-500">Unidades totales</p>
          <p className="text-xl font-bold text-blue-700">{total}</p>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left py-2 px-3 font-medium text-gray-600">Orden</th>
            <th className="text-center py-2 px-3 font-medium text-gray-600">Tipo</th>
            <th className="text-right py-2 px-3 font-medium text-gray-600">Cantidad</th>
            <th className="text-center py-2 px-3 font-medium text-gray-600">Base</th>
            <th className="text-center py-2 px-3 font-medium text-gray-600">Acabado</th>
            <th className="text-center py-2 px-3 font-medium text-gray-600">Estado</th>
          </tr>
        </thead>
        <tbody>
          {data.map((o, i) => (
            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="py-2 px-3 text-gray-800">{o.nombre}</td>
              <td className="py-2 px-3 text-center text-xs text-gray-500">{o.tipo}</td>
              <td className="py-2 px-3 text-right font-medium">{o.cantidad}</td>
              <td className="py-2 px-3 text-center">{o.base_completada ? "✅" : "❌"}</td>
              <td className="py-2 px-3 text-center">{o.acabado_completado ? "✅" : "❌"}</td>
              <td className="py-2 px-3 text-center">
                <span className={`text-xs px-2 py-0.5 rounded-full ${o.estado === "COMPLETADO" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                  {o.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ContratosTable({ data }: { data: any[] }) {
  const total = data.reduce((s, c) => s + Number(c.monto), 0);

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 bg-gray-50 p-3 rounded-lg text-center">
        <p className="text-xs text-gray-500">Total contratos</p>
        <p className="text-xl font-bold text-gray-900">S/ {total.toFixed(2)}</p>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left py-2 px-3 font-medium text-gray-600">Contrato</th>
            <th className="text-right py-2 px-3 font-medium text-gray-600">Monto</th>
            <th className="text-center py-2 px-3 font-medium text-gray-600">Fecha</th>
            <th className="text-center py-2 px-3 font-medium text-gray-600">Tipo</th>
            <th className="text-center py-2 px-3 font-medium text-gray-600">Estado</th>
          </tr>
        </thead>
        <tbody>
          {data.map((c, i) => (
            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="py-2 px-3 text-gray-800">{c.nombre}</td>
              <td className="py-2 px-3 text-right font-medium">S/ {Number(c.monto).toFixed(2)}</td>
              <td className="py-2 px-3 text-center text-gray-500">{new Date(c.fecha).toLocaleDateString("es-PE")}</td>
              <td className="py-2 px-3 text-center text-xs text-gray-500">{c.tipo}</td>
              <td className="py-2 px-3 text-center">
                <span className={`text-xs px-2 py-0.5 rounded-full ${c.estado === "COBRADO" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                  {c.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PersonalTable({ data, isAdmin }: { data: any; isAdmin: boolean }) {
  const workers = data.workers || [];
  const active = workers.filter((w: any) => w.active).length;

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-500">Total trabajadores</p>
          <p className="text-xl font-bold text-gray-900">{workers.length}</p>
        </div>
        <div className="bg-emerald-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-500">Activos</p>
          <p className="text-xl font-bold text-emerald-700">{active}</p>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left py-2 px-3 font-medium text-gray-600">Nombre</th>
            <th className="text-center py-2 px-3 font-medium text-gray-600">Rol</th>
            <th className="text-center py-2 px-3 font-medium text-gray-600">Ubicación</th>
            {isAdmin && <th className="text-center py-2 px-3 font-medium text-gray-600">Tarifa</th>}
            <th className="text-center py-2 px-3 font-medium text-gray-600">Estado</th>
          </tr>
        </thead>
        <tbody>
          {workers.map((w: any, i: number) => (
            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="py-2 px-3 text-gray-800">{w.name}</td>
              <td className="py-2 px-3 text-center text-gray-500">{w.role}</td>
              <td className="py-2 px-3 text-center text-gray-500">{w.location}</td>
              {isAdmin && (
                <td className="py-2 px-3 text-center font-medium">S/ {Number(w.tarifa_diaria).toFixed(2)}</td>
              )}
              <td className="py-2 px-3 text-center">
                <span className={`text-xs px-2 py-0.5 rounded-full ${w.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                  {w.active ? "Activo" : "Inactivo"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AlertasTable({ data }: { data: any[] }) {
  const urgentes = data.filter(a => a.priority === "ALTA").length;

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-500">Total alertas</p>
          <p className="text-xl font-bold text-gray-900">{data.length}</p>
        </div>
        <div className="bg-red-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-500">Urgentes</p>
          <p className="text-xl font-bold text-red-700">{urgentes}</p>
        </div>
      </div>
      <div className="space-y-2">
        {data.map((a, i) => (
          <div key={i} className={`p-3 rounded-lg border ${a.priority === "ALTA" ? "border-red-200 bg-red-50" : "border-gray-100 bg-gray-50"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{a.title}</p>
                <p className="text-sm text-gray-600">{a.description}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${a.priority === "ALTA" ? "bg-red-200 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                {a.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}