// app/api/cotizaciones/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

// ============================================================
// 🔥 CLIENTE SUPABASE
// ============================================================
const createSupabaseClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: any) {
          cookieStore.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );
};

// ============================================================
// 🔥 ESQUEMA ZOD PARA COTIZACIONES
// ============================================================
const cotizacionItemSchema = z.object({
  descripcion: z.string().min(3, "La descripción es requerida"),
  cantidad: z.number().positive("La cantidad debe ser mayor a 0"),
  unidad: z.string().default("UND"),
  precio_unitario: z.number().positive("El precio unitario debe ser mayor a 0"),
  descuento: z.number().min(0).default(0),
  orden: z.number().int().min(0).default(0),
});

const cotizacionSchema = z.object({
  project_id: z.string().uuid().nullable().optional(),
  cliente: z.string().min(2, "El cliente es requerido").max(150),
  cliente_ruc: z.string().regex(/^\d{11}$/, "El RUC debe tener 11 dígitos").optional().nullable(),
  cliente_contacto: z.string().max(100).optional().nullable(),
  cliente_telefono: z.string().max(20).optional().nullable(),
  cliente_email: z.string().email("Email inválido").optional().nullable(),
  cliente_direccion: z.string().max(200).optional().nullable(),
  fecha_emision: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Fecha de emisión inválida",
  }).optional(),
  fecha_validez: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Fecha de validez inválida",
  }).optional().nullable(),
  estado: z.enum(['BORRADOR', 'ENVIADA', 'VISTA', 'APROBADA', 'RECHAZADA', 'EXPIRADA', 'CONVERTIDA_A_OBRA']).default('BORRADOR'),
  items: z.array(cotizacionItemSchema).min(1, "Agrega al menos un item"),
  condiciones: z.string().max(1000).optional().nullable(),
  notas: z.string().max(1000).optional().nullable(),
  creado_por: z.string().uuid().optional().nullable(),
  moneda: z.enum(['PEN', 'USD']).default('PEN'),
  tipo_cambio: z.number().positive().optional().nullable(),
});

// ============================================================
// 📌 GET - Listar cotizaciones
// ============================================================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const estado = searchParams.get('estado');
    const cliente = searchParams.get('cliente');
    const fechaInicio = searchParams.get('fechaInicio');
    const fechaFin = searchParams.get('fechaFin');
    const limit = parseInt(searchParams.get('limit') || '50');

    const supabase = await createSupabaseClient();

    let query = supabase
      .from('Cotizacion')
      .select(`
        *,
        project:project_id (
          id,
          name,
          client,
          location
        ),
        creador:creado_por (
          id,
          name,
          email
        ),
        items:CotizacionItem (
          id,
          descripcion,
          cantidad,
          unidad,
          precio_unitario,
          descuento,
          total,
          orden
        )
      `)
      .order('fecha_emision', { ascending: false })
      .limit(limit);

    if (estado && estado !== 'ALL') {
      query = query.eq('estado', estado);
    }

    if (cliente) {
      query = query.ilike('cliente', `%${cliente}%`);
    }

    if (fechaInicio) {
      query = query.gte('fecha_emision', fechaInicio);
    }

    if (fechaFin) {
      query = query.lte('fecha_emision', fechaFin);
    }

    const { data, error } = await query;

    if (error) throw error;

    const dataWithItems = data?.map((cotizacion: any) => ({
      ...cotizacion,
      items: cotizacion.items || []
    })) || [];

    return NextResponse.json({
      success: true,
      data: dataWithItems,
      total: dataWithItems?.length || 0
    });
  } catch (error) {
    console.error('❌ Error en GET /api/cotizaciones:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// ============================================================
// 📌 POST - Crear cotización (con Zod + Rate Limiting)
// ============================================================
export async function POST(req: NextRequest) {
  try {
    // 🔥 1. Rate Limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'anonymous';
    const { success } = await rateLimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta nuevamente en unos segundos.' },
        { status: 429 }
      );
    }

    // 🔥 2. Validar con Zod
    const body = await req.json();
    const validated = cotizacionSchema.parse(body);

    const {
      project_id,
      cliente,
      cliente_ruc,
      cliente_contacto,
      cliente_telefono,
      cliente_email,
      cliente_direccion,
      fecha_emision,
      fecha_validez,
      estado,
      items,
      condiciones,
      notas,
      creado_por,
      moneda,
      tipo_cambio
    } = validated;

    const supabase = await createSupabaseClient();

    // Calcular totales
    let subtotal = 0;
    const itemsCalculados = items.map((item) => {
      const total = (item.cantidad * item.precio_unitario) - (item.descuento || 0);
      subtotal += total;
      return { ...item, total };
    });

    const igv = subtotal * 0.18;
    const total = subtotal + igv;

    // Crear cotización
    const { data: cotizacion, error: cotizacionError } = await supabase
      .from('Cotizacion')
      .insert({
        project_id: project_id || null,
        cliente,
        cliente_ruc: cliente_ruc || null,
        cliente_contacto: cliente_contacto || null,
        cliente_telefono: cliente_telefono || null,
        cliente_email: cliente_email || null,
        cliente_direccion: cliente_direccion || null,
        fecha_emision: fecha_emision || new Date().toISOString().split('T')[0],
        fecha_validez: fecha_validez || null,
        estado: estado || 'BORRADOR',
        subtotal,
        igv,
        total,
        moneda: moneda || 'PEN',
        tipo_cambio: tipo_cambio || null,
        condiciones: condiciones || null,
        notas: notas || null,
        creado_por: creado_por || null
      })
      .select()
      .single();

    if (cotizacionError) throw cotizacionError;

    // Crear items
    const itemsWithCotizacionId = itemsCalculados.map((item, index) => ({
      cotizacion_id: cotizacion.id,
      descripcion: item.descripcion,
      cantidad: item.cantidad,
      unidad: item.unidad || 'UND',
      precio_unitario: item.precio_unitario,
      descuento: item.descuento || 0,
      total: item.total,
      orden: index + 1
    }));

    const { error: itemsError } = await supabase
      .from('CotizacionItem')
      .insert(itemsWithCotizacionId);

    if (itemsError) {
      console.error('❌ Error insertando items:', itemsError);
      await supabase.from('Cotizacion').delete().eq('id', cotizacion.id);
      throw itemsError;
    }

    return NextResponse.json({
      success: true,
      data: cotizacion,
      message: 'Cotización creada exitosamente'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    console.error('❌ Error en POST /api/cotizaciones:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}