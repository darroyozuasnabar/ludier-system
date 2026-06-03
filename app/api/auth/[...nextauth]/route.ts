import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

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
        console.log("📍 authorize iniciado");
        console.log("📧 Email recibido:", credentials?.email);
        console.log("🔑 Password recibida:", credentials?.password ? "****" : "no");

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Credenciales faltantes");
          return null;
        }

        try {
          console.log("🔍 Buscando usuario en BD...");
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          console.log("👤 Usuario encontrado:", user ? user.email : "NO ENCONTRADO");
          console.log("📝 Rol del usuario:", user?.role);

          if (user && credentials.password === "admin123") {
            console.log("✅ Autenticación exitosa");
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }
          console.log("❌ Contraseña incorrecta o usuario no existe");
          return null;
        } catch (error) {
          console.error("❌ Error en la base de datos:", error);
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