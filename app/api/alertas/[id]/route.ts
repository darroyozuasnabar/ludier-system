import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// GET - Obtener una notificación específica
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createRouteHandlerClient({ cookies });

    const { data, error } = await supabase
      .from('Notificacion')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Notificación no encontrada' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      notificacion: data
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// PUT - Actualizar notificación (marcar como leída)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { leida, ...rest } = body;
    const supabase = createRouteHandlerClient({ cookies });

    const updateData: any = { ...rest };
    if (leida !== undefined) {
      updateData.leida = leida;
      if (leida === true) {
        updateData.fecha_lectura = new Date().toISOString();
      }
    }

    const { data, error } = await supabase
      .from('Notificacion')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Notificación no encontrada' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      notificacion: data
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar notificación
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createRouteHandlerClient({ cookies });

    const { error } = await supabase
      .from('Notificacion')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Notificación no encontrada' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Notificación eliminada correctamente'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// PATCH - Marcar como leída (más específico)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action } = body;
    const supabase = createRouteHandlerClient({ cookies });

    let updateData: any = {};

    if (action === 'leer') {
      updateData = {
        leida: true,
        fecha_lectura: new Date().toISOString()
      };
    } else if (action === 'desmarcar') {
      updateData = {
        leida: false,
        fecha_lectura: null
      };
    } else {
      return NextResponse.json(
        { success: false, error: 'Acción no válida. Usa "leer" o "desmarcar"' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('Notificacion')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Notificación no encontrada' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      notificacion: data
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}