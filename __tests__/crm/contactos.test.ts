/**
 * Tests unitarios — Módulo CRM Contactos
 * Autor: Jhon · APF1
 *
 * Cobertura:
 *  1. Validación Zod: contactoSchema (casos válidos e inválidos)
 *  2. Validación Zod: contactoFiltrosSchema
 *  3. Lógica de negocio: estados permitidos
 *  4. Lógica de negocio: nombre completo derivado
 *  5. Sanitización de campos opcionales nulos
 */

import {
  contactoSchema,
  contactoFiltrosSchema,
  ESTADO_CONTACTO,
} from "@/lib/validations/contactos";

// ──────────────────────────────────────────────────────────────
// Datos de prueba reutilizables
// ──────────────────────────────────────────────────────────────
const contactoValido = {
  nombre:       "Juan",
  apellido:     "García",
  cargo:        "Gerente de proyectos",
  empresa:      "Constructora ACME S.A.C.",
  email:        "juan@acme.com",
  telefono:     "+51 999 999 999",
  telefono_alt: null,
  direccion:    "Av. Principal 123, Lima",
  estado:       "ACTIVO" as const,
  notas:        "Contacto clave para licitaciones",
};

// ──────────────────────────────────────────────────────────────
// SUITE 1: contactoSchema — casos válidos
// ──────────────────────────────────────────────────────────────
describe("contactoSchema — casos válidos", () => {
  it("acepta un contacto completo con todos los campos", () => {
    const result = contactoSchema.safeParse(contactoValido);
    expect(result.success).toBe(true);
  });

  it("acepta un contacto solo con campos obligatorios (nombre, apellido)", () => {
    const result = contactoSchema.safeParse({
      nombre:   "Ana",
      apellido: "López",
    });
    expect(result.success).toBe(true);
  });

  it("aplica estado ACTIVO por defecto cuando no se provee", () => {
    const result = contactoSchema.safeParse({
      nombre:   "Carlos",
      apellido: "Ruiz",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.estado).toBe("ACTIVO");
    }
  });

  it("acepta estado PROSPECTO", () => {
    const result = contactoSchema.safeParse({ ...contactoValido, estado: "PROSPECTO" });
    expect(result.success).toBe(true);
  });

  it("acepta estado INACTIVO", () => {
    const result = contactoSchema.safeParse({ ...contactoValido, estado: "INACTIVO" });
    expect(result.success).toBe(true);
  });

  it("acepta email vacío como string vacío (convertido a null)", () => {
    const result = contactoSchema.safeParse({ ...contactoValido, email: "" });
    expect(result.success).toBe(true);
  });

  it("acepta email null", () => {
    const result = contactoSchema.safeParse({ ...contactoValido, email: null });
    expect(result.success).toBe(true);
  });

  it("acepta notas de exactamente 1000 caracteres", () => {
    const result = contactoSchema.safeParse({
      ...contactoValido,
      notas: "x".repeat(1000),
    });
    expect(result.success).toBe(true);
  });
});

// ──────────────────────────────────────────────────────────────
// SUITE 2: contactoSchema — casos inválidos
// ──────────────────────────────────────────────────────────────
describe("contactoSchema — casos inválidos", () => {
  it("rechaza nombre vacío", () => {
    const result = contactoSchema.safeParse({ ...contactoValido, nombre: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const campos = result.error.errors.map((e) => e.path[0]);
      expect(campos).toContain("nombre");
    }
  });

  it("rechaza apellido de 1 carácter (mínimo 2)", () => {
    const result = contactoSchema.safeParse({ ...contactoValido, apellido: "X" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].path[0]).toBe("apellido");
    }
  });

  it("rechaza nombre que supera los 100 caracteres", () => {
    const result = contactoSchema.safeParse({
      ...contactoValido,
      nombre: "A".repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it("rechaza email con formato inválido", () => {
    const result = contactoSchema.safeParse({
      ...contactoValido,
      email: "no-es-un-email",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].path[0]).toBe("email");
    }
  });

  it("rechaza estado fuera del enum permitido", () => {
    const result = contactoSchema.safeParse({
      ...contactoValido,
      estado: "ELIMINADO",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].path[0]).toBe("estado");
    }
  });

  it("rechaza notas que superan los 1000 caracteres", () => {
    const result = contactoSchema.safeParse({
      ...contactoValido,
      notas: "x".repeat(1001),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].path[0]).toBe("notas");
    }
  });

  it("rechaza empresa que supera los 150 caracteres", () => {
    const result = contactoSchema.safeParse({
      ...contactoValido,
      empresa: "E".repeat(151),
    });
    expect(result.success).toBe(false);
  });

  it("rechaza cargo que supera los 100 caracteres", () => {
    const result = contactoSchema.safeParse({
      ...contactoValido,
      cargo: "C".repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it("rechaza objeto vacío (sin nombre ni apellido)", () => {
    const result = contactoSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      const campos = result.error.errors.map((e) => e.path[0]);
      expect(campos).toContain("nombre");
      expect(campos).toContain("apellido");
    }
  });
});

// ──────────────────────────────────────────────────────────────
// SUITE 3: contactoFiltrosSchema
// ──────────────────────────────────────────────────────────────
describe("contactoFiltrosSchema — paginación y filtros", () => {
  it("aplica valores por defecto cuando no se pasan parámetros", () => {
    const result = contactoFiltrosSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe(50);
      expect(result.data.offset).toBe(0);
      expect(result.data.estado).toBe("ALL");
    }
  });

  it("acepta limit y offset personalizados", () => {
    const result = contactoFiltrosSchema.safeParse({ limit: "20", offset: "40" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe(20);
      expect(result.data.offset).toBe(40);
    }
  });

  it("rechaza limit mayor a 200", () => {
    const result = contactoFiltrosSchema.safeParse({ limit: "201" });
    expect(result.success).toBe(false);
  });

  it("rechaza limit menor a 1", () => {
    const result = contactoFiltrosSchema.safeParse({ limit: "0" });
    expect(result.success).toBe(false);
  });

  it("acepta estado ALL", () => {
    const result = contactoFiltrosSchema.safeParse({ estado: "ALL" });
    expect(result.success).toBe(true);
  });

  it("acepta estado ACTIVO", () => {
    const result = contactoFiltrosSchema.safeParse({ estado: "ACTIVO" });
    expect(result.success).toBe(true);
  });

  it("rechaza estado inválido", () => {
    const result = contactoFiltrosSchema.safeParse({ estado: "BORRADOR" });
    expect(result.success).toBe(false);
  });

  it("acepta query de búsqueda libre", () => {
    const result = contactoFiltrosSchema.safeParse({ q: "García" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.q).toBe("García");
    }
  });
});

// ──────────────────────────────────────────────────────────────
// SUITE 4: ESTADO_CONTACTO — constante de dominio
// ──────────────────────────────────────────────────────────────
describe("ESTADO_CONTACTO — constante de dominio", () => {
  it("contiene exactamente 3 estados", () => {
    expect(ESTADO_CONTACTO).toHaveLength(3);
  });

  it("incluye ACTIVO, INACTIVO y PROSPECTO", () => {
    expect(ESTADO_CONTACTO).toContain("ACTIVO");
    expect(ESTADO_CONTACTO).toContain("INACTIVO");
    expect(ESTADO_CONTACTO).toContain("PROSPECTO");
  });

  it("no incluye estado ELIMINADO ni BORRADOR", () => {
    expect(ESTADO_CONTACTO).not.toContain("ELIMINADO");
    expect(ESTADO_CONTACTO).not.toContain("BORRADOR");
  });
});

// ──────────────────────────────────────────────────────────────
// SUITE 5: Lógica de negocio — nombre completo y sanitización
// ──────────────────────────────────────────────────────────────
describe("Lógica de negocio — utilidades de contacto", () => {
  /** Derivar nombre completo desde campos separados */
  const nombreCompleto = (nombre: string, apellido: string) =>
    `${nombre.trim()} ${apellido.trim()}`.trim();

  it("construye nombre completo correctamente", () => {
    expect(nombreCompleto("Juan", "García")).toBe("Juan García");
  });

  it("elimina espacios extra del nombre completo", () => {
    expect(nombreCompleto("  Ana  ", "  López  ")).toBe("Ana López");
  });

  /** Sanitizar campos opcionales — normaliza undefined y "" a null */
  const sanitizarCampoOpcional = (valor: string | null | undefined): string | null => {
    if (valor === undefined || valor === null || valor.trim() === "") return null;
    return valor.trim();
  };

  it("normaliza string vacío a null", () => {
    expect(sanitizarCampoOpcional("")).toBeNull();
  });

  it("normaliza undefined a null", () => {
    expect(sanitizarCampoOpcional(undefined)).toBeNull();
  });

  it("normaliza null a null", () => {
    expect(sanitizarCampoOpcional(null)).toBeNull();
  });

  it("devuelve el valor trimmeado cuando es no vacío", () => {
    expect(sanitizarCampoOpcional("  Lima  ")).toBe("Lima");
  });

  it("preserva valores válidos sin modificar contenido", () => {
    expect(sanitizarCampoOpcional("juan@acme.com")).toBe("juan@acme.com");
  });

  /** Verificar que el schema Zod parsea correctamente un contacto mínimo */
  it("parsea contacto mínimo y devuelve objeto con defaults", () => {
    const result = contactoSchema.parse({ nombre: "Pedro", apellido: "Torres" });
    expect(result.nombre).toBe("Pedro");
    expect(result.apellido).toBe("Torres");
    expect(result.estado).toBe("ACTIVO");
    expect(result.email).toBeUndefined();
  });
});
