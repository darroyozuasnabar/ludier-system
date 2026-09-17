// app/api/crm/cotizaciones/[id]/convertir/route.ts
// Endpoint especial para convertir una cotización aprobada en un Proyecto/Obra activo en el ERP

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));

    // 1. Verificar si la cotización existe
    const cotizacion = await prisma.cotizacion.findUnique({
      where: { id },
      include: {
        items: true,
        Project: true,
      },
    });

    if (!cotizacion) {
      return NextResponse.json(
        { error: "Cotización no encontrada" },
        { status: 404 }
      );
    }

    // 2. Si ya fue convertida, rechazar con 409 Conflict
    if (cotizacion.estado === "CONVERTIDA_A_OBRA" || cotizacion.project_id) {
      return NextResponse.json(
        {
          error: "La cotización ya fue convertida a obra previamente",
          projectId: cotizacion.project_id,
          fechaConversion: cotizacion.fecha_conversion,
        },
        { status: 409 }
      );
    }

    // 3. Ejecutar la conversión atómica en transacción
    const resultado = await prisma.$transaction(async (tx) => {
      // 3.1 Crear Proyecto en el ERP
      const startDate = body.startDate ? new Date(body.startDate) : new Date();
      const expectedEndDate = body.expectedEndDate
        ? new Date(body.expectedEndDate)
        : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // 60 días por defecto

      const projectName =
        body.projectName ||
        `Obra ${cotizacion.cliente} - ${cotizacion.numero}`;

      const nuevoProyecto = await tx.project.create({
        data: {
          name: projectName,
          client: cotizacion.cliente,
          clientType: body.clientType || "CONSTRUCTORA",
          valorization: Number(cotizacion.total),
          status: "ACTIVO",
          startDate,
          expectedEndDate,
          location: body.location || cotizacion.cliente_direccion || "Lima, Perú",
          description:
            body.description ||
            `Proyecto generado automáticamente tras aprobar y convertir la cotización ${cotizacion.numero}. ` +
              (cotizacion.notas ? `Notas: ${cotizacion.notas}` : ""),
        },
      });

      // 3.2 Actualizar estado de la cotización
      const cotizacionActualizada = await tx.cotizacion.update({
        where: { id },
        data: {
          estado: "CONVERTIDA_A_OBRA",
          project_id: nuevoProyecto.id,
          fecha_conversion: new Date(),
          fecha_aprobacion: cotizacion.fecha_aprobacion || new Date(),
          updated_at: new Date(),
        },
      });

      // 3.3 Registrar en la bitácora de seguimiento
      await tx.cotizacionSeguimiento.create({
        data: {
          cotizacion_id: id,
          tipo: "NOTA",
          descripcion: `Cotización convertida exitosamente en la Obra/Proyecto: "${nuevoProyecto.name}" con monto valorizado de S/ ${Number(cotizacion.total).toLocaleString("es-PE")}.`,
          realizado_por: (token.id as string) || null,
        },
      });

      return {
        project: nuevoProyecto,
        cotizacion: cotizacionActualizada,
      };
    });

    return NextResponse.json(
      {
        message: `Cotización ${cotizacion.numero} convertida exitosamente a Obra`,
        data: resultado,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error en POST /api/crm/cotizaciones/[id]/convertir:", error);
    return NextResponse.json(
      { error: "Error al convertir la cotización", details: error.message },
      { status: 500 }
    );
  }
}
