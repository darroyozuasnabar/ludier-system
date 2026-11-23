import { NextRequest } from "next/server";
import { getActiveToken } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { GET, POST } from "@/app/api/crm/cotizaciones/route";
import { GET as detail, PUT, DELETE } from "@/app/api/crm/cotizaciones/[id]/route";
import { POST as convert } from "@/app/api/crm/cotizaciones/[id]/convertir/route";

jest.mock("@/lib/auth-session", () => ({ getActiveToken: jest.fn() }));
jest.mock("@/lib/prisma", () => ({
  prisma: {
    cotizacion: { findMany: jest.fn(), count: jest.fn(), findUnique: jest.fn(), delete: jest.fn() },
    $transaction: jest.fn(),
  },
}));

const auth = getActiveToken as jest.Mock;
function request(method = "GET") {
  return new NextRequest("http://localhost/api/crm/cotizaciones/quote-1", { method });
}
const params = () => ({ params: Promise.resolve({ id: "quote-1" }) });

beforeEach(() => {
  jest.resetAllMocks();
  auth.mockResolvedValue({ id: "engineer-1", role: "FIELD_ENGINEER" });
});

test("FIELD_ENGINEER recibe una lista vacia con estadisticas cero sin leer datos globales", async () => {
  const response = await GET(request());
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({
    data: [],
    estadisticas: { total: 0, montoTotalPEN: 0, montoTotalUSD: 0, aprobadas: 0, convertidas: 0 },
    total: 0,
  });
  expect(prisma.cotizacion.findMany).not.toHaveBeenCalled();
  expect(prisma.cotizacion.count).not.toHaveBeenCalled();
});

test.each(["detail", "convert", "create", "update", "delete"])(
  "sin asignacion verificable se deniega %s antes de acceder a cotizaciones",
  async (action) => {
    const response = action === "detail" ? await detail(request(), params())
      : action === "convert" ? await convert(request("POST"), params())
      : action === "create" ? await POST(request("POST"))
      : action === "update" ? await PUT(request("PUT"), params())
      : await DELETE(request("DELETE"), params());
    expect(response.status).toBe(403);
    expect(prisma.cotizacion.findUnique).not.toHaveBeenCalled();
    expect(prisma.cotizacion.count).not.toHaveBeenCalled();
    expect(prisma.cotizacion.delete).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  }
);

test.each(["ADMIN", "FUNDADOR"])("%s conserva el listado y detalle", async (role) => {
  auth.mockResolvedValue({ id: "manager-1", role });
  (prisma.cotizacion.findMany as jest.Mock).mockResolvedValue([]);
  (prisma.cotizacion.count as jest.Mock).mockResolvedValue(0);
  (prisma.cotizacion.findUnique as jest.Mock).mockResolvedValue({ id: "quote-1" });
  expect((await GET(request())).status).toBe(200);
  expect((await detail(request(), params())).status).toBe(200);
  expect(prisma.cotizacion.findMany).toHaveBeenCalledTimes(1);
  expect(prisma.cotizacion.findUnique).toHaveBeenCalledTimes(1);
});

test("sin sesion se conserva 401", async () => {
  auth.mockResolvedValue(null);
  expect((await GET(request())).status).toBe(401);
  expect((await detail(request(), params())).status).toBe(401);
});

test("CLIENTE no accede al listado ni al detalle", async () => {
  auth.mockResolvedValue({ id: "client-1", role: "CLIENTE" });
  expect((await GET(request())).status).toBe(403);
  expect((await detail(request(), params())).status).toBe(403);
});
