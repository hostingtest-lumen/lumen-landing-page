"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    LayoutList,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Home,
    Calendar,
    Shield,
    CheckCircle,
    DollarSign,
    MessageCircle
} from "lucide-react";
import { AuthProvider, useAuth } from "@/components/providers/AuthProvider";
import { UserRole } from "@/types/auth";

// Menu Configuration with Role Access
interface MenuItem {
    name: string;
    icon: any;
    href: string;
    roles?: UserRole[]; // If undefined, accessible by all
    badge?: string; // Optional badge
}

const MENU_ITEMS_CONFIG: MenuItem[] = [
    { name: 'Inicio', icon: Home, href: '/dashboard' },
    { name: 'Tareas', icon: LayoutList, href: '/dashboard/tasks' },
    { name: 'Aprobaciones', icon: CheckCircle, href: '/dashboard/deliverables' },
    { name: 'Soporte', icon: MessageCircle, href: '/dashboard/support', roles: ['admin', 'sales', 'strategist'] },
    { name: 'CRM', icon: Users, href: '/dashboard/leads', roles: ['admin', 'sales', 'strategist'] },
    { name: 'Finanzas', icon: DollarSign, href: '/dashboard/finance', roles: ['admin'] },
    { name: 'Calendario', icon: Calendar, href: '/dashboard/calendar' },
    { name: 'Admin', icon: Settings, href: '/dashboard/admin', roles: ['admin'] },
];

function DashboardShell({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { user, isLoading, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    if (isLoading) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-lumen-priority">Cargando Lumen OS...</div>;
    }

    // Filter Menu Items based on Role
    const visibleMenuItems = MENU_ITEMS_CONFIG.filter(item => {
        if (!item.roles) return true; // Public
        if (!user) return false;
        return item.roles.includes(user.role);
    });

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white text-gray-900 border-r border-gray-200">
            <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight uppercase flex items-center gap-2">
                    Lumen <span className="text-lumen-priority text-2xl">•</span> OS
                </h2>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400 font-mono">v3.1.0</span>
                    {user?.role && (
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-lumen-priority/10 text-lumen-priority border border-lumen-priority/20">
                            {user.role}
                        </span>
                    )}
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {visibleMenuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${isActive
                                ? "bg-lumen-priority/10 text-lumen-priority shadow-none"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? "text-lumen-priority" : "text-gray-400 group-hover:text-gray-600"}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100 mt-auto bg-gray-50/50">
                <Link href="/dashboard/profile" className="flex items-center gap-3 mb-4 px-2 hover:bg-white p-2 rounded-lg transition-all cursor-pointer group shadow-sm border border-transparent hover:border-gray-200">
                    <div className="w-8 h-8 rounded-full bg-lumen-priority/10 flex items-center justify-center text-lumen-priority font-bold text-xs ring-1 ring-lumen-priority/20 group-hover:ring-lumen-priority transition-all">
                        {user?.name?.substring(0, 2).toUpperCase() || "KF"}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-lumen-priority transition-colors">
                            {user?.name || "Usuario"}
                        </p>
                        <p className="text-xs text-gray-500 truncate capitalize">{user?.role || "Invitado"}</p>
                    </div>
                </Link>
                <Button variant="ghost" size="sm" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex text-gray-900 relative font-sans">
            {/* Desktop Sidebar */}
            <aside className="w-64 fixed h-full hidden md:flex flex-col z-20 shadow-sm">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden border-r border-gray-200 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`}>
                <SidebarContent />
            </div>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen relative bg-gray-50">
                {/* Mobile Header */}
                <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10 md:hidden flex justify-between items-center shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight uppercase">
                        Lumen <span className="text-lumen-priority">OS</span>
                    </h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-gray-600 hover:bg-gray-100"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </Button>
                </header>

                <main className="flex-1 p-4 md:p-8 overflow-x-hidden relative">
                    <div className="relative z-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <DashboardShell>{children}</DashboardShell>
        </AuthProvider>
    );
}
