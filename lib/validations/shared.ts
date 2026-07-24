import { z } from "zod";

// 🔥 Esquemas reutilizables
export const emailSchema = z.string().email("El correo electrónico no es válido");
export const rucSchema = z.string().regex(/^\d{11}$/, "El RUC debe tener 11 dígitos");
export const phoneSchema = z.string().optional();
export const idSchema = z.string().uuid("ID inválido");

export const nombreSchema = z.string()
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .max(100, "El nombre no puede exceder los 100 caracteres")
  .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras y espacios");

export const mensajeSchema = z.string()
  .min(10, "El mensaje debe tener al menos 10 caracteres")
  .max(2000, "El mensaje no puede exceder los 2000 caracteres");

export const descripcionSchema = z.string()
  .min(3, "La descripción debe tener al menos 3 caracteres")
  .max(500, "La descripción no puede exceder los 500 caracteres");

export const montoSchema = z.number()
  .positive("El monto debe ser mayor a 0")
  .max(999999999.99, "El monto es demasiado grande");

export const cantidadSchema = z.number()
  .positive("La cantidad debe ser mayor a 0")
  .int("La cantidad debe ser un número entero");