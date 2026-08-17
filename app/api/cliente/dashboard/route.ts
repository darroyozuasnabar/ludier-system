import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const session = await getServerSession();
  if (!session || session.user?.role !== "CLIENTE") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userId = session.user.id;

  // Obtener proyecto asociado al cliente
  const { data: project, error: projectError } = await supabase
    .from("Project")
    .select(`
      id,
      name,
      client,
      status,
      valorization,
      startDate,
      expectedEndDate,
      actualEndDate,
      location,
      description
    `)
    .eq("cliente_user_id", userId)
    .single();

  if (projectError || !project) {
    return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
  }

  // Obtener fotos recientes
  const { data: fotos } = await supabase
    .from("Foto")
    .select("id, nombre, url, categoria, fecha_subida")
    .eq("proyecto_id", project.id)
    .order("fecha_subida", { ascending: false })
    .limit(6);

  // Calcular avance (basado en valorizaciones)
  const { data: valorizaciones } = await supabase
    .from("Valorizacion")
    .select("netoCobrar, status")
    .eq("projectId", project.id);

  const costoDirectoTotal = project.valorization / 1.18;
  const totalEjecutado = valorizaciones?.reduce((sum, v) => sum + Number(v.netoCobrar || 0), 0) || 0;
  const avance = costoDirectoTotal > 0 ? (totalEjecutado / costoDirectoTotal) * 100 : 0;

  return NextResponse.json({
    project: {
      ...project,
      avance: Math.min(avance, 100),
    },
    fotos: fotos || [],
  });
}