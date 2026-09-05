// app/crm/cotizaciones/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Search, 
  FileText, 
  Eye, 
  Pencil, 
  Trash2,
  Filter,
  Download,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Loader2
} from "lucide-react";

// Definir tipo para cotización
type Cotizacion = {
  id: string;
  numero: string;
  cliente: string;
  proyecto: string;
  fecha: string;
  total: number;
  estado: "BORRADOR" | "ENVIADA" | "APROBADA" | "RECHAZADA" | "CONVERTIDA";
  creadoEn: string;
};

export default function CotizacionesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("todos");

  // Simular carga de datos (reemplazar con llamada a API real)
  useEffect(() => {
    const fetchCotizaciones = async () => {
      try {
        // TODO: Reemplazar con fetch real a /api/crm/cotizaciones
        const data = [
          {
            id: "1",
            numero: "COT-001",
            cliente: "Grupo LAR",
            proyecto: "Qantua - Fase 02",
            fecha: "2026-08-15",
            total: 543667.29,
            estado: "CONVERTIDA" as const,
            creadoEn: "2026-08-15T10:00:00Z",
          },
          {
            id: "2",
            numero: "COT-002",
            cliente: "MDP Construcciones",
            proyecto: "Hilton MDP",
            fecha: "2026-08-20",
            total: 125000.00,
            estado: "APROBADA" as const,
            creadoEn: "2026-08-20T14:30:00Z",
          },
          {
            id: "3",
            numero: "COT-003",
            cliente: "Flat Canevaro",
            proyecto: "Cerco Metálico - Lince",
            fecha: "2026-08-25",
            total: 8500.00,
            estado: "ENVIADA" as const,
            creadoEn: "2026-08-25T09:15:00Z",
          },
        ];
        setCotizaciones(data);
      } catch (error) {
        console.error("Error al cargar cotizaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCotizaciones();
  }, []);

  const getEstadoColor = (estado: string) => {
    const colors = {
      BORRADOR: "bg-gray-100 text-gray-600",
      ENVIADA: "bg-blue-100 text-blue-600",
      APROBADA: "bg-green-100 text-green-600",
      RECHAZADA: "bg-red-100 text-red-600",
      CONVERTIDA: "bg-purple-100 text-purple-600",
    };
    return colors[estado as keyof typeof colors] || "bg-gray-100 text-gray-600";
  };

  const getEstadoIcon = (estado: string) => {
    const icons = {
      BORRADOR: <Clock className="h-4 w-4" />,
      ENVIADA: <Mail className="h-4 w-4" />,
      APROBADA: <CheckCircle className="h-4 w-4" />,
      RECHAZADA: <XCircle className="h-4 w-4" />,
      CONVERTIDA: <FileText className="h-4 w-4" />,
    };
    return icons[estado as keyof typeof icons] || null;
  };

  const cotizacionesFiltradas = cotizaciones.filter(c => {
    const matchSearch = c.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.proyecto.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEstado = filterEstado === "todos" || c.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#E07B20]" />
        <span className="ml-3 text-sm text-[#8A8F96]">Cargando cotizaciones...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E2126]">Cotizaciones</h1>
          <p className="text-sm text-[#8A8F96]">
            Gestiona todas las cotizaciones de la empresa
          </p>
        </div>
        <button
          onClick={() => router.push("/crm/cotizaciones/nueva")}
          className="flex items-center gap-2 px-4 py-2 bg-[#E07B20] text-white rounded-lg hover:bg-[#cf7219] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nueva Cotización
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border border-[#F0EDE7]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#B0ABA3]" />
          <input
            type="text"
            placeholder="Buscar por número, cliente o proyecto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#F0EDE7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07B20]/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#8A8F96]" />
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="px-3 py-2 border border-[#F0EDE7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07B20]/50 bg-white"
          >
            <option value="todos">Todos los estados</option>
            <option value="BORRADOR">Borrador</option>
            <option value="ENVIADA">Enviada</option>
            <option value="APROBADA">Aprobada</option>
            <option value="RECHAZADA">Rechazada</option>
            <option value="CONVERTIDA">Convertida</option>
          </select>
        </div>
      </div>

      {/* Tabla de cotizaciones */}
      <div className="bg-white rounded-lg border border-[#F0EDE7] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FAF8F4] border-b border-[#F0EDE7]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#8A8F96] uppercase tracking-wider">
                  N° Cotización
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#8A8F96] uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#8A8F96] uppercase tracking-wider">
                  Proyecto
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#8A8F96] uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#8A8F96] uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#8A8F96] uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#8A8F96] uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDE7]">
              {cotizacionesFiltradas.length > 0 ? (
                cotizacionesFiltradas.map((cotizacion) => (
                  <tr key={cotizacion.id} className="hover:bg-[#FAF8F4] transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-[#1E2126]">
                      {cotizacion.numero}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#5B5750]">
                      {cotizacion.cliente}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#5B5750]">
                      {cotizacion.proyecto}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#8A8F96]">
                      {new Date(cotizacion.fecha).toLocaleDateString("es-PE")}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-[#1E2126] text-right">
                      S/ {cotizacion.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getEstadoColor(cotizacion.estado)}`}>
                        {getEstadoIcon(cotizacion.estado)}
                        {cotizacion.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/crm/cotizaciones/${cotizacion.id}`)}
                          className="p-1.5 text-[#8A8F96] hover:text-[#1E2126] transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/crm/cotizaciones/${cotizacion.id}/editar`)}
                          className="p-1.5 text-[#8A8F96] hover:text-[#1E2126] transition-colors"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1.5 text-[#8A8F96] hover:text-red-600 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[#8A8F96]">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No hay cotizaciones que coincidan con los filtros</p>
                    <button
                      onClick={() => router.push("/crm/cotizaciones/nueva")}
                      className="mt-2 text-[#E07B20] hover:underline text-sm"
                    >
                      Crear nueva cotización
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}