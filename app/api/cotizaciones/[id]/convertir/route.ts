import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { project_name, fecha_inicio, fecha_fin_estimada } = body;
    const supabase = createRouteHandlerClient({ cookies });

    // 1. Obtener la cotización con sus items
    const { data: cotizacion, error: cotizacionError } = await supabase
      .from('Cotizacion')
      .select(`
        *,
        items:CotizacionItem(*)
      `)
      .eq('id', id)
      .single();

    if (cotizacionError) {
      return NextResponse.json(
        { success: false, error: 'Cotización no encontrada' },
        { status: 404 }
      );
    }

    // Validar que esté aprobada
    if (cotizacion.estado !== 'APROBADA') {
      return NextResponse.json(
        { success: false, error: 'Solo se pueden convertir cotizaciones aprobadas' },
        { status: 400 }
      );
    }

    // 2. Crear el proyecto (obra)
    const projectName = project_name || `Obra - ${cotizacion.cliente} - ${new Date().getFullYear()}`;

    const { data: project, error: projectError } = await supabase
      .from('Project')
      .insert({
        name: projectName,
        client: cotizacion.cliente,
        clientType: 'INMOBILIARIA',
        valorization: cotizacion.total,
        status: 'ACTIVO',
        startDate: fecha_inicio || new Date().toISOString(),
        expectedEndDate: fecha_fin_estimada || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        location: cotizacion.cliente_direccion || 'Por definir',
        description: `Obra generada desde cotización ${cotizacion.numero} - ${cotizacion.cliente}`
      })
      .select()
      .single();

    if (projectError) throw projectError;

    // 3. Crear el contrato asociado
    const { data: contrato, error: contratoError } = await supabase
      .from('Contrato')
      .insert({
        project_id: project.id,
        nombre: `Contrato - ${projectName}`,
        monto: cotizacion.total,
        fecha: new Date().toISOString().split('T')[0],
        estado: 'ACTIVO',
        tipo: 'CONTRATO',
        orden_estrategico: 999
      })
      .select()
      .single();

    if (contratoError) throw contratoError;

    // 4. Actualizar la cotización
    const { data: cotizacionActualizada, error: updateError } = await supabase
      .from('Cotizacion')
      .update({
        estado: 'CONVERTIDA_A_OBRA',
        project_id: project.id,
        fecha_conversion: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    // 5. Registrar seguimiento
    await supabase
      .from('CotizacionSeguimiento')
      .insert({
        cotizacion_id: id,
        tipo: 'NOTA',
        descripcion: `Cotización convertida a obra: ${projectName} (Contrato: ${contrato.id})`,
        fecha: new Date().toISOString()
      });

    return NextResponse.json({
      success: true,
      data: {
        cotizacion: cotizacionActualizada,
        project,
        contrato
      },
      message: 'Cotización convertida a obra exitosamente'
    });
  } catch (error) {
    console.error('❌ Error en POST /api/cotizaciones/[id]/convertir:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}