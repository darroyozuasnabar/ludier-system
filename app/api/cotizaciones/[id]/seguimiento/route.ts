import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { tipo, descripcion, proximo_contacto } = body;
    const supabase = await createSupabaseClient();

    if (!descripcion) {
      return NextResponse.json(
        { success: false, error: 'La descripción es requerida' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('CotizacionSeguimiento')
      .insert({
        cotizacion_id: id,
        tipo: tipo || 'NOTA',
        descripcion,
        proximo_contacto: proximo_contacto || null,
        fecha: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Actualizar fecha de último seguimiento en la cotización
    await supabase
      .from('Cotizacion')
      .update({
        fecha_ultimo_seguimiento: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    return NextResponse.json({
      success: true,
      data,
      message: 'Seguimiento agregado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error en POST /api/cotizaciones/[id]/seguimiento:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}