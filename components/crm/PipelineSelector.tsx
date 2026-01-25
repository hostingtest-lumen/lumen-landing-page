"use client";

import { useState } from "react";
import { Pipeline, PIPELINE_COLORS } from "@/types/pipelines";
import { ChevronDown, Plus, Settings, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface PipelineSelectorProps {
    pipelines: Pipeline[];
    activePipelineId: string;
    onSelect: (pipelineId: string) => void;
    onCreateNew: () => void;
    onManage: () => void;
}

export function PipelineSelector({
    pipelines,
    activePipelineId,
    onSelect,
    onCreateNew,
    onManage
}: PipelineSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    const activePipeline = pipelines.find(p => p.id === activePipelineId);
    const activeColor = PIPELINE_COLORS.find(c => c.id === activePipeline?.color);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all shadow-sm"
            >
                <div className={`w-3 h-3 rounded-full ${activeColor?.class || 'bg-gray-400'}`} />
                <span className="font-medium text-gray-900">
                    {activePipeline?.name || 'Seleccionar Pipeline'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden"
                        >
                            {/* Pipeline List */}
                            <div className="p-2 max-h-64 overflow-y-auto">
                                {pipelines.map((pipeline) => {
                                    const color = PIPELINE_COLORS.find(c => c.id === pipeline.color);
                                    const isActive = pipeline.id === activePipelineId;

                                    return (
                                        <button
                                            key={pipeline.id}
                                            onClick={() => {
                                                onSelect(pipeline.id);
                                                setIsOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive
                                                ? 'bg-lumen-priority/10 text-lumen-priority'
                                                : 'hover:bg-gray-50 text-gray-700'
                                                }`}
                                        >
                                            <div className={`w-3 h-3 rounded-full ${color?.class || 'bg-gray-400'}`} />
                                            <div className="flex-1 text-left">
                                                <div className="font-medium text-sm">{pipeline.name}</div>
                                                {pipeline.description && (
                                                    <div className="text-xs text-gray-500 truncate">
                                                        {pipeline.description}
                                                    </div>
                                                )}
                                            </div>
                                            {isActive && <Check className="w-4 h-4" />}
                                            {pipeline.isDefault && (
                                                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                                                    Default
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Actions */}
                            <div className="border-t border-gray-100 p-2 bg-gray-50/50">
                                <button
                                    onClick={() => {
                                        onCreateNew();
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-white rounded-lg transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                    Crear nuevo pipeline
                                </button>
                                <button
                                    onClick={() => {
                                        onManage();
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-white rounded-lg transition-all"
                                >
                                    <Settings className="w-4 h-4" />
                                    Administrar pipelines
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
