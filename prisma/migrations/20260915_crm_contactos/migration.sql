-- ============================================================
-- Migración: Módulo CRM Contactos
-- Autor: Jhon
-- Fecha: 2026-09-15
-- Descripción: Tabla de contactos por cliente para el CRM LUDIER
-- ============================================================

-- Tabla principal de contactos CRM
CREATE TABLE IF NOT EXISTS "CrmContacto" (
    "id"             TEXT        NOT NULL DEFAULT (gen_random_uuid())::text,
    "nombre"         VARCHAR(100) NOT NULL,
    "apellido"       VARCHAR(100) NOT NULL,
    "cargo"          VARCHAR(100),
    "empresa"        VARCHAR(150),
    "email"          VARCHAR(150),
    "telefono"       VARCHAR(20),
    "telefono_alt"   VARCHAR(20),
    "direccion"      VARCHAR(200),
    "estado"         VARCHAR(20)  NOT NULL DEFAULT 'ACTIVO',
    "notas"          TEXT,
    "creado_por"     TEXT,
    "created_at"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT "CrmContacto_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "CrmContacto_estado_check"
        CHECK ("estado" IN ('ACTIVO', 'INACTIVO', 'PROSPECTO'))
);

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS "CrmContacto_empresa_idx"  ON "CrmContacto" ("empresa");
CREATE INDEX IF NOT EXISTS "CrmContacto_email_idx"    ON "CrmContacto" ("email");
CREATE INDEX IF NOT EXISTS "CrmContacto_estado_idx"   ON "CrmContacto" ("estado");
CREATE INDEX IF NOT EXISTS "CrmContacto_creado_por_idx" ON "CrmContacto" ("creado_por");

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION crm_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS "CrmContacto_updated_at" ON "CrmContacto";
CREATE TRIGGER "CrmContacto_updated_at"
    BEFORE UPDATE ON "CrmContacto"
    FOR EACH ROW EXECUTE FUNCTION crm_set_updated_at();

-- RLS (Row Level Security) — solo usuarios autenticados pueden operar
ALTER TABLE "CrmContacto" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crm_contacto_select" ON "CrmContacto";
CREATE POLICY "crm_contacto_select"
    ON "CrmContacto" FOR SELECT
    USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "crm_contacto_insert" ON "CrmContacto";
CREATE POLICY "crm_contacto_insert"
    ON "CrmContacto" FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "crm_contacto_update" ON "CrmContacto";
CREATE POLICY "crm_contacto_update"
    ON "CrmContacto" FOR UPDATE
    USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "crm_contacto_delete" ON "CrmContacto";
CREATE POLICY "crm_contacto_delete"
    ON "CrmContacto" FOR DELETE
    USING (auth.role() = 'authenticated');
