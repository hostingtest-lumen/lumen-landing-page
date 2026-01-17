"use client";

import React, { useState } from 'react';
import KanbanBoard from "@/components/team/KanbanBoard"; // Ajusta la ruta si es necesario

export default function LeadsPage() {
    // Definimos estados iniciales vacíos para que TypeScript no de error
    // Cuando el ERPNext esté listo, llenarás "leads" con los datos de la API
    const [leads, setLeads] = useState([]);

    // Funciones temporales (Placeholders)
    const handleLeadUpdate = async (leadId: string, newStatus: string) => {
        console.log("Actualización temporal:", leadId, newStatus);
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