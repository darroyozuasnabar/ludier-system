"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Wrench,
  Target,
  Banknote,
  ShieldCheck,
  ChevronRight,
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

// ──────────────────────────────────────────────────────────────────────────────
// Cliente Supabase
// ──────────────────────────────────────────────────────────────────────────────
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────
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

// ──────────────────────────────────────────────────────────────────────────────
// CONTRATOS REALES — 10 contratos corregidos
// Regla: COBRADO = ya ingresó dinero. PENDIENTE = aún no cobrado.
//
// Contratos cobrados (8):
//   Carpintería metálica Qantua   178,926.10
//   Desmontaje malla Raschell       1,200.00
//   Adicionales Zendai             56,370.00
//   Techos metálicos y cercos       5,470.00
//   Apoyo operativo especializado  18,668.72
//   Cerco perimetral Fase 2        55,000.00
//   Desmontaje y montaje cerco     18,000.00
//   Cerramiento y mantenimiento    16,600.00
//   TOTAL COBRADO                 350,234.82  ← suma real de los 8
//
// Contratos pendientes (2):
//   Desmontaje y retiro chutes      1,300.00  (servicio pendiente)
//   Contrato Qantua Fase 2        543,667.29  (total del contrato de valorizaciones)
//
// NOTA: La Valorización N°01 (S/91,361.50 neto) está PENDIENTE de cobro y forma
// parte del "Contrato Qantua Fase 2". No se muestra como una fila separada porque
// ya está contenida en ese contrato; se detalla en la sección "Avance del contrato".
// ──────────────────────────────────────────────────────────────────────────────
const CONTRATOS_REALES = [
  {
    id: 1,
    nombre: "Carpintería metálica Qantua",
    monto: 178926.10,
    fecha: "2025-11-11",
    estado: "COBRADO",
    tipo: "CONTRATO",
  },
  {
    id: 2,
    nombre: "Desmontaje malla Raschell",
    monto: 1200.00,
    fecha: "2026-01-07",
    estado: "COBRADO",
    tipo: "SERVICIO",
  },
  {
    id: 3,
    nombre: "Adicionales Zendai",
    monto: 56370.00,
    fecha: "2026-02-27",
    estado: "COBRADO",
    tipo: "ADENDA",
  },
  {
    id: 4,
    nombre: "Techos metálicos y cercos",
    monto: 5470.00,
    fecha: "2026-03-03",
    estado: "COBRADO",
    tipo: "ADENDA",
  },
  {
    id: 5,
    nombre: "Apoyo operativo especializado",
    monto: 18668.72,
    fecha: "2026-03-23",
    estado: "COBRADO",
    tipo: "SERVICIO",
  },
  {
    id: 6,
    nombre: "Cerco perimetral Fase 2",
    monto: 55000.00,
    fecha: "2026-04-09",
    estado: "COBRADO",
    tipo: "CONTRATO",
  },
  {
    id: 7,
    nombre: "Desmontaje y retiro chutes",
    monto: 1300.00,
    fecha: "2026-04-30",
    estado: "PENDIENTE",
    tipo: "SERVICIO",
  },
  {
    id: 8,
    nombre: "Desmontaje y montaje cerco",
    monto: 18000.00,
    fecha: "2026-05-11",
    estado: "COBRADO",
    tipo: "SERVICIO",
  },
  {
    id: 9,
    nombre: "Cerramiento y mantenimiento",
    monto: 16600.00,
    fecha: "2026-05-11",
    estado: "COBRADO",
    tipo: "SERVICIO",
  },
  {
    id: 10,
    nombre: "Contrato Qantua Fase 2",
    monto: 543667.29,
    fecha: "2026-05-29",
    estado: "PENDIENTE",
    tipo: "VALORIZACION",
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// Componente Principal
// ──────────────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [showAllWorkers, setShowAllWorkers] = useState(false);

  // Datos desde Supabase
  const [project, setProject] = useState<any>(null);
  const [contratoConfig, setContratoConfig] = useState<any>(null);
  const [workers, setWorkers] = useState<any[]>([]);
  const [direccion, setDireccion] = useState<any[]>([]);
  const [valorizaciones, setValorizaciones] = useState<any[]>([]);
  const [alertas, setAlertas] = useState<any[]>([]);
  const [hitos, setHitos] = useState<any[]>([]);
  const [trabajos, setTrabajos] = useState<any[]>([]);
  const [costos, setCostos] = useState<any[]>([]);

  const contratos = CONTRATOS_REALES;

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") loadData();
  }, [status, router]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: projectData } = await supabase
        .from("Project")
        .select("*")
        .eq("name", "Qantua - Fase 02")
        .maybeSingle();
      setProject(projectData);

      if (projectData) {
        const projectId = projectData.id;

        const { data: configData } = await supabase
          .from("ConfiguracionContrato")
          .select("*")
          .eq("project_id", projectId)
          .maybeSingle();
        setContratoConfig(configData);

        const { data: valData } = await supabase
          .from("Valorizacion")
          .select("*")
          .eq("projectId", projectId)
          .order("fechaEmision", { ascending: false });
        setValorizaciones(valData || []);

        const { data: alertData } = await supabase
          .from("Alert")
          .select("*")
          .eq("projectId", projectId)
          .order("priority", { ascending: false });
        setAlertas(alertData || []);

        const { data: costosData } = await supabase
          .from("CostoReal")
          .select("*")
          .eq("projectId", projectId);
        setCostos(costosData || []);

        const { data: hitosData } = await supabase
          .from("Hito")
          .select("*")
          .eq("project_id", projectId)
          .order("orden", { ascending: true });
        setHitos(hitosData || []);

        const { data: trabajosData } = await supabase
          .from("Trabajo")
          .select("*")
          .eq("project_id", projectId)
          .order("orden", { ascending: true });
        setTrabajos(trabajosData || []);
      }

      const { data: workersData } = await supabase
        .from("Worker")
        .select("*")
        .order("name");

      if (workersData) {
        const managementRoles = ["Dirección", "Coordinación", "Oficina"];
        setWorkers(
          workersData.filter(
            (w: any) => !managementRoles.includes(w.location)
          )
        );
        setDireccion(
          workersData.filter((w: any) => managementRoles.includes(w.location))
        );
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
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

  // ────────────────────────────────────────────────────────────────────────────
  // CÁLCULOS FINANCIEROS CORREGIDOS
  // ────────────────────────────────────────────────────────────────────────────

  // Solo contratos donde ya entró el dinero (excluye PENDIENTE)
  const contratosCobrados = contratos.filter((c) => c.estado === "COBRADO");
  const totalHistoricoCobrado = contratosCobrados.reduce(
    (sum, c) => sum + c.monto,
    0
  );
  // = 178,926.10 + 1,200 + 56,370 + 5,470 + 18,668.72 + 55,000 + 18,000 + 16,600
  // = 350,234.82

  // Contratos pendientes de cobro
  const contratosPendientes = contratos.filter((c) => c.estado === "PENDIENTE");
  const totalPorCobrar = contratosPendientes.reduce(
    (sum, c) => sum + c.monto,
    0
  );
  // = 1,300 (chutes) + 543,667.29 (Qantua F2 total) = 544,967.29
  // PERO para el resumen financiero mostramos solo la próxima cobranza real:
  // Val. N°01 neto = S/ 91,361.50 (que se cobra el viernes 29/05)

  // Configuración del contrato Qantua F2 (desde BD)
  const totalContratoQantua = contratoConfig?.total_pagar || 543667.29;
  const garantiaTotal = contratoConfig?.garantia || 28614.07;
  const costoDirectoTotal = contratoConfig?.costo_directo || 484984.20;

  // Última valorización (desde BD) — Val. N°01, Marzo 2026
  const ultimaVal = valorizaciones[0];
  const avancePorcentaje = ultimaVal ? Number(ultimaVal.avancePct) : 0;
  // = 16.80%
  const netoCobrarVal01 = ultimaVal ? Number(ultimaVal.netoCobrar) : 0;
  // = 91,361.50
  const ultimaValPeriodo = ultimaVal?.period || "Sin valorizaciones";

  // Próxima cobranza real = Val. N°01 neto (status PENDIENTE en BD, se cobra 29/05)
  const proximoMonto = netoCobrarVal01;
  const proximaFecha = "viernes 29 de mayo de 2026";

  // Costos reales (desde tabla CostoReal)
  const totalMateriales = costos.reduce(
    (sum, c) =>
      sum + Number(c.fierro) + Number(c.pintura) + Number(c.galvanizado),
    0
  );
  const totalManoObra = costos.reduce((sum, c) => sum + Number(c.manoObra), 0);
  const totalOtros = costos.reduce(
    (sum, c) =>
      sum +
      Number(c.transporte) +
      Number(c.instalacion) +
      Number(c.desperdicio) +
      Number(c.retrabajos),
    0
  );
  const totalCostos = totalMateriales + totalManoObra + totalOtros;
  const tieneCostos = totalCostos > 0;
  const margenBruto = tieneCostos
    ? (ultimaVal?.costoDirecto || 0) - totalCostos
    : 0;
  const margenPorcentaje =
    tieneCostos && ultimaVal?.costoDirecto
      ? (margenBruto / Number(ultimaVal.costoDirecto)) * 100
      : 0;

  // ────────────────────────────────────────────────────────────────────────────
  // FLUJO DE CAJA
  // Muestra los 10 contratos ordenados cronológicamente.
  // Para el contrato "Qantua Fase 2" (PENDIENTE) usamos el neto de la Val. N°01
  // cashFlowData: exactamente los mismos 10 contratos que la tabla,
  // en el mismo orden cronológico, con los mismos montos y estados.
  // Usamos "#N dd mmm" como label del eje X para que cada barra sea única,
  // incluso cuando dos contratos caen en la misma fecha (ej: 10/05).
  const cashFlowData = [...contratos]
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    .map((c, idx) => {
      const d = new Date(c.fecha);
      const mesCorto = d.toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
      });
      return {
        label: `#${idx + 1} ${mesCorto}`,
        monto: c.monto,
        estado: c.estado,
        nombre: c.nombre,
        tipo: c.tipo,
        fecha: new Date(c.fecha).toLocaleDateString("es-PE"),
        id: c.id,
      };
    });

  const alertasUrgentes = alertas.filter((a) => a.priority === "ALTA").length;

  const workersByRole = workers.reduce((acc: any, w) => {
    acc[w.role] = (acc[w.role] || 0) + 1;
    return acc;
  }, {});
  const roleChartData = Object.entries(workersByRole).map(
    ([role, count]) => ({
      name: role,
      value: count,
    })
  );

  const totalWorkers = workers.length + direccion.length;

  // ────────────────────────────────────────────────────────────────────────────
  // RESUMEN FINANCIERO — lógica corregida
  //
  // "Total contratos ejecutados" = dinero YA cobrado (8 contratos) = S/ 350,234.82
  // "Por cobrar inmediato"       = Val. N°01 neta (viernes 29/05) = S/ 91,361.50
  // "Otros pendientes"           = chutes S/ 1,300 + saldo Qantua F2
  // "Garantía retenida"          = S/ 28,614.07 (se libera al cierre del contrato)
  // ────────────────────────────────────────────────────────────────────────────
  const saldoQantuaF2 =
    totalContratoQantua - netoCobrarVal01 - (contratoConfig?.historico_cobrado || 0);

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
                <p className="text-xs text-gray-500">
                  Panel de control ejecutivo
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {session.user?.name || "Administrador"}
                </p>
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
        {/* KPIs principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Histórico cobrado — solo los 8 contratos con dinero real */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Histórico cobrado
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatCOP(totalHistoricoCobrado)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {contratosCobrados.length} contratos ejecutados
                </p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Contrato Qantua F2 */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Contrato Qantua F2
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatCOP(totalContratoQantua)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Garantía: {formatCOP(garantiaTotal)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Próxima cobranza — Val. N°01 neto, viernes 29/05 */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Próxima cobranza
                </p>
                <p className="text-2xl font-bold text-amber-700 mt-2">
                  {formatCOP(proximoMonto)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Val. N°01 neta · {proximaFecha}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50">
                <Banknote className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-medium px-2 py-1 rounded-full">
              <Calendar className="h-3 w-3" />
              Viernes 29 mayo · LAR
            </div>
          </div>

          {/* Margen estimado */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Margen estimado
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {tieneCostos ? formatCOP(margenBruto) : "—"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {tieneCostos
                    ? `${margenPorcentaje.toFixed(1)}% sobre ingreso`
                    : "Registra costos reales"}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-100">
                <Target className="h-5 w-5 text-gray-600" />
              </div>
            </div>
            {!tieneCostos && (
              <div className="mt-3 text-xs text-amber-600 font-medium">
                ⚠ Completar en /costos
              </div>
            )}
          </div>
        </div>

        {/* Avance del contrato + Resumen financiero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── Avance del contrato ──
              Muestra el progreso de la Valorización del contrato Qantua F2.
              Val. N°01 = 16.80% avance, S/81,500 costo directo valorizado.
              Saldo = 83.20% restante = S/403,484.20.
              El neto a cobrar de Val. N°01 es S/91,361.50 (se cobra el 29/05). */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Avance del contrato
                </h3>
                <p className="text-sm text-gray-500">
                  Qantua Fase 02 · Costo directo: {formatCOP(costoDirectoTotal)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {avancePorcentaje.toFixed(2)}%
                </p>
                <p className="text-xs text-gray-500">avance acumulado</p>
              </div>
            </div>

            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden mb-6">
              <div
                className="absolute left-0 top-0 h-full bg-gray-900 rounded-full transition-all duration-500"
                style={{ width: `${avancePorcentaje}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Valorizado (Val. N°01)</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCOP(ultimaVal?.costoDirecto || 0)}
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  {avancePorcentaje}% del total
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Saldo por valorizar</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCOP(costoDirectoTotal - (ultimaVal?.costoDirecto || 0))}
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  {(100 - avancePorcentaje).toFixed(2)}% del total
                </p>
              </div>
            </div>

            {/* Detalle de la última valorización */}
            {ultimaVal && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Val. N°01 · {ultimaValPeriodo}
                  </p>
                  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                    Cobro viernes 29/05
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <p className="text-[10px] text-gray-400">Costo directo</p>
                    <p className="text-sm font-semibold">
                      {formatCOP(Number(ultimaVal.costoDirecto))}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">IGV (18%)</p>
                    <p className="text-sm font-semibold text-blue-600">
                      + {formatCOP(Number(ultimaVal.igv))}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Garantía (5%)</p>
                    <p className="text-sm font-semibold text-amber-600">
                      – {formatCOP(Number(ultimaVal.garantia))}
                    </p>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-2">
                    <p className="text-[10px] text-gray-400">Neto a cobrar</p>
                    <p className="text-sm font-bold text-teal-700">
                      {formatCOP(Number(ultimaVal.netoCobrar))}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Resumen financiero ──
              Muestra la fotografía financiera real:
              - Cobrado = 8 contratos ya pagados
              - Próximo cobro = Val. N°01 neta (viernes 29/05)
              - Pendiente adicional = chutes S/1,300 + saldo Qantua F2
              - Garantía retenida = S/28,614.07 (se libera al final)
              - Total general = todo lo que LUDIER facturará con este cliente */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Resumen financiero
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <span className="text-sm text-gray-600">
                    Cobrado hasta hoy
                  </span>
                  <p className="text-xs text-gray-400">
                    {contratosCobrados.length} contratos ejecutados
                  </p>
                </div>
                <span className="font-semibold text-emerald-700">
                  {formatCOP(totalHistoricoCobrado)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <span className="text-sm text-gray-600">
                    Val. N°01 · Cobro viernes 29/05
                  </span>
                  <p className="text-xs text-amber-500 font-medium">
                    Pendiente de cobro
                  </p>
                </div>
                <span className="font-semibold text-amber-700">
                  {formatCOP(netoCobrarVal01)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <span className="text-sm text-gray-600">
                    Desmontaje chutes (pendiente)
                  </span>
                  <p className="text-xs text-gray-400">Por confirmar cobro</p>
                </div>
                <span className="font-semibold text-gray-500">
                  {formatCOP(1300)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <span className="text-sm text-gray-600">
                    Saldo Qantua F2 (Val. N°02 en adelante)
                  </span>
                  <p className="text-xs text-gray-400">
                    83.20% restante por valorizar
                  </p>
                </div>
                <span className="font-semibold text-gray-600">
                  {formatCOP(costoDirectoTotal - (ultimaVal?.costoDirecto || 0))}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <span className="text-sm text-gray-600">
                    Garantía retenida
                  </span>
                  <p className="text-xs text-gray-400">Se libera al cierre</p>
                </div>
                <span className="font-semibold text-gray-500">
                  {formatCOP(garantiaTotal)}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-t-2 border-gray-200 mt-2">
                <div>
                  <span className="text-sm font-semibold text-gray-900">
                    Total facturado (contratos + Qantua F2)
                  </span>
                  <p className="text-xs text-gray-400">
                    Incluyendo saldo por valorizar
                  </p>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {formatCOP(
                    totalHistoricoCobrado +
                      netoCobrarVal01 +
                      1300 +
                      (costoDirectoTotal - (ultimaVal?.costoDirecto || 0))
                  )}
                </span>
              </div>
            </div>

            {tieneCostos && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">
                  Desglose de costos reales
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Materiales</span>
                    <span className="font-medium">
                      {formatCOP(totalMateriales)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Mano de obra</span>
                    <span className="font-medium">
                      {formatCOP(totalManoObra)}
                    </span>
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

        {/* ── Tabla de contratos — 10 filas, orden cronológico ── */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Receipt className="h-5 w-5 text-gray-600" />
            <h3 className="text-base font-semibold text-gray-900">
              Historial de contratos
            </h3>
            <span className="text-sm text-gray-500">
              {contratos.length} contratos
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 text-gray-500 font-medium">
                    Fecha
                  </th>
                  <th className="text-left py-3 text-gray-500 font-medium">
                    Concepto
                  </th>
                  <th className="text-center py-3 text-gray-500 font-medium">
                    Tipo
                  </th>
                  <th className="text-right py-3 text-gray-500 font-medium">
                    Monto
                  </th>
                  <th className="text-center py-3 text-gray-500 font-medium">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...contratos]
                  .sort(
                    (a, b) =>
                      new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
                  )
                  .map((c, idx) => (
                    <tr
                      key={idx}
                      className={`border-b border-gray-50 hover:bg-gray-50 ${
                        c.estado === "PENDIENTE" ? "bg-amber-50/30" : ""
                      }`}
                    >
                      <td className="py-2.5 text-gray-600">
                        {new Date(c.fecha).toLocaleDateString("es-PE")}
                      </td>
                      <td className="py-2.5 text-gray-800 font-medium">
                        {c.nombre}
                      </td>
                      <td className="py-2.5 text-center">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {c.tipo}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-medium">
                        {formatCOP(c.monto)}
                      </td>
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
                  <td
                    colSpan={3}
                    className="py-3 pl-2 font-semibold text-gray-900"
                  >
                    TOTAL
                  </td>
                  <td className="py-3 text-right font-bold text-gray-900">
                    {formatCOP(contratos.reduce((sum, c) => sum + c.monto, 0))}
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan={3} className="pb-2 pl-2 text-xs text-gray-500">
                    Cobrado
                  </td>
                  <td className="pb-2 text-right text-xs font-semibold text-emerald-700">
                    {formatCOP(totalHistoricoCobrado)}
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan={3} className="pb-3 pl-2 text-xs text-gray-500">
                    Pendiente de cobro
                  </td>
                  <td className="pb-3 text-right text-xs font-semibold text-amber-700">
                    {formatCOP(totalPorCobrar)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Flujo de caja: 10 barras = 10 contratos, mismo orden y montos que la tabla */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-gray-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">
              Flujo de caja (histórico + proyectado)
            </h3>
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
                          <p className="font-semibold text-gray-900 text-xs leading-tight mb-1">
                            {data.nombre}
                          </p>
                          <p className="text-gray-500 text-xs mb-1">{data.fecha} · {data.tipo}</p>
                          <p className="font-bold text-gray-900">
                            {formatCOP(data.monto)}
                          </p>
                          <p
                            className={`text-xs mt-1 font-medium ${
                              data.estado === "COBRADO"
                                ? "text-emerald-600"
                                : "text-amber-600"
                            }`}
                          >
                            {data.estado === "COBRADO" ? "✓ Cobrado" : "⏳ Pendiente"}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="monto"
                  radius={[4, 4, 0, 0]}
                  barSize={28}
                >
                  {cashFlowData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.estado === "COBRADO" ? "#1e293b" : "#f59e0b"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">
              No hay datos de contratos disponibles
            </p>
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
                  {formatCOP(proximoMonto)}
                </span>
              </p>
              <p className="text-xs text-gray-500">
                Val. N°01 · Viernes 29 mayo · LAR
              </p>
            </div>
          </div>
        </div>

        {/* Gráficos: Distribución + Personal por rol */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal por rol */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-gray-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                Personal por rol ({totalWorkers} personas)
              </h3>
            </div>
            {roleChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={roleChartData} layout="vertical">
                  <XAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    width={80}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} personas`, "Cantidad"]}
                  />
                  <Bar
                    dataKey="value"
                    radius={[0, 4, 4, 0]}
                    barSize={16}
                    fill="#1e293b"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">
                No hay datos de personal disponibles
              </p>
            )}
          </div>

          {/* Distribución de ingresos por tipo de contrato */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-gray-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                Distribución por tipo
              </h3>
            </div>
            {contratos.length > 0 ? (
              (() => {
                // Solo contratos cobrados para la distribución real
                const porTipo = contratosCobrados.reduce((acc, c) => {
                  acc[c.tipo] = (acc[c.tipo] || 0) + c.monto;
                  return acc;
                }, {} as Record<string, number>);
                const pieData = Object.entries(porTipo).map(
                  ([name, value]) => ({ name, value })
                );
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
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => formatCOP(value as number)}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <p className="text-xs text-gray-400 text-center mb-2">
                      Solo contratos cobrados · {formatCOP(totalHistoricoCobrado)}
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                      {pieData.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: COLORS[i % COLORS.length],
                            }}
                          />
                          <span className="text-xs text-gray-600">
                            {item.name}
                          </span>
                          <span className="text-xs font-semibold">
                            {formatCOP(item.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">
                No hay datos disponibles
              </p>
            )}
          </div>
        </div>

        {/* Trabajos ejecutados + Alertas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Wrench className="h-4 w-4 text-gray-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                Trabajos ejecutados
              </h3>
              <span className="text-sm text-gray-500">
                {trabajos.length} partidas
              </span>
            </div>
            {trabajos.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {trabajos.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-gray-50 text-gray-700 text-sm rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">
                No hay trabajos registrados
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                Alertas activas
              </h3>
              {alertasUrgentes > 0 && (
                <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
                  {alertasUrgentes} urgentes
                </span>
              )}
            </div>
            {alertas.length > 0 ? (
              <div className="space-y-3">
                {alertas.map((a, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {a.title}
                      </p>
                      <p className="text-xs text-gray-600">{a.description}</p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700">
                      {a.priority === "ALTA" ? "Urgente" : "Media"}
                    </span>
                  </div>
                ))}
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
                <h3 className="text-base font-semibold text-gray-900">
                  Personal operativo
                </h3>
                <span className="text-sm text-gray-500">
                  {workers.length} personas
                </span>
              </div>
              <button
                onClick={() => setShowAllWorkers(!showAllWorkers)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                {showAllWorkers ? "Mostrar menos" : "Ver todos"}
              </button>
            </div>
            {workers.length > 0 ? (
              <div
                className={`overflow-hidden transition-all ${
                  showAllWorkers ? "" : "max-h-64"
                }`}
              >
                <div className="space-y-2">
                  {workers.map((w, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {w.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {w.name}
                          </p>
                          <p className="text-xs text-gray-500">{w.role}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {w.location}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">
                No hay personal registrado
              </p>
            )}
            {workers.length > 6 && !showAllWorkers && (
              <div className="text-center pt-3">
                <p className="text-xs text-gray-400">
                  +{workers.length - 6} personas más
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-gray-600" />
              <h3 className="text-base font-semibold text-gray-900">
                Dirección y supervisión
              </h3>
              <span className="text-sm text-gray-500">
                {direccion.length} personas
              </span>
            </div>
            {direccion.length > 0 ? (
              <div className="space-y-2">
                {direccion.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-violet-700">
                          {p.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {p.name}
                        </p>
                        <p className="text-xs text-gray-500">{p.role}</p>
                      </div>
                    </div>
                    <span className="text-xs text-violet-500">
                      {p.location}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">
                No hay datos de dirección registrados
              </p>
            )}
          </div>
        </div>

        {/* Hitos del proyecto */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-gray-600" />
            <h3 className="text-base font-semibold text-gray-900">
              Próximos hitos
            </h3>
          </div>
          {hitos.length > 0 ? (
            <div className="space-y-4">
              {hitos.map((h, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div
                    className="w-1 h-12 rounded-full mt-1"
                    style={{ background: h.acento }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {h.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {h.description}
                    </p>
                    <span
                      className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-2 ${getBadgeClass(
                        h.badge_color
                      )}`}
                    >
                      {h.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">
              No hay hitos programados
            </p>
          )}
        </div>

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