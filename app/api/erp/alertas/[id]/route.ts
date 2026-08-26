// app/api/alertas/[id]/route.ts
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
// 🔥 ESQUEMA ZOD (opcional, para robustez)
// ============================================================
const alertaUpdateSchema = z.object({
  leida: z.boolean().optional(),
  titulo: z.string().optional(),
  descripcion: z.string().optional(),
  priority: z.enum(['ALTA', 'MEDIA', 'BAJA']).optional(),
}).optional();

const alertaPatchSchema = z.object({
  action: z.enum(['leer', 'desmarcar']),
});

// ============================================================
// 📌 GET - Obtener una notificación específica
// ============================================================
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
      .from('Notificacion')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Notificación no encontrada' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      notificacion: data
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// ============================================================
// 📌 PUT - Actualizar notificación (con Rate Limiting)
// ============================================================
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🔥 Rate Limiting
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
    const { leida, ...rest } = body;
    const supabase = await createSupabaseClient();

    const updateData: any = { ...rest };
    if (leida !== undefined) {
      updateData.leida = leida;
      if (leida === true) {
        updateData.fecha_lectura = new Date().toISOString();
      }
    }

    const { data, error } = await supabase
      .from('Notificacion')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Notificación no encontrada' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      notificacion: data
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// ============================================================
// 📌 DELETE - Eliminar notificación (con Rate Limiting)
// ============================================================
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🔥 Rate Limiting
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

    const { error } = await supabase
      .from('Notificacion')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Notificación no encontrada' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Notificación eliminada correctamente'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// ============================================================
// 📌 PATCH - Marcar como leída (con Rate Limiting + Zod)
// ============================================================
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🔥 Rate Limiting
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

    // 🔥 Validar con Zod
    const validated = alertaPatchSchema.parse(body);
    const { action } = validated;

    const supabase = await createSupabaseClient();

    let updateData: any = {};

    if (action === 'leer') {
      updateData = {
        leida: true,
        fecha_lectura: new Date().toISOString()
      };
    } else if (action === 'desmarcar') {
      updateData = {
        leida: false,
        fecha_lectura: null
      };
    }

    const { data, error } = await supabase
      .from('Notificacion')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Notificación no encontrada' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      notificacion: data
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}