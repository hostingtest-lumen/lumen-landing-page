"use client";

import { LayoutDashboard, Users, FileText, Settings, LogOut, CheckSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const MENU_ITEMS = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Leads (CRM)", icon: Users, href: "/dashboard/leads" },
    { name: "Contenido", icon: FileText, href: "/dashboard/content" },
    { name: "Tareas", icon: CheckSquare, href: "/dashboard/tasks" },
    { name: "Admin", icon: Settings, href: "/dashboard/admin/users", role: "admin" }, // Corrected path
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const handleLogout = () => {
        document.cookie = "lumen_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 fixed h-full hidden md:flex flex-col z-20">
                <div className="p-6">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lumen-creative to-lumen-structure">
                        Lumen OS
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">v0.1.0 Alpha</p>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {MENU_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${isActive
                                    ? "bg-lumen-structure text-white shadow-md shadow-lumen-structure/20"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-lumen-creative/10 flex items-center justify-center text-lumen-creative font-bold text-xs">
                            KF
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-gray-900 truncate">Kevin Flores</p>
                            <p className="text-xs text-gray-500 truncate">Admin</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar Sesión
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64">
                {/* Mobile Header (TODO) */}
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
