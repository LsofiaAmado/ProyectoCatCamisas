"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import SessionWrapper from "../sessionWrapper/page";
import Navbar from "@/app/components/NavbarCliente";

const MisEstampas = () => {
  const { data: session } = useSession();
  const router = useRouter(); 
  const [estampas, setEstampas] = useState<any[]>([]);

  // Cargar estampas al iniciar
  useEffect(() => {
    // Cambiar la URL para usar la ruta de todas las estampas
    fetch(`/api/catalogoEstampa`)
      .then((res) => res.json())
      .then((data) => {
        setEstampas(data); // Guardar las estampas obtenidas
      })
      .catch((err) => console.error("Error al cargar estampas:", err));
  }, []); // No dependemos de session, porque queremos todas las estampas

  const handleElegir = (id: number) => {
    router.push(`/pages/crearCamiseta?id=${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <Navbar />
      <div className="ml-60 pt-10 pb-10 max-w-5xl">
        <h2 className="text-xl font-bold mb-4 text-center">
          Catálogo de Estampas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {estampas.map((estampa) => (
            <div
              key={estampa.id}
              className="bg-white shadow p-4 rounded flex flex-col items-center"
            >
              <img
                src={estampa.imagen}
                alt={estampa.nombre}
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <h3 className="text-lg font-bold">{estampa.nombre}</h3>
              <p className="text-sm">{estampa.descripcion}</p>

              {/* Etiqueta para el tema */}
              <span className="mt-2 bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                {estampa.tema}
              </span>

          {/* Indicador de disponibilidad */}
              <span
                className={`mt-2 text-xs font-semibold px-3 py-1 rounded-full ${
                  estampa.disponible
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {estampa.disponible ? "Disponible" : "No Disponible"}
              </span>

              {/* Botón para elegir */}
              <button
                onClick={() => handleElegir(estampa.id)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded text-sm font-bold"
              >
              Elegir
              </button>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function MisEstampasPageWithSession() {
  return (
    <SessionWrapper>
      <MisEstampas />
    </SessionWrapper>
  );
}
