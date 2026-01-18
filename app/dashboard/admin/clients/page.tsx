"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon, Building2, ExternalLink, RefreshCw, Plus, Loader2, Instagram, Phone, Briefcase, X, Pencil, Trash2 } from "lucide-react";
import { Client } from "@/types/clients";
import { clientService } from "@/lib/clients";
import Link from "next/link";

export default function ClientsAdminPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        instagram: "",
        industry: "",
        contactPhone: ""
    });

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/clients');
            if (res.ok) {
                const data = await res.json();
                setClients(data.clients || []);
            }
        } catch (error) {
            console.error("Error loading clients:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setEditingId(null);
        setFormData({ name: "", instagram: "", industry: "", contactPhone: "" });
        setShowForm(true);
    };

    const handleOpenEdit = (client: Client) => {
        setEditingId(client.id);
        setFormData({
            name: client.name,
            instagram: client.instagram || "",
            industry: client.industry || "",
            contactPhone: client.contactPhone || ""
        });
        setShowForm(true);
    };

    const handleSave = async () => {
        if (!formData.name.trim()) return;

        setIsSaving(true);
        try {
            const method = editingId ? 'PUT' : 'POST';
            const body = editingId ? { id: editingId, ...formData } : formData;

            const res = await fetch('/api/clients', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                const data = await res.json();

                // Sync to localStorage
                if (data.client) {
                    // If editing, we might need a distinct update method in clientService, 
                    // but 'add' overwrites if we implement it correctly or we can just re-sync all.
                    // For now, let's just re-fetch or update list manually.

                    // Actually, clientService.add just prepends. 
                    // Ideally we should have clientService.update or just reload from API.
                }

                if (editingId) {
                    setClients(clients.map(c => c.id === editingId ? data.client : c));
                    alert("✅ Cliente actualizado correctamente");
                } else {
                    setClients([data.client, ...clients]);
                    clientService.add(data.client); // Keep syncing new ones for now
                    const erpStatus = data.erpCreated ? "✅ Registrado en ERPNext" : "⚠️ Solo local (ERPNext no disponible)";
                    alert(`🎉 ¡Cliente creado! Notificación enviada.\n\n${erpStatus}`);
                }

                setShowForm(false);
            } else {
                const error = await res.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error("Error saving client:", error);
            alert("Error al guardar cliente");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`¿Estás seguro que deseas eliminar a ${name}?\nEsta acción no se puede deshacer.`)) return;

        try {
            const res = await fetch(`/api/clients?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setClients(clients.filter(c => c.id !== id));
            } else {
                alert("Error al eliminar cliente");
            }
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };

    const copyPortalLink = (token: string) => {
        const link = `${window.location.origin}/portal/${token}`;
        navigator.clipboard.writeText(link);
        alert(`Link del portal copiado: ${link}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Cartera de Clientes</h1>
                    <p className="text-gray-500 text-sm">Gestiona los accesos al portal de clientes y la vinculación con ERPNext.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="text-gray-600" onClick={loadClients}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Sincronizar
                    </Button>
                    <Button
                        className="bg-lumen-priority hover:bg-lumen-priority/90 text-white"
                        onClick={handleOpenCreate}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Nuevo Cliente
                    </Button>
                </div>
            </div>

            {/* Client Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingId ? "✏️ Editar Cliente" : "🎉 Nuevo Cliente"}
                            </h2>
                            <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Cliente *</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Fundación Hospital San Antonio"
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lumen-priority focus:border-transparent"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Instagram className="w-4 h-4 inline mr-1" />
                                    Instagram
                                </label>
                                <input
                                    type="text"
                                    placeholder="@usuario"
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lumen-priority focus:border-transparent"
                                    value={formData.instagram}
                                    onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Briefcase className="w-4 h-4 inline mr-1" />
                                    Rubro / Industria
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Salud, Educación..."
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lumen-priority focus:border-transparent"
                                    value={formData.industry}
                                    onChange={e => setFormData({ ...formData, industry: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Phone className="w-4 h-4 inline mr-1" />
                                    Teléfono de Contacto
                                </label>
                                <input
                                    type="text"
                                    placeholder="+58 424-123-4567"
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lumen-priority focus:border-transparent"
                                    value={formData.contactPhone}
                                    onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setShowForm(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                className="flex-1 bg-lumen-priority text-white"
                                onClick={handleSave}
                                disabled={isSaving || !formData.name.trim()}
                            >
                                {isSaving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        {editingId ? <Pencil className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                                        {editingId ? "Guardar Cambios" : "Crear y Notificar"}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Client Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3">Cliente</th>
                            <th className="px-6 py-3 hidden md:table-cell">Instagram</th>
                            <th className="px-6 py-3 hidden md:table-cell">Rubro</th>
                            <th className="px-6 py-3">ERP ID</th>
                            <th className="px-6 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-400">Cargando clientes...</td></tr>
                        ) : clients.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-400">No hay clientes registrados.</td></tr>
                        ) : clients.map((client) => (
                            <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded flex items-center justify-center">
                                            <Building2 className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <Link href={`/dashboard/admin/clients/${client.id}`} className="font-medium hover:text-lumen-priority hover:underline">
                                                {client.name}
                                            </Link>
                                            {client.contactPhone && (
                                                <p className="text-xs text-gray-400">{client.contactPhone}</p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500 hidden md:table-cell">
                                    {client.instagram ? (
                                        <a
                                            href={`https://instagram.com/${client.instagram}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-pink-600 hover:underline"
                                        >
                                            @{client.instagram.replace('@', '')}
                                        </a>
                                    ) : '-'}
                                </td>
                                <td className="px-6 py-4 text-gray-500 hidden md:table-cell">{client.industry || '-'}</td>
                                <td className="px-6 py-4 text-gray-500 font-mono text-xs">{client.erpId}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => copyPortalLink(client.token)}
                                            title="Copiar Link Portal"
                                        >
                                            <LinkIcon className="w-4 h-4 text-gray-400 hover:text-lumen-priority" />
                                        </Button>
                                        <Link href={`/portal/${client.token}`} target="_blank">
                                            <Button variant="ghost" size="sm" title="Ver Portal">
                                                <ExternalLink className="w-4 h-4 text-lumen-view" />
                                            </Button>
                                        </Link>

                                        <div className="w-px h-4 bg-gray-300 mx-1"></div>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleOpenEdit(client)}
                                            title="Editar Cliente"
                                        >
                                            <Pencil className="w-4 h-4 text-blue-500" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(client.id, client.name)}
                                            title="Eliminar Cliente"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
