import { NextRequest, NextResponse } from 'next/server';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // 🔥 Promise
) {
  try {
    const { id } = await params;  // 🔥 Await params

    // Verificar que la cotización existe
    const { data: cotizacion, error: findError } = await supabase
      .from('Cotizacion')
      .select('id, estado')
      .eq('id', id)
      .single();

    if (findError) {
      return NextResponse.json(
        { success: false, error: 'Cotización no encontrada' },
        { status: 404 }
      );
    }

    // Validar que se pueda enviar
    if (!['BORRADOR', 'VISTA'].includes(cotizacion.estado)) {
      return NextResponse.json(
        { success: false, error: `No se puede enviar una cotización en estado "${cotizacion.estado}"` },
        { status: 400 }
      );
    }

    // Actualizar estado
    const { data, error } = await supabase
      .from('Cotizacion')
      .update({
        estado: 'ENVIADA',
        fecha_envio: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Crear registro de seguimiento
    await supabase
      .from('CotizacionSeguimiento')
      .insert({
        cotizacion_id: id,
        tipo: 'EMAIL',
        descripcion: 'Cotización enviada al cliente',
        fecha: new Date().toISOString()
      });

    return NextResponse.json({
      success: true,
      data,
      message: 'Cotización marcada como enviada'
    });
  } catch (error) {
    console.error('❌ Error en POST /api/cotizaciones/[id]/enviar:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}