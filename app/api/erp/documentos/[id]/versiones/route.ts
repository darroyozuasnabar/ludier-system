import { NextResponse } from "next/server";
import { createServerClient } from '@supabase/ssr';
import { cookies } from "next/headers";

const createSupabaseClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: any) {
          cookieStore.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );
};

function numeroALetras(num: number): string {
  const unidades = ["", "UN", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
  const especiales: Record<number, string> = {
    11: "ONCE", 12: "DOCE", 13: "TRECE", 14: "CATORCE", 15: "QUINCE",
    16: "DIECISEIS", 17: "DIECISIETE", 18: "DIECIOCHO", 19: "DIECINUEVE",
    20: "VEINTE", 30: "TREINTA", 40: "CUARENTA", 50: "CINCUENTA",
    60: "SESENTA", 70: "SETENTA", 80: "OCHENTA", 90: "NOVENTA"
  };

  if (num === 0) return "CERO";
  
  const parteEntera = Math.floor(num);
  const parteDecimal = Math.round((num - parteEntera) * 100);
  
  let texto = "";
  
  if (parteEntera < 10) {
    texto = unidades[parteEntera];
  } else if (parteEntera < 21) {
    texto = especiales[parteEntera];
  } else if (parteEntera < 100) {
    const d = Math.floor(parteEntera / 10) * 10;
    const u = parteEntera % 10;
    texto = especiales[d];
    if (u > 0) texto += " Y " + unidades[u];
  } else if (parteEntera === 100) {
    texto = "CIEN";
  } else if (parteEntera < 200) {
    texto = "CIENTO " + numeroALetras(parteEntera - 100);
  } else {
    const c = Math.floor(parteEntera / 100);
    const resto = parteEntera % 100;
    texto = unidades[c] + "CIENTOS";
    if (resto > 0) texto += " " + numeroALetras(resto);
  }
  
  return `${texto} Y ${parteDecimal.toString().padStart(2, '0')}/100 SOLES`;
}

async function getNextNumero(supabase: any, serie: string): Promise<number> {
  const { data } = await supabase
    .from("Valorizacion")
    .select("factura_numero")
    .eq("factura_serie", serie)
    .not("factura_numero", "is", null)
    .order("factura_numero", { ascending: false })
    .limit(1);
  
  if (data && data.length > 0 && data[0].factura_numero) {
    return parseInt(data[0].factura_numero) + 1;
  }
  return 1;
}

export async function POST(request: Request) {
  try {
    const { valorizacionId, projectId } = await request.json();
    
    const supabase = await createSupabaseClient();
    
    const { data: valorizacion, error: valError } = await supabase
      .from("Valorizacion")
      .select("*, Project(*)")
      .eq("id", valorizacionId)
      .single();
    
    if (valError || !valorizacion) {
      return NextResponse.json({ 
        success: false, 
        message: "Valorización no encontrada" 
      });
    }
    
    const clienteRuc = valorizacion.Project?.client_ruc || "20563177323";
    const clienteRazonSocial = valorizacion.Project?.client || "DESARROLLO PLAZA GRAU S.A.C.";
    const clienteDireccion = valorizacion.Project?.location || "";
    
    const serie = "E001";
    const nextNumero = await getNextNumero(supabase, serie);
    const numero = nextNumero.toString().padStart(8, "0");
    
    const subtotal = valorizacion.costoDirecto;
    const igv = valorizacion.igv;
    const total = valorizacion.totalFactura;
    const detraccionPct = 4;
    const detraccionMonto = total * (detraccionPct / 100);
    const netoPagar = total - detraccionMonto;
    
    const payload = {
      operacion: "generar_comprobante",
      tipo_comprobante: "FACTURA",
      serie: serie,
      numero: numero,
      fecha_emision: valorizacion.fechaEmision.split("T")[0],
      hora_emision: new Date().toLocaleTimeString("en-US", { hour12: false }),
      cliente: {
        tipo_documento: "6",
        numero_documento: clienteRuc,
        denominacion: clienteRazonSocial,
        direccion: clienteDireccion,
      },
      items: [
        {
          cantidad: 1,
          unidad_medida: "UNIDAD",
          descripcion: `VALORIZACION ${valorizacion.period} - SERVICIO DE CARPINTERIA METALICA`,
          valor_unitario: subtotal,
          igv: igv,
        },
      ],
      total_gravada: subtotal,
      total_igv: igv,
      total: total,
      detraccion: {
        porcentaje: detraccionPct,
        monto: detraccionMonto,
      },
      leyendas: [
        {
          codigo: "1000",
          descripcion: `SON ${numeroALetras(netoPagar)}`,
        },
        {
          codigo: "2006",
          descripcion: `OPERACION SUJETA A DETRACCION - PORCENTAJE ${detraccionPct}% - MONTO S/ ${detraccionMonto.toFixed(2)}`,
        },
      ],
    };
    
    console.log("Enviando a Nubefact:", JSON.stringify(payload, null, 2));
    
    const response = await fetch(`${process.env.NUBEFACT_API_URL}/documents`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NUBEFACT_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    
    const result = await response.json();
    
    console.log("Respuesta Nubefact:", result);
    
    if (result.success === true || result.codigo === "0") {
      await supabase
        .from("Valorizacion")
        .update({
          factura_serie: serie,
          factura_numero: numero,
          factura_pdf_url: result.link_pdf || result.pdf_url,
          factura_xml_url: result.link_xml || result.xml_url,
          factura_emitida_sunat: true,
          factura_fecha_emision: new Date().toISOString().split("T")[0],
          factura_cdr: result.cdr || result.codigo || "0",
          factura_mensaje: result.message || "Factura aceptada",
        })
        .eq("id", valorizacionId);
      
      return NextResponse.json({
        success: true,
        serie: serie,
        numero: numero,
        total: total,
        pdf_url: result.link_pdf || result.pdf_url,
        xml_url: result.link_xml || result.xml_url,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.message || "Error al emitir factura",
        details: result,
      });
    }
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Error interno del servidor",
    });
  }
}