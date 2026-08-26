// app/reportes/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { BarChart3, AlertCircle } from "lucide-react";
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

interface ProjectRow {
  id: string;
  name: string;
  client?: string;
  status?: string;
}

function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const px = size === "lg" ? "w-10 h-10" : size === "sm" ? "w-4 h-4" : "w-7 h-7";
  return (
    <div className={`${px} border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin`} />
  );
}

export default function ReportesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = session?.user?.role || "VIEWER";
  const isAdmin = role === "FUNDADOR" || role === "ADMIN";

  // ─── Estados ──────────────────────────────────────────────────────────
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedReport, setSelectedReport] = useState("");
  const [periodo, setPeriodo] = useState("mes");
  const [generated, setGenerated] = useState(false);
  const [lastGeneratedAt, setLastGeneratedAt] = useState<Date | null>(null);

  const availableReports = REPORTS_BY_ROLE[role] || [];

  // ─── Cargar proyectos (con cliente y estado, para ReportFilters) ────
  useEffect(() => {
    if (status === "authenticated") {
      loadProjects();
    }
  }, [status]);

  const loadProjects = async () => {
    const { data } = await supabase
      .from("Project")
      .select("id, name, client, status")
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
  const handleGenerate = async () => {
    if (selectedProject && selectedReport) {
      await refetch();
      setGenerated(true);
      setLastGeneratedAt(new Date());
    }
  };

  // ─── Cambiar de reporte o proyecto oculta el resultado anterior ────
  // (evita mostrar datos de un reporte viejo mientras cambias de tab)
  useEffect(() => {
    setGenerated(false);
  }, [selectedReport, selectedProject]);

  // ─── Redireccionar si no está autenticado ────────────────────────────
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-gray-500 text-sm mt-4">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  const renderReport = () => {
    if (!generated) {
      return (
        <div className="p-16 text-center">
          <BarChart3 className="w-8 h-8 text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-sm text-gray-500">Selecciona los filtros y genera el reporte</p>
          <p className="text-xs text-gray-400 mt-1">Los datos se mostrarán aquí</p>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="p-16 text-center">
          <Spinner size="md" />
          <p className="text-sm text-gray-500 mt-4">Generando reporte...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-16 text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-sm text-gray-700 font-medium">No se pudo cargar el reporte</p>
          <p className="text-xs text-gray-400 mt-1">Intenta de nuevo en unos segundos</p>
          <button
            onClick={handleGenerate}
            className="mt-4 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            Reintentar
          </button>
        </div>
      );
    }

    if (!data || (Array.isArray(data) && data.length === 0)) {
      return (
        <div className="p-16 text-center text-sm text-gray-500">
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
        return <ReportContratos data={data} isAdmin={isAdmin} />;
      case "personal":
        return <ReportPersonal data={data} isAdmin={isAdmin} />;
      case "alertas":
        return <ReportAlertas data={data} isAdmin={isAdmin} />;
      case "partes":
        return <ReportPartes data={data} />;
      case "inventario":
        return <ReportInventario data={data} />;
      default:
        return <p className="p-8 text-center text-sm text-gray-500">Reporte no encontrado</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Reportes</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Visualiza y analiza datos de tu proyecto
          </p>
        </div>

        {/* Selector de reportes */}
        <div className="mb-4">
          <ReportSelector
            reports={availableReports}
            selected={selectedReport}
            onChange={setSelectedReport}
          />
        </div>

        {/* Filtros */}
        <ReportFilters
          projects={projects}
          selectedProject={selectedProject}
          onProjectChange={setSelectedProject}
          periodo={periodo}
          onPeriodoChange={setPeriodo}
          loading={loading}
          onGenerate={handleGenerate}
          lastGeneratedAt={lastGeneratedAt}
        />

        {/* Resultados */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
          {renderReport()}
        </div>
      </div>
    </div>
  );
}