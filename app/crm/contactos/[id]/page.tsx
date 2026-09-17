"use client";
// app/crm/contactos/[id]/page.tsx
// Módulo CRM — Editar Contacto · Autor: Jhon · APF1

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ChevronLeft, Save, Loader2, AlertCircle, CheckCircle2,
} from "lucide-react";
import ContactoForm from "../_components/ContactoForm";
import type { ContactoFormData } from "../_components/ContactoForm";

export default function EditarContactoPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [contacto, setContacto] = useState<ContactoFormData | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving]           = useState(false);
  const [error,  setError]            = useState<string | null>(null);
  const [exito,  setExito]            = useState(false);

  // ── Cargar datos del contacto ─────────────
  useEffect(() => {
    const fetchContacto = async () => {
      try {
        const res  = await fetch(`/api/crm/contactos/${id}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error ?? "No encontrado");
        setContacto(json.data);
      } catch (e: any) {
        setError(e.message ?? "Error al cargar el contacto");
      } finally {
        setLoadingData(false);
      }
    };
    if (id) fetchContacto();
  }, [id]);

  // ── Guardar cambios ────────────────────────
  const handleSubmit = async (datos: ContactoFormData) => {
    setSaving(true);
    setError(null);
    setExito(false);
    try {
      const res  = await fetch(`/api/crm/contactos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Error al guardar");
      setExito(true);
      setTimeout(() => router.push("/crm/contactos"), 1200);
    } catch (e: any) {
      setError(e.message ?? "Error inesperado");
    } finally {
      setSaving(false);
    }
  };

  // ──────────────────────────────────────────
  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-7 w-7 animate-spin text-[#C8A46B]" />
      </div>
    );
  }

  if (!contacto && error) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 max-w-lg">
        <AlertCircle className="h-4 w-4 shrink-0" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/crm/contactos")}
          className="flex items-center gap-1.5 text-[#9B9488] hover:text-[#14213D] text-sm transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Contactos
        </button>
        <span className="text-[#E8E4DC]">/</span>
        <span className="text-sm font-semibold text-[#14213D]">
          {contacto ? `${contacto.nombre} ${contacto.apellido}` : "Editar"}
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-serif text-[#14213D]">Editar contacto</h1>
        <p className="text-sm text-[#9B9488] mt-0.5">
          Modifica los datos del contacto y guarda los cambios
        </p>
      </div>

      {/* ── Mensajes ── */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
      {exito && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Contacto actualizado. Redirigiendo…
        </div>
      )}

      {/* ── Formulario ── */}
      {contacto && (
        <ContactoForm
          defaultValues={contacto}
          onSubmit={handleSubmit}
          loading={saving}
          submitLabel={
            saving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Guardando…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" /> Guardar cambios
              </span>
            )
          }
        />
      )}
    </div>
  );
}
