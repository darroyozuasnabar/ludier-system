import { getServerSession } from "next-auth";
import { POST } from "@/app/api/erp/documentos/[id]/versiones/route";

jest.mock("next-auth", () => ({ getServerSession: jest.fn() }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));

const session = getServerSession as jest.Mock;
beforeEach(() => jest.resetAllMocks());
afterEach(() => jest.restoreAllMocks());

test("sin sesion no se permite el POST de versiones", async () => {
  session.mockResolvedValue(null);
  expect((await POST()).status).toBe(401);
});

test.each(["FIELD_ENGINEER", "CLIENTE", "PRODUCTION", "VIEWER"])(
  "%s conserva la denegacion de versiones", async (role) => {
    session.mockResolvedValue({ user: { role } });
    expect((await POST()).status).toBe(403);
  }
);

test.each(["ADMIN", "FUNDADOR"])("%s recibe 501 y nunca llama al proveedor fiscal", async (role) => {
  session.mockResolvedValue({ user: { role } });
  const fetch = jest.spyOn(globalThis, "fetch");
  const response = await POST();
  expect(response.status).toBe(501);
  expect((await response.json()).success).toBe(false);
  expect(fetch).not.toHaveBeenCalled();
});
