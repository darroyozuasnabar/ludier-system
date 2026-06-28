import { NextRequest, NextResponse } from 'next/server';
import { createBrowserClient } from '@supabase/ssr';
import { randomUUID } from 'crypto';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: Listar documentos
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tipo = searchParams.get('tipo');
    const proyectoId = searchParams.get('proyectoId');
    const search = searchParams.get('search');

    let query = supabase
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
      .eq('activo', true)
      .order('fecha_subida', { ascending: false });

    if (tipo && tipo !== 'ALL') {
      query = query.eq('tipo', tipo);
    }

    if (proyectoId && proyectoId !== 'ALL') {
      query = query.eq('proyecto_id', proyectoId);
    }

    if (search) {
      query = query.ilike('nombre', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      total: data?.length || 0
    });
  } catch (error) {
    console.error('❌ Error en GET /api/documentos:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// POST: Subir documento
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const file = formData.get('file') as File;
    const nombre = formData.get('nombre') as string;
    const descripcion = formData.get('descripcion') as string;
    const tipo = formData.get('tipo') as string;
    const proyectoId = formData.get('proyecto_id') as string;
    const etiquetas = formData.get('etiquetas') as string;
    const subidoPor = formData.get('subido_por') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Archivo requerido' },
        { status: 400 }
      );
    }

    // 🔧 CORREGIDO: Generar nombre único para el archivo
    const extension = file.name.split('.').pop();
    const fileName = `${randomUUID()}.${extension}`;
    
    // 🔧 CORREGIDO: Ruta dentro del bucket (sin "documentos/" al inicio)
    const filePath = `uploads/${fileName}`;

    console.log('📤 Subiendo archivo:', { fileName, filePath, bucket: 'documentos' });

    // Subir a Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documentos')
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

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('documentos')
      .getPublicUrl(filePath);

    console.log('🔗 URL pública:', urlData?.publicUrl);

    // Guardar en base de datos
    const { data: docData, error: docError } = await supabase
      .from('Documento')
      .insert({
        nombre: nombre || file.name,
        descripcion: descripcion || null,
        tipo: tipo || 'OTRO',
        proyecto_id: proyectoId || null,
        url: filePath,
        tamanio: file.size,
        extension: extension,
        version: 1,
        etiquetas: etiquetas ? etiquetas.split(',').map((e: string) => e.trim()) : [],
        subido_por: subidoPor || null,
        fecha_subida: new Date().toISOString(),
        activo: true
      })
      .select()
      .single();

    if (docError) {
      console.error('❌ Error guardando en BD:', docError);
      // Si falla, eliminar el archivo de storage
      await supabase.storage.from('documentos').remove([filePath]);
      throw docError;
    }

    console.log('✅ Documento guardado en BD:', docData);

    return NextResponse.json({
      success: true,
      data: docData,
      message: 'Documento subido exitosamente'
    });
  } catch (error) {
    console.error('❌ Error en POST /api/documentos:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}