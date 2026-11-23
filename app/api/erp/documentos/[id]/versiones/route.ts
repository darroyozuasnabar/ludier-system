import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// FIX SEGURIDAD F2: este contrato no debe emitir facturas ni modificar Valorizacion.
// TODO: implementar versionado documental con un modelo y permisos propios.
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!["FUNDADOR", "ADMIN"].includes(session.user?.role ?? "")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  return NextResponse.json(
    { success: false, error: "El versionado de documentos no está implementado." },
    { status: 501 }
  );
}
