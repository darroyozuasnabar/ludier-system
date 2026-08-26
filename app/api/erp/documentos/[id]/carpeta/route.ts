// app/api/documentos/[id]/carpeta/route.ts
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
// 🔥 ESQUEMA ZOD
// ============================================================
const carpetaSchema = z.object({
  carpeta_id: z.string().uuid("ID de carpeta inválido"),
});

// ============================================================
// 📌 GET - Obtener carpetas de un documento
// ============================================================
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseClient();

    // Verificar que el documento existe
    const { data: documento, error: docError } = await supabase
      .from('Documento')
      .select('id')
      .eq('id', id)
      .single();

    if (docError) {
      return NextResponse.json(
        { success: false, error: 'Documento no encontrado' },
        { status: 404 }
      );
    }

    // Obtener carpetas asociadas al documento
    const { data, error } = await supabase
      .from('DocumentoCarpeta')
      .select(`
        carpeta_id,
        carpeta:carpeta_id (
          id,
          nombre,
          padre_id,
          proyecto_id,
          created_at
        )
      `)
      .eq('documento_id', id);

    if (error) throw error;

    const carpetas = data?.map((item: any) => item.carpeta) || [];

    return NextResponse.json({
      success: true,
      data: carpetas
    });
  } catch (error) {
    console.error('❌ Error en GET /api/documentos/[id]/carpeta:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// ============================================================
// 📌 POST - Asignar documento a una carpeta (con Zod + Rate Limiting)
// ============================================================
export async function POST(
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
    const validated = carpetaSchema.parse(body);
    const { carpeta_id } = validated;

    const supabase = await createSupabaseClient();

    // Verificar que el documento existe
    const { data: documento, error: docError } = await supabase
      .from('Documento')
      .select('id')
      .eq('id', id)
      .single();

    if (docError) {
      return NextResponse.json(
        { success: false, error: 'Documento no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que la carpeta existe
    const { data: carpeta, error: carpetaError } = await supabase
      .from('Carpeta')
      .select('id')
      .eq('id', carpeta_id)
      .single();

    if (carpetaError) {
      return NextResponse.json(
        { success: false, error: 'Carpeta no encontrada' },
        { status: 404 }
      );
    }

    // Verificar si ya está asignado
    const { data: existing, error: existingError } = await supabase
      .from('DocumentoCarpeta')
      .select('*')
      .eq('documento_id', id)
      .eq('carpeta_id', carpeta_id)
      .single();

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Documento ya asignado a esta carpeta'
      });
    }

    // Asignar documento a la carpeta
    const { data, error } = await supabase
      .from('DocumentoCarpeta')
      .insert({
        documento_id: id,
        carpeta_id: carpeta_id
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      message: 'Documento asignado a la carpeta exitosamente'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    console.error('❌ Error en POST /api/documentos/[id]/carpeta:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// ============================================================
// 📌 DELETE - Remover documento de una carpeta (con Rate Limiting)
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
    const { searchParams } = new URL(req.url);
    const carpeta_id = searchParams.get('carpeta_id');

    if (!carpeta_id) {
      return NextResponse.json(
        { success: false, error: 'carpeta_id es requerido' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseClient();

    const { error } = await supabase
      .from('DocumentoCarpeta')
      .delete()
      .eq('documento_id', id)
      .eq('carpeta_id', carpeta_id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Documento removido de la carpeta exitosamente'
    });
  } catch (error) {
    console.error('❌ Error en DELETE /api/documentos/[id]/carpeta:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}