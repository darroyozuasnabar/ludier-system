// app/api/cliente/dashboard/route.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Función auxiliar para formatear fechas (opcional)
function formatDate(date: string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export async function GET(req: NextRequest) {
  try {
    // 1. Validar token y rol CLIENTE
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "CLIENTE") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = token.id as string;

    // 2. Obtener el proyecto del cliente
    const { data: project, error: projectError } = await supabaseAdmin
      .from("Project")
      .select("id, name, client, location, startDate, expectedEndDate, status, valorization")
      .eq("cliente_user_id", userId)
      .maybeSingle();

    if (projectError || !project) {
      console.error("Error al obtener proyecto:", projectError);
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    }

    // 3. Obtener todas las valorizaciones del proyecto
    const { data: todasVal, error: valError } = await supabaseAdmin
      .from("Valorizacion")
      .select("id, period, status, fechaEmision, fechaCobro, totalFactura, avancePct")
      .eq("projectId", project.id)
      .order("fechaEmision", { ascending: true });

    if (valError) {
      console.error("Error al obtener valorizaciones:", valError);
    }

    // 4. Calcular total cobrado (suma de valorizaciones COBRADA)
    const totalCobrado = todasVal
      ?.filter(v => v.status === "COBRADA")
      .reduce((sum, v) => sum + (v.totalFactura || 0), 0) || 0;

    // 5. Obtener suma de todos los contratos del proyecto
    const { data: contratos, error: contratosError } = await supabaseAdmin
      .from("Contrato")
      .select("monto")
      .eq("project_id", project.id);

    if (contratosError) {
      console.error("Error al obtener contratos:", contratosError);
    }

    const totalContratos = contratos?.reduce((sum, c) => sum + (c.monto || 0), 0) || 0;
    const montoTotal = totalContratos > 0 ? totalContratos : project.valorization;

    // 6. Calcular avance real (porcentaje)
    const avance = montoTotal > 0 ? (totalCobrado / montoTotal) * 100 : 0;

    // 7. Última valorización (para mostrar en la tarjeta)
    const ultimaVal = todasVal?.[todasVal.length - 1] || null;

    // 8. Obtener hitos con porcentaje
    const { data: hitos, error: hitosError } = await supabaseAdmin
      .from("Hito")
      .select("id, title, description, fecha, badge, badge_color, acento, orden, porcentaje")
      .eq("project_id", project.id)
      .order("orden", { ascending: true });

    if (hitosError) {
      console.error("Error al obtener hitos:", hitosError);
    }

    // 9. Obtener fotos recientes (últimas 8)
    const { data: fotos, error: fotosError } = await supabaseAdmin
      .from("Foto")
      .select("id, nombre, url, categoria, fecha_subida")
      .eq("proyecto_id", project.id)
      .order("fecha_subida", { ascending: false })
      .limit(8);

    if (fotosError) {
      console.error("Error al obtener fotos:", fotosError);
    }

    // 10. Valorizaciones con número correlativo y período legible
    const valorizaciones = todasVal?.map((v, index) => ({
      ...v,
      numero: index + 1,
      periodoLegible: v.period || `Período ${index + 1}`,
    })) || [];

    // 11. Cronograma: usar los hitos con su porcentaje desde la BD
    const cronograma = hitos?.map(h => ({
      ...h,
      porcentaje: h.porcentaje ?? 0,
    })) || [];

    // 12. Construir respuesta JSON
    return NextResponse.json({
      project: {
        ...project,
        avance,
        ultimaValorizacion: ultimaVal,
      },
      hitos: hitos || [],
      fotos: fotos || [],
      valorizaciones,
      cronograma,
    });
  } catch (error) {
    console.error("Error en /api/cliente/dashboard:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}