// app/reportes/page.tsx

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { REPORTS_BY_ROLE } from "./config";
import ReportSelector from "./components/ReportSelector";
import ReportFilters from "./components/ReportFilters";
import ReportAvance from "./components/ReportAvance";
import ReportProduccion from "./components/ReportProduccion";
import ReportContratos from "./components/ReportContratos";
import ReportPersonal from "./components/ReportPersonal";
import ReportAlertas from "./components/ReportAlertas";
import ReportPartes from "./components/ReportPartes";
import ReportInventario from "./components/ReportInventario";
import { useReportData } from "./hooks/useReportData";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ReportesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = session?.user?.role || "VIEWER";
  const isAdmin = role === "FUNDADOR" || role === "ADMIN";

  // ─── Estados ──────────────────────────────────────────────────────────
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedReport, setSelectedReport] = useState("");
  const [periodo, setPeriodo] = useState("mes");
  const [generated, setGenerated] = useState(false);

  // ─── Obtener reportes disponibles para el rol ──────────────────────
  const availableReports = REPORTS_BY_ROLE[role] || [];

  // ─── Cargar proyectos ────────────────────────────────────────────────
  useEffect(() => {
    if (status === "authenticated") {
      loadProjects();
    }
  }, [status]);

  const loadProjects = async () => {
    const { data } = await supabase
      .from("Project")
      .select("id, name")
      .order("name");
    setProjects(data || []);
    if (data && data.length > 0) {
      setSelectedProject(data[0].id);
    }
  };

  // ─── Seleccionar primer reporte disponible ──────────────────────────
  useEffect(() => {
    if (availableReports.length > 0 && !selectedReport) {
      setSelectedReport(availableReports[0].id);
    }
  }, [availableReports]);

  // ─── Cargar datos del reporte ────────────────────────────────────────
  const { data, loading, error, refetch } = useReportData({
    reportId: selectedReport,
    projectId: selectedProject,
    periodo,
    role,
  });

  // ─── Generar reporte ─────────────────────────────────────────────────
  const handleGenerate = () => {
    if (selectedProject && selectedReport) {
      refetch();
      setGenerated(true);
    }
  };

  // ─── Redireccionar si no está autenticado ────────────────────────────
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // ─── Loading ──────────────────────────────────────────────────────────
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

  // ─── Renderizar componente del reporte seleccionado ──────────────────
  const renderReport = () => {
    if (!generated) {
      return (
        <div className="p-12 text-center">
          <p className="text-gray-500">Selecciona los filtros y haz clic en "Generar Reporte"</p>
          <p className="text-xs text-gray-400 mt-1">Los datos se mostrarán aquí</p>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Generando reporte...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-12 text-center text-red-500">
          <p>Error al cargar los datos del reporte</p>
          <button
            onClick={handleGenerate}
            className="mt-4 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
          >
            Reintentar
          </button>
        </div>
      );
    }

    if (!data || (Array.isArray(data) && data.length === 0)) {
      return (
        <div className="p-12 text-center text-gray-500">
          No hay datos disponibles para este reporte
        </div>
      );
    }

    switch (selectedReport) {
      case "avance":
        return <ReportAvance data={data} isAdmin={isAdmin} />;
      case "produccion":
        return <ReportProduccion data={data} />;
      case "contratos":
        return <ReportContratos data={data} />;
      case "personal":
        return <ReportPersonal data={data} isAdmin={isAdmin} />;
      case "alertas":
        return <ReportAlertas data={data} />;
      case "partes":
        return <ReportPartes data={data} />;
      case "inventario":
        return <ReportInventario data={data} />;
      default:
        return <p className="p-8 text-center text-gray-500">Reporte no encontrado</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* ─── HEADER ─────────────────────────────────────────────────── */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">📊 Reportes</h1>
          <p className="text-sm text-gray-500">
            Visualiza y analiza datos de tu proyecto
          </p>
        </div>

        {/* ─── SELECTOR DE REPORTES ──────────────────────────────────── */}
        <div className="mb-4">
          <ReportSelector
            reports={availableReports}
            selected={selectedReport}
            onChange={setSelectedReport}
          />
        </div>

        {/* ─── FILTROS ────────────────────────────────────────────────── */}
        <ReportFilters
          projects={projects}
          selectedProject={selectedProject}
          onProjectChange={setSelectedProject}
          periodo={periodo}
          onPeriodoChange={setPeriodo}
          loading={loading}
          onGenerate={handleGenerate}
          lastGeneratedAt={generated ? new Date() : null}
        />

        {/* ─── RESULTADOS ────────────────────────────────────────────── */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {renderReport()}
        </div>

      </div>
    </div>
  );
}