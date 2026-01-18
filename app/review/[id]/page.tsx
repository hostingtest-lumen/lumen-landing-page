"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, X, MessageSquare, ChevronLeft, ChevronRight, Loader2, Send } from "lucide-react";
import { deliverableService } from "@/lib/deliverables";
import { Deliverable } from "@/types/deliverables";

export default function ReviewPage() {
    const params = useParams();
    const id = params?.id as string;

    const [item, setItem] = useState<Deliverable | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [interactionMode, setInteractionMode] = useState<'view' | 'rejecting'>('view');
    const [feedbackText, setFeedbackText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Carousel State
    const [currentSlide, setCurrentSlide] = useState(0);

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

    // Confetti effect state (simplified)
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (id) {
            const load = async () => {
                const data = await deliverableService.getById(id);
                setItem(data || null);
                setIsLoading(false);
            };
            load();
        }
    }, [id]);

    const handleApprove = async () => {
        if (!item) return;
        setIsSubmitting(true);

        await deliverableService.updateStatus(item.id, 'approved', {
            date: new Date().toISOString(),
            comment: 'Aprobado por cliente',
            author: 'client'
        });

        setItem({ ...item, status: 'approved' });
        setIsSubmitting(false);
        setShowConfetti(true);
    };

    const handleRequestChanges = async () => {
        if (!item || !feedbackText.trim()) return;

        setIsSubmitting(true);

        await deliverableService.updateStatus(item.id, 'changes_requested', {
            date: new Date().toISOString(),
            comment: feedbackText,
            author: 'client'
        });

        setItem({ ...item, status: 'changes_requested' });
        setIsSubmitting(false);
        setInteractionMode('view');
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-lumen-priority">Cargando diseño...</div>;

    if (!item) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
            <h1 className="text-xl font-bold text-gray-900 mb-2">Enlace Caducado o Inválido</h1>
            <p className="text-gray-500">No hemos encontrado este diseño. Contacta al equipo de Lumen.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 pb-32">
            {/* Header Mobile */}
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="w-8 h-8 bg-lumen-structure text-white rounded-lg flex items-center justify-center font-bold text-xs">LO</span>
                    <div>
                        <h2 className="text-sm font-bold text-gray-900 leading-tight">{item.title}</h2>
                        <p className="text-xs text-gray-500">{item.clientName}</p>
                    </div>
                </div>
                <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">v1.0</div>
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
                            /* Carousel Viewer */
                            <div className="w-full h-full relative bg-black flex items-center justify-center">
                                {/* Slides */}
                                <img
                                    src={[item.url, ...(item.carouselUrls || [])][currentSlide]}
                                    alt={`Slide ${currentSlide + 1}`}
                                    className="max-h-full max-w-full object-contain animate-in fade-in duration-300"
                                    key={currentSlide} // Force re-render for animation
                                />

                                {/* Controls */}
                                <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="rounded-full bg-white/80 hover:bg-white shadow-lg"
                                        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                        disabled={[item.url, ...(item.carouselUrls || [])].length <= 1}
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="rounded-full bg-white/80 hover:bg-white shadow-lg"
                                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                        disabled={[item.url, ...(item.carouselUrls || [])].length <= 1}
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

                        {/* Status Overlay if already processed */}
                        {item.status === 'approved' && (
                            <div className="absolute inset-0 bg-green-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
                                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-500/50">
                                    <Check className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold">¡Aprobado!</h2>
                                <p className="text-green-200 mt-2">Gracias por tu confirmación.</p>
                            </div>
                        )}

                        {item.status === 'changes_requested' && (
                            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
                                    <MessageSquare className="w-8 h-8" />
                                </div>
                                <h2 className="text-xl font-bold">Cambios Solicitados</h2>
                                <p className="text-gray-300 mt-2 max-w-sm text-center px-4">
                                    "El equipo ha sido notificado y trabajará en tus comentarios."
                                </p>
                            </div>
                        )}
                    </div>

                    {item.description && (
                        <div className="p-6 border-t border-gray-100">
                            <h3 className="font-semibold text-gray-900 text-sm mb-2">Nota del Equipo:</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Bar (Only if pending) */}
            {item.status === 'pending' && (
                <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
                    <div className="max-w-3xl mx-auto">
                        {interactionMode === 'view' ? (
                            <div className="grid grid-cols-2 gap-4">
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
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-200">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-semibold text-gray-900">¿Qué debemos ajustar?</h3>
                                    <Button variant="ghost" size="sm" onClick={() => setInteractionMode('view')}>Cancelar</Button>
                                </div>
                                <textarea
                                    className="w-full border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:ring-lumen-priority h-32 p-3 text-base"
                                    placeholder="Sé específico para que podamos corregirlo rápido..."
                                    value={feedbackText}
                                    onChange={(e) => setFeedbackText(e.target.value)}
                                    autoFocus
                                ></textarea>
                                <Button
                                    onClick={handleRequestChanges}
                                    disabled={!feedbackText.trim() || isSubmitting}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white h-12"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                                    Enviar Comentarios
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
