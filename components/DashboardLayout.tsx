"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useCallback, useMemo, memo } from "react";
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
  LogOut,
  Menu,
  X,
  FileCheck, // ← NUEVO ICONO PARA COTIZACIONES
} from "lucide-react";
import NotificacionesTiempoReal from "@/components/NotificacionesTiempoReal";

// Componente memoizado para cada item del menú
const MenuItem = memo(({ item, onClick }: { item: any; onClick?: () => void }) => {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <Icon className="h-5 w-5" />
      <span className="text-sm">{item.label}</span>
    </Link>
  );
});

MenuItem.displayName = "MenuItem";

// Componente memoizado para la sección del usuario
const UserSection = memo(({ userInitial, userName, userRole }: { userInitial: string; userName: string; userRole: string }) => (
  <div className="flex items-center gap-3 mb-6 pb-4 border-b">
    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
      <span className="text-sm font-medium text-orange-600">{userInitial}</span>
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
      <p className="text-xs text-gray-500 truncate">{userRole}</p>
    </div>
  </div>
));

UserSection.displayName = "UserSection";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Memoizar el cierre del sidebar
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);

  // Redirección de autenticación (solo una vez)
  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/login") {
      router.push("/login");
    }
  }, [status, router, pathname]);

  // Logout handler memoizado
  const handleLogout = useCallback(async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
  }, []);

  // Memoizar lista de menú filtrada
  const menuItems = useMemo(() => [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ["FUNDADOR", "JACK", "DIEGO"] },
    { href: "/obras", icon: HardHat, label: "Gestión de Obras", roles: ["FUNDADOR", "JACK"] },
    { href: "/valorizaciones", icon: FileText, label: "Valorizaciones", roles: ["FUNDADOR", "JACK"] },
    { href: "/facturacion", icon: Receipt, label: "Facturación", roles: ["FUNDADOR", "JACK"] },
    // 🔥 NUEVO: Cotizaciones
    { href: "/cotizaciones", icon: FileCheck, label: "Cotizaciones", roles: ["FUNDADOR", "JACK", "DIEGO"] },
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
  ], []);

  const filteredMenu = useMemo(() => {
    const userRole = session?.user?.role || "OPERATIVO";
    return menuItems.filter(item => item.roles.includes(userRole));
  }, [menuItems, session?.user?.role]);

  const userInitial = useMemo(() => 
    session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U", 
    [session?.user?.name, session?.user?.email]
  );

  const userName = useMemo(() => session?.user?.name || "Usuario", [session?.user?.name]);
  const userRole = useMemo(() => session?.user?.role || "", [session?.user?.role]);

  // Estados de carga
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar - Renderizado condicional con lazy loading */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={closeSidebar} />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl p-4 overflow-y-auto animate-in slide-in-from-left duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-orange-500">LUDIER</h2>
              <button onClick={closeSidebar} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <UserSection userInitial={userInitial} userName={userName} userRole={userRole} />
            <nav className="space-y-1">
              {filteredMenu.map((item) => (
                <MenuItem key={item.href} item={item} onClick={closeSidebar} />
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors mt-4"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm">Cerrar sesión</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r flex-col z-40">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-orange-500">LUDIER</h2>
          <UserSection userInitial={userInitial} userName={userName} userRole={userRole} />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-1">
            {filteredMenu.map((item) => (
              <MenuItem key={item.href} item={item} />
            ))}
          </nav>
        </div>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64">
        {/* Header con notificaciones */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 py-2 md:px-8 md:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSidebar}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Abrir menú"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
              <div className="hidden md:block">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Bienvenido</p>
                <p className="text-sm font-medium text-gray-900">{userName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <NotificacionesTiempoReal />
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>

      <style jsx>{`
        @keyframes slide-in-from-left {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-in {
          animation: slide-in-from-left 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}