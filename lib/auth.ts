// lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { loginSchema } from "@/lib/validations";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

declare module "next-auth" {
  interface User {
    role?: string;
    projectId?: string | null;
    projectName?: string | null;
  }
  interface Session {
    user: User & {
      role?: string;
      id?: string;
      projectId?: string | null;
      projectName?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    id?: string;
    projectId?: string | null;
    projectName?: string | null;
  }
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        try {
          const headersList = await headers();
          const ip = headersList.get("x-forwarded-for")?.split(",")[0] ?? "anonymous";

          const { success } = await loginRateLimit.limit(ip);
          if (!success) {
            throw new Error("Demasiados intentos. Espera 5 minutos.");
          }

          const validated = loginSchema.parse(credentials);

          const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
            email: validated.email,
            password: validated.password,
          });

          if (authError || !authData.user) {
            return null;
          }

          const { data: userData } = await supabaseAdmin
            .from("User")
            .select("id, email, name, role, active")
            .eq("email", validated.email)
            .single();

          if (!userData) {
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
      if (user) {
        token.role = user.role;
        token.id = user.id;

        // Si el usuario es CLIENTE, obtener su proyecto asociado
        if (user.role === "CLIENTE") {
          try {
            const { data: project, error } = await supabaseAdmin
              .from("Project")
              .select("id, name")
              .eq("cliente_user_id", user.id)
              .maybeSingle();

            if (error) {
              console.error("Error al obtener proyecto para cliente:", error);
            }

            token.projectId = project?.id || null;
            token.projectName = project?.name || null;
          } catch (err) {
            console.error("Error en callback jwt al obtener proyecto:", err);
            token.projectId = null;
            token.projectName = null;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        // Pasar proyecto a la sesión
        session.user.projectId = token.projectId as string | null;
        session.user.projectName = token.projectName as string | null;
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
};