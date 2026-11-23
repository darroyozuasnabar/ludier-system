import {
  decode,
  getToken,
  type GetTokenParams,
  type JWT,
  type JWTDecodeParams,
} from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

// FIX SEGURIDAD F2: validar active en cada lectura autenticada, sin cachear permisos.
export async function decodeActiveJwt(params: JWTDecodeParams): Promise<JWT | null> {
  const token = await decode(params);
  if (!token) return null;

  const userId = typeof token.id === "string" ? token.id : token.sub;
  if (!userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { active: true },
    });
    return user?.active === true ? token : null;
  } catch {
    // Denegar si no se puede verificar el estado; no publicar datos de la conexión.
    console.error("No se pudo verificar el estado activo de la sesión.");
    return null;
  }
}

// FIX SEGURIDAD F2: getToken no ejecuta callbacks de NextAuth; compartir su decoder.
export function getActiveToken(params: GetTokenParams<false>): Promise<JWT | null> {
  return getToken({ ...params, decode: decodeActiveJwt });
}
