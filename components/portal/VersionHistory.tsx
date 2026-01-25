"use client";

import { Clock, MessageSquare, Upload, Check, AlertCircle, User } from "lucide-react";
import { DeliverableFeedback, DeliverableVersion } from "@/types/deliverables";

interface VersionHistoryProps {
    versions: DeliverableVersion[];
    feedback: DeliverableFeedback[];
    currentVersion: number;
    onVersionClick?: (version: number) => void;
}

export function VersionHistory({
    versions,
    feedback,
    currentVersion,
    onVersionClick
}: VersionHistoryProps) {
    // Combine versions and feedback into a timeline
    const timelineItems = [
        ...versions.map(v => ({
            type: 'version' as const,
            date: v.createdAt,
            version: v.version,
            data: v
        })),
        ...feedback.map(f => ({
            type: 'feedback' as const,
            date: f.date,
            version: f.version,
            data: f
        }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (timelineItems.length === 0) {
        return (
            <div className="text-center py-8 text-gray-400">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Sin historial aún</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {timelineItems.map((item, index) => (
                <div key={index} className="flex gap-3">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.type === 'version'
                                ? 'bg-blue-100 text-blue-600'
                                : item.data.author === 'client'
                                    ? 'bg-yellow-100 text-yellow-600'
                                    : 'bg-green-100 text-green-600'
                            }`}>
                            {item.type === 'version' ? (
                                <Upload className="w-4 h-4" />
                            ) : item.data.author === 'client' ? (
                                <MessageSquare className="w-4 h-4" />
                            ) : (
                                <Check className="w-4 h-4" />
                            )}
                        </div>
                        {index < timelineItems.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 min-h-[20px]" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-4">
                        {item.type === 'version' ? (
                            <div
                                className={`bg-white rounded-lg border p-3 cursor-pointer hover:border-blue-300 transition-colors ${item.version === currentVersion ? 'border-blue-400 ring-1 ring-blue-100' : 'border-gray-200'
                                    }`}
                                onClick={() => onVersionClick?.(item.version!)}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold text-sm text-gray-900">
                                        Versión {item.version}
                                        {item.version === currentVersion && (
                                            <span className="ml-2 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full uppercase font-bold">
                                                Actual
                                            </span>
                                        )}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(item.date).toLocaleDateString('es-ES', {
                                            day: 'numeric',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                {(item.data as DeliverableVersion).notes && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {(item.data as DeliverableVersion).notes}
                                    </p>
                                )}
                                {(item.data as DeliverableVersion).createdBy && (
                                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                                        <User className="w-3 h-3" />
                                        {(item.data as DeliverableVersion).createdBy}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className={`rounded-lg border p-3 ${(item.data as DeliverableFeedback).author === 'client'
                                    ? 'bg-yellow-50 border-yellow-200'
                                    : 'bg-green-50 border-green-200'
                                }`}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-sm">
                                        {(item.data as DeliverableFeedback).author === 'client'
                                            ? '💬 Feedback del Cliente'
                                            : '✅ Respuesta del Equipo'
                                        }
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(item.date).toLocaleDateString('es-ES', {
                                            day: 'numeric',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 mt-1">
                                    "{(item.data as DeliverableFeedback).comment}"
                                </p>
                                {item.version && (
                                    <span className="text-[10px] text-gray-400 mt-2 inline-block">
                                        Sobre versión {item.version}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

// Compact version for the list view
export function VersionBadge({ version, isLatest }: { version: number; isLatest?: boolean }) {
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono ${isLatest
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
            v{version}
            {isLatest && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
        </span>
    );
}

// Deadline indicator
export function DeadlineIndicator({ deadline }: { deadline: string }) {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    let color = 'text-gray-500 bg-gray-100';
    let text = '';

    if (diffDays < 0) {
        color = 'text-red-600 bg-red-100';
        text = `Vencido hace ${Math.abs(diffDays)} día${Math.abs(diffDays) !== 1 ? 's' : ''}`;
    } else if (diffDays === 0) {
        color = 'text-red-600 bg-red-100';
        text = 'Vence hoy';
    } else if (diffDays === 1) {
        color = 'text-orange-600 bg-orange-100';
        text = 'Vence mañana';
    } else if (diffDays <= 3) {
        color = 'text-yellow-600 bg-yellow-100';
        text = `Vence en ${diffDays} días`;
    } else {
        color = 'text-green-600 bg-green-100';
        text = deadlineDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    }

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
            <Clock className="w-3 h-3" />
            {text}
        </span>
    );
}

// Priority badge
export function PriorityBadge({ priority }: { priority: 'low' | 'normal' | 'high' | 'urgent' }) {
    const config = {
        low: { color: 'bg-gray-100 text-gray-600', label: 'Baja' },
        normal: { color: 'bg-blue-100 text-blue-600', label: 'Normal' },
        high: { color: 'bg-orange-100 text-orange-600', label: 'Alta' },
        urgent: { color: 'bg-red-100 text-red-600', label: 'Urgente' }
    };

    const { color, label } = config[priority];

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
            {priority === 'urgent' && <AlertCircle className="w-3 h-3" />}
            {label}
        </span>
    );
}
