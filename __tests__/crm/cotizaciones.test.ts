// __tests__/crm/cotizaciones.test.ts
// Pruebas unitarias para el módulo de Cotizaciones del CRM LUDIER

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { cotizacionSchema, calcularTotales } from "../../lib/validations/cotizacion";

describe("Módulo Cotizaciones - CRM LUDIER", () => {
  // ─── 1. Pruebas de Cálculo Financiero ───────────────────────────
  describe("Cálculo de Totales Financieros", () => {
    test("Debe calcular correctamente Subtotal, IGV (18%) y Total sin descuentos", () => {
      const items = [
        { cantidad: 10, precio_unitario: 100, descuento: 0 },
        { cantidad: 5, precio_unitario: 200, descuento: 0 },
      ];

      const resultado = calcularTotales(items, 0.18);

      assert.equal(resultado.subtotal, 2000);
      assert.equal(resultado.igv, 360);
      assert.equal(resultado.total, 2360);
    });

    test("Debe descontar adecuadamente los montos promocionales", () => {
      const items = [
        { cantidad: 2, precio_unitario: 500, descuento: 100 }, // 900
        { cantidad: 1, precio_unitario: 100, descuento: 0 },   // 100
      ];

      const resultado = calcularTotales(items, 0.18);

      assert.equal(resultado.subtotal, 1000);
      assert.equal(resultado.igv, 180);
      assert.equal(resultado.total, 1180);
    });

    test("Debe manejar redondeos a 2 decimales para moneda nacional PEN", () => {
      const items = [
        { cantidad: 3, precio_unitario: 33.33, descuento: 0 }, // 99.99
      ];

      const resultado = calcularTotales(items, 0.18);

      assert.equal(resultado.subtotal, 99.99);
      assert.equal(resultado.igv, 18.00);
      assert.equal(resultado.total, 117.99);
    });
  });

  // ─── 2. Pruebas del Esquema Zod ────────────────────────────────
  describe("Validación de Datos con Zod (cotizacionSchema)", () => {
    test("Debe validar exitosamente una cotización con datos correctos", () => {
      const cotizacionValida = {
        cliente: "Constructora e Inmobiliaria Los Sauces S.A.C.",
        cliente_ruc: "20512345678",
        cliente_contacto: "Ing. Marco Aurelio",
        cliente_telefono: "+51 999888777",
        cliente_email: "maurelio@sauces.pe",
        fecha_emision: "2026-09-15",
        fecha_validez: "2026-09-30",
        moneda: "PEN",
        items: [
          {
            descripcion: "Fabricación de barandas de acero galvanizado",
            cantidad: 25.5,
            unidad: "ML",
            precio_unitario: 180,
            descuento: 0,
          },
        ],
      };

      const parsed = cotizacionSchema.safeParse(cotizacionValida);
      assert.equal(parsed.success, true);
    });

    test("Debe rechazar una cotización sin nombre de cliente", () => {
      const cotizacionInvalida = {
        cliente: "",
        fecha_emision: "2026-09-15",
        items: [
          {
            descripcion: "Estructura metálica",
            cantidad: 1,
            unidad: "UND",
            precio_unitario: 500,
          },
        ],
      };

      const parsed = cotizacionSchema.safeParse(cotizacionInvalida);
      assert.equal(parsed.success, false);
      if (!parsed.success) {
        const errorCliente = parsed.error.issues.find((i) => i.path.includes("cliente"));
        assert.ok(errorCliente, "Debe existir un error en el campo cliente");
      }
    });

    test("Debe rechazar una cotización con lista de ítems vacía", () => {
      const cotizacionSinItems = {
        cliente: "Empresa Minera del Sur",
        fecha_emision: "2026-09-15",
        items: [],
      };

      const parsed = cotizacionSchema.safeParse(cotizacionSinItems);
      assert.equal(parsed.success, false);
      if (!parsed.success) {
        const errorItems = parsed.error.issues.find((i) => i.path.includes("items"));
        assert.ok(errorItems, "Debe existir un error requiriendo al menos 1 ítem");
      }
    });

    test("Debe rechazar un ítem con cantidad negativa o cero", () => {
      const cotizacionCantidadInvalida = {
        cliente: "Constructora Vial S.A.",
        fecha_emision: "2026-09-15",
        items: [
          {
            descripcion: "Vigas de fierro",
            cantidad: -5,
            unidad: "UND",
            precio_unitario: 100,
          },
        ],
      };

      const parsed = cotizacionSchema.safeParse(cotizacionCantidadInvalida);
      assert.equal(parsed.success, false);
    });
  });

  // ─── 3. Pruebas de Estados y Conversión ─────────────────────────
  describe("Flujo de Estados y Conversión Comercial", () => {
    test("El estado por defecto debe ser BORRADOR", () => {
      const cotizacionDefault = {
        cliente: "Retail del Perú S.A.",
        fecha_emision: "2026-09-15",
        items: [
          {
            descripcion: "Escalera de gato de seguridad",
            cantidad: 1,
            unidad: "UND",
            precio_unitario: 1200,
          },
        ],
      };

      const parsed = cotizacionSchema.parse(cotizacionDefault);
      assert.equal(parsed.estado, "BORRADOR");
    });
  });
});
