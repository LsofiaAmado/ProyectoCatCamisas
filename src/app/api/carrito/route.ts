import { NextResponse } from "next/server";
import  prisma  from "@/libs/prisma";

export async function POST(req: Request) {
  try {
    const { clienteId, camisetas, estado, total } = await req.json();

    if (
        !clienteId ||
        !Array.isArray(camisetas) ||
        camisetas.length === 0 ||
        typeof estado !== "string" ||
        typeof total !== "number"
      ) {
        return NextResponse.json(
          { message: "Todos los campos requeridos deben completarse con datos válidos" },
          { status: 400 }
        );
      }

    // Verificar que el cliente existe
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
    });
    if (!cliente) {
      return NextResponse.json(
        { message: "El cliente no existe" },
        { status: 400 }
      );
    }

    // Validar que las camisetas existen
    const camisetasValidas = await prisma.camiseta.findMany({
      where: { id: { in: camisetas } },
    });
    if (camisetasValidas.length !== camisetas.length) {
      return NextResponse.json(
        { message: "Algunas camisetas no son válidas o no existen" },
        { status: 400 }
      );
    }

    let compra = await prisma.compra.findFirst({
        where: { clienteId, estado: "pendiente" },
        include: { camisetas: true },
      });   
      
      if (compra) {
        compra = await prisma.compra.update({
          where: { id: compra.id },
          data: {
            camisetas: {
              connect: camisetas.map((id: number) => ({ id })),
            },
            total: compra.total + total,
          },
          include: { camisetas: true }, // Incluye camisetas en la respuesta de la actualización
        });
      }else {
      // Crear nueva compra
      compra = await prisma.compra.create({
        data: {
          clienteId,
          estado,
          fecha: new Date(),
          total,
          camisetas: {
            connect: camisetas.map((id: number) => ({ id })),
          },
          metodoPagoId: 1, // Método de pago por defecto
        },
        include: {
          camisetas: true,
        },
      });
    }

    return NextResponse.json(compra, { status: 201 });
  } catch (error: any) {
    console.error("Error completo:", error);
    return NextResponse.json(
      { message: "Error al gestionar el carrito. Inténtalo más tarde." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const clienteId = url.searchParams.get("clienteId");

    if (!clienteId) {
      return NextResponse.json(
        { message: "Cliente ID es requerido" },
        { status: 400 }
      );
    }

    const compra = await prisma.compra.findFirst({
      where: { clienteId: parseInt(clienteId), estado: "pendiente" },
      include: { camisetas: true },
    });

    if (!compra) {
      return NextResponse.json({ message: "Carrito vacío" }, { status: 200 });
    }

    return NextResponse.json(compra, { status: 200 });
  } catch (error: any) {
    console.error("Error al obtener el carrito:", error);
    return NextResponse.json(
      { message: "Error al cargar el carrito. Inténtalo más tarde." },
      { status: 500 }
    );
  }
}
