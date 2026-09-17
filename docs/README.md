# 🏗️ CRM LUDIER

> Módulo CRM integrado con el ERP de **CONSTRUCCIONES GENERALES LUDIER E.I.R.L.**
> Proyecto desarrollado para el curso **Herramientas de Desarrollo**.

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Módulos](#-módulos)
- [Tecnologías](#-tecnologías)
- [Equipo](#-equipo)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Estrategia de Ramas](#-estrategia-de-ramas)
- [Flujo de Trabajo](#-flujo-de-trabajo)
- [Instalación](#-instalación)
- [Despliegue](#-despliegue)
- [Documentación](#-documentación)
- [Convenciones de Código](#-convenciones-de-código)
- [Contacto](#-contacto)
- [Licencia](#-licencia)

---

## 🎯 Descripción

El **CRM LUDIER** es un módulo de gestión de relaciones con clientes integrado con el ERP de LUDIER. Permite gestionar clientes, contactos, cotizaciones, seguimiento de oportunidades y actividades comerciales en un solo lugar.

Este proyecto es desarrollado como parte del curso **Herramientas de Desarrollo**, aplicando buenas prácticas de Git, trabajo colaborativo y despliegue continuo.

**Importante:** Este no es un proyecto aislado de la universidad. Es una extensión real del sistema de LUDIER que se usará en producción.

---

## 📦 Módulos

El CRM está compuesto por **8 módulos**:

| # | Módulo | Descripción |
|---|--------|-------------|
| 1 | **Clientes** | Registro, datos fiscales, historial |
| 2 | **Contactos** | Personas de contacto por cliente |
| 3 | **Cotizaciones** | Propuestas, presupuestos, conversión |
| 4 | **Seguimiento** | Historial de interacciones con clientes |
| 5 | **Oportunidades** | Pipeline de ventas, etapas, pronóstico |
| 6 | **Actividades** | Tareas, llamadas, reuniones, recordatorios |
| 7 | **Reportes CRM** | Conversión, ventas, rendimiento |
| 8 | **Configuración** | Campos personalizados, etapas, plantillas |

**Marketing NO está incluido** porque es un producto diferente al CRM.

---

## 🛠️ Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Next.js** | 14+ | Framework principal |
| **TypeScript** | 5+ | Tipado estático |
| **Supabase** | - | Base de datos PostgreSQL + Auth |
| **Tailwind CSS** | 3+ | Estilos |
| **NextAuth** | 4+ | Autenticación |
| **Lucide React** | - | Iconos |
| **Vercel** | - | Hosting y despliegue |

---

## 👥 Equipo

| Integrante | Rol | Rama | Módulos APF1 |
|------------|-----|------|--------------|
| **Diego** | Owner | `feature/crm-clientes` | Clientes |
| **Ribau** | Developer | `feature/crm-cotizaciones` | Cotizaciones |
| **Jhon** | Developer | `feature/crm-oportunidades` | Contactos |

---

## 📁 Estructura del Proyecto

```
ludier-system/
├── app/
│   ├── crm/                    # Páginas del CRM
│   │   ├── clientes/           # Módulo Clientes
│   │   ├── contactos/          # Módulo Contactos
│   │   ├── cotizaciones/       # Módulo Cotizaciones
│   │   ├── seguimiento/        # Módulo Seguimiento
│   │   ├── oportunidades/      # Módulo Oportunidades
│   │   ├── actividades/        # Módulo Actividades
│   │   ├── reportes/           # Módulo Reportes
│   │   └── configuracion/      # Módulo Configuración
│   └── api/
│       └── crm/                # Endpoints del CRM
│           ├── clientes/
│           ├── contactos/
│           ├── cotizaciones/
│           ├── seguimiento/
│           ├── oportunidades/
│           ├── actividades/
│           ├── reportes/
│           └── configuracion/
├── docs/
│   └── crm/                    # Documentación del CRM
│       └── README.md           # Este archivo
├── tests/
│   └── crm/                    # Tests del CRM
└── ...
```

---

## 🌳 Estrategia de Ramas

### Ramas principales

| Rama | Propósito | Protegida |
|------|-----------|-----------|
| `main` | Producción LUDIER | ✅ Sí |
| `crm-develop` | Integración del CRM | ❌ No |

### Ramas de desarrollo

| Rama | Responsable | Módulos |
|------|-------------|---------|
| `feature/crm-clientes` | Diego | Clientes |
| `feature/crm-cotizaciones` | Ribau | Cotizaciones |
| `feature/crm-oportunidades` | Jhon | Contactos |
| `feature/crm-testing` | Todos | Testing |

### Ramas auxiliares

| Rama | Propósito |
|------|-----------|
| `release/crm-v*` | Preparación de releases |
| `hotfix/crm-*` | Correcciones urgentes |

---

## 🔄 Flujo de Trabajo

### Para cada integrante:

```bash
# 1. Actualizar rama local
git checkout feature/crm-<área>
git pull origin feature/crm-<área>

# 2. Trabajar en el módulo asignado

# 3. Hacer commits frecuentes
git add .
git commit -m "feat(crm-<área>): descripción"

# 4. Subir cambios
git push origin feature/crm-<área>
```

5. Crear Pull Request en GitHub:
   - Base: `crm-develop`
   - Compare: `feature/crm-<área>`
   - Título claro + descripción

6. Otro integrante revisa el PR.

7. Se aprueba y se mergea a `crm-develop`.

### Para el owner:

1. Revisar PRs de los integrantes.
2. Aprobar y mergear a `crm-develop`.
3. Cuando `crm-develop` esté estable:
   - Crear PR: `crm-develop` → `main`
   - Mergear a `main`
   - Vercel despliega automáticamente

---

## 🚀 Instalación

### Requisitos previos

- Node.js 18+
- npm o yarn
- Git

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/darroyozuasnabar/ludier-system.git
cd ludier-system

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Copiar .env.example a .env.local y completar

# 4. Ejecutar en desarrollo
npm run dev
```

### Variables de entorno necesarias

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

---

## 🌐 Despliegue

| Servicio | URL |
|----------|-----|
| Producción | https://grupoludier.com |
| CRM en producción | https://grupoludier.com/crm/cotizaciones |
| Vercel | https://vercel.com/darroyozuasnabar/ludier-system |
| GitHub | https://github.com/darroyozuasnabar/ludier-system |

El despliegue es automático cada vez que se hace merge a `main`.

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| Planeación | Objetivo, alcance y avances |
| Roles | Distribución de roles y módulos |
| Estrategia de ramas | Flujo de trabajo con Git |

---

## 📝 Convenciones de Código

### Commits

Formato: `tipo(alcance): descripción`

| Tipo | Uso |
|------|-----|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `docs` | Documentación |
| `test` | Tests |
| `chore` | Tareas de mantenimiento |
| `refactor` | Refactorización |

Ejemplos:
- `feat(crm-clientes): crear tabla y modelo`
- `fix(crm-cotizaciones): corregir validación`
- `docs(crm): actualizar README`

### Ramas

Formato: `feature/crm-<área>`

Ejemplos:
- `feature/crm-clientes`
- `feature/crm-cotizaciones`
- `feature/crm-oportunidades`

### Pull Requests

- Título claro y descriptivo
- Descripción de los cambios
- Referencia al issue correspondiente
- Al menos 1 reviewer

---

## 📞 Contacto

| Rol | Nombre | Email |
|-----|--------|-------|
| Owner | Diego | (tu email) |
| Developer | Ribau | (email) |
| Developer | Jhon | (email) |

---

## 📄 Licencia

Este proyecto es propiedad de **CONSTRUCCIONES GENERALES LUDIER E.I.R.L.**
RUC: 20610039546

Desarrollado con ❤️ por el equipo de LUDIER