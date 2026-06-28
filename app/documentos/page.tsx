"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  Plus,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Clock,
  TrendingUp,
  Building2,
  User,
  Calendar,
  Search,
  Filter,
  X,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Folder,
  FolderOpen,
  File,
  ImageIcon,
  FileSpreadsheet,
  FileArchive,
  HardDrive,
  Upload,
  Link,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const TIPOS_DOCUMENTO = [
  { key: "CONTRATO", label: "Contrato", icon: FileText, color: "blue" },
  { key: "PLANO", label: "Plano", icon: File, color: "purple" },
  { key: "REPORTE", label: "Reporte", icon: FileSpreadsheet, color: "green" },
  { key: "FOTO", label: "Foto", icon: ImageIcon, color: "amber" },
  { key: "COTIZACION", label: "Cotización", icon: FileText, color: "red" },
  { key: "FACTURA", label: "Factura", icon: FileText, color: "emerald" },
  { key: "ESPECIFICACION", label: "Especificación", icon: FileText, color: "indigo" },
  { key: "INFORME", label: "Informe", icon: FileText, color: "zinc" },
  { key: "OTRO", label: "Otro", icon: FileArchive, color: "gray" },
];

const getTipoInfo = (tipo: string) => {
  return TIPOS_DOCUMENTO.find((t) => t.key === tipo) || TIPOS_DOCUMENTO[8];
};

const badgeColors: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
  green: "bg-green-100 text-green-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
  emerald: "bg-emerald-100 text-emerald-700",
  indigo: "bg-indigo-100 text-indigo-700",
  zinc: "bg-zinc-100 text-zinc-700",
  gray: "bg-gray-100 text-gray-700",
};

function KpiCard({ icon: Icon, label, value, sub, accent }: any) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent ?? "bg-zinc-50"}`}>
          <Icon className="h-4 w-4 text-zinc-600" />
        </div>
        <span className="text-2xl font-bold text-zinc-900">{value}</span>
      </div>
      <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest mt-2">{label}</p>
      {sub && <p className="text-xs text-zinc-400 mt-0.5">{sub}</p>}
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

function Toast({ type, msg, onClose }: { type: "ok" | "err"; msg: string; onClose: () => void }) {
  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium border backdrop-blur-sm ${
        type === "ok"
          ? "bg-emerald-50/95 text-emerald-800 border-emerald-200"
          : "bg-red-50/95 text-red-800 border-red-200"
      }`}
    >
      {type === "ok" ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
      ) : (
        <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
      )}
      {msg}
      <button onClick={onClose} className="ml-1 text-zinc-400 hover:text-zinc-600">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function DocumentosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [filterTipo, setFilterTipo] = useState<string>("ALL");
  const [filterProyecto, setFilterProyecto] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      loadDocumentos();
      loadProyectos();
    }
  }, [status]);

  const showToast = (type: "ok" | "err", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const loadProyectos = async () => {
    try {
      const { data } = await supabase
        .from("Project")
        .select("id, name")
        .order("name");
      setProyectos(data || []);
    } catch (error) {
      console.error("Error cargando proyectos:", error);
    }
  };

  const loadDocumentos = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("Documento")
        .select(`
          *,
          proyecto:proyecto_id (
            id,
            name,
            client
          ),
          subido_por_user:subido_por (
            id,
            name,
            email
          )
        `)
        .eq("activo", true)
        .order("fecha_subida", { ascending: false });

      if (filterTipo !== "ALL") {
        query = query.eq("tipo", filterTipo);
      }

      if (filterProyecto !== "ALL") {
        query = query.eq("proyecto_id", filterProyecto);
      }

      if (searchTerm) {
        query = query.ilike("nombre", `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setDocumentos(data || []);
    } catch (error) {
      console.error("Error cargando documentos:", error);
      showToast("err", "Error al cargar documentos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este documento?")) return;

    try {
      const { error } = await supabase
        .from("Documento")
        .update({ activo: false })
        .eq("id", id);

      if (error) throw error;

      showToast("ok", "Documento eliminado");
      loadDocumentos();
    } catch (error: any) {
      showToast("err", error.message || "Error al eliminar");
    }
  };

  const handleDownload = async (url: string, nombre: string) => {
  try {
    // 🔧 CORREGIDO: Usar la ruta completa dentro del bucket
    const { data, error } = await supabase.storage
      .from('documentos')
      .download(url); // url es el filePath guardado en BD

    if (error) {
      console.error('❌ Error descargando:', error);
      showToast('err', 'Error al descargar');
      return;
    }

    if (!data) throw new Error("No se pudo descargar");

    const blob = new Blob([data]);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = nombre;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error: any) {
    console.error('❌ Error en descarga:', error);
    showToast('err', 'Error al descargar');
  }
};

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-zinc-300" />
      </div>
    );
  }

  const totalDocs = documentos.length;
  const totalSize = documentos.reduce((sum, d) => sum + (d.tamanio || 0), 0);
  const tiposCount = documentos.reduce((acc: any, d) => {
    acc[d.tipo] = (acc[d.tipo] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      {toast && (
        <Toast
          type={toast.type}
          msg={toast.msg}
          onClose={() => setToast(null)}
        />
      )}

      <header className="bg-white border-b border-zinc-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-700 text-sm transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Dashboard
            </button>
            <div className="h-4 w-px bg-zinc-200" />
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center">
                <Folder className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-zinc-900 leading-none">Gestión Documental</h1>
                <p className="text-[10px] text-zinc-400 mt-0.5 uppercase tracking-wider">
                  Archivo central · LUDIER
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => router.push("/documentos/subir")}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-xs font-semibold rounded-xl hover:bg-zinc-800 transition-colors"
          >
            <Upload className="h-3.5 w-3.5" />
            Subir documento
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* KPIs */}
        <section>
          <SectionTitle sub="Resumen del archivo">Visión ejecutiva</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard
              icon={FileText}
              label="Total documentos"
              value={totalDocs}
              sub="archivados"
              accent="bg-zinc-50"
            />
            <KpiCard
              icon={HardDrive}
              label="Tamaño total"
              value={formatFileSize(totalSize)}
              sub="almacenado"
              accent="bg-blue-50"
            />
            <KpiCard
              icon={FolderOpen}
              label="Tipos"
              value={Object.keys(tiposCount).length}
              sub="diferentes"
              accent="bg-purple-50"
            />
            <KpiCard
              icon={Building2}
              label="Proyectos"
              value={proyectos.length}
              sub="asociados"
              accent="bg-emerald-50"
            />
          </div>
        </section>

        {/* Filtros */}
        <section className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-zinc-400" />
              <span className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Filtros</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="h-4 w-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadDocumentos()}
                  className="pl-9 pr-3 py-2 text-xs border border-zinc-200 rounded-lg bg-white text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 w-48"
                />
              </div>
              <select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                className="px-3 py-2 text-xs border border-zinc-200 rounded-lg bg-white text-zinc-700"
              >
                <option value="ALL">Todos los tipos</option>
                {TIPOS_DOCUMENTO.map((t) => (
                  <option key={t.key} value={t.key}>{t.label}</option>
                ))}
              </select>
              <select
                value={filterProyecto}
                onChange={(e) => setFilterProyecto(e.target.value)}
                className="px-3 py-2 text-xs border border-zinc-200 rounded-lg bg-white text-zinc-700"
              >
                <option value="ALL">Todos los proyectos</option>
                {proyectos.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <button
                onClick={loadDocumentos}
                className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                title="Actualizar"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Lista de Documentos */}
        <section>
          <SectionTitle sub={`${documentos.length} documentos`}>Lista de documentos</SectionTitle>

          {documentos.length === 0 ? (
            <div className="bg-white rounded-2xl border border-zinc-100 p-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center mx-auto mb-4">
                <Folder className="h-7 w-7 text-zinc-200" />
              </div>
              <p className="text-sm text-zinc-400">No hay documentos registrados</p>
              <p className="text-xs text-zinc-300 mt-1">
                Sube el primer documento con el botón "Subir documento"
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {documentos.map((doc) => {
                const tipoInfo = getTipoInfo(doc.tipo);
                const Icon = tipoInfo.icon;
                const isExpanded = expandedId === doc.id;

                return (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden hover:border-zinc-200 transition-colors"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${badgeColors[tipoInfo.color]}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-bold text-zinc-900 truncate">{doc.nombre}</p>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeColors[tipoInfo.color]}`}>
                                {tipoInfo.label}
                              </span>
                              {doc.proyecto && (
                                <span className="text-[10px] text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded-full">
                                  {doc.proyecto.name}
                                </span>
                              )}
                              <span className="text-[10px] text-zinc-400">
                                v{doc.version || 1}
                              </span>
                            </div>
                            {doc.descripcion && (
                              <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{doc.descripcion}</p>
                            )}
                            <div className="flex items-center gap-3 mt-1 text-[10px] text-zinc-400 flex-wrap">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(doc.fecha_subida).toLocaleDateString("es-PE")}
                              </span>
                              <span>·</span>
                              <span>{formatFileSize(doc.tamanio || 0)}</span>
                              {doc.subido_por_user && (
                                <>
                                  <span>·</span>
                                  <span>Subido por: {doc.subido_por_user.name || doc.subido_por_user.email}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleDownload(doc.url, doc.nombre)}
                            className="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Descargar"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/documentos/${doc.id}`)}
                            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                            title="Ver detalle"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : doc.id)}
                            className="p-1.5 text-zinc-300 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-zinc-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Detalles</p>
                              <div className="space-y-1 text-sm">
                                <p><span className="text-zinc-500">Nombre:</span> <span className="font-medium">{doc.nombre}</span></p>
                                <p><span className="text-zinc-500">Tipo:</span> <span className="font-medium">{tipoInfo.label}</span></p>
                                <p><span className="text-zinc-500">Versión:</span> <span className="font-medium">v{doc.version || 1}</span></p>
                                <p><span className="text-zinc-500">Tamaño:</span> <span className="font-medium">{formatFileSize(doc.tamanio || 0)}</span></p>
                                <p><span className="text-zinc-500">Extensión:</span> <span className="font-medium">{doc.extension || "N/A"}</span></p>
                              </div>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Metadatos</p>
                              <div className="space-y-1 text-sm">
                                {doc.proyecto && (
                                  <p><span className="text-zinc-500">Proyecto:</span> <span className="font-medium">{doc.proyecto.name}</span></p>
                                )}
                                <p><span className="text-zinc-500">Subido:</span> <span className="font-medium">{new Date(doc.fecha_subida).toLocaleString("es-PE")}</span></p>
                                {doc.subido_por_user && (
                                  <p><span className="text-zinc-500">Subido por:</span> <span className="font-medium">{doc.subido_por_user.name || doc.subido_por_user.email}</span></p>
                                )}
                                {doc.etiquetas && doc.etiquetas.length > 0 && (
                                  <div>
                                    <span className="text-zinc-500">Etiquetas:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {doc.etiquetas.map((tag: string, i: number) => (
                                        <span key={i} className="text-[10px] bg-zinc-100 px-2 py-0.5 rounded-full">{tag}</span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          {doc.descripcion && (
                            <div className="mt-3 p-3 bg-zinc-50 rounded-lg">
                              <p className="text-[10px] text-zinc-400">Descripción</p>
                              <p className="text-sm text-zinc-600">{doc.descripcion}</p>
                            </div>
                          )}
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
    </div>
  );
}