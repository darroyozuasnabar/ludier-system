// app/api/crm/cotizaciones/[id]/route.ts
// Endpoints para obtener por ID, actualizar y eliminar cotizaciones

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { cotizacionUpdateSchema, calcularTotales } from "@/lib/validations/cotizacion";
import { z } from "zod";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const cotizacion = await prisma.cotizacion.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { orden: "asc" },
        },
        seguimientos: {
          orderBy: { fecha: "desc" },
          include: {
            Usuario: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        Project: {
          select: { id: true, name: true, client: true, status: true },
        },
        Creador: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!cotizacion) {
      return NextResponse.json(
        { error: "Cotización no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: cotizacion });
  } catch (error: any) {
    console.error("❌ Error en GET /api/crm/cotizaciones/[id]:", error);
    return NextResponse.json(
      { error: "Error al obtener la cotización", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const validated = cotizacionUpdateSchema.parse(body);

    const existing = await prisma.cotizacion.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Cotización no encontrada" },
        { status: 404 }
      );
    }

    // Si ya está convertida a obra, no permitir edición de montos sin precaución
    if (existing.estado === "CONVERTIDA_A_OBRA" && validated.items) {
      return NextResponse.json(
        { error: "No se puede editar los ítems de una cotización ya convertida a obra" },
        { status: 409 }
      );
    }

    const updatedCotizacion = await prisma.$transaction(async (tx) => {
      let subtotal = Number(existing.subtotal);
      let igv = Number(existing.igv);
      let total = Number(existing.total);

      if (validated.items && validated.items.length > 0) {
        const totales = calcularTotales(
          validated.items.map((it) => ({
            cantidad: it.cantidad,
            precio_unitario: it.precio_unitario,
            descuento: it.descuento || 0,
          }))
        );
        subtotal = totales.subtotal;
        igv = totales.igv;
        total = totales.total;

        // Reemplazar ítems
        await tx.cotizacionItem.deleteMany({
          where: { cotizacion_id: id },
        });

        await tx.cotizacionItem.createMany({
          data: validated.items.map((it, idx) => ({
            cotizacion_id: id,
            descripcion: it.descripcion,
            cantidad: it.cantidad,
            unidad: it.unidad,
            precio_unitario: it.precio_unitario,
            descuento: it.descuento || 0,
            total: Math.max(0, it.cantidad * it.precio_unitario - (it.descuento || 0)),
            orden: it.orden ?? idx + 1,
          })),
        });
      }

      const updateData: any = {
        updated_at: new Date(),
        subtotal,
        igv,
        total,
      };

      if (validated.cliente !== undefined) updateData.cliente = validated.cliente;
      if (validated.cliente_ruc !== undefined) updateData.cliente_ruc = validated.cliente_ruc || null;
      if (validated.cliente_contacto !== undefined) updateData.cliente_contacto = validated.cliente_contacto || null;
      if (validated.cliente_telefono !== undefined) updateData.cliente_telefono = validated.cliente_telefono || null;
      if (validated.cliente_email !== undefined) updateData.cliente_email = validated.cliente_email || null;
      if (validated.cliente_direccion !== undefined) updateData.cliente_direccion = validated.cliente_direccion || null;
      if (validated.fecha_emision) updateData.fecha_emision = new Date(validated.fecha_emision);
      if (validated.fecha_validez !== undefined) {
        updateData.fecha_validez = validated.fecha_validez ? new Date(validated.fecha_validez) : null;
      }
      if (validated.estado !== undefined) {
        updateData.estado = validated.estado;
        if (validated.estado === "ENVIADA" && !existing.fecha_envio) {
          updateData.fecha_envio = new Date();
        }
        if (validated.estado === "APROBADA" && !existing.fecha_aprobacion) {
          updateData.fecha_aprobacion = new Date();
        }
      }
      if (validated.moneda !== undefined) updateData.moneda = validated.moneda;
      if (validated.tipo_cambio !== undefined) updateData.tipo_cambio = validated.tipo_cambio;
      if (validated.condiciones !== undefined) updateData.condiciones = validated.condiciones || null;
      if (validated.notas !== undefined) updateData.notas = validated.notas || null;

      const result = await tx.cotizacion.update({
        where: { id },
        data: updateData,
        include: {
          items: { orderBy: { orden: "asc" } },
          Project: true,
          Creador: { select: { id: true, name: true, email: true } },
        },
      });

      return result;
    });

    return NextResponse.json({
      data: updatedCotizacion,
      message: "Cotización actualizada con éxito",
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Datos de actualización inválidos",
          details: error.errors.map((e) => ({
            campo: e.path.join("."),
            mensaje: e.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error("❌ Error en PUT /api/crm/cotizaciones/[id]:", error);
    return NextResponse.json(
      { error: "Error al actualizar la cotización", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.cotizacion.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Cotización no encontrada" },
        { status: 404 }
      );
    }

    if (existing.estado === "CONVERTIDA_A_OBRA") {
      return NextResponse.json(
        { error: "No se puede eliminar una cotización que ya fue convertida a obra activa" },
        { status: 409 }
      );
    }

    await prisma.cotizacion.delete({
      where: { id },
    });

    return NextResponse.json({
      message: `Cotización ${existing.numero} eliminada correctamente`,
    });
  } catch (error: any) {
    console.error("❌ Error en DELETE /api/crm/cotizaciones/[id]:", error);
    return NextResponse.json(
      { error: "Error al eliminar la cotización", details: error.message },
      { status: 500 }
    );
  }
}
