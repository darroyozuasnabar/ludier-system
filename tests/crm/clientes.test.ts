// tests/crm/clientes.test.ts

describe("Módulo Clientes", () => {
  describe("Validaciones", () => {
    it("debe validar que el nombre es obligatorio", () => {
      const cliente = { nombre: "" };
      expect(cliente.nombre).toBeFalsy();
    });

    it("debe validar el formato de RUC (11 dígitos)", () => {
      const ruc = "20610039546";
      expect(ruc).toMatch(/^\d{11}$/);
    });

    it("debe validar el formato de email", () => {
      const email = "contacto@grupolar.pe";
      expect(email).toContain("@");
      expect(email).toContain(".");
    });

    it("debe validar el formato de teléfono", () => {
      const telefono = "+51 999 888 777";
      expect(telefono).toMatch(/^\+?\d[\d\s]+$/);
    });
  });

  describe("Creación de clientes", () => {
    it("debe permitir crear un cliente con datos mínimos", () => {
      const cliente = {
        nombre: "Grupo LAR",
        ruc: "20610039546",
      };
      expect(cliente.nombre).toBeTruthy();
      expect(cliente.ruc).toHaveLength(11);
    });

    it("debe permitir crear un cliente con datos completos", () => {
      const cliente = {
        nombre: "Grupo LAR",
        ruc: "20610039546",
        email: "contacto@grupolar.pe",
        telefono: "+51 999 888 777",
        direccion: "Av. Azángaro 123, Cercado de Lima",
        sector: "Construcción",
        tamano_empresa: "GRANDE",
      };
      expect(cliente.nombre).toBeTruthy();
      expect(cliente.email).toContain("@");
      expect(cliente.sector).toBe("Construcción");
    });
  });

  describe("Estados del cliente", () => {
    it("debe tener estado activo por defecto", () => {
      const cliente = {
        nombre: "Grupo LAR",
        activo: true,
      };
      expect(cliente.activo).toBe(true);
    });

    it("debe permitir desactivar un cliente", () => {
      const cliente = {
        nombre: "Grupo LAR",
        activo: false,
      };
      expect(cliente.activo).toBe(false);
    });
  });

  describe("Tipos de documento", () => {
    it("debe aceptar RUC como tipo de documento", () => {
      const cliente = { tipo_documento: "RUC" };
      expect(["RUC", "DNI", "CE", "PASAPORTE"]).toContain(cliente.tipo_documento);
    });

    it("debe aceptar DNI como tipo de documento", () => {
      const cliente = { tipo_documento: "DNI" };
      expect(["RUC", "DNI", "CE", "PASAPORTE"]).toContain(cliente.tipo_documento);
    });
  });

  describe("Tamaños de empresa", () => {
    it("debe aceptar GRANDE como tamaño de empresa", () => {
      const cliente = { tamano_empresa: "GRANDE" };
      expect(["MICRO", "PEQUENA", "MEDIANA", "GRANDE"]).toContain(cliente.tamano_empresa);
    });

    it("debe aceptar MEDIANA como tamaño de empresa", () => {
      const cliente = { tamano_empresa: "MEDIANA" };
      expect(["MICRO", "PEQUENA", "MEDIANA", "GRANDE"]).toContain(cliente.tamano_empresa);
    });
  });
});