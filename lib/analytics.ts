// lib/analytics.ts
//
// Helper para enviar eventos a Google Analytics 4
// Uso: trackEvent("form_submit", { form_name: "contacto" })

export function trackEvent(
  eventName: string,
  eventParams?: Record<string, string | number | boolean>,
) {
  if (typeof window === "undefined") return;

  // gtag se inyecta globalmente por @next/third-parties
  const w = window as any;
  if (typeof w.gtag !== "function") return;

  w.gtag("event", eventName, eventParams || {});
}