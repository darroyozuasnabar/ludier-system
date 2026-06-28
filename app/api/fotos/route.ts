import { NextRequest, NextResponse } from 'next/server';
import { createBrowserClient } from '@supabase/ssr';
import { randomUUID } from 'crypto';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: Listar fotos
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoria = searchParams.get('categoria');
    const proyectoId = searchParams.get('proyectoId');
    const search = searchParams.get('search');

    let query = supabase
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
      .eq('activo', true)
      .order('fecha_subida', { ascending: false });

    if (categoria && categoria !== 'ALL') {
      query = query.eq('categoria', categoria);
    }

    if (proyectoId && proyectoId !== 'ALL') {
      query = query.eq('proyecto_id', proyectoId);
    }

    if (search) {
      query = query.or(`nombre.ilike.%${search}%,descripcion.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      total: data?.length || 0
    });
  } catch (error) {
    console.error('❌ Error en GET /api/fotos:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// POST: Subir foto
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const file = formData.get('file') as File;
    const nombre = formData.get('nombre') as string;
    const descripcion = formData.get('descripcion') as string;
    const categoria = formData.get('categoria') as string;
    const proyectoId = formData.get('proyecto_id') as string;
    const etiquetas = formData.get('etiquetas') as string;
    const ubicacion = formData.get('ubicacion') as string;
    const fechaTomada = formData.get('fecha_tomada') as string;
    const subidoPor = formData.get('subido_por') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Archivo requerido' },
        { status: 400 }
      );
    }

    // Verificar que es una imagen
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'El archivo debe ser una imagen' },
        { status: 400 }
      );
    }

    const extension = file.name.split('.').pop();
    const fileName = `${randomUUID()}.${extension}`;
    const filePath = `uploads/${fileName}`;

    console.log('📤 Subiendo foto:', { fileName, filePath });

    // Subir a Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('fotos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Error subiendo a storage:', uploadError);
      return NextResponse.json(
        { success: false, error: uploadError.message || 'Error al subir archivo' },
        { status: 500 }
      );
    }

    console.log('✅ Archivo subido a storage:', uploadData);

    // 🔧 OBTENER URL PÚBLICA COMPLETA
    const { data: urlData } = supabase.storage
      .from('fotos')
      .getPublicUrl(filePath);

    const publicUrl = urlData?.publicUrl;
    console.log('🔗 URL pública:', publicUrl);

    // Guardar en base de datos con URL pública
    const { data: fotoData, error: fotoError } = await supabase
      .from('Foto')
      .insert({
        nombre: nombre || file.name,
        descripcion: descripcion || null,
        categoria: categoria || 'OTRO',
        proyecto_id: proyectoId || null,
        url: publicUrl, // 🔧 URL pública completa
        tamanio: file.size,
        extension: extension,
        etiquetas: etiquetas ? etiquetas.split(',').map((e: string) => e.trim()) : [],
        ubicacion: ubicacion || null,
        fecha_tomada: fechaTomada || null,
        subido_por: subidoPor || null,
        fecha_subida: new Date().toISOString(),
        activo: true
      })
      .select()
      .single();

    if (fotoError) {
      console.error('❌ Error guardando en BD:', fotoError);
      // Si falla, eliminar el archivo de storage
      await supabase.storage.from('fotos').remove([filePath]);
      throw fotoError;
    }

    console.log('✅ Foto guardada en BD:', fotoData);

    return NextResponse.json({
      success: true,
      data: fotoData,
      message: 'Foto subida exitosamente'
    });
  } catch (error) {
    console.error('❌ Error en POST /api/fotos:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}