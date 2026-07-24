import { z } from "zod";
import { emailSchema, rucSchema, phoneSchema, montoSchema, cantidadSchema, descripcionSchema } from "./shared";

export const cotizacionItemSchema = z.object({
  descripcion: descripcionSchema,
  cantidad: cantidadSchema,
  unidad: z.enum(["ML", "UND", "M2", "KG", "GLB", "HR", "LOT"], {
    errorMap: () => ({ message: "Unidad de medida inválida" })
  }),
  precio_unitario: montoSchema,
  descuento: z.number()
    .min(0, "El descuento no puede ser negativo")
    .max(999999.99, "El descuento es demasiado grande")
    .optional(),
  total: montoSchema.optional(),
});

export const cotizacionSchema = z.object({
  project_id: z.string().uuid("ID de proyecto inválido").optional().nullable(),
  cliente: z.string()
    .min(3, "El cliente debe tener al menos 3 caracteres")
    .max(150, "El cliente no puede exceder los 150 caracteres"),
  cliente_ruc: rucSchema.optional().nullable(),
  cliente_contacto: z.string()
    .min(2, "El contacto debe tener al menos 2 caracteres")
    .max(100, "El contacto no puede exceder los 100 caracteres")
    .optional()
    .nullable(),
  cliente_telefono: phoneSchema.optional().nullable(),
  cliente_email: emailSchema.optional().nullable(),
  cliente_direccion: z.string()
    .max(200, "La dirección no puede exceder los 200 caracteres")
    .optional()
    .nullable(),
  fecha_emision: z.string().date("Fecha de emisión inválida"),
  fecha_validez: z.string().date("Fecha de validez inválida"),
  condiciones: z.string()
    .max(500, "Las condiciones no pueden exceder los 500 caracteres")
    .optional()
    .nullable(),
  notas: z.string()
    .max(500, "Las notas no pueden exceder los 500 caracteres")
    .optional()
    .nullable(),
  moneda: z.enum(["PEN", "USD"]).default("PEN"),
  tipo_cambio: z.number()
    .positive("El tipo de cambio debe ser mayor a 0")
    .optional()
    .default(1),
  items: z.array(cotizacionItemSchema).min(1, "Debe haber al menos un item"),
});

export type CotizacionInput = z.infer<typeof cotizacionSchema>;
export type CotizacionItemInput = z.infer<typeof cotizacionItemSchema>;