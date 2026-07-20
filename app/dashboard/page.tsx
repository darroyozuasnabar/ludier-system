"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  TrendingUp,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Wrench,
  Target,
  Banknote,
  Hammer,
  BarChart3,
  Calendar,
  Building2,
  Receipt,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const formatCOP = (value: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(value);

const formatCompact = (value: number) => {
  if (value >= 1_000_000) return `S/ ${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `S/ ${(value / 1_000).toFixed(1)}K`;
  return `S/ ${value.toFixed(2)}`;
};

const getBadgeClass = (color: string) => {
  const map: Record<string, string> = {
    teal: "bg-teal-50 text-teal-700 border-teal-200",
    red: "bg-red-50 text-red-700 border-red-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };
  return map[color] || "bg-gray-50 text-gray-700 border-gray-200";
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [showAllWorkers, setShowAllWorkers] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedContratoId, setSelectedContratoId] = useState<string>("");

  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [contratosDelProyecto, setContratosDelProyecto] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [direccion, setDireccion] = useState<any[]>([]);
  const [valorizaciones, setValorizaciones] = useState<any[]>([]);
  const [alertas, setAlertas] = useState<any[]>([]);
  const [hitos, setHitos] = useState<any[]>([]);
  const [trabajos, setTrabajos] = useState<any[]>([]);
  const [costos, setCostos] = useState<any[]>([]);
  const [contratos, setContratos] = useState<any[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") loadData();
  }, [status, router]);

  useEffect(() => {
    if (selectedProjectId && allProjects.length > 0) {
      const project = allProjects.find((p) => p.id === selectedProjectId);
      setSelectedProject(project);
      loadProjectData(selectedProjectId);
      loadContratosDelProyecto(selectedProjectId);
    }
  }, [selectedProjectId, allProjects]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: proyectosData } = await supabase
        .from("Project")
        .select("*")
        .order("name");

      setAllProjects(proyectosData || []);

      if (proyectosData && proyectosData.length > 0 && !selectedProjectId) {
        setSelectedProjectId(proyectosData[0].id);
      }

      const { data: contratosData } = await supabase
        .from("Contrato")
        .select("*")
        .order("fecha", { ascending: true });
      setContratos(contratosData || []);

      const { data: workersData } = await supabase
        .from("Worker")
        .select("*")
        .order("name");

      if (workersData) {
        const managementRoles = ["Dirección", "Coordinación", "Oficina"];
        setWorkers(workersData.filter((w: any) => !managementRoles.includes(w.location)));
        setDireccion(workersData.filter((w: any) => managementRoles.includes(w.location)));
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadContratosDelProyecto = async (projectId: string) => {
    const { data } = await supabase
      .from("Contrato")
      .select("*")
      .eq("project_id", projectId)
      .order("monto", { ascending: false });

    setContratosDelProyecto(data || []);
    if (data && data.length > 0 && !selectedContratoId) {
      setSelectedContratoId(data[0].id);
    }
  };

  const loadProjectData = async (projectId: string) => {
    const [valRes, alertRes, costosRes, hitosRes, trabajosRes] = await Promise.all([
      supabase
        .from("Valorizacion")
        .select("*")
        .eq("projectId", projectId)
        .order("fechaEmision", { ascending: false }),
      supabase
        .from("Alert")
        .select("*")
        .eq("projectId", projectId)
        .order("priority", { ascending: false }),
      supabase
        .from("CostoReal")
        .select("*")
        .eq("projectId", projectId),
      supabase
        .from("Hito")
        .select("*")
        .eq("project_id", projectId)
        .order("orden", { ascending: true }),
      supabase
        .from("Trabajo")
        .select("*")
        .eq("project_id", projectId)
        .order("orden", { ascending: true }),
    ]);

    setValorizaciones(valRes.data || []);
    setAlertas(alertRes.data || []);
    setCostos(costosRes.data || []);
    setHitos(hitosRes.data || []);
    setTrabajos(trabajosRes.data || []);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Cargando datos del sistema...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  // ── CÁLCULOS FINANCIEROS ────────────────────────────────────────────────────

  const contratoSeleccionado = contratosDelProyecto.find((c) => c.id === selectedContratoId);
  const contratosCobrados = contratos.filter((c) => c.estado === "COBRADO");
  const contratosPendientes = contratos.filter((c) => c.estado === "PENDIENTE");

  const totalHistoricoCobrado = contratosCobrados.reduce((sum, c) => sum + Number(c.monto), 0);
  const totalPorCobrar = contratosPendientes.reduce((sum, c) => sum + Number(c.monto), 0);

  const montoContrato = Number(contratoSeleccionado?.monto || 0);
  const garantiaContrato = montoContrato * 0.05;
  const costoDirectoContrato = montoContrato / 1.18;

  // ── Próxima cobranza: leer desde valorizaciones ligadas al contrato ─────────
  let totalCobradoContrato = 0;
  let avanceContrato = 0;
  let proximaVal: any = null;
  let proximoMonto = 0;
  let ultimaValPeriodo = "Sin valorizaciones";

  if (contratoSeleccionado?.estado === "COBRADO") {
    totalCobradoContrato = montoContrato;
    avanceContrato = 100;
    proximoMonto = 0;
    ultimaValPeriodo = "Contrato cobrado";
  } else {
    const valorizacionesDelContrato = valorizaciones.filter(
      (v) => v.contrato_id === contratoSeleccionado?.id,
    );

    totalCobradoContrato = valorizacionesDelContrato
      .filter((v) => v.status === "COBRADA")
      .reduce((sum, v) => sum + Number(v.netoCobrar), 0);

    avanceContrato = montoContrato > 0 ? (totalCobradoContrato / montoContrato) * 100 : 0;

    const ORDEN_ESTADO: Record<string, number> = { FIRMADA: 0, EMITIDA: 1, BORRADOR: 2 };
    const pendientes = valorizacionesDelContrato
      .filter((v) => v.status !== "COBRADA")
      .sort((a, b) => (ORDEN_ESTADO[a.status] ?? 9) - (ORDEN_ESTADO[b.status] ?? 9));

    proximaVal = pendientes[0] || null;
    proximoMonto = proximaVal ? Number(proximaVal.netoCobrar) : 0;
    ultimaValPeriodo = proximaVal
      ? proximaVal.period || "Valorización pendiente"
      : valorizacionesDelContrato.length > 0
        ? "Todas cobradas"
        : "Sin valorizaciones";
  }

  const ultimaValCobrada =
    valorizaciones
      .filter((v) => v.contrato_id === contratoSeleccionado?.id)
      .find((v) => v.status === "COBRADA") || null;

  const displayVal = proximaVal || ultimaValCobrada;

  // ── Costos reales ───────────────────────────────────────────────────────────
  const totalMateriales = costos.reduce(
    (sum, c) => sum + Number(c.fierro) + Number(c.pintura) + Number(c.galvanizado),
    0,
  );
  const totalManoObra = costos.reduce((sum, c) => sum + Number(c.manoObra), 0);
  const totalOtros = costos.reduce(
    (sum, c) =>
      sum + Number(c.transporte) + Number(c.instalacion) + Number(c.desperdicio) + Number(c.retrabajos),
    0,
  );
  const totalCostos = totalMateriales + totalManoObra + totalOtros;
  const tieneCostos = totalCostos > 0;

  // ── Flujo de caja ───────────────────────────────────────────────────────────
  const cashFlowData = contratos.map((c, idx) => {
    const d = new Date(c.fecha);
    const mesCorto = d.toLocaleDateString("es-PE", { day: "2-digit", month: "short" });
    return {
      label: `#${idx + 1} ${mesCorto}`,
      monto: Number(c.monto),
      estado: c.estado,
      nombre: c.nombre,
      tipo: c.tipo,
      fecha: d.toLocaleDateString("es-PE"),
      id: c.id,
    };
  });

  const alertasUrgentes = alertas.filter((a) => a.priority === "ALTA").length;

  const workersByRole = workers.reduce((acc: any, w) => {
    acc[w.role] = (acc[w.role] || 0) + 1;
    return acc;
  }, {});
  const roleChartData = Object.entries(workersByRole).map(([role, count]) => ({ name: role, value: count }));
  const totalWorkers = workers.length + direccion.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">LUDIER</h1>
                <p className="text-xs text-gray-500">Panel de control ejecutivo</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{session.user?.name || "Administrador"}</p>
                <p className="text-xs text-gray-500">{session.user?.role}</p>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {session.user?.name?.charAt(0) || "A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Selector de proyecto y contrato */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 font-medium">Proyecto:</span>
            </div>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setSelectedContratoId("");
              }}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 min-w-[280px]"
            >
              {allProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {formatCOP(p.valorization)}
                </option>
              ))}
            </select>

            {contratosDelProyecto.length > 0 && (
              <>
                <div className="hidden md:block h-6 w-px bg-gray-200" />
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 font-medium">Contrato:</span>
                </div>
                <select
                  value={selectedContratoId}
                  onChange={(e) => setSelectedContratoId(e.target.value)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 min-w-[300px]"
                >
                  {contratosDelProyecto.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre.substring(0, 50)} · {formatCOP(c.monto)} · {c.estado}
                    </option>
                  ))}
                </select>
              </>
            )}
            {selectedProject && (
              <div className="text-sm text-gray-500">
                Cliente: <span className="font-medium">{selectedProject.client}</span>
              </div>
            )}
          </div>
        </div>

        {/* KPIs principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Histórico cobrado</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{formatCOP(totalHistoricoCobrado)}</p>
                <p className="text-xs text-gray-400 mt-1">{contratosCobrados.length} contratos ejecutados</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Contrato seleccionado</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{formatCOP(montoContrato)}</p>
                <p className="text-xs text-gray-400 mt-1">Garantía: {formatCOP(garantiaContrato)}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          {/* ── Próxima cobranza — ahora desde valorizaciones con contrato_id ── */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Próxima cobranza</p>
                <p className="text-2xl font-bold text-amber-700 mt-2">
                  {proximoMonto > 0 ? formatCOP(proximoMonto) : "—"}
                </p>
                <p className="text-xs text-gray-400 mt-1 leading-tight">
                  {proximoMonto > 0
                    ? ultimaValPeriodo.length > 35
                      ? ultimaValPeriodo.substring(0, 35) + "…"
                      : ultimaValPeriodo
                    : ultimaValPeriodo}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50">
                <Banknote className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            {proximoMonto > 0 && proximaVal && (
              <div className="mt-3 flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-medium px-2 py-1 rounded-full w-fit">
                <Calendar className="h-3 w-3" />
                {proximaVal.status} · {selectedProject?.client?.split(" ")[0] || "Cliente"}
              </div>
            )}
            {!proximoMonto && contratoSeleccionado && (
              <p className="text-xs text-gray-400 mt-2">
                {valorizaciones.filter((v) => v.contrato_id === contratoSeleccionado.id).length === 0
                  ? "Sin valorizaciones asignadas a este contrato"
                  : "Todas las valorizaciones cobradas"}
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Avance del contrato</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{avanceContrato.toFixed(2)}%</p>
                <p className="text-xs text-gray-400 mt-1">Cobrado: {formatCOP(totalCobradoContrato)}</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-100">
                <Target className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Avance del contrato + Resumen financiero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Avance del contrato</h3>
                <p className="text-sm text-gray-500">
                  {contratoSeleccionado?.nombre?.substring(0, 55) || "Contrato"} · Costo directo: {formatCOP(costoDirectoContrato)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{avanceContrato.toFixed(2)}%</p>
                <p className="text-xs text-gray-500">avance acumulado</p>
              </div>
            </div>

            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden mb-6">
              <div
                className="absolute left-0 top-0 h-full bg-gray-900 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(avanceContrato, 100)}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Cobrado</p>
                <p className="text-xl font-bold text-gray-900">{formatCOP(totalCobradoContrato)}</p>
                <p className="text-xs text-emerald-600 mt-1">{avanceContrato.toFixed(2)}% del total</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Saldo por cobrar</p>
                <p className="text-xl font-bold text-gray-900">{formatCOP(Math.max(0, montoContrato - totalCobradoContrato))}</p>
                <p className="text-xs text-amber-600 mt-1">{(100 - avanceContrato).toFixed(2)}% del total</p>
              </div>
            </div>

            {/* Próxima valorización */}
            {proximaVal && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Próxima a cobrar
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-700">
                    {proximaVal.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <p className="text-[10px] text-gray-400">Costo directo</p>
                    <p className="text-sm font-semibold">{formatCOP(Number(proximaVal.costoDirecto))}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">IGV (18%)</p>
                    <p className="text-sm font-semibold text-blue-600">+ {formatCOP(Number(proximaVal.igv))}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Garantía (5%)</p>
                    <p className="text-sm font-semibold text-amber-600">– {formatCOP(Number(proximaVal.garantia))}</p>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-2">
                    <p className="text-[10px] text-gray-400">Neto a cobrar</p>
                    <p className="text-sm font-bold text-teal-700">{formatCOP(Number(proximaVal.netoCobrar))}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Si no hay próxima pero sí hay displayVal cobrada */}
            {!proximaVal && displayVal && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Última valorización
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700">
                    Cobrada
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <p className="text-[10px] text-gray-400">Costo directo</p>
                    <p className="text-sm font-semibold">{formatCOP(Number(displayVal.costoDirecto))}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">IGV (18%)</p>
                    <p className="text-sm font-semibold text-blue-600">+ {formatCOP(Number(displayVal.igv))}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Garantía (5%)</p>
                    <p className="text-sm font-semibold text-amber-600">– {formatCOP(Number(displayVal.garantia))}</p>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-2">
                    <p className="text-[10px] text-gray-400">Neto a cobrar</p>
                    <p className="text-sm font-bold text-teal-700">{formatCOP(Number(displayVal.netoCobrar))}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Resumen financiero */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Resumen financiero</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <span className="text-sm text-gray-600">Cobrado hasta hoy</span>
                  <p className="text-xs text-gray-400">{contratosCobrados.length} contratos ejecutados</p>
                </div>
                <span className="font-semibold text-emerald-700">{formatCOP(totalHistoricoCobrado)}</span>
              </div>

              {totalCobradoContrato > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <span className="text-sm text-gray-600">Cobrado de este contrato</span>
                    <p className="text-xs text-gray-400">{avanceContrato.toFixed(1)}% del total</p>
                  </div>
                  <span className="font-semibold text-emerald-700">{formatCOP(totalCobradoContrato)}</span>
                </div>
              )}

              {proximaVal && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <span className="text-sm text-gray-600">Próxima valorización</span>
                    <p className="text-xs text-amber-500 font-medium">
                      {proximaVal.status} · Por cobrar
                    </p>
                  </div>
                  <span className="font-semibold text-amber-700">{formatCOP(proximoMonto)}</span>
                </div>
              )}

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <span className="text-sm text-gray-600">Saldo por cobrar del contrato</span>
                  <p className="text-xs text-gray-400">{(100 - avanceContrato).toFixed(2)}% restante</p>
                </div>
                <span className="font-semibold text-gray-600">
                  {formatCOP(Math.max(0, montoContrato - totalCobradoContrato))}
                </span>
              </div>

              {garantiaContrato > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <span className="text-sm text-gray-600">Garantía retenida</span>
                    <p className="text-xs text-gray-400">Se libera al cierre</p>
                  </div>
                  <span className="font-semibold text-gray-500">{formatCOP(garantiaContrato)}</span>
                </div>
              )}

              <div className="flex justify-between items-center py-3 border-t-2 border-gray-200 mt-2">
                <div>
                  <span className="text-sm font-semibold text-gray-900">Total contratado (todos los proyectos)</span>
                  <p className="text-xs text-gray-400">{contratos.length} contratos registrados en BD</p>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {formatCOP(contratos.reduce((sum, c) => sum + Number(c.monto), 0))}
                </span>
              </div>
            </div>

            {tieneCostos && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Desglose de costos reales</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Materiales</span>
                    <span className="font-medium">{formatCOP(totalMateriales)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Mano de obra</span>
                    <span className="font-medium">{formatCOP(totalManoObra)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Otros gastos</span>
                    <span className="font-medium">{formatCOP(totalOtros)}</span>
                  </div>
                  <div className="h-px bg-gray-100 my-2" />
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Costo total</span>
                    <span>{formatCOP(totalCostos)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabla de contratos */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Receipt className="h-5 w-5 text-gray-600" />
            <h3 className="text-base font-semibold text-gray-900">Historial de contratos</h3>
            <span className="text-sm text-gray-500">{contratos.length} contratos</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 text-gray-500 font-medium">Fecha</th>
                  <th className="text-left py-3 text-gray-500 font-medium">Concepto</th>
                  <th className="text-center py-3 text-gray-500 font-medium">Tipo</th>
                  <th className="text-right py-3 text-gray-500 font-medium">Monto</th>
                  <th className="text-center py-3 text-gray-500 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {contratos.map((c, idx) => (
                  <tr
                    key={c.id || idx}
                    className={`border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                      c.id === selectedContratoId ? "bg-blue-50/30" : ""
                    } ${c.estado === "PENDIENTE" ? "bg-amber-50/20" : ""}`}
                    onClick={() => setSelectedContratoId(c.id)}
                  >
                    <td className="py-2.5 text-gray-600">{new Date(c.fecha).toLocaleDateString("es-PE")}</td>
                    <td className="py-2.5 text-gray-800 font-medium">{c.nombre}</td>
                    <td className="py-2.5 text-center">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{c.tipo}</span>
                    </td>
                    <td className="py-2.5 text-right font-medium">{formatCOP(Number(c.monto))}</td>
                    <td className="py-2.5 text-center">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          c.estado === "COBRADO"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {c.estado === "COBRADO" ? "Cobrado" : "Pendiente"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-gray-200 bg-gray-50">
                <tr>
                  <td colSpan={3} className="py-3 pl-2 font-semibold text-gray-900">TOTAL</td>
                  <td className="py-3 text-right font-bold text-gray-900">
                    {formatCOP(contratos.reduce((sum, c) => sum + Number(c.monto), 0))}
                  </td>
                  <td />
                </tr>
                <tr>
                  <td colSpan={3} className="pb-2 pl-2 text-xs text-gray-500">Cobrado</td>
                  <td className="pb-2 text-right text-xs font-semibold text-emerald-700">
                    {formatCOP(totalHistoricoCobrado)}
                  </td>
                  <td />
                </tr>
                <tr>
                  <td colSpan={3} className="pb-3 pl-2 text-xs text-gray-500">Pendiente de cobro</td>
                  <td className="pb-3 text-right text-xs font-semibold text-amber-700">
                    {formatCOP(totalPorCobrar)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Flujo de caja */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-gray-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Flujo de caja (histórico + proyectado)</h3>
          </div>
          {cashFlowData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={cashFlowData} margin={{ bottom: 70 }}>
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: "#94a3b8" }}
                  interval={0}
                  angle={-50}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickFormatter={(v) => formatCompact(v)}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload?.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-100 text-sm max-w-[220px]">
                          <p className="font-semibold text-gray-900 text-xs leading-tight mb-1">{data.nombre}</p>
                          <p className="text-gray-500 text-xs mb-1">{data.fecha} · {data.tipo}</p>
                          <p className="font-bold text-gray-900">{formatCOP(data.monto)}</p>
                          <p className={`text-xs mt-1 font-medium ${data.estado === "COBRADO" ? "text-emerald-600" : "text-amber-600"}`}>
                            {data.estado === "COBRADO" ? "✓ Cobrado" : "⏳ Pendiente"}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="monto" radius={[4, 4, 0, 0]} barSize={28}>
                  {cashFlowData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.estado === "COBRADO" ? "#1e293b" : "#f59e0b"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">No hay datos de contratos disponibles</p>
          )}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-gray-800 inline-block" />
                Cobrado ({contratosCobrados.length})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" />
                Pendiente ({contratosPendientes.length})
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Próximo cobro:{" "}
                <span className="font-semibold text-amber-600">
                  {proximoMonto > 0 ? formatCOP(proximoMonto) : "—"}
                </span>
              </p>
              {proximaVal && (
                <p className="text-xs text-gray-500">
                  {ultimaValPeriodo.substring(0, 30)} · {selectedProject?.client?.split(" ")[0] || "Cliente"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Gráficos: Personal + Distribución */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-gray-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Personal por rol ({totalWorkers} personas)</h3>
            </div>
            {roleChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={roleChartData} layout="vertical">
                  <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    width={80}
                  />
                  <Tooltip formatter={(value) => [`${value} personas`, "Cantidad"]} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16} fill="#1e293b" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">No hay datos de personal disponibles</p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-gray-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Distribución por tipo</h3>
            </div>
            {contratosCobrados.length > 0 ? (
              (() => {
                const porTipo = contratosCobrados.reduce((acc, c) => {
                  acc[c.tipo] = (acc[c.tipo] || 0) + Number(c.monto);
                  return acc;
                }, {} as Record<string, number>);
                const pieData = Object.entries(porTipo).map(([name, value]) => ({ name, value }));
                const COLORS = ["#1e293b", "#475569", "#64748b", "#94a3b8"];
                return (
                  <>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          dataKey="value"
                          label={({ name, percent }) => {
                            // 🔥 CORRECCIÓN: verificamos que percent no sea undefined
                            const pct = percent ? (percent * 100).toFixed(0) : 0;
                            return `${name} ${pct}%`;
                          }}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCOP(value as number)} />
                      </PieChart>
                    </ResponsiveContainer>
                    <p className="text-xs text-gray-400 text-center mb-2">
                      Solo contratos cobrados · {formatCOP(totalHistoricoCobrado)}
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                      {pieData.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          <span className="text-xs text-gray-600">{item.name}</span>
                          <span className="text-xs font-semibold">{formatCOP(item.value)}</span>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">No hay datos disponibles</p>
            )}
          </div>
        </div>

        {/* Trabajos + Alertas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Wrench className="h-4 w-4 text-gray-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Trabajos ejecutados</h3>
              <span className="text-sm text-gray-500">{trabajos.length} partidas</span>
            </div>
            {trabajos.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {trabajos.map((t, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-gray-50 text-gray-700 text-sm rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                    {t.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">No hay trabajos registrados</p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Alertas activas</h3>
              {alertasUrgentes > 0 && (
                <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
                  {alertasUrgentes} urgentes
                </span>
              )}
            </div>
            {alertas.length > 0 ? (
              <div className="space-y-3">
                {alertas.slice(0, 3).map((a, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{a.title}</p>
                      <p className="text-xs text-gray-600">{a.description}</p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700">
                      {a.priority === "ALTA" ? "Urgente" : "Media"}
                    </span>
                  </div>
                ))}
                {alertas.length > 3 && (
                  <p className="text-xs text-gray-500 text-center pt-2">+{alertas.length - 3} alertas más</p>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-2" />
                <p className="text-gray-500">Sin alertas activas</p>
              </div>
            )}
          </div>
        </div>

        {/* Personal operativo + Dirección */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Hammer className="h-5 w-5 text-gray-600" />
                <h3 className="text-base font-semibold text-gray-900">Personal operativo</h3>
                <span className="text-sm text-gray-500">{workers.length} personas</span>
              </div>
              <button onClick={() => setShowAllWorkers(!showAllWorkers)} className="text-xs text-gray-500 hover:text-gray-700">
                {showAllWorkers ? "Mostrar menos" : "Ver todos"}
              </button>
            </div>
            {workers.length > 0 ? (
              <div className={`overflow-hidden transition-all ${showAllWorkers ? "" : "max-h-64"}`}>
                <div className="space-y-2">
                  {(showAllWorkers ? workers : workers.slice(0, 6)).map((w, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">{w.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{w.name}</p>
                          <p className="text-xs text-gray-500">{w.role}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{w.location}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">No hay personal registrado</p>
            )}
            {workers.length > 6 && !showAllWorkers && (
              <div className="text-center pt-3">
                <p className="text-xs text-gray-400">+{workers.length - 6} personas más</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-gray-600" />
              <h3 className="text-base font-semibold text-gray-900">Dirección y supervisión</h3>
              <span className="text-sm text-gray-500">{direccion.length} personas</span>
            </div>
            {direccion.length > 0 ? (
              <div className="space-y-2">
                {direccion.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-violet-700">{p.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.role}</p>
                      </div>
                    </div>
                    <span className="text-xs text-violet-500">{p.location}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">No hay datos de dirección registrados</p>
            )}
          </div>
        </div>

        {/* Hitos del proyecto */}
        {hitos.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-gray-600" />
              <h3 className="text-base font-semibold text-gray-900">Próximos hitos</h3>
            </div>
            <div className="space-y-4">
              {hitos.map((h, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-1 h-12 rounded-full mt-1" style={{ background: h.acento || "#1e293b" }} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{h.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{h.description}</p>
                    {h.badge && (
                      <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-2 ${getBadgeClass(h.badge_color || "blue")}`}>
                        {h.badge}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <a
            href="/costos"
            className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Registrar costos reales
          </a>
          <a
            href="/valorizaciones"
            className="px-5 py-2.5 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <Receipt className="h-4 w-4" />
            Nueva valorización
          </a>
        </div>

      </main>
    </div>
  );
}