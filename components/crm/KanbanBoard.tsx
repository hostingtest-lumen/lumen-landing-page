"use client";

import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent, DragOverEvent, DragEndEvent } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { Loader2 } from "lucide-react";
import { Lead, LEAD_STATUSES } from "@/types/crm";
import { Pipeline, PipelineColumn, PIPELINE_COLORS } from "@/types/pipelines";
import { useState } from "react";
import { SkeletonKanbanColumn } from "@/components/ui/skeleton";
import { EmptyPipeline } from "@/components/ui/empty-state";

interface KanbanBoardProps {
    leads: Lead[];
    onLeadUpdate: (updatedLead: Lead) => void;
    onLeadClick: (id: string) => void;
    isLoading?: boolean;
    // NEW: Pipeline support
    pipeline?: Pipeline | null;
    onAddLead?: () => void;
}

export default function KanbanBoard({
    leads,
    onLeadUpdate,
    onLeadClick,
    isLoading = false,
    pipeline,
    onAddLead
}: KanbanBoardProps) {
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // Use pipeline columns or fall back to default statuses
    const columns = pipeline?.columns
        ? pipeline.columns.sort((a, b) => a.order - b.order).map(col => ({
            id: col.id,
            title: col.name,
            color: `bg-${col.color}-50`,
            textColor: `text-${col.color}-700`,
            accentColor: PIPELINE_COLORS.find(c => c.id === col.color)?.class || 'bg-gray-500'
        }))
        : LEAD_STATUSES.map(s => ({
            id: s.id,
            title: s.title,
            color: s.color,
            textColor: s.textColor,
            accentColor: 'bg-gray-400'
        }));

    const getLeadColumn = (lead: Lead) => {
        // If using pipelines, use columnId; otherwise use status
        if (pipeline) {
            return lead.columnId || columns[0]?.id;
        }
        return lead.status;
    };

    const findContainer = (id: string) => {
        const lead = leads.find(l => l.name === id);
        if (lead) {
            return getLeadColumn(lead);
        }
        return columns.find(c => c.id === id)?.id;
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        // Optional: could show preview of where card will land
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;
        const activeLead = leads.find(l => l.name === activeId);

        // Determine new column/status
        let newColumnId = overId;
        const overLead = leads.find(l => l.name === overId);
        if (overLead) {
            newColumnId = getLeadColumn(overLead);
        }

        // Validate column exists
        if (!columns.find(c => c.id === newColumnId)) {
            if (!columns.find(c => c.id === overId)) return;
            newColumnId = overId;
        }

        const currentColumn = activeLead ? getLeadColumn(activeLead) : null;

        // Update if changed
        if (activeLead && currentColumn !== newColumnId) {
            const updatedLead = pipeline
                ? { ...activeLead, columnId: newColumnId }
                : { ...activeLead, status: newColumnId };

            onLeadUpdate(updatedLead);

            try {
                await fetch("/api/leads", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: activeId,
                        ...(pipeline ? { columnId: newColumnId } : { status: newColumnId })
                    }),
                });
            } catch (error) {
                console.error("Failed to update status", error);
            }
        }
    };

    // Loading state with skeletons
    if (isLoading) {
        return (
            <div className="flex gap-4 overflow-x-auto pb-4 h-full items-start">
                {[1, 2, 3, 4].map(i => (
                    <SkeletonKanbanColumn key={i} />
                ))}
            </div>
        );
    }

    const safeLeads = leads || [];

    // Empty state
    if (safeLeads.length === 0) {
        return (
            <div className="flex gap-4 overflow-x-auto pb-4 h-full items-start">
                {columns.map((col) => (
                    <div
                        key={col.id}
                        className={`flex-shrink-0 w-72 rounded-xl p-3 ${col.color} min-h-[200px]`}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <div className={`w-2 h-2 rounded-full ${col.accentColor}`} />
                            <h3 className={`font-semibold text-sm ${col.textColor}`}>{col.title}</h3>
                            <span className="ml-auto text-xs text-gray-400 bg-white/60 px-1.5 py-0.5 rounded-full">0</span>
                        </div>
                        {col === columns[0] && (
                            <EmptyPipeline onAction={onAddLead} />
                        )}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
        >
            <div className="flex gap-4 overflow-x-auto pb-4 h-full items-start">
                {columns.map((col) => {
                    const columnLeads = safeLeads.filter(l => getLeadColumn(l) === col.id);
                    return (
                        <KanbanColumn
                            key={col.id}
                            id={col.id}
                            title={col.title}
                            color={col.color}
                            leads={columnLeads}
                            onCardClick={onLeadClick}
                            accentColor={col.accentColor}
                        />
                    );
                })}
            </div>

            <DragOverlay>
                {activeId ? (
                    <KanbanCard lead={safeLeads.find(l => l.name === activeId)!} />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
