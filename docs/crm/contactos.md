# Módulo CRM — Contactos

**Autor:** Jhon  
**Avance:** APF1 — Semanas 1–6  
**Rama:** `feature/crm-oportunidades`  
**Estado:** ✅ Completo (full-stack)

---

## Descripción

El módulo de Contactos permite gestionar las personas de contacto asociadas a las empresas y clientes del CRM LUDIER. Cada contacto almacena datos personales, de empresa, medios de comunicación y un estado de relación comercial.

---

## Estructura de archivos

```
prisma/
└── migrations/
    └── 20260915_crm_contactos/
        └── migration.sql          ← DDL: tabla, índices, RLS, trigger

lib/validations/
└── contactos.ts                   ← Schemas Zod: contactoSchema, contactoFiltrosSchema

app/api/crm/contactos/
├── route.ts                       ← GET (listar) · POST (crear)
└── [id]/
    └── route.ts                   ← GET (por ID) · PUT (actualizar) · DELETE (eliminar)

app/crm/contactos/
├── page.tsx                       ← UI: listado con KPIs y filtros
├── nuevo/
│   └── page.tsx                   ← UI: formulario de creación
├── [id]/
│   └── page.tsx                   ← UI: formulario de edición
└── _components/
    └── ContactoForm.tsx            ← Formulario reutilizable (react-hook-form + zod)

__tests__/crm/
└── contactos.test.ts              ← Tests unitarios del schema y lógica
```

---

## Base de datos

### Tabla `CrmContacto`

| Columna        | Tipo           | Descripción                                 |
|----------------|----------------|---------------------------------------------|
| `id`           | `TEXT` (UUID)  | Clave primaria, generada automáticamente    |
| `nombre`       | `VARCHAR(100)` | Nombre del contacto (requerido)             |
| `apellido`     | `VARCHAR(100)` | Apellido del contacto (requerido)           |
| `cargo`        | `VARCHAR(100)` | Cargo dentro de la empresa                  |
| `empresa`      | `VARCHAR(150)` | Nombre de la empresa                        |
| `email`        | `VARCHAR(150)` | Correo electrónico                          |
| `telefono`     | `VARCHAR(20)`  | Teléfono principal                          |
| `telefono_alt` | `VARCHAR(20)`  | Teléfono alternativo                        |
| `direccion`    | `VARCHAR(200)` | Dirección física                            |
| `estado`       | `VARCHAR(20)`  | `ACTIVO` \| `INACTIVO` \| `PROSPECTO`       |
| `notas`        | `TEXT`         | Observaciones libres                        |
| `creado_por`   | `TEXT`         | ID del usuario que creó el registro         |
| `created_at`   | `TIMESTAMPTZ`  | Fecha de creación (automática)              |
| `updated_at`   | `TIMESTAMPTZ`  | Última actualización (trigger automático)   |

**Índices:** `empresa`, `email`, `estado`, `creado_por`  
**RLS:** habilitado — solo usuarios autenticados pueden operar  
**Trigger:** `updated_at` se actualiza automáticamente con `crm_set_updated_at()`

---

## API REST

Base URL: `/api/crm/contactos`

### `GET /api/crm/contactos`

Lista contactos con paginación y filtros.

**Query params:**

| Param    | Tipo   | Descripción                                      |
|----------|--------|--------------------------------------------------|
| `q`      | string | Búsqueda en nombre, apellido, email, empresa     |
| `estado` | string | `ACTIVO` \| `INACTIVO` \| `PROSPECTO` \| `ALL`  |
| `empresa`| string | Filtro por nombre de empresa (ilike)             |
| `limit`  | number | Máximo de resultados (default: 50, max: 200)     |
| `offset` | number | Desplazamiento para paginación (default: 0)      |

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": [ /* array de contactos */ ],
  "total": 42,
  "limit": 50,
  "offset": 0
}
```

---

### `POST /api/crm/contactos`

Crea un nuevo contacto. Requiere rol `FUNDADOR` o `ADMIN`.  
Aplica rate limiting por IP.

**Body (JSON):**
```json
{
  "nombre":       "Juan",
  "apellido":     "García",
  "cargo":        "Gerente de proyectos",
  "empresa":      "Constructora ACME S.A.C.",
  "email":        "juan@acme.com",
  "telefono":     "+51 999 999 999",
  "telefono_alt": null,
  "direccion":    "Av. Principal 123, Lima",
  "estado":       "ACTIVO",
  "notas":        "Contacto clave para licitaciones"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": { /* contacto creado */ },
  "message": "Contacto creado exitosamente"
}
```

---

### `GET /api/crm/contactos/[id]`

Obtiene un contacto por su ID.

**Respuesta 404 si no existe:**
```json
{ "success": false, "error": "Contacto no encontrado" }
```

---

### `PUT /api/crm/contactos/[id]`

Actualiza parcialmente un contacto. Acepta cualquier subconjunto de campos del schema.  
Verifica existencia del contacto antes de actualizar.

---

### `DELETE /api/crm/contactos/[id]`

Elimina un contacto. Solo disponible para rol `FUNDADOR`.

---

## Validaciones (Zod)

Definidas en `lib/validations/contactos.ts`:

| Campo        | Regla                                              |
|--------------|----------------------------------------------------|
| `nombre`     | mín. 2 chars, máx. 100                             |
| `apellido`   | mín. 2 chars, máx. 100                             |
| `cargo`      | opcional, máx. 100                                 |
| `empresa`    | opcional, máx. 150                                 |
| `email`      | formato email válido, opcional                     |
| `telefono`   | opcional                                           |
| `direccion`  | opcional, máx. 200                                 |
| `estado`     | enum: `ACTIVO` \| `INACTIVO` \| `PROSPECTO`        |
| `notas`      | opcional, máx. 1000 chars                          |

---

## UI

### `/crm/contactos` — Listado

- KPIs: Total, Activos, Prospectos, Inactivos
- Filtros: búsqueda de texto libre + filtro por estado
- Tabla responsiva con nombre, empresa, email, teléfono, badge de estado
- Acciones por fila: editar (→ `/crm/contactos/[id]`) y eliminar
- Toast de confirmación/error en cada operación

### `/crm/contactos/nuevo` — Crear contacto

- Formulario validado con `react-hook-form` + resolución Zod
- Secciones: Datos personales · Empresa · Datos de contacto · Notas
- Redirige al listado tras guardar exitosamente

### `/crm/contactos/[id]` — Editar contacto

- Carga los datos del contacto desde la API al montar
- Mismo formulario reutilizable (`ContactoForm`) con valores iniciales
- Muestra mensaje de éxito antes de redirigir al listado

---

## Seguridad

- Autenticación via NextAuth (`getServerSession`)
- Roles permitidos: `FUNDADOR`, `ADMIN` (CRM restringido)
- Rate limiting en `POST` via Upstash Redis
- RLS en Supabase como segunda capa de defensa
- Validación de entrada con Zod en todos los endpoints
- Solo `FUNDADOR` puede eliminar contactos

---

## Cómo ejecutar los tests

```powershell
# Desde la raíz del proyecto
npx jest __tests__/crm/contactos.test.ts --no-coverage
```

---

## Commits del módulo

| # | Tipo | Mensaje |
|---|------|---------|
| 1 | feat | `feat(crm-contactos): crear tabla y modelo` |
| 2 | feat | `feat(crm-contactos): API CRUD` |
| 3 | feat | `feat(crm-contactos): UI listado y formulario` |
| 4 | docs | `docs(crm-contactos): documentación del módulo` |
| 5 | test | `test(crm-contactos): tests unitarios` |
