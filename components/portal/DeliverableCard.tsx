"use client";

import { Check, X, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface Deliverable {
    id: string;
    title: string;
    type: "image" | "video" | "document";
    url: string;
    status: "pending" | "approved" | "rejected";
    feedback?: string;
    date: string;
}

interface Props {
    item: Deliverable;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

export function DeliverableCard({ item, onApprove, onReject }: Props) {
    const statusColors = {
        pending: "bg-amber-100 text-amber-700 border-amber-200",
        approved: "bg-green-100 text-green-700 border-green-200",
        rejected: "bg-red-100 text-red-700 border-red-200"
    };

    const statusLabels = {
        pending: "Pendiente",
        approved: "Aprobado",
        rejected: "Con Cambios"
    };

    return (
        <motion.div
            layout
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group"
        >
            {/* Preview Area */}
            <div className="aspect-video bg-gray-100 relative overflow-hidden">
                {item.type === 'image' ? (
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                        <span className="text-xs font-mono">VIDEO PREVIEW</span>
                    </div>
                )}

                <div className="absolute top-3 right-3">
                    <Badge variant="outline" className={`${statusColors[item.status]} font-bold border`}>
                        {statusLabels[item.status]}
                    </Badge>
                </div>
            </div>

            {/* Info Area */}
            <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 leading-snug">{item.title}</h3>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400">
                        <Download className="w-4 h-4" />
                    </Button>
                </div>
                <p className="text-xs text-gray-500 mb-4">Entrega: {item.date}</p>

                {/* Actions */}
                {item.status === 'pending' ? (
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                        <Button
                            variant="outline"
                            className="bg-red-50 text-red-600 border-red-100 hover:bg-red-100 hover:text-red-700"
                            onClick={() => onReject(item.id)}
                        >
                            <X className="w-4 h-4 mr-2" /> Corregir
                        </Button>
                        <Button
                            className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20"
                            onClick={() => onApprove(item.id)}
                        >
                            <Check className="w-4 h-4 mr-2" /> Aprobar
                        </Button>
                    </div>
                ) : (
                    <div className="mt-auto pt-3 border-t border-gray-50 text-center">
                        <span className="text-xs font-medium text-gray-400">
                            {item.status === 'approved' ? '¡Listo para publicar!' : 'Esperando correcciones'}
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
