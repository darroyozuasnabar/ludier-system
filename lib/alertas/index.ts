import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Tipos
export type Notificacion = {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: 'INFO' | 'ALERTA' | 'URGENTE' | 'EXITO' | 'ADVERTENCIA';
  categoria: 'PRODUCCION' | 'OBRA' | 'COMPRAS' | 'PERSONAL' | 'FINANZAS' | 'SISTEMA';
  leida: boolean;
  fecha_creacion: string;
  fecha_lectura?: string;
  usuario_id?: string;
  enlace?: string;
  accion?: string;
  entidad_id?: string;
  entidad_tipo?: string;
  created_at: string;
  updated_at: string;
};

export type ReglaAlerta = {
  id: string;
  nombre: string;
  tipo: string;
  condicion: any;
  mensaje: string;
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  activa: boolean;
  frecuencia: 'INMEDIATA' | 'DIARIA' | 'SEMANAL';
  destinatarios: string[];
  created_at: string;
  updated_at: string;
};

// Crear notificación
export async function crearNotificacion(data: {
  titulo: string;
  mensaje: string;
  tipo: Notificacion['tipo'];
  categoria: Notificacion['categoria'];
  usuario_id?: string;
  enlace?: string;
  accion?: string;
  entidad_id?: string;
  entidad_tipo?: string;
}): Promise<Notificacion | null> {
  try {
    const { data: notif, error } = await supabase
      .from('Notificacion')
      .insert({
        titulo: data.titulo,
        mensaje: data.mensaje,
        tipo: data.tipo,
        categoria: data.categoria,
        usuario_id: data.usuario_id || null,
        enlace: data.enlace || null,
        accion: data.accion || null,
        entidad_id: data.entidad_id || null,
        entidad_tipo: data.entidad_tipo || null,
        leida: false,
        fecha_creacion: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return notif;
  } catch (error) {
    console.error('Error creando notificación:', error);
    return null;
  }
}

// Obtener notificaciones no leídas
export async function getNotificacionesNoLeidas(usuarioId?: string): Promise<Notificacion[]> {
  try {
    let query = supabase
      .from('Notificacion')
      .select('*')
      .eq('leida', false)
      .order('fecha_creacion', { ascending: false });

    if (usuarioId) {
      query = query.or(`usuario_id.eq.${usuarioId},usuario_id.is.null`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error obteniendo notificaciones no leídas:', error);
    return [];
  }
}

// Contar notificaciones no leídas
export async function countNotificacionesNoLeidas(usuarioId?: string): Promise<number> {
  try {
    let query = supabase
      .from('Notificacion')
      .select('*', { count: 'exact', head: true })
      .eq('leida', false);

    if (usuarioId) {
      query = query.or(`usuario_id.eq.${usuarioId},usuario_id.is.null`);
    }

    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error contando notificaciones:', error);
    return 0;
  }
}

// Marcar como leída
export async function marcarComoLeida(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('Notificacion')
      .update({ leida: true, fecha_lectura: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marcando como leída:', error);
    return false;
  }
}