// app/api/fotos/[id]/album/route.ts
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
const albumFotoSchema = z.object({
  album_id: z.string().uuid("ID de álbum inválido"),
  orden: z.number().int().min(0).default(0),
});

// ============================================================
// 📌 GET - Obtener álbumes de una foto
// ============================================================
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseClient();

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

// ============================================================
// 📌 POST - Agregar foto a álbum (con Zod + Rate Limiting)
// ============================================================
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🔥 1. Rate Limiting
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
    const validated = albumFotoSchema.parse(body);
    const { album_id, orden } = validated;

    const supabase = await createSupabaseClient();

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

    // Verificar si ya está asignado
    const { data: existing } = await supabase
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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    console.error('❌ Error en POST /api/fotos/[id]/album:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// ============================================================
// 📌 DELETE - Remover foto de álbum (con Rate Limiting)
// ============================================================
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🔥 1. Rate Limiting
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
    const album_id = searchParams.get('album_id');
    const supabase = await createSupabaseClient();

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