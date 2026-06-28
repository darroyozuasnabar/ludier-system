import { NextRequest, NextResponse } from 'next/server';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    if (action === 'generar') {
      console.log('🔍 Generando alertas...');

      // Obtener TODOS los items del inventario
      const { data: inventario, error } = await supabase
        .from("Inventario")
        .select("*");

      if (error) {
        console.error('❌ Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      // Filtrar en JavaScript (NO en la base de datos)
      const itemsCriticos = inventario.filter((item: any) => 
        item.cantidad < item.stock_minimo
      );

      console.log(`📦 Items con stock crítico: ${itemsCriticos.length}`);

      const alertasGeneradas = [];

      // Crear notificaciones para items críticos
      for (const item of itemsCriticos) {
        const { data: notif } = await supabase
          .from('Notificacion')
          .insert({
            titulo: '📦 Stock crítico',
            mensaje: `"${item.nombre}" tiene stock crítico (${item.cantidad} ${item.unidad || 'unidades'}). Mínimo requerido: ${item.stock_minimo} ${item.unidad || 'unidades'}. Ubicación: ${item.ubicacion}.`,
            tipo: 'URGENTE',
            categoria: 'COMPRAS',
            leida: false,
            fecha_creacion: new Date().toISOString(),
            enlace: '/inventario',
            accion: 'alerta_inventario_bajo',
            entidad_id: item.id,
            entidad_tipo: 'inventario'
          })
          .select()
          .single();

        if (notif) alertasGeneradas.push(notif);
      }

      // Notificación de confirmación
      const { data: confirmacion } = await supabase
        .from('Notificacion')
        .insert({
          titulo: '🟢 Sistema de alertas activo',
          mensaje: `El sistema generó ${alertasGeneradas.length} alertas de stock crítico.`,
          tipo: 'INFO',
          categoria: 'SISTEMA',
          leida: false,
          fecha_creacion: new Date().toISOString(),
          enlace: '/alertas',
          accion: 'sistema_activo'
        })
        .select()
        .single();

      if (confirmacion) alertasGeneradas.push(confirmacion);

      return NextResponse.json({
        success: true,
        alertas_generadas: alertasGeneradas.length,
        alertas: alertasGeneradas,
        debug: {
          total_items: inventario.length,
          items_criticos: itemsCriticos.length,
          items_criticos_lista: itemsCriticos.map((i: any) => i.nombre)
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'API de alertas funcionando' 
    });
  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tipo, titulo, mensaje, categoria, enlace } = body;

    if (!titulo || !mensaje || !tipo) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const { data: notificacion, error } = await supabase
      .from('Notificacion')
      .insert({
        titulo,
        mensaje,
        tipo,
        categoria: categoria || 'SISTEMA',
        leida: false,
        fecha_creacion: new Date().toISOString(),
        enlace: enlace || null
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      notificacion
    });
  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}