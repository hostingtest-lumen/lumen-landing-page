"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanCard } from "./KanbanCard";

interface ColumnProps {
    id: string;
    title: string;
    leads: any[];
    color: string;
    onCardClick?: (id: string) => void;
    accentColor?: string;
}

export function KanbanColumn({ id, title, leads, color, onCardClick, accentColor }: ColumnProps) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div className="flex flex-col h-full bg-gray-50/50 rounded-2xl border border-gray-100 min-w-[280px] max-w-[300px]">
            {/* Header */}
            <div className={`p-4 border-b border-gray-100 rounded-t-2xl flex justify-between items-center ${color} flex-shrink-0`}>
                <div className="flex items-center gap-2">
                    {accentColor && <div className={`w-2.5 h-2.5 rounded-full ${accentColor}`} />}
                    <h3 className="font-bold text-gray-700 text-sm">{title}</h3>
                </div>
                <span className="bg-white/60 px-2 py-0.5 rounded-full text-xs font-semibold text-gray-600">
                    {leads.length}
                </span>
            </div>

            {/* Droppable Area - Scrollable con scrollbar visible */}
            <div
                ref={setNodeRef}
                className="p-3 flex-1 overflow-y-auto min-h-0"
                style={{
                    maxHeight: 'calc(100vh - 320px)',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#d1d5db transparent'
                }}
            >
                <SortableContext items={leads.map(l => l.name)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                        {leads.map((lead) => (
                            <KanbanCard
                                key={lead.name}
                                lead={lead}
                                onClick={() => onCardClick && onCardClick(lead.name)}
                            />
                        ))}
                    </div>
                </SortableContext>

                {leads.length === 0 && (
                    <div className="h-32 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                        Arrastra aquí
                    </div>
                )}
            </div>

            {/* Indicador de scroll cuando hay muchas tarjetas */}
            {leads.length > 5 && (
                <div className="px-3 py-1.5 bg-gradient-to-t from-gray-100 to-transparent text-center flex-shrink-0">
                    <span className="text-[10px] text-gray-400 font-medium">↓ Scroll para ver más ({leads.length} leads)</span>
                </div>
            )}
        </div>
    );
}

