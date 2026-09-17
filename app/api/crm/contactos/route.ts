// app/api/crm/contactos/route.ts
// Módulo CRM — Contactos · Autor: Jhon · APF1
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";
import { contactoSchema, contactoFiltrosSchema } from "@/lib/validations/contactos";

// ============================================================
// 🔥 CLIENTE SUPABASE (server-side con cookies de sesión)
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

// ============================================================
// Roles con acceso al CRM
// ============================================================
const CRM_ROLES = ["FUNDADOR", "ADMIN"] as const;

// ============================================================
// 📌 GET — Listar contactos con filtros y paginación
// ============================================================
export async function GET(req: NextRequest) {
  try {
    // 1. Verificar sesión y rol
    const session = await getServerSession(authOptions);
    if (!session || !CRM_ROLES.includes(session.user?.role as any)) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    // 2. Parsear y validar query params
    const { searchParams } = new URL(req.url);
    const filtros = contactoFiltrosSchema.parse({
      q:       searchParams.get("q")       ?? undefined,
      empresa: searchParams.get("empresa") ?? undefined,
      estado:  searchParams.get("estado")  ?? "ALL",
      limit:   searchParams.get("limit")   ?? 50,
      offset:  searchParams.get("offset")  ?? 0,
    });

    const supabase = await createSupabaseClient();

    // 3. Construir query
    let query = supabase
      .from("Contacto")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(filtros.offset, filtros.offset + filtros.limit - 1);

    if (filtros.estado && filtros.estado !== "ALL") {
      query = query.eq("estado", filtros.estado);
    }

    if (filtros.empresa) {
      query = query.ilike("empresa", `%${filtros.empresa}%`);
    }

    // Búsqueda de texto libre: nombre, apellido, email o empresa
    if (filtros.q) {
      query = query.or(
        `nombre.ilike.%${filtros.q}%,apellido.ilike.%${filtros.q}%,email.ilike.%${filtros.q}%,empresa.ilike.%${filtros.q}%`
      );
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data ?? [],
      total: count ?? 0,
      limit: filtros.limit,
      offset: filtros.offset,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Parámetros inválidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("❌ Error en GET /api/crm/contactos:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

// ============================================================
// 📌 POST — Crear un nuevo contacto
// ============================================================
export async function POST(req: NextRequest) {
  try {
    // 1. Verificar sesión y rol
    const session = await getServerSession(authOptions);
    if (!session || !CRM_ROLES.includes(session.user?.role as any)) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    // 2. Rate limiting por IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "anonymous";
    const { success: rateLimitOk } = await rateLimit.limit(ip);
    if (!rateLimitOk) {
      return NextResponse.json(
        { success: false, error: "Demasiadas solicitudes. Intenta en unos segundos." },
        { status: 429 }
      );
    }

    // 3. Validar body con Zod
    const body = await req.json();
    const datos = contactoSchema.parse(body);

    const supabase = await createSupabaseClient();

    // 4. Insertar en Supabase
    const { data, error } = await supabase
      .from("Contacto")
      .insert({
        nombre:       datos.nombre,
        apellido:     datos.apellido,
        cargo:        datos.cargo        ?? null,
        empresa:      datos.empresa      ?? null,
        email:        datos.email        || null,
        telefono:     datos.telefono     ?? null,
        telefono_alt: datos.telefono_alt ?? null,
        direccion:    datos.direccion    ?? null,
        estado:       datos.estado,
        notas:        datos.notas        ?? null,
        creado_por:   session.user?.id   ?? null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      { success: true, data, message: "Contacto creado exitosamente" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("❌ Error en POST /api/crm/contactos:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
