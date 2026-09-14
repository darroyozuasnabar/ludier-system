"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, Image, Flag, DollarSign, Menu, X, Loader2 } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.role !== "CLIENTE") {
      router.push("/cliente/login");
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F4]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#C8A46B]" />
          <p className="text-sm text-[#8B8680]">Cargando panel…</p>
        </div>
      </div>
    );
  }

  const projectName = session.user?.projectName || "Proyecto";

  const navItems = [
    { label: "Dashboard", icon: Home, href: "/cliente/dashboard" },
    { label: "Fotos", icon: Image, href: "/cliente/fotos" },
    { label: "Hitos", icon: Flag, href: "/cliente/hitos" },
    { label: "Valorizaciones", icon: DollarSign, href: "/cliente/valorizaciones" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex">
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#14213D]/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 flex flex-col
          bg-white border-r border-[#F0EDE7] shadow-[4px_0_30px_-15px_rgba(20,33,61,0.15)]
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:inset-auto
        `}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-[#F0EDE7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#14213D] flex items-center justify-center">
              <span className="text-[#C8A46B] text-sm font-serif font-semibold">L</span>
            </div>
            <div>
              <p className="text-sm font-serif text-[#22262B] leading-none">Panel Cliente</p>
              <p className="text-[11px] text-[#B0ABA3] mt-1 tracking-wide">LUDIER</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#8B8680] hover:text-[#22262B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 pt-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all duration-150 relative
                  ${isActive
                    ? "bg-[#F1E7D3] text-[#14213D] font-medium"
                    : "text-[#5B5750] hover:bg-[#FAF8F4] hover:text-[#22262B]"}
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={`w-4.5 h-4.5 ${isActive ? "text-[#B08D4F]" : "text-[#B0ABA3]"}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C8A46B]" />
                )}
              </Link>
            );
          })}
          <LogoutButton
            variant="text"
            label="Cerrar sesión"
            className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl !text-rose-500 hover:!bg-rose-50 mt-4 text-sm"
          />
        </nav>

        <div className="p-5 mx-4 mb-4 rounded-2xl bg-[#FAF8F4] border border-[#F0EDE7]">
          <p className="text-[11px] uppercase tracking-[0.1em] text-[#B0ABA3] mb-1">Proyecto</p>
          <p className="font-medium text-[#22262B] text-sm truncate" title={projectName}>
            {projectName}
          </p>
          <p className="text-xs text-[#8B8680] mt-0.5">Acceso como cliente</p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="lg:hidden bg-white border-b border-[#F0EDE7] h-16 flex items-center px-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-[#8B8680] hover:text-[#22262B] transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-3 font-serif text-[#22262B] truncate">
            {projectName}
          </span>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}