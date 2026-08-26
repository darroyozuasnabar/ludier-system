// app/reportes/hooks/useReportData.ts

"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UseReportDataProps {
  reportId: string;
  projectId: string;
  periodo: string;
  role: string;
}

export function useReportData({ reportId, projectId, periodo, role }: UseReportDataProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId || !projectId) return;
    loadData();
  }, [reportId, projectId, periodo]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      let result: any[] | null = null;
      switch (reportId) {
        case "avance":
          result = await loadAvanceObra();
          break;
        case "produccion":
          result = await loadProduccion();
          break;
        case "contratos":
          result = await loadContratos();
          break;
        case "personal":
          result = await loadPersonal();
          break;
        case "alertas":
          result = await loadAlertas();
          break;
        case "partes":
          result = await loadPartes();
          break;
        case "inventario":
          result = await loadInventario();
          break;
        default:
          result = [];
      }
      setData(result);
    } catch (err) {
      console.error("Error loading report data:", err);
      setError("Error al cargar los datos del reporte");
    } finally {
      setLoading(false);
    }
  };

  // ─── FUNCIONES DE CARGA ──────────────────────────────────────────────

  const loadAvanceObra = async () => {
    // Obtener contratos del proyecto
    const { data: contratos } = await supabase
      .from("Contrato")
      .select("id, nombre, monto, estado")
      .eq("project_id", projectId);

    if (!contratos || contratos.length === 0) {
      return [];
    }

    // Obtener valorizaciones del proyecto
    const { data: valorizaciones } = await supabase
      .from("Valorizacion")
      .select("contrato_id, netoCobrar, status")
      .eq("projectId", projectId);

    // Calcular avance por contrato
    return contratos.map((c) => {
      // ✅ Si el contrato está COBRADO → 100% (no necesita valorizaciones)
      if (c.estado === "COBRADO") {
        const total = Number(c.monto);
        return {
          contrato: c.nombre,
          total: total,
          cobrado: total,
          pendiente: 0,
          avance: 100,
          estado: c.estado,
        };
      }

      // Si no está cobrado, calcular desde valorizaciones
      const vals = valorizaciones?.filter((v) => v.contrato_id === c.id) || [];
      const cobrado = vals
        .filter((v) => v.status === "COBRADO")
        .reduce((s, v) => s + Number(v.netoCobrar), 0);
      const pendiente = vals
        .filter((v) => v.status !== "COBRADO")
        .reduce((s, v) => s + Number(v.netoCobrar), 0);
      const total = Number(c.monto);

      return {
        contrato: c.nombre,
        total,
        cobrado,
        pendiente,
        avance: total > 0 ? (cobrado / total) * 100 : 0,
        estado: c.estado,
      };
    }) || [];
  };

  const loadProduccion = async () => {
    const { data } = await supabase
      .from("OrdenProduccion")
      .select("nombre, tipo, cantidad, estado, base_completada, acabado_completado")
      .eq("project_id", projectId);
    return data || [];
  };

  const loadContratos = async () => {
    const { data } = await supabase
      .from("Contrato")
      .select("nombre, monto, fecha, estado, tipo")
      .eq("project_id", projectId)
      .order("fecha", { ascending: false });
    return data || [];
  };

  const loadPersonal = async () => {
    const { data: workers } = await supabase
      .from("Worker")
      .select("name, role, location, active, tarifa_diaria")
      .order("name");
    return workers || [];
  };

  const loadAlertas = async () => {
    const { data: alertas } = await supabase
      .from("Alert")
      .select("title, description, priority, status, createdAt")
      .eq("projectId", projectId)
      .order("priority", { ascending: false });
    return alertas || [];
  };

  const loadPartes = async () => {
    const { data: partes } = await supabase
      .from("ParteTrabajo")
      .select(`
        id,
        fecha,
        supervisor,
        resumen_general,
        observaciones,
        "createdAt",
        ParteActividad (
          worker_id,
          actividad,
          horas
        )
      `)
      .eq("project_id", projectId)
      .order("fecha", { ascending: false });

    return partes?.map((p) => ({
      fecha: p.fecha,
      supervisor: p.supervisor,
      resumen: p.resumen_general,
      actividades: p.ParteActividad?.length || 0,
      horas: p.ParteActividad?.reduce((sum: number, a: any) => sum + Number(a.horas || 0), 0) || 0,
    })) || [];
  };

  const loadInventario = async () => {
    const { data: items } = await supabase
      .from("Inventario")
      .select("nombre, categoria, cantidad, stock_minimo, ubicacion, unidad")
      .order("nombre");
    return items || [];
  };

  return { data, loading, error, refetch: loadData };
}