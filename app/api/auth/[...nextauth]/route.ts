// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { loginRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { loginSchema } from "@/lib/validations";
import { z } from "zod";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // 1. Rate limiting
          const headersList = await headers();
          const ip = headersList.get("x-forwarded-for")?.split(",")[0] ?? "anonymous";
          const { success } = await loginRateLimit.limit(ip);
          if (!success) {
            throw new Error("Demasiados intentos de inicio de sesión. Espera 5 minutos.");
          }

          // 2. Validar con Zod
          const validated = loginSchema.parse(credentials);

          console.log("📍 authorize iniciado");
          console.log("📧 Email recibido:", validated.email);
          console.log("🔑 Password recibida:", validated.password ? "****" : "no");

          // 3. Buscar usuario
          const user = await prisma.user.findUnique({
            where: { email: validated.email },
          });

          console.log("👤 Usuario encontrado:", user ? user.email : "NO ENCONTRADO");
          console.log("📝 Rol del usuario:", user?.role);

          // 4. Verificar contraseña (temporal: admin123)
          // ⚠️ EN PRODUCCIÓN: comparar con bcrypt
          if (user && validated.password === "admin123") {
            console.log("✅ Autenticación exitosa");
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role || undefined,
            };
          }
          console.log("❌ Contraseña incorrecta o usuario no existe");
          return null;
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.log("❌ Validación fallida:", error.errors);
            return null; // Credenciales inválidas
          }
          console.error("❌ Error en authorize:", error);
          return null;
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };