// app/api/cliente/dashboard/route.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "CLIENTE") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = token.id as string;

    // 1. Proyecto
    const { data: project, error: projectError } = await supabaseAdmin
      .from("Project")
      .select("id, name, client, location, startDate, expectedEndDate, status, valorization")
      .eq("cliente_user_id", userId)
      .maybeSingle();

    if (projectError || !project) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    }

    // 2. Valorizaciones (para la tabla y cálculos)
    const { data: todasVal, error: valError } = await supabaseAdmin
      .from("Valorizacion")
      .select("id, period, status, fechaEmision, fechaCobro, totalFactura, avancePct, createdAt")
      .eq("projectId", project.id)
      .order("fechaEmision", { ascending: true });

    // 3. Calcular avance
    const totalCobrado = todasVal
      ?.filter(v => v.status === "COBRADA")
      .reduce((sum, v) => sum + (v.totalFactura || 0), 0) || 0;

    const { data: contratos } = await supabaseAdmin
      .from("Contrato")
      .select("monto")
      .eq("project_id", project.id);

    const totalContratos = contratos?.reduce((sum, c) => sum + (c.monto || 0), 0) || 0;
    const montoTotal = totalContratos > 0 ? totalContratos : project.valorization;
    const avance = montoTotal > 0 ? (totalCobrado / montoTotal) * 100 : 0;

    // ✅ Última valorización (la más RECIENTE por fecha de creación en BD)
    const ultimaVal = todasVal && todasVal.length > 0
      ? [...todasVal].sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0]
      : null;

    // ============================================================
    // 4. OBTENER HITOS PRINCIPALES
    // ============================================================
    const { data: hitos, error: hitosError } = await supabaseAdmin
      .from("Hito")
      .select("id, title, description, fecha, badge, badge_color, acento, orden, porcentaje, tipo")
      .eq("project_id", project.id)
      .eq("tipo", "principal")
      .order("orden", { ascending: true });

    if (hitosError) {
      console.error("Error al obtener hitos:", hitosError);
    }

    // ============================================================
    // 4.5. ÓRDENES DE PRODUCCIÓN
    // ============================================================
    const { data: ordenesProduccion, error: ordenesError } = await supabaseAdmin
      .from("OrdenProduccion")
      .select("id, nombre, tipo, cantidad, unidad, estado, fechainicio, fechafin, base_completada, acabado_completado")
      .eq("project_id", project.id)
      .order("created_at", { ascending: false });

    if (ordenesError) {
      console.error("Error al obtener órdenes de producción:", ordenesError);
    }

    // Calcular avance de cada orden
    const ordenesConAvance = (ordenesProduccion || []).map((o: any) => {
      let avance = 0;
      if (o.estado === "COMPLETADO") avance = 100;
      else if (o.estado === "EN_INSTALACION") avance = 85;
      else if (o.estado === "EN_PROCESO") {
        if (o.base_completada && o.acabado_completado) avance = 100;
        else if (o.base_completada) avance = 70;
        else avance = 40;
      } else if (o.estado === "PENDIENTE") avance = 0;
      return { ...o, avance };
    });

    // Avance general de producción
    const avanceProduccion = ordenesConAvance.length > 0
      ? ordenesConAvance.reduce((sum: number, o: any) => sum + o.avance, 0) / ordenesConAvance.length
      : 0;

    // ============================================================
    // 5. FOTOS - SOLO ACTIVAS
    // ============================================================
    const { data: fotos, error: fotosError } = await supabaseAdmin
      .from("Foto")
      .select("id, nombre, url, categoria, fecha_subida")
      .eq("proyecto_id", project.id)
      .eq("activo", true)
      .order("fecha_subida", { ascending: false })
      .limit(8);

    if (fotosError) {
      console.error("Error al obtener fotos:", fotosError);
    }

    // 6. Valorizaciones con número correlativo
    const valorizaciones = todasVal?.map((v, index) => ({
      ...v,
      numero: index + 1,
    })) || [];

    // 7. Cronograma: usar SOLO los hitos principales
    const cronograma = hitos?.map(h => ({
      ...h,
      porcentaje: h.porcentaje ?? 0,
    })) || [];

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
      ordenesProduccion: ordenesConAvance,
      avanceProduccion,
    });
  } catch (error) {
    console.error("Error en /api/cliente/dashboard:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}