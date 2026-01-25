"use client";

import { useState, useEffect } from "react";
import { TrendingUp, CheckCircle, Clock, Zap, ArrowRight, Loader2 } from "lucide-react";

interface ProgressStats {
    delivered: number;
    planned: number;
    approved: number;
    pending: number;
}

interface ActivityItem {
    id: string;
    action: string;
    date: string;
    type: "delivery" | "approval" | "feedback" | "milestone";
}

interface ProjectProgressProps {
    clientId?: string;
    stats?: ProgressStats;
    activity?: ActivityItem[];
}

export function ProjectProgress({ clientId, stats: externalStats, activity: externalActivity }: ProjectProgressProps) {
    const [stats, setStats] = useState<ProgressStats>({ delivered: 0, planned: 0, approved: 0, pending: 0 });
    const [activity, setActivity] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (clientId) {
            fetchStats();
        } else if (externalStats) {
            setStats(externalStats);
            setActivity(externalActivity || []);
        } else {
            // Mock data for demo mode
            setStats({
                delivered: 12,
                planned: 16,
                approved: 10,
                pending: 2
            });
            setActivity([
                { id: "1", action: "Post Motivacional aprobado", date: "Hace 2 horas", type: "approval" },
                { id: "2", action: "Nuevo entregable: Reel Behind Scenes", date: "Ayer", type: "delivery" },
                { id: "3", action: "Carousel Educativo - Cambios solicitados", date: "Hace 2 días", type: "feedback" },
                { id: "4", action: "¡Meta mensual alcanzada: 10 contenidos!", date: "Hace 3 días", type: "milestone" },
            ]);
        }
    }, [clientId, externalStats, externalActivity]);

    const fetchStats = async () => {
        if (!clientId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/deliverables?clientId=${clientId}`);
            if (res.ok) {
                const data = await res.json();
                const deliverables = data.deliverables || [];

                const approved = deliverables.filter((d: any) => d.status === 'approved').length;
                const pending = deliverables.filter((d: any) => d.status === 'pending').length;
                const changesRequested = deliverables.filter((d: any) => d.status === 'changes_requested').length;

                setStats({
                    delivered: deliverables.length,
                    planned: Math.max(deliverables.length + 4, 16), // Estimate planned content
                    approved,
                    pending: pending + changesRequested
                });

                // Create activity from deliverables
                const recentActivity: ActivityItem[] = deliverables.slice(0, 4).map((d: any, i: number) => ({
                    id: d.id || String(i),
                    action: d.status === 'approved'
                        ? `${d.title} aprobado`
                        : d.status === 'pending'
                            ? `Nuevo: ${d.title}`
                            : `${d.title} - Cambios solicitados`,
                    date: d.date || 'Reciente',
                    type: d.status === 'approved' ? 'approval' as const :
                        d.status === 'pending' ? 'delivery' as const : 'feedback' as const
                }));
                setActivity(recentActivity);
            }
        } catch (err) {
            console.error("Error fetching progress stats:", err);
        } finally {
            setLoading(false);
        }
    };

    const progressPercent = stats.planned > 0 ? Math.round((stats.delivered / stats.planned) * 100) : 0;
    const approvalRate = stats.delivered > 0 ? Math.round((stats.approved / stats.delivered) * 100) : 0;

    const getActivityIcon = (type: string) => {
        switch (type) {
            case "approval": return <CheckCircle className="w-4 h-4 text-green-500" />;
            case "feedback": return <Clock className="w-4 h-4 text-amber-500" />;
            case "milestone": return <Zap className="w-4 h-4 text-purple-500" />;
            default: return <ArrowRight className="w-4 h-4 text-blue-500" />;
        }
    };

    const getActivityBg = (type: string) => {
        switch (type) {
            case "approval": return "bg-green-50";
            case "feedback": return "bg-amber-50";
            case "milestone": return "bg-purple-50";
            default: return "bg-blue-50";
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-lumen-priority mr-2" />
                <span className="text-gray-500">Cargando progreso...</span>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-lumen-priority" />
                        <h3 className="font-bold text-gray-900">Progreso del Mes</h3>
                    </div>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">
                        {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Main Progress */}
            <div className="p-6">
                <div className="flex items-end justify-between mb-3">
                    <div>
                        <span className="text-4xl font-bold text-gray-900">{progressPercent}%</span>
                        <p className="text-sm text-gray-500 mt-1">
                            {stats.delivered} de {stats.planned} contenidos
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-bold text-green-600">{approvalRate}%</span>
                        <p className="text-xs text-gray-500">tasa de aprobación</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-lumen-priority to-amber-500 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-3 bg-green-50 rounded-xl">
                        <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                        <p className="text-xs text-green-700">Aprobados</p>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded-xl">
                        <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                        <p className="text-xs text-amber-700">Pendientes</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-xl">
                        <p className="text-2xl font-bold text-blue-600">{stats.planned - stats.delivered}</p>
                        <p className="text-xs text-blue-700">Por entregar</p>
                    </div>
                </div>
            </div>

            {/* Activity Timeline */}
            <div className="border-t border-gray-100">
                <div className="p-4 pb-2">
                    <h4 className="text-sm font-bold text-gray-700">Actividad Reciente</h4>
                </div>
                <div className="px-4 pb-4 space-y-2">
                    {activity.length === 0 ? (
                        <div className="text-center py-4 text-gray-400 text-sm">
                            Sin actividad reciente
                        </div>
                    ) : (
                        activity.map((item) => (
                            <div
                                key={item.id}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${getActivityBg(item.type)}`}
                            >
                                <div className="flex-shrink-0">
                                    {getActivityIcon(item.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900 truncate">{item.action}</p>
                                    <p className="text-xs text-gray-500">{item.date}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
