// types/crm/cliente.ts

export interface Cliente {
  id: string;
  nombre: string;
  ruc: string | null;
  tipo_documento: string | null;
  numero_documento: string | null;
  direccion: string | null;
  telefono: string | null;
  email: string | null;
  sitio_web: string | null;
  sector: string | null;
  tamano_empresa: string | null;
  notas: string | null;
  activo: boolean | null;
  creado_por: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ClienteFormData {
  nombre: string;
  ruc?: string;
  tipo_documento?: string;
  numero_documento?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  sitio_web?: string;
  sector?: string;
  tamano_empresa?: string;
  notas?: string;
}

export interface ClienteResponse {
  success: boolean;
  data?: Cliente | Cliente[];
  error?: string;
}

export const TIPOS_DOCUMENTO = [
  { value: "RUC", label: "RUC" },
  { value: "DNI", label: "DNI" },
  { value: "CE", label: "Carnet de Extranjería" },
  { value: "PASAPORTE", label: "Pasaporte" },
] as const;

export const TAMANOS_EMPRESA = [
  { value: "MICRO", label: "Microempresa" },
  { value: "PEQUENA", label: "Pequeña empresa" },
  { value: "MEDIANA", label: "Mediana empresa" },
  { value: "GRANDE", label: "Gran empresa" },
] as const;