// app/reportes/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
  FileText,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  AlertTriangle,
  Calendar,
  Download,
  Printer,
  Filter,
} from "lucide-react";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Definir los reportes disponibles por rol
const REPORTS_BY_ROLE = {
  FUNDADOR: [
    { id: "contratos", label: "Resumen de Contratos", icon: FileText },
    { id: "cobranzas", label: "Estado de Cobranzas", icon: DollarSign },
    { id: "avance_obra", label: "Avance de Obra", icon: TrendingUp },
    { id: "produccion", label: "Producción por Tipo", icon: BarChart3 },
    { id: "personal", label: "Asistencia de Personal", icon: Users },
    { id: "costos", label: "Costos Reales", icon: DollarSign },
    { id: "flujo_caja", label: "Flujo de Caja", icon: TrendingUp },
    { id: "alertas", label: "Alertas y Observaciones", icon: AlertTriangle },
    { id: "partes", label: "Partes Diarios", icon: Calendar },
  ],
  ADMIN: [
    { id: "contratos", label: "Resumen de Contratos", icon: FileText },
    { id: "cobranzas", label: "Estado de Cobranzas", icon: DollarSign },
    { id: "avance_obra", label: "Avance de Obra", icon: TrendingUp },
    { id: "produccion", label: "Producción por Tipo", icon: BarChart3 },
    { id: "personal", label: "Asistencia de Personal", icon: Users },
    { id: "costos", label: "Costos Reales", icon: DollarSign },
    { id: "flujo_caja", label: "Flujo de Caja", icon: TrendingUp },
    { id: "alertas", label: "Alertas y Observaciones", icon: AlertTriangle },
    { id: "partes", label: "Partes Diarios", icon: Calendar },
  ],
  FIELD_ENGINEER: [
    { id: "avance_obra", label: "Avance de Obra", icon: TrendingUp },
    { id: "produccion", label: "Producción por Tipo", icon: BarChart3 },
    { id: "personal", label: "Asistencia de Personal", icon: Users },
    { id: "alertas", label: "Alertas y Observaciones", icon: AlertTriangle },
    { id: "partes", label: "Partes Diarios", icon: Calendar },
  ],
  PRODUCTION: [
    { id: "produccion", label: "Producción por Tipo", icon: BarChart3 },
    { id: "alertas", label: "Alertas y Observaciones", icon: AlertTriangle },
  ],
};

export default function ReportesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = session?.user?.role || "VIEWER";
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const availableReports = REPORTS_BY_ROLE[role as keyof typeof REPORTS_BY_ROLE] || [];

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && availableReports.length > 0) {
      setSelectedReport(availableReports[0].id);
    }
  }, [status, router]);

  const loadReport = async (reportId: string) => {
    setLoading(true);
    try {
      // Aquí iría la lógica para cargar los datos según el reporte
      // y el rol del usuario (filtrar datos sensibles)
      switch (reportId) {
        case "contratos":
          // Cargar contratos (solo ADMIN/FUNDADOR)
          break;
        case "avance_obra":
          // Cargar avance de obra (todos)
          break;
        // ... etc
      }
    } catch (error) {
      console.error("Error loading report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedReport) {
      loadReport(selectedReport);
    }
  }, [selectedReport]);

  if (status === "loading" || loading) {
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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📊 Reportes LUDIER</h1>
            <p className="text-sm text-gray-500 mt-1">
              Selecciona un reporte para visualizar los datos
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </button>
            <button className="px-4 py-2 border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Imprimir
            </button>
          </div>
        </div>

        {/* Selector de reporte */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <Filter className="h-5 w-5 text-gray-400" />
            {availableReports.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                  selectedReport === report.id
                    ? "bg-gray-900 text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <report.icon className="h-4 w-4" />
                {report.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido del reporte */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          {selectedReport && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {availableReports.find(r => r.id === selectedReport)?.label}
              </h2>
              <div className="text-sm text-gray-500">
                {/* Aquí iría el contenido del reporte seleccionado */}
                <p>Reporte: {selectedReport}</p>
                <p>Rol: {role}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Los datos sensibles (sueldos, costos, etc.) se ocultan según el rol del usuario.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}