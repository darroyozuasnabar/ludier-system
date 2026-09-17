"use client";
// app/crm/contactos/nuevo/page.tsx
// Módulo CRM — Crear Contacto · Autor: Jhon · APF1

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, Save, Loader2, AlertCircle,
} from "lucide-react";
import ContactoForm from "../_components/ContactoForm";
import type { ContactoFormData } from "../_components/ContactoForm";

export default function NuevoContactoPage() {
  const router  = useRouter();
  const [saving, setSaving]     = useState(false);
  const [error,  setError]      = useState<string | null>(null);

  const handleSubmit = async (datos: ContactoFormData) => {
    setSaving(true);
    setError(null);
    try {
      const res  = await fetch("/api/crm/contactos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      const json = await res.json();

      if (!json.success) throw new Error(json.error ?? "Error al guardar");
      router.push("/crm/contactos");
    } catch (e: any) {
      setError(e.message ?? "Error inesperado");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* ── Encabezado ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/crm/contactos")}
          className="flex items-center gap-1.5 text-[#9B9488] hover:text-[#14213D] text-sm transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Contactos
        </button>
        <span className="text-[#E8E4DC]">/</span>
        <span className="text-sm font-semibold text-[#14213D]">Nuevo contacto</span>
      </div>

      <div>
        <h1 className="text-2xl font-serif text-[#14213D]">Nuevo contacto</h1>
        <p className="text-sm text-[#9B9488] mt-0.5">
          Completa los datos del nuevo contacto del CRM
        </p>
      </div>

      {/* ── Error global ── */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Formulario ── */}
      <ContactoForm
        onSubmit={handleSubmit}
        loading={saving}
        submitLabel={
          saving ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Guardando…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="h-4 w-4" /> Crear contacto
            </span>
          )
        }
      />
    </div>
  );
}
