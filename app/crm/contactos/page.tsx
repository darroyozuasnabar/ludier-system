"use client";
// app/crm/contactos/page.tsx
// Módulo CRM — Listado de Contactos · Autor: Jhon · APF1

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Search, RefreshCw, UserCircle2, Building2, Mail,
  Phone, Pencil, Trash2, X, AlertCircle, CheckCircle2,
  Loader2, Users, UserCheck, UserX, Filter,
} from "lucide-react";

// ──────────────────────────────────────────────
// Tipos
// ──────────────────────────────────────────────
interface Contacto {
  id: string;
  nombre: string;
  apellido: string;
  cargo: string | null;
  empresa: string | null;
  email: string | null;
  telefono: string | null;
  estado: "ACTIVO" | "INACTIVO" | "PROSPECTO";
  notas: string | null;
  created_at: string;
}

// ──────────────────────────────────────────────
// Constantes de estilo
// ──────────────────────────────────────────────
const ESTADO_BADGE: Record<string, { label: string; cls: string }> = {
  ACTIVO:    { label: "Activo",    cls: "bg-emerald-100 text-emerald-700" },
  INACTIVO:  { label: "Inactivo",  cls: "bg-zinc-100 text-zinc-500"       },
  PROSPECTO: { label: "Prospecto", cls: "bg-amber-100 text-amber-700"     },
};

// ──────────────────────────────────────────────
// Sub-componentes auxiliares
// ──────────────────────────────────────────────
function Toast({
  type,
  msg,
  onClose,
}: {
  type: "ok" | "err";
  msg: string;
  onClose: () => void;
}) {
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

function KpiCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#F0EDE7] p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent}`}>
          <Icon className="h-4 w-4 text-[#14213D]" />
        </div>
        <span className="text-2xl font-bold text-[#14213D]">{value}</span>
      </div>
      <p className="text-[11px] font-medium text-[#9B9488] uppercase tracking-widest mt-2">
        {label}
      </p>
    </div>
  );
}

// ──────────────────────────────────────────────
// Página principal
// ──────────────────────────────────────────────
export default function ContactosPage() {
  const router = useRouter();

  const [contactos, setContactos]   = useState<Contacto[]>([]);
  const [loading, setLoading]       = useState(true);
  const [toast, setToast]           = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [deleting, setDeleting]     = useState<string | null>(null);

  // Filtros
  const [q, setQ]                   = useState("");
  const [filtroEstado, setFiltroEstado] = useState("ALL");

  const showToast = (type: "ok" | "err", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Cargar contactos ──────────────────────
  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q)                      params.set("q", q);
      if (filtroEstado !== "ALL") params.set("estado", filtroEstado);

      const res  = await fetch(`/api/crm/contactos?${params.toString()}`);
      const json = await res.json();

      if (!json.success) throw new Error(json.error);
      setContactos(json.data ?? []);
    } catch (e: any) {
      showToast("err", e.message ?? "Error al cargar contactos");
    } finally {
      setLoading(false);
    }
  }, [q, filtroEstado]);

  useEffect(() => { cargar(); }, [cargar]);

  // ── Eliminar contacto ─────────────────────
  const handleEliminar = async (c: Contacto) => {
    if (!confirm(`¿Eliminar a ${c.nombre} ${c.apellido}? Esta acción no se puede deshacer.`)) return;
    setDeleting(c.id);
    try {
      const res  = await fetch(`/api/crm/contactos/${c.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      showToast("ok", json.message);
      cargar();
    } catch (e: any) {
      showToast("err", e.message ?? "Error al eliminar");
    } finally {
      setDeleting(null);
    }
  };

  // ── KPIs derivados ─────────────────────────
  const total     = contactos.length;
  const activos   = contactos.filter((c) => c.estado === "ACTIVO").length;
  const prospectos = contactos.filter((c) => c.estado === "PROSPECTO").length;
  const inactivos = contactos.filter((c) => c.estado === "INACTIVO").length;

  // ──────────────────────────────────────────
  return (
    <div className="space-y-8">
      {toast && <Toast type={toast.type} msg={toast.msg} onClose={() => setToast(null)} />}

      {/* ── Encabezado ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-serif text-[#14213D]">Contactos</h1>
          <p className="text-sm text-[#9B9488] mt-0.5">
            Personas de contacto del CRM LUDIER
          </p>
        </div>
        <button
          onClick={() => router.push("/crm/contactos/nuevo")}
          className="flex items-center gap-2 px-4 py-2 bg-[#14213D] text-white text-xs font-semibold rounded-xl hover:bg-[#1e2e52] transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Nuevo contacto
        </button>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={Users}     label="Total"      value={total}     accent="bg-[#F5F1EB]" />
        <KpiCard icon={UserCheck} label="Activos"    value={activos}   accent="bg-emerald-50" />
        <KpiCard icon={UserCircle2} label="Prospectos" value={prospectos} accent="bg-amber-50" />
        <KpiCard icon={UserX}     label="Inactivos"  value={inactivos} accent="bg-zinc-50" />
      </div>

      {/* ── Filtros ── */}
      <div className="bg-white rounded-2xl border border-[#F0EDE7] shadow-sm p-5">
        <div className="flex items-center flex-wrap gap-3">
          <Filter className="h-4 w-4 text-[#9B9488]" />
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9B9488]" />
            <input
              type="text"
              placeholder="Buscar por nombre, empresa o email…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-[#E8E4DC] rounded-lg bg-[#FAF8F4] text-[#14213D] placeholder:text-[#9B9488] focus:outline-none focus:ring-2 focus:ring-[#C8A46B]/50"
            />
          </div>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-1.5 text-xs border border-[#E8E4DC] rounded-lg bg-[#FAF8F4] text-[#14213D]"
          >
            <option value="ALL">Todos los estados</option>
            <option value="ACTIVO">Activo</option>
            <option value="PROSPECTO">Prospecto</option>
            <option value="INACTIVO">Inactivo</option>
          </select>
          <button
            onClick={cargar}
            className="p-2 text-[#9B9488] hover:text-[#14213D] hover:bg-[#F5F1EB] rounded-lg transition-colors"
            title="Actualizar"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Tabla / Lista ── */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-7 w-7 animate-spin text-[#C8A46B]" />
        </div>
      ) : contactos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#F0EDE7] p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#F5F1EB] flex items-center justify-center mx-auto mb-4">
            <Users className="h-7 w-7 text-[#C8A46B]" />
          </div>
          <p className="text-sm text-[#9B9488]">No hay contactos registrados</p>
          <p className="text-xs text-[#C4BFB7] mt-1">
            Crea el primero con el botón "Nuevo contacto"
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#F0EDE7] shadow-sm overflow-hidden">
          {/* Encabezado tabla — desktop */}
          <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-[#FAF8F4] border-b border-[#F0EDE7] text-[10px] font-bold text-[#9B9488] uppercase tracking-widest">
            <span>Nombre</span>
            <span>Empresa / Email</span>
            <span>Teléfono</span>
            <span>Estado</span>
            <span>Acciones</span>
          </div>

          {/* Filas */}
          <div className="divide-y divide-[#F5F1EB]">
            {contactos.map((c) => {
              const badge = ESTADO_BADGE[c.estado] ?? ESTADO_BADGE.ACTIVO;
              return (
                <div
                  key={c.id}
                  className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr_1fr_auto] gap-3 px-5 py-4 items-center hover:bg-[#FAF8F4] transition-colors"
                >
                  {/* Nombre + cargo */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#F5F1EB] flex items-center justify-center shrink-0">
                      <UserCircle2 className="h-5 w-5 text-[#C8A46B]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#14213D] leading-tight">
                        {c.nombre} {c.apellido}
                      </p>
                      {c.cargo && (
                        <p className="text-[11px] text-[#9B9488]">{c.cargo}</p>
                      )}
                    </div>
                  </div>

                  {/* Empresa + email */}
                  <div className="space-y-0.5">
                    {c.empresa && (
                      <p className="flex items-center gap-1.5 text-xs text-[#5B5750]">
                        <Building2 className="h-3 w-3 text-[#C8A46B] shrink-0" />
                        {c.empresa}
                      </p>
                    )}
                    {c.email && (
                      <p className="flex items-center gap-1.5 text-xs text-[#9B9488]">
                        <Mail className="h-3 w-3 shrink-0" />
                        {c.email}
                      </p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div>
                    {c.telefono ? (
                      <p className="flex items-center gap-1.5 text-xs text-[#5B5750]">
                        <Phone className="h-3 w-3 text-[#C8A46B] shrink-0" />
                        {c.telefono}
                      </p>
                    ) : (
                      <span className="text-xs text-[#C4BFB7]">—</span>
                    )}
                  </div>

                  {/* Estado */}
                  <div>
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${badge.cls}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => router.push(`/crm/contactos/${c.id}`)}
                      className="p-1.5 text-[#9B9488] hover:text-[#14213D] hover:bg-[#F5F1EB] rounded-lg transition-colors"
                      title="Editar contacto"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEliminar(c)}
                      disabled={deleting === c.id}
                      className="p-1.5 text-[#9B9488] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                      title="Eliminar contacto"
                    >
                      {deleting === c.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
