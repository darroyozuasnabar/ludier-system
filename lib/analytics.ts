// lib/analytics.ts
//
// Helper para enviar eventos a Google Analytics 4
// Uso: trackEvent("form_submit", { form_name: "contacto" })

// FIX TRACKING F5: cola breve para que la carga diferida de GA no descarte el envío.
type FlatParams = Record<string, string | number | boolean>;
type EventValue = string | number | boolean | { [key: string]: EventValue };
type EventParams = Record<string, EventValue>;
// FIX TRACKING F5: aceptar objetos anidados y aplanarlos para parámetros GA4 compatibles.
function flattenParams(params: EventParams, prefix = "", depth = 0): FlatParams {
  const flat: FlatParams = {};
  for (const [key, value] of Object.entries(params)) {
    const name = prefix ? `${prefix}_${key}` : key;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      flat[name] = value;
    } else if (value && depth < 5) {
      Object.assign(flat, flattenParams(value, name, depth + 1));
    }
  }
  return flat;
}
const pendingEvents: { name: string; params: FlatParams }[] = [];
let analyticsTimer: ReturnType<typeof setTimeout> | undefined;
let retries = 0;

function flushEvents() {
  analyticsTimer = undefined;
  const w = window as any;
  if (typeof w.gtag === "function") {
    retries = 0;
    while (pendingEvents.length) {
      const event = pendingEvents.shift()!;
      try { w.gtag("event", event.name, event.params); } catch { /* Analytics no bloquea leads. */ }
    }
  } else if (pendingEvents.length && retries++ < 120) {
    analyticsTimer = setTimeout(flushEvents, 250);
  } else {
    pendingEvents.length = 0;
    retries = 0;
  }
}

export function trackEvent(
  eventName: string,
  eventParams?: EventParams,
) {
  if (typeof window === "undefined") return;

  if (pendingEvents.length >= 100) pendingEvents.shift();
  pendingEvents.push({ name: eventName, params: flattenParams(eventParams || {}) });
  if (analyticsTimer) clearTimeout(analyticsTimer);
  flushEvents();
}

// FIX TRACKING F5: primera ruta de la sesión de pestaña; tolerar almacenamiento bloqueado.
let landingFallback: string | undefined;
export function getLandingPath(): string {
  if (typeof window === "undefined") return "";
  landingFallback ??= window.location.pathname;
  try {
    const stored = window.sessionStorage.getItem("ludier_landing");
    if (stored?.startsWith("/") && !stored.startsWith("//")) return stored;
    window.sessionStorage.setItem("ludier_landing", landingFallback);
  } catch { /* Mantener atribución en memoria si sessionStorage no está disponible. */ }
  return landingFallback;
}

// FIX TRACKING F5: conservar parámetros del enlace y añadir una sola referencia al mensaje.
export function withWhatsAppReference(href: string, location: string): string {
  try {
    const url = new URL(href);
    if (!["https:", "http:"].includes(url.protocol) ||
        !["wa.me", "api.whatsapp.com", "web.whatsapp.com"].includes(url.hostname)) return href;
    const ref = location.replace(/[^a-zA-Z0-9_.:-]/g, "-").slice(0, 100);
    const text = (url.searchParams.get("text") || "").replace(/\s*\[ref:[^\]]*\]\s*$/, "");
    url.searchParams.set("text", `${text}\n\n[ref:${ref}]`);
    return url.toString();
  } catch { return href; }
}
