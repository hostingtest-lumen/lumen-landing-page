"use client";

import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent, DragOverEvent, DragEndEvent } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { Loader2 } from "lucide-react";
import { Lead, LEAD_STATUSES } from "@/types/crm";
import { useState } from "react";

interface KanbanBoardProps {
    leads: Lead[];
    onLeadUpdate: (updatedLead: Lead) => void;
    onLeadClick: (id: string) => void;
    isLoading?: boolean;
}

export default function KanbanBoard({ leads, onLeadUpdate, onLeadClick, isLoading = false }: KanbanBoardProps) {
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const findContainer = (id: string) => {
        if (leads.find(l => l.name === id)) {
            return leads.find(l => l.name === id)?.status;
        }
        return LEAD_STATUSES.find(c => c.id === id)?.id;
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        // Optional
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;
        const activeLead = leads.find(l => l.name === activeId);

        // Determine new status
        let newStatus = overId;
        const overLead = leads.find(l => l.name === overId);
        if (overLead) {
            newStatus = overLead.status;
        }

        // Validate status
        if (!LEAD_STATUSES.find(c => c.id === newStatus)) {
            if (!LEAD_STATUSES.find(c => c.id === overId)) return;
            newStatus = overId;
        }

        // Update if changed
        if (activeLead && activeLead.status !== newStatus) {
            const updatedLead = { ...activeLead, status: newStatus };
            onLeadUpdate(updatedLead);

            try {
                await fetch("/api/leads", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: activeId, status: newStatus }),
                });
            } catch (error) {
                console.error("Failed to update status", error);
            }
        }
    };

    if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-lumen-structure" /></div>;

    // Safety check defined in component scope
    const safeLeads = leads || [];

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
        >
            <div className="flex gap-6 overflow-x-auto pb-4 h-full items-start">
                {LEAD_STATUSES.map((col) => (
                    <KanbanColumn
                        key={col.id}
                        id={col.id}
                        title={col.title}
                        color={col.color}
                        leads={safeLeads.filter(l => l.status === col.id)}
                        onCardClick={onLeadClick}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeId ? (
                    <KanbanCard lead={safeLeads.find(l => l.name === activeId)!} />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
