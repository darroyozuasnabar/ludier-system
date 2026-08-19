// app/api/cliente/dashboard/route.ts
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

    // 1. Proyecto del cliente
    const { data: project, error: projectError } = await supabaseAdmin
      .from("Project")
      .select("id, name, client, location, startDate, expectedEndDate, status, valorization")
      .eq("cliente_user_id", userId)
      .maybeSingle();

    if (projectError || !project) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    }

    // 2. Todas las valorizaciones
    const { data: todasVal, error: valError } = await supabaseAdmin
      .from("Valorizacion")
      .select("id, period, status, fechaEmision, fechaCobro, totalFactura, avancePct")
      .eq("projectId", project.id)
      .order("fechaEmision", { ascending: true });

    // 3. Calcular total cobrado
    const totalCobrado = todasVal
      ?.filter(v => v.status === "COBRADA")
      .reduce((sum, v) => sum + (v.totalFactura || 0), 0) || 0;

    // 4. Obtener suma de todos los contratos del proyecto
    const { data: contratos, error: contratosError } = await supabaseAdmin
      .from("Contrato")
      .select("monto")
      .eq("project_id", project.id);

    const totalContratos = contratos?.reduce((sum, c) => sum + (c.monto || 0), 0) || 0;
    const montoTotal = totalContratos > 0 ? totalContratos : project.valorization;

    // 5. Calcular avance real
    const avance = montoTotal > 0 ? (totalCobrado / montoTotal) * 100 : 0;

    // 6. Última valorización
    const ultimaVal = todasVal?.[todasVal.length - 1] || null;

    // 7. Hitos
    const { data: hitos } = await supabaseAdmin
      .from("Hito")
      .select("id, title, description, fecha, badge, badge_color, acento, orden")
      .eq("project_id", project.id)
      .order("orden", { ascending: true });

    // 8. Fotos
    const { data: fotos } = await supabaseAdmin
      .from("Foto")
      .select("id, nombre, url, categoria, fecha_subida")
      .eq("proyecto_id", project.id)
      .order("fecha_subida", { ascending: false })
      .limit(8);

    // 9. Valorizaciones con número correlativo
    const valorizaciones = todasVal?.map((v, index) => ({
      ...v,
      numero: index + 1,
    })) || [];

    // 10. Cronograma
    const cronograma = hitos?.map(h => ({ ...h, porcentaje: 0 })) || [];

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
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}