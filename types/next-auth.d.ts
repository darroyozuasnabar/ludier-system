// types/next-auth.d.ts
import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    role?: string;
    projectId?: string | null;
    projectName?: string | null;
  }

  interface Session {
    user: {
      role?: string;
      id?: string;
      projectId?: string | null;
      projectName?: string | null;
    } & DefaultSession["user"];
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