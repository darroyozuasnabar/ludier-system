# Cierre de pendientes de seguridad

## Asignación de ingenieros

El modelo actual no relaciona FIELD_ENGINEER con proyectos asignados. La relación
`Project.cliente_user_id` pertenece al cliente y `Cotizacion.creado_por` indica autoría;
ninguna demuestra asignación de un ingeniero.

El listado CRM responde con datos y estadísticas vacíos para FIELD_ENGINEER.
Detalle, conversión, creación, edición y borrado responden 403 antes de acceder a
cotizaciones. Se incluyen las mutaciones para impedir un acceso alternativo por PUT.
FUNDADOR y ADMIN conservan las operaciones existentes.

TODO: modelar y autorizar la asignación antes de habilitar estas acciones al ingeniero.
No se aplicó una migración ni se inventó una relación a partir de la autoría.

## Usuarios desactivados

`lib/auth-session.ts` comparte un decoder JWT que consulta `User.active` en Prisma.
Se usa en NextAuth (`getServerSession` y `/api/auth/session`), Proxy y todos los
handlers que antes llamaban directamente a `getToken`.

Cada lectura autenticada realiza una consulta; no se cachea el resultado. Un usuario
inactivo, inexistente o sin `active === true` no obtiene sesión. También se deniega
si la BD no responde: esto reduce disponibilidad durante una incidencia de conexión.

Proxy redirige al login y elimina las cookies de sesión, incluidos sus fragmentos.
Las APIs devuelven su 401 existente. La ruta de sesión de NextAuth limpia las cookies
cuando el decoder rechaza el JWT. Las páginas y APIs públicas siguen siendo públicas.

TODO operativo: medir la carga y latencia de esta consulta por request. No introducir
una caché sin definir expresamente el retraso de revocación aceptable.

Este control comprueba el estado actual del usuario; no implementa una lista negra
permanente de JWT ni cambia roles, claves o la duración existente de las sesiones.
Si se reactiva un usuario, una copia retenida de un JWT aún vigente podría volver
a aceptarse. La revocación permanente requiere versionado de sesiones o equivalente.

## Versiones de documentos

Se retiraron del endpoint `/api/erp/documentos/[id]/versiones` el cliente Supabase,
los cálculos y numeración fiscales, la consulta a Valorizacion, la llamada a Nubefact
y la actualización del comprobante. Un POST autorizado responde 501 indicando que
el versionado no está implementado; no crea versiones ni emite facturas.

Se conserva la comprobación de sesión y la allowlist FUNDADOR/ADMIN. No se cambió
`/api/erp/factura/emitir`: el componente de facturación ya apunta a esa ruta.
La UI documental muestra el historial como próximamente y no llama a `/versiones`.
No fue necesario editar componentes de UI.

TODO de producto: definir almacenamiento, historial, permisos y recuperación de
versiones antes de sustituir el 501 por una implementación real.
