"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Camera,
  Image as ImageIcon,
  Search,
  Filter,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  List,
  Calendar,
  MapPin,
  FolderOpen,
} from "lucide-react";
import Image from "next/image";

const formatDate = (date: string) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const CATEGORIAS = [
  "TODAS",
  "AVANCE",
  "CALIDAD",
  "SEGURIDAD",
  "INSTALACION",
  "FABRICACION",
  "ACABADO",
  "REUNION",
  "OTRO",
];

const COLORS_CATEGORIA: Record<string, string> = {
  AVANCE: "bg-blue-100 text-blue-700",
  CALIDAD: "bg-green-100 text-green-700",
  SEGURIDAD: "bg-red-100 text-red-700",
  INSTALACION: "bg-purple-100 text-purple-700",
  FABRICACION: "bg-orange-100 text-orange-700",
  ACABADO: "bg-pink-100 text-pink-700",
  REUNION: "bg-yellow-100 text-yellow-700",
  OTRO: "bg-gray-100 text-gray-700",
};

export default function ClienteFotosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fotos, setFotos] = useState<any[]>([]);
  const [albumes, setAlbumes] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [categoria, setCategoria] = useState("TODAS");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFoto, setSelectedFoto] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/cliente/login");
      return;
    }
    if (status === "authenticated" && session?.user?.role !== "CLIENTE") {
      router.push("/dashboard");
      return;
    }
    if (status === "authenticated") {
      fetchFotos();
    }
  }, [status, session, categoria, pagination.page]);

  const fetchFotos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: "20",
        categoria: categoria,
      });
      const res = await fetch(`/api/cliente/fotos?${params}`);
      if (!res.ok) throw new Error("Error al cargar fotos");
      const data = await res.json();
      setFotos(data.fotos || []);
      setAlbumes(data.albumes || []);
      setPagination(data.pagination || { page: 1, totalPages: 1 });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoriaChange = (cat: string) => {
    setCategoria(cat);
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  const fotosFiltradas = fotos.filter(f =>
    f.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <span className="ml-3 text-sm text-gray-500">Cargando fotos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Galería de fotos</h1>
          <p className="text-sm text-gray-500">
            {fotos.length} fotos disponibles
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Vista grid/list */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar fotos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoriaChange(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                categoria === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat === "TODAS" ? "Todas" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Álbumes */}
      {albumes.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Álbumes
          </h3>
          <div className="flex flex-wrap gap-2">
            {albumes.map((album) => (
              <div
                key={album.id}
                className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg text-sm"
              >
                <FolderOpen className="h-3 w-3 text-gray-400" />
                <span>{album.nombre}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid de fotos */}
      {fotosFiltradas.length > 0 ? (
        <div className={viewMode === "grid" 
          ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          : "space-y-3"
        }>
          {fotosFiltradas.map((foto) => (
            <div
              key={foto.id}
              onClick={() => setSelectedFoto(foto)}
              className={`
                group relative bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer
                hover:shadow-lg transition-all duration-200
                ${viewMode === "list" ? "flex items-center gap-4 p-3" : "aspect-square"}
              `}
            >
              {viewMode === "grid" ? (
                <>
                  <img
                    src={foto.url}
                    alt={foto.nombre}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <p className="text-xs text-white font-medium truncate">{foto.nombre}</p>
                    <p className="text-[10px] text-white/70">{formatDate(foto.fecha_subida)}</p>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${COLORS_CATEGORIA[foto.categoria] || "bg-gray-100 text-gray-700"}`}>
                      {foto.categoria}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <img src={foto.url} alt={foto.nombre} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{foto.nombre}</p>
                    {foto.descripcion && (
                      <p className="text-xs text-gray-500 truncate">{foto.descripcion}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span className={`px-2 py-0.5 rounded-full ${COLORS_CATEGORIA[foto.categoria] || "bg-gray-100 text-gray-700"}`}>
                        {foto.categoria}
                      </span>
                      <span>{formatDate(foto.fecha_subida)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Camera className="h-12 w-12 mx-auto text-gray-300" />
          <p className="text-gray-500 mt-2">No hay fotos disponibles</p>
        </div>
      )}

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-gray-600">
            Página {pagination.page} de {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Modal de foto */}
      {selectedFoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedFoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedFoto(null)}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={selectedFoto.url}
              alt={selectedFoto.nombre}
              className="w-full max-h-[70vh] object-contain bg-gray-100"
            />
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">{selectedFoto.nombre}</h3>
              {selectedFoto.descripcion && (
                <p className="text-sm text-gray-600 mt-1">{selectedFoto.descripcion}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                <span className={`px-2 py-0.5 rounded-full ${COLORS_CATEGORIA[selectedFoto.categoria] || "bg-gray-100 text-gray-700"}`}>
                  {selectedFoto.categoria}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(selectedFoto.fecha_subida)}
                </span>
                {selectedFoto.ubicacion && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {selectedFoto.ubicacion}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}