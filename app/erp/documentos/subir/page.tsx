"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  ChevronLeft,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  File,
  Building2,
  Tag,
  FileText,
  ImageIcon,
  FileSpreadsheet,
  FileArchive,
  Plus,
  Trash2,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TIPOS_DOCUMENTO = [
  { key: "CONTRATO", label: "Contrato" },
  { key: "PLANO", label: "Plano" },
  { key: "REPORTE", label: "Reporte" },
  { key: "FOTO", label: "Foto" },
  { key: "COTIZACION", label: "Cotización" },
  { key: "FACTURA", label: "Factura" },
  { key: "ESPECIFICACION", label: "Especificación" },
  { key: "INFORME", label: "Informe" },
  { key: "OTRO", label: "Otro" },
];

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

export default function SubirDocumentoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    tipo: "OTRO",
    proyecto_id: "",
    etiquetas: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") loadProyectos();
  }, [status]);

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

  const showToast = (type: "ok" | "err", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      if (!form.nombre) {
        setForm({ ...form, nombre: e.dataTransfer.files[0].name });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      if (!form.nombre) {
        setForm({ ...form, nombre: e.target.files[0].name });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      showToast("err", "Selecciona un archivo");
      return;
    }

    if (!form.nombre.trim()) {
      showToast("err", "El nombre es requerido");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("nombre", form.nombre);
      formData.append("descripcion", form.descripcion);
      formData.append("tipo", form.tipo);
      formData.append("proyecto_id", form.proyecto_id);
      formData.append("etiquetas", form.etiquetas);
      formData.append("subido_por", session?.user?.id || "");

      const response = await fetch("/api/documentos", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) throw new Error(data.error);

      showToast("ok", "Documento subido exitosamente");
      setTimeout(() => router.push("/documentos"), 1500);
    } catch (error: any) {
      showToast("err", error.message || "Error al subir");
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = () => {
  if (!file) return File;
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (["pdf"].includes(ext || "")) return FileText;
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) return ImageIcon;
  if (["xls", "xlsx", "csv"].includes(ext || "")) return FileSpreadsheet;
  if (["zip", "rar", "7z"].includes(ext || "")) return FileArchive;
  return File;
};

  const FileIcon = getFileIcon();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-zinc-300" />
      </div>
    );
  }

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
              <h1 className="text-sm font-bold text-zinc-900 leading-none">Subir documento</h1>
              <p className="text-[10px] text-zinc-400 mt-0.5 uppercase tracking-wider">
                Añade un nuevo documento al archivo
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dropzone */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
              dragActive
                ? "border-zinc-900 bg-zinc-50"
                : "border-zinc-300 hover:border-zinc-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.dwg,.dxf,.zip,.rar,.txt"
            />

            {file ? (
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center">
                  <FileIcon className="h-6 w-6 text-zinc-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-zinc-900">{file.name}</p>
                  <p className="text-xs text-zinc-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB · {file.type || "Desconocido"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-1 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
                <p className="text-sm text-zinc-600">
                  Arrastra tu archivo aquí o haz clic para seleccionar
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  PDF, Word, Excel, Imágenes, DWG, ZIP (máx. 50MB)
                </p>
              </>
            )}
          </div>

          {/* Datos del documento */}
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider">Datos del documento</h2>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                Nombre *
              </label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"
                placeholder="Nombre del documento"
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
                placeholder="Descripción detallada del documento..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                  Tipo *
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
                  Proyecto asociado
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
                placeholder="contrato, qantua, fase2 (separadas por coma)"
              />
              <p className="text-[10px] text-zinc-400 mt-1">
                Separa las etiquetas por comas
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !file}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {loading ? "Subiendo..." : "Subir documento"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/documentos")}
              className="px-6 py-3 border border-zinc-200 text-zinc-600 text-sm font-semibold rounded-xl hover:bg-zinc-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}