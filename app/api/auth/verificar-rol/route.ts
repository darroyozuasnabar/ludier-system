// app/api/auth/verificar-rol/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("User")
      .select("role")
      .eq("email", email)
      .single();

    if (error || !data) {
      return NextResponse.json({ role: null });
    }

    return NextResponse.json({ role: data.role });
  } catch (error) {
    console.error("Error al verificar rol:", error);
    return NextResponse.json({ role: null }, { status: 500 });
  }
}