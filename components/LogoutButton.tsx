// components/LogoutButton.tsx
"use client";

import { LogOut } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";

interface LogoutButtonProps {
  className?: string;
  variant?: "default" | "icon" | "text";
  label?: string;
}

export default function LogoutButton({
  className = "",
  variant = "default",
  label = "Cerrar sesión",
}: LogoutButtonProps) {
  const { handleLogout } = useLogout();

  if (variant === "icon") {
    return (
      <button
        onClick={handleLogout}
        className={`p-2 rounded-lg hover:bg-[#1c1c1c] transition-colors ${className}`}
        aria-label="Cerrar sesión"
      >
        <LogOut className="h-5 w-5 text-[#8A8F96]" />
      </button>
    );
  }

  if (variant === "text") {
    return (
      <button
        onClick={handleLogout}
        className={`text-sm text-[#8A8F96] hover:text-white transition-colors ${className}`}
      >
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#E07B20] rounded-lg hover:bg-[#cf7219] transition-colors ${className}`}
    >
      <LogOut className="h-4 w-4" />
      {label}
    </button>
  );
}