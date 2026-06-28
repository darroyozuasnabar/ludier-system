import { NextRequest, NextResponse } from 'next/server';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: Listar cotizaciones con filtros
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const estado = searchParams.get('estado');
    const cliente = searchParams.get('cliente');
    const fechaInicio = searchParams.get('fechaInicio');
    const fechaFin = searchParams.get('fechaFin');
    const limit = parseInt(searchParams.get('limit') || '50');

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

    return NextResponse.json({
      success: true,
      data,
      total: data?.length || 0
    });
  } catch (error) {
    console.error('❌ Error en GET /api/cotizaciones:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// POST: Crear nueva cotización
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
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
    } = body;

    // Validar campos requeridos
    if (!cliente) {
      return NextResponse.json(
        { success: false, error: 'El cliente es requerido' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Agrega al menos un item' },
        { status: 400 }
      );
    }

    // Calcular totales
    let subtotal = 0;
    const itemsCalculados = items.map((item: any) => {
      const total = (item.cantidad * item.precio_unitario) - (item.descuento || 0);
      subtotal += total;
      return {
        ...item,
        total
      };
    });

    const igv = subtotal * 0.18;
    const total = subtotal + igv;

    // Crear cabecera de cotización
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
    const itemsWithCotizacionId = itemsCalculados.map((item: any) => ({
      cotizacion_id: cotizacion.id,
      descripcion: item.descripcion,
      cantidad: item.cantidad,
      unidad: item.unidad,
      precio_unitario: item.precio_unitario,
      descuento: item.descuento || 0,
      total: item.total,
      orden: item.orden || 0
    }));

    const { error: itemsError } = await supabase
      .from('CotizacionItem')
      .insert(itemsWithCotizacionId);

    if (itemsError) {
      // Si falla, eliminar la cotización creada
      await supabase.from('Cotizacion').delete().eq('id', cotizacion.id);
      throw itemsError;
    }

    return NextResponse.json({
      success: true,
      data: cotizacion,
      message: 'Cotización creada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error en POST /api/cotizaciones:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}