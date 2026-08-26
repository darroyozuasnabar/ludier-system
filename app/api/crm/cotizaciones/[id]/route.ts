import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { validateBody } from '@/lib/validate';
import { cotizacionSchema } from '@/lib/validations';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

// ============================================================
// 🔥 Cliente Supabase para API Routes (con cookies)
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
// GET - Obtener cotización por ID
// ============================================================
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseClient();

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

    if (itemsError) {
      console.error('Error cargando items:', itemsError);
    }

    // Obtener seguimiento
    const { data: seguimiento, error: seguimientoError } = await supabase
      .from('CotizacionSeguimiento')
      .select('*')
      .eq('cotizacion_id', id)
      .order('fecha', { ascending: false });

    if (seguimientoError) {
      console.error('Error cargando seguimiento:', seguimientoError);
    }

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

// ============================================================
// PUT - Actualizar cotización (con Zod + Rate Limiting)
// ============================================================
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'anonymous';
    const { success } = await rateLimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta nuevamente en unos segundos.' },
        { status: 429 }
      );
    }

    // 2. Validar con Zod
    const validated = await validateBody(req, cotizacionSchema);
    if (validated instanceof NextResponse) return validated;

    const { id } = await params;
    const supabase = await createSupabaseClient();

    // 3. Verificar que la cotización existe y está en BORRADOR
    const { data: cotizacion, error: checkError } = await supabase
      .from('Cotizacion')
      .select('estado')
      .eq('id', id)
      .single();

    if (checkError) {
      return NextResponse.json(
        { success: false, error: 'Cotización no encontrada' },
        { status: 404 }
      );
    }

    if (cotizacion.estado !== 'BORRADOR') {
      return NextResponse.json(
        { success: false, error: 'Solo se pueden editar cotizaciones en estado BORRADOR' },
        { status: 400 }
      );
    }

    // 4. Calcular totales
    const subtotal = validated.items.reduce((sum, item) => 
      sum + (item.cantidad * item.precio_unitario - (item.descuento || 0)), 0
    );
    const igv = subtotal * 0.18;
    const total = subtotal + igv;

    // 5. Actualizar cotización
    const { data, error } = await supabase
      .from('Cotizacion')
      .update({
        project_id: validated.project_id || null,
        cliente: validated.cliente,
        cliente_ruc: validated.cliente_ruc || null,
        cliente_contacto: validated.cliente_contacto || null,
        cliente_telefono: validated.cliente_telefono || null,
        cliente_email: validated.cliente_email || null,
        cliente_direccion: validated.cliente_direccion || null,
        fecha_emision: validated.fecha_emision,
        fecha_validez: validated.fecha_validez,
        condiciones: validated.condiciones || null,
        notas: validated.notas || null,
        moneda: validated.moneda,
        tipo_cambio: validated.tipo_cambio,
        subtotal: subtotal,
        igv: igv,
        total: total,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // 6. Eliminar items antiguos
    await supabase
      .from('CotizacionItem')
      .delete()
      .eq('cotizacion_id', id);

    // 7. Insertar nuevos items
    if (validated.items && validated.items.length > 0) {
      const items = validated.items.map((item, index) => ({
        cotizacion_id: id,
        descripcion: item.descripcion,
        cantidad: item.cantidad,
        unidad: item.unidad,
        precio_unitario: item.precio_unitario,
        descuento: item.descuento || 0,
        total: (item.cantidad * item.precio_unitario) - (item.descuento || 0),
        orden: index + 1,
      }));

      const { error: itemsError } = await supabase
        .from('CotizacionItem')
        .insert(items);

      if (itemsError) throw itemsError;
    }

    return NextResponse.json({
      success: true,
      data,
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

// ============================================================
// DELETE - Eliminar cotización (solo BORRADOR)
// ============================================================
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'anonymous';
    const { success } = await rateLimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta nuevamente en unos segundos.' },
        { status: 429 }
      );
    }

    const { id } = await params;
    const supabase = await createSupabaseClient();

    // 2. Verificar que la cotización existe y está en BORRADOR
    const { data: cotizacion, error: checkError } = await supabase
      .from('Cotizacion')
      .select('estado')
      .eq('id', id)
      .single();

    if (checkError) {
      return NextResponse.json(
        { success: false, error: 'Cotización no encontrada' },
        { status: 404 }
      );
    }

    if (cotizacion.estado !== 'BORRADOR') {
      return NextResponse.json(
        { success: false, error: 'Solo se pueden eliminar cotizaciones en estado BORRADOR' },
        { status: 400 }
      );
    }

    // 3. Eliminar items primero (por FK)
    await supabase
      .from('CotizacionItem')
      .delete()
      .eq('cotizacion_id', id);

    // 4. Eliminar seguimientos
    await supabase
      .from('CotizacionSeguimiento')
      .delete()
      .eq('cotizacion_id', id);

    // 5. Eliminar cotización
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