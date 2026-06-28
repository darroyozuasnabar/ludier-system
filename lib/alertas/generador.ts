import { crearNotificacion, countNotificacionesNoLeidas } from './index';
import { REGLAS_PREDEFINIDAS } from './reglas';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Verificar condiciones y generar alertas
export async function verificarYGenerarAlertas() {
  const alertasGeneradas: any[] = [];

  // 1. Verificar producción diaria
  await verificarProduccionDiaria(alertasGeneradas);

  // 2. Verificar órdenes próximas a vencer
  await verificarOrdenesVencimiento(alertasGeneradas);

  // 3. Verificar inventario bajo (CORREGIDO)
  await verificarInventarioBajo(alertasGeneradas);

  // 4. Verificar contratos nuevos
  await verificarContratosNuevos(alertasGeneradas);

  // 5. Verificar facturas pendientes
  await verificarFacturasPendientes(alertasGeneradas);

  return alertasGeneradas;
}

// 1. Verificar producción diaria
async function verificarProduccionDiaria(alertas: any[]) {
  try {
    const hoy = new Date().toISOString().split('T')[0];
    const { data: produccion } = await supabase
      .from('ProduccionDiaria')
      .select('*')
      .eq('fecha', hoy);

    if (!produccion || produccion.length === 0) return;

    const total = produccion.reduce((sum, p) => sum + (p.cantidad || 0), 0);

    if (total < 10) {
      const notif = await crearNotificacion({
        titulo: '⚠️ Producción baja',
        mensaje: `La producción del día de hoy (${total} unidades) está por debajo del mínimo esperado (10 unidades). Revisar rendimiento del equipo.`,
        tipo: 'URGENTE',
        categoria: 'PRODUCCION',
        enlace: '/produccion',
        accion: 'alerta_produccion_baja'
      });
      if (notif) alertas.push(notif);
    }

    if (total > 15) {
      const notif = await crearNotificacion({
        titulo: '🏆 Producción excelente',
        mensaje: `Excelente trabajo! La producción del día de hoy alcanzó ${total} unidades.`,
        tipo: 'EXITO',
        categoria: 'PRODUCCION',
        enlace: '/produccion',
        accion: 'alerta_produccion_alta'
      });
      if (notif) alertas.push(notif);
    }
  } catch (error) {
    console.error('Error verificando producción diaria:', error);
  }
}

// 2. Verificar órdenes próximas a vencer
async function verificarOrdenesVencimiento(alertas: any[]) {
  try {
    const hoy = new Date();
    const dentroDe3Dias = new Date(hoy);
    dentroDe3Dias.setDate(dentroDe3Dias.getDate() + 3);

    const { data: ordenes } = await supabase
      .from('OrdenProduccion')
      .select('*')
      .eq('estado', 'EN_PRODUCCION')
      .gte('fechafin', hoy.toISOString().split('T')[0])
      .lte('fechafin', dentroDe3Dias.toISOString().split('T')[0]);

    if (!ordenes || ordenes.length === 0) return;

    for (const orden of ordenes) {
      const diasRestantes = Math.ceil(
        (new Date(orden.fechafin).getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
      );

      const notif = await crearNotificacion({
        titulo: '⏰ Orden próxima a vencer',
        mensaje: `La orden "${orden.nombre}" vence en ${diasRestantes} días (${orden.fechafin}). Priorizar su finalización.`,
        tipo: 'ALERTA',
        categoria: 'PRODUCCION',
        enlace: `/produccion/${orden.id}`,
        accion: 'alerta_vencimiento',
        entidad_id: orden.id,
        entidad_tipo: 'orden_produccion'
      });
      if (notif) alertas.push(notif);
    }
  } catch (error) {
    console.error('Error verificando vencimientos:', error);
  }
}

// 3. Verificar inventario bajo (CORREGIDO)
async function verificarInventarioBajo(alertas: any[]) {
  try {
    // Obtener items donde cantidad < stock_minimo
    const { data: inventario } = await supabase
      .from("Inventario")
      .select("*")
      .lt("cantidad", "stock_minimo"); // ⬅️ CORREGIDO

    if (!inventario || inventario.length === 0) return;

    for (const item of inventario) {
      const notif = await crearNotificacion({
        titulo: '📦 Stock crítico',
        mensaje: `"${item.nombre}" tiene stock crítico (${item.cantidad} ${item.unidad}). Mínimo requerido: ${item.stock_minimo} ${item.unidad}. Ubicación: ${item.ubicacion}.`,
        tipo: 'URGENTE',
        categoria: 'COMPRAS',
        enlace: '/inventario',
        accion: 'alerta_inventario_bajo',
        entidad_id: item.id,
        entidad_tipo: 'inventario'
      });
      if (notif) alertas.push(notif);
    }
  } catch (error) {
    console.error('Error verificando inventario:', error);
  }
}

// 4. Verificar contratos nuevos
async function verificarContratosNuevos(alertas: any[]) {
  try {
    const hoy = new Date().toISOString().split('T')[0];
    const { data: contratos } = await supabase
      .from('Contrato')
      .select('*')
      .gte('fecha_creacion', hoy);

    if (!contratos || contratos.length === 0) return;

    for (const contrato of contratos) {
      const notif = await crearNotificacion({
        titulo: '📄 Nuevo contrato registrado',
        mensaje: `Se ha registrado el contrato "${contrato.nombre}" por S/ ${contrato.monto?.toLocaleString() || '0'} para el cliente ${contrato.cliente}.`,
        tipo: 'INFO',
        categoria: 'OBRA',
        enlace: `/obras/${contrato.id}`,
        accion: 'nuevo_contrato',
        entidad_id: contrato.id,
        entidad_tipo: 'contrato'
      });
      if (notif) alertas.push(notif);
    }
  } catch (error) {
    console.error('Error verificando contratos nuevos:', error);
  }
}

// 5. Verificar facturas pendientes
async function verificarFacturasPendientes(alertas: any[]) {
  try {
    const hoy = new Date();
    const hace15Dias = new Date(hoy);
    hace15Dias.setDate(hace15Dias.getDate() - 15);

    const { data: facturas } = await supabase
      .from('Factura')
      .select('*')
      .eq('estado', 'PENDIENTE')
      .lt('fecha_vencimiento', hoy.toISOString().split('T')[0])
      .gte('fecha_vencimiento', hace15Dias.toISOString().split('T')[0]);

    if (!facturas || facturas.length === 0) return;

    for (const factura of facturas) {
      const diasVencidos = Math.ceil(
        (hoy.getTime() - new Date(factura.fecha_vencimiento).getTime()) / (1000 * 60 * 60 * 24)
      );

      const notif = await crearNotificacion({
        titulo: '💰 Factura vencida',
        mensaje: `La factura "${factura.numero}" del cliente ${factura.cliente} tiene ${diasVencidos} días de vencimiento.`,
        tipo: 'ALERTA',
        categoria: 'FINANZAS',
        enlace: `/finanzas/${factura.id}`,
        accion: 'factura_vencida',
        entidad_id: factura.id,
        entidad_tipo: 'factura'
      });
      if (notif) alertas.push(notif);
    }
  } catch (error) {
    console.error('Error verificando facturas:', error);
  }
}

// Función para generar alerta específica - Orden completada
export async function generarAlertaOrdenCompletada(orden: any) {
  return await crearNotificacion({
    titulo: '✅ Orden completada',
    mensaje: `La orden "${orden.nombre}" ha sido completada exitosamente. Producción: ${orden.cantidad} ${orden.unidad}.`,
    tipo: 'EXITO',
    categoria: 'PRODUCCION',
    enlace: `/produccion/${orden.id}`,
    accion: 'orden_completada',
    entidad_id: orden.id,
    entidad_tipo: 'orden_produccion'
  });
}

export async function generarAlertaOrdenEnProceso(orden: any) {
  return await crearNotificacion({
    titulo: '🔄 Orden en producción',
    mensaje: `La orden "${orden.nombre}" ha iniciado su producción.`,
    tipo: 'INFO',
    categoria: 'PRODUCCION',
    enlace: `/produccion/${orden.id}`,
    accion: 'orden_proceso',
    entidad_id: orden.id,
    entidad_tipo: 'orden_produccion'
  });
}