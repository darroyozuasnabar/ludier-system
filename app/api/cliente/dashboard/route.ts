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
    // 1. Validar token y rol CLIENTE
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "CLIENTE") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = token.id as string;

    // 2. Obtener el proyecto asociado al cliente
    const { data: project, error: projectError } = await supabaseAdmin
      .from("Project")
      .select("id, name, client, location, startDate, expectedEndDate, status")
      .eq("cliente_user_id", userId)
      .maybeSingle();

    if (projectError || !project) {
      console.error("Error al obtener proyecto:", projectError);
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    }

    // 3. Obtener la última valorización para el avance
    const { data: valorizaciones, error: valError } = await supabaseAdmin
      .from("Valorizacion")
      .select("avancePct, fechaEmision, status, period, totalFactura, netoCobrar")
      .eq("projectId", project.id)
      .order("fechaEmision", { ascending: false })
      .limit(1);

    const ultimaValorizacion = valorizaciones?.[0] || null;
    const avance = ultimaValorizacion?.avancePct || 0;

    // 4. Obtener hitos del proyecto
    const { data: hitos, error: hitosError } = await supabaseAdmin
      .from("Hito")
      .select("id, title, description, fecha, badge, badge_color, acento, orden")
      .eq("project_id", project.id)
      .order("orden", { ascending: true });

    // 5. Obtener fotos recientes (últimas 6)
    const { data: fotos, error: fotosError } = await supabaseAdmin
      .from("Foto")
      .select("id, nombre, url, categoria, fecha_subida")
      .eq("proyecto_id", project.id)
      .order("fecha_subida", { ascending: false })
      .limit(6);

    // 6. Obtener todas las valorizaciones para el resumen
    const { data: todasValorizaciones, error: todasValError } = await supabaseAdmin
      .from("Valorizacion")
      .select("id, period, status, fechaEmision, fechaCobro, avancePct, totalFactura")
      .eq("projectId", project.id)
      .order("fechaEmision", { ascending: true });

    // 7. Obtener hitos con fechas planificadas (de la tabla Hito ya tiene fecha)
    // Podemos usarlos directamente como cronograma, añadiendo un porcentaje de avance hipotético
    // o podemos usar las valorizaciones para calcular un avance por período.

    // Construir respuesta
    return NextResponse.json({
      project: {
        ...project,
        avance,
        ultimaValorizacion,
      },
      hitos: hitos || [],
      fotos: fotos || [],
      valorizaciones: todasValorizaciones || [],
      // Para el cronograma, podemos usar los hitos y agregar un porcentaje simulado
      // o mejor, crear una tabla "Cronograma" pero por ahora usamos hitos con fechas
      cronograma: hitos?.map(h => ({
        ...h,
        porcentaje: 0, // Lo puedes calcular según la lógica de negocio
      })) || [],
    });
  } catch (error) {
    console.error("Error en /api/cliente/dashboard:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}