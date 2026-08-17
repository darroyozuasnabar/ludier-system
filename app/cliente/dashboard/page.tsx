"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Building2, Calendar, Camera, CheckCircle2, Clock, Loader2, TrendingUp } from "lucide-react";
import Image from "next/image";
import { signOut } from "next-auth/react";

const formatCOP = (value: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(value);

export default function ClienteDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

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
      fetchDashboard();
    }
  }, [status, session]);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/cliente/dashboard");
      if (!res.ok) throw new Error("Error al cargar datos");
      const data = await res.json();
      setData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-3 text-sm text-gray-500">Cargando tu proyecto...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">{error || "No se pudo cargar el dashboard"}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const { project, fotos } = data;
  const avance = project?.avance || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">LUDIER</h1>
              <p className="text-xs text-gray-500">Panel de seguimiento de proyecto</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Bienvenido, {session?.user?.name || "Cliente"}</span>
            <button
              onClick={() => signOut()}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Resumen del proyecto */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{project?.name || "Proyecto"}</h2>
              <p className="text-sm text-gray-500">Cliente: {project?.client || "—"}</p>
              <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {project?.location || "Ubicación no especificada"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Inicio: {project?.startDate ? new Date(project.startDate).toLocaleDateString("es-PE") : "—"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Avance total</p>
                <p className="text-3xl font-bold text-gray-900">{avance.toFixed(1)}%</p>
              </div>
              <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-900 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(avance, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Fotos */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Fotos del proyecto
            <span className="text-xs font-normal text-gray-400 ml-2">
              {fotos?.length || 0} fotos
            </span>
          </h3>
          {fotos && fotos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {fotos.map((foto: any) => (
                <div key={foto.id} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                  <img
                    src={foto.url}
                    alt={foto.nombre}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                    <p className="text-xs text-white truncate">{foto.categoria}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">No hay fotos disponibles</p>
          )}
        </div>
      </main>
    </div>
  );
}