import { z } from "zod";
import { emailSchema } from "./shared";

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginInput = z.infer<typeof loginSchema>;