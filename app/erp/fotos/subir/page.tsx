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
  ImageIcon,
  Building2,
  Tag,
  Calendar,
  MapPin,
  Plus,
  Trash2,
  FileImage,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CATEGORIAS = [
  { key: "AVANCE", label: "Avance" },
  { key: "CALIDAD", label: "Calidad" },
  { key: "SEGURIDAD", label: "Seguridad" },
  { key: "INSTALACION", label: "Instalación" },
  { key: "FABRICACION", label: "Fabricación" },
  { key: "ACABADO", label: "Acabado" },
  { key: "REUNION", label: "Reunión" },
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

export default function SubirFotosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  const [archivos, setArchivos] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    categoria: "AVANCE",
    proyecto_id: "",
    descripcion: "",
    etiquetas: "",
    ubicacion: "",
    fecha_tomada: new Date().toISOString().split("T")[0],
  });

  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState(0);

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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/")
      );
      setArchivos((prev) => [...prev, ...files]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).filter((f) =>
        f.type.startsWith("image/")
      );
      setArchivos((prev) => [...prev, ...files]);
    }
  };

  const removeArchivo = (index: number) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (archivos.length === 0) {
      showToast("err", "Selecciona al menos una foto");
      return;
    }

    setSubiendo(true);
    setProgreso(0);

    try {
      let subidasExitosas = 0;

      for (let i = 0; i < archivos.length; i++) {
        const file = archivos[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("nombre", file.name);
        formData.append("descripcion", form.descripcion);
        formData.append("categoria", form.categoria);
        formData.append("proyecto_id", form.proyecto_id);
        formData.append("etiquetas", form.etiquetas);
        formData.append("ubicacion", form.ubicacion);
        formData.append("fecha_tomada", form.fecha_tomada);
        formData.append("subido_por", session?.user?.id || "");

        const response = await fetch("/api/fotos", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          subidasExitosas++;
        }

        setProgreso(Math.round(((i + 1) / archivos.length) * 100));
      }

      if (subidasExitosas === archivos.length) {
        showToast("ok", `${subidasExitosas} fotos subidas exitosamente`);
        setTimeout(() => router.push("/fotos"), 1500);
      } else {
        showToast("err", `${subidasExitosas}/${archivos.length} fotos subidas`);
      }
    } catch (error: any) {
      showToast("err", error.message || "Error al subir fotos");
    } finally {
      setSubiendo(false);
    }
  };

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
              onClick={() => router.push("/fotos")}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-700 text-sm transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Fotos
            </button>
            <div className="h-4 w-px bg-zinc-200" />
            <div>
              <h1 className="text-sm font-bold text-zinc-900 leading-none">Subir fotos</h1>
              <p className="text-[10px] text-zinc-400 mt-0.5 uppercase tracking-wider">
                Evidencias visuales de obra
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
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
              accept="image/*"
              multiple
            />

            <Upload className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
            <p className="text-sm text-zinc-600">
              Arrastra tus fotos aquí o haz clic para seleccionar
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              Formatos: JPG, PNG, WEBP (máx. 10MB cada una)
            </p>
          </div>

          {/* Previsualización */}
          {archivos.length > 0 && (
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-4">
              <p className="text-xs font-semibold text-zinc-700 mb-3">
                {archivos.length} foto{archivos.length > 1 ? "s" : ""} seleccionada{archivos.length > 1 ? "s" : ""}
              </p>
              <div className="flex flex-wrap gap-3">
                {archivos.map((file, idx) => (
                  <div key={idx} className="relative group">
                    <div className="w-20 h-20 rounded-xl bg-zinc-100 overflow-hidden">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeArchivo(idx)}
                      className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <p className="text-[9px] text-zinc-400 truncate w-20 text-center mt-1">{file.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Datos */}
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider">Información de las fotos</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                  Categoría *
                </label>
                <select
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"
                >
                  {CATEGORIAS.map((c) => (
                    <option key={c.key} value={c.key}>{c.label}</option>
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

              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                  Descripción
                </label>
                <textarea
                  rows={2}
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors resize-none"
                  placeholder="Descripción de las fotos..."
                />
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
                  placeholder="instalacion, estructuras, qantua"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                  Ubicación
                </label>
                <input
                  type="text"
                  value={form.ubicacion}
                  onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"
                  placeholder="Torre A, Piso 3"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                  Fecha de la foto
                </label>
                <input
                  type="date"
                  value={form.fecha_tomada}
                  onChange={(e) => setForm({ ...form, fecha_tomada: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Progreso */}
          {subiendo && (
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-zinc-700">Subiendo fotos...</p>
                <p className="text-xs text-zinc-500">{progreso}%</p>
              </div>
              <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-900 rounded-full transition-all duration-300"
                  style={{ width: `${progreso}%` }}
                />
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={subiendo || archivos.length === 0}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              {subiendo ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {subiendo ? "Subiendo..." : `Subir ${archivos.length} foto${archivos.length > 1 ? "s" : ""}`}
            </button>
            <button
              type="button"
              onClick={() => router.push("/fotos")}
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