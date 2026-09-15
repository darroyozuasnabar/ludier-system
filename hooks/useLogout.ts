// hooks/useLogout.ts
import { signOut } from "next-auth/react";
import Swal from "sweetalert2";

export const useLogout = () => {
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro de que deseas salir de la plataforma?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#E07B20",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      background: "#0a0a0a",
      color: "#fff",
      backdrop: "rgba(0,0,0,0.8)",
      customClass: {
        popup: "rounded-xl border border-[#1e1e1e]",
        confirmButton: "px-6 py-2.5 text-sm font-semibold",
        cancelButton: "px-6 py-2.5 text-sm font-semibold",
      },
    });

    if (result.isConfirmed) {
      await signOut({ redirect: true, callbackUrl: "/login" });
    }
  };

  return { handleLogout };
};