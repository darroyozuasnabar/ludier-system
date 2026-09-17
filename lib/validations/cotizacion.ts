import { z } from "zod";
import { emailSchema, rucSchema, phoneSchema, montoSchema, descripcionSchema } from "./shared";

export const ESTADOS_COTIZACION = [
  "BORRADOR",
  "ENVIADA",
  "VISTA",
  "APROBADA",
  "RECHAZADA",
  "EXPIRADA",
  "CONVERTIDA_A_OBRA",
] as const;

export const MONEDAS_COTIZACION = ["PEN", "USD"] as const;

export const UNIDADES_COTIZACION = [
  "ML",
  "UND",
  "M2",
  "KG",
  "GLB",
  "HR",
  "LOT",
] as const;

export const cotizacionItemSchema = z.object({
  id: z.string().optional(),
  descripcion: descripcionSchema,
  cantidad: z.number().positive("La cantidad debe ser mayor a 0"),
  unidad: z.string().min(1, "La unidad es obligatoria"),
  precio_unitario: montoSchema,
  descuento: z
    .number()
    .min(0, "El descuento no puede ser negativo")
    .max(999999.99, "El descuento es demasiado grande")
    .optional()
    .default(0),
  total: z.number().nonnegative().optional(),
  orden: z.number().int().optional().default(0),
});

export const cotizacionSchema = z.object({
  project_id: z.string().optional().nullable(),
  cliente_id: z.string().optional().nullable(),
  contacto_id: z.string().optional().nullable(),
  cliente: z
    .string({ required_error: "El nombre del cliente es obligatorio" })
    .min(3, "El cliente debe tener al menos 3 caracteres")
    .max(150, "El cliente no puede exceder los 150 caracteres"),
  cliente_ruc: rucSchema.optional().nullable().or(z.literal("")),
  cliente_contacto: z
    .string()
    .min(2, "El contacto debe tener al menos 2 caracteres")
    .max(100, "El contacto no puede exceder los 100 caracteres")
    .optional()
    .nullable()
    .or(z.literal("")),
  cliente_telefono: phoneSchema.optional().nullable().or(z.literal("")),
  cliente_email: emailSchema.optional().nullable().or(z.literal("")),
  cliente_direccion: z
    .string()
    .max(200, "La dirección no puede exceder los 200 caracteres")
    .optional()
    .nullable()
    .or(z.literal("")),
  fecha_emision: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Fecha de emisión inválida",
  }),
  fecha_validez: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Fecha de validez inválida",
    })
    .optional()
    .nullable(),
  estado: z.enum(ESTADOS_COTIZACION).default("BORRADOR"),
  moneda: z.enum(MONEDAS_COTIZACION).default("PEN"),
  tipo_cambio: z
    .number()
    .positive("El tipo de cambio debe ser mayor a 0")
    .optional()
    .default(1),
  condiciones: z
    .string()
    .max(1000, "Las condiciones no pueden exceder los 1000 caracteres")
    .optional()
    .nullable(),
  notas: z
    .string()
    .max(1000, "Las notas no pueden exceder los 1000 caracteres")
    .optional()
    .nullable(),
  items: z.array(cotizacionItemSchema).min(1, "Debe haber al menos un item"),
  subtotal: z.number().nonnegative().optional(),
  igv: z.number().nonnegative().optional(),
  total: z.number().nonnegative().optional(),
});

export const cotizacionUpdateSchema = cotizacionSchema.partial().extend({
  id: z.string().optional(),
});

export const cotizacionSeguimientoSchema = z.object({
  cotizacion_id: z.string().min(1, "ID de cotización obligatorio"),
  tipo: z.enum(["LLAMADA", "EMAIL", "REUNION", "WHATSAPP", "VISITA", "NOTA"], {
    errorMap: () => ({ message: "Tipo de seguimiento no válido" }),
  }),
  descripcion: z.string().min(3, "La descripción debe tener al menos 3 caracteres"),
  proximo_contacto: z.string().optional().nullable(),
});

export type CotizacionInput = z.infer<typeof cotizacionSchema>;
export type CotizacionUpdateInput = z.infer<typeof cotizacionUpdateSchema>;
export type CotizacionItemInput = z.infer<typeof cotizacionItemSchema>;
export type CotizacionSeguimientoInput = z.infer<typeof cotizacionSeguimientoSchema>;

// Función utilitaria para cálculo de totales
export function calcularTotales(items: { cantidad: number; precio_unitario: number; descuento?: number }[], tasaIgv = 0.18) {
  const subtotal = items.reduce((acc, item) => {
    const desc = item.descuento || 0;
    const itemTotal = item.cantidad * item.precio_unitario - desc;
    return acc + Math.max(0, itemTotal);
  }, 0);

  const igv = Math.round(subtotal * tasaIgv * 100) / 100;
  const total = Math.round((subtotal + igv) * 100) / 100;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    igv,
    total,
  };
}