"use client";

import { useState } from "react";
import { X, Check, ChevronLeft, ChevronRight, Send, Loader2, ZoomIn, ZoomOut, Download, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Deliverable {
    id: string;
    title: string;
    type: "image" | "video" | "carousel" | "document";
    url: string;
    carouselUrls?: string[];
    status: "pending" | "approved" | "rejected" | "changes_requested";
    date: string;
    description?: string;
    clientName?: string;
}

interface Props {
    item: Deliverable | null;
    isOpen: boolean;
    onClose: () => void;
    onApprove: (id: string) => void;
    onReject: (id: string, feedback: string) => void;
}

export function DeliverableModal({ item, isOpen, onClose, onApprove, onReject }: Props) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackText, setFeedbackText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !item) return null;

    const slides = item.type === "carousel" && item.carouselUrls
        ? [item.url, ...item.carouselUrls]
        : [item.url];

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    const handleApprove = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 800));
        onApprove(item.id);
        setIsSubmitting(false);
        onClose();
    };

    const handleSubmitFeedback = async () => {
        if (!feedbackText.trim()) return;
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 800));
        onReject(item.id, feedbackText);
        setIsSubmitting(false);
        setShowFeedback(false);
        setFeedbackText("");
        onClose();
    };

    const zoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
    const zoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
    const resetZoom = () => setZoom(1);

    const statusIsPending = item.status === "pending";

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/90 flex flex-col"
                    onClick={onClose}
                >
                    {/* Header */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div>
                            <h2 className="text-white font-bold text-lg">{item.title}</h2>
                            <p className="text-gray-400 text-sm">{item.clientName} • {item.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={zoomOut} className="text-white hover:bg-white/10">
                                <ZoomOut className="w-5 h-5" />
                            </Button>
                            <span className="text-white text-sm font-mono min-w-[50px] text-center">{Math.round(zoom * 100)}%</span>
                            <Button variant="ghost" size="icon" onClick={zoomIn} className="text-white hover:bg-white/10">
                                <ZoomIn className="w-5 h-5" />
                            </Button>
                            <div className="w-px h-6 bg-white/20 mx-2" />
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                                <Download className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
                                <X className="w-6 h-6" />
                            </Button>
                        </div>
                    </motion.div>

                    {/* Content Area */}
                    <div
                        className="flex-1 flex items-center justify-center relative overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Carousel Navigation */}
                        {slides.length > 1 && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={prevSlide}
                                    className="absolute left-4 z-10 text-white bg-black/30 hover:bg-black/50 w-12 h-12 rounded-full"
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={nextSlide}
                                    className="absolute right-4 z-10 text-white bg-black/30 hover:bg-black/50 w-12 h-12 rounded-full"
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </Button>
                            </>
                        )}

                        {/* Image/Video Display */}
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className="max-w-[90vw] max-h-[70vh] relative"
                            style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s ease' }}
                            onDoubleClick={zoom === 1 ? zoomIn : resetZoom}
                        >
                            {item.type === "video" ? (
                                <video
                                    src={slides[currentSlide]}
                                    controls
                                    className="max-h-[70vh] max-w-full rounded-lg shadow-2xl"
                                />
                            ) : (
                                <img
                                    src={slides[currentSlide]}
                                    alt={item.title}
                                    className="max-h-[70vh] max-w-full rounded-lg shadow-2xl object-contain"
                                    draggable={false}
                                />
                            )}
                        </motion.div>

                        {/* Slide Indicators */}
                        {slides.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {slides.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentSlide(i)}
                                        className={`w-2 h-2 rounded-full transition-all ${i === currentSlide
                                                ? 'bg-white w-6'
                                                : 'bg-white/40 hover:bg-white/70'
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {item.description && (
                        <div className="px-6 py-3 bg-black/50 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
                            <p className="text-gray-300 text-sm max-w-2xl mx-auto text-center">{item.description}</p>
                        </div>
                    )}

                    {/* Action Bar */}
                    {statusIsPending && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="p-4 bg-white border-t border-gray-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {!showFeedback ? (
                                <div className="max-w-2xl mx-auto grid grid-cols-2 gap-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowFeedback(true)}
                                        className="h-14 bg-red-50 text-red-600 border-red-200 hover:bg-red-100 text-base font-semibold"
                                    >
                                        <MessageSquare className="w-5 h-5 mr-2" />
                                        Solicitar Cambios
                                    </Button>
                                    <Button
                                        onClick={handleApprove}
                                        disabled={isSubmitting}
                                        className="h-14 bg-green-600 hover:bg-green-700 text-white text-base font-bold shadow-lg shadow-green-500/20"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <Check className="w-5 h-5 mr-2" />
                                                Aprobar Diseño
                                            </>
                                        )}
                                    </Button>
                                </div>
                            ) : (
                                <div className="max-w-2xl mx-auto space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-gray-900">¿Qué debemos ajustar?</h3>
                                        <Button variant="ghost" size="sm" onClick={() => setShowFeedback(false)}>
                                            Cancelar
                                        </Button>
                                    </div>
                                    <textarea
                                        className="w-full h-28 p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-lumen-priority/20 focus:border-lumen-priority text-base resize-none"
                                        placeholder="Describe los cambios que necesitas de forma clara..."
                                        value={feedbackText}
                                        onChange={(e) => setFeedbackText(e.target.value)}
                                        autoFocus
                                    />
                                    <Button
                                        onClick={handleSubmitFeedback}
                                        disabled={!feedbackText.trim() || isSubmitting}
                                        className="w-full h-12 bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                Enviar Comentarios
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Non-pending status overlay */}
                    {!statusIsPending && (
                        <div className="p-4 bg-white/90 backdrop-blur text-center" onClick={(e) => e.stopPropagation()}>
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${item.status === 'approved'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}>
                                {item.status === 'approved' ? (
                                    <><Check className="w-4 h-4" /> Aprobado</>
                                ) : (
                                    <><MessageSquare className="w-4 h-4" /> Cambios Solicitados</>
                                )}
                            </span>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
