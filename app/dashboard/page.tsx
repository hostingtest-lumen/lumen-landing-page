<<<<<<< HEAD
import DashboardView from "@/components/team/DashboardView";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Hola, Kevin 👋</h1>
                    <p className="text-gray-500">Aquí está el resumen de operaciones de hoy.</p>
                </div>
            </div>

            <DashboardView />
        </div>
    );
}
=======
"use client";

import React, { useState } from 'react';
import KanbanBoard from "@/components/crm/KanbanBoard"; // Ajusta la ruta si es necesario

export default function LeadsPage() {
    // Definimos estados iniciales vacíos para que TypeScript no de error
    // Cuando el ERPNext esté listo, llenarás "leads" con los datos de la API
    const [leads, setLeads] = useState([]);

    // Funciones temporales (Placeholders)
    const handleLeadUpdate = async (updatedLead: any) => {
        console.log("Actualización temporal:", updatedLead);
    };

    const handleLeadClick = (lead: any) => {
        console.log("Lead seleccionado:", lead);
    };

    return (
        <div className="flex flex-col h-full space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Leads</h1>
                <p className="text-gray-500">Panel Kanban conectado a ERPNext (Modo Migración)</p>
            </div>

            <div className="flex-1 overflow-hidden">
                {/* Aquí pasamos las props que TypeScript exigía */}
                <KanbanBoard
                    leads={leads}
                    onLeadUpdate={handleLeadUpdate}
                    onLeadClick={handleLeadClick}
                />
            </div>
        </div>
    );
}
>>>>>>> 7c3690804323f33b4dd3967a201b1c7055721df6
