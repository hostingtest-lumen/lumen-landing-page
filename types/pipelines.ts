// Pipeline Types for Multi-Pipeline CRM System

export interface PipelineColumn {
    id: string;
    name: string;
    color: string;          // Tailwind color class (e.g., 'blue', 'green')
    order: number;
}

export interface Pipeline {
    id: string;
    name: string;           // "Prospectos", "Clientes Activos", "Recuperación"
    description?: string;
    columns: PipelineColumn[];
    color: string;          // Primary color identifier
    createdAt: string;
    isDefault?: boolean;
}

// Default Pipelines
export const DEFAULT_PIPELINES: Pipeline[] = [
    {
        id: 'prospectos',
        name: 'Prospectos',
        description: 'Pipeline principal para nuevos leads',
        color: 'blue',
        isDefault: true,
        createdAt: new Date().toISOString(),
        columns: [
            { id: 'nuevo', name: 'Nuevo', color: 'gray', order: 0 },
            { id: 'contactado', name: 'Contactado', color: 'blue', order: 1 },
            { id: 'propuesta', name: 'Propuesta Enviada', color: 'purple', order: 2 },
            { id: 'negociacion', name: 'En Negociación', color: 'yellow', order: 3 },
            { id: 'ganado', name: 'Cerrado Ganado', color: 'green', order: 4 },
            { id: 'perdido', name: 'Cerrado Perdido', color: 'red', order: 5 },
        ]
    },
    {
        id: 'clientes-activos',
        name: 'Clientes Activos',
        description: 'Gestión de clientes con proyectos activos',
        color: 'green',
        isDefault: false,
        createdAt: new Date().toISOString(),
        columns: [
            { id: 'onboarding', name: 'Onboarding', color: 'blue', order: 0 },
            { id: 'en-proyecto', name: 'En Proyecto', color: 'purple', order: 1 },
            { id: 'entrega', name: 'En Entrega', color: 'yellow', order: 2 },
            { id: 'satisfecho', name: 'Satisfecho', color: 'green', order: 3 },
        ]
    },
    {
        id: 'en-pausa',
        name: 'En Pausa',
        description: 'Leads o clientes pausados temporalmente',
        color: 'orange',
        isDefault: false,
        createdAt: new Date().toISOString(),
        columns: [
            { id: 'pausa-temporal', name: 'Pausa Temporal', color: 'yellow', order: 0 },
            { id: 'sin-presupuesto', name: 'Sin Presupuesto', color: 'orange', order: 1 },
            { id: 'reactivar', name: 'Para Reactivar', color: 'blue', order: 2 },
            { id: 'descartado', name: 'Descartado', color: 'gray', order: 3 },
        ]
    }
];

// Color palette for pipelines and columns
export const PIPELINE_COLORS = [
    { id: 'blue', name: 'Azul', class: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-700' },
    { id: 'green', name: 'Verde', class: 'bg-green-500', light: 'bg-green-50', text: 'text-green-700' },
    { id: 'purple', name: 'Morado', class: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-700' },
    { id: 'orange', name: 'Naranja', class: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-700' },
    { id: 'red', name: 'Rojo', class: 'bg-red-500', light: 'bg-red-50', text: 'text-red-700' },
    { id: 'yellow', name: 'Amarillo', class: 'bg-yellow-500', light: 'bg-yellow-50', text: 'text-yellow-700' },
    { id: 'pink', name: 'Rosa', class: 'bg-pink-500', light: 'bg-pink-50', text: 'text-pink-700' },
    { id: 'indigo', name: 'Índigo', class: 'bg-indigo-500', light: 'bg-indigo-50', text: 'text-indigo-700' },
    { id: 'gray', name: 'Gris', class: 'bg-gray-500', light: 'bg-gray-50', text: 'text-gray-700' },
];

// Lead sources for filtering
export const LEAD_SOURCES = [
    { id: 'website', name: 'Sitio Web' },
    { id: 'referral', name: 'Referido' },
    { id: 'social', name: 'Redes Sociales' },
    { id: 'ads', name: 'Publicidad' },
    { id: 'cold-call', name: 'Llamada en Frío' },
    { id: 'event', name: 'Evento' },
    { id: 'other', name: 'Otro' },
];
