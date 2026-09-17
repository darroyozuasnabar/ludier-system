// app/api/crm/clientes/route.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Listar clientes
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !["FUNDADOR", "ADMIN", "FIELD_ENGINEER"].includes(token.role as string)) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    let query = supabaseAdmin
      .from("Cliente")
      .select("*")
      .order("nombre", { ascending: true });

    if (search) {
      query = query.or(`nombre.ilike.%${search}%,ruc.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error en GET /api/crm/clientes:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener clientes" },
      { status: 500 }
    );
  }
}

// POST - Crear cliente
export async function POST(req: NextRequest) {
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

    if (!nombre) {
      return NextResponse.json(
        { success: false, error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("Cliente")
      .insert({
        nombre,
        ruc: ruc || null,
        tipo_documento: tipo_documento || "RUC",
        numero_documento: numero_documento || null,
        direccion: direccion || null,
        telefono: telefono || null,
        email: email || null,
        sitio_web: sitio_web || null,
        sector: sector || null,
        tamano_empresa: tamano_empresa || null,
        notas: notas || null,
        creado_por: token.id,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error en POST /api/crm/clientes:", error);
    return NextResponse.json(
      { success: false, error: "Error al crear cliente" },
      { status: 500 }
    );
  }
}