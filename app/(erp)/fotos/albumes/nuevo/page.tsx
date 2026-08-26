"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  Save,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ImageIcon,
  Building2,
  FileText,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

export default function NuevoAlbumPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    proyecto_id: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nombre.trim()) {
      showToast("err", "El nombre es requerido");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("Album")
        .insert({
          nombre: form.nombre,
          descripcion: form.descripcion || null,
          proyecto_id: form.proyecto_id || null,
        })
        .select()
        .single();

      if (error) throw error;

      showToast("ok", "Álbum creado exitosamente");
      setTimeout(() => router.push("/fotos/albumes"), 1500);
    } catch (error: any) {
      showToast("err", error.message || "Error al crear álbum");
    } finally {
      setLoading(false);
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
              onClick={() => router.push("/fotos/albumes")}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-700 text-sm transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Álbumes
            </button>
            <div className="h-4 w-px bg-zinc-200" />
            <div>
              <h1 className="text-sm font-bold text-zinc-900 leading-none">Nuevo álbum</h1>
              <p className="text-[10px] text-zinc-400 mt-0.5 uppercase tracking-wider">
                Organiza tus fotos
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 space-y-4">
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
              Nombre *
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full px-4 py-2.5 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-colors"
              placeholder="Ej: Qantua Fase 2 - Instalación"
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
              placeholder="Descripción del álbum..."
            />
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

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {loading ? "Creando..." : "Crear álbum"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/fotos/albumes")}
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