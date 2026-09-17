"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Loader2,
  Users,
  Mail,
  Phone,
  MapPin,
  Building2,
} from "lucide-react";

export default function ClientesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState<any>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    ruc: "",
    tipo_documento: "RUC",
    numero_documento: "",
    direccion: "",
    telefono: "",
    email: "",
    sitio_web: "",
    sector: "",
    tamano_empresa: "",
    notas: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchClientes();
    }
  }, [status, router]);

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/crm/clientes?search=${search}`);
      const data = await res.json();
      if (data.success) setClientes(data.data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchClientes();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCliente
        ? `/api/crm/clientes/${editingCliente.id}`
        : "/api/crm/clientes";
      const method = editingCliente ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setEditingCliente(null);
        resetForm();
        fetchClientes();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este cliente?")) return;
    try {
      const res = await fetch(`/api/crm/clientes/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchClientes();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (cliente: any) => {
    setEditingCliente(cliente);
    setFormData({
      nombre: cliente.nombre || "",
      ruc: cliente.ruc || "",
      tipo_documento: cliente.tipo_documento || "RUC",
      numero_documento: cliente.numero_documento || "",
      direccion: cliente.direccion || "",
      telefono: cliente.telefono || "",
      email: cliente.email || "",
      sitio_web: cliente.sitio_web || "",
      sector: cliente.sector || "",
      tamano_empresa: cliente.tamano_empresa || "",
      notas: cliente.notas || "",
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      ruc: "",
      tipo_documento: "RUC",
      numero_documento: "",
      direccion: "",
      telefono: "",
      email: "",
      sitio_web: "",
      sector: "",
      tamano_empresa: "",
      notas: "",
    });
  };

  const handleNew = () => {
    setEditingCliente(null);
    resetForm();
    setShowModal(true);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-zinc-300" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-zinc-900">Clientes</h1>
              <p className="text-xs text-zinc-500">Gestión de clientes del CRM</p>
            </div>
          </div>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nuevo cliente
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Búsqueda */}
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, RUC o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-zinc-100 text-zinc-700 rounded-xl hover:bg-zinc-200 transition-colors text-sm font-medium"
          >
            Buscar
          </button>
        </form>

        {/* Tabla */}
        {clientes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-100 p-16 text-center">
            <Users className="h-12 w-12 mx-auto text-zinc-200 mb-4" />
            <p className="text-zinc-400">No hay clientes registrados</p>
            <button
              onClick={handleNew}
              className="mt-4 text-sm text-zinc-900 hover:underline"
            >
              Crear el primer cliente
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-zinc-50 border-b border-zinc-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">RUC</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">Contacto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">Sector</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-zinc-600" />
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900">{cliente.nombre}</p>
                          {cliente.direccion && (
                            <p className="text-xs text-zinc-500 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {cliente.direccion}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-700">{cliente.ruc || "—"}</td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-xs text-zinc-600">
                        {cliente.email && (
                          <p className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {cliente.email}
                          </p>
                        )}
                        {cliente.telefono && (
                          <p className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {cliente.telefono}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-700">{cliente.sector || "—"}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(cliente)}
                          className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cliente.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-zinc-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900">
                {editingCliente ? "Editar cliente" : "Nuevo cliente"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-2 bg-white text-zinc-900 placeholder:text-zinc-400 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">RUC</label>
                  <input
                    type="text"
                    value={formData.ruc}
                    onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Sector</label>
                  <input
                    type="text"
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Dirección</label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Notas</label>
                <textarea
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-white text-zinc-900 placeholder:text-zinc-400 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-zinc-200 text-zinc-700 rounded-xl hover:bg-zinc-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors"
                >
                  {editingCliente ? "Guardar cambios" : "Crear cliente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}