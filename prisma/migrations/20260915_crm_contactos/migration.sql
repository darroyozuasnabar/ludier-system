-- ============================================================
-- Migración: Módulo CRM Contactos
-- Autor: Jhon · APF1
-- Fecha: 2026-09-15
-- Descripción: Tabla de personas de contacto para el CRM LUDIER
-- Convención: sigue el esquema real de la BD (PascalCase sin prefijo,
--             FK a "User"(id), timestamps sin timezone como el resto)
-- ============================================================

-- Tabla principal de contactos CRM
CREATE TABLE IF NOT EXISTS public."Contacto" (
    "id"             TEXT          NOT NULL DEFAULT (gen_random_uuid())::text,
    "nombre"         VARCHAR(100)  NOT NULL,
    "apellido"       VARCHAR(100)  NOT NULL,
    "cargo"          VARCHAR(100),
    "empresa"        VARCHAR(150),
    "email"          VARCHAR(150),
    "telefono"       VARCHAR(20),
    "telefono_alt"   VARCHAR(20),
    "direccion"      VARCHAR(200),
    "estado"         VARCHAR(20)   NOT NULL DEFAULT 'ACTIVO',
    "notas"          TEXT,
    "creado_por"     TEXT,
    "created_at"     TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    "updated_at"     TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),

    CONSTRAINT "Contacto_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Contacto_estado_check"
        CHECK ("estado" IN ('ACTIVO', 'INACTIVO', 'PROSPECTO')),
    CONSTRAINT "Contacto_creado_por_fkey"
        FOREIGN KEY ("creado_por") REFERENCES "User"("id") ON DELETE SET NULL
) TABLESPACE pg_default;

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS "idx_contacto_empresa"    ON public."Contacto" ("empresa");
CREATE INDEX IF NOT EXISTS "idx_contacto_email"      ON public."Contacto" ("email");
CREATE INDEX IF NOT EXISTS "idx_contacto_estado"     ON public."Contacto" ("estado");
CREATE INDEX IF NOT EXISTS "idx_contacto_creado_por" ON public."Contacto" ("creado_por");

-- Trigger para actualizar updated_at automáticamente
-- (mismo patrón que trigger_cotizacion_timestamp en la BD)
CREATE OR REPLACE FUNCTION update_contacto_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS "trigger_contacto_timestamp" ON public."Contacto";
CREATE TRIGGER "trigger_contacto_timestamp"
    BEFORE UPDATE ON public."Contacto"
    FOR EACH ROW EXECUTE FUNCTION update_contacto_timestamp();

-- RLS (Row Level Security) — solo usuarios autenticados de Supabase
ALTER TABLE public."Contacto" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contacto_select" ON public."Contacto";
CREATE POLICY "contacto_select"
    ON public."Contacto" FOR SELECT
    USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "contacto_insert" ON public."Contacto";
CREATE POLICY "contacto_insert"
    ON public."Contacto" FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "contacto_update" ON public."Contacto";
CREATE POLICY "contacto_update"
    ON public."Contacto" FOR UPDATE
    USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "contacto_delete" ON public."Contacto";
CREATE POLICY "contacto_delete"
    ON public."Contacto" FOR DELETE
    USING (auth.role() = 'authenticated');
