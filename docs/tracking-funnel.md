# LUDIER — Tracking del embudo (Fase 5)

<!-- FIX TRACKING F5: contrato de eventos, atribución y límites de persistencia. -->

## Estado implementado

No se encontró un modelo ni una migración para la tabla `leads` en el repositorio.
Existe `Contacto` para CRM, pero no equivale a una tabla de leads web y no se modifica.
Esto no confirma la ausencia de una tabla creada manualmente en Supabase.
No se creó migración ni se consultó la base remota.

El endpoint mantiene la validación y el rate limit. Devuelve HTTP 200 con
`{ success: true, leadId }` solo cuando Resend acepta el correo comercial.
La aceptación del proveedor no confirma entrega, lectura ni venta.
Si falta persistencia, se escribe un `console.info("lead_received", ...)` con
referencia y procedencia; no incluye nombre, email, teléfono ni mensaje.
Los logs y el correo NO sustituyen una base de datos.

## Embudo: dos entradas alternativas

- WhatsApp: `whatsapp_click` (intención) → conversación recibida y registrada
  manualmente → lead cualificado → cotización → venta.
- Formulario: `form_submit` (intento válido) → HTTP 200 → `generate_lead`
  (correo comercial aceptado; aún sin fila persistente) → lead cualificado →
  cotización → venta.
- Error de formulario: `form_submit` → `form_error`; no `generate_lead`.

Un usuario no tiene que pasar por WhatsApp antes del formulario.
Un clic de WhatsApp no prueba que haya enviado el mensaje.

## Identificador y procedencia

El formulario genera un UUID v4 con `crypto.randomUUID()` al montarse.
La referencia se mantiene durante reintentos y cambia tras un envío exitoso.
Cerrar/recargar el formulario genera otra referencia.
Se incluye en el POST, la respuesta HTTP, el correo comercial y el acuse.
Los clientes antiguos sin tracking reciben una referencia generada en servidor.
No hay idempotencia persistente: un reintento tras una respuesta perdida puede
reenviar un correo con la misma referencia. Deduplicar por `leadId` al registrar.

Payload del endpoint:

```json
{
  "leadId": "f8bb8010-6028-4f56-b59c-25777466e52c",
  "source": {
    "landingPath": "/blog/portones-metalicos-tipos-precios-guia",
    "currentPath": "/contacto",
    "ctaSource": "blog-portones-inline"
  }
}
```

El botón global captura la primera ruta pública al montarse, aunque el usuario no
lo pulse. El formulario también inicializa esa captura si se entra directamente.
`sessionStorage.ludier_landing` conserva la primera ruta de la pestaña; no equivale
exactamente a una sesión GA4 y no expira automáticamente por inactividad.
Con almacenamiento bloqueado se conserva en memoria hasta recargar.
No se envían query strings a GA4.

`ctaSource` viene únicamente de `?from=...`, limitado a 100 caracteres de etiqueta.
Ejemplo de enlace futuro:
`/contacto?servicio=puertas-portones&from=blog-portones-inline`.
Esta fase no modifica los enlaces existentes del blog: si no traen `from`,
`ctaSource` queda vacío; la landing se conserva.

## Eventos GA4

Todos se envían mediante `trackEvent(name, params)`. Se mantienen las llamadas
planas existentes. La firma también admite objetos anidados: se aplanan con
guiones bajos (por ejemplo, `source.landingPath` → `source_landingPath`),
hasta cinco niveles. GA4 no convierte objetos arbitrarios en dimensiones.
Los eventos de esta fase usan los parámetros planos de la tabla siguiente;
el objeto `source` del POST no se manda como objeto a GA4.

| Evento | Momento | Parámetros |
| --- | --- | --- |
| `form_submit` | Antes del fetch, tras validación local | `leadId`, `source` (landingPath), `currentPath`, `ctaSource`, `form_name` |
| `generate_lead` | Respuesta 200, success true y referencia coincidente | `leadId`, `source`, `currentPath`, `ctaSource`, `value: 0`, `currency: PEN` |
| `form_error` | Red, respuesta inválida o error HTTP | `leadId`, `errorType` |
| `whatsapp_click` | Clic; no conversación confirmada | Se conservan parámetros actuales; flotante añade `location: floating` |

`errorType` puede ser `network`, `invalid_response`, `http_400`, `http_429`,
`http_502`, `http_500`, etc. No se mandan mensajes de error con datos personales.
La cola en memoria espera gtag aproximadamente 30 segundos, hasta 100 eventos.
No garantiza entrega si GA está bloqueado o el usuario cierra la página.
No se altera el consentimiento ni se fuerza debug_mode en producción.

### Comprobación y reporting

1. Conectar Tag Assistant o activar DebugView mediante la configuración de pruebas.
2. Comprobar un `form_submit` por intento; una respuesta 200 debe añadir un
   `generate_lead` con la misma referencia.
3. Registrar dimensiones personalizadas de evento para `ctaSource`, `source`,
   `currentPath` y `errorType` si se necesitan en informes.
4. No registrar `leadId` como dimensión de reporting habitual: tiene cardinalidad
   alta. Usarlo en DebugView y en exportación BigQuery para correlación.
5. Si está habilitada la medición mejorada de formularios, revisar si también envía
   `form_submit` automáticamente. Filtrar por `leadId` o ajustar esa configuración
   para no contar dos envíos. Esta fase no cambia la cuenta GA4.

`value: 0` no es ingreso. No sumar valores de presupuestos como ventas.
Se deben medir consultas cualificadas, presupuestos, ventas y margen en el CRM.

## Referencias WhatsApp

El flotante añade `[ref:floating]`. `WhatsAppLink` añade
`[ref:<location>]`, por ejemplo `[ref:blog-portones-inline]`.
Se conserva el mensaje y el resto de parámetros de la URL.
Solo se transforman dominios oficiales de enlaces web WhatsApp.
No se duplica una referencia previa al final del mensaje.

Regex de lectura manual o futura integración:
`\[ref:([a-zA-Z0-9_.:-]{1,100})\]`.
La etiqueta identifica el CTA; NO es un UUID de lead. Cuando se recibe una
conversación hay que crear su registro comercial y guardar esa procedencia.
Si el usuario edita el texto, la referencia puede perderse.
Enlaces WhatsApp escritos directamente como HTML fuera de estos dos componentes
no cambian en esta fase.

## Supabase: integración pendiente

Diseño pendiente de aprobar: `leads` con `lead_id` UUID único, `created_at`,
`source` JSONB, `channel`, `status`, identificador de contacto/CRM y referencias
a cotización y venta. La inserción debe hacerse desde el servidor con permisos
adecuados; no desde el cliente con acceso de escritura indiscriminado.

Consulta ILUSTRATIVA: solo funcionará cuando exista la tabla con estas columnas.
No ejecutar como migración:

```sql
select
  source->>'landingPath' as landing_path,
  source->>'ctaSource' as cta_source,
  count(*) as leads,
  count(*) filter (where status = 'qualified') as qualified_leads,
  count(*) filter (where status = 'won') as won_leads
from public.leads
where created_at >= now() - interval '30 days'
group by 1, 2;
```

Si se usan estados excluyentes, los leads ganados ya no están en `qualified`:
para tasas históricas de avance harán falta eventos o fechas por etapa.

## Lo que falta para ROI completo

- Tabla persistente con UUID único, control de acceso e idempotencia.
- Registro de conversaciones WhatsApp y referencia recibida.
- Vincular lead → contacto → cotización → venta sin perder procedencia.
- Historial de cualificación, importes aceptados, facturación y margen.
- Webhooks de Resend para distinguir aceptación, entrega y rebote.
- Measurement Protocol para etapas offline, con identificadores de atribución
  válidos y consentimiento aplicable. No enviar PII a GA4.
- Costes de contenido/captación y criterio de atribución para calcular ROI.

## QA local y DebugView

1. Vaciar `ludier_landing` de la pestaña, abrir un blog y navegar al formulario
   con `?from=blog-portones-inline`. Comprobar landing, ruta y CTA en el POST.
2. Enviar datos de prueba y comparar el UUID en POST, respuesta y correo comercial.
3. Comprobar `form_submit` antes de resolver la solicitud.
4. En una respuesta 200, verificar `generate_lead`, mismo UUID y value 0.
5. Simular rechazo de Resend con un mock local; no modificar el remitente de
   producción ni enviar correos reales para forzar errores.
6. Verificar `form_error: http_502` y ausencia de `generate_lead`. Probar también
   error de red, 400 y 429.
7. Abrir ambos tipos de enlace WhatsApp y revisar referencia y mensaje intacto.

Las pruebas automatizadas con proveedor simulado no demuestran recepción real
de correo, eventos en la propiedad GA4 ni conversaciones.
