// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { loginSchema } from "@/lib/validations";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

// 👇 Cliente de Supabase con service_role (para verificar contraseñas)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 👈 ¡NECESITAS ESTA CLAVE!
);

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        console.log("🔐 [AUTHORIZE] Iniciando autenticación...");

        try {
          // 1. Rate limiting
          const headersList = await headers();
          const ip = headersList.get("x-forwarded-for")?.split(",")[0] ?? "anonymous";
          const { success } = await loginRateLimit.limit(ip);
          if (!success) {
            throw new Error("Demasiados intentos. Espera 5 minutos.");
          }

          // 2. Validar con Zod
          const validated = loginSchema.parse(credentials);
          console.log("📧 [AUTHORIZE] Validando:", validated.email);

          // 3. 👇 VERIFICAR CONTRA SUPABASE AUTH
          const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
            email: validated.email,
            password: validated.password,
          });

          if (authError || !authData.user) {
            console.log("❌ [AUTHORIZE] Error de autenticación:", authError?.message);
            return null;
          }

          console.log("✅ [AUTHORIZE] Autenticación exitosa con Supabase Auth");

          // 4. Buscar el usuario en public.User para obtener el rol
          const { data: userData, error: userError } = await supabaseAdmin
            .from("User")
            .select("id, email, name, role, active")
            .eq("email", validated.email)
            .single();

          if (userError || !userData) {
            console.log("⚠️ [AUTHORIZE] Usuario no encontrado en public.User");
            
            // Si el usuario autenticado no está en public.User, lo creamos
            const { data: newUser, error: insertError } = await supabaseAdmin
              .from("User")
              .insert({
                id: authData.user.id,
                email: authData.user.email!,
                name: authData.user.user_metadata?.name || authData.user.email,
                role: "OPERATIVO",
                active: true,
              })
              .select()
              .single();

            if (insertError || !newUser) {
              console.error("❌ Error creando usuario:", insertError);
              return null;
            }

            return {
              id: newUser.id,
              email: newUser.email,
              name: newUser.name,
              role: newUser.role || undefined,
            };
          }

          return {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role || undefined,
          };
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.log("❌ [AUTHORIZE] Error Zod:", error.errors);
            return null;
          }
          console.error("❌ [AUTHORIZE] Error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("🔄 [JWT] Callback:", { hasUser: !!user });
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("🔄 [SESSION] Callback:", { hasToken: !!token });
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
});

export { handler as GET, handler as POST };