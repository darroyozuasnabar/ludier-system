// app/api/fotos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { rateLimit } from '@/lib/rate-limit';
import { randomUUID } from 'crypto';
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
// 🔥 ESQUEMA ZOD PARA FOTOS
// ============================================================
const fotoSchema = z.object({
  nombre: z.string().min(2, "El nombre es requerido").max(150).optional(),
  descripcion: z.string().max(500).optional(),
  categoria: z.enum(['AVANCE', 'CALIDAD', 'SEGURIDAD', 'INSTALACION', 'FABRICACION', 'ACABADO', 'REUNION', 'OTRO']).default('OTRO'),
  proyecto_id: z.string().uuid().optional().nullable(),
  etiquetas: z.string().optional(),
  ubicacion: z.string().max(200).optional().nullable(),
  fecha_tomada: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Fecha inválida",
  }).optional().nullable(),
  subido_por: z.string().uuid().optional().nullable(),
});

// ============================================================
// 📌 GET - Listar fotos
// ============================================================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoria = searchParams.get('categoria');
    const proyectoId = searchParams.get('proyectoId');
    const search = searchParams.get('search');

    const supabase = await createSupabaseClient();

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

// ============================================================
// 📌 POST - Subir foto (con Zod + Rate Limiting)
// ============================================================
export async function POST(req: NextRequest) {
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

    // 🔥 2. Validar con Zod
    const validated = fotoSchema.parse({
      nombre,
      descripcion,
      categoria,
      proyecto_id: proyectoId,
      etiquetas,
      ubicacion,
      fecha_tomada: fechaTomada,
      subido_por: subidoPor,
    });

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

    const supabase = await createSupabaseClient();

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

    // Obtener URL pública completa
    const { data: urlData } = supabase.storage
      .from('fotos')
      .getPublicUrl(filePath);

    const publicUrl = urlData?.publicUrl;
    console.log('🔗 URL pública:', publicUrl);

    // Guardar en base de datos
    const { data: fotoData, error: fotoError } = await supabase
      .from('Foto')
      .insert({
        nombre: validated.nombre || file.name,
        descripcion: validated.descripcion || null,
        categoria: validated.categoria || 'OTRO',
        proyecto_id: validated.proyecto_id || null,
        url: publicUrl,
        tamanio: file.size,
        extension: extension,
        etiquetas: validated.etiquetas ? validated.etiquetas.split(',').map((e: string) => e.trim()) : [],
        ubicacion: validated.ubicacion || null,
        fecha_tomada: validated.fecha_tomada || null,
        subido_por: validated.subido_por || null,
        fecha_subida: new Date().toISOString(),
        activo: true
      })
      .select()
      .single();

    if (fotoError) {
      console.error('❌ Error guardando en BD:', fotoError);
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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    console.error('❌ Error en POST /api/fotos:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}