import { NextRequest, NextResponse } from 'next/server';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: Obtener cotización por ID con sus items
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // 🔥 Cambio: Promise
) {
  try {
    // 🔥 CORRECCIÓN: Await params
    const { id } = await params;

    // Obtener cotización
    const { data: cotizacion, error: cotizacionError } = await supabase
      .from('Cotizacion')
      .select(`
        *,
        project:project_id (
          id,
          name,
          client,
          location
        ),
        creador:creado_por (
          id,
          name,
          email
        )
      `)
      .eq('id', id)
      .single();

    if (cotizacionError) {
      if (cotizacionError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Cotización no encontrada' },
          { status: 404 }
        );
      }
      throw cotizacionError;
    }

    // Obtener items
    const { data: items, error: itemsError } = await supabase
      .from('CotizacionItem')
      .select('*')
      .eq('cotizacion_id', id)
      .order('orden', { ascending: true });

    if (itemsError) {
      console.error('Error cargando items:', itemsError);
    }

    // Obtener seguimiento
    const { data: seguimiento, error: seguimientoError } = await supabase
      .from('CotizacionSeguimiento')
      .select('*')
      .eq('cotizacion_id', id)
      .order('fecha', { ascending: false });

    if (seguimientoError) {
      console.error('Error cargando seguimiento:', seguimientoError);
    }

    return NextResponse.json({
      success: true,
      data: {
        ...cotizacion,
        items: items || [],
        seguimiento: seguimiento || []
      }
    });
  } catch (error) {
    console.error('❌ Error en GET /api/cotizaciones/[id]:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// PUT: Actualizar cotización
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // 🔥 Cambio: Promise
) {
  try {
    const { id } = await params;  // 🔥 Await params
    const body = await req.json();
    // ... resto del código
  } catch (error) {
    // ...
  }
}

// DELETE: Eliminar cotización
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // 🔥 Cambio: Promise
) {
  try {
    const { id } = await params;  // 🔥 Await params
    // ... resto del código
  } catch (error) {
    // ...
  }
}