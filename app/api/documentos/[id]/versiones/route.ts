import { NextRequest, NextResponse } from 'next/server';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: Obtener versiones de un documento
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Verificar que el documento existe
    const { data: documento, error: docError } = await supabase
      .from('Documento')
      .select('id, nombre')
      .eq('id', id)
      .single();

    if (docError) {
      return NextResponse.json(
        { success: false, error: 'Documento no encontrado' },
        { status: 404 }
      );
    }

    // Obtener versiones
    const { data, error } = await supabase
      .from('DocumentoVersion')
      .select(`
        *,
        subido_por_user:subido_por (
          id,
          name,
          email
        )
      `)
      .eq('documento_id', id)
      .order('version', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data || [],
      documento: documento
    });
  } catch (error) {
    console.error('❌ Error en GET /api/documentos/[id]/versiones:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// POST: Crear nueva versión del documento
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const formData = await req.formData();
    
    const file = formData.get('file') as File;
    const comentario = formData.get('comentario') as string;
    const subidoPor = formData.get('subido_por') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Archivo requerido' },
        { status: 400 }
      );
    }

    // Verificar que el documento existe
    const { data: documento, error: docError } = await supabase
      .from('Documento')
      .select('id, nombre, url, version')
      .eq('id', id)
      .single();

    if (docError) {
      return NextResponse.json(
        { success: false, error: 'Documento no encontrado' },
        { status: 404 }
      );
    }

    // Subir nuevo archivo a Storage
    const extension = file.name.split('.').pop();
    const fileName = `${id}/v${documento.version + 1}.${extension}`;
    const filePath = `documentos/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documentos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('documentos')
      .getPublicUrl(filePath);

    // Guardar versión en la tabla de versiones
    const { data: versionData, error: versionError } = await supabase
      .from('DocumentoVersion')
      .insert({
        documento_id: id,
        version: documento.version + 1,
        url: filePath,
        tamanio: file.size,
        comentario: comentario || null,
        subido_por: subidoPor || null,
        fecha_subida: new Date().toISOString()
      })
      .select()
      .single();

    if (versionError) {
      // Si falla, eliminar el archivo de storage
      await supabase.storage.from('documentos').remove([filePath]);
      throw versionError;
    }

    // Actualizar el documento principal
    const { error: updateError } = await supabase
      .from('Documento')
      .update({
        url: filePath,
        tamanio: file.size,
        version: documento.version + 1,
        fecha_actualizacion: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) {
      // Si falla, eliminar la versión creada y el archivo
      await supabase.from('DocumentoVersion').delete().eq('id', versionData.id);
      await supabase.storage.from('documentos').remove([filePath]);
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      data: versionData,
      message: `Versión v${documento.version + 1} creada exitosamente`
    });
  } catch (error) {
    console.error('❌ Error en POST /api/documentos/[id]/versiones:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}