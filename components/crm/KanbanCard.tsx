"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Phone, Mail, Clock } from "lucide-react";
import { CSSProperties } from "react";

interface Lead {
    name: string;
    lead_name: string;
    title: string;
    mobile_no: string;
    email_id: string;
    status: string;
    creation: string;
}

interface KanbanCardProps {
    lead: Lead;
    onClick?: () => void;
}

export function KanbanCard({ lead, onClick }: KanbanCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: lead.name, data: { ...lead } });

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    const date = new Date(lead.creation).toLocaleDateString('es-ES', {
        day: 'numeric', month: 'short'
    });

    const statusColorMap: Record<string, string> = {
        'Lead': 'bg-gray-400',
        'Open': 'bg-blue-400',
        'Replied': 'bg-indigo-400',
        'Opportunity': 'bg-yellow-400',
        'Quotation': 'bg-purple-400',
        'Interested': 'bg-green-400',
        'Lost Lead': 'bg-red-400'
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onClick}
            className="bg-white p-4 pr-3 rounded-xl shadow-sm border border-gray-100/50 hover:shadow-lg hover:border-lumen-creative/30 cursor-pointer active:scale-[0.98] transition-all mb-3 group relative overflow-hidden"
        >
            {/* Status Accent Bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusColorMap[lead.status] || 'bg-gray-300'}`} />

            <div className="flex justify-between items-start mb-3 pl-2">
                <div>
                    <span className="text-[10px] text-gray-400 font-mono block mb-0.5 tracking-wider uppercase">
                        {lead.status}
                    </span>
                    <h4 className="font-bold text-gray-800 leading-tight text-base group-hover:text-lumen-structure transition-colors">
                        {lead.lead_name}
                    </h4>
                    <p className="text-xs text-gray-500 truncate max-w-[160px] font-medium mt-0.5">
                        {lead.title || "Institución Desconocida"}
                    </p>
                </div>
            </div>

            <div className="flex gap-2 pt-2 pl-2 border-t border-gray-50 text-gray-400 items-center">
                {lead.mobile_no && (
                    <div className="bg-green-50 p-1.5 rounded-md text-green-600">
                        <Phone className="w-3 h-3" />
                    </div>
                )}
                {lead.email_id && (
                    <div className="bg-blue-50 p-1.5 rounded-md text-blue-500">
                        <Mail className="w-3 h-3" />
                    </div>
                )}
                <div className="ml-auto flex items-center gap-1.5 text-[10px] font-medium bg-gray-50 px-2 py-1 rounded-md text-gray-500">
                    <Clock className="w-3 h-3 text-gray-400" />
                    {date}
                </div>
            </div>
        </div>
    );
}
