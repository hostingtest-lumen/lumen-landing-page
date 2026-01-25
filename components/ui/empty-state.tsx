"use client";

import { LucideIcon, Inbox, Search, FileX, Users, FolderOpen } from "lucide-react";
import { Button } from "./button";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    variant?: 'default' | 'search' | 'error' | 'minimal';
}

const VARIANT_ICONS = {
    default: Inbox,
    search: Search,
    error: FileX,
    minimal: FolderOpen,
};

export function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    onAction,
    variant = 'default'
}: EmptyStateProps) {
    const Icon = icon || VARIANT_ICONS[variant];

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
            {description && (
                <p className="text-sm text-gray-500 max-w-sm mb-4">{description}</p>
            )}
            {actionLabel && onAction && (
                <Button onClick={onAction} className="bg-lumen-priority hover:bg-lumen-priority/90">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}

// Specialized empty states
export function EmptyLeads({ onAction }: { onAction?: () => void }) {
    return (
        <EmptyState
            icon={Users}
            title="No hay leads aún"
            description="Comienza agregando tu primer prospecto al pipeline"
            actionLabel="Agregar Lead"
            onAction={onAction}
        />
    );
}

export function EmptySearchResults() {
    return (
        <EmptyState
            variant="search"
            title="Sin resultados"
            description="No encontramos leads que coincidan con tu búsqueda. Intenta con otros filtros."
        />
    );
}

export function EmptyPipeline({ onAction }: { onAction?: () => void }) {
    return (
        <EmptyState
            icon={FolderOpen}
            title="Pipeline vacío"
            description="Este pipeline no tiene leads. Mueve leads aquí o crea uno nuevo."
            actionLabel="Crear Lead"
            onAction={onAction}
        />
    );
}
