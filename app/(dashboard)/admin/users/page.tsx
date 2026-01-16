"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, User, Shield, Briefcase, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";

interface UserData {
    id: string;
    name: string;
    username: string;
    role: "admin" | "team" | "client";
    avatar: string;
}

export default function AdminUsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<UserData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // New User Form State
    const [newUser, setNewUser] = useState({
        name: "",
        username: "",
        password: "",
        role: "team"
    });

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser)
            });

            if (res.ok) {
                setIsModalOpen(false);
                setNewUser({ name: "", username: "", password: "", role: "team" });
                fetchUsers();
                router.refresh();
            }
        } catch (error) {
            console.error("Error creating user");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
                    <p className="text-gray-500">Administra el acceso del equipo a Lumen OS</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="bg-lumen-structure">
                    <Plus className="w-5 h-5 mr-2" />
                    Nuevo Usuario
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                    <Card key={user.id} className="p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-lumen-creative/10 flex items-center justify-center text-lumen-creative font-bold text-lg">
                                    {user.avatar}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{user.name}</h3>
                                    <p className="text-gray-500 text-sm">@{user.username}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                {user.role === 'admin' ? 'Co-Founder' : 'Team'}
                            </span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                {user.role}
                            </div>
                            {/* Delete placeholder */}
                            {user.username !== 'KevinLumen' && (
                                <button className="text-red-400 hover:text-red-600 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Modal de Creación (Simple Overlay) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Crear Nuevo Usuario</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                                <div className="relative">
                                    <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-lumen-creative/50 outline-none"
                                        placeholder="Ej. Estefani Designer"
                                        value={newUser.name}
                                        onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Usuario (Login)</label>
                                <div className="relative">
                                    <Briefcase className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-lumen-creative/50 outline-none"
                                        placeholder="Ej. estefani.lumen"
                                        value={newUser.username}
                                        onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                                <div className="relative">
                                    <Key className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-lumen-creative/50 outline-none"
                                        placeholder="******"
                                        value={newUser.password}
                                        onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                                <select
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lumen-creative/50 outline-none bg-white"
                                    value={newUser.role}
                                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                >
                                    <option value="team">Miembro del Equipo (Acceso Limitado)</option>
                                    <option value="admin">Administrador (Acceso Total)</option>
                                </select>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button type="button" variant="outline" className="w-full" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                                <Button type="submit" className="w-full bg-lumen-structure text-white">Crear Usuario</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
