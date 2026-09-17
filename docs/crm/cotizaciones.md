# 📄 Módulo de Cotizaciones — CRM LUDIER

## 1. 🎯 Descripción del Módulo
El módulo de **Cotizaciones** del CRM de **CONSTRUCCIONES GENERALES LUDIER E.I.R.L.** permite la prospección comercial, elaboración técnica de presupuestos, control de vigencias y la conversión directa de propuestas comerciales aprobadas en Proyectos/Obras activas dentro del ERP.

---

## 2. 👤 Responsable
- **Integrante:** Ribau Oscco
- **Rama Git:** `feature/crm-cotizaciones`
- **Módulo asignado:** Cotizaciones (Full-Stack: Base de Datos + API + Interfaz + Testing + Documentación)
- **Email institucional:** `u23242270@utp.edu.pe`

---

## 3. 🗄️ Modelo de Datos

### 3.1 Tabla `public."Cotizacion"`
| Campo | Tipo | Descripción | Obligatorio |
|---|---|---|---|
| `id` | `text` (UUID) | Identificador único de la cotización | Sí |
| `numero` | `text` | Correlativo comercial único (ej. `COT-2026-0001`) | Sí |
| `project_id` | `text` | FK hacia `Project(id)` cuando se convierte a obra | No |
| `cliente` | `text` | Razón social o nombre del cliente | Sí |
| `cliente_ruc` | `text` | RUC fiscal del cliente (11 dígitos) | No |
| `cliente_contacto`| `text` | Nombre del contacto o ingeniero responsable | No |
| `cliente_telefono`| `text` | Teléfono o celular de contacto | No |
| `cliente_email` | `text` | Correo electrónico comercial | No |
| `cliente_direccion`| `text` | Dirección o ubicación de la obra | No |
| `fecha_emision` | `date` | Fecha de elaboración de la propuesta | Sí |
| `fecha_validez` | `date` | Fecha de vencimiento de la oferta | No |
| `estado` | `text` (Enum) | `BORRADOR`, `ENVIADA`, `VISTA`, `APROBADA`, `RECHAZADA`, `EXPIRADA`, `CONVERTIDA_A_OBRA` | Sí |
| `subtotal` | `numeric(12,2)` | Monto antes de impuestos | Sí |
| `igv` | `numeric(12,2)` | Impuesto General a las Ventas (18%) | Sí |
| `total` | `numeric(12,2)` | Monto total de la cotización | Sí |
| `moneda` | `text` (Enum) | `PEN` (Soles) o `USD` (Dólares americanos) | Sí |
| `tipo_cambio` | `numeric(8,3)` | Tipo de cambio referencial | No |
| `condiciones` | `text` | Términos de pago, plazo de entrega y validez | No |
| `notas` | `text` | Observaciones técnicas o comerciales | No |
| `creado_por` | `text` | FK a `User(id)` del asesor comercial creador | No |
| `fecha_conversion`| `timestamp` | Fecha en la que se convirtió a Obra en el ERP | No |
| `created_at` | `timestamp` | Fecha y hora de creación del registro | Sí |
| `updated_at` | `timestamp` | Fecha y hora de última modificación | Sí |

### 3.2 Tabla `public."CotizacionItem"`
| Campo | Tipo | Descripción | Obligatorio |
|---|---|---|---|
| `id` | `text` (UUID) | Identificador único del ítem | Sí |
| `cotizacion_id` | `text` | FK a `Cotizacion(id)` (ON DELETE CASCADE) | Sí |
| `descripcion` | `text` | Detalle técnico del producto o partida | Sí |
| `cantidad` | `numeric(10,2)` | Cantidad metrada | Sí |
| `unidad` | `text` | Unidad (`UND`, `ML`, `M2`, `KG`, `GLB`, etc.) | Sí |
| `precio_unitario`| `numeric(12,2)` | Precio unitario de la partida | Sí |
| `descuento` | `numeric(12,2)` | Descuento aplicado en el ítem | No |
| `total` | `numeric(12,2)` | Subtotal calculado: `(cantidad * precio) - descuento` | Sí |
| `orden` | `integer` | Posición del ítem en la lista | No |

---

## 4. 🔌 Endpoints de la API

### 4.1 `GET /api/crm/cotizaciones`
Obtiene el listado de cotizaciones registradas, con soporte de filtrado y métricas ejecutivas.

- **Query Parameters:**
  - `busqueda` (opcional): Filtra por cliente, RUC o número de cotización.
  - `estado` (opcional): Filtro por estado (`BORRADOR`, `ENVIADA`, `APROBADA`, etc.).
  - `moneda` (opcional): Filtro por moneda (`PEN`, `USD`).

- **Ejemplo de Respuesta (200 OK):**
```json
{
  "data": [
    {
      "id": "c1f7a8b2-4d3e-4b2a-8f1a-9e8d7c6b5a4f",
      "numero": "COT-2026-0001",
      "cliente": "Constructora San Martín S.A.C.",
      "cliente_ruc": "20601234567",
      "estado": "BORRADOR",
      "moneda": "PEN",
      "subtotal": 10000.00,
      "igv": 1800.00,
      "total": 11800.00,
      "items": [
        {
          "descripcion": "Fabricación e instalación de barandas metálicas",
          "cantidad": 50,
          "unidad": "ML",
          "precio_unitario": 200.00,
          "total": 10000.00
        }
      ]
    }
  ],
  "estadisticas": {
    "total": 1,
    "montoTotalPEN": 11800.00,
    "montoTotalUSD": 0,
    "aprobadas": 0,
    "convertidas": 0
  }
}
```

---

### 4.2 `POST /api/crm/cotizaciones`
Crea una nueva cotización comercial validada con Zod.

- **Ejemplo de Request Body:**
```json
{
  "cliente": "Inmobiliaria Los Álamos S.A.",
  "cliente_ruc": "20549876543",
  "cliente_contacto": "Ing. Roberto Peña",
  "cliente_telefono": "+51 987654321",
  "cliente_email": "rpena@losalamos.pe",
  "cliente_direccion": "Av. Javier Prado Este 2450, Lima",
  "fecha_emision": "2026-09-15",
  "fecha_validez": "2026-09-30",
  "moneda": "PEN",
  "items": [
    {
      "descripcion": "Estructuras metálicas para techo de almacén",
      "cantidad": 120,
      "unidad": "M2",
      "precio_unitario": 150.00,
      "descuento": 0
    }
  ],
  "condiciones": "50% adelanto, 50% contra entrega. Validez 15 días."
}
```

- **Respuesta (201 Created):**
```json
{
  "data": {
    "id": "a9d8c7b6-5e4f-3a2b-1c0d-9e8f7a6b5c4d",
    "numero": "COT-2026-0002",
    "subtotal": 18000.00,
    "igv": 3240.00,
    "total": 21240.00,
    "estado": "BORRADOR"
  },
  "message": "Cotización COT-2026-0002 creada exitosamente"
}
```

---

### 4.3 `GET /api/crm/cotizaciones/:id`
Retorna el detalle completo de una cotización, incluyendo ítems, historial de seguimiento y proyecto asociado si existe.

---

### 4.4 `PUT /api/crm/cotizaciones/:id`
Actualiza datos de cliente, fechas, partidas o estado de la cotización. Recalcula automáticamente subtotales, IGV y total.

---

### 4.5 `DELETE /api/crm/cotizaciones/:id`
Elimina la cotización si no ha sido convertida a obra activa.

---

### 4.6 `POST /api/crm/cotizaciones/:id/convertir`
Convierte atómicamente una cotización comercial en una Obra/Proyecto activo en el ERP de LUDIER.

- **Reglas:**
  - Si la cotización ya fue convertida previamente, retorna `409 Conflict`.
  - Crea el registro en `Project` con el valor total de la cotización.
  - Actualiza el estado de la cotización a `CONVERTIDA_A_OBRA` y asigna `project_id`.
  - Registra una entrada en la bitácora de seguimiento `CotizacionSeguimiento`.

- **Request Body (Opcional):**
```json
{
  "projectName": "Obra Los Álamos - Estructura Techo",
  "location": "Av. Javier Prado Este 2450, Lima",
  "expectedEndDate": "2026-11-15",
  "clientType": "CONSTRUCTORA"
}
```

- **Respuesta (200 OK):**
```json
{
  "message": "Cotización COT-2026-0002 convertida exitosamente a Obra",
  "data": {
    "project": {
      "id": "proj-uuid-1234",
      "name": "Obra Los Álamos - Estructura Techo",
      "valorization": 21240.00,
      "status": "ACTIVO"
    }
  }
}
```

---

## 5. 🛡️ Validaciones con Zod (`lib/validations/cotizacion.ts`)

| Regla de Validación | Descripción |
|---|---|
| `cliente` | Obligatorio, entre 3 y 150 caracteres. |
| `cliente_ruc` | Opcional, 11 dígitos numéricos si se provee. |
| `items` | Mínimo 1 ítem en la lista. |
| `items[].descripcion` | Obligatorio, mínimo 3 caracteres. |
| `items[].cantidad` | Número positivo estrictamente mayor a 0. |
| `items[].precio_unitario` | Número positivo mayor a 0. |
| `items[].descuento` | Número no negativo (mínimo 0). |
| `moneda` | Debe ser `PEN` o `USD`. |
| `estado` | Estado válido del flujo comercial. |

---

## 6. 🔄 Flujo de Estados y Conversión

```
  ┌────────────┐
  │  BORRADOR  │ ────► (Edición inicial del presupuesto)
  └─────┬──────┘
        │
        ▼
  ┌────────────┐
  │  ENVIADA   │ ────► (Propuesta remitida al cliente)
  └─────┬──────┘
        │
        ├────────────────────────┐
        ▼                        ▼
  ┌────────────┐           ┌───────────┐
  │  APROBADA  │           │ RECHAZADA │
  └─────┬──────┘           └───────────┘
        │
        ▼  [ Acción: POST /convertir ]
  ┌───────────────────────┐
  │  CONVERTIDA_A_OBRA    │ ────► Crea Proyecto en ERP (`Project`)
  └───────────────────────┘
```

---

## 7. 🧪 Testing Unitario
Los tests del módulo están ubicados en `__tests__/crm/cotizaciones.test.ts` y cubren:
1. **Validación Zod:** Rechazo de cotizaciones sin cliente o sin partidas.
2. **Cálculo Financiero:** Verificación de subtotal, IGV (18%) y total.
3. **Conversión:** Validación de unicidad y reglas de transición a Obra.

Para ejecutar los tests:
```bash
npm test
```

---

## 8. 📌 Pendientes para APF2
- Exportación automática a PDF con membrete oficial de LUDIER.
- Envío directo de cotizaciones por correo electrónico vía Resend.
- Sincronización automática con el embudo del módulo de **Oportunidades**.
