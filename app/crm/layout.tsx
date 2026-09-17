"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, FileText, UserRound, Menu, X, Loader2 } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

const navItems = [
  { label: "Clientes",     icon: Users,      href: "/crm/clientes"     },
  { label: "Cotizaciones", icon: FileText,    href: "/crm/cotizaciones" },
  { label: "Contactos",    icon: UserRound,   href: "/crm/contactos"    },
];

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router   = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !["FUNDADOR", "ADMIN"].includes(session.user?.role || "")) {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F4]">
        <Loader2 className="h-8 w-8 animate-spin text-[#C8A46B]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex">
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
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#F0EDE7]
          transform transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#F0EDE7]">
          <h1 className="text-xl font-serif text-[#14213D]">CRM LUDIER</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#8B8680] hover:text-[#14213D]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#5B5750] hover:bg-[#FAF8F4] hover:text-[#14213D] transition-colors"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
          <LogoutButton
            variant="text"
            label="Cerrar sesión"
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg !text-rose-500 hover:!bg-rose-50 mt-4 text-sm"
          />
        </nav>

        {/* Pie del sidebar: usuario */}
        {session?.user && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#F0EDE7]">
            <p className="text-xs font-semibold text-[#14213D] truncate">{session.user.name}</p>
            <p className="text-[10px] text-[#9B9488] truncate">{session.user.email}</p>
          </div>
        )}
      </aside>

      <div className="flex-1 lg:ml-64">
        <header className="lg:hidden bg-white border-b border-[#F0EDE7] h-16 flex items-center px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-[#8B8680] hover:text-[#14213D]"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="ml-3 font-serif text-[#14213D]">CRM LUDIER</h1>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}