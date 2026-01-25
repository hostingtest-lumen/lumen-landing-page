"use client";

import { useState } from "react";
import { Pipeline, PipelineColumn, PIPELINE_COLORS } from "@/types/pipelines";
import { X, Plus, Trash2, GripVertical, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface PipelineManagerProps {
    isOpen: boolean;
    onClose: () => void;
    pipelines: Pipeline[];
    onSave: (pipelines: Pipeline[]) => void;
    editingPipelineId?: string | null;
}

export function PipelineManager({
    isOpen,
    onClose,
    pipelines,
    onSave,
    editingPipelineId
}: PipelineManagerProps) {
    const [localPipelines, setLocalPipelines] = useState<Pipeline[]>(pipelines);
    const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>(
        editingPipelineId || pipelines[0]?.id || null
    );
    const [isCreating, setIsCreating] = useState(false);
    const [newPipelineName, setNewPipelineName] = useState("");
    const [newPipelineColor, setNewPipelineColor] = useState("blue");

    const selectedPipeline = localPipelines.find(p => p.id === selectedPipelineId);

    const handleCreatePipeline = () => {
        if (!newPipelineName.trim()) return;

        const newPipeline: Pipeline = {
            id: `pipeline-${Date.now()}`,
            name: newPipelineName,
            color: newPipelineColor,
            createdAt: new Date().toISOString(),
            columns: [
                { id: `col-${Date.now()}-1`, name: 'Nuevo', color: 'gray', order: 0 },
                { id: `col-${Date.now()}-2`, name: 'En Proceso', color: 'blue', order: 1 },
                { id: `col-${Date.now()}-3`, name: 'Completado', color: 'green', order: 2 },
            ]
        };

        setLocalPipelines([...localPipelines, newPipeline]);
        setSelectedPipelineId(newPipeline.id);
        setIsCreating(false);
        setNewPipelineName("");
    };

    const handleDeletePipeline = (id: string) => {
        if (localPipelines.length <= 1) return;
        const updated = localPipelines.filter(p => p.id !== id);
        setLocalPipelines(updated);
        if (selectedPipelineId === id) {
            setSelectedPipelineId(updated[0]?.id || null);
        }
    };

    const handleUpdatePipeline = (id: string, updates: Partial<Pipeline>) => {
        setLocalPipelines(localPipelines.map(p =>
            p.id === id ? { ...p, ...updates } : p
        ));
    };

    const handleAddColumn = () => {
        if (!selectedPipeline) return;
        const newColumn: PipelineColumn = {
            id: `col-${Date.now()}`,
            name: 'Nueva Columna',
            color: 'gray',
            order: selectedPipeline.columns.length
        };
        handleUpdatePipeline(selectedPipeline.id, {
            columns: [...selectedPipeline.columns, newColumn]
        });
    };

    const handleUpdateColumn = (columnId: string, updates: Partial<PipelineColumn>) => {
        if (!selectedPipeline) return;
        handleUpdatePipeline(selectedPipeline.id, {
            columns: selectedPipeline.columns.map(c =>
                c.id === columnId ? { ...c, ...updates } : c
            )
        });
    };

    const handleDeleteColumn = (columnId: string) => {
        if (!selectedPipeline || selectedPipeline.columns.length <= 1) return;
        handleUpdatePipeline(selectedPipeline.id, {
            columns: selectedPipeline.columns.filter(c => c.id !== columnId)
        });
    };

    const handleSave = () => {
        onSave(localPipelines);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Left Sidebar - Pipeline List */}
                    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-900">Pipelines</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2">
                            {localPipelines.map((pipeline) => {
                                const color = PIPELINE_COLORS.find(c => c.id === pipeline.color);
                                const isSelected = pipeline.id === selectedPipelineId;

                                return (
                                    <button
                                        key={pipeline.id}
                                        onClick={() => setSelectedPipelineId(pipeline.id)}
                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg mb-1 transition-all ${isSelected
                                            ? 'bg-white shadow-sm border border-gray-200'
                                            : 'hover:bg-white/50'
                                            }`}
                                    >
                                        <div className={`w-3 h-3 rounded-full ${color?.class}`} />
                                        <span className="text-sm font-medium text-gray-700 flex-1 text-left truncate">
                                            {pipeline.name}
                                        </span>
                                        {pipeline.isDefault && (
                                            <span className="text-[9px] uppercase font-bold px-1 py-0.5 rounded bg-lumen-priority/10 text-lumen-priority">
                                                Default
                                            </span>
                                        )}
                                    </button>
                                );
                            })}

                            {/* Create New */}
                            {isCreating ? (
                                <div className="p-2 bg-white rounded-lg border border-gray-200 mt-2">
                                    <input
                                        type="text"
                                        value={newPipelineName}
                                        onChange={e => setNewPipelineName(e.target.value)}
                                        placeholder="Nombre del pipeline"
                                        className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg mb-2"
                                        autoFocus
                                    />
                                    <div className="flex gap-1 mb-2 flex-wrap">
                                        {PIPELINE_COLORS.slice(0, 6).map(color => (
                                            <button
                                                key={color.id}
                                                onClick={() => setNewPipelineColor(color.id)}
                                                className={`w-6 h-6 rounded-full ${color.class} ${newPipelineColor === color.id ? 'ring-2 ring-offset-1 ring-gray-400' : ''
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex gap-1">
                                        <Button size="sm" onClick={handleCreatePipeline} className="flex-1 bg-lumen-priority">
                                            Crear
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={() => setIsCreating(false)}>
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsCreating(true)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-lg mt-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Nuevo pipeline
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right Content - Pipeline Editor */}
                    <div className="flex-1 flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                {selectedPipeline && (
                                    <>
                                        <select
                                            value={selectedPipeline.color}
                                            onChange={e => handleUpdatePipeline(selectedPipeline.id, { color: e.target.value })}
                                            className="w-8 h-8 rounded-full appearance-none cursor-pointer"
                                            style={{
                                                backgroundColor: PIPELINE_COLORS.find(c => c.id === selectedPipeline.color)?.class.replace('bg-', '') || '#6b7280'
                                            }}
                                        >
                                            {PIPELINE_COLORS.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            value={selectedPipeline.name}
                                            onChange={e => handleUpdatePipeline(selectedPipeline.id, { name: e.target.value })}
                                            className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-lumen-priority/20 rounded px-1"
                                        />
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {selectedPipeline && !selectedPipeline.isDefault && localPipelines.length > 1 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeletePipeline(selectedPipeline.id)}
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Eliminar
                                    </Button>
                                )}
                                <Button variant="ghost" size="icon" onClick={onClose}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Column Editor */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {selectedPipeline && (
                                <>
                                    <div className="mb-4">
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                                            Descripción (opcional)
                                        </label>
                                        <input
                                            type="text"
                                            value={selectedPipeline.description || ''}
                                            onChange={e => handleUpdatePipeline(selectedPipeline.id, { description: e.target.value })}
                                            placeholder="Describe el propósito de este pipeline..."
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                        />
                                    </div>

                                    <div className="mb-3 flex items-center justify-between">
                                        <label className="text-sm font-medium text-gray-700">
                                            Columnas ({selectedPipeline.columns.length})
                                        </label>
                                        <Button size="sm" variant="ghost" onClick={handleAddColumn}>
                                            <Plus className="w-4 h-4 mr-1" />
                                            Agregar columna
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        {selectedPipeline.columns
                                            .sort((a, b) => a.order - b.order)
                                            .map((column, index) => {
                                                const colColor = PIPELINE_COLORS.find(c => c.id === column.color);
                                                return (
                                                    <div
                                                        key={column.id}
                                                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group"
                                                    >
                                                        <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
                                                        <div className="flex gap-1">
                                                            {PIPELINE_COLORS.map(c => (
                                                                <button
                                                                    key={c.id}
                                                                    onClick={() => handleUpdateColumn(column.id, { color: c.id })}
                                                                    className={`w-5 h-5 rounded-full ${c.class} transition-transform ${column.color === c.id ? 'ring-2 ring-offset-1 ring-gray-400 scale-110' : 'hover:scale-110'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={column.name}
                                                            onChange={e => handleUpdateColumn(column.id, { name: e.target.value })}
                                                            className="flex-1 px-2 py-1 bg-white border border-gray-200 rounded text-sm"
                                                        />
                                                        {selectedPipeline.columns.length > 1 && (
                                                            <button
                                                                onClick={() => handleDeleteColumn(column.id)}
                                                                className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end gap-2">
                            <Button variant="ghost" onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button onClick={handleSave} className="bg-lumen-priority hover:bg-lumen-priority/90">
                                <Check className="w-4 h-4 mr-1" />
                                Guardar Cambios
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
