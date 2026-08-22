// app/api/cliente/fotos/route.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "CLIENTE") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = token.id as string;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const categoria = searchParams.get("categoria") || null;

    // Obtener proyecto del cliente
    const { data: project, error: projectError } = await supabaseAdmin
      .from("Project")
      .select("id")
      .eq("cliente_user_id", userId)
      .maybeSingle();

    if (projectError || !project) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    }

    // Construir query
    let query = supabaseAdmin
      .from("Foto")
      .select("id, nombre, descripcion, categoria, url, tamanio, extension, fecha_subida, fecha_tomada, ubicacion", { count: "exact" })
      .eq("proyecto_id", project.id)
      .eq("activo", true)  // ← 🔥 FILTRO CLAVE
      .order("fecha_subida", { ascending: false });

    // Filtrar por categoría si se especifica
    if (categoria && categoria !== "TODAS") {
      query = query.eq("categoria", categoria);
    }

    // Paginación
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: fotos, error: fotosError, count } = await query;

    if (fotosError) {
      console.error("Error al obtener fotos:", fotosError);
      return NextResponse.json({ error: fotosError.message }, { status: 500 });
    }

    // Obtener álbumes del proyecto
    const { data: albumes, error: albumesError } = await supabaseAdmin
      .from("Album")
      .select("id, nombre, descripcion, portada_id")
      .eq("proyecto_id", project.id)
      .order("created_at", { ascending: true });

    return NextResponse.json({
      fotos: fotos || [],
      albumes: albumes || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Error en /api/cliente/fotos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}