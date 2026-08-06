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
  Users,
  Calendar,
  DollarSign,
  FileText,
  Settings,
  CheckSquare,
  Square,
  TrendingUp,
  Clock,
  Download,
  Printer,
  Filter,
  Search,
  X,
  Save,
  ChevronDown,
  ChevronUp,
  Eye,
  CreditCard,
  Clock as ClockIcon,
  AlertTriangle,
  ClipboardList,
  RefreshCw,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import Swal from "sweetalert2";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const fmt = (n: number) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", minimumFractionDigits: 2 }).format(n);

type Worker = {
  id: string;
  name: string;
  role: string;
  location: string;
  active: boolean;
  tarifa_diaria: number;
  bono_almuerzo: number;
  tipo_pago: string;
  tarifa_mensual: number;
  tarifa_hora_extra: number;
};

type Asistencia = {
  id: string;
  worker_id: string;
  semana_inicio: string;
  semana_fin: string;
  lunes: boolean;
  martes: boolean;
  miercoles: boolean;
  jueves: boolean;
  viernes: boolean;
  sabado: boolean;
  domingo: boolean;
  total_dias: number;
  horas_extras: number;
  pago_horas_extras: number;
  total_pagar: number;
  pagado: boolean;
  fecha_pago: string | null;
};

const DIAS_SEMANA = [
  { key: "lunes", label: "L", nombre: "Lunes" },
  { key: "martes", label: "M", nombre: "Martes" },
  { key: "miercoles", label: "Mi", nombre: "Miércoles" },
  { key: "jueves", label: "J", nombre: "Jueves" },
  { key: "viernes", label: "V", nombre: "Viernes" },
  { key: "sabado", label: "S", nombre: "Sábado" },
  { key: "domingo", label: "D", nombre: "Domingo" },
];

function KpiCard({ icon: Icon, label, value, sub, color }: any) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color || "bg-zinc-50"}`}>
          <Icon className="h-5 w-5 text-zinc-600" />
        </div>
      </div>
      <p className="text-2xl font-bold text-zinc-900">{value}</p>
      <p className="text-xs text-zinc-500 mt-1">{label}</p>
      {sub && <p className="text-[10px] text-zinc-400 mt-1">{sub}</p>}
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

export default function PersonalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 👇 Obtener el rol del usuario para condicionar la vista
  const role = session?.user?.role;
  const isAdmin = role === "FUNDADOR" || role === "ADMIN";
  const isFieldEngineer = role === "FIELD_ENGINEER";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [historialPagos, setHistorialPagos] = useState<any[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    const day = now.getDay();
    const diff = day === 0 ? 6 : day - 1;
    startOfWeek.setDate(now.getDate() - diff);
    return startOfWeek.toISOString().split("T")[0];
  });
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklistData, setChecklistData] = useState<Record<string, Record<string, boolean>>>({});
  const [horasExtrasData, setHorasExtrasData] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // ── Partes diarios ──────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<"planilla" | "checklist" | "partes">(
    isFieldEngineer ? "checklist" : "planilla"
  );
  const [partes, setPartes] = useState<any[]>([]);
  const [showParteForm, setShowParteForm] = useState(false);
  const [parteProyectos, setParteProyectos] = useState<any[]>([]);
  const [parteForm, setParteForm] = useState({
    fecha: new Date().toISOString().split("T")[0],
    project_id: "",
    supervisor: "",
    resumen_general: "",
    observaciones: "",
  });
  const [parteActividades, setParteActividades] = useState<any[]>([]);
  const [nuevaActividad, setNuevaActividad] = useState({ worker_id: "", actividad: "", horas: "" });
  const [partesExpanded, setPartesExpanded] = useState<string | null>(null);
  const [actividadesPorParte, setActividadesPorParte] = useState<Record<string, any[]>>({});
  const [editingParteId, setEditingParteId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") loadData();
  }, [status]);

  // ── 🔥 Función para sincronizar HistorialPagos desde AsistenciaSemanal ──
  const sincronizarHistorialPagos = async () => {
    if (!isAdmin) {
      showToastMsg("err", "No tienes permiso para sincronizar pagos");
      return;
    }
    setLoading(true);
    try {
      const { data: asistenciasData, error } = await supabase
        .from("AsistenciaSemanal")
        .select("*")
        .eq("semana_inicio", selectedWeek);

      if (error) throw error;

      if (!asistenciasData || asistenciasData.length === 0) {
        showToastMsg("err", "No hay asistencias registradas para esta semana");
        setLoading(false);
        return;
      }

      const { data: workersData } = await supabase
        .from("Worker")
        .select("id, name, tarifa_diaria, tarifa_hora_extra, tipo_pago, tarifa_mensual")
        .in("id", asistenciasData.map(a => a.worker_id));

      const workersMap = Object.fromEntries(
        (workersData || []).map(w => [w.id, w])
      );

      let sincronizados = 0;

      for (const asistencia of asistenciasData) {
        const worker = workersMap[asistencia.worker_id];
        if (!worker) continue;

        const { data: pagoExistente } = await supabase
          .from("HistorialPagos")
          .select("id")
          .eq("worker_id", asistencia.worker_id)
          .eq("periodo_inicio", asistencia.semana_inicio)
          .single();

        const totalDias = asistencia.total_dias || 0;
        const horasExtras = asistencia.horas_extras || 0;

        let montoBase = 0;
        if (worker.tipo_pago === "MENSUAL") {
          montoBase = worker.tarifa_mensual || 0;
        } else {
          montoBase = (worker.tarifa_diaria || 0) * totalDias;
        }

        const pagoHorasExtras = (worker.tarifa_hora_extra || 0) * horasExtras;
        const montoTotal = montoBase + pagoHorasExtras;

        if (pagoExistente) {
          const { error: updateError } = await supabase
            .from("HistorialPagos")
            .update({
              total_dias: totalDias,
              horas_extras: horasExtras,
              monto_total: montoTotal,
              pago_horas_extras: pagoHorasExtras,
              updated_at: new Date().toISOString(),
            })
            .eq("id", pagoExistente.id);

          if (!updateError) sincronizados++;
        } else {
          const { error: insertError } = await supabase
            .from("HistorialPagos")
            .insert({
              worker_id: asistencia.worker_id,
              periodo_inicio: asistencia.semana_inicio,
              periodo_fin: asistencia.semana_fin,
              total_dias: totalDias,
              horas_extras: horasExtras,
              monto_total: montoTotal,
              pago_horas_extras: pagoHorasExtras,
              estado: asistencia.pagado ? "PAGADO" : "PENDIENTE",
            });

          if (!insertError) sincronizados++;
        }
      }

      showToastMsg("ok", `${sincronizados} pagos sincronizados correctamente`);
      loadData();
    } catch (error) {
      console.error("Error sincronizando historial:", error);
      showToastMsg("err", "Error al sincronizar historial de pagos");
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [workersRes, asistenciasRes, pagosRes, partesRes, proyectosRes] = await Promise.all([
        supabase.from("Worker").select("*").order("name"),
        supabase.from("AsistenciaSemanal").select("*").eq("semana_inicio", selectedWeek),
        supabase.from("HistorialPagos").select("*").order("created_at", { ascending: false }),
        supabase.from("ParteTrabajo").select("*, Project(*)").order("fecha", { ascending: false }),
        supabase.from("Project").select("*").in("status", ["ACTIVO", "EN_PRODUCCION"]).order("name"),
      ]);
      setWorkers(workersRes.data || []);
      setAsistencias(asistenciasRes.data || []);
      setHistorialPagos(pagosRes.data || []);
      setPartes(partesRes.data || []);
      setParteProyectos(proyectosRes.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── Funciones de Partes diarios ──────────────────────────────────────
  const handleAddActividadParte = () => {
    if (!nuevaActividad.worker_id || !nuevaActividad.actividad.trim()) {
      showToastMsg("err", "Selecciona un trabajador y describe la actividad");
      return;
    }
    const worker = workers.find(w => w.id === nuevaActividad.worker_id);
    setParteActividades([
      ...parteActividades,
      {
        id: `temp-${Date.now()}`,
        worker_id: nuevaActividad.worker_id,
        worker_name: worker?.name || "Sin nombre",
        actividad: nuevaActividad.actividad,
        horas: parseFloat(nuevaActividad.horas) || 0,
      },
    ]);
    setNuevaActividad({ worker_id: "", actividad: "", horas: "" });
  };

  const handleRemoveActividadParte = (index: number) => {
    setParteActividades(parteActividades.filter((_, i) => i !== index));
  };

  const handleSaveParte = async () => {
    if (!parteForm.fecha || !parteForm.project_id) {
      showToastMsg("err", "Completa la fecha y el proyecto");
      return;
    }
    if (parteActividades.length === 0) {
      showToastMsg("err", "Agrega al menos una actividad");
      return;
    }

    setSaving(true);

    let parteId;
    let error;

    if (editingParteId) {
      const { data, error: updateError } = await supabase
        .from("ParteTrabajo")
        .update({
          fecha: parteForm.fecha,
          project_id: parteForm.project_id,
          supervisor: parteForm.supervisor || null,
          resumen_general: parteForm.resumen_general || null,
          observaciones: parteForm.observaciones || null,
        })
        .eq("id", editingParteId)
        .select();

      error = updateError;
      if (data) parteId = data[0]?.id;

      if (!error) {
        await supabase.from("ParteActividad").delete().eq("parte_id", editingParteId);
      }
    } else {
      const { data, error: insertError } = await supabase
        .from("ParteTrabajo")
        .insert({
          fecha: parteForm.fecha,
          project_id: parteForm.project_id,
          supervisor: parteForm.supervisor || null,
          resumen_general: parteForm.resumen_general || null,
          observaciones: parteForm.observaciones || null,
        })
        .select();

      error = insertError;
      if (data) parteId = data[0]?.id;
    }

    if (error) {
      showToastMsg("err", "Error al guardar el parte");
      setSaving(false);
      return;
    }

    for (const act of parteActividades) {
      await supabase.from("ParteActividad").insert({
        parte_id: parteId,
        worker_id: act.worker_id,
        actividad: act.actividad,
        horas: act.horas || 0,
      });
    }

    setSaving(false);
    showToastMsg("ok", editingParteId ? "Parte actualizado correctamente" : "Parte registrado correctamente");
    setParteForm({
      fecha: new Date().toISOString().split("T")[0],
      project_id: "",
      supervisor: "",
      resumen_general: "",
      observaciones: "",
    });
    setParteActividades([]);
    setShowParteForm(false);
    setEditingParteId(null);
    loadData();
  };

  const cargarActividadesParte = async (parteId: string) => {
    if (actividadesPorParte[parteId]) return;

    const { data } = await supabase
      .from("ParteActividad")
      .select("*, Worker(*)")
      .eq("parte_id", parteId);

    setActividadesPorParte(prev => ({
      ...prev,
      [parteId]: data || []
    }));
  };

  const handleToggleExpand = async (parteId: string) => {
    if (partesExpanded === parteId) {
      setPartesExpanded(null);
    } else {
      setPartesExpanded(parteId);
      await cargarActividadesParte(parteId);
    }
  };

  const handleEditParte = async (parteId: string) => {
    const parte = partes.find(p => p.id === parteId);
    if (!parte) return;

    const { data: actividades } = await supabase
      .from("ParteActividad")
      .select("*")
      .eq("parte_id", parteId);

    setParteForm({
      fecha: parte.fecha,
      project_id: parte.project_id || "",
      supervisor: parte.supervisor || "",
      resumen_general: parte.resumen_general || "",
      observaciones: parte.observaciones || "",
    });

    const actividadesConNombres = await Promise.all(
      (actividades || []).map(async (act) => {
        const worker = workers.find(w => w.id === act.worker_id);
        return {
          ...act,
          worker_name: worker?.name || "Sin nombre",
        };
      })
    );
    setParteActividades(actividadesConNombres);
    setEditingParteId(parteId);
    setShowParteForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteParte = async (parteId: string) => {
    const result = await Swal.fire({
      title: '¿Eliminar parte?',
      text: 'Esta acción no se puede deshacer. Se eliminarán todas las actividades asociadas.',
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
      await supabase.from("ParteActividad").delete().eq("parte_id", parteId);
      const { error } = await supabase.from("ParteTrabajo").delete().eq("id", parteId);
      if (error) throw error;

      showToastMsg("ok", "Parte eliminado correctamente");
      loadData();
    } catch (error) {
      showToastMsg("err", "Error al eliminar el parte");
    } finally {
      setSaving(false);
    }
  };

  const handleEditActividad = async (actividadId: string, parteId: string) => {
    const actividad = parteActividades.find(a => a.id === actividadId);
    if (!actividad) return;

    const nuevaActividad = prompt("Editar actividad:", actividad.actividad);
    if (nuevaActividad === null) return;

    const nuevasHoras = prompt("Editar horas:", actividad.horas.toString());
    if (nuevasHoras === null) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("ParteActividad")
        .update({
          actividad: nuevaActividad,
          horas: parseFloat(nuevasHoras) || 0,
        })
        .eq("id", actividadId);

      if (error) throw error;

      showToastMsg("ok", "Actividad actualizada");
      await cargarActividadesParte(parteId);
      loadData();
    } catch (error) {
      showToastMsg("err", "Error al actualizar la actividad");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteActividad = async (actividadId: string, parteId: string) => {
    const result = await Swal.fire({
      title: '¿Eliminar actividad?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    setSaving(true);
    try {
      const { error } = await supabase.from("ParteActividad").delete().eq("id", actividadId);
      if (error) throw error;

      showToastMsg("ok", "Actividad eliminada");
      await cargarActividadesParte(parteId);
      loadData();
    } catch (error) {
      showToastMsg("err", "Error al eliminar la actividad");
    } finally {
      setSaving(false);
    }
  };

  // ── Toast ──────────────────────────────────────────────────────────────
  const showToastMsg = (type: "ok" | "err", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Checklist functions ──────────────────────────────────────────────
  const getWeekRange = (startDate: string) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return {
      inicio: start.toLocaleDateString("es-PE", { day: "numeric", month: "short" }),
      fin: end.toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" }),
    };
  };

  const getOrCreateAsistencia = async (workerId: string, weekStart: string) => {
    const semanaFin = new Date(weekStart);
    semanaFin.setDate(semanaFin.getDate() + 6);

    const { data, error } = await supabase
      .from("AsistenciaSemanal")
      .upsert(
        {
          worker_id: workerId,
          semana_inicio: weekStart,
          semana_fin: semanaFin.toISOString().split("T")[0],
          lunes: false,
          martes: false,
          miercoles: false,
          jueves: false,
          viernes: false,
          sabado: false,
          domingo: false,
          total_dias: 0,
          horas_extras: 0,
          pago_horas_extras: 0,
          total_pagar: 0,
          pagado: false,
        },
        {
          onConflict: "worker_id,semana_inicio",
          ignoreDuplicates: true,
        }
      )
      .select()
      .single();

    if (error) {
      const { data: existing, error: fetchError } = await supabase
        .from("AsistenciaSemanal")
        .select("*")
        .eq("worker_id", workerId)
        .eq("semana_inicio", weekStart)
        .single();

      if (fetchError) {
        console.error("Error fetching asistencia:", fetchError);
        return null;
      }
      return existing;
    }

    return data;
  };

  const loadChecklist = async (currentWorkers: Worker[]) => {
    setLoading(true);
    try {
      const results = await Promise.all(
        currentWorkers.map((worker) => getOrCreateAsistencia(worker.id, selectedWeek))
      );

      const data: Record<string, Record<string, boolean>> = {};
      const horasData: Record<string, number> = {};

      currentWorkers.forEach((worker, i) => {
        const asistencia = results[i];
        if (asistencia) {
          data[worker.id] = {
            lunes: asistencia.lunes,
            martes: asistencia.martes,
            miercoles: asistencia.miercoles,
            jueves: asistencia.jueves,
            viernes: asistencia.viernes,
            sabado: asistencia.sabado,
            domingo: asistencia.domingo,
          };
          horasData[worker.id] = asistencia.horas_extras || 0;
        }
      });

      setChecklistData(data);
      setHorasExtrasData(horasData);
    } catch (error) {
      console.error("Error loading checklist:", error);
      showToastMsg("err", "Error al cargar el checklist");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChecklist = async () => {
    await loadChecklist(workers.filter((w) => w.active));
    setShowChecklist(true);
  };

  const handleToggleDia = (workerId: string, dia: string) => {
    setChecklistData((prev) => ({
      ...prev,
      [workerId]: {
        ...prev[workerId],
        [dia]: !prev[workerId]?.[dia],
      },
    }));
  };

  const handleHorasExtrasChange = (workerId: string, horas: number) => {
    setHorasExtrasData((prev) => ({
      ...prev,
      [workerId]: Math.max(0, horas),
    }));
  };

  const calcularTotalDias = (workerId: string) => {
    const data = checklistData[workerId];
    if (!data) return 0;
    return DIAS_SEMANA.filter((dia) => data[dia.key]).length;
  };

  const calcularPagoHorasExtras = (workerId: string) => {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) return 0;
    const horas = horasExtrasData[workerId] || 0;
    return (worker.tarifa_hora_extra || 0) * horas;
  };

  const calcularTotalPagar = (workerId: string) => {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) return 0;

    const totalDias = calcularTotalDias(workerId);
    const pagoHorasExtras = calcularPagoHorasExtras(workerId);

    if (worker.tipo_pago === "MENSUAL") {
      return (worker.tarifa_mensual || 0) + pagoHorasExtras;
    }

    const tarifaBase = (worker.tarifa_diaria || 0) * totalDias;
    return tarifaBase + pagoHorasExtras;
  };

  const handleSaveChecklist = async () => {
      console.log("📊 checklistData antes de guardar:", checklistData);
  console.log("📆 selectedWeek:", selectedWeek);
    setSaving(true);
    try {
      await Promise.all(
        workers.map(async (worker) => {
          const data = checklistData[worker.id];
          if (!data) return;

          const totalDias = calcularTotalDias(worker.id);
          const pagoHorasExtras = calcularPagoHorasExtras(worker.id);
          const totalPagar = calcularTotalPagar(worker.id);

          const { error } = await supabase
            .from("AsistenciaSemanal")
            .update({
              lunes: data.lunes ?? false,
              martes: data.martes ?? false,
              miercoles: data.miercoles ?? false,
              jueves: data.jueves ?? false,
              viernes: data.viernes ?? false,
              sabado: data.sabado ?? false,
              domingo: data.domingo ?? false,
              total_dias: totalDias,
              horas_extras: horasExtrasData[worker.id] || 0,
              pago_horas_extras: pagoHorasExtras,
              total_pagar: totalPagar,
              updated_at: new Date().toISOString(),
            })
            .eq("worker_id", worker.id)
            .eq("semana_inicio", selectedWeek);

          if (error) throw error;
        })
      );

      showToastMsg("ok", "Asistencia guardada correctamente");
      const { data: asistenciasActualizadas } = await supabase
        .from("AsistenciaSemanal")
        .select("*")
        .order("semana_inicio", { ascending: false });
      setAsistencias(asistenciasActualizadas || []);
    } catch (error) {
      console.error("Error saving checklist:", error);
      showToastMsg("err", "Error al guardar la asistencia");
    } finally {
      setSaving(false);
    }
  };

  const handleGenerarPago = async (asistenciaId: string, workerId: string) => {
    if (!isAdmin) {
      showToastMsg("err", "No tienes permiso para generar pagos");
      return;
    }

    const asistencia = asistencias.find((a) => a.id === asistenciaId);
    if (!asistencia) return;
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) return;

    setSaving(true);
    try {
      const { error: insertError } = await supabase.from("HistorialPagos").insert({
        worker_id: workerId,
        periodo_inicio: asistencia.semana_inicio,
        periodo_fin: asistencia.semana_fin,
        total_dias: asistencia.total_dias,
        horas_extras: asistencia.horas_extras || 0,
        monto_total: asistencia.total_pagar,
        pago_horas_extras: asistencia.pago_horas_extras || 0,
        estado: "PENDIENTE",
      });
      if (insertError) throw insertError;

      const { error: updateError } = await supabase
        .from("AsistenciaSemanal")
        .update({ pagado: true, fecha_pago: new Date().toISOString().split("T")[0] })
        .eq("id", asistenciaId);
      if (updateError) throw updateError;

      showToastMsg("ok", `Pago generado para ${worker.name}`);
      loadData();
    } catch (error) {
      console.error("Error generando pago:", error);
      showToastMsg("err", "Error al generar el pago");
    } finally {
      setSaving(false);
    }
  };

  const handleMarcarPago = async (pagoId: string) => {
    if (!isAdmin) {
      showToastMsg("err", "No tienes permiso para marcar pagos");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("HistorialPagos")
        .update({ estado: "PAGADO", fecha_pago: new Date().toISOString().split("T")[0] })
        .eq("id", pagoId);
      if (error) throw error;
      showToastMsg("ok", "Pago marcado como pagado");
      loadData();
    } catch (error) {
      showToastMsg("err", "Error al marcar el pago");
    } finally {
      setSaving(false);
    }
  };

  const filteredWorkers = workers.filter((w) => {
    if (filterRole !== "all" && w.role !== filterRole) return false;
    if (filterLocation !== "all" && w.location !== filterLocation) return false;
    if (searchTerm && !w.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const totalWorkers = workers.filter((w) => w.active).length;

  const totalPendientePago = asistencias
    .filter((a) => !a.pagado)
    .reduce((sum, a) => sum + Number(a.total_pagar || 0), 0);

  const totalPagadoMes = historialPagos
    .filter(
      (p) =>
        p.estado === "PAGADO" &&
        p.fecha_pago &&
        new Date(p.fecha_pago).getMonth() === new Date().getMonth()
    )
    .reduce((sum, p) => sum + Number(p.monto_total), 0);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  const uniqueRoles = [...new Set(workers.map((w) => w.role))];
  const uniqueLocations = [...new Set(workers.map((w) => w.location))];

  const formatearFechaLocal = (fechaStr: string) => {
    if (!fechaStr) return "Fecha no disponible";
    const [year, month, day] = fechaStr.split('-').map(Number);
    const fecha = new Date(year, month - 1, day);
    return fecha.toLocaleDateString("es-PE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  // Redirigir según el rol al hacer clic en "Dashboard" del header
  const handleDashboardClick = () => {
    if (isFieldEngineer) {
      router.push("/personal");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium border ${toast.type === "ok"
            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
            : "bg-red-50 text-red-800 border-red-200"
            }`}
        >
          {toast.type === "ok" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          {toast.msg}
          <button onClick={() => setToast(null)}>
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <header className="bg-white border-b border-zinc-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleDashboardClick}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-700 text-sm transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              {isFieldEngineer ? "Personal" : "Dashboard"}
            </button>
            <div className="h-4 w-px bg-zinc-200" />
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center">
                <Users className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-zinc-900 leading-none">Gestión de Personal</h1>
                <p className="text-[10px] text-zinc-400 mt-0.5 uppercase tracking-wider">
                  Control de asistencia · Pagos · Partes diarios
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                const now = new Date();
                const startOfWeek = new Date(now);
                const day = now.getDay();
                const diff = day === 0 ? 6 : day - 1;
                startOfWeek.setDate(now.getDate() - diff);
                setSelectedWeek(startOfWeek.toISOString().split("T")[0]);
                loadData();
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Cargar semana
            </button>

            {isAdmin && (
              <button
                onClick={sincronizarHistorialPagos}
                className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-lg hover:bg-purple-100 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Sincronizar pagos
              </button>
            )}

            {activeTab === "partes" ? (
              <button
                onClick={() => {
                  setParteForm({
                    fecha: new Date().toISOString().split("T")[0],
                    project_id: "",
                    supervisor: "",
                    resumen_general: "",
                    observaciones: "",
                  });
                  setParteActividades([]);
                  setEditingParteId(null);
                  setShowParteForm(!showParteForm);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-xs font-semibold rounded-xl hover:bg-zinc-800 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Nuevo parte
              </button>
            ) : (
              <button
                onClick={handleOpenChecklist}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-xs font-semibold rounded-xl hover:bg-zinc-800 transition-colors"
              >
                <CheckSquare className="h-3.5 w-3.5" />
                Checklist semanal
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── PESTAÑAS ────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <div className="border-b border-zinc-200 bg-white rounded-t-xl">
          <div className="flex gap-1 px-4">
            {isFieldEngineer ? (
              // 👇 Ingeniero ve solo Checklist y Partes
              <>
                <button
                  onClick={() => setActiveTab("checklist")}
                  className={`px-4 py-2.5 text-xs font-medium transition-all ${
                    activeTab === "checklist"
                      ? "border-b-2 border-zinc-900 text-zinc-900"
                      : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  ✅ Checklist
                </button>
                <button
                  onClick={() => setActiveTab("partes")}
                  className={`px-4 py-2.5 text-xs font-medium transition-all ${
                    activeTab === "partes"
                      ? "border-b-2 border-zinc-900 text-zinc-900"
                      : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  📝 Partes diarios
                  {partes.length > 0 && (
                    <span className="ml-1.5 text-[10px] bg-zinc-200 text-zinc-700 px-1.5 py-0.5 rounded-full">
                      {partes.length}
                    </span>
                  )}
                </button>
              </>
            ) : (
              // 👇 Admin ve Planilla, Checklist y Partes
              <>
                <button
                  onClick={() => setActiveTab("planilla")}
                  className={`px-4 py-2.5 text-xs font-medium transition-all ${
                    activeTab === "planilla"
                      ? "border-b-2 border-zinc-900 text-zinc-900"
                      : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  📋 Planilla
                </button>
                <button
                  onClick={() => setActiveTab("checklist")}
                  className={`px-4 py-2.5 text-xs font-medium transition-all ${
                    activeTab === "checklist"
                      ? "border-b-2 border-zinc-900 text-zinc-900"
                      : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  ✅ Checklist
                </button>
                <button
                  onClick={() => setActiveTab("partes")}
                  className={`px-4 py-2.5 text-xs font-medium transition-all ${
                    activeTab === "partes"
                      ? "border-b-2 border-zinc-900 text-zinc-900"
                      : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  📝 Partes diarios
                  {partes.length > 0 && (
                    <span className="ml-1.5 text-[10px] bg-zinc-200 text-zinc-700 px-1.5 py-0.5 rounded-full">
                      {partes.length}
                    </span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* KPIs - ocultar los financieros para FIELD_ENGINEER */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard icon={Users} label="Trabajadores activos" value={totalWorkers} sub="En planilla" color="bg-blue-50" />
          {!isFieldEngineer && (
            <>
              <KpiCard icon={DollarSign} label="Pendiente de pago" value={fmt(totalPendientePago)} sub="Por liquidar" color="bg-amber-50" />
              <KpiCard icon={CreditCard} label="Pagado este mes" value={fmt(totalPagadoMes)} sub="Total desembolsado" color="bg-emerald-50" />
            </>
          )}
          <KpiCard
            icon={Calendar}
            label="Semana actual"
            value={getWeekRange(selectedWeek).inicio + " - " + getWeekRange(selectedWeek).fin}
            sub="Período"
            color="bg-zinc-50"
          />
        </div>

        {/* ── TAB: PLANILLA (solo administradores) ──────────────────────── */}
        {!isFieldEngineer && activeTab === "planilla" && (
          <section className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between flex-wrap gap-4">
              <SectionTitle sub={`${filteredWorkers.length} trabajadores`}>Planilla de personal</SectionTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs border border-zinc-300 rounded-lg bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-zinc-300 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                >
                  <option value="all">Todos los roles</option>
                  {uniqueRoles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-zinc-300 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                >
                  <option value="all">Todas las ubicaciones</option>
                  {uniqueLocations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 border-b border-zinc-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Trabajador</th>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Rol</th>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Ubicación</th>
                    <th className="text-right px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Tarifa diaria</th>
                    <th className="text-right px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Hora extra</th>
                    <th className="text-right px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Semana actual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {filteredWorkers.map((worker) => {
                    const asistenciaSemana = asistencias.find(
                      (a) => a.worker_id === worker.id && a.semana_inicio === selectedWeek
                    );
                    return (
                      <tr key={worker.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="px-6 py-3">
                          <p className="font-semibold text-zinc-900">{worker.name}</p>
                        </td>
                        <td className="px-6 py-3">
                          <span className="text-xs text-zinc-600">{worker.role}</span>
                        </td>
                        <td className="px-6 py-3">
                          <span className="text-xs text-zinc-500">{worker.location}</span>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <span className="text-xs font-mono">
                            {worker.tipo_pago === "MENSUAL"
                              ? fmt(worker.tarifa_mensual) + "/mes"
                              : fmt(worker.tarifa_diaria) + "/día"}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <span className="text-xs font-mono text-amber-600">
                            {fmt(worker.tarifa_hora_extra || 0)}/h
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right">
                          {asistenciaSemana ? (
                            <div className="flex flex-col items-end">
                              <span className="text-xs font-semibold text-emerald-700">
                                {asistenciaSemana.total_dias} días
                              </span>
                              {asistenciaSemana.horas_extras > 0 && (
                                <span className="text-[10px] text-amber-600">
                                  +{asistenciaSemana.horas_extras} HE
                                </span>
                              )}
                              <span className="text-[10px] text-zinc-500">
                                {fmt(Number(asistenciaSemana.total_pagar))}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-zinc-400">Sin registrar</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── TAB: CHECKLIST (visible para todos) ────────────────────────── */}
        {activeTab === "checklist" && (
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <SectionTitle sub="Selecciona los días trabajados por cada persona">Registro de asistencia</SectionTitle>
              <div className="text-sm text-zinc-500">
                Semana del {getWeekRange(selectedWeek).inicio} al {getWeekRange(selectedWeek).fin}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 rounded-lg">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-600 sticky left-0 bg-zinc-50 min-w-[180px]">
                      Trabajador
                    </th>
                    {DIAS_SEMANA.map((dia) => (
                      <th key={dia.key} className="text-center px-3 py-3 text-xs font-semibold text-zinc-600 min-w-[60px]">
                        {dia.nombre}
                      </th>
                    ))}
                    <th className="text-center px-4 py-3 text-xs font-semibold text-zinc-600 min-w-[80px]">Total días</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-zinc-600 min-w-[100px]">Horas extra</th>
                    {isAdmin && (
                      <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-600 min-w-[120px]">Total a pagar</th>
                    )}
                    <th className="text-center px-4 py-3 text-xs font-semibold text-zinc-600 min-w-[100px]">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {workers
                    .filter((w) => w.active)
                    .map((worker) => {
                      const totalDias = calcularTotalDias(worker.id);
                      const totalPagar = calcularTotalPagar(worker.id);
                      const asistenciaExistente = asistencias.find(
                        (a) => a.worker_id === worker.id && a.semana_inicio === selectedWeek
                      );
                      return (
                        <tr key={worker.id} className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 sticky left-0 bg-white">
                            <div>
                              <p className="font-semibold text-zinc-900">{worker.name}</p>
                              {/* Ocultar tarifas para el ingeniero */}
                              {!isFieldEngineer && (
                                <p className="text-[10px] text-zinc-400">
                                  {worker.tipo_pago === "MENSUAL"
                                    ? `${fmt(worker.tarifa_mensual)}/mes`
                                    : `${fmt(worker.tarifa_diaria)}/día`}
                                  {(worker.tarifa_hora_extra || 0) > 0 &&
                                    ` · HE: ${fmt(worker.tarifa_hora_extra)}/h`}
                                </p>
                              )}
                            </div>
                          </td>
                          {DIAS_SEMANA.map((dia) => (
                            <td key={dia.key} className="text-center px-3 py-3">
                              <button
                                onClick={() => handleToggleDia(worker.id, dia.key)}
                                className="focus:outline-none"
                              >
                                {checklistData[worker.id]?.[dia.key] ? (
                                  <CheckSquare className="h-5 w-5 text-emerald-600" />
                                ) : (
                                  <Square className="h-5 w-5 text-zinc-300 hover:text-zinc-400" />
                                )}
                              </button>
                            </td>
                          ))}
                          <td className="text-center px-4 py-3">
                            <span className="font-semibold text-zinc-900">{totalDias}</span>
                            <span className="text-[10px] text-zinc-400 ml-1">días</span>
                          </td>
                          <td className="text-center px-4 py-3">
                            <div className="flex items-center justify-center gap-1">
                              <input
                                type="number"
                                min="0"
                                step="0.5"
                                value={horasExtrasData[worker.id] || 0}
                                onChange={(e) =>
                                  handleHorasExtrasChange(worker.id, parseFloat(e.target.value) || 0)
                                }
                                className="w-20 px-2 py-1 text-center text-xs border border-zinc-300 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                              />
                              <span className="text-[10px] text-zinc-400">horas</span>
                            </div>
                          </td>
                          {isAdmin && (
                            <td className="text-right px-4 py-3">
                              <span className="font-bold text-emerald-700">{fmt(totalPagar)}</span>
                            </td>
                          )}
                          <td className="text-center px-4 py-3">
                            {asistenciaExistente && !asistenciaExistente.pagado && totalDias > 0 && isAdmin && (
                              <button
                                onClick={() => handleGenerarPago(asistenciaExistente.id, worker.id)}
                                className="text-xs bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
                              >
                                Generar pago
                              </button>
                            )}
                            {asistenciaExistente?.pagado && isAdmin && (
                              <span className="text-xs text-emerald-600">✓ Pagado</span>
                            )}
                            {!isAdmin && (
                              <span className="text-xs text-zinc-400">Registrado</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={handleSaveChecklist}
                disabled={saving}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Guardando..." : "Guardar asistencia"}
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: PARTES DIARIOS (visible para todos) ────────────────── */}
        {(activeTab === "partes" || isFieldEngineer) && (
          <div className="space-y-4">
            {showParteForm && (
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-zinc-900">
                    {editingParteId ? "Editar parte diario" : "Nuevo parte diario"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowParteForm(false);
                      setParteActividades([]);
                      setEditingParteId(null);
                      setParteForm({
                        fecha: new Date().toISOString().split("T")[0],
                        project_id: "",
                        supervisor: "",
                        resumen_general: "",
                        observaciones: "",
                      });
                    }}
                    className="text-xs text-zinc-400 hover:text-zinc-600"
                  >
                    Cancelar
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-700 mb-1.5 block">Fecha *</label>
                    <input
                      type="date"
                      value={parteForm.fecha}
                      onChange={(e) => setParteForm({ ...parteForm, fecha: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-zinc-900 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-700 mb-1.5 block">Proyecto *</label>
                    <select
                      value={parteForm.project_id}
                      onChange={(e) => setParteForm({ ...parteForm, project_id: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-zinc-900 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    >
                      <option value="">— Seleccionar —</option>
                      {parteProyectos.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-700 mb-1.5 block">Supervisor</label>
                    <input
                      type="text"
                      value={parteForm.supervisor}
                      onChange={(e) => setParteForm({ ...parteForm, supervisor: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-zinc-900 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="text-xs font-medium text-zinc-700 mb-1.5 block">Resumen general</label>
                    <textarea
                      rows={4}
                      value={parteForm.resumen_general}
                      onChange={(e) => setParteForm({ ...parteForm, resumen_general: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-zinc-900 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-y"
                      placeholder="Ej: 5/10 vigas instaladas en locales comerciales con base..."
                    />
                    <p className="text-xs text-zinc-400 mt-1">Usa saltos de línea para organizar mejor la información</p>
                  </div>

                  <div className="md:col-span-3">
                    <label className="text-xs font-medium text-zinc-700 mb-1.5 block">Observaciones</label>
                    <textarea
                      rows={3}
                      value={parteForm.observaciones}
                      onChange={(e) => setParteForm({ ...parteForm, observaciones: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-zinc-900 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none"
                      placeholder="Incidencias, retrabajos, observaciones..."
                    />
                  </div>
                </div>

                <div className="border-t border-zinc-100 pt-4">
                  <p className="text-xs font-semibold text-zinc-700 mb-3">Actividades del personal</p>
                  <div className="grid grid-cols-12 gap-2 mb-2">
                    <div className="col-span-5">
                      <select
                        value={nuevaActividad.worker_id}
                        onChange={(e) => setNuevaActividad({ ...nuevaActividad, worker_id: e.target.value })}
                        className="w-full px-2 py-1.5 text-xs border border-zinc-300 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      >
                        <option value="">— Trabajador —</option>
                        {workers.filter(w => w.active).map((w) => (
                          <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-5">
                      <input
                        type="text"
                        placeholder="Actividad realizada"
                        value={nuevaActividad.actividad}
                        onChange={(e) => setNuevaActividad({ ...nuevaActividad, actividad: e.target.value })}
                        className="w-full px-2 py-1.5 text-xs border border-zinc-300 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      />
                    </div>
                    <div className="col-span-1">
                      <input
                        type="number"
                        placeholder="Horas"
                        value={nuevaActividad.horas}
                        onChange={(e) => setNuevaActividad({ ...nuevaActividad, horas: e.target.value })}
                        className="w-full px-2 py-1.5 text-xs border border-zinc-300 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      />
                    </div>
                    <div className="col-span-1">
                      <button
                        onClick={handleAddActividadParte}
                        className="w-full px-2 py-1.5 bg-zinc-900 text-white text-xs font-medium rounded-lg hover:bg-zinc-800"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {parteActividades.length > 0 && (
                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-zinc-50">
                          <tr>
                            <th className="text-left p-2 font-semibold text-zinc-700">Trabajador</th>
                            <th className="text-left p-2 font-semibold text-zinc-700">Actividad</th>
                            <th className="text-center p-2 font-semibold text-zinc-700">Horas</th>
                            <th className="text-center p-2"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {parteActividades.map((act, idx) => (
                            <tr key={idx} className="border-b border-zinc-100">
                              <td className="p-2 font-medium text-zinc-800">{act.worker_name}</td>
                              <td className="p-2 text-zinc-700">{act.actividad}</td>
                              <td className="p-2 text-center text-zinc-700">{act.horas}h</td>
                              <td className="p-2 text-center">
                                <button onClick={() => handleRemoveActividadParte(idx)} className="text-zinc-300 hover:text-red-500">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-zinc-100 mt-4">
                  <button
                    onClick={handleSaveParte}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? "Guardando..." : editingParteId ? "Actualizar parte" : "Guardar parte"}
                  </button>
                  <button
                    onClick={() => {
                      setShowParteForm(false);
                      setParteActividades([]);
                      setEditingParteId(null);
                      setParteForm({
                        fecha: new Date().toISOString().split("T")[0],
                        project_id: "",
                        supervisor: "",
                        resumen_general: "",
                        observaciones: "",
                      });
                    }}
                    className="px-4 py-2 border border-zinc-200 text-zinc-600 text-sm font-medium rounded-xl hover:bg-zinc-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {partes.length === 0 ? (
                <div className="bg-white rounded-2xl border border-zinc-100 p-12 text-center">
                  <ClipboardList className="h-12 w-12 text-zinc-200 mx-auto mb-3" />
                  <p className="text-sm text-zinc-400">No hay partes registrados</p>
                  <p className="text-xs text-zinc-300 mt-1">Usa el botón "Nuevo parte" para comenzar</p>
                </div>
              ) : (
                partes.map((parte) => {
                  const proyecto = parte.Project;
                  const isExpanded = partesExpanded === parte.id;
                  const actividades = actividadesPorParte[parte.id] || [];

                  return (
                    <div key={parte.id} className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden hover:border-zinc-300 transition-all">
                      <div className="p-5 bg-gradient-to-r from-zinc-50 to-white">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap mb-2">
                              <span className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-zinc-500" />
                                {formatearFechaLocal(parte.fecha)}
                              </span>
                              <span className="text-xs bg-zinc-200 text-zinc-700 px-2.5 py-0.5 rounded-full font-medium">
                                {proyecto?.name || "Sin proyecto"}
                              </span>
                              {parte.supervisor && (
                                <span className="text-xs text-zinc-500 flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  Supervisor: {parte.supervisor}
                                </span>
                              )}
                            </div>

                            {parte.resumen_general && (
                              <div className="bg-zinc-50 rounded-lg p-3 mb-3 border border-zinc-100">
                                <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">{parte.resumen_general}</p>
                              </div>
                            )}

                            {parte.observaciones && (
                              <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                                <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                <span className="flex-1 whitespace-pre-wrap">{parte.observaciones}</span>
                              </div>
                            )}

                            <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
                              <span className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                {actividades.length} actividades
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {actividades.reduce((sum, a) => sum + (a.horas || 0), 0)}h total
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                {new Set(actividades.map(a => a.worker_id)).size} trabajadores
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0 ml-4">
                            <button
                              onClick={() => handleToggleExpand(parte.id)}
                              className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                              title={isExpanded ? "Ocultar detalles" : "Ver detalles"}
                            >
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => handleEditParte(parte.id)}
                              className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar parte"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteParte(parte.id)}
                              className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar parte"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-zinc-100 px-5 py-4 bg-zinc-50">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                              Actividades del personal
                            </p>
                            <span className="text-xs text-zinc-400">{actividades.length} registros</span>
                          </div>

                          {actividades.length > 0 ? (
                            <div className="space-y-2">
                              {actividades.map((act: any) => (
                                <div key={act.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center flex-shrink-0">
                                      <span className="text-xs font-bold text-zinc-600">
                                        {act.Worker?.name?.charAt(0) || "?"}
                                      </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-zinc-900">
                                        {act.Worker?.name || "Sin asignar"}
                                      </p>
                                      <p className="text-xs text-zinc-600 truncate">{act.actividad}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 flex-shrink-0">
                                    <span className="text-sm font-medium text-zinc-700 bg-zinc-100 px-3 py-1 rounded-full">
                                      {act.horas}h
                                    </span>
                                    <button
                                      onClick={() => handleEditActividad(act.id, parte.id)}
                                      className="text-zinc-300 hover:text-blue-500 transition-colors"
                                      title="Editar actividad"
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteActividad(act.id, parte.id)}
                                      className="text-zinc-300 hover:text-red-500 transition-colors"
                                      title="Eliminar actividad"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-zinc-400 text-center py-4">No hay actividades registradas</p>
                          )}

                          <div className="mt-3 pt-3 border-t border-zinc-200 flex justify-between text-xs text-zinc-400">
                            <span>Total horas: {actividades.reduce((sum, a) => sum + (a.horas || 0), 0)}h</span>
                            <span>Total trabajadores: {new Set(actividades.map(a => a.worker_id)).size}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ── HISTORIAL DE PAGOS (solo administradores) ──────────────────── */}
        {!isFieldEngineer && activeTab !== "partes" && (
          <section className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100">
              <SectionTitle sub="Últimos pagos generados">Historial de pagos</SectionTitle>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 border-b border-zinc-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Trabajador</th>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Período</th>
                    <th className="text-right px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Días</th>
                    <th className="text-right px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">HE</th>
                    <th className="text-right px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Monto</th>
                    <th className="text-center px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Estado</th>
                    <th className="text-right px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {historialPagos.slice(0, 10).map((pago) => {
                    const worker = workers.find((w) => w.id === pago.worker_id);
                    return (
                      <tr key={pago.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="px-6 py-3">
                          <p className="font-medium text-zinc-900">{worker?.name || "—"}</p>
                        </td>
                        <td className="px-6 py-3">
                          <p className="text-xs text-zinc-600">
                            {new Date(pago.periodo_inicio).toLocaleDateString("es-PE", { day: "numeric", month: "short" })} -{" "}
                            {new Date(pago.periodo_fin).toLocaleDateString("es-PE", { day: "numeric", month: "short" })}
                          </p>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <span className="text-xs text-zinc-700">{pago.total_dias} días</span>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <span className="text-xs text-amber-600">{pago.horas_extras || 0} h</span>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <span className="text-sm font-semibold text-zinc-900">{fmt(Number(pago.monto_total))}</span>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${pago.estado === "PAGADO"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                          >
                            {pago.estado === "PAGADO" ? "Pagado" : "Pendiente"}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right">
                          {pago.estado === "PENDIENTE" && (
                            <button
                              onClick={() => handleMarcarPago(pago.id)}
                              className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg hover:bg-emerald-100 transition-colors"
                            >
                              Marcar pagado
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* ── MODAL CHECKLIST (visible para todos) ──────────────────────────── */}
      {showChecklist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-zinc-100">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Checklist semanal</h2>
                <p className="text-sm text-zinc-500">
                  Semana del {getWeekRange(selectedWeek).inicio} al {getWeekRange(selectedWeek).fin}
                </p>
              </div>
              <button onClick={() => setShowChecklist(false)} className="p-2 rounded-lg hover:bg-zinc-100 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-zinc-50 rounded-lg">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-600 sticky left-0 bg-zinc-50 min-w-[180px]">
                        Trabajador
                      </th>
                      {DIAS_SEMANA.map((dia) => (
                        <th key={dia.key} className="text-center px-3 py-3 text-xs font-semibold text-zinc-600 min-w-[60px]">
                          {dia.nombre}
                        </th>
                      ))}
                      <th className="text-center px-4 py-3 text-xs font-semibold text-zinc-600 min-w-[80px]">Total días</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-zinc-600 min-w-[100px]">Horas extra</th>
                      {isAdmin && (
                        <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-600 min-w-[120px]">Total a pagar</th>
                      )}
                      <th className="text-center px-4 py-3 text-xs font-semibold text-zinc-600 min-w-[100px]">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {workers
                      .filter((w) => w.active)
                      .map((worker) => {
                        const totalDias = calcularTotalDias(worker.id);
                        const totalPagar = calcularTotalPagar(worker.id);
                        const asistenciaExistente = asistencias.find(
                          (a) => a.worker_id === worker.id && a.semana_inicio === selectedWeek
                        );
                        return (
                          <tr key={worker.id} className="hover:bg-zinc-50 transition-colors">
                            <td className="px-4 py-3 sticky left-0 bg-white">
                              <div>
                                <p className="font-semibold text-zinc-900">{worker.name}</p>
                                {!isFieldEngineer && (
                                  <p className="text-[10px] text-zinc-400">
                                    {worker.tipo_pago === "MENSUAL"
                                      ? `${fmt(worker.tarifa_mensual)}/mes`
                                      : `${fmt(worker.tarifa_diaria)}/día`}
                                    {(worker.tarifa_hora_extra || 0) > 0 &&
                                      ` · HE: ${fmt(worker.tarifa_hora_extra)}/h`}
                                  </p>
                                )}
                              </div>
                            </td>
                            {DIAS_SEMANA.map((dia) => (
                              <td key={dia.key} className="text-center px-3 py-3">
                                <button
                                  onClick={() => handleToggleDia(worker.id, dia.key)}
                                  className="focus:outline-none"
                                >
                                  {checklistData[worker.id]?.[dia.key] ? (
                                    <CheckSquare className="h-5 w-5 text-emerald-600" />
                                  ) : (
                                    <Square className="h-5 w-5 text-zinc-300 hover:text-zinc-400" />
                                  )}
                                </button>
                              </td>
                            ))}
                            <td className="text-center px-4 py-3">
                              <span className="font-semibold text-zinc-900">{totalDias}</span>
                              <span className="text-[10px] text-zinc-400 ml-1">días</span>
                            </td>
                            <td className="text-center px-4 py-3">
                              <div className="flex items-center justify-center gap-1">
                                <input
                                  type="number"
                                  min="0"
                                  step="0.5"
                                  value={horasExtrasData[worker.id] || 0}
                                  onChange={(e) =>
                                    handleHorasExtrasChange(worker.id, parseFloat(e.target.value) || 0)
                                  }
                                  className="w-20 px-2 py-1 text-center text-xs border border-zinc-300 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                                />
                                <span className="text-[10px] text-zinc-400">horas</span>
                              </div>
                            </td>
                            {isAdmin && (
                              <td className="text-right px-4 py-3">
                                <span className="font-bold text-emerald-700">{fmt(totalPagar)}</span>
                              </td>
                            )}
                            <td className="text-center px-4 py-3">
                              {asistenciaExistente && !asistenciaExistente.pagado && totalDias > 0 && isAdmin && (
                                <button
                                  onClick={() => handleGenerarPago(asistenciaExistente.id, worker.id)}
                                  className="text-xs bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
                                >
                                  Generar pago
                                </button>
                              )}
                              {asistenciaExistente?.pagado && isAdmin && (
                                <span className="text-xs text-emerald-600">✓ Pagado</span>
                              )}
                              {!isAdmin && (
                                <span className="text-xs text-zinc-400">Registrado</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-zinc-100 bg-white">
              <button
                onClick={handleSaveChecklist}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Guardando..." : "Guardar asistencia"}
              </button>
              <button
                onClick={() => setShowChecklist(false)}
                className="px-6 py-2.5 border border-zinc-200 text-zinc-600 bg-white rounded-xl hover:bg-zinc-50 transition-colors"
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