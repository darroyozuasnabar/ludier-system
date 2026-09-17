// app/api/crm/contactos/[id]/route.ts
// Módulo CRM — Contactos · Autor: Jhon · APF1
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { contactoSchema } from "@/lib/validations/contactos";

// ============================================================
// 🔥 CLIENTE SUPABASE
// ============================================================
const createSupabaseClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, options) => cookieStore.set(name, value, options),
        remove: (name, options) => cookieStore.set(name, "", { ...options, maxAge: 0 }),
      },
    }
  );
};

// Nombre de tabla — consistente con la convención del esquema real (PascalCase)
const TABLA = "Contacto" as const;

const CRM_ROLES = ["FUNDADOR", "ADMIN"] as const;

// ============================================================
// 📌 GET — Obtener un contacto por ID
// ============================================================
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !CRM_ROLES.includes(session.user?.role as any)) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
      .from(TABLA)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ success: false, error: "Contacto no encontrado" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("❌ Error en GET /api/crm/contactos/[id]:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

// ============================================================
// 📌 PUT — Actualizar un contacto existente
// ============================================================
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !CRM_ROLES.includes(session.user?.role as any)) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Validar body con Zod (schema parcial para actualización)
    const body = await req.json();
    const datos = contactoSchema.partial().parse(body);

    const supabase = await createSupabaseClient();

    // Verificar que el contacto exista antes de actualizar
    const { data: existente, error: errExiste } = await supabase
      .from(TABLA)
      .select("id")
      .eq("id", id)
      .single();

    if (errExiste || !existente) {
      return NextResponse.json({ success: false, error: "Contacto no encontrado" }, { status: 404 });
    }

    // Construir objeto de actualización (solo campos provistos)
    const actualizacion: Record<string, unknown> = {};
    if (datos.nombre       !== undefined) actualizacion.nombre       = datos.nombre;
    if (datos.apellido     !== undefined) actualizacion.apellido     = datos.apellido;
    if (datos.cargo        !== undefined) actualizacion.cargo        = datos.cargo ?? null;
    if (datos.empresa      !== undefined) actualizacion.empresa      = datos.empresa ?? null;
    if (datos.email        !== undefined) actualizacion.email        = datos.email || null;
    if (datos.telefono     !== undefined) actualizacion.telefono     = datos.telefono ?? null;
    if (datos.telefono_alt !== undefined) actualizacion.telefono_alt = datos.telefono_alt ?? null;
    if (datos.direccion    !== undefined) actualizacion.direccion    = datos.direccion ?? null;
    if (datos.estado       !== undefined) actualizacion.estado       = datos.estado;
    if (datos.notas        !== undefined) actualizacion.notas        = datos.notas ?? null;

    const { data, error } = await supabase
      .from(TABLA)
      .update(actualizacion)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data, message: "Contacto actualizado exitosamente" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("❌ Error en PUT /api/crm/contactos/[id]:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

// ============================================================
// 📌 DELETE — Eliminar un contacto
// ============================================================
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Solo FUNDADOR puede eliminar contactos
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "FUNDADOR") {
      return NextResponse.json(
        { success: false, error: "Solo el FUNDADOR puede eliminar contactos" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const supabase = await createSupabaseClient();

    // Verificar existencia antes de eliminar
    const { data: existente, error: errExiste } = await supabase
      .from(TABLA)
      .select("id, nombre, apellido")
      .eq("id", id)
      .single();

    if (errExiste || !existente) {
      return NextResponse.json({ success: false, error: "Contacto no encontrado" }, { status: 404 });
    }

    const { error } = await supabase.from(TABLA).delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `Contacto ${existente.nombre} ${existente.apellido} eliminado exitosamente`,
    });
  } catch (error) {
    console.error("❌ Error en DELETE /api/crm/contactos/[id]:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
