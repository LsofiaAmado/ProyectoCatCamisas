import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import db from "@/libs/prisma";
import bcrypt from "bcrypt";

const authOptions = {
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log(credentials);
        const userFound = await db.usuario.findUnique({
          where: {
            email: credentials?.email,
          },
        });
        if (!userFound) throw new Error("Usuario no encontrado");

        console.log(userFound);

        const matchPassword = await bcrypt.compare(
          credentials?.password ?? "",
          userFound.contrasena
        );

        if (!matchPassword) throw new Error("Contraseña incorrecta");

        return {
          id: userFound.id.toString(),
          name: userFound.nombre,
          email: userFound.email,
        };
      },
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
