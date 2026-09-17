/**
 * GIST 2 — Jhon (APF1) · CRM LUDIER
 * Título: ContactoForm — Formulario reutilizable (react-hook-form + Zod)
 * URL sugerida: https://gist.github.com/
 *
 * Uso:
 *   import ContactoForm from "@/app/crm/contactos/_components/ContactoForm";
 *
 *   // Crear:
 *   <ContactoForm onSubmit={handleCreate} submitLabel="Crear contacto" />
 *
 *   // Editar (pasa defaultValues):
 *   <ContactoForm defaultValues={contacto} onSubmit={handleUpdate} submitLabel="Guardar cambios" />
 */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ── Schema Zod inline (extracto del módulo) ──────────────────
const ESTADO_CONTACTO = ["ACTIVO", "INACTIVO", "PROSPECTO"] as const;

const contactoSchema = z.object({
  nombre:       z.string().min(2).max(100),
  apellido:     z.string().min(2).max(100),
  cargo:        z.string().max(100).optional().nullable(),
  empresa:      z.string().max(150).optional().nullable(),
  email:        z.string().email().optional().nullable().or(z.literal("")),
  telefono:     z.string().optional().nullable(),
  telefono_alt: z.string().optional().nullable(),
  direccion:    z.string().max(200).optional().nullable(),
  estado:       z.enum(ESTADO_CONTACTO).default("ACTIVO"),
  notas:        z.string().max(1000).optional().nullable(),
});

type ContactoFormData = z.infer<typeof contactoSchema>;

// ── Clase base de inputs (paleta CRM LUDIER) ─────────────────
const INPUT =
  "w-full px-3 py-2 text-sm border border-[#E8E4DC] rounded-xl bg-[#FAF8F4] " +
  "text-[#14213D] placeholder:text-[#C4BFB7] focus:outline-none " +
  "focus:ring-2 focus:ring-[#C8A46B]/50 focus:border-[#C8A46B] disabled:opacity-50";

// ── Componente Field con label + mensaje de error ────────────
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
        {label}{required && <span className="text-[#C8A46B] ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

// ── Formulario principal ──────────────────────────────────────
export default function ContactoForm({
  defaultValues,
  onSubmit,
  loading = false,
  submitLabel = "Guardar",
}: {
  defaultValues?: Partial<ContactoFormData>;
  onSubmit: (datos: ContactoFormData) => void;
  loading?: boolean;
  submitLabel?: React.ReactNode;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<ContactoFormData>({
    resolver: zodResolver(contactoSchema),
    defaultValues: { estado: "ACTIVO", ...defaultValues },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-2xl border border-[#F0EDE7] shadow-sm p-6 space-y-6"
      noValidate
    >
      {/* Datos personales */}
      <section>
        <h2 className="text-xs font-bold text-[#9B9488] uppercase tracking-widest mb-4">
          Datos personales
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nombre"   required error={errors.nombre?.message}>
            <input {...register("nombre")}   type="text" placeholder="Juan"   className={INPUT} disabled={loading} autoFocus />
          </Field>
          <Field label="Apellido" required error={errors.apellido?.message}>
            <input {...register("apellido")} type="text" placeholder="García" className={INPUT} disabled={loading} />
          </Field>
          <Field label="Cargo" error={errors.cargo?.message}>
            <input {...register("cargo")} type="text" placeholder="Gerente de proyectos" className={INPUT} disabled={loading} />
          </Field>
          <Field label="Estado" required error={errors.estado?.message}>
            <select {...register("estado")} className={INPUT} disabled={loading}>
              <option value="ACTIVO">Activo</option>
              <option value="PROSPECTO">Prospecto</option>
              <option value="INACTIVO">Inactivo</option>
            </select>
          </Field>
        </div>
      </section>

      {/* Empresa */}
      <section>
        <h2 className="text-xs font-bold text-[#9B9488] uppercase tracking-widest mb-4">Empresa</h2>
        <Field label="Nombre de empresa" error={errors.empresa?.message}>
          <input {...register("empresa")} type="text" placeholder="Constructora ACME S.A.C." className={INPUT} disabled={loading} />
        </Field>
      </section>

      {/* Contacto */}
      <section>
        <h2 className="text-xs font-bold text-[#9B9488] uppercase tracking-widest mb-4">Datos de contacto</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email"    error={errors.email?.message}>
            <input {...register("email")}        type="email" placeholder="juan@empresa.com"    className={INPUT} disabled={loading} />
          </Field>
          <Field label="Teléfono" error={errors.telefono?.message}>
            <input {...register("telefono")}     type="tel"   placeholder="+51 999 999 999"     className={INPUT} disabled={loading} />
          </Field>
          <Field label="Teléfono alt." error={errors.telefono_alt?.message}>
            <input {...register("telefono_alt")} type="tel"   placeholder="+51 999 999 999"     className={INPUT} disabled={loading} />
          </Field>
          <Field label="Dirección" error={errors.direccion?.message}>
            <input {...register("direccion")}    type="text"  placeholder="Av. Principal 123"   className={INPUT} disabled={loading} />
          </Field>
        </div>
      </section>

      {/* Notas */}
      <section>
        <h2 className="text-xs font-bold text-[#9B9488] uppercase tracking-widest mb-4">Notas</h2>
        <Field label="Notas adicionales" error={errors.notas?.message}>
          <textarea {...register("notas")} rows={3} placeholder="Observaciones…" className={INPUT + " resize-none"} disabled={loading} />
        </Field>
      </section>

      {/* Submit */}
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
