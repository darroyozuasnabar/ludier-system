// app/api/cotizaciones/[id]/seguimiento/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

// 🔥 Esquema de validación para seguimiento
const seguimientoSchema = z.object({
  tipo: z.enum(['NOTA', 'EMAIL', 'LLAMADA', 'REUNION']).default('NOTA'),
  descripcion: z.string().min(3, "La descripción debe tener al menos 3 caracteres").max(500),
  proximo_contacto: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Fecha de próximo contacto inválida",
  }).optional().nullable(),
});

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
    const body = await req.json();

    // 🔥 2. Validar con Zod
    const validated = seguimientoSchema.parse(body);
    const { tipo, descripcion, proximo_contacto } = validated;

    const supabase = await createSupabaseClient();

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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    console.error('❌ Error en POST /api/cotizaciones/[id]/seguimiento:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}