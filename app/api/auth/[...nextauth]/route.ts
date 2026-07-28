// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { loginSchema } from "@/lib/validations";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

// 👇 Verificar variables de entorno
console.log('🔍 [INIT] Verificando variables de entorno:');
console.log('  - NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌');
console.log('  - SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌');
console.log('  - NEXTAUTH_URL:', process.env.NEXTAUTH_URL);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
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
        console.log("📧 [AUTHORIZE] Email recibido:", credentials?.email);

        try {
          // 1. Rate limiting
          const headersList = await headers();
          const ip = headersList.get("x-forwarded-for")?.split(",")[0] ?? "anonymous";
          console.log("📡 [AUTHORIZE] IP:", ip);
          
          const { success } = await loginRateLimit.limit(ip);
          if (!success) {
            console.log("⛔ [AUTHORIZE] Rate limit excedido");
            throw new Error("Demasiados intentos. Espera 5 minutos.");
          }

          // 2. Validar con Zod
          const validated = loginSchema.parse(credentials);
          console.log("✅ [AUTHORIZE] Validación Zod exitosa para:", validated.email);

          // 3. 👇 VERIFICAR CONTRA SUPABASE AUTH
          console.log("🔄 [AUTHORIZE] Intentando autenticar con Supabase...");
          const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
            email: validated.email,
            password: validated.password,
          });

          if (authError) {
            console.log("❌ [AUTHORIZE] Error de autenticación:", {
              message: authError.message,
              status: authError.status,
              name: authError.name
            });
            return null;
          }

          if (!authData.user) {
            console.log("❌ [AUTHORIZE] No se recibió usuario de Supabase");
            return null;
          }

          console.log("✅ [AUTHORIZE] Autenticación exitosa con Supabase Auth");
          console.log("👤 [AUTHORIZE] Usuario autenticado:", {
            id: authData.user.id,
            email: authData.user.email,
          });

          // 4. Buscar el usuario en public.User para obtener el rol
          console.log("🔍 [AUTHORIZE] Buscando usuario en public.User...");
          const { data: userData, error: userError } = await supabaseAdmin
            .from("User")
            .select("id, email, name, role, active")
            .eq("email", validated.email)
            .single();

          if (userError) {
            console.log("⚠️ [AUTHORIZE] Error buscando en public.User:", userError.message);
          }

          if (!userData) {
            console.log("⚠️ [AUTHORIZE] Usuario no encontrado en public.User, creando...");
            
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

            console.log("✅ [AUTHORIZE] Usuario creado en public.User:", {
              id: newUser.id,
              email: newUser.email,
              role: newUser.role,
            });

            return {
              id: newUser.id,
              email: newUser.email,
              name: newUser.name,
              role: newUser.role || undefined,
            };
          }

          console.log("✅ [AUTHORIZE] Usuario encontrado en public.User:", {
            id: userData.id,
            email: userData.email,
            role: userData.role,
          });

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