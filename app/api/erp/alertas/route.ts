// app/api/alertas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { rateLimit } from '@/lib/rate-limit';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ============================================================
// 🔥 CLIENTE SUPABASE
// ============================================================
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

// ============================================================
// 📌 GET - Listar alertas (con Rate Limiting)
// ============================================================
export async function GET(req: NextRequest) {
  try {
    // SECURITY F1: validar identidad y permisos antes de ejecutar la operacion.
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (!["FUNDADOR", "ADMIN", "FIELD_ENGINEER", "PRODUCTION", "VIEWER"].includes(session.user?.role ?? "")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // 🔥 Rate Limiting (opcional)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'anonymous';
    const { success } = await rateLimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta nuevamente en unos segundos.' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const priority = searchParams.get('priority');
    const projectId = searchParams.get('projectId');
    const limit = parseInt(searchParams.get('limit') || '50');

    const supabase = await createSupabaseClient();

    let query = supabase
      .from('Alert')
      .select(`
        *,
        project:projectId (
          id,
          name,
          client
        )
      `)
      .eq('activo', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (priority && priority !== 'ALL') {
      query = query.eq('priority', priority);
    }

    if (projectId && projectId !== 'ALL') {
      query = query.eq('projectId', projectId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      total: data?.length || 0
    });
  } catch (error) {
    console.error('❌ Error en GET /api/alertas:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}