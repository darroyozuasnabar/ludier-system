'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  BellOff, 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  X,
  Loader2
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: 'INFO' | 'ALERTA' | 'URGENTE' | 'EXITO' | 'ADVERTENCIA';
  leida: boolean;
  fecha_creacion: string;
  enlace?: string;
}

const TIPO_CONFIG: Record<string, { icon: any; color: string; bg: string; border: string }> = {
  URGENTE: { icon: Flame, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
  ALERTA: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
  EXITO: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  INFO: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
  ADVERTENCIA: { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
};

export default function NotificacionesTiempoReal() {
  const router = useRouter();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const [mostrarPanel, setMostrarPanel] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar notificaciones no leídas
  const cargarNotificaciones = async () => {
    setCargando(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('Notificacion')
        .select('*')
        .eq('leida', false)
        .order('fecha_creacion', { ascending: false })
        .limit(10);

      if (error) throw error;
      setNotificaciones(data || []);
      setNoLeidas(data?.length || 0);
    } catch (error: any) {
      console.error('Error cargando notificaciones:', error);
      setError('Error al cargar notificaciones');
    } finally {
      setCargando(false);
    }
  };

  // Marcar como leída
  const marcarLeida = async (id: string) => {
    try {
      const { error } = await supabase
        .from('Notificacion')
        .update({ leida: true, fecha_lectura: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      setNotificaciones(prev => prev.filter(n => n.id !== id));
      setNoLeidas(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marcando como leída:', error);
    }
  };

  // Marcar todas como leídas
  const marcarTodas = async () => {
    try {
      const { error } = await supabase
        .from('Notificacion')
        .update({ leida: true, fecha_lectura: new Date().toISOString() })
        .eq('leida', false);

      if (error) throw error;
      
      setNotificaciones([]);
      setNoLeidas(0);
    } catch (error) {
      console.error('Error marcando todas:', error);
    }
  };

  // Suscripción en tiempo real
  useEffect(() => {
    cargarNotificaciones();

    // Escuchar cambios en Notificacion
    const subscription = supabase
      .channel('notificaciones-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Notificacion',
        },
        (payload) => {
          const nueva = payload.new as Notificacion;
          if (!nueva.leida) {
            setNotificaciones(prev => [nueva, ...prev].slice(0, 10));
            setNoLeidas(prev => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Cerrar panel al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.notificaciones-panel')) {
        setMostrarPanel(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleNotificacionClick = (notif: Notificacion) => {
    if (!notif.leida) {
      marcarLeida(notif.id);
    }
    if (notif.enlace) {
      router.push(notif.enlace);
      setMostrarPanel(false);
    }
  };

  return (
    <div className="relative notificaciones-panel">
      {/* Botón campana */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setMostrarPanel(!mostrarPanel);
        }}
        className="relative p-2 rounded-lg hover:bg-zinc-100 transition-colors"
        aria-label="Notificaciones"
      >
        <Bell className="h-5 w-5 text-zinc-600" />
        {noLeidas > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse">
            {noLeidas > 9 ? '9+' : noLeidas}
          </span>
        )}
      </button>

      {/* Panel desplegable */}
      {mostrarPanel && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-zinc-100 overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between bg-white">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Notificaciones {noLeidas > 0 && `(${noLeidas} nuevas)`}
            </h3>
            <div className="flex items-center gap-1">
              {noLeidas > 0 && (
                <button
                  onClick={marcarTodas}
                  className="text-[10px] text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Leer todas
                </button>
              )}
              <button
                onClick={() => setMostrarPanel(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded hover:bg-zinc-100 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Lista de notificaciones */}
          <div className="max-h-80 overflow-y-auto">
            {cargando ? (
              <div className="p-4 text-center">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-400 mx-auto" />
                <p className="text-xs text-zinc-400 mt-1">Cargando...</p>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500 text-xs">
                {error}
              </div>
            ) : notificaciones.length === 0 ? (
              <div className="p-8 text-center">
                <BellOff className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
                <p className="text-sm text-zinc-400">Sin notificaciones</p>
                <p className="text-xs text-zinc-300">Todo al día!</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {notificaciones.map((notif) => {
                  const config = TIPO_CONFIG[notif.tipo] || TIPO_CONFIG.INFO;
                  const Icon = config.icon;

                  return (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificacionClick(notif)}
                      className={`p-3 hover:bg-zinc-50 transition-colors cursor-pointer ${
                        !notif.leida ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`p-1 rounded-lg shrink-0 ${config.bg}`}>
                          <Icon className={`h-4 w-4 ${config.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-zinc-900 truncate">
                            {notif.titulo}
                          </p>
                          <p className="text-[11px] text-zinc-600 line-clamp-2">
                            {notif.mensaje}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] text-zinc-400">
                              {new Date(notif.fecha_creacion).toLocaleTimeString('es-PE', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {notif.enlace && (
                              <span className="text-[9px] text-blue-600 font-medium">
                                Ver detalles
                              </span>
                            )}
                          </div>
                        </div>
                        {!notif.leida && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-zinc-100 bg-zinc-50">
            <button
              onClick={() => {
                router.push('/alertas');
                setMostrarPanel(false);
              }}
              className="text-[10px] text-zinc-500 hover:text-zinc-700 font-medium flex items-center justify-center gap-1 w-full transition-colors"
            >
              Ver todas las notificaciones →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}