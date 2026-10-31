// lib/validations/contacto.ts
// Schema del formulario web de contacto (landing page)
import { z } from "zod";
import { emailSchema, nombreSchema, mensajeSchema, phoneSchema } from "./shared";

export const contactoSchema = z.object({
  // FIX TRACKING F5: aceptar clientes anteriores y validar UUID v4 y procedencia.
  leadId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i, "Referencia inválida")
    .default(() => crypto.randomUUID()),
  source: z.object({
    landingPath: z.string().max(500).regex(/^\/(?!\/)[^<>"\r\n]*$/),
    currentPath: z.string().max(500).regex(/^\/(?!\/)[^<>"\r\n]*$/),
    ctaSource: z.string().max(100).regex(/^[a-zA-Z0-9_.:-]*$/),
  }).default({ landingPath: "/contacto", currentPath: "/contacto", ctaSource: "" }),
  nombre: nombreSchema,
  email: emailSchema,
  telefono: phoneSchema,
  // FIX TRACKING F5: aceptar empresa opcional para persistirla en Lead sin cambiar el formulario.
  empresa: z.string().trim().max(150, "La empresa no puede exceder los 150 caracteres").optional(),
  asunto: z
    .string()
    .min(3, "El asunto debe tener al menos 3 caracteres")
    .max(100, "El asunto no puede exceder los 100 caracteres"),
  mensaje: mensajeSchema,
});

export type ContactoWebInput = z.infer<typeof contactoSchema>;
