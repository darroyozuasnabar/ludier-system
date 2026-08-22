// app/api/cliente/dashboard/route.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Función auxiliar para formatear fechas
function formatDate(date: string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Función para formatear moneda
function formatPEN(value: number): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(value);
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

    // 4. Calcular total cobrado
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

    // 6. Calcular avance real
    const avance = montoTotal > 0 ? (totalCobrado / montoTotal) * 100 : 0;

    // 7. Última valorización
    const ultimaVal = todasVal?.[todasVal.length - 1] || null;

    // ============================================================
    // 8. GENERAR HITOS DINÁMICAMENTE (combinando fijos + valorizaciones)
    // ============================================================

    // 8a. Hitos fijos (contratos, instalaciones, garantías)
    const hitosFijos = [
      {
        id: 'hito-contrato-principal',
        title: 'Contrato Qantua Fase 2 firmado',
        description: 'Carpintería Metálica Integral – S/ 543,667.29',
        fecha: '2026-05-29',
        badge: 'Completado',
        badge_color: '#10B981',
        acento: 'border-green-500',
        orden: 1,
        porcentaje: 100,
      },
      {
        id: 'hito-21-contrato',
        title: '21° Contrato firmado',
        description: 'Carpintería Metálica Integral Fase 1 (S/ 42,086.35)',
        fecha: '2026-06-30',
        badge: 'Completado',
        badge_color: '#10B981',
        acento: 'border-green-500',
        orden: 6,
        porcentaje: 100,
      },
      {
        id: 'hito-22-contrato',
        title: '22° Contrato firmado',
        description: 'Cerco metálico + Carpintería (S/ 20,748.00)',
        fecha: '2026-04-20',
        badge: 'Completado',
        badge_color: '#10B981',
        acento: 'border-green-500',
        orden: 7,
        porcentaje: 100,
      },
      {
        id: 'hito-instalacion-cerco',
        title: 'Instalación de cerco metálico',
        description: 'Columnas y Vigas ASTM A36 (11 ml) - Instalación completada',
        fecha: '2026-08-18',
        badge: 'Completado',
        badge_color: '#10B981',
        acento: 'border-green-500',
        orden: 8,
        porcentaje: 100,
      },
      {
        id: 'hito-garantias',
        title: 'Liberación de garantías',
        description: 'S/ 28,614.07 retenidos total',
        fecha: '2026-12-31',
        badge: 'Pendiente',
        badge_color: '#6B7280',
        acento: 'border-gray-500',
        orden: 10,
        porcentaje: 0,
      },
    ];

    // 8b. Hitos dinámicos desde valorizaciones
    const hitosDesdeValorizaciones = todasVal?.map((v, index) => {
      const num = index + 1;
      let badge = 'Pendiente';
      let badgeColor = '#9CA3AF';
      let porcentaje = 0;
      let descripcion = 'Pendiente de cobro';

      if (v.status === 'COBRADA') {
        badge = 'Completado';
        badgeColor = '#10B981';
        porcentaje = 100;
        descripcion = v.fechaCobro 
          ? `Cobrada el ${formatDate(v.fechaCobro)} (${formatPEN(v.totalFactura)})`
          : `Cobrada (${formatPEN(v.totalFactura)})`;
      } else if (v.status === 'FIRMADA') {
        badge = 'En progreso';
        badgeColor = '#F59E0B';
        porcentaje = 0;
        descripcion = `Firmada - Próxima a cobrar (${formatPEN(v.totalFactura)})`;
      }

      // Usar el período real si existe, o generar uno genérico
      let titulo = v.period || `Valorización N° ${num}`;
      // Si el período es muy largo, usar título genérico
      if (titulo.length > 50) {
        titulo = `Valorización N° ${num}`;
      }

      return {
        id: v.id,
        title: titulo,
        description: descripcion,
        fecha: v.fechaEmision,
        badge,
        badge_color: badgeColor,
        acento: badge === 'Completado' ? 'border-green-500' : 'border-gray-300',
        orden: num + 1, // Para que vayan después de los contratos
        porcentaje,
      };
    }) || [];

    // 8c. Combinar hitos fijos + dinámicos y ordenar
    const todosLosHitos = [...hitosFijos, ...hitosDesdeValorizaciones]
      .sort((a, b) => a.orden - b.orden);

    // 9. Obtener fotos recientes
    const { data: fotos, error: fotosError } = await supabaseAdmin
      .from("Foto")
      .select("id, nombre, url, categoria, fecha_subida")
      .eq("proyecto_id", project.id)
      .order("fecha_subida", { ascending: false })
      .limit(8);

    if (fotosError) {
      console.error("Error al obtener fotos:", fotosError);
    }

    // 10. Valorizaciones con número correlativo
    const valorizaciones = todasVal?.map((v, index) => ({
      ...v,
      numero: index + 1,
      periodoLegible: v.period || `Período ${index + 1}`,
    })) || [];

    // 11. Cronograma: usar los hitos combinados
    const cronograma = todosLosHitos.map(h => ({
      ...h,
      porcentaje: h.porcentaje ?? 0,
    }));

    // 12. Construir respuesta JSON
    return NextResponse.json({
      project: {
        ...project,
        avance,
        ultimaValorizacion: ultimaVal,
      },
      hitos: todosLosHitos,
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