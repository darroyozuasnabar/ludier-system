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

// GET: Obtener documento por ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
      .from('Documento')
      .select(`
        *,
        proyecto:proyecto_id (
          id,
          name,
          client
        ),
        subido_por_user:subido_por (
          id,
          name,
          email
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Documento no encontrado' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('❌ Error en GET /api/documentos/[id]:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// PUT: Actualizar documento
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { nombre, descripcion, tipo, proyecto_id, etiquetas } = body;
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
      .from('Documento')
      .update({
        nombre,
        descripcion,
        tipo,
        proyecto_id: proyecto_id || null,
        etiquetas: etiquetas ? etiquetas.split(',').map((e: string) => e.trim()) : [],
        fecha_actualizacion: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Documento no encontrado' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Documento actualizado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error en PUT /api/documentos/[id]:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar documento (soft delete)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
      .from('Documento')
      .update({ activo: false })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Documento no encontrado' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Documento eliminado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error en DELETE /api/documentos/[id]:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}