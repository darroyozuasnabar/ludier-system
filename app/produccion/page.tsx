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
  Factory,
  Users,
  ChevronDown,
  ChevronUp,
  Save,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Zap,
  Clock,
  Target,
  Activity,
  ArrowUp,
  ArrowRight,
  Flame,
  X,
  Wrench,
  Hammer,
  Paintbrush,
  Ruler,
  Settings,
  GripVertical,
  PlusCircle,
  Info,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Estados de orden
const ESTADOS_ORDEN = [
  { key: "PENDIENTE", label: "Pendiente", color: "neutral" },
  { key: "EN_PRODUCCION", label: "En producción", color: "blue" },
  { key: "EN_PINTURA", label: "En pintura", color: "violet" },
  { key: "EN_INSTALACION", label: "En instalación", color: "amber" },
  { key: "COMPLETADO", label: "Completado", color: "emerald" },
  { key: "PAUSADO", label: "Pausado", color: "red" },
];

const estadoBadge: Record<string, string> = {
  PENDIENTE: "bg-zinc-100 text-zinc-600 border border-zinc-200",
  EN_PRODUCCION: "bg-blue-50 text-blue-700 border border-blue-200",
  EN_PINTURA: "bg-violet-50 text-violet-700 border border-violet-200",
  EN_INSTALACION: "bg-amber-50 text-amber-700 border border-amber-200",
  COMPLETADO: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  PAUSADO: "bg-red-50 text-red-600 border border-red-200",
};

const prioridadConfig: Record<string, { style: string; dot: string }> = {
  ALTA: { style: "text-red-600 font-semibold", dot: "bg-red-500" },
  MEDIA: { style: "text-amber-600 font-semibold", dot: "bg-amber-400" },
  BAJA: { style: "text-zinc-400", dot: "bg-zinc-300" },
};

const getEstadoLabel = (key: string) =>
  ESTADOS_ORDEN.find((e) => e.key === key)?.label ?? key;

const getIconForStep = (paso: string) => {
  const pasoLower = paso.toLowerCase();
  if (pasoLower.includes("corte")) return Wrench;
  if (pasoLower.includes("armado")) return Hammer;
  if (pasoLower.includes("soldadura")) return Zap;
  if (pasoLower.includes("esmeril")) return Wrench;
  if (pasoLower.includes("masilla")) return Paintbrush;
  if (pasoLower.includes("lijado")) return Wrench;
  if (pasoLower.includes("thinner")) return Paintbrush;
  if (pasoLower.includes("epóx")) return Paintbrush;
  if (pasoLower.includes("gloss")) return Paintbrush;
  if (pasoLower.includes("trazado")) return Ruler;
  if (pasoLower.includes("picado")) return Hammer;
  if (pasoLower.includes("presentación")) return Wrench;
  if (pasoLower.includes("verificación")) return Ruler;
  if (pasoLower.includes("anclaje")) return Wrench;
  if (pasoLower.includes("poxi")) return Paintbrush;
  return Wrench;
};

// ============================================================
// 🔥 NUEVAS FUNCIONES PARA CÁLCULO DE AVANCE REAL
// ============================================================

// Clasifica cada paso del flujo en una fase amplia, reutilizando las mismas
// palabras clave que ya usa getIconForStep (así no duplicas lógica de negocio).
type Fase = "PRODUCCION" | "PINTURA" | "INSTALACION";

function clasificarFase(paso: string): Fase {
  const p = paso.toLowerCase();
  if (
    p.includes("masilla") ||
    p.includes("lijado") ||
    p.includes("thinner") ||
    p.includes("epóx") ||
    p.includes("gloss") ||
    p.includes("poxi")
  ) {
    return "PINTURA";
  }
  if (p.includes("anclaje") || p.includes("instalación") || p.includes("presentación")) {
    return "INSTALACION";
  }
  return "PRODUCCION"; // corte, armado, soldadura, esmeril, trazado, picado, verificación
}

// Dado el estado ancho de la orden y los pasos REALES definidos para ese tipo,
// calcula un % proporcional al número de pasos que existen.
function calcularAvancePct(estado: string, pasosDelTipo: { paso: string }[]): number | null {
  if (estado === "COMPLETADO") return 100;
  if (estado === "PAUSADO") return null; // no sabemos en qué paso se quedó
  if (estado === "PENDIENTE") return 0;
  if (!pasosDelTipo || pasosDelTipo.length === 0) return null; // sin flujo definido

  const fases = pasosDelTipo.map((p) => clasificarFase(p.paso));
  const total = fases.length;

  const faseActual: Fase =
    estado === "EN_PRODUCCION" ? "PRODUCCION" : estado === "EN_PINTURA" ? "PINTURA" : "INSTALACION";

  let ultimoIndiceFase = 0;
  fases.forEach((f, i) => {
    if (f === faseActual) ultimoIndiceFase = i + 1;
  });

  const pasosCompletados = ultimoIndiceFase || Math.ceil(total / 2);
  return Math.round((pasosCompletados / total) * 100);
}

// ============================================================
// 🔥 NUEVO FlujoBadgeLine (reemplaza el anterior)
// ============================================================

function FlujoBadgeLine({ estado, pasosDelTipo }: { estado: string; pasosDelTipo: { paso: string }[] }) {
  const pct = calcularAvancePct(estado, pasosDelTipo);

  if (pct === null) {
    return (
      <div className="flex items-center gap-2 mt-2">
        <span className="text-[10px] text-zinc-400 font-mono">
          {estado === "PAUSADO" ? "Avance no disponible (pausado)" : "Sin flujo definido para este tipo"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex-1 h-1 rounded-full bg-zinc-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            estado === "COMPLETADO" ? "bg-emerald-500" : "bg-blue-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] text-zinc-400 font-mono w-7 text-right">{pct}%</span>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, sub, accent, trend }: any) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent ?? "bg-zinc-50"}`}>
          <Icon className="h-4 w-4 text-zinc-600" />
        </div>
        {trend && (
          <span className="flex items-center gap-0.5 text-xs text-emerald-600 font-medium">
            <ArrowUp className="h-3 w-3" />
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-bold text-zinc-900 leading-none mt-1">{value}</p>
        {sub && <p className="text-xs text-zinc-400 mt-1">{sub}</p>}
      </div>
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

// Componente de paso con tooltip
function StepWithTooltip({ paso, index, isLast, isBottleneck }: {
  paso: any;
  index: number;
  isLast: boolean;
  isBottleneck: boolean;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const Icon = getIconForStep(paso.paso);

  return (
    <div className="relative flex items-center gap-1.5">
      <div
        className="group relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-help ${isBottleneck
            ? "bg-red-50 border border-red-200 text-red-700"
            : "bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
            }`}
        >
          <Icon className="h-3 w-3" />
          <span className="text-[10px] text-zinc-400 font-mono">{String(index + 1).padStart(2, "0")}</span>
          {paso.paso}
          {isBottleneck && (
            <span className="ml-1 text-[9px] bg-red-100 text-red-600 px-1 py-0.5 rounded font-bold uppercase tracking-wider">
              ⚠ cuello
            </span>
          )}
          {paso.descripcion && (
            <Info className="h-3 w-3 ml-0.5 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
          )}
        </div>

        {/* Tooltip con descripción detallada */}
        {showTooltip && paso.descripcion && (
          <div className="absolute bottom-full left-0 mb-2 z-50 w-80 bg-gray-900 text-white text-xs rounded-lg shadow-xl pointer-events-none animate-in fade-in zoom-in-95 duration-100">
            <div className="p-3">
              <p className="font-semibold text-gray-200 mb-1">{paso.paso}</p>
              <p className="text-gray-300 leading-relaxed">{paso.descripcion}</p>
            </div>
            <div className="absolute top-full left-4 w-2 h-2 bg-gray-900 rotate-45 -mt-1"></div>
          </div>
        )}
      </div>
      {!isLast && <ArrowRight className="h-3 w-3 text-zinc-200 shrink-0" />}
    </div>
  );
}

// Modal para editar flujo
function EditFlowModal({
  isOpen,
  onClose,
  tipoProducto,
  pasos,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  tipoProducto: string;
  pasos: any[];
  onSave: (pasos: any[]) => void;
}) {
  const [editPasos, setEditPasos] = useState<any[]>([]);
  const [newPaso, setNewPaso] = useState({ paso: "", descripcion: "" });

  useEffect(() => {
    if (pasos) {
      setEditPasos([...pasos]);
    }
  }, [pasos]);

  const handleAddPaso = () => {
    if (!newPaso.paso.trim()) return;
    const newOrden = editPasos.length + 1;
    setEditPasos([
      ...editPasos,
      {
        id: `temp-${Date.now()}`,
        paso: newPaso.paso,
        descripcion: newPaso.descripcion,
        orden: newOrden,
        tipo_producto: tipoProducto,
        isNew: true,
      },
    ]);
    setNewPaso({ paso: "", descripcion: "" });
  };

  const handleRemovePaso = (index: number) => {
    const nuevos = editPasos.filter((_, i) => i !== index);
    nuevos.forEach((p, i) => (p.orden = i + 1));
    setEditPasos(nuevos);
  };

  const handleUpdatePaso = (index: number, field: string, value: string) => {
    const nuevos = [...editPasos];
    nuevos[index][field] = value;
    setEditPasos(nuevos);
  };

  const handleSave = () => {
    onSave(editPasos);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Editar flujo: {tipoProducto.replace("_", " ")}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-zinc-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-xs text-zinc-500 mb-4">
          Define los pasos del proceso de fabricación e instalación. El orden se guardará automáticamente.
        </p>

        <div className="space-y-3 mb-4">
          {editPasos.map((paso, idx) => (
            <div key={paso.id} className="flex items-center gap-2 p-3 bg-zinc-50 rounded-lg">
              <div className="w-8 text-center text-sm font-bold text-zinc-400">{idx + 1}</div>
              <div className="flex-1">
                <input
                  type="text"
                  value={paso.paso}
                  onChange={(e) => handleUpdatePaso(idx, "paso", e.target.value)}
                  className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white"
                  placeholder="Nombre del paso"
                />
                <textarea
                  value={paso.descripcion || ""}
                  onChange={(e) => handleUpdatePaso(idx, "descripcion", e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs text-gray-900 border border-gray-300 rounded-lg bg-white resize-none"
                  placeholder="Descripción detallada del paso (herramientas, materiales, precauciones...)"
                  rows={2}
                />
              </div>
              <button onClick={() => handleRemovePaso(idx)} className="p-1 text-red-400 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 mt-2">
          <p className="text-xs font-semibold text-zinc-700 mb-2">Agregar nuevo paso</p>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Nombre del paso"
              value={newPaso.paso}
              onChange={(e) => setNewPaso({ ...newPaso, paso: e.target.value })}
              className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white"
            />
            <textarea
              placeholder="Descripción detallada del paso (herramientas, materiales, precauciones...)"
              value={newPaso.descripcion}
              onChange={(e) => setNewPaso({ ...newPaso, descripcion: e.target.value })}
              className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white resize-none"
              rows={2}
            />
            <button onClick={handleAddPaso} className="self-end px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Agregar paso
            </button>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t">
          <button onClick={handleSave} className="flex-1 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800">
            Guardar cambios
          </button>
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 bg-white py-2 rounded-lg hover:bg-gray-50">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal para nuevo tipo de producto
function NewTipoModal({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nombre: string) => void;
}) {
  const [nombre, setNombre] = useState("");

  const handleSave = () => {
    if (!nombre.trim()) return;
    onSave(nombre.toUpperCase().replace(/ /g, "_"));
    setNombre("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Nuevo tipo de producto</h2>
        <input
          type="text"
          placeholder="Ej: CERCO_PERIMETRAL, ESCALERA_METALICA"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white mb-4"
        />
        <div className="flex gap-3">
          <button onClick={handleSave} className="flex-1 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800">
            Crear
          </button>
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 bg-white py-2 rounded-lg hover:bg-gray-50">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

type OrdenForm = {
  nombre: string;
  tipo: string;
  cantidad: string;
  unidad: string;
  prioridad: string;
  estado: string;
  fechaInicio: string;
  fechaFin: string;
  observaciones: string;
};

const FORM_VACIO: OrdenForm = {
  nombre: "",
  tipo: "BARANDA_BALCON",
  cantidad: "",
  unidad: "unidades",
  prioridad: "MEDIA",
  estado: "PENDIENTE",
  fechaInicio: new Date().toISOString().split("T")[0],
  fechaFin: "",
  observaciones: "",
};

export default function ProduccionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ordenes, setOrdenes] = useState<any[]>([]);
  const [produccionDiaria, setProduccionDiaria] = useState<any[]>([]);
  const [capacidades, setCapacidades] = useState<any[]>([]);
  const [cuadrillas, setCuadrillas] = useState<any[]>([]);
  const [flujosPorTipo, setFlujosPorTipo] = useState<Record<string, any[]>>({});
  const [tiposProducto, setTiposProducto] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState<OrdenForm>(FORM_VACIO);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [filterEstado, setFilterEstado] = useState<string>("ALL");
  const [selectedTipoFlujo, setSelectedTipoFlujo] = useState<string>("BARANDA_BALCON");
  const [flujoActual, setFlujoActual] = useState<any[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNewTipoModal, setShowNewTipoModal] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") loadData();
  }, [status]);

  const loadData = async () => {
    setLoading(true);
    try {
      console.log("🔍 Cargando datos de producción...");

      const { data: ordenesData, error: ordenesError } = await supabase
        .from("OrdenProduccion")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordenesError) {
        console.error("❌ Error en órdenes:", ordenesError);
      }

      console.log("📊 Órdenes cargadas:", ordenesData?.length || 0);

      const [prodRes, capRes, cuadrillasRes, flujoRes] = await Promise.all([
        supabase.from("ProduccionDiaria").select("*").order("fecha", { ascending: false }),
        supabase.from("CapacidadProductiva").select("*"),
        supabase.from("Cuadrilla").select("*"),
        supabase.from("FlujoProduccion").select("*").order("orden", { ascending: true }),
      ]);

      setOrdenes(ordenesData || []);
      setProduccionDiaria(prodRes.data || []);
      setCapacidades(capRes.data || []);
      setCuadrillas(cuadrillasRes.data || []);

      const flujosData = flujoRes.data || [];
      const flujosMap: Record<string, any[]> = {};
      const tiposSet = new Set<string>();

      flujosData.forEach((f) => {
        const tipo = f.tipo_producto || "BARANDA_BALCON";
        if (!flujosMap[tipo]) flujosMap[tipo] = [];
        flujosMap[tipo].push(f);
        tiposSet.add(tipo);
      });

      setFlujosPorTipo(flujosMap);
      setTiposProducto(Array.from(tiposSet));

      if (tiposSet.size > 0 && !flujosMap[selectedTipoFlujo]) {
        const primerTipo = Array.from(tiposSet)[0];
        setSelectedTipoFlujo(primerTipo);
        setFlujoActual(flujosMap[primerTipo] || []);
      } else if (flujosMap[selectedTipoFlujo]) {
        setFlujoActual(flujosMap[selectedTipoFlujo] || []);
      }

      console.log("✅ Datos cargados correctamente");
    } catch (error) {
      console.error("❌ Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const showToastMsg = (type: "ok" | "err", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSaveOrden = async () => {
    if (!form.nombre.trim()) {
      showToastMsg("err", "Completa el nombre de la orden.");
      return;
    }
    setSaving(true);

    const cantidad = parseFloat(form.cantidad) || 1;

    const payload = {
      nombre: form.nombre,
      tipo: form.tipo,
      cantidad: cantidad,
      unidad: form.unidad,
      prioridad: form.prioridad,
      estado: form.estado,
      fechainicio: form.fechaInicio,
      fechafin: form.fechaFin || null,
      observaciones: form.observaciones || null,
    };

    console.log("Payload a guardar:", payload);

    let error;
    if (editingId) {
      ({ error } = await supabase.from("OrdenProduccion").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("OrdenProduccion").insert(payload));
    }
    setSaving(false);

    if (error) {
      console.error("Error completo:", error);
      showToastMsg("err", `Error al guardar: ${error.message || "Verifica los datos"}`);
    } else {
      showToastMsg("ok", editingId ? "Orden actualizada." : "Orden creada.");
      setForm(FORM_VACIO);
      setShowForm(false);
      setEditingId(null);
      loadData();
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    await supabase.from("OrdenProduccion").update({ estado: newStatus }).eq("id", id);
    loadData();
  };

  const handleDeleteOrden = async (id: string) => {
    if (!confirm("¿Eliminar esta orden?")) return;
    await supabase.from("OrdenProduccion").delete().eq("id", id);
    loadData();
  };

  const handleEditOrden = (orden: any) => {
    setForm({
      nombre: orden.nombre,
      tipo: orden.tipo,
      cantidad: String(orden.cantidad),
      unidad: orden.unidad || "unidades",
      prioridad: orden.prioridad,
      estado: orden.estado,
      fechaInicio: orden.fechainicio?.split("T")[0] || "",
      fechaFin: orden.fechafin?.split("T")[0] || "",
      observaciones: orden.observaciones || "",
    });
    setEditingId(orden.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveFlujo = async (pasos: any[]) => {
    setSaving(true);
    try {
      await supabase.from("FlujoProduccion").delete().eq("tipo_producto", selectedTipoFlujo);

      for (const paso of pasos) {
        await supabase.from("FlujoProduccion").insert({
          paso: paso.paso,
          orden: paso.orden,
          descripcion: paso.descripcion || null,
          tipo_producto: selectedTipoFlujo,
        });
      }
      showToastMsg("ok", `Flujo de ${selectedTipoFlujo} actualizado.`);
      loadData();
    } catch (error) {
      showToastMsg("err", "Error al guardar el flujo.");
    } finally {
      setSaving(false);
    }
  };

  const handleNewTipo = async (nombre: string) => {
    setSaving(true);
    try {
      await supabase.from("FlujoProduccion").insert({
        paso: "Paso 1",
        orden: 1,
        descripcion: "Descripción del paso",
        tipo_producto: nombre,
      });
      showToastMsg("ok", `Tipo "${nombre}" creado. Agrega más pasos desde edición.`);
      loadData();
    } catch (error) {
      showToastMsg("err", "Error al crear el tipo.");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-zinc-300" />
          <p className="text-xs text-zinc-400 tracking-wider uppercase">Cargando producción</p>
        </div>
      </div>
    );
  }

  const enProceso = ordenes.filter(
    (o) => o.estado === "EN_PRODUCCION" || o.estado === "EN_PINTURA" || o.estado === "EN_INSTALACION"
  ).length;
  const completados = ordenes.filter((o) => o.estado === "COMPLETADO").length;
  const pendientes = ordenes.filter((o) => o.estado === "PENDIENTE").length;
  const pausados = ordenes.filter((o) => o.estado === "PAUSADO").length;
  const capacidadBaranda = capacidades.find((c) => c.tipo === "BARANDA")?.cantidad_diaria ?? 5;

  const totalProdDiaria = produccionDiaria.reduce((acc, p) => acc + (p.cantidad ?? 0), 0);
  const eficiencia = ordenes.length > 0 ? Math.round((completados / ordenes.length) * 100) : 0;

  const ordenesFiltradas = filterEstado === "ALL" ? ordenes : ordenes.filter((o) => o.estado === filterEstado);
  const altaPrioridad = ordenes.filter(
    (o) => o.prioridad === "ALTA" && o.estado !== "COMPLETADO" && o.estado !== "PAUSADO"
  );

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium border backdrop-blur-sm ${toast.type === "ok"
            ? "bg-emerald-50/95 text-emerald-800 border-emerald-200"
            : "bg-red-50/95 text-red-800 border-red-200"
            }`}
        >
          {toast.type === "ok" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
          )}
          {toast.msg}
          <button onClick={() => setToast(null)} className="ml-1 text-zinc-400 hover:text-zinc-600">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <header className="bg-white border-b border-zinc-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-700 text-sm transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Dashboard
            </button>
            <div className="h-4 w-px bg-zinc-200" />
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center">
                <Factory className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-zinc-900 leading-none">Panel de Producción</h1>
                <p className="text-[10px] text-zinc-400 mt-0.5 uppercase tracking-wider">Control de fabricación · LUDIER</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {pausados > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
                <AlertTriangle className="h-3.5 w-3.5" />
                {pausados} pausada{pausados > 1 ? "s" : ""}
              </div>
            )}
            <button
              onClick={() => {
                setForm(FORM_VACIO);
                setEditingId(null);
                setShowForm(!showForm);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-xs font-semibold rounded-xl hover:bg-zinc-800 transition-colors tracking-wide uppercase"
            >
              <Plus className="h-3.5 w-3.5" />
              Nueva orden
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">

        {/* Alerta de alta prioridad */}
        {altaPrioridad.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <Flame className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-800">
                {altaPrioridad.length} orden{altaPrioridad.length > 1 ? "es" : ""} de alta prioridad activa{altaPrioridad.length > 1 ? "s" : ""}
              </p>
              <p className="text-xs text-red-600 mt-0.5">
                {altaPrioridad.map((o) => o.nombre).join(" · ")}
              </p>
            </div>
          </div>
        )}

        {/* KPIs principales */}
        <section>
          <SectionTitle sub="Métricas clave del período actual">Visión ejecutiva</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard icon={Activity} label="En proceso" value={enProceso} sub="órdenes activas ahora" accent="bg-blue-50" />
            <KpiCard icon={CheckCircle} label="Completadas" value={completados} sub="este período" accent="bg-emerald-50" trend={completados > 0 ? `${eficiencia}% efic.` : undefined} />
            <KpiCard icon={Clock} label="Pendientes" value={pendientes} sub="sin iniciar" accent="bg-amber-50" />
            <KpiCard icon={BarChart3} label="Cap. diaria" value={`${capacidadBaranda} u.`} sub="barandas por día" accent="bg-zinc-50" />
          </div>
        </section>

        {/* Capacidades + producción registrada */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
            <SectionTitle sub="Rendimiento por tipo de producto">Capacidad productiva</SectionTitle>
            <div className="space-y-3">
              {capacidades.map((cap) => {
                const pct = Math.min(100, Math.round((cap.cantidad_diaria / 100) * 100));
                return (
                  <div key={cap.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-zinc-700 uppercase tracking-wide">{cap.tipo.replace("_", " ")}</span>
                      <span className="text-xs text-zinc-500"><span className="font-bold text-zinc-900">{cap.cantidad_diaria}</span> {cap.unidad}/día · {cap.personal_requerido} personas</span>
                    </div>
                    <div className="h-2 bg-zinc-100 rounded-full overflow-hidden"><div className="h-full bg-zinc-800 rounded-full" style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
              {capacidades.length === 0 && <p className="text-xs text-zinc-300 py-4 text-center">Sin datos de capacidad</p>}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <SectionTitle sub="Registro histórico de fabricación">Producción diaria</SectionTitle>
              <div className="text-right"><p className="text-2xl font-bold text-zinc-900">{totalProdDiaria}</p><p className="text-[10px] text-zinc-400 uppercase tracking-wide">unidades totales</p></div>
            </div>
            <div className="space-y-2">
              {produccionDiaria.slice(0, 5).map((prod) => (
                <div key={prod.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-colors">
                  <div><p className="text-xs font-semibold text-zinc-800">{new Date(prod.fecha).toLocaleDateString("es-PE", { weekday: "short", day: "numeric", month: "short" })}</p><p className="text-[10px] text-zinc-400 mt-0.5">{prod.trabajadores} · {prod.horas_trabajadas}h</p></div>
                  <div className="flex items-center gap-2"><div className="h-6 w-px bg-zinc-200" /><span className="text-base font-bold text-zinc-900">{prod.cantidad}</span><span className="text-[10px] text-zinc-400">{prod.tipo.replace("_", " ").toLowerCase()}s</span></div>
                </div>
              ))}
              {produccionDiaria.length === 0 && <p className="text-xs text-zinc-300 py-4 text-center">Sin registros de producción diaria</p>}
            </div>
          </div>
        </section>

        {/* Flujo de proceso CON TOOLTIPS */}
        <section className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <SectionTitle sub="Pasos definidos por tipo de producto (pasa el mouse para ver detalles)">Flujo de proceso</SectionTitle>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Ver flujo de:</label>
              <select
                value={selectedTipoFlujo}
                onChange={(e) => {
                  setSelectedTipoFlujo(e.target.value);
                  setFlujoActual(flujosPorTipo[e.target.value] || []);
                }}
                className="px-3 py-1.5 text-xs border border-zinc-200 rounded-lg bg-white text-zinc-700 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900"
              >
                {tiposProducto.map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo.replace("_", " ")}</option>
                ))}
                {tiposProducto.length === 0 && <option>Sin tipos definidos</option>}
              </select>
              <button
                onClick={() => setShowNewTipoModal(true)}
                className="px-3 py-1.5 text-xs bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors flex items-center gap-1"
              >
                <PlusCircle className="h-3 w-3" />
                Nuevo tipo
              </button>
              <button
                onClick={() => setShowEditModal(true)}
                className="px-3 py-1.5 text-xs bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors flex items-center gap-1"
              >
                <Settings className="h-3 w-3" />
                Editar flujo
              </button>
            </div>
          </div>

          {flujoActual.length > 0 ? (
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                {flujoActual.map((paso, i) => {
                  const isBottleneck = paso.paso.toLowerCase().includes("armado");
                  return (
                    <StepWithTooltip
                      key={paso.id}
                      paso={paso}
                      index={i}
                      isLast={i === flujoActual.length - 1}
                      isBottleneck={isBottleneck}
                    />
                  );
                })}
              </div>
              <div className="mt-3 p-3 bg-zinc-50 rounded-lg">
                <p className="text-xs text-zinc-500">
                  <span className="font-semibold">💡 Tip:</span> Pasa el mouse sobre cualquier paso para ver la descripción detallada con herramientas, materiales y precauciones.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-zinc-400">No hay flujo definido para este tipo de producto.</p>
              <p className="text-xs text-zinc-300 mt-1">
                Usa el botón <span className="font-mono">"Editar flujo"</span> para crear los pasos.
              </p>
            </div>
          )}
        </section>

        {/* Cuadrillas */}
        {cuadrillas.length > 0 && (
          <section className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
            <SectionTitle sub="Equipos operativos activos">Cuadrillas</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cuadrillas.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                  <div className="w-9 h-9 rounded-xl bg-zinc-200 flex items-center justify-center"><Users className="h-4 w-4 text-zinc-600" /></div>
                  <div><p className="text-sm font-semibold text-zinc-800">{c.nombre}</p><p className="text-xs text-zinc-400">{c.ubicacion}</p></div>
                  <div className="ml-auto"><span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full uppercase tracking-wide">Activa</span></div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Formulario nueva orden */}
        {showForm && (
          <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div><h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">{editingId ? "Editar orden" : "Nueva orden de producción"}</h2><p className="text-xs text-zinc-400 mt-0.5">Completa los datos del pedido</p></div>
              <button onClick={() => { setShowForm(false); setEditingId(null); setForm(FORM_VACIO); }} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Nombre / producto *</label><input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors" placeholder="Ej: Barandas Torre A, Cercos perimetrales..." /></div>
              <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Tipo</label><select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors">{tiposProducto.map((t) => (<option key={t} value={t}>{t.replace("_", " ")}</option>))}{tiposProducto.length === 0 && <option value="BARANDA_BALCON">BARANDA_BALCON</option>}</select></div>
              <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Cantidad</label><input type="number" min="0" value={form.cantidad} onChange={(e) => setForm({ ...form, cantidad: e.target.value })} className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors" /></div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                  Unidad
                </label>
                <select
                  value={form.unidad}
                  onChange={(e) => setForm({ ...form, unidad: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"
                >
                  <option value="unidades">unidades</option>
                  <option value="ML">ML (metros lineales)</option>
                  <option value="M2">M2 (metros cuadrados)</option>
                  <option value="UND">UND (unidades)</option>
                  <option value="KG">KG (kilogramos)</option>
                </select>
              </div>

              <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Prioridad</label><select value={form.prioridad} onChange={(e) => setForm({ ...form, prioridad: e.target.value })} className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"><option value="BAJA">Baja</option><option value="MEDIA">Media</option><option value="ALTA">Alta</option></select></div>
              <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Estado</label><select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors">{ESTADOS_ORDEN.map((e) => (<option key={e.key} value={e.key}>{e.label}</option>))}</select></div>
              <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Fecha inicio</label><input type="date" value={form.fechaInicio} onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })} className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors" /></div>
              <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Fecha fin estimada</label><input type="date" value={form.fechaFin} onChange={(e) => setForm({ ...form, fechaFin: e.target.value })} className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors" /></div>
              <div className="md:col-span-2"><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Observaciones</label><textarea rows={2} value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors resize-none" placeholder="Detalles adicionales..." /></div>
            </div>
            <div className="flex gap-3 mt-6 pt-6 border-t border-zinc-100"><button onClick={handleSaveOrden} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white text-xs font-bold rounded-xl hover:bg-zinc-800 transition-colors uppercase tracking-wide disabled:opacity-60">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{saving ? "Guardando..." : editingId ? "Actualizar" : "Crear orden"}</button><button onClick={() => { setShowForm(false); setEditingId(null); setForm(FORM_VACIO); }} className="px-5 py-2.5 border border-zinc-200 text-zinc-600 bg-white rounded-xl hover:bg-zinc-50 text-xs font-semibold uppercase tracking-wide transition-colors">Cancelar</button></div>
          </section>
        )}

        {/* Lista de órdenes */}
        <section>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <SectionTitle sub={`${ordenesFiltradas.length} de ${ordenes.length} órdenes`}>Órdenes de producción</SectionTitle>
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {["ALL", "EN_PRODUCCION", "EN_INSTALACION", "PENDIENTE", "COMPLETADO"].map((f) => (
                <button key={f} onClick={() => setFilterEstado(f)} className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors ${filterEstado === f ? "bg-zinc-900 text-white" : "bg-white border border-zinc-200 text-zinc-500 hover:border-zinc-400"}`}>
                  {f === "ALL" ? "Todas" : f === "EN_PRODUCCION" ? "En prod." : f === "EN_INSTALACION" ? "Instalac." : f === "PENDIENTE" ? "Pendiente" : "Completadas"}
                </button>
              ))}
            </div>
          </div>

          {ordenesFiltradas.length === 0 ? (
            <div className="bg-white rounded-2xl border border-zinc-100 p-16 text-center"><div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center mx-auto mb-4"><Factory className="h-7 w-7 text-zinc-200" /></div><p className="text-sm text-zinc-400">No hay órdenes en este filtro.</p><p className="text-xs text-zinc-300 mt-1">{filterEstado === "ALL" ? 'Crea la primera con "Nueva orden".' : "Prueba con otro filtro."}</p></div>
          ) : (
            <div className="space-y-3">
              {ordenesFiltradas.map((orden) => {
                const isExpanded = expandedId === orden.id;
                const pConfig = prioridadConfig[orden.prioridad] ?? prioridadConfig.BAJA;
                const pasosDelTipo = flujosPorTipo[orden.tipo] || [];
                return (
                  <div key={orden.id} className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden hover:border-zinc-200 transition-colors">
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center gap-1 pt-0.5"><div className={`w-2 h-2 rounded-full ${pConfig.dot}`} /><div className="w-px flex-1 bg-zinc-100 min-h-[24px]" /></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap"><h3 className="text-sm font-bold text-zinc-900 truncate">{orden.nombre}</h3><span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${estadoBadge[orden.estado] ?? "bg-zinc-100 text-zinc-600"}`}>{getEstadoLabel(orden.estado)}</span></div>
                              <div className="flex items-center gap-3 mt-1 flex-wrap"><span className="text-xs text-zinc-500"><span className="font-semibold text-zinc-700">{orden.cantidad}</span> {orden.unidad}</span><span className="text-[10px] text-zinc-300">·</span><span className="text-xs text-zinc-400 uppercase tracking-wide">{orden.tipo}</span><span className="text-[10px] text-zinc-300">·</span><span className={`text-xs ${pConfig.style}`}>↑ {orden.prioridad}</span><span className="text-[10px] text-zinc-300">·</span><span className="text-xs text-zinc-400 flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(orden.fechaInicio).toLocaleDateString("es-PE", { day: "2-digit", month: "short" })}</span></div>
                              {/* 🔥 NUEVO: FlujoBadgeLine con pasos reales */}
                              <FlujoBadgeLine estado={orden.estado} pasosDelTipo={pasosDelTipo} />
                            </div>
                            <div className="flex items-center gap-0.5 shrink-0"><button onClick={() => handleEditOrden(orden)} className="p-1.5 text-zinc-300 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"><Pencil className="h-3.5 w-3.5" /></button><button onClick={() => handleDeleteOrden(orden.id)} className="p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-3.5 w-3.5" /></button><button onClick={() => setExpandedId(isExpanded ? null : orden.id)} className="p-1.5 text-zinc-300 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors">{isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</button></div>
                          </div>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-zinc-50 pl-6">
                          <div className="grid grid-cols-2 gap-4 mb-4"><div><p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Observaciones</p><p className="text-xs text-zinc-600">{orden.observaciones || "Sin observaciones registradas."}</p></div><div><p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Fecha fin estimada</p><p className="text-xs text-zinc-600">{orden.fechaFin ? new Date(orden.fechaFin).toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" }) : "No definida"}</p></div></div>
                          <div><p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Cambiar estado</p><div className="flex flex-wrap gap-1.5">{ESTADOS_ORDEN.map((e) => (<button key={e.key} onClick={() => handleUpdateStatus(orden.id, e.key)} className={`text-[10px] px-3 py-1.5 rounded-full font-semibold uppercase tracking-wide transition-all ${orden.estado === e.key ? `${estadoBadge[e.key]} ring-2 ring-offset-1 ring-zinc-300` : "bg-zinc-50 text-zinc-500 border border-zinc-200 hover:border-zinc-400 hover:text-zinc-700"}`}>{e.label}</button>))}</div></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>

      {/* Modal para editar flujo */}
      <EditFlowModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        tipoProducto={selectedTipoFlujo}
        pasos={flujoActual}
        onSave={handleSaveFlujo}
      />

      {/* Modal para nuevo tipo de producto */}
      <NewTipoModal
        isOpen={showNewTipoModal}
        onClose={() => setShowNewTipoModal(false)}
        onSave={handleNewTipo}
      />
    </div>
  );
}