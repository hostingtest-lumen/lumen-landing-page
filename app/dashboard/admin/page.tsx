import Link from "next/link";
import { Users, Shield, Database, Building2 } from "lucide-react";

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Panel de Administración</h1>
                <p className="text-gray-500">Configuración global y gestión del sistema Lumen OS.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/dashboard/admin/users" className="block group">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-lumen-priority/30 transition-all">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700">Usuarios y Roles</h3>
                        <p className="text-sm text-gray-500">Gestiona el personal, asigna roles de Lumen y permisos de acceso.</p>
                    </div>
                </Link>

                <Link href="/dashboard/admin/clients" className="block group">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-lumen-priority/30 transition-all">
                        <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
                            <Building2 className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-700">Cartera de Clientes</h3>
                        <p className="text-sm text-gray-500">Base de datos de clientes, tokens de portal y vinculación con ERPNext.</p>
                    </div>
                </Link>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 opacity-60 cursor-not-allowed">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                        <Database className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Base de Datos</h3>
                    <p className="text-sm text-gray-500">Copias de seguridad y mantenimiento del sistema (Próximamente).</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 opacity-60 cursor-not-allowed">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                        <Shield className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Seguridad</h3>
                    <p className="text-sm text-gray-500">Logs de auditoría y configuración de seguridad (Próximamente).</p>
                </div>
            </div>
        </div>
    );
}

