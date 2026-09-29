// lib/validations/contacto.ts
// Schema del formulario web de contacto (landing page)
import { z } from "zod";
import { emailSchema, nombreSchema, mensajeSchema, phoneSchema } from "./shared";

export const contactoSchema = z.object({
  nombre: nombreSchema,
  email: emailSchema,
  telefono: phoneSchema,
  asunto: z
    .string()
    .min(3, "El asunto debe tener al menos 3 caracteres")
    .max(100, "El asunto no puede exceder los 100 caracteres"),
  mensaje: mensajeSchema,
});

export type ContactoWebInput = z.infer<typeof contactoSchema>;