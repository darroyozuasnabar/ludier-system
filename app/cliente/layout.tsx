"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, Image, Flag, DollarSign, LogOut, Menu, X, Loader2 } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <p className="text-xs font-mono uppercase tracking-[0.14em] text-slate-400">
            Cargando panel…
          </p>
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
    <div className="min-h-screen bg-[#FAFAF8] flex">
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 flex flex-col
          bg-gradient-to-b from-[#16212E] via-[#182633] to-[#0F1720]
          border-r border-t-4 border-t-amber-500 border-r-white/5
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:inset-auto
        `}
      >
        {/* grilla técnica de fondo */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative flex items-center justify-between h-16 px-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-amber-500/15 border border-amber-500/40 flex items-center justify-center">
              <span className="text-amber-400 text-xs font-bold font-mono">L</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-none">Panel Cliente</p>
              <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-indigo-300/50 mt-1">
                LUDIER
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="relative flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-150 relative
                  ${isActive
                    ? "bg-white/[0.08] text-white font-medium"
                    : "text-indigo-100/70 hover:bg-white/[0.05] hover:text-white"}
                `}
                onClick={() => setSidebarOpen(false)}
              >
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-amber-500 rounded-full" />
                )}
                <item.icon className={`w-4.5 h-4.5 ${isActive ? "text-amber-400" : ""}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="relative border-t border-dashed border-white/10 px-4 pt-4">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-rose-400/90 hover:bg-rose-500/10 hover:text-rose-300 transition-colors text-sm"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Cerrar sesión</span>
          </button>
        </div>

        <div className="relative p-4 pt-3 border-t border-white/10">
          <p className="text-[10px] font-mono uppercase tracking-[0.12em] text-indigo-300/50">
            Proyecto
          </p>
          <p className="font-medium text-white text-sm truncate mt-0.5" title={projectName}>
            {projectName}
          </p>
          <p className="text-[11px] text-indigo-300/50 mt-0.5">Acceso como cliente</p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen lg:pl-0">
        <header className="lg:hidden bg-[#16212E] border-b border-t-4 border-t-amber-500 border-white/10 h-16 flex items-center px-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-300 hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-3 font-semibold text-white truncate">
            {projectName}
          </span>
        </header>

        <main
          className="flex-1 p-4 md:p-6 lg:p-8"
          style={{
            backgroundImage:
              "linear-gradient(#00000006 1px, transparent 1px), linear-gradient(90deg, #00000006 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}