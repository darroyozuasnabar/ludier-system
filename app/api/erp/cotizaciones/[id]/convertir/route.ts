// app/api/cotizaciones/[id]/convertir/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

// 🔥 Esquema de validación para conversión
const convertirSchema = z.object({
  project_name: z.string().min(3, "El nombre del proyecto debe tener al menos 3 caracteres").max(150).optional(),
  fecha_inicio: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Fecha de inicio inválida",
  }).optional(),
  fecha_fin_estimada: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Fecha de fin estimada inválida",
  }).optional(),
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
    const validated = convertirSchema.parse(body);
    const { project_name, fecha_inicio, fecha_fin_estimada } = validated;

    const supabase = await createSupabaseClient();

    // 1. Obtener la cotización con sus items
    const { data: cotizacion, error: cotizacionError } = await supabase
      .from('Cotizacion')
      .select(`
        *,
        items:CotizacionItem(*)
      `)
      .eq('id', id)
      .single();

    if (cotizacionError) {
      return NextResponse.json(
        { success: false, error: 'Cotización no encontrada' },
        { status: 404 }
      );
    }

    // Validar que esté aprobada
    if (cotizacion.estado !== 'APROBADA') {
      return NextResponse.json(
        { success: false, error: 'Solo se pueden convertir cotizaciones aprobadas' },
        { status: 400 }
      );
    }

    // 2. Crear el proyecto (obra)
    const projectName = project_name || `Obra - ${cotizacion.cliente} - ${new Date().getFullYear()}`;

    const { data: project, error: projectError } = await supabase
      .from('Project')
      .insert({
        name: projectName,
        client: cotizacion.cliente,
        clientType: 'INMOBILIARIA',
        valorization: cotizacion.total,
        status: 'ACTIVO',
        startDate: fecha_inicio || new Date().toISOString(),
        expectedEndDate: fecha_fin_estimada || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        location: cotizacion.cliente_direccion || 'Por definir',
        description: `Obra generada desde cotización ${cotizacion.numero} - ${cotizacion.cliente}`
      })
      .select()
      .single();

    if (projectError) throw projectError;

    // 3. Crear el contrato asociado
    const { data: contrato, error: contratoError } = await supabase
      .from('Contrato')
      .insert({
        project_id: project.id,
        nombre: `Contrato - ${projectName}`,
        monto: cotizacion.total,
        fecha: new Date().toISOString().split('T')[0],
        estado: 'ACTIVO',
        tipo: 'CONTRATO',
        orden_estrategico: 999
      })
      .select()
      .single();

    if (contratoError) throw contratoError;

    // 4. Actualizar la cotización
    const { data: cotizacionActualizada, error: updateError } = await supabase
      .from('Cotizacion')
      .update({
        estado: 'CONVERTIDA_A_OBRA',
        project_id: project.id,
        fecha_conversion: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    // 5. Registrar seguimiento
    await supabase
      .from('CotizacionSeguimiento')
      .insert({
        cotizacion_id: id,
        tipo: 'NOTA',
        descripcion: `Cotización convertida a obra: ${projectName} (Contrato: ${contrato.id})`,
        fecha: new Date().toISOString()
      });

    return NextResponse.json({
      success: true,
      data: {
        cotizacion: cotizacionActualizada,
        project,
        contrato
      },
      message: 'Cotización convertida a obra exitosamente'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    console.error('❌ Error en POST /api/cotizaciones/[id]/convertir:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}