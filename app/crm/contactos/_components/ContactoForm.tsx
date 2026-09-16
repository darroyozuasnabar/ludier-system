"use client";
// app/crm/contactos/_components/ContactoForm.tsx
// Formulario reutilizable para crear y editar contactos · Autor: Jhon · APF1

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactoSchema } from "@/lib/validations/contactos";
import type { ContactoInput } from "@/lib/validations/contactos";
import React from "react";

// El formulario expone este tipo como interfaz pública
export type ContactoFormData = ContactoInput;

interface ContactoFormProps {
  /** Valores iniciales (para modo edición) */
  defaultValues?: Partial<ContactoFormData>;
  onSubmit: (datos: ContactoFormData) => void;
  loading?: boolean;
  submitLabel?: React.ReactNode;
}

// ──────────────────────────────────────────────
// Componente de campo con label + error
// ──────────────────────────────────────────────
function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-[#5B5750] uppercase tracking-wide">
        {label}
        {required && <span className="text-[#C8A46B] ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-[11px] text-red-500">{error}</p>
      )}
    </div>
  );
}

// Clase base para todos los inputs
const INPUT_CLS =
  "w-full px-3 py-2 text-sm border border-[#E8E4DC] rounded-xl bg-[#FAF8F4] text-[#14213D] " +
  "placeholder:text-[#C4BFB7] focus:outline-none focus:ring-2 focus:ring-[#C8A46B]/50 focus:border-[#C8A46B] " +
  "disabled:opacity-50 transition-colors";

// ──────────────────────────────────────────────
// Formulario principal
// ──────────────────────────────────────────────
export default function ContactoForm({
  defaultValues,
  onSubmit,
  loading = false,
  submitLabel = "Guardar",
}: ContactoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactoFormData>({
    resolver: zodResolver(contactoSchema),
    defaultValues: {
      estado: "ACTIVO",
      ...defaultValues,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-2xl border border-[#F0EDE7] shadow-sm p-6 space-y-6"
      noValidate
    >
      {/* ── Sección: Datos personales ── */}
      <div>
        <h2 className="text-xs font-bold text-[#9B9488] uppercase tracking-widest mb-4">
          Datos personales
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nombre" required error={errors.nombre?.message}>
            <input
              {...register("nombre")}
              type="text"
              placeholder="Ej. Juan"
              className={INPUT_CLS}
              disabled={loading}
              autoFocus
            />
          </Field>

          <Field label="Apellido" required error={errors.apellido?.message}>
            <input
              {...register("apellido")}
              type="text"
              placeholder="Ej. García"
              className={INPUT_CLS}
              disabled={loading}
            />
          </Field>

          <Field label="Cargo" error={errors.cargo?.message}>
            <input
              {...register("cargo")}
              type="text"
              placeholder="Ej. Gerente de proyectos"
              className={INPUT_CLS}
              disabled={loading}
            />
          </Field>

          <Field label="Estado" required error={errors.estado?.message}>
            <select {...register("estado")} className={INPUT_CLS} disabled={loading}>
              <option value="ACTIVO">Activo</option>
              <option value="PROSPECTO">Prospecto</option>
              <option value="INACTIVO">Inactivo</option>
            </select>
          </Field>
        </div>
      </div>

      {/* ── Sección: Empresa ── */}
      <div>
        <h2 className="text-xs font-bold text-[#9B9488] uppercase tracking-widest mb-4">
          Empresa
        </h2>
        <Field label="Nombre de empresa" error={errors.empresa?.message}>
          <input
            {...register("empresa")}
            type="text"
            placeholder="Ej. Constructora ACME S.A.C."
            className={INPUT_CLS}
            disabled={loading}
          />
        </Field>
      </div>

      {/* ── Sección: Datos de contacto ── */}
      <div>
        <h2 className="text-xs font-bold text-[#9B9488] uppercase tracking-widest mb-4">
          Datos de contacto
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Correo electrónico" error={errors.email?.message}>
            <input
              {...register("email")}
              type="email"
              placeholder="juan@empresa.com"
              className={INPUT_CLS}
              disabled={loading}
            />
          </Field>

          <Field label="Teléfono principal" error={errors.telefono?.message}>
            <input
              {...register("telefono")}
              type="tel"
              placeholder="+51 999 999 999"
              className={INPUT_CLS}
              disabled={loading}
            />
          </Field>

          <Field label="Teléfono alternativo" error={errors.telefono_alt?.message}>
            <input
              {...register("telefono_alt")}
              type="tel"
              placeholder="+51 999 999 999"
              className={INPUT_CLS}
              disabled={loading}
            />
          </Field>

          <Field label="Dirección" error={errors.direccion?.message}>
            <input
              {...register("direccion")}
              type="text"
              placeholder="Av. Principal 123, Lima"
              className={INPUT_CLS}
              disabled={loading}
            />
          </Field>
        </div>
      </div>

      {/* ── Sección: Notas ── */}
      <div>
        <h2 className="text-xs font-bold text-[#9B9488] uppercase tracking-widest mb-4">
          Notas adicionales
        </h2>
        <Field label="Notas" error={errors.notas?.message}>
          <textarea
            {...register("notas")}
            rows={3}
            placeholder="Observaciones, preferencias o contexto del contacto…"
            className={INPUT_CLS + " resize-none"}
            disabled={loading}
          />
        </Field>
      </div>

      {/* ── Botón de envío ── */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#14213D] text-white text-sm font-semibold rounded-xl hover:bg-[#1e2e52] transition-colors disabled:opacity-50"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
