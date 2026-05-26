"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  HardHat, 
  FileText, 
  Receipt, 
  Package, 
  ShoppingCart, 
  Factory, 
  Users, 
  ClipboardCheck, 
  Calculator, 
  BarChart3, 
  FolderTree, 
  Camera, 
  Bell, 
  FileBarChart, 
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const menuItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ["FUNDADOR", "JACK", "DIEGO"] },
    { href: "/obras", icon: HardHat, label: "Gestión de Obras", roles: ["FUNDADOR", "JACK"] },
    { href: "/valorizaciones", icon: FileText, label: "Valorizaciones", roles: ["FUNDADOR", "JACK"] },
    { href: "/facturacion", icon: Receipt, label: "Facturación", roles: ["FUNDADOR", "JACK"] },
    { href: "/documentos", icon: FolderTree, label: "Documentos", roles: ["FUNDADOR", "JACK", "DIEGO"] },
    { href: "/calidad", icon: ClipboardCheck, label: "Control de Calidad", roles: ["FUNDADOR", "JACK"] },
    { href: "/personal", icon: Users, label: "Personal", roles: ["FUNDADOR", "DIEGO"] },
    { href: "/inventario", icon: Package, label: "Inventario", roles: ["FUNDADOR", "DIEGO"] },
    { href: "/compras", icon: ShoppingCart, label: "Compras", roles: ["FUNDADOR", "DIEGO"] },
    { href: "/produccion", icon: Factory, label: "Producción", roles: ["FUNDADOR", "JACK"] },
    { href: "/costos", icon: Calculator, label: "Costos", roles: ["FUNDADOR", "DIEGO"] },
    { href: "/indicadores", icon: BarChart3, label: "Indicadores", roles: ["FUNDADOR", "DIEGO"] },
    { href: "/fotos", icon: Camera, label: "Fotos", roles: ["FUNDADOR", "JACK"] },
    { href: "/alertas", icon: Bell, label: "Alertas", roles: ["FUNDADOR", "JACK", "DIEGO"] },
    { href: "/reportes", icon: FileBarChart, label: "Reportes", roles: ["FUNDADOR", "DIEGO"] },
  ];

  const filteredMenu = menuItems.filter(item => 
    item.roles.includes(session?.user?.role || "OPERATIVO")
  );

  const userInitial = session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50 bg-white shadow-md">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-orange-500">LUDIER</h2>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <Avatar className="h-10 w-10 bg-orange-100">
                  <AvatarFallback className="text-orange-600">{userInitial}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-800">{session?.user?.name || "Usuario"}</p>
                  <p className="text-xs text-gray-500">{session?.user?.role}</p>
                </div>
              </div>
            </div>
            <ScrollArea className="flex-1">
              <nav className="p-4 space-y-1">
                {filteredMenu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </ScrollArea>
            <div className="p-4 border-t">
              <button
                onClick={() => router.push("/login")}
                className="flex items-center gap-3 px-3 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors w-full"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm">Cerrar sesión</span>
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r flex-col z-40">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-orange-500">LUDIER</h2>
          <div className="flex items-center gap-3 mt-4">
            <Avatar className="h-10 w-10 bg-orange-100">
              <AvatarFallback className="text-orange-600">{userInitial}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-gray-800">{session?.user?.name || "Usuario"}</p>
              <p className="text-xs text-gray-500">{session?.user?.role}</p>
            </div>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <nav className="p-4 space-y-1">
            {filteredMenu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="p-4 border-t">
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-3 px-3 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors w-full"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64">
        <div className="p-4 md:p-8 pt-16 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}