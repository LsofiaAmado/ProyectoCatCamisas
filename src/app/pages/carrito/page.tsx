"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Navbar from "@/app/components/NavbarCliente";

const Carrito = () => {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchCompra = async () => {
      try {
        const response = await fetch(`/api/carrito?clienteId=${session?.user?.clienteId}`);
        if (!response.ok) throw new Error("Error al cargar el carrito");

        const data = await response.json();
        setCartItems(data.camisetas || []);
        setTotal(data.total || 0);
      } catch (error) {
        console.error(error);
        toast.error("No se pudo cargar el carrito");
      }
    };

    if (session?.user?.clienteId) {
      fetchCompra();
    }
  }, [session]);

  const handleCheckout = async () => {
    if (!session?.user?.clienteId || cartItems.length === 0) {
      toast.error("No hay artículos en el carrito para procesar");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clienteId: session.user.clienteId,
          camisetas: cartItems.map((item) => item.id),
          estado: "completado",
          total,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
        return;
      }

      toast.success("Compra realizada con éxito");
      setCartItems([]);
      setTotal(0);
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      toast.error("Ocurrió un error al procesar la compra");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Navbar />
      <h1 className="text-2xl font-bold mb-6">Carrito de Compras</h1>
      <div className="bg-white p-6 shadow rounded-lg">
        {cartItems.length > 0 ? (
          <>
            <ul>
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between items-center mb-4">
                  <span>{item.modelo}</span>
                  <span>
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                    }).format(item.precio)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center mt-6">
              <span className="font-bold">Total:</span>
              <span>
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                }).format(total)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="mt-6 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              disabled={isProcessing}
            >
              {isProcessing ? "Procesando..." : "Finalizar Compra"}
            </button>
          </>
        ) : (
          <p className="text-gray-500">No tienes artículos en tu carrito</p>
        )}
      </div>
    </div>
  );
};

export default Carrito;
