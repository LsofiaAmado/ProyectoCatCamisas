import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET() {
  try {
    // Obtener todas las estampas, incluyendo las relaciones relevantes
    const estampas = await prisma.estampa.findMany({
      include: {
        imagenes: true, // Incluir las imágenes asociadas
        artista: true,  // Incluir información del artista (si existe)
        camisetas: true, // Incluir camisetas relacionadas
      },
    });

    // Formatear las estampas para incluir solo los campos necesarios
    const estampasDetalles = estampas.map((estampa) => ({
        ...estampa,
        disponible: estampa.disponibleParaVenta,
        imagen: estampa.imagenes?.[0]?.url,
    }));

    return NextResponse.json(estampasDetalles, { status: 200 });
  } catch (error) {
    console.error("Error al obtener todas las estampas:", error);
    return NextResponse.json(
      { message: "Error al obtener todas las estampas" },
      { status: 500 }
    );
  }
}
