import { ReglaAlerta } from './index';

// Reglas de alertas predefinidas
export const REGLAS_PREDEFINIDAS: Omit<ReglaAlerta, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    nombre: 'Baja producción diaria',
    tipo: 'PRODUCCION',
    condicion: {
      tipo: 'produccion_baja',
      umbral: 10, // menos de 10 unidades/día
      metric: 'cantidad_diaria'
    },
    mensaje: 'La producción diaria ha caído por debajo de 10 unidades. Revisar el rendimiento del equipo.',
    prioridad: 'ALTA',
    activa: true,
    frecuencia: 'INMEDIATA',
    destinatarios: ['supervisor', 'produccion']
  },
  {
    nombre: 'Alta productividad',
    tipo: 'PRODUCCION',
    condicion: {
      tipo: 'produccion_alta',
      umbral: 15,
      metric: 'cantidad_diaria'
    },
    mensaje: 'Excelente rendimiento! La producción superó las 15 unidades diarias.',
    prioridad: 'MEDIA',
    activa: true,
    frecuencia: 'INMEDIATA',
    destinatarios: ['produccion', 'supervisor']
  },
  {
    nombre: 'Orden completada',
    tipo: 'PRODUCCION',
    condicion: {
      tipo: 'estado_cambiado',
      estado_anterior: 'EN_PRODUCCION',
      estado_nuevo: 'COMPLETADO'
    },
    mensaje: 'La orden de producción {nombre} ha sido completada exitosamente.',
    prioridad: 'BAJA',
    activa: true,
    frecuencia: 'INMEDIATA',
    destinatarios: ['supervisor', 'administracion']
  },
  {
    nombre: 'Retraso en orden',
    tipo: 'PRODUCCION',
    condicion: {
      tipo: 'fecha_vencimiento',
      dias_restantes: 3
    },
    mensaje: 'La orden {nombre} tiene menos de 3 días para su fecha de entrega estimada.',
    prioridad: 'ALTA',
    activa: true,
    frecuencia: 'DIARIA',
    destinatarios: ['supervisor', 'produccion']
  },
  {
    nombre: 'Stock crítico',
    tipo: 'COMPRAS',
    condicion: {
      tipo: 'inventario_bajo',
      umbral: 5
    },
    mensaje: 'El inventario de {producto} está por debajo del mínimo. Revisar stock.',
    prioridad: 'URGENTE',
    activa: true,
    frecuencia: 'INMEDIATA',
    destinatarios: ['compras', 'supervisor']
  },
  {
    nombre: 'Nuevo contrato registrado',
    tipo: 'OBRA',
    condicion: {
      tipo: 'nuevo_contrato'
    },
    mensaje: 'Se ha registrado un nuevo contrato: {cliente} - {proyecto} por S/ {monto}.',
    prioridad: 'BAJA',
    activa: true,
    frecuencia: 'INMEDIATA',
    destinatarios: ['administracion', 'supervisor']
  },
  {
    nombre: 'Factura pendiente de pago',
    tipo: 'FINANZAS',
    condicion: {
      tipo: 'factura_vencida',
      dias_vencimiento: 15
    },
    mensaje: 'La factura {numero} del cliente {cliente} tiene más de 15 días de vencimiento.',
    prioridad: 'ALTA',
    activa: true,
    frecuencia: 'DIARIA',
    destinatarios: ['administracion', 'finanzas']
  },
  {
    nombre: 'Alerta de calidad',
    tipo: 'CALIDAD',
    condicion: {
      tipo: 'defectos',
      umbral: 3
    },
    mensaje: 'Se han detectado {cantidad} defectos en el control de calidad. Revisar proceso.',
    prioridad: 'ALTA',
    activa: true,
    frecuencia: 'INMEDIATA',
    destinatarios: ['supervisor', 'calidad']
  }
];

// Obtener reglas por tipo
export function getReglasByTipo(tipo: string): typeof REGLAS_PREDEFINIDAS {
  return REGLAS_PREDEFINIDAS.filter(r => r.tipo === tipo);
}

// Obtener regla por nombre
export function getReglaByNombre(nombre: string): typeof REGLAS_PREDEFINIDAS[0] | undefined {
  return REGLAS_PREDEFINIDAS.find(r => r.nombre === nombre);
}