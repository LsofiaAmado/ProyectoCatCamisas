import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

interface Params {
    params: { id: number };
}

export async function GET(request: Request, { params }: Params) {

    const datos = await prisma.cliente.findMany()
    console.log(datos)

    return NextResponse.json("obteniendo cliente")
}

export function POST(request: Request, { params }: Params) {
    return NextResponse.json("creando cliente")
}

export function PUT(request: Request, { params }: Params) {
    return NextResponse.json("actualizando cliente")
}

export function DELETE(request: Request, { params }: Params) {
    return NextResponse.json("borrando cliente")
}
