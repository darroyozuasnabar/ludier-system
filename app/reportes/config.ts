// app/reportes/config.ts

// 📊 CONFIGURACIÓN DE REPORTES POR ROL
export const REPORTS_BY_ROLE: Record<string, { id: string; label: string; icon: string }[]> = {
  FUNDADOR: [
    { id: "avance", label: "📈 Avance de Obra", icon: "TrendingUp" },
    { id: "produccion", label: "🏗️ Producción", icon: "BarChart3" },
    { id: "contratos", label: "📄 Contratos y Cobranzas", icon: "FileText" },
    { id: "personal", label: "👷 Personal", icon: "Users" },
    { id: "alertas", label: "⚠️ Alertas y Calidad", icon: "AlertTriangle" },
    { id: "partes", label: "📝 Partes Diarios", icon: "Calendar" },
    { id: "inventario", label: "📦 Inventario", icon: "Package" },
  ],
  ADMIN: [
    { id: "avance", label: "📈 Avance de Obra", icon: "TrendingUp" },
    { id: "produccion", label: "🏗️ Producción", icon: "BarChart3" },
    { id: "contratos", label: "📄 Contratos y Cobranzas", icon: "FileText" },
    { id: "personal", label: "👷 Personal", icon: "Users" },
    { id: "alertas", label: "⚠️ Alertas y Calidad", icon: "AlertTriangle" },
    { id: "partes", label: "📝 Partes Diarios", icon: "Calendar" },
    { id: "inventario", label: "📦 Inventario", icon: "Package" },
  ],
  FIELD_ENGINEER: [
    { id: "avance", label: "📈 Avance de Obra", icon: "TrendingUp" },
    { id: "produccion", label: "🏗️ Producción", icon: "BarChart3" },
    { id: "personal", label: "👷 Personal", icon: "Users" },
    { id: "alertas", label: "⚠️ Alertas y Calidad", icon: "AlertTriangle" },
    { id: "partes", label: "📝 Partes Diarios", icon: "Calendar" },
    { id: "inventario", label: "📦 Inventario", icon: "Package" },
  ],
  PRODUCTION: [
    { id: "produccion", label: "🏗️ Producción", icon: "BarChart3" },
    { id: "alertas", label: "⚠️ Alertas", icon: "AlertTriangle" },
    { id: "inventario", label: "📦 Inventario", icon: "Package" },
  ],
};

// 📋 DEFINICIÓN DE CAMPOS POR REPORTE (para la exportación)
export const REPORT_FIELDS: Record<string, string[]> = {
  avance: ["Contrato", "Total", "Cobrado", "Pendiente", "Avance", "Estado"],
  produccion: ["Orden", "Tipo", "Cantidad", "Base", "Acabado", "Estado"],
  contratos: ["Fecha", "Contrato", "Monto", "Tipo", "Estado"],
  personal: ["Nombre", "Rol", "Ubicación", "Estado"],
  alertas: ["Título", "Descripción", "Prioridad", "Estado", "Fecha"],
  partes: ["Fecha", "Supervisor", "Resumen", "Actividades", "Horas"],
  inventario: ["Item", "Categoría", "Cantidad", "Stock Mínimo", "Ubicación", "Unidad"],
};