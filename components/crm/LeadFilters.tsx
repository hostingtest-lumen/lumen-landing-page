"use client";

import { useState } from "react";
import { Search, Filter, X, Calendar, DollarSign, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEAD_SOURCES } from "@/types/pipelines";
import { motion, AnimatePresence } from "framer-motion";

export interface LeadFiltersState {
    search: string;
    source: string | null;
    assignedTo: string | null;
    dateRange: {
        from: string | null;
        to: string | null;
    };
    valueRange: {
        min: number | null;
        max: number | null;
    };
    tags: string[];
}

interface LeadFiltersProps {
    filters: LeadFiltersState;
    onChange: (filters: LeadFiltersState) => void;
    teamMembers?: { id: string; name: string }[];
    availableTags?: string[];
}

export const initialFilters: LeadFiltersState = {
    search: '',
    source: null,
    assignedTo: null,
    dateRange: { from: null, to: null },
    valueRange: { min: null, max: null },
    tags: []
};

export function LeadFilters({
    filters,
    onChange,
    teamMembers = [],
    availableTags = []
}: LeadFiltersProps) {
    const [showAdvanced, setShowAdvanced] = useState(false);

    const hasActiveFilters =
        filters.source ||
        filters.assignedTo ||
        filters.dateRange.from ||
        filters.dateRange.to ||
        filters.valueRange.min !== null ||
        filters.valueRange.max !== null ||
        filters.tags.length > 0;

    const activeFilterCount = [
        filters.source,
        filters.assignedTo,
        filters.dateRange.from || filters.dateRange.to,
        filters.valueRange.min !== null || filters.valueRange.max !== null,
        filters.tags.length > 0
    ].filter(Boolean).length;

    const handleClearFilters = () => {
        onChange(initialFilters);
    };

    const toggleTag = (tag: string) => {
        const newTags = filters.tags.includes(tag)
            ? filters.tags.filter(t => t !== tag)
            : [...filters.tags, tag];
        onChange({ ...filters, tags: newTags });
    };

    return (
        <div className="space-y-3">
            {/* Search Bar + Filter Toggle */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar leads por nombre, email, empresa..."
                        value={filters.search}
                        onChange={e => onChange({ ...filters, search: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lumen-priority/20 focus:border-lumen-priority"
                    />
                    {filters.search && (
                        <button
                            onClick={() => onChange({ ...filters, search: '' })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <Button
                    variant="outline"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className={`relative ${showAdvanced ? 'bg-lumen-priority/5 border-lumen-priority text-lumen-priority' : ''}`}
                >
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                    {activeFilterCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-lumen-priority text-white text-xs rounded-full flex items-center justify-center">
                            {activeFilterCount}
                        </span>
                    )}
                </Button>

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        Limpiar
                    </Button>
                )}
            </div>

            {/* Advanced Filters Panel */}
            <AnimatePresence>
                {showAdvanced && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Source Filter */}
                            <div>
                                <label className="flex items-center gap-1 text-xs font-medium text-gray-600 mb-1.5">
                                    <Tag className="w-3 h-3" />
                                    Fuente
                                </label>
                                <select
                                    value={filters.source || ''}
                                    onChange={e => onChange({ ...filters, source: e.target.value || null })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                                >
                                    <option value="">Todas las fuentes</option>
                                    {LEAD_SOURCES.map(source => (
                                        <option key={source.id} value={source.id}>{source.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Assigned To Filter */}
                            <div>
                                <label className="flex items-center gap-1 text-xs font-medium text-gray-600 mb-1.5">
                                    <User className="w-3 h-3" />
                                    Asignado a
                                </label>
                                <select
                                    value={filters.assignedTo || ''}
                                    onChange={e => onChange({ ...filters, assignedTo: e.target.value || null })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                                >
                                    <option value="">Todos</option>
                                    {teamMembers.length > 0 ? (
                                        teamMembers.map(member => (
                                            <option key={member.id} value={member.id}>{member.name}</option>
                                        ))
                                    ) : (
                                        <>
                                            <option value="kevin">Kevin</option>
                                            <option value="sara">Sara</option>
                                            <option value="team">Equipo</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            {/* Date Range */}
                            <div>
                                <label className="flex items-center gap-1 text-xs font-medium text-gray-600 mb-1.5">
                                    <Calendar className="w-3 h-3" />
                                    Fecha de creación
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        value={filters.dateRange.from || ''}
                                        onChange={e => onChange({
                                            ...filters,
                                            dateRange: { ...filters.dateRange, from: e.target.value || null }
                                        })}
                                        className="flex-1 px-2 py-2 border border-gray-200 rounded-lg text-sm"
                                    />
                                    <input
                                        type="date"
                                        value={filters.dateRange.to || ''}
                                        onChange={e => onChange({
                                            ...filters,
                                            dateRange: { ...filters.dateRange, to: e.target.value || null }
                                        })}
                                        className="flex-1 px-2 py-2 border border-gray-200 rounded-lg text-sm"
                                    />
                                </div>
                            </div>

                            {/* Value Range */}
                            <div>
                                <label className="flex items-center gap-1 text-xs font-medium text-gray-600 mb-1.5">
                                    <DollarSign className="w-3 h-3" />
                                    Valor estimado
                                </label>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={filters.valueRange.min ?? ''}
                                        onChange={e => onChange({
                                            ...filters,
                                            valueRange: { ...filters.valueRange, min: e.target.value ? Number(e.target.value) : null }
                                        })}
                                        className="flex-1 px-2 py-2 border border-gray-200 rounded-lg text-sm w-20"
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={filters.valueRange.max ?? ''}
                                        onChange={e => onChange({
                                            ...filters,
                                            valueRange: { ...filters.valueRange, max: e.target.value ? Number(e.target.value) : null }
                                        })}
                                        className="flex-1 px-2 py-2 border border-gray-200 rounded-lg text-sm w-20"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        {availableTags.length > 0 && (
                            <div className="mt-3 flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-gray-500">Tags:</span>
                                {availableTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`px-2 py-1 text-xs rounded-full transition-all ${filters.tags.includes(tag)
                                            ? 'bg-lumen-priority text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
