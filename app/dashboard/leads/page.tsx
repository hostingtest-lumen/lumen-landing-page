"use client";

import KanbanBoard from "@/components/crm/KanbanBoard";

export default function LeadsPage() {
    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pipeline de Ventas</h1>
                    <p className="text-gray-500 text-sm">Arrastra las tarjetas para actualizar el estado.</p>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <KanbanBoard />
            </div>
        </div>
    );
}
