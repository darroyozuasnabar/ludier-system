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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
      .from('Foto')
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
          { success: false, error: 'Foto no encontrada' },
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
    console.error('❌ Error en GET /api/fotos/[id]:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { nombre, descripcion, categoria, proyecto_id, etiquetas, ubicacion, fecha_tomada } = body;
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
      .from('Foto')
      .update({
        nombre,
        descripcion,
        categoria,
        proyecto_id: proyecto_id || null,
        etiquetas: etiquetas ? etiquetas.split(',').map((e: string) => e.trim()) : [],
        ubicacion: ubicacion || null,
        fecha_tomada: fecha_tomada || null,
        fecha_subida: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Foto no encontrada' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Foto actualizada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error en PUT /api/fotos/[id]:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
      .from('Foto')
      .update({ activo: false })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Foto no encontrada' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Foto eliminada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error en DELETE /api/fotos/[id]:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}