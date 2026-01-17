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
}

export function KanbanColumn({ id, title, leads, color, onCardClick }: ColumnProps) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div className="flex flex-col h-full bg-gray-50/50 rounded-2xl border border-gray-100 min-w-[300px]">
            {/* Header */}
            <div className={`p-4 border-b border-gray-100 rounded-t-2xl flex justify-between items-center ${color}`}>
                <h3 className="font-bold text-gray-700">{title}</h3>
                <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-semibold text-gray-600">
                    {leads.length}
                </span>
            </div>

            {/* Droppable Area */}
            <div ref={setNodeRef} className="p-3 flex-1 overflow-y-auto max-h-[calc(100vh-220px)] scrollbar-hide">
                <SortableContext items={leads.map(l => l.name)} strategy={verticalListSortingStrategy}>
                    {leads.map((lead) => (
                        <KanbanCard
                            key={lead.name}
                            lead={lead}
                            onClick={() => onCardClick && onCardClick(lead.name)}
                        />
                    ))}
                </SortableContext>

                {leads.length === 0 && (
                    <div className="h-full border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                        Arrastra aquí
                    </div>
                )}
            </div>
        </div>
    );
}
