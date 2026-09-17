// app/api/crm/clientes/[id]/route.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Obtener un cliente
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !["FUNDADOR", "ADMIN", "FIELD_ENGINEER"].includes(token.role as string)) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("Cliente")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error en GET /api/crm/clientes/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Cliente no encontrado" },
      { status: 404 }
    );
  }
}

// PUT - Actualizar cliente
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !["FUNDADOR", "ADMIN"].includes(token.role as string)) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const {
      nombre, ruc, tipo_documento, numero_documento,
      direccion, telefono, email, sitio_web,
      sector, tamano_empresa, notas
    } = body;

    const { data, error } = await supabaseAdmin
      .from("Cliente")
      .update({
        nombre,
        ruc: ruc || null,
        tipo_documento,
        numero_documento,
        direccion,
        telefono,
        email,
        sitio_web,
        sector,
        tamano_empresa,
        notas,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error en PUT /api/crm/clientes/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar cliente" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar cliente (soft delete)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !["FUNDADOR", "ADMIN"].includes(token.role as string)) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("Cliente")
      .update({ activo: false, updated_at: new Date().toISOString() })
      .eq("id", params.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error en DELETE /api/crm/clientes/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Error al eliminar cliente" },
      { status: 500 }
    );
  }
}