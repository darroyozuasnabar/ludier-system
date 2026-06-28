"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  Download,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Calendar,
  Building2,
  User,
  Mail,
  Clock,
  RefreshCw,
  Eye,
  File,
  ImageIcon,
  FileSpreadsheet,
  FileArchive,
  Link,
  Save,
  X,
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
  { key: "CONTRATO", label: "Contrato", icon: FileText },
  { key: "PLANO", label: "Plano", icon: File },
  { key: "REPORTE", label: "Reporte", icon: FileSpreadsheet },
  { key: "FOTO", label: "Foto", icon: ImageIcon },
  { key: "COTIZACION", label: "Cotización", icon: FileText },
  { key: "FACTURA", label: "Factura", icon: FileText },
  { key: "ESPECIFICACION", label: "Especificación", icon: FileText },
  { key: "INFORME", label: "Informe", icon: FileText },
  { key: "OTRO", label: "Otro", icon: FileArchive },
];

const getTipoInfo = (tipo: string) => {
  return TIPOS_DOCUMENTO.find((t) => t.key === tipo) || TIPOS_DOCUMENTO[8];
};

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

export default function DocumentoDetallePage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [documento, setDocumento] = useState<any>(null);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    tipo: "",
    proyecto_id: "",
    etiquetas: "",
  });
  const [proyectos, setProyectos] = useState<any[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      loadDocumento();
      loadProyectos();
    }
  }, [status, params.id]);

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

  const loadDocumento = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/documentos/${params.id}`);
      const data = await response.json();

      if (!data.success) throw new Error(data.error);

      setDocumento(data.data);
      setForm({
        nombre: data.data.nombre || "",
        descripcion: data.data.descripcion || "",
        tipo: data.data.tipo || "OTRO",
        proyecto_id: data.data.proyecto_id || "",
        etiquetas: data.data.etiquetas?.join(", ") || "",
      });
    } catch (error: any) {
      showToast("err", error.message || "Error al cargar el documento");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!documento) return;

    try {
      const { data } = await supabase.storage
        .from("documentos")
        .download(documento.url);

      if (!data) throw new Error("No se pudo descargar");

      const blob = new Blob([data]);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = documento.nombre;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      showToast("err", "Error al descargar");
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este documento?")) return;

    try {
      const response = await fetch(`/api/documentos/${params.id}`, { method: "DELETE" });
      const data = await response.json();

      if (!data.success) throw new Error(data.error);

      showToast("ok", "Documento eliminado");
      setTimeout(() => router.push("/documentos"), 1000);
    } catch (error: any) {
      showToast("err", error.message || "Error al eliminar");
    }
  };

  const handleUpdate = async () => {
    if (!form.nombre.trim()) {
      showToast("err", "El nombre es requerido");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/documentos/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!data.success) throw new Error(data.error);

      showToast("ok", "Documento actualizado");
      setEditando(false);
      loadDocumento();
    } catch (error: any) {
      showToast("err", error.message || "Error al actualizar");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-zinc-300" />
      </div>
    );
  }

  if (!documento) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-zinc-200 mx-auto mb-3" />
          <p className="text-sm text-zinc-400">Documento no encontrado</p>
          <button
            onClick={() => router.push("/documentos")}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Volver a documentos
          </button>
        </div>
      </div>
    );
  }

  const tipoInfo = getTipoInfo(documento.tipo);
  const Icon = tipoInfo.icon;

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
              onClick={() => router.push("/documentos")}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-700 text-sm transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Documentos
            </button>
            <div className="h-4 w-px bg-zinc-200" />
            <div>
              <h1 className="text-sm font-bold text-zinc-900 leading-none truncate max-w-xs">
                {documento.nombre}
              </h1>
              <p className="text-[10px] text-zinc-400 mt-0.5 uppercase tracking-wider">
                {tipoInfo.label} · v{documento.version || 1}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Descargar
            </button>
            {!editando && (
              <button
                onClick={() => setEditando(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 text-zinc-700 text-xs font-medium rounded-lg hover:bg-zinc-200 transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
                Editar
              </button>
            )}
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Eliminar
            </button>
            <button
              onClick={loadDocumento}
              className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Información del documento */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
          {editando ? (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider">Editar documento</h2>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                    Tipo
                  </label>
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"
                  >
                    {TIPOS_DOCUMENTO.map((t) => (
                      <option key={t.key} value={t.key}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                    Proyecto
                  </label>
                  <select
                    value={form.proyecto_id}
                    onChange={(e) => setForm({ ...form, proyecto_id: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"
                  >
                    <option value="">— Sin proyecto —</option>
                    {proyectos.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                  Etiquetas
                </label>
                <input
                  type="text"
                  value={form.etiquetas}
                  onChange={(e) => setForm({ ...form, etiquetas: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"
                  placeholder="contrato, qantua, fase2"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={handleUpdate}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
                <button
                  onClick={() => {
                    setEditando(false);
                    loadDocumento();
                  }}
                  className="px-4 py-2 border border-zinc-200 text-zinc-600 text-sm font-medium rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6 text-zinc-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">{documento.nombre}</p>
                    <p className="text-xs text-zinc-500">{tipoInfo.label}</p>
                  </div>
                </div>
                {documento.descripcion && (
                  <p className="text-sm text-zinc-600 mt-3">{documento.descripcion}</p>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-zinc-100 pb-2">
                  <span className="text-zinc-500">Versión</span>
                  <span className="font-medium text-zinc-900">v{documento.version || 1}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-100 pb-2">
                  <span className="text-zinc-500">Tamaño</span>
                  <span className="font-medium text-zinc-900">{formatFileSize(documento.tamanio || 0)}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-100 pb-2">
                  <span className="text-zinc-500">Extensión</span>
                  <span className="font-medium text-zinc-900">{documento.extension || "N/A"}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-100 pb-2">
                  <span className="text-zinc-500">Subido</span>
                  <span className="font-medium text-zinc-900">
                    {new Date(documento.fecha_subida).toLocaleString("es-PE")}
                  </span>
                </div>
                {documento.proyecto && (
                  <div className="flex justify-between border-b border-zinc-100 pb-2">
                    <span className="text-zinc-500">Proyecto</span>
                    <span className="font-medium text-zinc-900">{documento.proyecto.name}</span>
                  </div>
                )}
                {documento.subido_por_user && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Subido por</span>
                    <span className="font-medium text-zinc-900">
                      {documento.subido_por_user.name || documento.subido_por_user.email}
                    </span>
                  </div>
                )}
                {documento.etiquetas && documento.etiquetas.length > 0 && (
                  <div>
                    <span className="text-zinc-500">Etiquetas</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {documento.etiquetas.map((tag: string, i: number) => (
                        <span key={i} className="text-[10px] bg-zinc-100 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Versiones (placeholder) */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider mb-4">Versiones</h2>
          <div className="text-center py-6 text-sm text-zinc-400">
            <p>Historial de versiones disponible próximamente</p>
            <p className="text-xs mt-1">Versión actual: v{documento.version || 1}</p>
          </div>
        </div>
      </main>
    </div>
  );
}