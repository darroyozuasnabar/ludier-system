// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// 🔥 Crear cliente de Redis (usa variables de entorno)
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 🔥 Rate limiter por IP
export const rateLimit = new Ratelimit({
  redis,
  // 📌 10 solicitudes cada 10 segundos (ajusta según necesidad)
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true, // Para ver métricas en el dashboard de Upstash
  prefix: "@upstash/ratelimit",
});

// 🔥 Rate limiter más estricto para login (5 intentos en 5 minutos)
export const loginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "5 m"),
  analytics: true,
  prefix: "@upstash/ratelimit/login",
});

// 🔥 Rate limiter para contacto (3 mensajes por hora)
export const contactRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  analytics: true,
  prefix: "@upstash/ratelimit/contact",
});