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
  ImageIcon,
  Calendar,
  Building2,
  User,
  MapPin,
  Clock,
  RefreshCw,
  Tag,
  Save,
  X,
  Link,
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

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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

export default function FotoDetallePage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [foto, setFoto] = useState<any>(null);
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [editando, setEditando] = useState(false);
  const [albumes, setAlbumes] = useState<any[]>([]);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    categoria: "AVANCE",
    proyecto_id: "",
    etiquetas: "",
    ubicacion: "",
    fecha_tomada: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      loadFoto();
      loadProyectos();
      loadAlbumes();
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

  const loadAlbumes = async () => {
    try {
      const { data } = await supabase
        .from("Album")
        .select("id, nombre")
        .eq("activo", true)
        .order("nombre");
      setAlbumes(data || []);
    } catch (error) {
      console.error("Error cargando álbumes:", error);
    }
  };

  const loadFoto = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/fotos/${params.id}`);
      const data = await response.json();

      if (!data.success) throw new Error(data.error);

      setFoto(data.data);
      setForm({
        nombre: data.data.nombre || "",
        descripcion: data.data.descripcion || "",
        categoria: data.data.categoria || "AVANCE",
        proyecto_id: data.data.proyecto_id || "",
        etiquetas: data.data.etiquetas?.join(", ") || "",
        ubicacion: data.data.ubicacion || "",
        fecha_tomada: data.data.fecha_tomada || "",
      });
    } catch (error: any) {
      showToast("err", error.message || "Error al cargar la foto");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!foto) return;

    try {
      const { data } = await supabase.storage
        .from("fotos")
        .download(foto.url);

      if (!data) throw new Error("No se pudo descargar");

      const blob = new Blob([data]);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = foto.nombre;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      showToast("err", "Error al descargar");
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar esta foto?")) return;

    try {
      const response = await fetch(`/api/fotos/${params.id}`, { method: "DELETE" });
      const data = await response.json();

      if (!data.success) throw new Error(data.error);

      showToast("ok", "Foto eliminada");
      setTimeout(() => router.push("/fotos"), 1000);
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
      const response = await fetch(`/api/fotos/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!data.success) throw new Error(data.error);

      showToast("ok", "Foto actualizada");
      setEditando(false);
      loadFoto();
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

  if (!foto) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <ImageIcon className="h-12 w-12 text-zinc-200 mx-auto mb-3" />
          <p className="text-sm text-zinc-400">Foto no encontrada</p>
          <button
            onClick={() => router.push("/fotos")}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Volver a fotos
          </button>
        </div>
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
              <h1 className="text-sm font-bold text-zinc-900 leading-none truncate max-w-xs">
                {foto.nombre}
              </h1>
              <p className="text-[10px] text-zinc-400 mt-0.5 uppercase tracking-wider">
                {foto.categoria}
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
              onClick={loadFoto}
              className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Imagen */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-4">
          <div className="bg-zinc-100 rounded-xl overflow-hidden flex items-center justify-center min-h-[400px]">
            <img
              src={foto.url}
              alt={foto.nombre}
              className="max-h-[70vh] object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        </div>

        {/* Información */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
          {editando ? (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider">Editar foto</h2>

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
                  rows={2}
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                    Categoría
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
                  placeholder="instalacion, estructuras, qantua"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    loadFoto();
                  }}
                  className="px-4 py-2 border border-zinc-200 text-zinc-600 text-sm font-medium rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-900">{foto.categoria}</span>
                </div>
                {foto.descripcion && (
                  <p className="text-sm text-zinc-600">{foto.descripcion}</p>
                )}
                {foto.etiquetas && foto.etiquetas.length > 0 && (
                  <div>
                    <p className="text-xs text-zinc-500">Etiquetas</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {foto.etiquetas.map((tag: string, i: number) => (
                        <span key={i} className="text-[10px] bg-zinc-100 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-zinc-100 pb-2">
                  <span className="text-zinc-500">Tamaño</span>
                  <span className="font-medium text-zinc-900">{formatFileSize(foto.tamanio || 0)}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-100 pb-2">
                  <span className="text-zinc-500">Extensión</span>
                  <span className="font-medium text-zinc-900">{foto.extension || "N/A"}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-100 pb-2">
                  <span className="text-zinc-500">Subida</span>
                  <span className="font-medium text-zinc-900">
                    {new Date(foto.fecha_subida).toLocaleString("es-PE")}
                  </span>
                </div>
                {foto.fecha_tomada && (
                  <div className="flex justify-between border-b border-zinc-100 pb-2">
                    <span className="text-zinc-500">Fecha tomada</span>
                    <span className="font-medium text-zinc-900">
                      {new Date(foto.fecha_tomada).toLocaleDateString("es-PE")}
                    </span>
                  </div>
                )}
                {foto.ubicacion && (
                  <div className="flex justify-between border-b border-zinc-100 pb-2">
                    <span className="text-zinc-500">Ubicación</span>
                    <span className="font-medium text-zinc-900">{foto.ubicacion}</span>
                  </div>
                )}
                {foto.proyecto && (
                  <div className="flex justify-between border-b border-zinc-100 pb-2">
                    <span className="text-zinc-500">Proyecto</span>
                    <span className="font-medium text-zinc-900">{foto.proyecto.name}</span>
                  </div>
                )}
                {foto.subido_por_user && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Subido por</span>
                    <span className="font-medium text-zinc-900">
                      {foto.subido_por_user.name || foto.subido_por_user.email}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}