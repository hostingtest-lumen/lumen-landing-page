"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, X, MessageSquare, ChevronLeft, ChevronRight, Loader2, Send, Clock, History, Sparkles } from "lucide-react";
import { deliverableService } from "@/lib/deliverables";
import { Deliverable } from "@/types/deliverables";
import { motion, AnimatePresence } from "framer-motion";

export default function ReviewPage() {
    const params = useParams();
    const id = params?.id as string;

    const [item, setItem] = useState<Deliverable | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [interactionMode, setInteractionMode] = useState<'view' | 'rejecting' | 'history'>('view');
    const [feedbackText, setFeedbackText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Carousel State
    const [currentSlide, setCurrentSlide] = useState(0);

    // Confetti effect
    const [showConfetti, setShowConfetti] = useState(false);

    const nextSlide = () => {
        if (!item) return;
        const slides = [item.url, ...(item.carouselUrls || [])];
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        if (!item) return;
        const slides = [item.url, ...(item.carouselUrls || [])];
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    useEffect(() => {
        if (id) {
            const load = async () => {
                const data = await deliverableService.getById(id);
                setItem(data ? { ...data, currentVersion: data.currentVersion || 1 } : null);
                setIsLoading(false);
            };
            load();
        }
    }, [id]);

    const handleApprove = async () => {
        if (!item) return;
        setIsSubmitting(true);

        await deliverableService.updateStatus(item.id, 'approved', {
            id: `feedback-${Date.now()}`,
            date: new Date().toISOString(),
            comment: 'Aprobado por cliente',
            author: 'client',
            version: item.currentVersion
        });

        setItem({
            ...item,
            status: 'approved',
            approvedAt: new Date().toISOString(),
            approvedVersion: item.currentVersion
        });
        setIsSubmitting(false);
        setShowConfetti(true);
    };

    const handleRequestChanges = async () => {
        if (!item || !feedbackText.trim()) return;

        setIsSubmitting(true);

        await deliverableService.updateStatus(item.id, 'changes_requested', {
            id: `feedback-${Date.now()}`,
            date: new Date().toISOString(),
            comment: feedbackText,
            author: 'client',
            version: item.currentVersion
        });

        const newFeedback = {
            id: `feedback-${Date.now()}`,
            date: new Date().toISOString(),
            comment: feedbackText,
            author: 'client' as const,
            version: item.currentVersion
        };

        setItem({
            ...item,
            status: 'changes_requested',
            feedback: [...(item.feedback || []), newFeedback]
        });
        setIsSubmitting(false);
        setInteractionMode('view');
        setFeedbackText("");
    };

    // Helper to get deadline status
    const getDeadlineStatus = () => {
        if (!item?.deadline) return null;
        const now = new Date();
        const deadline = new Date(item.deadline);
        const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { text: 'Vencido', color: 'text-red-500 bg-red-100' };
        if (diffDays === 0) return { text: 'Vence hoy', color: 'text-red-500 bg-red-100' };
        if (diffDays === 1) return { text: 'Vence mañana', color: 'text-orange-500 bg-orange-100' };
        if (diffDays <= 3) return { text: `${diffDays} días`, color: 'text-yellow-600 bg-yellow-100' };
        return null;
    };

    const deadlineStatus = getDeadlineStatus();

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-lumen-priority mb-4" />
                <p className="text-gray-500">Cargando diseño...</p>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <X className="w-8 h-8 text-gray-400" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">Enlace Caducado o Inválido</h1>
                <p className="text-gray-500">No hemos encontrado este diseño. Contacta al equipo de Lumen.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 pb-32">
            {/* Confetti Animation */}
            <AnimatePresence>
                {showConfetti && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 10 }}
                            className="text-8xl"
                        >
                            🎉
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Mobile */}
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <span className="w-10 h-10 bg-gradient-to-br from-lumen-priority to-lumen-structure text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-lg">
                        L
                    </span>
                    <div>
                        <h2 className="text-sm font-bold text-gray-900 leading-tight">{item.title}</h2>
                        <p className="text-xs text-gray-500">{item.clientName}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {deadlineStatus && (
                        <span className={`text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1 ${deadlineStatus.color}`}>
                            <Clock className="w-3 h-3" />
                            {deadlineStatus.text}
                        </span>
                    )}
                    <div className="text-xs font-mono bg-blue-50 text-blue-600 px-2 py-1 rounded-lg border border-blue-100">
                        v{item.currentVersion}
                    </div>
                </div>
            </div>

            {/* Content Viewer */}
            <div className="p-4 max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
                    <div className="aspect-video bg-gray-900 flex items-center justify-center relative group">
                        {item.type === 'image' ? (
                            <img src={item.url} alt={item.title} className="w-full h-full object-contain" />
                        ) : item.type === 'video' ? (
                            <video src={item.url} controls className="w-full h-full" />
                        ) : item.type === 'carousel' ? (
                            <div className="w-full h-full relative bg-black flex items-center justify-center">
                                <motion.img
                                    key={currentSlide}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                    src={[item.url, ...(item.carouselUrls || [])][currentSlide]}
                                    alt={`Slide ${currentSlide + 1}`}
                                    className="max-h-full max-w-full object-contain"
                                />

                                {/* Controls */}
                                <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="rounded-full bg-white/90 hover:bg-white shadow-lg"
                                        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="rounded-full bg-white/90 hover:bg-white shadow-lg"
                                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </div>

                                {/* Indicators */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    {[item.url, ...(item.carouselUrls || [])].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentSlide(i)}
                                            className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'}`}
                                        />
                                    ))}
                                </div>
                                <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur">
                                    {currentSlide + 1} / {[item.url, ...(item.carouselUrls || [])].length}
                                </div>
                            </div>
                        ) : (
                            <div className="text-white text-center p-8">
                                <p className="mb-4">Link Externo</p>
                                <a href={item.url} target="_blank" className="text-lumen-priority underline border px-4 py-2 rounded-lg border-lumen-priority hover:bg-lumen-priority hover:text-white transition-colors">Abrir Recurso</a>
                            </div>
                        )}

                        {/* Approved Overlay */}
                        {item.status === 'approved' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-green-900/85 backdrop-blur-sm flex flex-col items-center justify-center text-white"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', delay: 0.1 }}
                                    className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-2xl"
                                >
                                    <Check className="w-10 h-10" />
                                </motion.div>
                                <h2 className="text-2xl font-bold">¡Aprobado!</h2>
                                <p className="text-green-200 mt-2 flex items-center gap-1">
                                    <Sparkles className="w-4 h-4" />
                                    Gracias por tu confirmación
                                </p>
                                {item.approvedVersion && (
                                    <p className="text-green-300/70 text-sm mt-2">Versión {item.approvedVersion} aprobada</p>
                                )}
                            </motion.div>
                        )}

                        {/* Changes Requested Overlay */}
                        {item.status === 'changes_requested' && (
                            <div className="absolute inset-0 bg-gray-900/85 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
                                    <MessageSquare className="w-8 h-8" />
                                </div>
                                <h2 className="text-xl font-bold">Cambios Solicitados</h2>
                                <p className="text-gray-300 mt-2 max-w-sm text-center px-4">
                                    El equipo ha sido notificado y trabajará en tus comentarios.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {item.description && (
                        <div className="p-6 border-t border-gray-100">
                            <h3 className="font-semibold text-gray-900 text-sm mb-2">Nota del Equipo:</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                        </div>
                    )}

                    {/* Version Info */}
                    {(item.versions && item.versions.length > 1) && (
                        <div className="px-6 py-3 bg-blue-50 border-t border-blue-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-blue-700">
                                <History className="w-4 h-4" />
                                <span>Versión {item.currentVersion} de {item.versions.length}</span>
                            </div>
                            <button
                                onClick={() => setInteractionMode('history')}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Ver historial
                            </button>
                        </div>
                    )}

                    {/* Previous Feedback */}
                    {item.feedback && item.feedback.length > 0 && item.status !== 'approved' && (
                        <div className="p-4 border-t border-gray-100 bg-gray-50">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Historial de Feedback</h4>
                            <div className="space-y-2">
                                {item.feedback.slice(-3).map((fb, i) => (
                                    <div key={i} className={`text-sm p-3 rounded-lg ${fb.author === 'client'
                                            ? 'bg-yellow-50 border border-yellow-100'
                                            : 'bg-green-50 border border-green-100'
                                        }`}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-xs">
                                                {fb.author === 'client' ? '💬 Tu comentario' : '✅ Respuesta del equipo'}
                                            </span>
                                            <span className="text-[10px] text-gray-400">
                                                {new Date(fb.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-700">{fb.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Bar (Only if pending) */}
            {item.status === 'pending' && (
                <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-20">
                    <div className="max-w-3xl mx-auto">
                        <AnimatePresence mode="wait">
                            {interactionMode === 'view' ? (
                                <motion.div
                                    key="view"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="grid grid-cols-2 gap-4"
                                >
                                    <Button
                                        onClick={() => setInteractionMode('rejecting')}
                                        className="bg-white border-2 border-red-100 hover:bg-red-50 text-red-600 h-14 text-base font-semibold shadow-none"
                                    >
                                        <X className="w-5 h-5 mr-2" />
                                        Pedir Cambios
                                    </Button>
                                    <Button
                                        onClick={handleApprove}
                                        disabled={isSubmitting}
                                        className="bg-lumen-priority hover:bg-lumen-priority/90 text-white h-14 text-base font-bold shadow-lg shadow-lumen-priority/20"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : <Check className="w-5 h-5 mr-2" />}
                                        Aprobar Diseño
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="rejecting"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-semibold text-gray-900">¿Qué debemos ajustar?</h3>
                                        <Button variant="ghost" size="sm" onClick={() => setInteractionMode('view')}>Cancelar</Button>
                                    </div>
                                    <textarea
                                        className="w-full border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-lumen-priority/20 h-32 p-3 text-base resize-none"
                                        placeholder="Sé específico para que podamos corregirlo rápido..."
                                        value={feedbackText}
                                        onChange={(e) => setFeedbackText(e.target.value)}
                                        autoFocus
                                    />
                                    <Button
                                        onClick={handleRequestChanges}
                                        disabled={!feedbackText.trim() || isSubmitting}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white h-12"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                                        Enviar Comentarios
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
}
