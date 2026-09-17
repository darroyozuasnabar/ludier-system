// types/crm/cotizacion.ts
// Definición de tipos TypeScript para el módulo de Cotizaciones del CRM LUDIER

export type EstadoCotizacion =
  | "BORRADOR"
  | "ENVIADA"
  | "VISTA"
  | "APROBADA"
  | "RECHAZADA"
  | "EXPIRADA"
  | "CONVERTIDA_A_OBRA";

export type MonedaCotizacion = "PEN" | "USD";

export type UnidadMedidaItem = "ML" | "UND" | "M2" | "KG" | "GLB" | "HR" | "LOT";

export type TipoSeguimiento =
  | "LLAMADA"
  | "EMAIL"
  | "REUNION"
  | "WHATSAPP"
  | "VISITA"
  | "NOTA";

export interface CotizacionItem {
  id?: string;
  cotizacion_id?: string;
  descripcion: string;
  cantidad: number;
  unidad: UnidadMedidaItem | string;
  precio_unitario: number;
  descuento?: number;
  total: number;
  orden?: number;
  created_at?: string;
}

export interface CotizacionSeguimiento {
  id?: string;
  cotizacion_id: string;
  fecha?: string;
  tipo: TipoSeguimiento;
  descripcion: string;
  realizado_por?: string | null;
  proximo_contacto?: string | null;
  created_at?: string;
  Usuario?: {
    id: string;
    name?: string | null;
    email: string;
  } | null;
}

export interface Cotizacion {
  id: string;
  numero: string;
  project_id?: string | null;
  cliente: string;
  cliente_ruc?: string | null;
  cliente_contacto?: string | null;
  cliente_telefono?: string | null;
  cliente_email?: string | null;
  cliente_direccion?: string | null;
  fecha_emision: string;
  fecha_validez?: string | null;
  estado: EstadoCotizacion;
  subtotal: number;
  igv: number;
  total: number;
  moneda: MonedaCotizacion;
  tipo_cambio?: number | null;
  condiciones?: string | null;
  notas?: string | null;
  creado_por?: string | null;
  fecha_envio?: string | null;
  fecha_aprobacion?: string | null;
  fecha_conversion?: string | null;
  created_at?: string;
  updated_at?: string;
  items?: CotizacionItem[];
  seguimientos?: CotizacionSeguimiento[];
  Project?: {
    id: string;
    name: string;
    client: string;
  } | null;
  Creador?: {
    id: string;
    name?: string | null;
    email: string;
  } | null;
}

export interface CotizacionFiltros {
  busqueda?: string;
  estado?: EstadoCotizacion | "TODOS";
  moneda?: MonedaCotizacion | "TODAS";
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface CotizacionEstadisticas {
  totalCotizaciones: number;
  montoTotalPEN: number;
  montoTotalUSD: number;
  tasaConversion: number;
  porEstado: Record<EstadoCotizacion, number>;
}
