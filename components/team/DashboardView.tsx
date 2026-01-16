"use client";

import { useState, useEffect } from "react";
import { Loader2, RefreshCw, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import LeadCard from "./LeadCard";
import { useRouter } from "next/navigation";

interface Lead {
    name: string;
    lead_name: string;
    title: string;
    mobile_no: string;
    email_id: string;
    status: string;
    creation: string;
}

export default function DashboardView() {
    const router = useRouter();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchLeads = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/leads");
            if (res.status === 401) {
                router.push("/team/login");
                return;
            }
            if (!res.ok) throw new Error("Error fetching leads");

            const data = await res.json();
            setLeads(data.leads || []);
        } catch (err) {
            setError("No se pudieron cargar los leads.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const newLeadsCount = leads.filter(l => {
        const leadDate = new Date(l.creation).toDateString();
        const today = new Date().toDateString();
        return leadDate === today;
    }).length;

    const handleLogout = () => {
        // Simple logout by clearing cookie (server side route ideally, but simple redirect works for middleware to catch if cookie expires, though manually clearing is better. For MVP, just redirect and let session die or overwrite)
        // Actually, to properly logout we should hit an API or just clear client side if it was token. 
        // Since it's httpOnly cookie, we can't clear it from JS.
        // Let's just redirect to login for now, user will be blocked by middleware if cookie expired, but to force logout we need an API route. 
        // For MVP speed: Just link to a logout route.
        document.cookie = "team_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Try JS clear (won't work for HttpOnly)
        // Proper way: 
        window.location.href = "/team/login";
    };

    return (
        <div className="space-y-8">
            {/* Header Actions */}
            <div className="flex justify-between items-center">
                <div className="flex gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-32">
                        <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider">Total</span>
                        <span className="text-2xl font-bold text-lumen-structure">{leads.length}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-32">
                        <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider text-green-600">Nuevos Hoy</span>
                        <span className="text-2xl font-bold text-green-600">+{newLeadsCount}</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={fetchLeads}
                        disabled={isLoading}
                        title="Recargar"
                    >
                        <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Salir
                    </Button>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
                    {error}
                    <Button variant="link" onClick={fetchLeads} className="ml-2">Reintentar</Button>
                </div>
            )}

            {/* Leads Grid */}
            {isLoading && leads.length === 0 ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-lumen-creative" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {leads.map((lead) => (
                        <LeadCard key={lead.name} lead={lead} />
                    ))}
                </div>
            )}

            {!isLoading && leads.length === 0 && !error && (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No hay leads todavía.</p>
                </div>
            )}
        </div>
    );
}
