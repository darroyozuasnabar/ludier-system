// app/api/crm/cotizaciones/route.ts
// Endpoints principales para listar y crear cotizaciones en el CRM de LUDIER

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { cotizacionSchema, calcularTotales } from "@/lib/validations/cotizacion";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const busqueda = searchParams.get("busqueda") || searchParams.get("q") || "";
    const estado = searchParams.get("estado") || "";
    const moneda = searchParams.get("moneda") || "";
    const fechaDesde = searchParams.get("fechaDesde") || "";
    const fechaHasta = searchParams.get("fechaHasta") || "";

    const where: any = {};

    if (busqueda) {
      where.OR = [
        { numero: { contains: busqueda, mode: "insensitive" } },
        { cliente: { contains: busqueda, mode: "insensitive" } },
        { cliente_ruc: { contains: busqueda, mode: "insensitive" } },
        { cliente_contacto: { contains: busqueda, mode: "insensitive" } },
      ];
    }

    if (estado && estado !== "TODOS") {
      where.estado = estado;
    }

    if (moneda && moneda !== "TODAS") {
      where.moneda = moneda;
    }

    if (fechaDesde || fechaHasta) {
      where.fecha_emision = {};
      if (fechaDesde) where.fecha_emision.gte = new Date(fechaDesde);
      if (fechaHasta) where.fecha_emision.lte = new Date(fechaHasta);
    }

    const [cotizaciones, total] = await Promise.all([
      prisma.cotizacion.findMany({
        where,
        include: {
          items: {
            orderBy: { orden: "asc" },
          },
          Project: {
            select: { id: true, name: true, client: true },
          },
          Creador: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { created_at: "desc" },
      }),
      prisma.cotizacion.count({ where }),
    ]);

    // Estadísticas rápidas para el dashboard CRM
    const estadisticas = {
      total,
      montoTotalPEN: cotizaciones
        .filter((c) => c.moneda === "PEN")
        .reduce((sum, c) => sum + Number(c.total || 0), 0),
      montoTotalUSD: cotizaciones
        .filter((c) => c.moneda === "USD")
        .reduce((sum, c) => sum + Number(c.total || 0), 0),
      aprobadas: cotizaciones.filter((c) => c.estado === "APROBADA" || c.estado === "CONVERTIDA_A_OBRA").length,
      convertidas: cotizaciones.filter((c) => c.estado === "CONVERTIDA_A_OBRA").length,
    };

    return NextResponse.json({
      data: cotizaciones,
      estadisticas,
      total,
    });
  } catch (error: any) {
    console.error("❌ Error en GET /api/crm/cotizaciones:", error);
    return NextResponse.json(
      { error: "Error al obtener las cotizaciones", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const validated = cotizacionSchema.parse(body);

    // Calcular montos financieros precisos
    const { subtotal, igv, total } = calcularTotales(
      validated.items.map((it) => ({
        cantidad: it.cantidad,
        precio_unitario: it.precio_unitario,
        descuento: it.descuento || 0,
      }))
    );

    // Generar correlativo si no viene en body
    const year = new Date().getFullYear();
    const countCurrentYear = await prisma.cotizacion.count({
      where: {
        created_at: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31T23:59:59.999Z`),
        },
      },
    });
    const correlativo = String(countCurrentYear + 1).padStart(4, "0");
    const numero = `COT-${year}-${correlativo}`;

    // Crear Cotización e ítems dentro de una transacción Prisma
    const nuevaCotizacion = await prisma.$transaction(async (tx) => {
      const cotizacion = await tx.cotizacion.create({
        data: {
          numero,
          cliente: validated.cliente,
          cliente_ruc: validated.cliente_ruc || null,
          cliente_contacto: validated.cliente_contacto || null,
          cliente_telefono: validated.cliente_telefono || null,
          cliente_email: validated.cliente_email || null,
          cliente_direccion: validated.cliente_direccion || null,
          fecha_emision: new Date(validated.fecha_emision),
          fecha_validez: validated.fecha_validez ? new Date(validated.fecha_validez) : null,
          estado: validated.estado || "BORRADOR",
          moneda: validated.moneda || "PEN",
          tipo_cambio: validated.tipo_cambio || 1,
          subtotal,
          igv,
          total,
          condiciones: validated.condiciones || null,
          notas: validated.notas || null,
          creado_por: (token.id as string) || null,
          project_id: validated.project_id || null,
          items: {
            create: validated.items.map((item, index) => ({
              descripcion: item.descripcion,
              cantidad: item.cantidad,
              unidad: item.unidad,
              precio_unitario: item.precio_unitario,
              descuento: item.descuento || 0,
              total: Math.max(
                0,
                item.cantidad * item.precio_unitario - (item.descuento || 0)
              ),
              orden: item.orden ?? index + 1,
            })),
          },
        },
        include: {
          items: true,
          Creador: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      return cotizacion;
    });

    return NextResponse.json(
      {
        data: nuevaCotizacion,
        message: `Cotización ${nuevaCotizacion.numero} creada exitosamente`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Datos de entrada inválidos",
          details: error.errors.map((e) => ({
            campo: e.path.join("."),
            mensaje: e.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error("❌ Error en POST /api/crm/cotizaciones:", error);
    return NextResponse.json(
      { error: "Error al crear la cotización", details: error.message },
      { status: 500 }
    );
  }
}
