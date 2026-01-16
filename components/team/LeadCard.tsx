"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Mail, Clock, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Lead {
    name: string; // ID (e.g. CRM-LEAD-2024-0001)
    lead_name: string;
    title: string; // Institution
    mobile_no: string;
    email_id: string;
    status: string;
    creation: string;
}

const statusColors: Record<string, string> = {
    'Lead': 'bg-gray-100 text-gray-600',
    'Open': 'bg-blue-100 text-blue-600',
    'Replied': 'bg-yellow-100 text-yellow-700',
    'Opportunity': 'bg-green-100 text-green-700',
    'Quotation': 'bg-purple-100 text-purple-700',
    'Lost Lead': 'bg-red-50 text-red-500',
    'Interested': 'bg-lumen-energy/10 text-lumen-energy',
};

const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
        case 'Opportunity': return <CheckCircle2 className="w-4 h-4" />;
        case 'Lost Lead': return <AlertCircle className="w-4 h-4" />;
        default: return <Circle className="w-3 h-3" />;
    }
};

export default function LeadCard({ lead }: { lead: Lead }) {
    // Format date
    const date = new Date(lead.creation).toLocaleDateString('es-ES', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });

    // Check if phone has value
    const hasPhone = lead.mobile_no && lead.mobile_no.length > 5;

    // Clean phone for WhatsApp Link (remove non-numeric)
    const whatsappUrl = hasPhone
        ? `https://wa.me/${lead.mobile_no.replace(/\D/g, '')}`
        : '#';

    const [currentStatus, setCurrentStatus] = useState(lead.status);
    const [isUpdating, setIsUpdating] = useState(false);
    const router = useRouter();

    const handleStatusChange = async (newStatus: string) => {
        setIsUpdating(true);
        try {
            const res = await fetch("/api/leads", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: lead.name, status: newStatus }),
            });

            if (res.ok) {
                setCurrentStatus(newStatus);
                router.refresh();
            }
        } catch (error) {
            console.error("Error updating status");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-400 font-mono mb-1">{lead.name}</span>
                    <h3 className="font-bold text-lg text-lumen-structure leading-tight">
                        {lead.lead_name}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                        {lead.title || "Sin institución"}
                    </p>
                </div>

                {/* Status Dropdown */}
                <div className="relative group">
                    <button
                        disabled={isUpdating}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${statusColors[currentStatus] || 'bg-gray-100 text-gray-600'} ${isUpdating ? 'opacity-50' : 'cursor-pointer'}`}
                    >
                        <StatusIcon status={currentStatus} />
                        {currentStatus}
                        {isUpdating && <div className="animate-spin w-2 h-2 border-2 border-current border-t-transparent rounded-full ml-1" />}
                    </button>

                    {/* Simple Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-100 p-1 hidden group-hover:block z-10">
                        {Object.keys(statusColors).map((status) => (
                            <button
                                key={status}
                                onClick={() => handleStatusChange(status)}
                                className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 rounded-md flex items-center gap-2 text-gray-700"
                            >
                                <StatusIcon status={status} />
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-2 mt-4">
                {hasPhone && (
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors group"
                    >
                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-100">
                            <Phone className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="font-medium">{lead.mobile_no}</span>
                    </a>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                        <Mail className="w-4 h-4 text-gray-400" />
                    </div>
                    <span className="truncate max-w-[200px]">{lead.email_id}</span>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {date}
                </div>
            </div>
        </div>
    );
}
