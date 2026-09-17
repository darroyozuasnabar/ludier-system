# Módulo Clientes

## Descripción
Módulo de gestión de clientes del CRM. Permite registrar, listar, editar y desactivar clientes.

## Funcionalidades
- Listar clientes
- Buscar por nombre, RUC o email
- Crear cliente
- Editar cliente
- Eliminar cliente (soft delete)

## Estructura de la tabla `Cliente`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | text | PK |
| `nombre` | text | Nombre del cliente (obligatorio) |
| `ruc` | text | RUC (único) |
| `tipo_documento` | text | RUC, DNI, CE, PASAPORTE |
| `numero_documento` | text | Número de documento |
| `direccion` | text | Dirección fiscal |
| `telefono` | text | Teléfono de contacto |
| `email` | text | Email de contacto |
| `sitio_web` | text | Sitio web |
| `sector` | text | Sector industrial |
| `tamano_empresa` | text | MICRO, PEQUENA, MEDIANA, GRANDE |
| `notas` | text | Notas adicionales |
| `activo` | boolean | Estado (true/false) |
| `creado_por` | text | FK a User |
| `created_at` | timestamp | Fecha de creación |
| `updated_at` | timestamp | Fecha de actualización |

## API Endpoints

### GET `/api/crm/clientes`
Lista todos los clientes.

**Query params:**
- `search` (opcional): busca por nombre, RUC o email

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "nombre": "Grupo LAR",
      "ruc": "20610039546",
      "email": "contacto@grupolar.pe",
      ...
    }
  ]
}
POST /api/crm/clientes
Crea un nuevo cliente.

Body:

json
{
  "nombre": "Grupo LAR",
  "ruc": "20610039546",
  "email": "contacto@grupolar.pe",
  "telefono": "+51 999 888 777",
  "sector": "Construcción"
}
GET /api/crm/clientes/[id]
Obtiene un cliente por ID.

PUT /api/crm/clientes/[id]
Actualiza un cliente.

DELETE /api/crm/clientes/[id]
Desactiva un cliente (soft delete).

UI
Ruta: /crm/clientes

Componentes:

Tabla de clientes

Buscador

Modal de creación/edición

Botones de acción (editar, eliminar)

Tipos TypeScript
Los tipos están en types/crm/cliente.ts:

typescript
import { Cliente, ClienteFormData, ClienteResponse } from "@/types/crm/cliente";
Permisos
Rol	Listar	Crear	Editar	Eliminar
FUNDADOR	✅	✅	✅	✅
ADMIN	✅	✅	✅	✅
FIELD_ENGINEER	✅	❌	❌	❌
CLIENTE	❌	❌	❌	❌
Ramas
feature/crm-clientes: desarrollo del módulo

Autor
Diego (owner)