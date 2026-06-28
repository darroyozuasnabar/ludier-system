import { NextRequest, NextResponse } from 'next/server';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: Obtener cotización por ID con sus items
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Obtener cotización
    const { data: cotizacion, error: cotizacionError } = await supabase
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
      .eq('id', id)
      .single();

    if (cotizacionError) {
      if (cotizacionError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Cotización no encontrada' },
          { status: 404 }
        );
      }
      throw cotizacionError;
    }

    // Obtener items
    const { data: items, error: itemsError } = await supabase
      .from('CotizacionItem')
      .select('*')
      .eq('cotizacion_id', id)
      .order('orden', { ascending: true });

    if (itemsError) throw itemsError;

    // Obtener seguimiento
    const { data: seguimiento, error: seguimientoError } = await supabase
      .from('CotizacionSeguimiento')
      .select('*')
      .eq('cotizacion_id', id)
      .order('fecha', { ascending: false });

    if (seguimientoError) throw seguimientoError;

    return NextResponse.json({
      success: true,
      data: {
        ...cotizacion,
        items: items || [],
        seguimiento: seguimiento || []
      }
    });
  } catch (error) {
    console.error('❌ Error en GET /api/cotizaciones/[id]:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// PUT: Actualizar cotización
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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
      moneda,
      tipo_cambio
    } = body;

    // Verificar que la cotización existe
    const { data: existing, error: existingError } = await supabase
      .from('Cotizacion')
      .select('id, estado')
      .eq('id', id)
      .single();

    if (existingError) {
      return NextResponse.json(
        { success: false, error: 'Cotización no encontrada' },
        { status: 404 }
      );
    }

    // No permitir editar si está aprobada o convertida
    if (existing.estado === 'APROBADA' || existing.estado === 'CONVERTIDA_A_OBRA') {
      return NextResponse.json(
        { success: false, error: 'No se puede editar una cotización aprobada o convertida' },
        { status: 400 }
      );
    }

    // Calcular totales si se enviaron items
    let subtotal = 0;
    let igv = 0;
    let total = 0;
    let itemsCalculados: any[] = [];

    if (items && items.length > 0) {
      itemsCalculados = items.map((item: any) => {
        const itemTotal = (item.cantidad * item.precio_unitario) - (item.descuento || 0);
        subtotal += itemTotal;
        return {
          ...item,
          total: itemTotal
        };
      });
      igv = subtotal * 0.18;
      total = subtotal + igv;
    }

    // Actualizar cabecera
    const updateData: any = {
      project_id: project_id || null,
      cliente,
      cliente_ruc: cliente_ruc || null,
      cliente_contacto: cliente_contacto || null,
      cliente_telefono: cliente_telefono || null,
      cliente_email: cliente_email || null,
      cliente_direccion: cliente_direccion || null,
      fecha_emision,
      fecha_validez: fecha_validez || null,
      estado: estado || 'BORRADOR',
      condiciones: condiciones || null,
      notas: notas || null,
      moneda: moneda || 'PEN',
      tipo_cambio: tipo_cambio || null,
      updated_at: new Date().toISOString()
    };

    if (items && items.length > 0) {
      updateData.subtotal = subtotal;
      updateData.igv = igv;
      updateData.total = total;
    }

    const { data: cotizacion, error: cotizacionError } = await supabase
      .from('Cotizacion')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (cotizacionError) throw cotizacionError;

    // Actualizar items si se enviaron
    if (items && items.length > 0) {
      // Eliminar items existentes
      await supabase
        .from('CotizacionItem')
        .delete()
        .eq('cotizacion_id', id);

      // Insertar nuevos items
      const newItems = itemsCalculados.map((item: any) => ({
        cotizacion_id: id,
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
        .insert(newItems);

      if (itemsError) throw itemsError;
    }

    return NextResponse.json({
      success: true,
      data: cotizacion,
      message: 'Cotización actualizada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error en PUT /api/cotizaciones/[id]:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar cotización (solo si está en BORRADOR)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Verificar que la cotización existe y está en BORRADOR
    const { data: existing, error: existingError } = await supabase
      .from('Cotizacion')
      .select('id, estado')
      .eq('id', id)
      .single();

    if (existingError) {
      return NextResponse.json(
        { success: false, error: 'Cotización no encontrada' },
        { status: 404 }
      );
    }

    if (existing.estado !== 'BORRADOR') {
      return NextResponse.json(
        { success: false, error: 'Solo se pueden eliminar cotizaciones en estado BORRADOR' },
        { status: 400 }
      );
    }

    // Eliminar (los items se eliminan en cascada)
    const { error } = await supabase
      .from('Cotizacion')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Cotización eliminada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error en DELETE /api/cotizaciones/[id]:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}