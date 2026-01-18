<<<<<<< HEAD
"use client";

import { useState, useEffect, useCallback } from "react";
import KanbanBoard from "@/components/crm/KanbanBoard";
import { LeadSlideOver } from "@/components/crm/LeadSlideOver";
import { Lead } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { LayoutList, Kanban, Calendar, Table as TableIcon, Plus, Loader2, Phone, Mail, Clock } from "lucide-react";

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

    // View Switcher
    const [view, setView] = useState<'kanban' | 'list' | 'calendar'>('kanban');

    // Calendar State
    const [currentDate, setCurrentDate] = useState(new Date());

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            // 1. Fetch Leads
            const resLeads = await fetch("/api/leads");
            if (resLeads.ok) {
                const data = await resLeads.json();
                setLeads(data.leads || []);
            }

            // 2. Fetch Events (for Calendar)
            const resEvents = await fetch("/api/erp/events");
            if (resEvents.ok) {
                const data = await resEvents.json();
                setEvents(data.events || []);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleLeadUpdate = (updatedLead: Lead) => {
        setLeads(prev => prev.map(lead =>
            lead.name === updatedLead.name ? updatedLead : lead
        ));
    };

    const handleLeadClick = (id: string) => {
        setSelectedLeadId(id);
        setIsSlideOverOpen(true);
    };

    const handleSlideOverClose = () => {
        setIsSlideOverOpen(false);
        setSelectedLeadId(null);
    };

    // --- Sub Views ---

    const renderList = () => (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                    <tr>
                        <th className="px-6 py-3">Nombre</th>
                        <th className="px-6 py-3">Organización</th>
                        <th className="px-6 py-3">Contacto</th>
                        <th className="px-6 py-3">Estado</th>
                        <th className="px-6 py-3 text-right">Acción</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {leads.map(lead => (
                        <tr key={lead.name} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleLeadClick(lead.name)}>
                            <td className="px-6 py-4 font-bold text-gray-900">{lead.lead_name}</td>
                            <td className="px-6 py-4">{lead.title || "-"}</td>
                            <td className="px-6 py-4 text-gray-500">
                                <div className="flex flex-col gap-1">
                                    {lead.email_id && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email_id}</span>}
                                    {lead.mobile_no && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.mobile_no}</span>}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-lumen-priority/10 text-lumen-priority">
                                    {lead.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <Button variant="ghost" size="sm">Ver Detalles</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderCalendar = () => {
        // Simple List of Events for now or Monthly View
        // User asked for "Calendar for meetings", implies visual
        // Reusing Calendar Logic from planner would be ideal but for speed I'll show a Schedule List first or simple Grid
        // I'll reuse the Grid Logic roughly

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const startOffset = firstDay === 0 ? 6 : firstDay - 1;
        const days = Array(startOffset).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)));

        return (
            <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-lg">{currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</h3>
                    <div className="text-xs text-gray-500">Eventos de ERPNext</div>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-7 gap-1">
                        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => <div key={d} className="text-center text-xs font-bold text-gray-400 py-2">{d}</div>)}
                        {days.map((d, i) => {
                            if (!d) return <div key={i} className="" />;
                            const dateStr = d.toISOString().split('T')[0];
                            const dayEvents = events.filter(e => e.starts_on?.startsWith(dateStr));

                            return (
                                <div key={i} className="min-h-[100px] border border-gray-100 p-1 rounded hover:bg-gray-50">
                                    <div className="text-right text-xs text-gray-400 mb-1">{d.getDate()}</div>
                                    <div className="space-y-1">
                                        {dayEvents.map(ev => (
                                            <div key={ev.name} className="bg-blue-50 text-blue-700 text-[10px] p-1 rounded truncate border border-blue-100" title={ev.subject}>
                                                {ev.subject}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                            Pipeline de Ventas
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                        </h1>
                        <p className="text-gray-500 text-sm">Gestiona leads y reuniones.</p>
                    </div>

                    <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex gap-1 h-fit">
                        <Button
                            variant={view === 'kanban' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setView('kanban')}
                            title="Kanban"
                        >
                            <Kanban className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={view === 'list' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setView('list')}
                            title="Lista"
                        >
                            <TableIcon className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={view === 'calendar' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setView('calendar')}
                            title="Calendario"
                        >
                            <Calendar className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                {view === 'kanban' && (
                    <KanbanBoard
                        leads={leads}
                        onLeadUpdate={handleLeadUpdate}
                        onLeadClick={handleLeadClick}
                        isLoading={isLoading}
                    />
                )}
                {view === 'list' && renderList()}
                {view === 'calendar' && renderCalendar()}
            </div>

            {selectedLeadId && (
                <LeadSlideOver
                    leadId={selectedLeadId}
                    isOpen={isSlideOverOpen}
                    onClose={handleSlideOverClose}
                />
            )}
        </div>
    );
}
=======
"use client";

import KanbanBoard from "@/components/crm/KanbanBoard";
import { useState } from "react";

export default function LeadsPage() {
    const [leads, setLeads] = useState([]);

    const handleLeadUpdate = (lead: any) => { };
    const handleLeadClick = (id: string) => { };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pipeline de Ventas</h1>
                    <p className="text-gray-500 text-sm">Arrastra las tarjetas para actualizar el estado.</p>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <KanbanBoard
                    leads={leads}
                    onLeadUpdate={handleLeadUpdate}
                    onLeadClick={handleLeadClick}
                />
            </div>
        </div>
    );
}
>>>>>>> 7c3690804323f33b4dd3967a201b1c7055721df6
