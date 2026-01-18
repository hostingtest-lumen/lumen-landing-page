"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, Smartphone, Save, Loader2, Camera, MapPin } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { UserRole, ROLE_LABELS } from "@/types/auth";

export default function ProfilePage() {
    const { user, switchRole, updateProfile } = useAuth();
    const [isSaving, setIsSaving] = useState(false);

    // Local state for form handling before save
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        location: "",
        bio: ""
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                location: user.location || "",
                bio: user.bio || ""
            });
        }
    }, [user]);

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        updateProfile(formData);
        setIsSaving(false);
    };

    if (!user) return <div className="p-8 text-center text-gray-500">Cargando perfil...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Mi Perfil</h1>
                    <p className="text-gray-500 text-sm">Gestiona tu información personal y preferencias</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-lumen-priority hover:bg-lumen-priority/90 text-white shadow-md shadow-lumen-priority/20 gap-2"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Guardar Cambios
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Avatar & Quick Stats */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-lumen-vision/10 to-lumen-priority/10"></div>
                        <div className="relative mt-8 mb-4 inline-block">
                            <div className="w-24 h-24 rounded-full bg-lumen-priority text-white flex items-center justify-center text-3xl font-bold ring-4 ring-white shadow-lg mx-auto">
                                {user.name?.substring(0, 2).toUpperCase() || "KF"}
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 text-gray-600 hover:text-lumen-priority transition-colors">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>

                        {/* Role Badge */}
                        <div className="flex justify-center mb-4">
                            <span className="px-3 py-1 bg-lumen-priority/10 text-lumen-priority text-xs font-bold uppercase rounded-full border border-lumen-priority/20">
                                {ROLE_LABELS[user.role]}
                            </span>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
                            <MapPin className="w-4 h-4" />
                            {user.location || "Ubicación no definida"}
                        </div>

                        <div className="border-t border-gray-100 pt-6 grid grid-cols-2 text-center">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">12</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Proyectos</p>
                            </div>
                            <div className="border-l border-gray-100">
                                <p className="text-2xl font-bold text-gray-900">48</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Tareas</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-lumen-priority" />
                            Seguridad
                        </h3>
                        {/* ... buttons ... */}
                        <div className="space-y-4">
                            <Button variant="outline" className="w-full justify-start text-gray-600 hover:bg-gray-50">
                                Cambiar Contraseña
                            </Button>
                            <Button variant="outline" className="w-full justify-start text-gray-600 hover:bg-gray-50">
                                Activar 2FA
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Form */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">Simulación:</span>
                                <select
                                    value={user.role}
                                    onChange={(e) => switchRole(e.target.value as UserRole)}
                                    className="text-xs font-medium border-gray-200 rounded p-1 text-gray-700 cursor-pointer hover:border-lumen-priority focus:ring-lumen-priority"
                                >
                                    {Object.entries(ROLE_LABELS).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-400" />
                                    Nombre Completo
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-lumen-priority focus:ring-1 focus:ring-lumen-priority transition-all outline-none text-gray-900 placeholder-gray-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-gray-400" />
                                    Rol Actual
                                </label>
                                <input
                                    type="text"
                                    value={ROLE_LABELS[user.role]}
                                    disabled
                                    className="w-full p-2.5 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                                />
                            </div>

                            {/* ... Rest of fields (Email, Phone, Bio) using formData ... */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    Email Corporativo
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full p-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-lumen-priority focus:ring-1 focus:ring-lumen-priority transition-all outline-none text-gray-900 placeholder-gray-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Smartphone className="w-4 h-4 text-gray-400" />
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full p-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-lumen-priority focus:ring-1 focus:ring-lumen-priority transition-all outline-none text-gray-900 placeholder-gray-400"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-gray-700">Bio</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-lumen-priority focus:ring-1 focus:ring-lumen-priority transition-all outline-none text-gray-900 placeholder-gray-400 min-h-[100px] resize-none"
                                />
                                <p className="text-xs text-gray-500 text-right">{formData.bio.length}/300 carácteres</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
