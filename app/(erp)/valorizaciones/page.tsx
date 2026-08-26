"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Receipt,
  TrendingUp,
  Calendar,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Pencil,
  FileText,
  Download,
  Upload,
  X,
  Building2,
  Save,
  Link2,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { FacturaElectronicaButton } from "@/components/FacturaElectronicaButton";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const formatCOP = (v: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(v);

const ESTADOS = [
  { key: "BORRADOR",  label: "Borrador",  color: "gray",   desc: "Documento subido, datos extraídos" },
  { key: "EMITIDA",   label: "Emitida",   color: "blue",   desc: "Enviada al cliente" },
  { key: "FIRMADA",   label: "Firmada",   color: "violet", desc: "PDF firmado recibido" },
  { key: "COBRADA",   label: "Cobrada",   color: "emerald",desc: "Dinero en cuenta" },
];

const badgeColors: Record<string, string> = {
  gray:    "bg-gray-100 text-gray-700",
  blue:    "bg-blue-100 text-blue-700",
  violet:  "bg-violet-100 text-violet-700",
  emerald: "bg-emerald-100 text-emerald-700",
  amber:   "bg-amber-100 text-amber-700",
};

type ValForm = {
  projectId: string;
  period: string;
  costoDirecto: string;
  fechaEmision: string;
  status: string;
  fechaCobro: string;
  notas: string;
  contrato_id: string;
};

const FORM_VACIO: ValForm = {
  projectId: "",
  period: "",
  costoDirecto: "",
  fechaEmision: new Date().toISOString().split("T")[0],
  status: "BORRADOR",
  fechaCobro: "",
  notas: "",
  contrato_id: "",
};

export default function ValorizacionesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [configContrato, setConfigContrato] = useState<any>(null);
  const [valorizaciones, setValorizaciones] = useState<any[]>([]);
  const [contratosDelProyecto, setContratosDelProyecto] = useState<any[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState<ValForm>(FORM_VACIO);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") loadData();
  }, [status]);

  const showToast = (type: "ok" | "err", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: proyectosData } = await supabase
        .from("Project")
        .select("*")
        .in("status", ["ACTIVO", "EN_PRODUCCION"])
        .order("name");
      setProyectos(proyectosData || []);

      if (proyectosData && proyectosData.length > 0) {
        setSelectedProject(proyectosData[0]);
        await loadConfigAndValorizaciones(proyectosData[0].id);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadConfigAndValorizaciones = async (projectId: string) => {
    const [configRes, valsRes, contratosRes] = await Promise.all([
      supabase
        .from("ConfiguracionContrato")
        .select("*")
        .eq("project_id", projectId)
        .maybeSingle(),
      supabase
        .from("Valorizacion")
        .select("*")
        .eq("projectId", projectId)
        .order("fechaEmision", { ascending: true }),
      supabase
        .from("Contrato")
        .select("*")
        .eq("project_id", projectId)
        .order("orden_estrategico", { ascending: true }),
    ]);

    setConfigContrato(configRes.data);
    setValorizaciones(valsRes.data || []);
    setContratosDelProyecto(contratosRes.data || []);
  };

  const handleProjectChange = async (projectId: string) => {
    const project = proyectos.find((p) => p.id === projectId);
    setSelectedProject(project);
    if (project) {
      await loadConfigAndValorizaciones(project.id);
    }
  };

  // ── Parseo Excel / PDF ──────────────────────────────────────────────────────

  const parsePeriodAndTotal = (rows: any[][]) => {
    let period = "";
    let totalFacturar = 0;
    let foundOnTotalAFacturar = false;

    const numRe = /^-?\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?$/;

    rows.forEach((row) => {
      const lineText = row
        .map((c) => (typeof c === "string" ? c : ""))
        .join(" ");

      if (!period) {
        const periodMatch = lineText.match(/VALORIZACION\s*N[°ºO]?\.?\s*(\d+)/i);
        if (periodMatch) {
          period = `Valorización N° ${periodMatch[1].padStart(2, "0")}`;
        }
      }

      const isTotalAFacturar = /TOTAL\s+A\s+FACTURAR/i.test(lineText);
      const isTotalFinalAPagar = /TOTAL\s+FINAL\s+A\s+PAGAR/i.test(lineText);

      if (isTotalAFacturar || (isTotalFinalAPagar && !foundOnTotalAFacturar)) {
        const numbers: number[] = [];
        row.forEach((cell) => {
          if (typeof cell === "number") {
            if (cell >= 1) numbers.push(cell);
          } else if (typeof cell === "string") {
            const cleaned = cell.trim();
            if (numRe.test(cleaned)) {
              const n = parseFloat(cleaned.replace(/,/g, ""));
              if (n >= 1) numbers.push(n);
            }
          }
        });

        let valor = 0;
        if (numbers.length >= 3) valor = numbers[2];
        else if (numbers.length === 2) valor = numbers[1];
        else if (numbers.length === 1) valor = numbers[0];

        if (valor > 0) {
          totalFacturar = valor;
          if (isTotalAFacturar) foundOnTotalAFacturar = true;
        }
      }
    });

    return { period, totalFacturar };
  };

  const buildExtractedData = (period: string, totalFacturar: number) => {
    if (!period) {
      period = new Date().toLocaleString("es-PE", { month: "long", year: "numeric" });
    }
    const igvPct = configContrato?.igv_porcentaje || 0.18;
    const costoDirecto = totalFacturar / (1 + igvPct);
    return {
      period: period.charAt(0).toUpperCase() + period.slice(1),
      costoDirecto: Math.round(costoDirecto * 100) / 100,
      totalFactura: totalFacturar,
      fechaEmision: new Date().toISOString().split("T")[0],
    };
  };

  const extractFromExcel = async (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          const { period, totalFacturar } = parsePeriodAndTotal(jsonData as any[][]);
          resolve(buildExtractedData(period, totalFacturar));
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const extractFromPDF = async (file: File): Promise<any> => {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const rows: any[][] = [];
    const Y_TOLERANCE = 6;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      type Item = { x: number; y: number; text: string };
      const items: Item[] = [];
      content.items.forEach((item: any) => {
        const str = item.str;
        if (!str || !str.trim()) return;
        items.push({ x: item.transform[4], y: item.transform[5], text: str });
      });

      items.sort((a, b) => b.y - a.y);

      const clusters: Item[][] = [];
      items.forEach((it) => {
        const last = clusters[clusters.length - 1];
        if (last && Math.abs(it.y - last[0].y) <= Y_TOLERANCE) {
          last.push(it);
        } else {
          clusters.push([it]);
        }
      });

      const numRe = /^-?\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?$/;
      const totalRe = /TOTAL\s+A\s+FACTURAR|TOTAL\s+FINAL\s+A\s+PAGAR/i;

      const lineEntries = clusters.map((cluster) => {
        const sorted = cluster.slice().sort((a, b) => a.x - b.x);
        const cells: string[] = [];
        sorted.forEach((it) => { if (it.text.trim()) cells.push(it.text.trim()); });
        const fullLine = sorted.map((it) => it.text).join(" ").trim();
        return { fullLine, cells };
      });

      lineEntries.forEach((entry, i) => {
        if (!totalRe.test(entry.fullLine)) return;
        let numericCount = entry.cells.filter((c) => numRe.test(c)).length;
        let j = i + 1;
        while (numericCount < 2 && j < lineEntries.length && j <= i + 2) {
          const extraNumeric = lineEntries[j].cells.filter((c) => numRe.test(c));
          if (extraNumeric.length > 0) {
            entry.cells.push(...extraNumeric);
            numericCount += extraNumeric.length;
          }
          j++;
        }
      });

      lineEntries.forEach(({ fullLine, cells }) => {
        if (fullLine) rows.push([fullLine, ...cells]);
        else if (cells.length) rows.push(cells);
      });
    }

    const { period, totalFacturar } = parsePeriodAndTotal(rows);
    return buildExtractedData(period, totalFacturar);
  };

  const handleFileUpload = async (file: File) => {
    setUploadFile(file);
    setUploading(true);
    try {
      let extractedData;
      const lowerName = file.name.toLowerCase();
      if (lowerName.endsWith(".xlsx") || lowerName.endsWith(".xls")) {
        extractedData = await extractFromExcel(file);
      } else if (lowerName.endsWith(".pdf")) {
        extractedData = await extractFromPDF(file);
      } else {
        throw new Error("Formato no soportado. Use archivos Excel (.xlsx, .xls) o PDF (.pdf)");
      }

      setUploadPreview({ ...extractedData, fileName: file.name });
      setForm({
        projectId: selectedProject?.id || "",
        period: extractedData.period,
        costoDirecto: String(extractedData.costoDirecto),
        fechaEmision: extractedData.fechaEmision,
        status: "BORRADOR",
        fechaCobro: "",
        notas: `Documento: ${file.name}`,
        contrato_id: "",
      });
    } catch (error: any) {
      Swal.fire({
        title: "Error al leer el archivo",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveFromUpload = async () => {
    if (!form.projectId) {
      showToast("err", "Selecciona un proyecto.");
      return;
    }
    if (!form.period.trim() || !form.costoDirecto) {
      showToast("err", "Completa los datos extraídos o corrígelos manualmente.");
      return;
    }

    setSaving(true);
    const igvPct = configContrato?.igv_porcentaje || 0.18;
    const garantiaPct = configContrato?.garantia_porcentaje || 0.05;
    const costoTotal = configContrato?.costo_directo_total || 0;

    const costoNum = parseFloat(form.costoDirecto.replace(",", ".")) || 0;
    const igvCalc = costoNum * igvPct;
    const totalFacturaCalc = costoNum + igvCalc;
    const garantiaCalc = costoNum * garantiaPct;
    const netoCalc = totalFacturaCalc - garantiaCalc;

    const payload: any = {
      projectId: form.projectId,
      period: form.period,
      costoDirecto: costoNum,
      igv: igvCalc,
      totalFactura: totalFacturaCalc,
      garantia: garantiaCalc,
      netoCobrar: netoCalc,
      avancePct: costoTotal > 0 ? ((costoNum / costoTotal) * 100).toFixed(2) : "0",
      status: form.status,
      fechaEmision: form.fechaEmision,
      fechaCobro: form.fechaCobro || null,
      notas: form.notas || null,
      contrato_id: form.contrato_id || null,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from("Valorizacion").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("Valorizacion").insert(payload));
    }

    setSaving(false);
    if (error) {
      showToast("err", "Error al guardar. Revisa los datos.");
    } else {
      showToast("ok", editingId ? "Valorización actualizada." : "Valorización creada correctamente.");
      setForm(FORM_VACIO);
      setShowUpload(false);
      setUploadFile(null);
      setUploadPreview(null);
      setEditingId(null);
      if (selectedProject) await loadConfigAndValorizaciones(selectedProject.id);
    }
  };

  const handleEdit = (v: any) => {
    setForm({
      projectId: v.projectId,
      period: v.period,
      costoDirecto: String(v.costoDirecto),
      fechaEmision: v.fechaEmision?.split("T")[0] || "",
      status: v.status,
      fechaCobro: v.fechaCobro?.split("T")[0] || "",
      notas: v.notas || "",
      contrato_id: v.contrato_id || "",
    });
    setEditingId(v.id);
    setShowUpload(true);
    setUploadPreview(null);
    setUploadFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const updates: any = { status: newStatus };
    if (newStatus === "COBRADA") {
      updates.fechaCobro = new Date().toISOString().split("T")[0];
    }
    await supabase.from("Valorizacion").update(updates).eq("id", id);
    if (selectedProject) await loadConfigAndValorizaciones(selectedProject.id);
  };

  const getNextStatus = (current: string) => {
    const idx = ESTADOS.findIndex((e) => e.key === current);
    return idx < ESTADOS.length - 1 ? ESTADOS[idx + 1] : null;
  };

  // ── KPIs ────────────────────────────────────────────────────────────────────

  const totalValorizado = valorizaciones.reduce((s, v) => s + Number(v.costoDirecto), 0);
  const costoTotal = configContrato?.costo_directo_total || 0;
  const avancePct = costoTotal > 0 ? (totalValorizado / costoTotal) * 100 : 0;
  const totalCobrado = valorizaciones
    .filter((v) => v.status === "COBRADA")
    .reduce((s, v) => s + Number(v.netoCobrar), 0);
  const totalPendienteCobro = valorizaciones
    .filter((v) => v.status !== "COBRADA")
    .reduce((s, v) => s + Number(v.netoCobrar), 0);

  // ── Selector de contrato en formulario ──────────────────────────────────────

  const ContratoSelector = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <div>
      <label className="text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1.5 block">
        <Link2 className="h-3.5 w-3.5 text-gray-400" />
        Contrato asociado
        <span className="text-gray-400 font-normal">(afecta Próxima cobranza)</span>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
      >
        <option value="">— Sin asignar —</option>
        {contratosDelProyecto.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre.length > 60 ? c.nombre.substring(0, 60) + "…" : c.nombre}
            {" "}· {formatCOP(Number(c.monto))} · {c.estado}
          </option>
        ))}
      </select>
      {value && (
        <p className="text-xs text-teal-600 mt-1 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Esta valorización aparecerá en "Próxima cobranza" del contrato seleccionado
        </p>
      )}
      {!value && (
        <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Sin contrato asignado no se reflejará en el dashboard
        </p>
      )}
    </div>
  );

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
            toast.type === "ok"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {toast.type === "ok"
            ? <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            : <AlertCircle className="h-4 w-4 text-red-600" />}
          {toast.msg}
        </div>
      )}

      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Dashboard
            </button>
            <div className="h-4 w-px bg-gray-200" />
            <div>
              <h1 className="text-base font-bold text-gray-900">Valorizaciones</h1>
              <p className="text-xs text-gray-500">Sube Excel o PDF y genera facturas electrónicas</p>
            </div>
          </div>
          <button
            onClick={() => {
              setForm({ ...FORM_VACIO, projectId: selectedProject?.id || "" });
              setEditingId(null);
              setUploadFile(null);
              setUploadPreview(null);
              setShowUpload(!showUpload);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Subir valorización
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Selector de proyecto */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Proyecto:</span>
            </div>
            <select
              value={selectedProject?.id || ""}
              onChange={(e) => handleProjectChange(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="">Seleccionar proyecto</option>
              {proyectos.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {selectedProject && (
              <div className="text-sm text-gray-500">
                Cliente: <span className="font-medium">{selectedProject.client}</span>
              </div>
            )}
          </div>
        </div>

        {/* Panel de subida / edición */}
        {showUpload && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-gray-900">
                {editingId ? "Editar valorización" : "Subir valorización"}
              </h2>
              <button
                onClick={() => {
                  setShowUpload(false);
                  setUploadFile(null);
                  setUploadPreview(null);
                  setEditingId(null);
                  setForm(FORM_VACIO);
                }}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Drop zone — solo cuando es nuevo y sin preview */}
            {!uploadPreview && !editingId && (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) handleFileUpload(file);
                }}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                <input
                  id="fileInput"
                  type="file"
                  accept=".xlsx,.xls,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                  }}
                />
                {uploading ? (
                  <>
                    <Loader2 className="h-10 w-10 text-gray-300 mx-auto mb-3 animate-spin" />
                    <p className="text-sm text-gray-500">Leyendo archivo...</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Arrastra y suelta tu archivo aquí</p>
                    <p className="text-xs text-gray-400 mt-1">o haz clic para seleccionar</p>
                    <p className="text-xs text-amber-600 mt-3">Formatos soportados: .xlsx, .xls, .pdf</p>
                  </>
                )}
              </div>
            )}

            {/* Preview tras subir archivo */}
            {uploadPreview && !editingId && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Datos extraídos del archivo: {uploadPreview.fileName}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Período</p>
                      <p className="font-medium text-gray-900">{uploadPreview.period}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Costo directo (sin IGV)</p>
                      <p className="font-medium text-gray-900">{formatCOP(uploadPreview.costoDirecto)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total factura (con IGV)</p>
                      <p className="font-medium text-gray-900">{formatCOP(uploadPreview.totalFactura)}</p>
                    </div>
                  </div>
                  {uploadPreview.totalFactura === 0 && (
                    <p className="text-xs text-amber-700 mt-3">
                      No se encontraron automáticamente los valores. Corrígelos manualmente.
                    </p>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-medium text-gray-700 mb-3">Confirma o corrige los datos:</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1.5 block">Período *</label>
                      <input
                        type="text"
                        value={form.period}
                        onChange={(e) => setForm({ ...form, period: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1.5 block">Costo directo (S/ sin IGV) *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">S/</span>
                        <input
                          type="number"
                          step="0.01"
                          value={form.costoDirecto}
                          onChange={(e) => setForm({ ...form, costoDirecto: e.target.value })}
                          className="w-full pl-8 pr-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1.5 block">Fecha de emisión</label>
                      <input
                        type="date"
                        value={form.fechaEmision}
                        onChange={(e) => setForm({ ...form, fechaEmision: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1.5 block">Estado inicial</label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      >
                        {ESTADOS.map((e) => (
                          <option key={e.key} value={e.key}>{e.label}</option>
                        ))}
                      </select>
                    </div>
                    {/* ── SELECTOR DE CONTRATO ── */}
                    <div className="col-span-2">
                      <ContratoSelector
                        value={form.contrato_id}
                        onChange={(v) => setForm({ ...form, contrato_id: v })}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-gray-700 mb-1.5 block">Notas (opcional)</label>
                      <input
                        type="text"
                        placeholder="Observaciones..."
                        value={form.notas}
                        onChange={(e) => setForm({ ...form, notas: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={handleSaveFromUpload}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileCheck className="h-4 w-4" />}
                    {saving ? "Guardando..." : "Guardar valorización"}
                  </button>
                  <button
                    onClick={() => {
                      setShowUpload(false);
                      setUploadFile(null);
                      setUploadPreview(null);
                      setForm(FORM_VACIO);
                    }}
                    className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Formulario de edición */}
            {editingId && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1.5 block">Período *</label>
                    <input
                      type="text"
                      value={form.period}
                      onChange={(e) => setForm({ ...form, period: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1.5 block">Costo directo (S/ sin IGV) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">S/</span>
                      <input
                        type="number"
                        step="0.01"
                        value={form.costoDirecto}
                        onChange={(e) => setForm({ ...form, costoDirecto: e.target.value })}
                        className="w-full pl-8 pr-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1.5 block">Fecha de emisión</label>
                    <input
                      type="date"
                      value={form.fechaEmision}
                      onChange={(e) => setForm({ ...form, fechaEmision: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1.5 block">Estado</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      {ESTADOS.map((e) => (
                        <option key={e.key} value={e.key}>{e.label}</option>
                      ))}
                    </select>
                  </div>
                  {form.status === "COBRADA" && (
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1.5 block">Fecha de cobro</label>
                      <input
                        type="date"
                        value={form.fechaCobro}
                        onChange={(e) => setForm({ ...form, fechaCobro: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>
                  )}
                  {/* ── SELECTOR DE CONTRATO ── */}
                  <div className="col-span-2">
                    <ContratoSelector
                      value={form.contrato_id}
                      onChange={(v) => setForm({ ...form, contrato_id: v })}
                    />
                  </div>
                  <div className={form.status === "COBRADA" ? "" : "col-span-2"}>
                    <label className="text-xs font-medium text-gray-700 mb-1.5 block">Notas</label>
                    <input
                      type="text"
                      value={form.notas}
                      onChange={(e) => setForm({ ...form, notas: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                </div>

                {parseFloat(form.costoDirecto) > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-500 mb-3">Resumen de la valorización:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-[10px] text-gray-400">Costo directo</p>
                        <p className="text-sm font-semibold text-gray-900">{formatCOP(parseFloat(form.costoDirecto))}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400">IGV ({((configContrato?.igv_porcentaje || 0.18) * 100).toFixed(0)}%)</p>
                        <p className="text-sm font-semibold text-blue-700">
                          + {formatCOP(parseFloat(form.costoDirecto) * (configContrato?.igv_porcentaje || 0.18))}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400">Total factura</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCOP(parseFloat(form.costoDirecto) * (1 + (configContrato?.igv_porcentaje || 0.18)))}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400">Garantía ({((configContrato?.garantia_porcentaje || 0.05) * 100).toFixed(0)}%)</p>
                        <p className="text-sm font-semibold text-amber-700">
                          − {formatCOP(parseFloat(form.costoDirecto) * (configContrato?.garantia_porcentaje || 0.05))}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={handleSaveFromUpload}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? "Guardando..." : "Actualizar valorización"}
                  </button>
                  <button
                    onClick={() => { setShowUpload(false); setEditingId(null); setForm(FORM_VACIO); }}
                    className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* KPIs */}
        {selectedProject && configContrato && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Avance valorizado</p>
              <p className="text-xl font-bold text-gray-900">{avancePct.toFixed(2)}%</p>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gray-900 rounded-full" style={{ width: `${Math.min(avancePct, 100)}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">{formatCOP(totalValorizado)} de {formatCOP(costoTotal)}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Valorizaciones</p>
              <p className="text-xl font-bold text-gray-900">{valorizaciones.length}</p>
              <p className="text-xs text-gray-400 mt-1">{valorizaciones.filter((v) => v.status === "COBRADA").length} cobradas</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total cobrado</p>
              <p className="text-xl font-bold text-emerald-700">{formatCOP(totalCobrado)}</p>
              <p className="text-xs text-gray-400 mt-1">Neto recibido</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Pendiente de cobro</p>
              <p className="text-xl font-bold text-amber-700">{formatCOP(totalPendienteCobro)}</p>
              <p className="text-xs text-gray-400 mt-1">{valorizaciones.filter((v) => v.status !== "COBRADA").length} activas</p>
            </div>
          </div>
        )}

        {/* Lista de valorizaciones */}
        {selectedProject && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-700">
              Valorizaciones de {selectedProject.name}
            </h2>

            {valorizaciones.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
                <Receipt className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No hay valorizaciones registradas aún.</p>
                <p className="text-xs text-gray-300 mt-1">Usa el botón "Subir valorización" para comenzar.</p>
              </div>
            ) : (
              valorizaciones.map((v, idx) => {
                const estadoInfo = ESTADOS.find((e) => e.key === v.status) || ESTADOS[0];
                const nextStatus = getNextStatus(v.status);
                const isExpanded = expandedId === v.id;
                const contratoAsignado = contratosDelProyecto.find((c) => c.id === v.contrato_id);

                return (
                  <div key={v.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-white">{String(idx + 1).padStart(2, "0")}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm font-semibold text-gray-900">
                                Val. N°{String(idx + 1).padStart(2, "0")} · {v.period}
                              </h3>
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeColors[estadoInfo.color]}`}>
                                {estadoInfo.label}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">
                              Emitida: {new Date(v.fechaEmision).toLocaleDateString("es-PE")}
                              {v.fechaCobro && ` · Cobrada: ${new Date(v.fechaCobro).toLocaleDateString("es-PE")}`}
                            </p>
                            {/* Badge de contrato asignado */}
                            {contratoAsignado ? (
                              <p className="text-xs text-teal-600 mt-1 flex items-center gap-1">
                                <Link2 className="h-3 w-3" />
                                {contratoAsignado.nombre.length > 50
                                  ? contratoAsignado.nombre.substring(0, 50) + "…"
                                  : contratoAsignado.nombre}
                              </p>
                            ) : (
                              <p className="text-xs text-amber-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Sin contrato asignado — no aparece en "Próxima cobranza"
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-base font-bold text-teal-700">{formatCOP(Number(v.netoCobrar))}</p>
                            <p className="text-xs text-gray-400">neto a cobrar</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleEdit(v)} className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors">
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : v.id)}
                              className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
                            >
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Barra de progreso de estados */}
                      <div className="flex items-center gap-1 mt-4">
                        {ESTADOS.map((e, i) => {
                          const estadoIdx = ESTADOS.findIndex((s) => s.key === v.status);
                          const done = i <= estadoIdx;
                          return (
                            <div key={e.key} className="flex items-center gap-1 flex-1">
                              <div className={`flex-1 h-1.5 rounded-full ${done ? "bg-gray-900" : "bg-gray-100"}`} />
                              {i === ESTADOS.length - 1 && (
                                <div className={`w-2 h-2 rounded-full ${done ? "bg-gray-900" : "bg-gray-200"}`} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between mt-1">
                        {ESTADOS.map((e) => (
                          <span key={e.key} className="text-[9px] text-gray-400">{e.label}</span>
                        ))}
                      </div>
                    </div>

                    {/* Detalle expandido */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-[10px] text-gray-400">Costo directo</p>
                            <p className="text-sm font-semibold text-gray-900">{formatCOP(Number(v.costoDirecto))}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400">IGV ({((configContrato?.igv_porcentaje || 0.18) * 100).toFixed(0)}%)</p>
                            <p className="text-sm font-semibold text-blue-700">+ {formatCOP(Number(v.igv))}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400">Total factura</p>
                            <p className="text-sm font-semibold text-gray-900">{formatCOP(Number(v.totalFactura))}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400">Garantía ({((configContrato?.garantia_porcentaje || 0.05) * 100).toFixed(0)}%)</p>
                            <p className="text-sm font-semibold text-amber-700">− {formatCOP(Number(v.garantia))}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-100">
                          <div>
                            <p className="text-xs text-gray-500">Neto a cobrar</p>
                            <p className="text-base font-bold text-teal-700">{formatCOP(Number(v.netoCobrar))}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Avance acumulado</p>
                            <p className="text-base font-bold text-gray-900">{Number(v.avancePct).toFixed(2)}%</p>
                          </div>
                        </div>
                        {v.notas && (
                          <p className="text-xs text-gray-500 mt-3 italic">📝 {v.notas}</p>
                        )}

                        {nextStatus && (
                          <button
                            onClick={() => handleUpdateStatus(v.id, nextStatus.key)}
                            className="mt-4 w-full flex items-center justify-center gap-2 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-white transition-colors"
                          >
                            <TrendingUp className="h-4 w-4" />
                            Marcar como "{nextStatus.label}" — {nextStatus.desc}
                          </button>
                        )}

                        {v.status === "FIRMADA" && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs font-medium text-gray-500">Factura electrónica SUNAT</p>
                                {v.factura_emitida_sunat ? (
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-mono text-gray-700">
                                      {v.factura_serie}-{v.factura_numero}
                                    </span>
                                    {v.factura_pdf_url && (
                                      <a href={v.factura_pdf_url} target="_blank" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                        <FileText className="h-3 w-3" /> PDF
                                      </a>
                                    )}
                                    {v.factura_xml_url && (
                                      <a href={v.factura_xml_url} target="_blank" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                        <Download className="h-3 w-3" /> XML
                                      </a>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-xs text-amber-600 mt-1">Valorización firmada - Lista para emitir factura</p>
                                )}
                              </div>
                              <FacturaElectronicaButton
                                valorizacion={v}
                                onSuccess={() => selectedProject && loadConfigAndValorizaciones(selectedProject.id)}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Progreso del contrato */}
        {selectedProject && configContrato && (
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Progreso del contrato</h3>
              <span className="text-sm font-bold text-gray-900">{avancePct.toFixed(2)}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gray-900 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(avancePct, 100)}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-400">Costo directo total</p>
                <p className="text-sm font-bold text-gray-900">{formatCOP(costoTotal)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Valorizado</p>
                <p className="text-sm font-bold text-gray-900">{formatCOP(totalValorizado)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Saldo por valorizar</p>
                <p className="text-sm font-bold text-amber-700">{formatCOP(Math.max(0, costoTotal - totalValorizado))}</p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}