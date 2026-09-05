"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  Plus,
  Eye,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ImageIcon,
  Calendar,
  Building2,
  User,
  Search,
  Filter,
  X,
  Download,
  RefreshCw,
  Grid,
  List,
  FolderOpen,
  Camera,
  Tag,
  MapPin,
  Clock,
  Upload,
  Layers,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CATEGORIAS = [
  { key: "AVANCE", label: "Avance", color: "blue" },
  { key: "CALIDAD", label: "Calidad", color: "purple" },
  { key: "SEGURIDAD", label: "Seguridad", color: "red" },
  { key: "INSTALACION", label: "Instalación", color: "orange" },
  { key: "FABRICACION", label: "Fabricación", color: "amber" },
  { key: "ACABADO", label: "Acabado", color: "green" },
  { key: "REUNION", label: "Reunión", color: "indigo" },
  { key: "OTRO", label: "Otro", color: "gray" },
];

const getCategoriaInfo = (categoria: string) => {
  return CATEGORIAS.find((c) => c.key === categoria) || CATEGORIAS[7];
};

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

export default function FotosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [fotos, setFotos] = useState<any[]>([]);
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [filterCategoria, setFilterCategoria] = useState<string>("ALL");
  const [filterProyecto, setFilterProyecto] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFoto, setSelectedFoto] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      loadFotos();
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

  const loadFotos = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("Foto")
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

      if (filterCategoria !== "ALL") {
        query = query.eq("categoria", filterCategoria);
      }

      if (filterProyecto !== "ALL") {
        query = query.eq("proyecto_id", filterProyecto);
      }

      if (searchTerm) {
        query = query.ilike("nombre", `%${searchTerm}%`)
          .or(`descripcion.ilike.%${searchTerm}%,etiquetas.cs.{${searchTerm}}`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setFotos(data || []);
    } catch (error) {
      console.error("Error cargando fotos:", error);
      showToast("err", "Error al cargar fotos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta foto?")) return;

    try {
      const { error } = await supabase
        .from("Foto")
        .update({ activo: false })
        .eq("id", id);

      if (error) throw error;

      showToast("ok", "Foto eliminada");
      loadFotos();
    } catch (error: any) {
      showToast("err", error.message || "Error al eliminar");
    }
  };

  const handleDownload = async (url: string, nombre: string) => {
    try {
      const { data } = await supabase.storage
        .from("fotos")
        .download(url);

      if (!data) throw new Error("No se pudo descargar");

      const blob = new Blob([data]);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = nombre;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      showToast("err", "Error al descargar");
    }
  };

  const openFoto = (foto: any) => {
    setSelectedFoto(foto);
    setShowModal(true);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-zinc-300" />
      </div>
    );
  }

  const totalFotos = fotos.length;
  const categoriasCount = fotos.reduce((acc: any, f) => {
    acc[f.categoria] = (acc[f.categoria] || 0) + 1;
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

      {/* Modal de foto */}
      {showModal && selectedFoto && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-sm font-bold text-zinc-900">{selectedFoto.nombre}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="bg-zinc-100 rounded-xl overflow-hidden flex items-center justify-center min-h-[300px]">
                <img
                  src={selectedFoto.url}
                  alt={selectedFoto.nombre}
                  className="max-h-[60vh] object-contain"
                  onError={(e) => {
                    // Si no se puede cargar la imagen, mostrar placeholder
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-zinc-500">Descripción</p>
                  <p className="text-sm text-zinc-800">{selectedFoto.descripcion || "Sin descripción"}</p>
                </div>
                <div className="space-y-1 text-sm">
                  <p><span className="text-zinc-500">Categoría:</span> {selectedFoto.categoria}</p>
                  {selectedFoto.proyecto && (
                    <p><span className="text-zinc-500">Proyecto:</span> {selectedFoto.proyecto.name}</p>
                  )}
                  <p><span className="text-zinc-500">Fecha:</span> {new Date(selectedFoto.fecha_subida).toLocaleDateString("es-PE")}</p>
                  {selectedFoto.ubicacion && (
                    <p><span className="text-zinc-500">Ubicación:</span> {selectedFoto.ubicacion}</p>
                  )}
                </div>
              </div>
              {selectedFoto.etiquetas && selectedFoto.etiquetas.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-zinc-500">Etiquetas</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedFoto.etiquetas.map((tag: string, i: number) => (
                      <span key={i} className="text-[10px] bg-zinc-100 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <header className="bg-white border-b border-zinc-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/erp/dashboard")}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-700 text-sm transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Dashboard
            </button>
            <div className="h-4 w-px bg-zinc-200" />
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center">
                <ImageIcon className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-zinc-900 leading-none">Panel de Fotos</h1>
                <p className="text-[10px] text-zinc-400 mt-0.5 uppercase tracking-wider">
                  Evidencias visuales · LUDIER
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/fotos/subir")}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-xs font-semibold rounded-xl hover:bg-zinc-800 transition-colors"
            >
              <Upload className="h-3.5 w-3.5" />
              Subir fotos
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm">
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Total fotos</p>
            <p className="text-2xl font-bold text-zinc-900">{totalFotos}</p>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm">
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Categorías</p>
            <p className="text-2xl font-bold text-zinc-900">{Object.keys(categoriasCount).length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm">
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Proyectos</p>
            <p className="text-2xl font-bold text-zinc-900">{proyectos.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm">
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Última subida</p>
            <p className="text-sm font-semibold text-zinc-900">
              {fotos.length > 0 
                ? new Date(fotos[0].fecha_subida).toLocaleDateString("es-PE")
                : "Sin fotos"}
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-4">
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
                  placeholder="Buscar fotos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadFotos()}
                  className="pl-9 pr-3 py-2 text-xs border border-zinc-200 rounded-lg bg-white text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 w-48"
                />
              </div>
              <select
                value={filterCategoria}
                onChange={(e) => setFilterCategoria(e.target.value)}
                className="px-3 py-2 text-xs border border-zinc-200 rounded-lg bg-white text-zinc-700"
              >
                <option value="ALL">Todas las categorías</option>
                {CATEGORIAS.map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
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
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-zinc-200 text-zinc-900" : "text-zinc-400 hover:text-zinc-700"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list" ? "bg-zinc-200 text-zinc-900" : "text-zinc-400 hover:text-zinc-700"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={loadFotos}
                className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                title="Actualizar"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Galería */}
        {fotos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-100 p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="h-7 w-7 text-zinc-200" />
            </div>
            <p className="text-sm text-zinc-400">No hay fotos registradas</p>
            <p className="text-xs text-zinc-300 mt-1">
              Sube fotos con el botón "Subir fotos"
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {fotos.map((foto) => {
              const categoriaInfo = getCategoriaInfo(foto.categoria);
              return (
                <div
                  key={foto.id}
                  className="group bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => openFoto(foto)}
                >
                  <div className="aspect-square bg-zinc-100 relative overflow-hidden">
                    <img
                      src={foto.url}
                      alt={foto.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder-image.svg";
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full bg-${categoriaInfo.color}-100 text-${categoriaInfo.color}-700`}>
                        {categoriaInfo.label}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(foto.url, foto.nombre);
                        }}
                        className="p-2 bg-white rounded-full hover:bg-zinc-100"
                      >
                        <Download className="h-4 w-4 text-zinc-900" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(foto.id);
                        }}
                        className="p-2 bg-white rounded-full hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium text-zinc-900 truncate">{foto.nombre}</p>
                    <p className="text-[10px] text-zinc-400 truncate">
                      {foto.proyecto?.name || "Sin proyecto"} · {formatFileSize(foto.tamanio || 0)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {fotos.map((foto) => {
              const categoriaInfo = getCategoriaInfo(foto.categoria);
              return (
                <div
                  key={foto.id}
                  className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => openFoto(foto)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-zinc-100 overflow-hidden flex-shrink-0">
                      <img
                        src={foto.url}
                        alt={foto.nombre}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder-image.svg";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-zinc-900 truncate">{foto.nombre}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full bg-${categoriaInfo.color}-100 text-${categoriaInfo.color}-700`}>
                          {categoriaInfo.label}
                        </span>
                      </div>
                      {foto.descripcion && (
                        <p className="text-xs text-zinc-500 truncate">{foto.descripcion}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-zinc-400">
                        <span>{foto.proyecto?.name || "Sin proyecto"}</span>
                        <span>·</span>
                        <span>{new Date(foto.fecha_subida).toLocaleDateString("es-PE")}</span>
                        <span>·</span>
                        <span>{formatFileSize(foto.tamanio || 0)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(foto.url, foto.nombre);
                        }}
                        className="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(foto.id);
                        }}
                        className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}