import { NextResponse } from "next/server";
import db from "@/libs/prisma";

export async function POST(request: Request) {
  const data = await request.json();

  const userFound = await db.usuario.findUnique({
    where: {
      email: data.email,
    },
  });

  if (userFound) {
    return NextResponse.json(
      {
        message: "El email ya existe",
      },
      {
        status: 400,
      }
    );
  }

  console.log(data);
  const newUser = await db.usuario.create({
    data,
  });

  return NextResponse.json(newUser);
}
