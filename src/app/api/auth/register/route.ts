import { NextResponse } from "next/server";
import db from "@/libs/prisma";

export async function POST(request: Request) {
  const data = await request.json();

  const newUser = await db.usuario.create({
    data: {
      nombre: data.username,
      email: data.email,
      contrasena: data.password,
      rol: data.rol,
    },
  });

  return NextResponse.json(newUser);
}
