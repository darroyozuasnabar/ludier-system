"use client";

import { useState, useRef } from "react";
import { Camera, X, Upload, Loader2, Image, CheckCircle, AlertCircle } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type FotoTipo = "problema" | "correccion" | "verificacion";

interface FotoUploaderProps {
  observacionId: string;
  fotos: {
    problema: string[];
    correccion: string[];
    verificacion: string[];
  };
  onFotosChange: (fotos: any) => void;
  disabled?: boolean;
}

const TIPOS_FOTO = [
  { key: "problema", label: "Problema", icon: AlertCircle, color: "red" },
  { key: "correccion", label: "Corrección", icon: CheckCircle, color: "green" },
  { key: "verificacion", label: "Verificación", icon: Image, color: "blue" },
];

export function FotoUploader({ observacionId, fotos, onFotosChange, disabled }: FotoUploaderProps) {
  const [uploading, setUploading] = useState<FotoTipo | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tipoActivo, setTipoActivo] = useState<FotoTipo>("problema");

  const handleUpload = async (file: File, tipo: FotoTipo) => {
    if (!observacionId) {
      alert("Primero guarda la observación para poder subir fotos");
      return;
    }

    setUploading(tipo);
    setUploadProgress(0);

    try {
      // Generar nombre único
      const ext = file.name.split(".").pop();
      const fileName = `${observacionId}/${tipo}/${Date.now()}.${ext}`;

      // Subir archivo
      const { data, error } = await supabase.storage
        .from("calidad-fotos")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from("calidad-fotos")
        .getPublicUrl(fileName);

      const fotoUrl = urlData.publicUrl;

      // Actualizar estado
      const nuevasFotos = {
        ...fotos,
        [tipo]: [...(fotos[tipo] || []), fotoUrl],
      };
      onFotosChange(nuevasFotos);

      // Actualizar en BD
      await supabase
        .from("ObservacionCalidad")
        .update({ fotos: nuevasFotos })
        .eq("id", observacionId);

    } catch (error) {
      console.error("Error subiendo foto:", error);
      alert("Error al subir la foto. Intenta de nuevo.");
    } finally {
      setUploading(null);
      setUploadProgress(0);
    }
  };

  const handleRemoveFoto = async (tipo: FotoTipo, index: number) => {
    const nuevasFotos = {
      ...fotos,
      [tipo]: (fotos[tipo] || []).filter((_, i) => i !== index),
    };
    onFotosChange(nuevasFotos);

    // Actualizar en BD
    await supabase
      .from("ObservacionCalidad")
      .update({ fotos: nuevasFotos })
      .eq("id", observacionId);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, tipo: FotoTipo) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file, tipo);
    }
    e.target.value = "";
  };

  const totalFotos = Object.values(fotos).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="space-y-4">
      {/* Selector de tipo de foto */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-gray-700">Tipo de evidencia:</span>
        {TIPOS_FOTO.map((t) => {
          const Icon = t.icon;
          const count = (fotos[t.key as FotoTipo] || []).length;
          return (
            <button
              key={t.key}
              onClick={() => setTipoActivo(t.key as FotoTipo)}
              className={`px-3 py-1.5 text-xs rounded-full transition-colors flex items-center gap-1.5 ${
                tipoActivo === t.key
                  ? `bg-${t.color}-50 text-${t.color}-700 border border-${t.color}-200`
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
              {count > 0 && (
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-white/50`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Área de subida */}
      <div
        className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${
          disabled ? "opacity-50 cursor-not-allowed" : "border-gray-300 hover:border-gray-400 cursor-pointer"
        }`}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <p className="text-sm text-gray-500">Subiendo foto...</p>
            <div className="w-full max-w-xs h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-600 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="py-4">
            <Camera className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Haz clic para subir una foto</p>
            <p className="text-xs text-gray-400 mt-1">
              Formatos: JPG, PNG, WEBP · Tamaño máx: 5MB
            </p>
            <p className="text-xs text-amber-500 mt-2">
              📸 Foto de {TIPOS_FOTO.find(t => t.key === tipoActivo)?.label.toLowerCase()}
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={disabled || !!uploading}
          onChange={(e) => handleFileSelect(e, tipoActivo)}
        />
      </div>

      {/* Galería de fotos */}
      {totalFotos > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium text-gray-700 mb-2">
            Evidencias ({totalFotos} fotos)
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TIPOS_FOTO.map((t) => {
              const fotosTipo = fotos[t.key as FotoTipo] || [];
              if (fotosTipo.length === 0) return null;
              return (
                <div key={t.key} className="space-y-1">
                  <p className="text-[10px] font-medium text-gray-400 uppercase">
                    {t.label}
                  </p>
                  {fotosTipo.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={url}
                        alt={`${t.label} ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        onClick={() => handleRemoveFoto(t.key as FotoTipo, idx)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        title="Eliminar foto"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}