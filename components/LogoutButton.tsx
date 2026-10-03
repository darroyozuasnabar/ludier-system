// hooks/useLogout.ts
"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import Swal from "sweetalert2";

export const useLogout = () => {
  const router = useRouter();
  const isLoggingOut = useRef(false);

  const handleLogout = async () => {
    // Guard: evita doble ejecución si el usuario hace doble click
    if (isLoggingOut.current) return;
    isLoggingOut.current = true;

    try {
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
        allowOutsideClick: false,
        allowEscapeKey: true,
        customClass: {
          popup: "rounded-xl border border-[#1e1e1e]",
          confirmButton: "px-6 py-2.5 text-sm font-semibold",
          cancelButton: "px-6 py-2.5 text-sm font-semibold",
        },
      });

      // Si el usuario canceló, no hacemos nada
      if (!result.isConfirmed) return;

      // Limpiamos la sesión SIN redirigir automáticamente
      await signOut({ redirect: false });

      // Redirigimos manualmente al login
      router.push("/login");
      router.refresh();
    } finally {
      isLoggingOut.current = false;
    }
  };

  return { handleLogout };
};