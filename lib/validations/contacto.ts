import { z } from "zod";
import { emailSchema, nombreSchema, mensajeSchema, phoneSchema } from "./shared";

export const contactoSchema = z.object({
  nombre: nombreSchema,
  email: emailSchema,
  telefono: phoneSchema,
  asunto: z.string()
    .min(3, "El asunto debe tener al menos 3 caracteres")
    .max(100, "El asunto no puede exceder los 100 caracteres"),
  mensaje: mensajeSchema,
});

export type ContactoInput = z.infer<typeof contactoSchema>;