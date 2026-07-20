import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// GET: Obtener álbumes de una foto
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createRouteHandlerClient({ cookies });

    // Verificar que la foto existe
    const { data: foto, error: fotoError } = await supabase
      .from('Foto')
      .select('id')
      .eq('id', id)
      .single();

    if (fotoError) {
      return NextResponse.json(
        { success: false, error: 'Foto no encontrada' },
        { status: 404 }
      );
    }

    // Obtener álbumes asociados a la foto
    const { data, error } = await supabase
      .from('AlbumFoto')
      .select(`
        album_id,
        album:album_id (
          id,
          nombre,
          descripcion,
          proyecto_id,
          portada_id,
          created_at
        )
      `)
      .eq('foto_id', id)
      .order('orden', { ascending: true });

    if (error) throw error;

    const albumes = data?.map((item: any) => item.album) || [];

    return NextResponse.json({
      success: true,
      data: albumes
    });
  } catch (error) {
    console.error('❌ Error en GET /api/fotos/[id]/album:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// POST: Agregar foto a un álbum
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { album_id, orden } = body;
    const supabase = createRouteHandlerClient({ cookies });

    if (!album_id) {
      return NextResponse.json(
        { success: false, error: 'album_id es requerido' },
        { status: 400 }
      );
    }

    // Verificar que la foto existe
    const { data: foto, error: fotoError } = await supabase
      .from('Foto')
      .select('id')
      .eq('id', id)
      .single();

    if (fotoError) {
      return NextResponse.json(
        { success: false, error: 'Foto no encontrada' },
        { status: 404 }
      );
    }

    // Verificar que el álbum existe
    const { data: album, error: albumError } = await supabase
      .from('Album')
      .select('id')
      .eq('id', album_id)
      .single();

    if (albumError) {
      return NextResponse.json(
        { success: false, error: 'Álbum no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si ya está en el álbum
    const { data: existing, error: existingError } = await supabase
      .from('AlbumFoto')
      .select('*')
      .eq('foto_id', id)
      .eq('album_id', album_id)
      .single();

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Foto ya está en este álbum'
      });
    }

    // Agregar foto al álbum
    const { data, error } = await supabase
      .from('AlbumFoto')
      .insert({
        foto_id: id,
        album_id: album_id,
        orden: orden || 0
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      message: 'Foto agregada al álbum exitosamente'
    });
  } catch (error) {
    console.error('❌ Error en POST /api/fotos/[id]/album:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// DELETE: Remover foto de un álbum
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const album_id = searchParams.get('album_id');
    const supabase = createRouteHandlerClient({ cookies });

    if (!album_id) {
      return NextResponse.json(
        { success: false, error: 'album_id es requerido' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('AlbumFoto')
      .delete()
      .eq('foto_id', id)
      .eq('album_id', album_id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Foto removida del álbum exitosamente'
    });
  } catch (error) {
    console.error('❌ Error en DELETE /api/fotos/[id]/album:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}