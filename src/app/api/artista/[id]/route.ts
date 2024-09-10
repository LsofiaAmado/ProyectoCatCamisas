import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

interface Params {
  params: { id: number };
}

export async function GET(request: Request, { params }: Params) {
  const datos = await prisma.artista.findMany();
  console.log(datos);

  return NextResponse.json(datos);
}

export async function POST(request: Request, { params }: Params) {
  const { nombre, email, contrasena } = await request.json();
  const nuevoArtista = await prisma.artista.create({
    data: {
      nombre,
      email,
      contrasena,
    },
  });

  return NextResponse.json(nuevoArtista);
}

export function PUT(request: Request, { params }: Params) {
  return NextResponse.json("actualizando artista");
}

export function DELETE(request: Request, { params }: Params) {
  return NextResponse.json("borrando artista");
}
