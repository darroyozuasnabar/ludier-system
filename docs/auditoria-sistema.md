# Auditoría técnica y funcional de LUDIER

**Fecha:** 21 de noviembre de 2026, America/Lima.  
**Modalidad:** diagnóstico y plan; sin correcciones de aplicación.  
**Única escritura de documentación:** este archivo, solicitado como entregable.

## Resumen

El proyecto compila y las páginas públicas responden, pero esto no acredita que sus operaciones con datos funcionen. Los principales bloqueos son la conexión a la BD configurada localmente, la autorización incompleta de API, las rutas antiguas usadas por formularios del ERP y los canonical heredados de Home.

| Fase | Estado | Problemas principales | Prioridad |
|------|--------|-----------------------|-----------|
| Landing | 🔴 Bugs críticos comerciales y advertencias | Persisten afirmaciones sobre ISO en Nosotros; imágenes de testimonios inexistentes; algunos WhatsApp no emiten el evento propio. | Alta / Media |
| ERP | 🔴 Bugs críticos | BD inaccesible con la configuración auditada; API antiguas que devuelven 404; endpoint de versiones con código de facturación; operaciones sin control de errores/atomicidad. | Alta |
| Portal Cliente | 🔴 Bugs críticos y alcance pendiente | Un CLIENTE puede acceder a cotizaciones ajenas mediante la API del CRM; limitación a un proyecto; cotizaciones y documentos no implementados como módulos del portal. | Alta / Media |
| Autenticación | 🔴 Bugs críticos | 31 handlers del ERP sin validación propia de sesión; 6 de cotizaciones CRM sin rol/propietario; usuarios inactivos aceptados; política de rutas inconsistente y bucle de denegación. | Alta |
| SEO | 🔴 Bugs relevantes para captación | Seis páginas apuntan canonical a Home; tres landings B2B faltan en sitemap; títulos con marca repetida; imagen OG de Blog inexistente. | Alta / Media / Baja |

Los problemas compartidos se referencian entre fases; no deben contarse dos veces.

## Método, evidencia y límites

### Comprobaciones ejecutadas

| Comprobación | Resultado |
|--------------|-----------|
| Inventario del código | 51 archivos `page.tsx`, 27 archivos de API. El ERP está en `app/erp` y el CRM en `app/crm`; no existe el grupo `app/(dashboard)` descrito en el contexto. |
| `npx.cmd tsc --noEmit --incremental false` | ✅ Sin errores. |
| `npm.cmd run build` | ✅ Prisma Client generado, compilación y comprobación TypeScript completas; 84 entradas prerenderizadas. El primer intento falló al descargar Inter; al repetir con acceso de red terminó correctamente. |
| `npm.cmd run lint` | 🔴 Falla: ejecuta `next lint` y Next 16 interpreta `lint` como directorio inexistente. |
| `npm.cmd test -- --runInBand --no-cache` | 🔴 Una suite pasa y otra falla. Jest registra 36 tests aprobados, pero rechaza la suite de cotizaciones por usar `node:test`. Los 8 tests que imprime ese runner no equivalen a una suite aprobada por Jest. |
| HTTP local de producción, `127.0.0.1:3107` | ✅ 40/40 páginas públicas generadas responden 200. Se verificaron título, canonical, OG, enlaces y JSON-LD del HTML recibido. |
| Grafo de enlaces públicos | ✅ Las 40 páginas son alcanzables desde Home mediante los enlaces HTML encontrados; no se detectaron páginas públicas huérfanas en ese inventario. |
| Rutas inexistentes de servicios, proyectos y blog | ✅ Las tres pruebas devuelven 404. |
| Redirecciones antiguas | ✅ `/public/servicios`, `/public/proyectos` y `/public/faq` devuelven 301 al destino correcto. |
| Páginas protegidas sin sesión | ✅ Las muestras ERP, CRM y portal redirigen 303 a `/login`, con `tipo=cliente` cuando corresponde. |
| Matriz de roles | Se probaron solicitudes HTML locales con tokens temporales sintéticos de FUNDADOR, ADMIN, FIELD_ENGINEER y CLIENTE. No se cambiaron usuarios ni se ejecutaron sus formularios. |
| Aislamiento CRM | 🔴 Una prueba aislada del handler real, con Prisma simulado y rol CLIENTE, devuelve 200 y una cotización simulada ajena; la consulta no tiene filtro de propietario. |
| Usuario inactivo | 🔴 Una prueba aislada de `authorize`, simulando contraseña válida y `User.active=false`, devuelve el usuario ADMIN. |
| Tracking del formulario | ✅ El componente real, renderizado con HTTP y GA4 simulados, emite `form_submit` antes del fetch y `generate_lead` después de `success: true`, con el mismo `leadId`. No se incluyen email ni teléfono en esos eventos. |
| Tracking de WhatsAppLink | ✅ El componente real emite `whatsapp_click` en la prueba aislada. |
| Conexión Prisma | 🔴 La consulta de solo lectura al catálogo PostgreSQL falla con `tenant/user ... not found`. Se omiten identificadores y credenciales del error. |
| Conexión REST Supabase | 🔴 La URL de `.env` falla con DNS `ENOTFOUND`, también fuera del sandbox. Las pruebas GET no pudieron obtener registros ni políticas. |
| Revisión visual 375px / 1280px | **No validada.** El host de acceso a navegadores no estaba disponible. El intento mediante Chrome nativo se detuvo porque Computer Use no pudo determinar su URL con suficiente confianza para aplicar su política. No se continuó controlando la interfaz. |

Las respuestas 200 de páginas privadas solo prueban acceso al HTML: no prueban la carga posterior de Supabase, guardado, descargas o consultas del navegador. Los tokens sintéticos no representan una prueba completa de login real.

La auditoría corresponde al código y configuración local disponibles. No se acredita que las mismas variables o fallos estén desplegados en producción. No se enviaron consultas comerciales, WhatsApp, correos ni facturas; tampoco se ejecutaron migraciones, altas, ediciones o borrados de registros. Las pruebas de autorización y tracking que requerían datos usaron dobles locales.

Al comenzar ya existían cambios en `app/(public)/servicios/page.tsx` y el archivo sin seguimiento `public/img/560Place.png`. Se preservaron.

### Variables de entorno

Se comprobó presencia, sin publicar valores, de `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `RESEND_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `NUBEFACT_API_URL` y `NUBEFACT_API_TOKEN`.

Todas están presentes. **Presencia no equivale a validez**: Supabase/Prisma fallan como se describe arriba. No se comprobó entrega real de Resend, aceptación de comprobantes por el proveedor ni permisos de la propiedad GA4. El ID de GA4 está definido en `app/layout.tsx:12` y se monta en `app/layout.tsx:128`.

## Fase 1 — Landing Page

**Estado general: 🔴 Bugs críticos comerciales y ⚠️ advertencias de medición/recursos.**

### Aspectos verificados

- Home, listados, contacto, Nosotros, FAQ, testimonios, legales, 11 proyectos, 9 artículos, 6 categorías y las 4 landings específicas existentes responden 200.
- Los enlaces de las tarjetas públicas encontrados en el HTML llevan a rutas existentes. Constructoras es accesible desde Servicios; Cercos está disponible en `/servicios/cercos-cerramientos`.
- El formulario incluye autocompletado y asociación de errores mediante `aria-invalid` / `aria-describedby`. Su secuencia de eventos de éxito pasa la prueba aislada.
- `app/api/contacto/route.ts:55` intenta persistir el Lead y tolera fallo de BD para continuar con el correo. El handler verifica el error del correo comercial antes de devolver éxito. **La inserción real del lead no queda validada por la simulación del formulario.**
- En código, Navbar conserva cierre con Escape, overlay, panel desmontado al cerrar y desbloqueo al pasar a desktop (`components/public/Navbar.tsx:70`, `90`, `98`, `269`, `283`).
- En código, las tres fichas B2B conservan compensación inferior, safe-area y tablas con scroll contenido: techos `page.tsx:320,453,714`; barandas `page.tsx:259,359,615`; chutes `page.tsx:270,367,601`. El flotante detecta esas tres rutas y conserva el offset y movimiento reducido (`components/public/WhatsAppButton.tsx:10,31,61`). Esto no sustituye una medición visual de overflow.

### Problemas

| ID | Archivo y línea | Problema e impacto | Prioridad | Corrección propuesta |
|----|-----------------|--------------------|-----------|----------------------|
| L-01 | `components/public/CertificacionesDetalle.tsx:61,195`; se utiliza en `app/(public)/nosotros/page.tsx:30` | Todavía se enumeran cuatro ISO bajo “Normas certificadas por HODELPE”. Contradice la aclaración expresa del propietario: LUDIER no tiene esas certificaciones ISO. La landing de Constructoras ya identifica a Hodelpe y no contiene esa mención; el problema persiste en Nosotros. | **Alta**, confianza comercial | Ajustar este bloque al alcance documental de la homologación Hodelpe para Grupo LAR. Validar separadamente cualquier afirmación WORLDCOB antes de conservarla. |
| L-02 | `components/public/Hero.tsx:552`; `components/public/Footer.tsx:132` | Los WhatsApp de estas ubicaciones usan enlaces directos sin `trackEvent` ni `WhatsAppLink`. Navegan, pero no emiten el evento propio `whatsapp_click`; el tracking automático de enlaces salientes no sustituye ese contrato de evento. | **Media** | Reutilizar el componente de tracking con ubicaciones diferenciadas y verificar cada CTA. |
| L-03 | `components/public/Testimonios.tsx:77,86,95,104,113,122` | Se referencian `/img/testimonio1.jpg` a `/img/testimonio6.jpg`, que no existen. Se confirmó 404 del primero y ausencia física de los seis. La página puede devolver 200 y aun mostrar imágenes rotas. | **Media** | Usar archivos existentes y autorizados, o un fallback explícito. |
| L-04 | `components/public/PublicLayout.tsx:15`; `components/public/Navbar.tsx:128`; `app/api/contacto/route.ts:105` | La compensación del header fijo sigue distribuida por página, sin reserva global. Además, el acuse de correo muestra un teléfono distinto al teléfono principal del sitio. No se afirma solapamiento visual ni que el segundo teléfono sea incorrecto: ambos requieren validación visual/comercial. | **Baja**, pendiente de verificar | Medir header/contenido en ambas resoluciones y confirmar qué número debe aparecer en el acuse. |

### Tracking: alcance de la conclusión

`components/public/Contacto.tsx:297,301,346,349` coloca correctamente los eventos alrededor del envío. `lib/analytics.ts:23` los envía solo si `window.gtag` existe; si no está disponible, los descarta, comportamiento solicitado en una fase anterior. No se propone revertirlo sin medir primero la pérdida.

Pendiente: GA4 DebugView con acceso a la propiedad, fallo HTTP del proveedor, bloqueo por consentimiento/extensiones y un lead de prueba autorizado. La CSP recibida en Home local **sí permite** Google Tag Manager/Analytics; no se confirmó un bloqueo de GA4 por CSP en esa respuesta. El config y el middleware definen políticas distintas, por lo que conviene unificarlas sin asumir que hoy ambas bloquean la misma página.

## Fase 2 — ERP y CRM

**Estado general: 🔴 Bugs críticos.**

Cotizaciones, obras, producción, inventario, calidad y personal tienen páginas que compilan. Su acceso sin sesión se deniega, pero la carga y el guardado real dependen de la conexión y de los permisos de BD que no pudieron validarse.

| ID | Archivo y línea | Problema e impacto | Prioridad | Corrección propuesta |
|----|-----------------|--------------------|-----------|----------------------|
| E-01 | `lib/client.ts:3`; `lib/prisma.ts:7`; `prisma/schema.prisma:6`; configuración `.env` sin revelar valores | La conexión auditada no funciona: REST Supabase no resuelve por DNS y Prisma recibe rechazo de tenant/usuario. Afecta login, consultas ERP/portal y persistencia de leads en este entorno. No se atribuye automáticamente al despliegue público. | **Alta** | Confirmar proyecto activo y restaurar URL, claves y cadena de conexión coherentes; repetir SELECT de salud antes de probar escrituras. |
| E-02 | Ver tabla de rutas más abajo | Formularios y botones todavía usan API sin `/erp`; no hay redirects de API que las resuelvan. Se confirmó 404 en las bases antiguas. También hay enlaces a pantallas que no existen. | **Alta** | Corregir contratos de navegación y API, preservando los redirects web válidos. Probar creación, detalle, edición, impresión y acciones de cada módulo. |
| E-03 | `app/api/erp/documentos/[id]/versiones/route.ts:80,82,157`; `app/erp/documentos/[id]/page.tsx:476` | “Versiones de documentos” contiene lógica de emisión de factura: recibe `valorizacionId`, consulta Valorizacion y llama al proveedor de facturación. El `[id]` documental no gobierna una versión. La UI muestra historial “próximamente”. No se invocó este POST. | **Alta** | Retirar la lógica de facturación de ese contrato y decidir si se implementará versionado o se deshabilitará formalmente la función. |
| E-04 | `app/api/crm/cotizaciones/[id]/convertir/route.ts:38,50` | La conversión CRM comprueba que no esté convertida, pero no exige estado APROBADA antes de crear una obra. El comentario promete convertir una aprobada y el código permite convertir un borrador. | **Alta** | Definir transición válida y comprobarla en servidor, con actualización condicional para evitar dos conversiones simultáneas. |
| E-05 | `app/erp/inventario/page.tsx:145,156,166` | Préstamo/devolución y stock se actualizan en solicitudes separadas usando cantidad del estado del navegador. Hay riesgo de carreras y de préstamo registrado sin descontar stock. La devolución no comprueba el resultado de ambas actualizaciones y anuncia éxito. | **Alta**, integridad | Operación atómica en servidor/BD, validación del estado anterior y devolución de errores al formulario. |
| E-06 | `app/erp/personal/page.tsx:275,285`; `app/erp/produccion/page.tsx:642,670`; `app/erp/calidad/page.tsx:269` | Varias respuestas Supabase no comprueban `.error`: consultas se presentan como listas vacías y borrados muestran éxito aunque fallen. Guardar un flujo borra pasos antes de insertar los nuevos, sin transacción ni revisión de cada error. | **Alta**, integridad/operación | Revisar cada respuesta, conservar el formulario ante error y aplicar transacciones/RPC donde varias escrituras constituyen una operación. |
| E-07 | `app/api/crm/cotizaciones/route.ts:116,124`; `prisma/schema.prisma:329` | El correlativo se calcula contando cotizaciones y sumando uno. Dos solicitudes concurrentes pueden elegir el mismo número; borrar registros también altera el supuesto. | **Media** | Asignar correlativo de forma atómica en BD y manejar conflicto/reintento, conservando unicidad. |
| E-08 | `app/erp/alertas/page.tsx:229,259`; `app/api/erp/alertas/route.ts:34` | Además del prefijo antiguo, la UI espera generación con `action=generar` y creación POST. La API implementada solo lista con GET, no procesa esa acción ni exporta POST. Corregir únicamente la URL dejaría acciones incompletas. | **Alta** | Definir generación/creación de alertas, sus permisos y contrato de respuesta; implementar o retirar botones según decisión de negocio. |
| E-09 | `app/api/erp/factura/emitir/route.ts:129`; `app/api/erp/documentos/[id]/versiones/route.ts:98` | La emisión usa datos fiscales de un cliente por defecto cuando no encuentra los del proyecto. Puede construir una factura para un destinatario distinto al correcto. No se evaluaron porcentajes tributarios ni se emitieron comprobantes. | **Alta** | Exigir datos fiscales explícitos y completos del cliente y confirmar su origen antes de habilitar la emisión. |

### Contratos de rutas rotos

| Consumidor | Referencia actual | Implementación / situación |
|------------|-------------------|---------------------------|
| `app/erp/cotizaciones/nueva/page.tsx:275` | `POST /api/cotizaciones` | Existe `/api/erp/cotizaciones`. |
| `app/erp/cotizaciones/[id]/page.tsx:130,150,197,230`; `editar/page.tsx:162,293`; `imprimir/page.tsx:46` | `/api/cotizaciones/:id` y acciones | Existen bajo `/api/erp/cotizaciones/:id`. |
| `app/erp/documentos/subir/page.tsx:162`; `[id]/page.tsx:135,181,201` | `/api/documentos` y `/:id` | Existen bajo `/api/erp/documentos`. |
| `app/erp/fotos/subir/page.tsx:170`; `[id]/page.tsx:144,192,212` | `/api/fotos` y `/:id` | Existen bajo `/api/erp/fotos`. |
| `components/FacturaElectronicaButton.tsx:61` | `/api/factura/emitir` | Existe `/api/erp/factura/emitir`. |
| `app/erp/alertas/page.tsx:229,259` | `/api/alertas` | Existe `/api/erp/alertas`, pero sin los contratos de generación/POST esperados. |
| `app/erp/documentos/page.tsx:305,475`; `app/erp/fotos/page.tsx:319` | `/documentos/subir`, `/documentos/:id`, `/fotos/subir` | El config redirige las bases `/documentos` y `/fotos`, pero no estos hijos. Deben apuntar a `/erp/...` o tener redirects específicos. |
| `components/DashboardLayout.tsx:98,125` | `/erp/facturacion`, `/erp/indicadores` | No hay páginas con esas rutas. Decidir si se implementan o se ocultan del menú. |

Los aliases exactos `/dashboard`, `/documentos`, `/fotos`, `/personal` y `/cotizaciones` sí tienen redirects en `next.config.ts`; no se reportan como 404 por su mera ausencia en `app`.

### Calidad de las comprobaciones automatizadas

- **QA-01 — Media:** `package.json:10` usa `next lint`, que falla con la versión instalada. Propuesta: configurar el comando soportado de ESLint y hacerlo ejecutar en CI.
- **QA-02 — Media:** `__tests__/crm/cotizaciones.test.ts:4` importa `test/describe` de `node:test`, aunque el script usa Jest. `jest.config.ts:14` también excluye `tests/crm/clientes.test.ts` por ubicación. Propuesta: unificar runner y descubrimiento, y distinguir tests de validadores de pruebas de API/permisos.
- El build avisa de raíz inferida por múltiples lockfiles, convención middleware deprecada y Cache-Control personalizado de `_next/static`. Son advertencias de mantenimiento, no fallos de compilación demostrados.

## Fase 3 — Portal del Cliente

**Estado general: 🔴 acceso indebido confirmado en una API relacionada; ⚠️ limitaciones funcionales.**

### Aspectos correctos

`app/api/cliente/dashboard/route.ts:23,34` y `app/api/cliente/fotos/route.ts:14,29,40` exigen CLIENTE y obtienen el proyecto con `cliente_user_id = token.id`. Las consultas de fotos, álbumes, hitos y valorizaciones se filtran por el proyecto obtenido en servidor; no aceptan un projectId arbitrario para elegir otro cliente. Sin sesión, ambos handlers devuelven 401. Esta protección es positiva, aunque no compensa el acceso alternativo del CRM descrito en A-02.

| ID | Archivo y línea | Problema e impacto | Prioridad | Corrección propuesta |
|----|-----------------|--------------------|-----------|----------------------|
| PC-01 | `app/api/crm/cotizaciones/route.ts:12,24,50` | Un CLIENTE puede evitar la UI del portal y consultar el CRM. La prueba aislada devolvió datos simulados ajenos. Es el mismo problema de autorización A-02, no una fuga confirmada del endpoint `/api/cliente/dashboard`. | **Alta** | Denegar ese rol en CRM o crear un contrato de cotizaciones del portal filtrado por titularidad. |
| PC-02 | `app/api/cliente/dashboard/route.ts:35`; `app/api/cliente/fotos/route.ts:29`; `lib/auth.ts:136`; `prisma/schema.prisma:54,77,87` | Se usa `.maybeSingle()` para la relación cliente–proyecto, mientras el modelo permite varios proyectos por usuario y el índice no es único. Si existen dos asignaciones, el portal puede responder “Proyecto no encontrado”. No se pudo comprobar si ya hay clientes con múltiples proyectos. | **Media**, condicionada a datos/negocio | Decidir uno o varios proyectos por cliente; alinear BD, selección de proyecto y autorización con esa decisión. |
| PC-03 | `app/cliente/layout.tsx:19`; `app/cliente/hitos/page.tsx:35`; `app/cliente/valorizaciones/page.tsx:42` | Se navega a `/cliente/login`, ruta inexistente. Hoy el middleware la reenvía a `/login?tipo=cliente&callbackUrl=...`; no es un 404 directo sin sesión, pero introduce un destino de retorno inexistente. Login no utiliza ese callback como retorno final. | **Media** | Usar la ruta real de login y preservar únicamente destinos válidos. |
| PC-04 | `app/cliente/layout.tsx:37`; inventario de `app/cliente` y `app/api/cliente` | Solo existen Dashboard, Fotos, Hitos y Valorizaciones; las API de cliente son Dashboard y Fotos. No se encontró módulo de cotizaciones o documentos descargables del cliente. | **Media**, decisión de alcance | Confirmar si estaban comprometidos comercialmente; definir visibilidad y descarga antes de implementarlos. |
| PC-05 | `app/api/cliente/dashboard/route.ts:42,53,130` | El error de valorizaciones no se gestiona antes de construir una respuesta con listas vacías; el de contratos tampoco se expone como fallo de esa sección. El cliente podría ver importes/avance cero como si fueran datos válidos. | **Media** | Mostrar error parcial explícito o fallar la sección, sin confundir ausencia de datos con fallo de consulta. |

**Pendiente de seguridad:** visibilidad real de buckets, políticas Storage y funcionamiento de descargas privadas. `app/api/erp/documentos/route.ts:114` y `app/api/erp/fotos/route.ts:190` construyen URLs públicas; no se pudo verificar si los buckets son públicos o privados. Eso no demuestra por sí solo una fuga. Las descargas de información privada deben validarse con autorización y URL temporal si corresponde.

## Fase 4 — Autenticación y seguridad

**Estado general: 🔴 Bugs críticos.**

| ID | Archivo y línea | Problema y evidencia | Prioridad | Corrección propuesta |
|----|-----------------|----------------------|-----------|----------------------|
| A-01 | `middleware.ts:213`; inventario API inferior | Todas las API pasan antes de comprobar sesión. Los 15 archivos `/api/erp/*` contienen 31 handlers sin comprobación propia de token/sesión. Los GET de cotizaciones, documentos y fotos entraron en consulta y devolvieron 500 por BD, en lugar de rechazar con 401. La exposición efectiva de datos Supabase depende de RLS, no verificable en este entorno. | **Alta** | Autenticación y autorización en cada handler, con denegación por defecto, antes de consultar o mutar datos. Proteger especialmente facturación y documentos. |
| A-02 | `app/api/crm/cotizaciones/route.ts:12,24,97`; `[id]/route.ts:15,67,207`; `[id]/convertir/route.ts:13` | Los 6 handlers de cotizaciones CRM solo exigen token. No comprueban rol ni relación con cliente/proyecto. La consulta Prisma usa filtro global y la prueba CLIENTE devuelve 200 con registro simulado ajeno. | **Alta** | Aplicar permisos de lectura/escritura/borrado/conversión y filtro de titularidad cuando proceda, independientemente de la UI. |
| A-03 | `lib/auth.ts:71,100,123` | Se consulta `active` pero no se comprueba. La prueba aislada con `active=false` devuelve un usuario autenticable. Además, los roles se copian al JWT al iniciar sesión y no se vuelven a validar durante su vigencia de 30 minutos. | **Alta** | Rechazar inactivos y definir cómo se revocan sesiones/permisos cuando cambian en BD. |
| A-04 | `middleware.ts:61`; `components/DashboardLayout.tsx:101` | El menú ofrece `/erp/cotizaciones` a FIELD_ENGINEER, pero el middleware le permite `/crm/cotizaciones`. HTTP con ese rol: ERP redirige a denegación y CRM responde 200. Asimismo, el retorno temprano de `allowed: ['*']` en `middleware.ts:256` omite evaluar los bloqueos declarados para ADMIN. | **Alta** para el acceso roto; el bloqueo ADMIN es inconsistencia latente | Definir una única política de rutas/acciones y reutilizarla en middleware, API y menú; evaluar también las denegaciones. |
| A-05 | `middleware.ts:267`; no existe `app/unauthorized/page.tsx` | FIELD_ENGINEER y CLIENTE rechazados reciben `/unauthorized`, que vuelve a redirigir a sí misma. FUNDADOR/ADMIN obtienen 404 en esa ruta. Se reprodujo por HTTP. | **Alta**, navegación | Proporcionar una respuesta/página de acceso denegado alcanzable sin provocar un nuevo rechazo. |
| A-06 | `app/api/auth/verificar-rol/route.ts:10,18`; `app/login/page.tsx:107,127` | Un POST público revela rol/existencia a partir del email antes de verificar contraseña, sin límite propio. Login depende de ese paso: un usuario válido de Supabase sin fila User no llega al aprovisionamiento previsto en `authorize`. | **Media** | Autenticar primero, responder de forma uniforme y resolver el rol en servidor; decidir el aprovisionamiento permitido. |
| A-07 | `lib/auth.ts:60`; `lib/client.ts:3`; `app/api/crm/contactos/route.ts:15`; `prisma/migrations/20260915_crm_contactos/migration.sql:56` | NextAuth y las consultas Supabase usan mecanismos de sesión distintos. No se encontró establecimiento de sesión Supabase en el navegador ni escritura de sus cookies durante el login NextAuth. La migración Contacto exige `auth.role()='authenticated'`, que no se satisface por tener solo una cookie NextAuth. Las políticas efectivamente instaladas no pudieron consultarse. | **Alta**, revisión de integración pendiente | Elegir y documentar cómo identidad/roles llegan a Supabase/RLS. Probar con usuario real que no haya ni acceso anónimo amplio ni errores silenciosos por falta de identidad. |
| A-08 | `lib/auth.ts:167`; `next.config.ts:6,11`; `.env` sin publicar valores | `debug:true` permanece activo, el secreto local de NextAuth tiene menos de 32 caracteres y `removeConsole:true` elimina también los errores del build de producción. Las imágenes remotas aceptan cualquier host HTTPS. No se deduce compromiso de credenciales ni falta de aleatoriedad solo por longitud. | **Media** para sesión/observabilidad; **Baja** para restringir hosts | Revisar secreto de alta entropía y rotación planificada; desactivar debug fuera de desarrollo; conservar logs de error sanitizados y limitar hosts necesarios. |

### Inventario de controles de API

Comprobación por handler, no solo por presencia de imports. Las rutas públicas de contacto y NextAuth son intencionales.

| Ruta | Métodos | Control observado |
|------|---------|-------------------|
| `/api/auth/[...nextauth]` | GET, POST | Handler NextAuth. |
| `/api/auth/verificar-rol` | POST | Público; hallazgo A-06. |
| `/api/contacto` | POST | Público intencional; Zod y rate limit. |
| `/api/cliente/dashboard`, `/api/cliente/fotos` | GET en cada una | Token, rol CLIENTE y proyecto obtenido por usuario. |
| `/api/crm/clientes` | GET, POST | Token y allowlist de roles; GET incluye FIELD_ENGINEER, POST FUNDADOR/ADMIN. |
| `/api/crm/clientes/[id]` | GET, PUT, DELETE | Token y allowlist de roles. |
| `/api/crm/contactos` | GET, POST | Sesión y FUNDADOR/ADMIN. |
| `/api/crm/contactos/[id]` | GET, PUT, DELETE | Sesión y roles; DELETE exige FUNDADOR. |
| `/api/crm/cotizaciones` | GET, POST | Solo token; A-02. |
| `/api/crm/cotizaciones/[id]` | GET, PUT, DELETE | Solo token; A-02. |
| `/api/crm/cotizaciones/[id]/convertir` | POST | Solo token; A-02 y E-04. |
| `/api/erp/alertas` | GET | Sin guardia de sesión propia. |
| `/api/erp/alertas/[id]` | GET, PUT, DELETE, PATCH | Sin guardia de sesión propia. |
| `/api/erp/cotizaciones` | GET, POST | Sin guardia de sesión propia. |
| `/api/erp/cotizaciones/[id]` | GET, PUT, DELETE | Sin guardia de sesión propia. |
| `/api/erp/cotizaciones/[id]/convertir`, `/enviar`, `/seguimiento` | POST en cada una | Sin guardia de sesión propia. |
| `/api/erp/documentos` | GET, POST | Sin guardia de sesión propia. POST acepta `subido_por` del formulario. |
| `/api/erp/documentos/[id]` | GET, PUT, DELETE | Sin guardia de sesión propia. |
| `/api/erp/documentos/[id]/carpeta` | GET, POST, DELETE | Sin guardia de sesión propia. |
| `/api/erp/documentos/[id]/versiones` | POST | Sin guardia de sesión propia; lógica de facturación E-03. |
| `/api/erp/factura/emitir` | POST | Sin guardia de sesión propia; no se invocó. |
| `/api/erp/fotos` | GET, POST | Sin guardia de sesión propia. POST acepta `subido_por`. |
| `/api/erp/fotos/[id]` | GET, PUT, DELETE | Sin guardia de sesión propia. |
| `/api/erp/fotos/[id]/album` | GET, POST, DELETE | Sin guardia de sesión propia. |

El autor de una subida debe obtenerse de la identidad validada; el campo enviado por el navegador no es una prueba de identidad. Rate limit y validación Zod no sustituyen autorización.

### Matriz HTTP observada

| Rol / situación | Dashboard ERP | Obras | Cotizaciones ERP | Cotizaciones CRM | Producción | Inventario | Calidad | Personal | Portal |
|-----------------|---------------|-------|------------------|------------------|------------|------------|---------|----------|--------|
| Sin sesión | Login | Login | Login | Login | Login | Login | Login | Login | Login cliente |
| FUNDADOR | 200 | 200 | 200 | 200 | 200 | 200 | 200 | 200 | 200 HTML |
| ADMIN | 200 | 200 | 200 | 200 | 200 | 200 | 200 | 200 | 200 HTML |
| FIELD_ENGINEER | Denegación | 200 | **Denegación pese al menú** | 200 | 200 | Denegación | 200 | 200 | Denegación |
| CLIENTE | Denegación | Denegación | Denegación | Denegación de página | Denegación | Denegación | Denegación | Denegación | 200 HTML |

“Denegación” actualmente termina en el bucle A-05. El 200 HTML del portal para roles con acceso total no significa acceso a su API: la API del portal sí exige CLIENTE. La denegación de la página CRM al CLIENTE tampoco protege su API, como demuestra A-02.

## Fase 5 — SEO y comercial

**Estado general: 🔴 canonical incorrectos y ⚠️ advertencias de descubrimiento/consistencia.**

| ID | Archivo y línea | Problema e impacto | Prioridad | Corrección propuesta |
|----|-----------------|--------------------|-----------|----------------------|
| S-01 | `app/layout.tsx:106`; `app/(public)/servicios/page.tsx`, `proyectos/page.tsx:1`, `contacto/page.tsx:1`, `nosotros/page.tsx`, `faq/page.tsx`, `testimonios/page.tsx` | `/servicios`, `/proyectos`, `/contacto`, `/nosotros`, `/faq` y `/testimonios` heredan canonical `https://grupoludier.com/`, título/description/OG de Home. Confirmado en HTML servido. Envía señales incorrectas de consolidación de páginas distintas. | **Alta** | Metadata propia desde wrappers/layouts Server cuando la página sea cliente; canonical autorreferente y OG de cada página. |
| S-02 | `app/sitemap.ts:14,76` | El sitemap contiene 35 URLs válidas, pero omite techos, barandas y chutes B2B. Constructoras sí está incluida explícitamente; Cercos también, mediante el mapa de categorías. No se detectaron URLs `/public/` ni destinos inexistentes en el sitemap. | **Media** | Añadir las tres fichas faltantes. Privacidad y términos tienen `noindex` explícito; su omisión no se trata como bug. |
| S-03 | `app/layout.tsx:18`; `app/(public)/blog/[slug]/page.tsx:38`; `proyectos/[slug]/page.tsx:35`; `servicios/[slug]/page.tsx:121`; `servicios/chutes-metalicos-para-construccion/page.tsx:42` | Muchos títulos ya incluyen `| LUDIER` y reciben además `· LUDIER` del template. Portones, Constructoras, Techos y Barandas específicas ya evitan esa duplicación. | **Media** | Unificar títulos sin marca más template, o usar absolute en los títulos completos, sin cambiar keywords por intuición. |
| S-04 | `app/(public)/blog/page.tsx:36,48` | La imagen Open Graph/Twitter `/img/og_image.jpg` no existe y responde 404. | **Media** | Reutilizar una imagen OG existente con dimensiones y contenido adecuados. |
| S-05 | `app/(public)/servicios/barandas-acero-inoxidable/page.tsx:52`; `estructuras-metalicas-para-techos/page.tsx:57` | OG mantiene textos anteriores a las últimas optimizaciones de title/description. No invalida las etiquetas, pero la vista compartida comunica un enfoque distinto. | **Baja** | Revisar coherencia comercial; no es obligatorio que OG sea literalmente igual al title. |
| S-06 | `app/(public)/servicios/empresas-estructuras-metalicas/page.tsx:148,168` | Constructoras tiene Service JSON-LD válido como JSON, pero no BreadcrumbList, a diferencia de las otras fichas. No es un error de carga ni un requisito universal de indexación. | **Baja** | Añadir breadcrumb si se mantiene la misma arquitectura de fichas. |

### Estado por landing B2B

| Ruta | HTTP | Canonical propio | Title sin doble marca | JSON-LD encontrado | Sitemap |
|------|------|------------------|-----------------------|--------------------|---------|
| `/servicios/estructuras-metalicas-para-techos` | 200 | Sí | Sí | Service, FAQPage, BreadcrumbList | **No** |
| `/servicios/barandas-acero-inoxidable` | 200 | Sí | Sí | Service, FAQPage, BreadcrumbList | **No** |
| `/servicios/chutes-metalicos-para-construccion` | 200 | Sí | **No** | Service, FAQPage, BreadcrumbList | **No** |
| `/servicios/cercos-cerramientos` | 200 | Sí | **No** | Service, BreadcrumbList | Sí |
| `/servicios/empresas-estructuras-metalicas` | 200 | Sí | Sí | Service | Sí |

Los 9 artículos tienen Article y BreadcrumbList; los 11 proyectos usan CreativeWork. Los bloques encontrados se pudieron parsear como JSON. No se ejecutó el validador externo de resultados enriquecidos ni se acredita elegibilidad para un resultado de Google por la mera presencia de schema. Las tres fichas antiguas conservan FAQPage; el artículo de portones conserva las FAQ visibles sin ese schema.

Los enlaces de artículos hacia servicios encontrados en el HTML resuelven a páginas existentes. La intención comercial de Constructoras sigue apuntando a su propia landing; no se propone fusionarla con Techos ni redirigir artículos sin datos de consultas/páginas de Search Console.

## Plan de corrección priorizado — no aplicado

### P0 — Seguridad y acceso a datos

1. **Cerrar el acceso indebido de cotizaciones CRM (A-02/PC-01):** permisos por acción y titularidad; pruebas CLIENTE→CRM y cliente A→datos B que deban devolver 403/404 sin consultar datos ajenos.
2. **Proteger todas las API ERP (A-01):** identidad antes de consultar/guardar, roles explícitos, autor de subida derivado de sesión; revisar primero facturación, documentos y borrados. Verificar RLS/Storage como segunda capa, sin sustituir el guardia de aplicación.
3. **Restaurar conectividad coherente (E-01) y probar la integración de identidad Supabase (A-07):** primero SELECT y catálogo de políticas, después pruebas en entorno de prueba. Repetir el aislamiento con cuentas reales autorizadas. No relajar RLS para “hacer que funcione”.
4. **Rechazar inactivos y definir revocación (A-03):** test de login de usuario desactivado y de cambio de rol durante una sesión.
5. **Resolver el endpoint de versiones/facturación y los datos fiscales por defecto (E-03/E-09):** decisión de alcance y prueba con proveedor de pruebas antes de cualquier emisión.

### P1 — Funcionalidad que hoy falla

6. **Alinear navegación, middleware y API (A-04/A-05/E-02):** rutas canónicas, acceso de FIELD_ENGINEER a cotizaciones y una página/estado de denegación sin bucle.
7. **Completar contratos de acciones y validar guardados (E-04/E-08):** crear/editar/imprimir/enviar/convertir cotización, documentos, fotos y alertas. Confirmar si “Enviar cotización” solo cambia estado o debe enviar correo: el handler ERP actual únicamente la marca ENVIADA y registra seguimiento (`app/api/erp/cotizaciones/[id]/enviar/route.ts:75,89`).
8. **Garantizar integridad y errores visibles (E-05/E-06/E-07/PC-05):** transacciones, correlativos atómicos, estado anterior de stock, errores parciales explícitos y conservación de datos del formulario al fallar.
9. **Recuperar la comprobación automática (QA-01/QA-02):** lint soportado, runner único y pruebas de autorización, contrato API y concurrencia. El build correcto no sustituye estas pruebas.

### P2 — Captación, medición y confianza

10. **Corregir el contenido sobre certificaciones (L-01)** conforme a la documentación real; confirmar número del acuse y afirmaciones comerciales pendientes.
11. **Corregir canonical/metadata y sitemap (S-01/S-02/S-03)** y luego revisar OG y recursos rotos (L-03/S-04/S-05/S-06).
12. **Cubrir todos los CTA y comprobar GA4 (L-02):** ubicaciones consistentes, prueba de error/éxito sin duplicados y confirmación en DebugView. `generate_lead` no acredita por sí solo ingreso cobrado ni cierre de venta.

### P3 — UX y decisiones de producto

13. Revisar con navegador a **375×812** y **1280×800**: header/primer CTA, menú y foco, scroll de tablas, barras fijas, galería, lectura de artículos, formularios con teclado y navegación del ERP/portal. Medir `scrollWidth > clientWidth` y comprobar que cada control sea operable; no declarar esta etapa aprobada con análisis estático.
14. Decidir si un cliente puede tener varios proyectos y si el portal debe ofrecer documentos/cotizaciones. Definir también destino de los menús Facturación/Indicadores y la generación de alertas. Estas decisiones no se corrigieron automáticamente.
15. Planificar mantenimiento de middleware/proxy, raíz del build, política CSP coherente, logs sanitizados, secreto de sesión y restricciones de imágenes remotas.

## Criterios de cierre de la auditoría correctiva

- Build, TypeScript, lint y tests terminan con código 0.
- Sin sesión, cada API privada responde 401; rol insuficiente responde 403 o 404 controlado; no hay bucles de redirección.
- CLIENTE no accede a API CRM/ERP y solo obtiene sus proyectos, cotizaciones, fotos y documentos mediante contratos autorizados.
- Se prueban creación/edición/borrado y errores sin mensajes falsos de éxito, en una BD de prueba, incluyendo concurrencia en inventario y correlativos.
- Las 38 páginas públicas indexables del inventario tienen canonical propio y cobertura en sitemap cuando corresponda; las 2 legales permanecen con su política noindex deliberada.
- Los eventos se verifican en GA4 con un lead autorizado; nunca se confunde evento de clic con venta.
- La revisión visual y táctil se completa en navegador/dispositivo; siguen pendientes el teclado móvil real, contraste medido y descargas autenticadas.

**No se aplicó ninguna de las correcciones propuestas.**
