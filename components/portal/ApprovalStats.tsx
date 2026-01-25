"use client";

import { CheckCircle, Clock, MessageSquare, AlertTriangle, TrendingUp, FileText } from "lucide-react";
import { Deliverable } from "@/types/deliverables";

interface ApprovalStatsProps {
    deliverables: Deliverable[];
}

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    sublabel?: string;
    color: 'green' | 'yellow' | 'red' | 'blue' | 'purple';
}

function StatCard({ icon, label, value, sublabel, color }: StatCardProps) {
    const colorClasses = {
        green: 'bg-green-50 text-green-600 border-green-100',
        yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
        red: 'bg-red-50 text-red-600 border-red-100',
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100'
    };

    const iconClasses = {
        green: 'bg-green-100 text-green-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        red: 'bg-red-100 text-red-600',
        blue: 'bg-blue-100 text-blue-600',
        purple: 'bg-purple-100 text-purple-600'
    };

    return (
        <div className={`rounded-xl p-4 border ${colorClasses[color]} transition-transform hover:scale-[1.02]`}>
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconClasses[color]}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-xs font-medium opacity-70">{label}</p>
                    {sublabel && <p className="text-[10px] opacity-50 mt-0.5">{sublabel}</p>}
                </div>
            </div>
        </div>
    );
}

export function ApprovalStats({ deliverables }: ApprovalStatsProps) {
    const total = deliverables.length;
    const pending = deliverables.filter(d => d.status === 'pending').length;
    const approved = deliverables.filter(d => d.status === 'approved').length;
    const changesRequested = deliverables.filter(d => d.status === 'changes_requested').length;
    const inRevision = deliverables.filter(d => d.status === 'in_revision').length;

    // Calculate overdue
    const now = new Date();
    const overdue = deliverables.filter(d => {
        if (d.status === 'approved' || !d.deadline) return false;
        return new Date(d.deadline) < now;
    }).length;

    // Calculate approval rate
    const totalClosed = approved + changesRequested;
    const approvalRate = totalClosed > 0 ? Math.round((approved / totalClosed) * 100) : 0;

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            <StatCard
                icon={<FileText className="w-5 h-5" />}
                label="Total"
                value={total}
                color="blue"
            />
            <StatCard
                icon={<Clock className="w-5 h-5" />}
                label="Pendientes"
                value={pending}
                sublabel="esperando cliente"
                color="yellow"
            />
            <StatCard
                icon={<CheckCircle className="w-5 h-5" />}
                label="Aprobados"
                value={approved}
                color="green"
            />
            <StatCard
                icon={<MessageSquare className="w-5 h-5" />}
                label="Cambios Solicitados"
                value={changesRequested + inRevision}
                sublabel={inRevision > 0 ? `${inRevision} en revisión` : undefined}
                color="purple"
            />
            <StatCard
                icon={<AlertTriangle className="w-5 h-5" />}
                label="Vencidos"
                value={overdue}
                color="red"
            />
            <StatCard
                icon={<TrendingUp className="w-5 h-5" />}
                label="Tasa Aprobación"
                value={`${approvalRate}%`}
                sublabel={`${approved}/${totalClosed} cerrados`}
                color="green"
            />
        </div>
    );
}
