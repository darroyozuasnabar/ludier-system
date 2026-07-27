// app/api/cotizaciones/[id]/enviar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

// 🔥 Esquema de validación (aunque no recibe body, lo dejamos para futuras extensiones)
const enviarSchema = z.object({
  // Si se necesita algún campo en el futuro
}).optional();

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
    // 🔥 1. Rate limiting
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