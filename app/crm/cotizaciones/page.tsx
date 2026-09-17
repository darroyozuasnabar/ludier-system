"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRightCircle,
  Building2,
  Trash2,
  Edit,
  Eye,
  DollarSign,
  Layers,
  Sparkles,
  Calendar,
  Phone,
  Mail,
  User,
  MapPin,
  X,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  FileCheck2,
} from "lucide-react";
import Swal from "sweetalert2";
import { Cotizacion, CotizacionItem, EstadoCotizacion } from "@/types/crm/cotizacion";
import { calcularTotales, UNIDADES_COTIZACION, ESTADOS_COTIZACION } from "@/lib/validations/cotizacion";

export default function CRMCotizacionesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Estados de datos
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("TODOS");
  const [filtroMoneda, setFiltroMoneda] = useState<string>("TODAS");

  // Modales
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [modalConvertirOpen, setModalConvertirOpen] = useState(false);
  const [selectedCotizacion, setSelectedCotizacion] = useState<Cotizacion | null>(null);

  // Formulario State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    cliente: "",
    cliente_ruc: "",
    cliente_contacto: "",
    cliente_telefono: "",
    cliente_email: "",
    cliente_direccion: "",
    fecha_emision: new Date().toISOString().split("T")[0],
    fecha_validez: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    moneda: "PEN" as "PEN" | "USD",
    tipo_cambio: 3.75,
    estado: "BORRADOR" as EstadoCotizacion,
    condiciones: "Validez de la oferta: 15 días calendario. Forma de pago: 50% adelanto, 50% contra entrega.",
    notas: "",
    items: [
      {
        descripcion: "",
        cantidad: 1,
        unidad: "UND",
        precio_unitario: 0,
        descuento: 0,
        total: 0,
      },
    ] as CotizacionItem[],
  });

  // Datos para conversión a obra
  const [convertData, setConvertData] = useState({
    projectName: "",
    location: "",
    expectedEndDate: "",
    clientType: "CONSTRUCTORA",
  });
  const [converting, setConverting] = useState(false);

  // Cargar datos iniciales
  const fetchCotizaciones = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (busqueda) params.set("busqueda", busqueda);
      if (filtroEstado !== "TODOS") params.set("estado", filtroEstado);
      if (filtroMoneda !== "TODAS") params.set("moneda", filtroMoneda);

      const res = await fetch(`/api/crm/cotizaciones?${params.toString()}`);
      if (!res.ok) throw new Error("Error al consultar cotizaciones");
      const json = await res.json();
      setCotizaciones(json.data || []);
      setEstadisticas(json.estadisticas || null);
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: err.message || "No se pudo cargar la lista de cotizaciones.",
      });
    } finally {
      setLoading(false);
    }
  }, [busqueda, filtroEstado, filtroMoneda]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchCotizaciones();
    }
  }, [status, fetchCotizaciones, router]);

  // Cálculos en tiempo real del formulario
  const calculosFormulario = useMemo(() => {
    return calcularTotales(
      formData.items.map((it) => ({
        cantidad: Number(it.cantidad) || 0,
        precio_unitario: Number(it.precio_unitario) || 0,
        descuento: Number(it.descuento) || 0,
      }))
    );
  }, [formData.items]);

  // Manejadores de Ítems del Formulario
  const handleItemChange = (index: number, field: keyof CotizacionItem, value: any) => {
    const updated = [...formData.items];
    updated[index] = { ...updated[index], [field]: value };
    const cant = Number(updated[index].cantidad) || 0;
    const precio = Number(updated[index].precio_unitario) || 0;
    const desc = Number(updated[index].descuento) || 0;
    updated[index].total = Math.max(0, cant * precio - desc);
    setFormData({ ...formData, items: updated });
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          descripcion: "",
          cantidad: 1,
          unidad: "UND",
          precio_unitario: 0,
          descuento: 0,
          total: 0,
        },
      ],
    });
  };

  const handleRemoveItem = (index: number) => {
    if (formData.items.length <= 1) {
      Swal.fire({
        icon: "warning",
        title: "Requerimiento mínimo",
        text: "La cotización debe tener al menos un ítem.",
      });
      return;
    }
    const updated = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updated });
  };

  // Abrir Modal de Creación
  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setFormData({
      id: "",
      cliente: "",
      cliente_ruc: "",
      cliente_contacto: "",
      cliente_telefono: "",
      cliente_email: "",
      cliente_direccion: "",
      fecha_emision: new Date().toISOString().split("T")[0],
      fecha_validez: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      moneda: "PEN",
      tipo_cambio: 3.75,
      estado: "BORRADOR",
      condiciones: "Validez de la oferta: 15 días calendario. Forma de pago: 50% adelanto, 50% contra entrega.",
      notas: "",
      items: [
        {
          descripcion: "",
          cantidad: 1,
          unidad: "UND",
          precio_unitario: 0,
          descuento: 0,
          total: 0,
        },
      ],
    });
    setModalFormOpen(true);
  };

  // Abrir Modal de Edición
  const handleOpenEditModal = (c: Cotizacion) => {
    setIsEditing(true);
    setSelectedCotizacion(c);
    setFormData({
      id: c.id,
      cliente: c.cliente,
      cliente_ruc: c.cliente_ruc || "",
      cliente_contacto: c.cliente_contacto || "",
      cliente_telefono: c.cliente_telefono || "",
      cliente_email: c.cliente_email || "",
      cliente_direccion: c.cliente_direccion || "",
      fecha_emision: c.fecha_emision ? new Date(c.fecha_emision).toISOString().split("T")[0] : "",
      fecha_validez: c.fecha_validez ? new Date(c.fecha_validez).toISOString().split("T")[0] : "",
      moneda: c.moneda || "PEN",
      tipo_cambio: Number(c.tipo_cambio) || 3.75,
      estado: c.estado,
      condiciones: c.condiciones || "",
      notas: c.notas || "",
      items:
        c.items && c.items.length > 0
          ? c.items.map((it) => ({
              id: it.id,
              descripcion: it.descripcion,
              cantidad: Number(it.cantidad),
              unidad: it.unidad,
              precio_unitario: Number(it.precio_unitario),
              descuento: Number(it.descuento || 0),
              total: Number(it.total),
            }))
          : [
              {
                descripcion: "",
                cantidad: 1,
                unidad: "UND",
                precio_unitario: 0,
                descuento: 0,
                total: 0,
              },
            ],
    });
    setModalFormOpen(true);
  };

  // Guardar Cotización (Crear o Editar)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.cliente.trim()) {
      Swal.fire({ icon: "warning", title: "Campo requerido", text: "Por favor ingrese el nombre del cliente." });
      return;
    }

    if (formData.items.some((it) => !it.descripcion.trim() || Number(it.cantidad) <= 0 || Number(it.precio_unitario) <= 0)) {
      Swal.fire({
        icon: "warning",
        title: "Ítems incompletos",
        text: "Todos los ítems deben tener descripción, cantidad mayor a 0 y precio unitario válido.",
      });
      return;
    }

    try {
      const url = isEditing ? `/api/crm/cotizaciones/${formData.id}` : `/api/crm/cotizaciones`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          subtotal: calculosFormulario.subtotal,
          igv: calculosFormulario.igv,
          total: calculosFormulario.total,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al procesar la solicitud");

      Swal.fire({
        icon: "success",
        title: isEditing ? "¡Actualizada!" : "¡Creada con éxito!",
        text: json.message || "La cotización fue registrada correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });

      setModalFormOpen(false);
      fetchCotizaciones();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "No se pudo guardar",
        text: err.message,
      });
    }
  };

  // Abrir Modal de Conversión a Obra
  const handleOpenConvertModal = (c: Cotizacion) => {
    setSelectedCotizacion(c);
    setConvertData({
      projectName: `Obra ${c.cliente} - ${c.numero}`,
      location: c.cliente_direccion || "Lima, Perú",
      expectedEndDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      clientType: "CONSTRUCTORA",
    });
    setModalConvertirOpen(true);
  };

  // Ejecutar Conversión a Obra
  const handleExecuteConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCotizacion) return;

    setConverting(true);
    try {
      const res = await fetch(`/api/crm/cotizaciones/${selectedCotizacion.id}/convertir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(convertData),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al convertir cotización");

      setModalConvertirOpen(false);
      Swal.fire({
        icon: "success",
        title: "¡Conversión Exitosa!",
        html: `La cotización <b>${selectedCotizacion.numero}</b> ha sido convertida exitosamente a la Obra activa: <b>${json.data.project.name}</b> en el ERP.`,
        confirmButtonColor: "#14213D",
      });

      fetchCotizaciones();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error de conversión",
        text: err.message,
      });
    } finally {
      setConverting(false);
    }
  };

  // Eliminar Cotización
  const handleDeleteCotizacion = async (c: Cotizacion) => {
    const result = await Swal.fire({
      title: `¿Eliminar cotización ${c.numero}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/crm/cotizaciones/${c.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "No se pudo eliminar");

      Swal.fire({
        icon: "success",
        title: "Eliminada",
        text: json.message || "Cotización eliminada correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchCotizaciones();
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Error al eliminar", text: err.message });
    }
  };

  // Badge de Estado
  const getBadgeEstado = (estado: EstadoCotizacion) => {
    switch (estado) {
      case "BORRADOR":
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">Borrador</span>;
      case "ENVIADA":
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">Enviada</span>;
      case "VISTA":
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700">Vista</span>;
      case "APROBADA":
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">Aprobada</span>;
      case "RECHAZADA":
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700">Rechazada</span>;
      case "EXPIRADA":
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">Expirada</span>;
      case "CONVERTIDA_A_OBRA":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Convertida a Obra
          </span>
        );
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">{estado}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Encabezado Principal */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-3xl border border-[#F0EDE7] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#B08D4F] uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Módulo Comercial CRM</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-[#14213D] mt-1">Gestión de Cotizaciones</h1>
          <p className="text-sm text-[#8B8680] mt-0.5">
            Elabora presupuestos técnicos, gestiona el embudo de ventas y convierte propuestas en proyectos de obra.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#14213D] hover:bg-[#1E2E52] text-white font-medium text-sm shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 text-[#C8A46B]" />
          <span>Nueva Cotización</span>
        </button>
      </div>

      {/* Tarjetas de Métricas Ejecutivas */}
      {estadisticas && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#F0EDE7] shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-[#8B8680] uppercase tracking-wider">Total Cotizaciones</p>
                <p className="text-2xl font-bold text-[#14213D] mt-1 tabular-nums">{estadisticas.total}</p>
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" /> {estadisticas.aprobadas} aprobadas / convertidas
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#F1E7D3] flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#B08D4F]" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#F0EDE7] shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-[#8B8680] uppercase tracking-wider">Monto Total (Soles)</p>
                <p className="text-2xl font-bold text-[#14213D] mt-1 tabular-nums">
                  S/ {Number(estadisticas.montoTotalPEN || 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-[#8B8680] mt-1">Cotizado en moneda nacional</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#F0EDE7] shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-[#8B8680] uppercase tracking-wider">Monto Total (Dólares)</p>
                <p className="text-2xl font-bold text-[#14213D] mt-1 tabular-nums">
                  $ {Number(estadisticas.montoTotalUSD || 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-[#8B8680] mt-1">Propuestas en USD</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Layers className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#F0EDE7] shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-[#8B8680] uppercase tracking-wider">Obras Convertidas</p>
                <p className="text-2xl font-bold text-emerald-700 mt-1 tabular-nums">{estadisticas.convertidas}</p>
                <p className="text-xs text-emerald-600 mt-1 font-medium">Proyectos en ejecución ERP</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Barra de Búsqueda y Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-[#F0EDE7] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#8B8680] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por cliente, N° cotización, RUC..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-[#FAF8F4] border border-[#E8E4DD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14213D] text-[#14213D]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#8B8680]" />
            <span className="text-xs text-[#8B8680] font-medium">Estado:</span>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="text-xs font-medium bg-[#FAF8F4] border border-[#E8E4DD] rounded-xl px-3 py-2 text-[#14213D] focus:outline-none"
            >
              <option value="TODOS">Todos los estados</option>
              {ESTADOS_COTIZACION.map((est) => (
                <option key={est} value={est}>
                  {est.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8B8680] font-medium">Moneda:</span>
            <select
              value={filtroMoneda}
              onChange={(e) => setFiltroMoneda(e.target.value)}
              className="text-xs font-medium bg-[#FAF8F4] border border-[#E8E4DD] rounded-xl px-3 py-2 text-[#14213D] focus:outline-none"
            >
              <option value="TODAS">Todas</option>
              <option value="PEN">PEN (Soles)</option>
              <option value="USD">USD (Dólares)</option>
            </select>
          </div>

          <button
            onClick={fetchCotizaciones}
            className="p-2 rounded-xl bg-[#FAF8F4] hover:bg-[#F1E7D3] text-[#14213D] transition-colors"
            title="Refrescar"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabla de Cotizaciones */}
      <div className="bg-white rounded-3xl border border-[#F0EDE7] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#C8A46B]" />
            <p className="text-sm text-[#8B8680]">Cargando cotizaciones...</p>
          </div>
        ) : cotizaciones.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-3">
            <FileText className="w-12 h-12 text-[#E8E4DD]" />
            <p className="text-base font-medium text-[#14213D]">No se encontraron cotizaciones</p>
            <p className="text-xs text-[#8B8680] max-w-sm">
              Crea una nueva cotización comercial o ajusta los filtros de búsqueda.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="mt-2 px-4 py-2 rounded-xl bg-[#14213D] text-white text-xs font-medium"
            >
              Crear primera cotización
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[#FAF8F4] border-b border-[#F0EDE7] text-xs font-semibold text-[#8B8680] uppercase tracking-wider">
                  <th className="py-4 px-6">N.° Cotización</th>
                  <th className="py-4 px-6">Cliente / Empresa</th>
                  <th className="py-4 px-6">Emisión / Validez</th>
                  <th className="py-4 px-6 text-center">Estado</th>
                  <th className="py-4 px-6 text-right">Total</th>
                  <th className="py-4 px-6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE7]">
                {cotizaciones.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAF8F4]/80 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-semibold text-[#14213D]">{c.numero}</p>
                      <p className="text-[11px] text-[#8B8680]">{c.items?.length || 0} ítems incluidos</p>
                    </td>

                    <td className="py-4 px-6">
                      <p className="font-medium text-[#14213D]">{c.cliente}</p>
                      <div className="flex items-center gap-2 text-xs text-[#8B8680] mt-0.5">
                        {c.cliente_ruc && <span>RUC: {c.cliente_ruc}</span>}
                        {c.cliente_contacto && <span>· {c.cliente_contacto}</span>}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs text-[#5B5750]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#B08D4F]" />
                        <span>{new Date(c.fecha_emision).toLocaleDateString("es-PE")}</span>
                      </div>
                      {c.fecha_validez && (
                        <p className="text-[11px] text-[#8B8680] mt-0.5">
                          Hasta {new Date(c.fecha_validez).toLocaleDateString("es-PE")}
                        </p>
                      )}
                    </td>

                    <td className="py-4 px-6 text-center">{getBadgeEstado(c.estado)}</td>

                    <td className="py-4 px-6 text-right font-bold text-[#14213D] tabular-nums">
                      {c.moneda === "USD" ? "$ " : "S/ "}
                      {Number(c.total || 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        {/* Ver Detalle */}
                        <button
                          onClick={() => {
                            setSelectedCotizacion(c);
                            setModalDetalleOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-[#5B5750] hover:bg-[#F1E7D3] hover:text-[#14213D] transition-colors"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Editar */}
                        <button
                          onClick={() => handleOpenEditModal(c)}
                          className="p-1.5 rounded-lg text-[#5B5750] hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title="Editar cotización"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Convertir a Obra (si aún no está convertida) */}
                        {c.estado !== "CONVERTIDA_A_OBRA" ? (
                          <button
                            onClick={() => handleOpenConvertModal(c)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F1E7D3] hover:bg-[#E8CE9B] text-[#B08D4F] font-semibold text-xs transition-colors"
                            title="Convertir propuesta a Obra en ejecución"
                          >
                            <ArrowRightCircle className="w-3.5 h-3.5" />
                            <span>Convertir</span>
                          </button>
                        ) : (
                          <span
                            className="text-xs text-emerald-700 font-medium cursor-help"
                            title={`Convertida a Obra ID: ${c.project_id}`}
                          >
                            En Obra
                          </span>
                        )}

                        {/* Eliminar */}
                        {c.estado !== "CONVERTIDA_A_OBRA" && (
                          <button
                            onClick={() => handleDeleteCotizacion(c)}
                            className="p-1.5 rounded-lg text-[#5B5750] hover:bg-rose-50 hover:text-rose-600 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============================================================
          MODAL: FORMULARIO CREAR / EDITAR
          ============================================================ */}
      {modalFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-6">
            {/* Cabecera Modal */}
            <div className="px-6 py-5 border-b border-[#F0EDE7] flex items-center justify-between bg-[#FAF8F4]">
              <div>
                <h3 className="text-xl font-serif text-[#14213D]">
                  {isEditing ? `Editar Cotización: ${formData.cliente}` : "Nueva Cotización Comercial"}
                </h3>
                <p className="text-xs text-[#8B8680]">Completa los datos del cliente, partidas y montos</p>
              </div>
              <button
                onClick={() => setModalFormOpen(false)}
                className="p-2 rounded-full hover:bg-white text-[#8B8680] hover:text-[#14213D] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmitForm} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Sección Cliente */}
              <div>
                <h4 className="text-xs font-semibold text-[#B08D4F] uppercase tracking-wider mb-3">
                  1. Información del Cliente
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-[#5B5750] mb-1">
                      Cliente / Razón Social <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.cliente}
                      onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                      placeholder="Ej: Constructora San Martín S.A.C."
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F4] border border-[#E8E4DD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14213D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#5B5750] mb-1">RUC (11 dígitos)</label>
                    <input
                      type="text"
                      maxLength={11}
                      value={formData.cliente_ruc}
                      onChange={(e) => setFormData({ ...formData, cliente_ruc: e.target.value })}
                      placeholder="20123456789"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F4] border border-[#E8E4DD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14213D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#5B5750] mb-1">Contacto Persona</label>
                    <input
                      type="text"
                      value={formData.cliente_contacto}
                      onChange={(e) => setFormData({ ...formData, cliente_contacto: e.target.value })}
                      placeholder="Ing. Carlos Mendoza"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F4] border border-[#E8E4DD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14213D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#5B5750] mb-1">Teléfono</label>
                    <input
                      type="text"
                      value={formData.cliente_telefono}
                      onChange={(e) => setFormData({ ...formData, cliente_telefono: e.target.value })}
                      placeholder="+51 987 654 321"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F4] border border-[#E8E4DD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14213D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#5B5750] mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      value={formData.cliente_email}
                      onChange={(e) => setFormData({ ...formData, cliente_email: e.target.value })}
                      placeholder="contacto@empresa.pe"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F4] border border-[#E8E4DD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14213D]"
                    />
                  </div>
                </div>
              </div>

              {/* Sección Condiciones y Fechas */}
              <div className="pt-4 border-t border-[#F0EDE7]">
                <h4 className="text-xs font-semibold text-[#B08D4F] uppercase tracking-wider mb-3">
                  2. Parámetros Comerciales
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5B5750] mb-1">Fecha Emisión</label>
                    <input
                      type="date"
                      required
                      value={formData.fecha_emision}
                      onChange={(e) => setFormData({ ...formData, fecha_emision: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-[#FAF8F4] border border-[#E8E4DD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14213D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#5B5750] mb-1">Vigencia Hasta</label>
                    <input
                      type="date"
                      value={formData.fecha_validez}
                      onChange={(e) => setFormData({ ...formData, fecha_validez: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-[#FAF8F4] border border-[#E8E4DD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14213D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#5B5750] mb-1">Moneda</label>
                    <select
                      value={formData.moneda}
                      onChange={(e) => setFormData({ ...formData, moneda: e.target.value as "PEN" | "USD" })}
                      className="w-full px-3.5 py-2 text-sm bg-[#FAF8F4] border border-[#E8E4DD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14213D]"
                    >
                      <option value="PEN">PEN (Soles - S/)</option>
                      <option value="USD">USD (Dólares - $)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#5B5750] mb-1">Estado</label>
                    <select
                      value={formData.estado}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value as EstadoCotizacion })}
                      className="w-full px-3.5 py-2 text-sm bg-[#FAF8F4] border border-[#E8E4DD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14213D]"
                    >
                      {ESTADOS_COTIZACION.map((st) => (
                        <option key={st} value={st}>
                          {st.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Sección de Ítems / Partidas */}
              <div className="pt-4 border-t border-[#F0EDE7]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-[#B08D4F] uppercase tracking-wider">
                    3. Detalle de Ítems / Partidas
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F1E7D3] hover:bg-[#E8CE9B] text-[#B08D4F] text-xs font-semibold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar Ítem
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E8E4DD] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                    >
                      <div className="sm:col-span-4">
                        <label className="block text-[10px] uppercase tracking-wider text-[#8B8680] mb-1">
                          Descripción
                        </label>
                        <input
                          type="text"
                          required
                          value={item.descripcion}
                          onChange={(e) => handleItemChange(idx, "descripcion", e.target.value)}
                          placeholder="Ej: Fabricación de baranda metálica en tubo de acero"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-[#E8E4DD] rounded-lg focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase tracking-wider text-[#8B8680] mb-1">
                          Cantidad
                        </label>
                        <input
                          type="number"
                          step="any"
                          min="0.01"
                          required
                          value={item.cantidad}
                          onChange={(e) => handleItemChange(idx, "cantidad", parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-[#E8E4DD] rounded-lg focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase tracking-wider text-[#8B8680] mb-1">Unidad</label>
                        <select
                          value={item.unidad}
                          onChange={(e) => handleItemChange(idx, "unidad", e.target.value)}
                          className="w-full px-2 py-1.5 text-xs bg-white border border-[#E8E4DD] rounded-lg focus:outline-none"
                        >
                          {UNIDADES_COTIZACION.map((un) => (
                            <option key={un} value={un}>
                              {un}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase tracking-wider text-[#8B8680] mb-1">
                          P. Unitario ({formData.moneda === "USD" ? "$" : "S/"})
                        </label>
                        <input
                          type="number"
                          step="any"
                          min="0"
                          required
                          value={item.precio_unitario}
                          onChange={(e) =>
                            handleItemChange(idx, "precio_unitario", parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-3 py-1.5 text-xs bg-white border border-[#E8E4DD] rounded-lg focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-1 text-right">
                        <label className="block text-[10px] uppercase tracking-wider text-[#8B8680] mb-1">Total</label>
                        <p className="text-xs font-bold text-[#14213D] tabular-nums pt-1">
                          {((Number(item.cantidad) || 0) * (Number(item.precio_unitario) || 0) - (Number(item.descuento) || 0)).toFixed(2)}
                        </p>
                      </div>

                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Quitar ítem"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Resumen Totales */}
                <div className="mt-4 p-4 rounded-2xl bg-[#14213D] text-white flex flex-col sm:flex-row justify-end items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-white/60">Subtotal</p>
                    <p className="text-sm font-semibold tabular-nums">
                      {formData.moneda === "USD" ? "$ " : "S/ "}
                      {calculosFormulario.subtotal.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/60">IGV (18%)</p>
                    <p className="text-sm font-semibold tabular-nums">
                      {formData.moneda === "USD" ? "$ " : "S/ "}
                      {calculosFormulario.igv.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right border-l border-white/20 pl-6">
                    <p className="text-xs text-[#C8A46B] font-bold uppercase tracking-wider">Total Propuesta</p>
                    <p className="text-xl font-bold text-white tabular-nums">
                      {formData.moneda === "USD" ? "$ " : "S/ "}
                      {calculosFormulario.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Condiciones y Notas */}
              <div className="pt-4 border-t border-[#F0EDE7] grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#5B5750] mb-1">Condiciones Comerciales</label>
                  <textarea
                    rows={2}
                    value={formData.condiciones}
                    onChange={(e) => setFormData({ ...formData, condiciones: e.target.value })}
                    className="w-full p-3 text-xs bg-[#FAF8F4] border border-[#E8E4DD] rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5B5750] mb-1">Notas Internas</label>
                  <textarea
                    rows={2}
                    value={formData.notas}
                    onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                    placeholder="Observaciones de negociación o cliente..."
                    className="w-full p-3 text-xs bg-[#FAF8F4] border border-[#E8E4DD] rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Botones de acción */}
              <div className="pt-4 border-t border-[#F0EDE7] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalFormOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#E8E4DD] text-sm font-medium text-[#5B5750] hover:bg-[#FAF8F4]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#14213D] text-white text-sm font-medium hover:bg-[#1E2E52] shadow-md"
                >
                  {isEditing ? "Guardar Cambios" : "Crear Cotización"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL: CONVERTIR A OBRA
          ============================================================ */}
      {modalConvertirOpen && selectedCotizacion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-6 border border-[#F0EDE7]">
            <div className="flex items-center gap-3 text-emerald-600 mb-2">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <ArrowRightCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif text-[#14213D]">Convertir Cotización a Obra</h3>
            </div>
            <p className="text-xs text-[#8B8680] mb-6">
              Esta acción creará un nuevo Proyecto en ejecución dentro del ERP con el monto valorizado de{" "}
              <b className="text-[#14213D]">
                {selectedCotizacion.moneda === "USD" ? "$ " : "S/ "}
                {Number(selectedCotizacion.total).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
              </b>
              .
            </p>

            <form onSubmit={handleExecuteConvert} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#5B5750] mb-1">Nombre del Proyecto / Obra</label>
                <input
                  type="text"
                  required
                  value={convertData.projectName}
                  onChange={(e) => setConvertData({ ...convertData, projectName: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-[#FAF8F4] border border-[#E8E4DD] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5B5750] mb-1">Ubicación / Dirección</label>
                <input
                  type="text"
                  required
                  value={convertData.location}
                  onChange={(e) => setConvertData({ ...convertData, location: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-[#FAF8F4] border border-[#E8E4DD] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5B5750] mb-1">Fecha Estimada de Culminación</label>
                <input
                  type="date"
                  required
                  value={convertData.expectedEndDate}
                  onChange={(e) => setConvertData({ ...convertData, expectedEndDate: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-[#FAF8F4] border border-[#E8E4DD] rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[#F0EDE7] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalConvertirOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#5B5750] hover:bg-[#FAF8F4] rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={converting}
                  className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors flex items-center gap-2"
                >
                  {converting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Convirtiendo...
                    </>
                  ) : (
                    "Confirmar y Convertir a Obra"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL: DETALLE DE COTIZACIÓN
          ============================================================ */}
      {modalDetalleOpen && selectedCotizacion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl p-6 border border-[#F0EDE7] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#F0EDE7] pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#B08D4F] uppercase">Cotización</span>
                  <span className="text-xs font-semibold text-[#8B8680]">{selectedCotizacion.numero}</span>
                </div>
                <h3 className="text-xl font-serif text-[#14213D] mt-1">{selectedCotizacion.cliente}</h3>
                {selectedCotizacion.cliente_ruc && (
                  <p className="text-xs text-[#8B8680]">RUC: {selectedCotizacion.cliente_ruc}</p>
                )}
              </div>
              <button
                onClick={() => setModalDetalleOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#FAF8F4] text-[#8B8680]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF8F4] p-3.5 rounded-2xl text-xs">
                <div>
                  <p className="text-[#8B8680]">Estado</p>
                  <p className="font-semibold text-[#14213D] mt-0.5">{selectedCotizacion.estado}</p>
                </div>
                <div>
                  <p className="text-[#8B8680]">Emisión</p>
                  <p className="font-semibold text-[#14213D] mt-0.5">
                    {new Date(selectedCotizacion.fecha_emision).toLocaleDateString("es-PE")}
                  </p>
                </div>
                <div>
                  <p className="text-[#8B8680]">Vigencia</p>
                  <p className="font-semibold text-[#14213D] mt-0.5">
                    {selectedCotizacion.fecha_validez
                      ? new Date(selectedCotizacion.fecha_validez).toLocaleDateString("es-PE")
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[#8B8680]">Moneda</p>
                  <p className="font-semibold text-[#14213D] mt-0.5">{selectedCotizacion.moneda}</p>
                </div>
              </div>

              {/* Tabla de ítems */}
              <div>
                <p className="text-xs font-semibold text-[#14213D] mb-2">Ítems de la propuesta</p>
                <div className="border border-[#F0EDE7] rounded-xl overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-[#FAF8F4] text-[#8B8680]">
                      <tr>
                        <th className="py-2.5 px-3 text-left">Descripción</th>
                        <th className="py-2.5 px-3 text-center">Cant.</th>
                        <th className="py-2.5 px-3 text-right">P. Unit</th>
                        <th className="py-2.5 px-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EDE7]">
                      {selectedCotizacion.items?.map((it, i) => (
                        <tr key={i}>
                          <td className="py-2.5 px-3">{it.descripcion}</td>
                          <td className="py-2.5 px-3 text-center">
                            {Number(it.cantidad)} {it.unidad}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {Number(it.precio_unitario).toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-semibold">
                            {Number(it.total).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totalización */}
              <div className="bg-[#FAF8F4] p-4 rounded-xl space-y-1.5 text-xs text-right">
                <div className="flex justify-between text-[#8B8680]">
                  <span>Subtotal:</span>
                  <span className="font-medium text-[#14213D]">{Number(selectedCotizacion.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#8B8680]">
                  <span>IGV (18%):</span>
                  <span className="font-medium text-[#14213D]">{Number(selectedCotizacion.igv).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#14213D] pt-2 border-t border-[#E8E4DD]">
                  <span>Total {selectedCotizacion.moneda}:</span>
                  <span>{Number(selectedCotizacion.total).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-[#F0EDE7] flex justify-end">
              <button
                onClick={() => setModalDetalleOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#14213D] text-white text-xs font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
