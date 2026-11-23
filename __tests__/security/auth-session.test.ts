import NextAuth, { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { encode } from "next-auth/jwt";
import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { decodeActiveJwt, getActiveToken } from "@/lib/auth-session";
import { authOptions } from "@/lib/auth";
import { proxy } from "@/proxy";
import { GET as listQuotes } from "@/app/api/crm/cotizaciones/route";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: jest.fn() },
    cotizacion: { findMany: jest.fn(), count: jest.fn() },
  },
}));
jest.mock("@supabase/supabase-js", () => ({ createClient: jest.fn(() => ({})) }));
jest.mock("@/lib/rate-limit", () => ({ loginRateLimit: { limit: jest.fn() } }));
jest.mock("next/headers", () => ({ cookies: jest.fn(), headers: jest.fn() }));

const SECRET = "security-tests-only-secret-with-more-than-32-characters";
const userLookup = prisma.user.findUnique as jest.Mock;
const originalSecret = process.env.NEXTAUTH_SECRET;
const originalUrl = process.env.NEXTAUTH_URL;

beforeAll(() => {
  process.env.NEXTAUTH_SECRET = SECRET;
  process.env.NEXTAUTH_URL = "http://localhost:3000";
});
afterAll(() => {
  if (originalSecret === undefined) delete process.env.NEXTAUTH_SECRET;
  else process.env.NEXTAUTH_SECRET = originalSecret;
  if (originalUrl === undefined) delete process.env.NEXTAUTH_URL;
  else process.env.NEXTAUTH_URL = originalUrl;
});
beforeEach(() => {
  jest.clearAllMocks();
  userLookup.mockReset().mockResolvedValue({ active: true });
  (headers as jest.Mock).mockResolvedValue(new Headers());
  (cookies as jest.Mock).mockResolvedValue({ getAll: () => [] });
});
afterEach(() => jest.restoreAllMocks());

async function signedToken(id = "user-1") {
  return encode({ token: { id, sub: id, role: "ADMIN", name: "Prueba" }, secret: SECRET });
}
function request(token: string, path = "/api/crm/cotizaciones") {
  return new NextRequest(`http://localhost:3000${path}`, {
    headers: { cookie: `next-auth.session-token=${token}` },
  });
}
function sessionOptions() {
  return {
    ...authOptions,
    secret: SECRET,
    debug: false,
    useSecureCookies: false,
    logger: { error: jest.fn(), warn: jest.fn(), debug: jest.fn() },
  };
}

test("conserva un JWT valido de un usuario activo", async () => {
  const result = await decodeActiveJwt({ token: await signedToken(), secret: SECRET });
  expect(result?.id).toBe("user-1");
  expect(userLookup).toHaveBeenCalledWith({ where: { id: "user-1" }, select: { active: true } });
});

test.each([{ active: false }, { active: null }, null])(
  "rechaza el JWT si el usuario no esta activo: %j",
  async (user) => {
    userLookup.mockResolvedValue(user);
    expect(await getActiveToken({ req: request(await signedToken()), secret: SECRET })).toBeNull();
  }
);

test("consulta de nuevo y rechaza el mismo JWT inmediatamente tras desactivar", async () => {
  const token = await signedToken();
  expect(await getActiveToken({ req: request(token), secret: SECRET })).not.toBeNull();
  userLookup.mockResolvedValue({ active: false });
  expect(await getActiveToken({ req: request(token), secret: SECRET })).toBeNull();
  expect(userLookup).toHaveBeenCalledTimes(2);
});

test("acepta sub como identificador de sesiones anteriores", async () => {
  const token = await encode({ token: { sub: "legacy-user" }, secret: SECRET });
  expect(await getActiveToken({ req: request(token), secret: SECRET })).not.toBeNull();
  expect(userLookup).toHaveBeenCalledWith({ where: { id: "legacy-user" }, select: { active: true } });
});

test("no consulta BD para solicitudes sin token o con firma invalida", async () => {
  expect(await getActiveToken({ req: request(""), secret: SECRET })).toBeNull();
  expect(await getActiveToken({ req: request("invalid"), secret: SECRET })).toBeNull();
  expect(userLookup).not.toHaveBeenCalled();
});

test("deniega si la BD falla y no registra el detalle sensible", async () => {
  const log = jest.spyOn(console, "error").mockImplementation(() => {});
  userLookup.mockRejectedValue(new Error("private connection details"));
  expect(await getActiveToken({ req: request(await signedToken()), secret: SECRET })).toBeNull();
  expect(log).toHaveBeenCalledWith("No se pudo verificar el estado activo de la sesión.");
});

test("getServerSession revalida active usando las opciones reales de NextAuth", async () => {
  const token = await signedToken();
  (cookies as jest.Mock).mockResolvedValue({ getAll: () => [{ name: "next-auth.session-token", value: token }] });
  expect((await getServerSession(sessionOptions()))?.user.id).toBe("user-1");
  userLookup.mockResolvedValue({ active: false });
  expect(await getServerSession(sessionOptions())).toBeNull();
});

test("la ruta de sesion de NextAuth elimina la cookie del JWT rechazado", async () => {
  userLookup.mockResolvedValue({ active: false });
  const token = await signedToken();
  (cookies as jest.Mock).mockResolvedValue({ getAll: () => [{ name: "next-auth.session-token", value: token }] });
  const handler = NextAuth(sessionOptions());
  const response = await handler(request(token, "/api/auth/session"), {
    params: Promise.resolve({ nextauth: ["session"] }),
  });
  expect(await response.json()).toEqual({});
  expect(response.headers.get("set-cookie")).toContain("next-auth.session-token=;");
  expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
});

test("el handler CRM rechaza un JWT real inactivo antes de consultar cotizaciones", async () => {
  userLookup.mockResolvedValue({ active: false });
  expect((await listQuotes(request(await signedToken()))).status).toBe(401);
  expect(prisma.cotizacion.findMany).not.toHaveBeenCalled();
});

test("la validacion activa tambien se aplica a Authorization Bearer", async () => {
  userLookup.mockResolvedValue({ active: false });
  const req = new NextRequest("http://localhost:3000/api/crm/cotizaciones", {
    headers: { authorization: `Bearer ${await signedToken()}` },
  });
  expect(await getActiveToken({ req, secret: SECRET })).toBeNull();
  expect(userLookup).toHaveBeenCalledTimes(1);
});

test("Proxy redirige y elimina las cookies de sesion y sus fragmentos", async () => {
  userLookup.mockResolvedValue({ active: false });
  const token = await signedToken();
  const split = Math.floor(token.length / 2);
  const req = new NextRequest("http://localhost:3000/erp/dashboard", {
    headers: { cookie: `next-auth.session-token.0=${token.slice(0, split)}; next-auth.session-token.1=${token.slice(split)}; __Secure-next-auth.session-token.1=fragment; unrelated=keep` },
  });
  const response = await proxy(req);
  expect(response.status).toBe(303);
  expect(new URL(response.headers.get("location")!).pathname).toBe("/login");
  expect(userLookup).toHaveBeenCalledTimes(1);
  expect(response.cookies.get("next-auth.session-token.0")?.maxAge).toBe(0);
  expect(response.cookies.get("next-auth.session-token.1")?.maxAge).toBe(0);
  expect(response.cookies.get("__Secure-next-auth.session-token.1")?.secure).toBe(true);
  expect(response.cookies.get("unrelated")).toBeUndefined();
});

test("Proxy elimina la cookie simple del usuario inactivo", async () => {
  userLookup.mockResolvedValue({ active: false });
  const response = await proxy(request(await signedToken(), "/erp/dashboard"));
  expect(response.status).toBe(303);
  expect(response.cookies.get("next-auth.session-token")?.maxAge).toBe(0);
});

test("Proxy conserva el acceso y las cookies del usuario activo", async () => {
  const response = await proxy(request(await signedToken(), "/erp/dashboard"));
  expect(response.status).toBe(200);
  expect(response.cookies.getAll()).toEqual([]);
  expect(userLookup).toHaveBeenCalledTimes(1);
});

test("las paginas publicas siguen disponibles sin consultar User", async () => {
  expect((await proxy(new NextRequest("http://localhost:3000/servicios"))).status).toBe(200);
  expect(userLookup).not.toHaveBeenCalled();
});
