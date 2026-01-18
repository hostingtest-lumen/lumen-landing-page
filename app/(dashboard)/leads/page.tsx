"use client";

import { useState, useEffect } from "react";
import KanbanBoard from "@/components/crm/KanbanBoard";
import { LeadListView } from "@/components/crm/LeadListView";
import { LeadSlideOver } from "@/components/crm/LeadSlideOver";
import { Lead } from "@/types/crm";
import { Loader2, LayoutGrid, List, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"board" | "list">("board");
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch Leads (Centralized)
    useEffect(() => {
        fetch("/api/leads")
            .then(res => res.json())
            .then(data => {
                if (data.leads) setLeads(data.leads);
                setIsLoading(false);
            })
            .catch(err => setIsLoading(false));
    }, []);

    const handleLeadUpdate = (updatedLead: Lead) => {
        setLeads(currentLeads =>
            currentLeads.map(l => l.name === updatedLead.name ? updatedLead : l)
        );
    };

    // Filter Logic
    const safeLeads = Array.isArray(leads) ? leads : [];
    const filteredLeads = safeLeads.filter(lead =>
        (lead.lead_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.title && lead.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            {/* Header / Controls */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pipeline de Ventas</h1>
                    <p className="text-gray-500 text-sm">Gestiona tus prospectos y oportunidades.</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-lumen-structure focus:ring-1 focus:ring-lumen-structure transition-all w-64 bg-white"
                        />
                    </div>

                    {/* View Switcher */}
                    <div className="bg-white border border-gray-200 rounded-lg p-1 flex gap-1">
                        <button
                            onClick={() => setViewMode("board")}
                            className={`p-2 rounded-md transition-all ${viewMode === 'board' ? 'bg-lumen-structure/10 text-lumen-structure shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            title="Vista Tablero"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-lumen-structure/10 text-lumen-structure shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            title="Vista Lista"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    <Button className="bg-lumen-structure hover:bg-lumen-creative gap-2">
                        <Plus className="w-4 h-4" /> Nuevo Lead
                    </Button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="animate-spin text-lumen-structure w-8 h-8" />
                    </div>
                ) : (
                    <>
                        {viewMode === "board" ? (
                            <KanbanBoard
                                leads={filteredLeads}
                                onLeadUpdate={handleLeadUpdate}
                                onLeadClick={setSelectedLeadId}
                            />
                        ) : (
                            <div className="h-full overflow-y-auto pr-2">
                                <LeadListView
                                    leads={filteredLeads}
                                    onLeadClick={setSelectedLeadId}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Global Slide Over */}
            <LeadSlideOver
                leadId={selectedLeadId || ""}
                isOpen={!!selectedLeadId}
                onClose={() => setSelectedLeadId(null)}
            />
        </div>
    );
}
