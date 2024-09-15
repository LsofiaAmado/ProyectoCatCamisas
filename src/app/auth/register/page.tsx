"use client";

import { useForm, FieldError } from "react-hook-form";
import { useRouter } from "next/navigation";

function Registro() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    if (data.password != data.confirmPassword) {
      return alert("Las contraseñas no coinciden");
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        nombre: data.username,
        email: data.email,
        contrasena: data.password,
        rol: data.rol,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    const resJSON = await res.json();

    if (res.ok) {
      router.push("/auth/login");
    }

    console.log(res);
  });

  console.log(errors);

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <form onSubmit={onSubmit} className="w-1/4">
        <h1 className="text-slate-200 font-bold text-4xl mb-4">Registro</h1>
        <label htmlFor="username" className="text-slate-500 mb-2 block text-sm">
          Nombre de Usuario:
        </label>
        <input
          type="text"
          {...register("username", {
            required: {
              value: true,
              message: "El nombre de usuario es obligatorio",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
        />
        {errors.username && (
          <span className="text-red-500 text-xs">
            {(errors.username as FieldError).message || "Error desconocido"}
          </span>
        )}
        <label htmlFor="email" className="text-slate-500 mb-2 block text-sm">
          E-mail:
        </label>
        <input
          type="email"
          {...register("email", {
            required: {
              value: true,
              message: "El email es obligatorio",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
        />
        {errors.email && (
          <span className="text-red-500 text-xs">
            {(errors.email as FieldError).message || "Error desconocido"}
          </span>
        )}
        <label htmlFor="password" className="text-slate-500 mb-2 block text-sm">
          Contraseña:
        </label>
        <input
          type="password"
          {...register("password", {
            required: {
              value: true,
              message: "Escribe una contraseña",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
        />
        {errors.password && (
          <span className="text-red-500 text-xs">
            {(errors.password as FieldError).message || "Error desconocido"}
          </span>
        )}
        <label
          htmlFor="confirmPassword"
          className="text-slate-500 mb-2 block text-sm"
        >
          Confirmar Contraseña:
        </label>
        <input
          type="password"
          {...register("confirmPassword", {
            required: { value: true, message: "Cofirme la contraseña" },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
        />
        {errors.confirmPassword && (
          <span className="text-red-500 text-xs">
            {(errors.confirmPassword as FieldError).message ||
              "Error desconocido"}
          </span>
        )}

        <label htmlFor="rol" className="text-slate-500 mb-2 block text-sm">
          Rol:
        </label>
        <select
          {...register("rol", { required: true })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
        >
          <option value="CLIENTE">Cliente</option>
          <option value="ARTISTA">Artista</option>
        </select>

        <button className="w-full bg-blue-500 text-white p-3 rounded-lg mt-2">
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default Registro;
