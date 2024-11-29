import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import db from "@/libs/prisma";
import bcrypt from "bcrypt";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string; // Añadimos role
      artistaId?: number | null; // Añadimos artistaId
      clienteId?: number | null; // Añadimos clienteId
    };
  }

  interface User {
    role?: string;
    artistaId?: number | null;
    clienteId?: number | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    artistaId?: number | null;
    clienteId?: number | null;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const userFound = await db.usuario.findUnique({
          where: {
            email: credentials?.email,
          },
          include: {
            artista: true, // Relación con artista
            cliente: true, // Relación con cliente
          },
        });
      
        if (!userFound) throw new Error("Usuario no encontrado");
      
        const matchPassword = await bcrypt.compare(
          credentials?.password ?? "",
          userFound.contrasena
        );
      
        if (!matchPassword) throw new Error("Contraseña incorrecta");
      
        return {
          id: userFound.id.toString(),
          name: userFound.nombre,
          email: userFound.email,
          role: userFound.rol,
          artistaId: userFound.artista?.id || null, // ID del artista, si aplica
          clienteId: userFound.cliente?.id || null, // ID del cliente, si aplica
        };
      },
    }),
  ],
  callbacks: {
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT & { role?: string; artistaId?: number | null; clienteId?: number | null };
    }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.artistaId = token.artistaId ?? null;
        session.user.clienteId = token.clienteId ?? null; // Añadir clienteId a la sesión
      }
      
      return session;
    },
    async jwt({
      token,
      user,
    }: {
      token: JWT & { role?: string; artistaId?: number | null; clienteId?: number | null };
      user?: { role?: string; artistaId?: number | null; clienteId?: number | null };
    }) {
      if (user) {
        token.role = user.role;
        token.artistaId = user.artistaId ?? null;
        token.clienteId = user.clienteId ?? null; // Añadir clienteId al token
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
