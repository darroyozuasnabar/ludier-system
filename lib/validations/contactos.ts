import { z } from "zod";
import { emailSchema, phoneSchema } from "./shared";

// ============================================================
// Esquemas de validación — Módulo CRM Contactos
// Autor: Jhon · APF1
// ============================================================

/** Estados permitidos para un contacto CRM */
export const ESTADO_CONTACTO = ["ACTIVO", "INACTIVO", "PROSPECTO"] as const;
export type EstadoContacto = (typeof ESTADO_CONTACTO)[number];

/** Schema para crear o actualizar un contacto */
export const contactoSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),

  apellido: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(100, "El apellido no puede exceder 100 caracteres"),

  cargo: z
    .string()
    .max(100, "El cargo no puede exceder 100 caracteres")
    .optional()
    .nullable(),

  empresa: z
    .string()
    .max(150, "El nombre de empresa no puede exceder 150 caracteres")
    .optional()
    .nullable(),

  email: emailSchema.optional().nullable().or(z.literal("")),

  telefono: phoneSchema.optional().nullable(),

  telefono_alt: phoneSchema.optional().nullable(),

  direccion: z
    .string()
    .max(200, "La dirección no puede exceder 200 caracteres")
    .optional()
    .nullable(),

  estado: z.enum(ESTADO_CONTACTO).default("ACTIVO"),

  notas: z
    .string()
    .max(1000, "Las notas no pueden exceder 1000 caracteres")
    .optional()
    .nullable(),
});

/** Schema para filtros de listado */
export const contactoFiltrosSchema = z.object({
  q:       z.string().optional(),
  empresa: z.string().optional(),
  estado:  z.enum([...ESTADO_CONTACTO, "ALL"]).optional().default("ALL"),
  limit:   z.coerce.number().int().min(1).max(200).optional().default(50),
  offset:  z.coerce.number().int().min(0).optional().default(0),
});

export type ContactoInput    = z.infer<typeof contactoSchema>;
export type ContactoFiltros  = z.infer<typeof contactoFiltrosSchema>;
