"use client";

import { Lead, LEAD_STATUSES } from "@/types/crm";
import { Phone, Mail, Calendar, ChevronDown, ChevronRight, User } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LeadListViewProps {
    leads: Lead[];
    onLeadClick: (id: string) => void;
}

export function LeadListView({ leads, onLeadClick }: LeadListViewProps) {
    // State to track collapsed/expanded groups (default all expanded)
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
        LEAD_STATUSES.reduce((acc, status) => ({ ...acc, [status.id]: true }), {})
    );

    const toggleGroup = (statusId: string) => {
        setExpandedGroups(prev => ({ ...prev, [statusId]: !prev[statusId] }));
    };

    return (
        <div className="space-y-6 pb-20">
            {LEAD_STATUSES.map((status) => {
                const groupLeads = leads.filter(l => l.status === status.id);
                if (groupLeads.length === 0) return null;

                const isExpanded = expandedGroups[status.id];

                return (
                    <div key={status.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                        {/* Group Header */}
                        <div
                            className={`flex items-center gap-2 p-3 cursor-pointer hover:bg-gray-50 transition-colors border-b ${isExpanded ? 'border-gray-100' : 'border-transparent'}`}
                            onClick={() => toggleGroup(status.id)}
                        >
                            <button className="text-gray-400 hover:text-gray-600">
                                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                            <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${status.color} ${status.textColor}`}>
                                {status.title}
                            </div>
                            <span className="text-xs text-gray-400 font-medium">{groupLeads.length}</span>
                        </div>

                        {/* Group Content (List) */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="divide-y divide-gray-50">
                                        {/* Table Header (Optional, for aesthetics) */}
                                        <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50/50 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                            <div className="col-span-4">Nombre</div>
                                            <div className="col-span-3">Institución</div>
                                            <div className="col-span-3">Contacto</div>
                                            <div className="col-span-2 text-right">Fecha</div>
                                        </div>

                                        {groupLeads.map((lead) => (
                                            <div
                                                key={lead.name}
                                                onClick={() => onLeadClick(lead.name)}
                                                className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-blue-50/30 cursor-pointer transition-colors group"
                                            >
                                                {/* Name */}
                                                <div className="col-span-4 flex items-center gap-3">
                                                    <div className={`w-1 h-8 rounded-full ${status.color.replace('bg-', 'bg-')}-400 group-hover:h-8 h-0 transition-all duration-300 w-0 group-hover:w-1 bg-lumen-structure`} />
                                                    {/* We can use the status color bar logic here too if we want */}
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900 group-hover:text-lumen-structure transition-colors">
                                                            {lead.lead_name}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 font-mono">{lead.name}</p>
                                                    </div>
                                                </div>

                                                {/* Title */}
                                                <div className="col-span-3">
                                                    <p className="text-xs text-gray-600 truncate">{lead.title || "—"}</p>
                                                </div>

                                                {/* Contact */}
                                                <div className="col-span-3 flex items-center gap-3">
                                                    {lead.mobile_no ? (
                                                        <div className="flex items-center gap-1 text-xs text-gray-500" title={lead.mobile_no}>
                                                            <Phone className="w-3 h-3 text-green-600" />
                                                            <span className="truncate max-w-[80px]">{lead.mobile_no}</span>
                                                        </div>
                                                    ) : <span className="text-gray-300">-</span>}

                                                    {lead.email_id && (
                                                        <div className="flex items-center gap-1 text-xs text-gray-500" title={lead.email_id}>
                                                            <Mail className="w-3 h-3 text-blue-500" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Date */}
                                                <div className="col-span-2 text-right">
                                                    <p className="text-xs text-gray-400">
                                                        {new Date(lead.creation).toLocaleDateString("es-ES", { day: 'numeric', month: 'short' })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}
