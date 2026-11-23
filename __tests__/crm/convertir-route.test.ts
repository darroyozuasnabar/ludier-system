import { NextRequest } from "next/server";
import { getActiveToken as getToken } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { POST } from "@/app/api/crm/cotizaciones/[id]/convertir/route";

jest.mock("@/lib/auth-session", () => ({ getActiveToken: jest.fn() }));
jest.mock("@/lib/prisma", () => ({
  prisma: {
    cotizacion: { findUnique: jest.fn() },
    $transaction: jest.fn(),
  },
}));

const token = getToken as jest.Mock;
const findUnique = prisma.cotizacion.findUnique as jest.Mock;
const transaction = prisma.$transaction as jest.Mock;
const tx = {
  cotizacion: { updateMany: jest.fn(), update: jest.fn() },
  project: { create: jest.fn() },
  cotizacionSeguimiento: { create: jest.fn() },
};

const approved = {
  id: "quote-1",
  numero: "COT-001",
  estado: "APROBADA",
  project_id: null,
  cliente: "Constructora de prueba",
  cliente_direccion: "Lima",
  total: 1180,
  notas: null,
  fecha_aprobacion: new Date("2026-11-01T00:00:00Z"),
};

function convert() {
  return POST(
    new NextRequest("http://localhost/api/crm/cotizaciones/quote-1/convertir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectName: "Obra de prueba" }),
    }),
    { params: Promise.resolve({ id: "quote-1" }) }
  );
}

beforeEach(() => {
  jest.resetAllMocks();
  token.mockResolvedValue({ id: "admin-1", role: "ADMIN" });
  findUnique.mockResolvedValue({ ...approved });
  transaction.mockImplementation(async (callback) => callback(tx));
  tx.cotizacion.updateMany.mockResolvedValue({ count: 1 });
  tx.project.create.mockResolvedValue({ id: "project-1", name: "Obra de prueba" });
  tx.cotizacion.update.mockResolvedValue({
    ...approved,
    estado: "CONVERTIDA_A_OBRA",
    project_id: "project-1",
  });
  tx.cotizacionSeguimiento.create.mockResolvedValue({ id: "note-1" });
});

afterEach(() => jest.restoreAllMocks());

describe("Conversion CRM: aprobacion y conversion unica", () => {
  test.each(["BORRADOR", "ENVIADA", "EN_REVISION", "RECHAZADA", "VENCIDA"])(
    "rechaza %s sin crear una obra ni modificar la cotizacion",
    async (estado) => {
      findUnique.mockResolvedValue({ ...approved, estado });
      const response = await convert();

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        error: "Solo se puede convertir una cotización APROBADA",
      });
      expect(transaction).not.toHaveBeenCalled();
      expect(tx.project.create).not.toHaveBeenCalled();
    }
  );

  test.each([
    { estado: "CONVERTIDA_A_OBRA", project_id: "project-1" },
    { estado: "APROBADA", project_id: "project-1" },
    { estado: "CONVERTIDA_A_OBRA", project_id: null },
  ])("rechaza una conversion previa: %j", async (fields) => {
    findUnique.mockResolvedValue({ ...approved, ...fields });
    const response = await convert();

    expect(response.status).toBe(409);
    expect(transaction).not.toHaveBeenCalled();
    expect(tx.project.create).not.toHaveBeenCalled();
  });

  test("convierte una APROBADA y conserva proyecto, vinculo y seguimiento", async () => {
    const response = await convert();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.data.project.id).toBe("project-1");
    expect(json.data.cotizacion.project_id).toBe("project-1");
    expect(tx.cotizacion.updateMany).toHaveBeenCalledWith({
      where: { id: "quote-1", estado: "APROBADA", project_id: null },
      data: { estado: "CONVERTIDA_A_OBRA" },
    });
    expect(tx.cotizacion.updateMany.mock.invocationCallOrder[0]).toBeLessThan(
      tx.project.create.mock.invocationCallOrder[0]
    );
    expect(tx.project.create).toHaveBeenCalledTimes(1);
    expect(tx.cotizacionSeguimiento.create).toHaveBeenCalledTimes(1);
  });

  test("si otra solicitud gana la conversion, devuelve 409 sin crear otra obra", async () => {
    tx.cotizacion.updateMany.mockResolvedValue({ count: 0 });

    const response = await convert();

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ error: "Ya fue convertida" });
    expect(tx.project.create).not.toHaveBeenCalled();
    expect(tx.cotizacion.update).not.toHaveBeenCalled();
    expect(tx.cotizacionSeguimiento.create).not.toHaveBeenCalled();
  });

  test("dos solicitudes concurrentes solo crean una obra si una gana la actualizacion", async () => {
    tx.cotizacion.updateMany
      .mockResolvedValueOnce({ count: 1 })
      .mockResolvedValueOnce({ count: 0 });

    const responses = await Promise.all([convert(), convert()]);

    expect(responses.map((response) => response.status).sort()).toEqual([200, 409]);
    expect(tx.project.create).toHaveBeenCalledTimes(1);
    expect(tx.cotizacionSeguimiento.create).toHaveBeenCalledTimes(1);
  });

  test.each(["project", "quote", "followup"])(
    "propaga el fallo de %s fuera de la transaccion para que Prisma revierta",
    async (stage) => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      const failure = new Error("Database failure");
      const operation = stage === "project" ? tx.project.create
        : stage === "quote" ? tx.cotizacion.update
        : tx.cotizacionSeguimiento.create;
      operation.mockRejectedValueOnce(failure);

      const response = await convert();

      expect(response.status).toBe(500);
      await expect(transaction.mock.results[0].value).rejects.toBe(failure);
    }
  );

  test("mantiene el rechazo de solicitudes sin sesion", async () => {
    token.mockResolvedValue(null);
    expect((await convert()).status).toBe(401);
    expect(findUnique).not.toHaveBeenCalled();
  });

  test("mantiene el rechazo del rol CLIENTE", async () => {
    token.mockResolvedValue({ id: "client-1", role: "CLIENTE" });
    expect((await convert()).status).toBe(403);
    expect(findUnique).not.toHaveBeenCalled();
  });

  test("mantiene el 404 si la cotizacion no existe", async () => {
    findUnique.mockResolvedValue(null);
    expect((await convert()).status).toBe(404);
    expect(transaction).not.toHaveBeenCalled();
  });
});
