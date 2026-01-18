<<<<<<< HEAD
"use client";

import { X, Phone, Mail, User, AlignLeft, MessageSquare, Briefcase, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LeadSlideOverProps {
    leadId: string;
    isOpen: boolean;
    onClose: () => void;
}

interface LeadDetail {
    name: string;
    lead_name: string;
    title?: string;
    mobile_no?: string;
    email_id?: string;
    status: string;
    source?: string;
    notes?: string;
    // Add other fields as needed
}

export function LeadSlideOver({ leadId, isOpen, onClose }: LeadSlideOverProps) {
    const [lead, setLead] = useState<LeadDetail | null>(null);
    const [notes, setNotes] = useState<any[]>([]);
    const [newNote, setNewNote] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen && leadId) {
            setIsLoading(true);
            fetch(`/api/leads/${leadId}`)
                .then(res => res.json())
                .then(data => {
                    setLead(data.lead);
                    setNotes(data.timeline || []); // Set timeline notes
                    setIsLoading(false);
                })
                .catch(err => setIsLoading(false));
        }
    }, [isOpen, leadId]);

    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        setIsSaving(true);
        try {
            const res = await fetch(`/api/leads/${leadId}/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ note: newNote }),
            });

            if (res.ok) {
                // Optimistic Update (using local time for immediate feedback)
                const savedNote = {
                    content: newNote,
                    communication_date: new Date().toISOString(),
                    sender: "Yo", // This will update on refresh
                };
                setNotes([savedNote, ...notes]);
                setNewNote("");
            }
        } catch (error) {
            console.error("Error saving note");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-gray-100 z-50 flex flex-col"
                >
                    {/* Header with Gradient */}
                    <div className="bg-gradient-to-r from-lumen-structure to-lumen-creative p-6 text-white relative overflow-hidden">
                        {/* Decorative Circle */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <h2 className="text-xl font-bold leading-tight">
                                    {isLoading ? "Cargando..." : lead?.lead_name}
                                </h2>
                                <p className="text-white/70 text-sm mt-1 flex items-center gap-1">
                                    <Briefcase className="w-3 h-3" />
                                    {isLoading ? "..." : (lead?.title || "Sin institución")}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition-colors backdrop-blur-sm"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lumen-structure"></div>
                            </div>
                        ) : lead && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                {/* StatusBar */}
                                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100 mb-6">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado Actual</span>
                                    <span className="px-3 py-1 rounded-full bg-lumen-structure/10 text-lumen-structure text-sm font-bold">
                                        {lead.status}
                                    </span>
                                </div>

                                {/* Quick Actions */}
                                <div className="grid grid-cols-2 gap-3 mb-8">
                                    <Button
                                        className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white shadow-md shadow-green-200"
                                        onClick={() => window.open(`https://wa.me/${lead.mobile_no?.replace(/\D/g, '')}`, '_blank')}
                                    >
                                        <MessageSquare className="w-4 h-4 mr-2" /> WhatsApp
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full border-gray-200 hover:bg-gray-50 hover:text-lumen-structure"
                                        onClick={() => window.location.href = `mailto:${lead.email_id}`}
                                    >
                                        <Mail className="w-4 h-4 mr-2" /> Correo
                                    </Button>
                                </div>

                                {/* Details */}
                                <div className="space-y-5">
                                    <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium">Nombre Completo</p>
                                            <p className="text-gray-900 font-medium">{lead.lead_name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium">Bóvil / WhatsApp</p>
                                            <p className="text-gray-900 font-medium font-mono">{lead.mobile_no || "—"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium">Correo Electrónico</p>
                                            <p className="text-gray-900 font-medium break-all">{lead.email_id || "—"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline / Notes */}
                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <AlignLeft className="w-4 h-4" />
                                        Notas & Actividad
                                    </h3>

                                    {/* Add Note Input */}
                                    <div className="mb-6 relative">
                                        <textarea
                                            value={newNote}
                                            onChange={(e) => setNewNote(e.target.value)}
                                            placeholder="Escribe una nota..."
                                            className="w-full p-3 rounded-xl border border-gray-200 focus:border-lumen-structure focus:ring-0 text-sm min-h-[80px] pr-10 resize-none bg-gray-50/50 focus:bg-white transition-colors"
                                        />
                                        <button
                                            onClick={handleAddNote}
                                            disabled={!newNote.trim() || isSaving}
                                            className="absolute bottom-3 right-3 p-1.5 bg-lumen-structure text-white rounded-lg hover:bg-lumen-creative disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {isSaving ? (
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <Send className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Timeline List */}
                                    <div className="space-y-6">
                                        {notes.length === 0 ? (
                                            <p className="text-center text-xs text-gray-400 py-4">No hay notas registradas aún.</p>
                                        ) : (
                                            notes.map((note: any, idx: number) => (
                                                <div key={idx} className="flex gap-3 relative group">
                                                    {/* Vertical Line */}
                                                    {idx !== notes.length - 1 && (
                                                        <div className="absolute left-[15px] top-8 bottom-[-24px] w-0.5 bg-gray-100" />
                                                    )}

                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border-2 border-white shadow-sm text-gray-500 z-10">
                                                        <MessageSquare className="w-3 h-3" />
                                                    </div>
                                                    <div className="flex-1 pb-1">
                                                        <div className="bg-gray-50 p-3 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border border-gray-100/50">
                                                            <p className="text-xs text-gray-800 whitespace-pre-wrap">{note.content}</p>
                                                            <div className="mt-2 flex items-center justify-between">
                                                                <span className="text-[10px] text-gray-400 font-medium">
                                                                    {new Date(note.communication_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                                                                </span>
                                                                <span className="text-[10px] text-lumen-structure/60 font-mono">
                                                                    {note.sender}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
=======
"use client";

import { X, Phone, Mail, User, AlignLeft, MessageSquare, Briefcase, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LeadSlideOverProps {
    leadId: string;
    isOpen: boolean;
    onClose: () => void;
}

interface LeadDetail {
    name: string;
    lead_name: string;
    title?: string;
    mobile_no?: string;
    email_id?: string;
    status: string;
    source?: string;
    notes?: string;
    // Add other fields as needed
}

export function LeadSlideOver({ leadId, isOpen, onClose }: LeadSlideOverProps) {
    const [lead, setLead] = useState<LeadDetail | null>(null);
    const [notes, setNotes] = useState<any[]>([]);
    const [newNote, setNewNote] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen && leadId) {
            setIsLoading(true);
            fetch(`/api/leads/${leadId}`)
                .then(res => res.json())
                .then(data => {
                    setLead(data.lead);
                    setNotes(data.timeline || []); // Set timeline notes
                    setIsLoading(false);
                })
                .catch(err => setIsLoading(false));
        }
    }, [isOpen, leadId]);

    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        setIsSaving(true);
        try {
            const res = await fetch(`/api/leads/${leadId}/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ note: newNote }),
            });

            if (res.ok) {
                // Optimistic Update (using local time for immediate feedback)
                const savedNote = {
                    content: newNote,
                    communication_date: new Date().toISOString(),
                    sender: "Yo", // This will update on refresh
                };
                setNotes([savedNote, ...notes]);
                setNewNote("");
            }
        } catch (error) {
            console.error("Error saving note");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-gray-100 z-50 flex flex-col"
                >
                    {/* Header with Gradient */}
                    <div className="bg-gradient-to-r from-lumen-structure to-lumen-creative p-6 text-white relative overflow-hidden">
                        {/* Decorative Circle */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <h2 className="text-xl font-bold leading-tight">
                                    {isLoading ? "Cargando..." : lead?.lead_name}
                                </h2>
                                <p className="text-white/70 text-sm mt-1 flex items-center gap-1">
                                    <Briefcase className="w-3 h-3" />
                                    {isLoading ? "..." : (lead?.title || "Sin institución")}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition-colors backdrop-blur-sm"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lumen-structure"></div>
                            </div>
                        ) : lead && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                {/* StatusBar */}
                                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100 mb-6">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado Actual</span>
                                    <span className="px-3 py-1 rounded-full bg-lumen-structure/10 text-lumen-structure text-sm font-bold">
                                        {lead.status}
                                    </span>
                                </div>

                                {/* Quick Actions */}
                                <div className="grid grid-cols-2 gap-3 mb-8">
                                    <Button
                                        className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white shadow-md shadow-green-200"
                                        onClick={() => window.open(`https://wa.me/${lead.mobile_no?.replace(/\D/g, '')}`, '_blank')}
                                    >
                                        <MessageSquare className="w-4 h-4 mr-2" /> WhatsApp
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full border-gray-200 hover:bg-gray-50 hover:text-lumen-structure"
                                        onClick={() => window.location.href = `mailto:${lead.email_id}`}
                                    >
                                        <Mail className="w-4 h-4 mr-2" /> Correo
                                    </Button>
                                </div>

                                {/* Details */}
                                <div className="space-y-5">
                                    <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium">Nombre Completo</p>
                                            <p className="text-gray-900 font-medium">{lead.lead_name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium">Bóvil / WhatsApp</p>
                                            <p className="text-gray-900 font-medium font-mono">{lead.mobile_no || "—"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium">Correo Electrónico</p>
                                            <p className="text-gray-900 font-medium break-all">{lead.email_id || "—"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline / Notes */}
                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <AlignLeft className="w-4 h-4" />
                                        Notas & Actividad
                                    </h3>

                                    {/* Add Note Input */}
                                    <div className="mb-6 relative">
                                        <textarea
                                            value={newNote}
                                            onChange={(e) => setNewNote(e.target.value)}
                                            placeholder="Escribe una nota..."
                                            className="w-full p-3 rounded-xl border border-gray-200 focus:border-lumen-structure focus:ring-0 text-sm min-h-[80px] pr-10 resize-none bg-gray-50/50 focus:bg-white transition-colors"
                                        />
                                        <button
                                            onClick={handleAddNote}
                                            disabled={!newNote.trim() || isSaving}
                                            className="absolute bottom-3 right-3 p-1.5 bg-lumen-structure text-white rounded-lg hover:bg-lumen-creative disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {isSaving ? (
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <Send className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Timeline List */}
                                    <div className="space-y-6">
                                        {notes.length === 0 ? (
                                            <p className="text-center text-xs text-gray-400 py-4">No hay notas registradas aún.</p>
                                        ) : (
                                            notes.map((note: any, idx: number) => (
                                                <div key={idx} className="flex gap-3 relative group">
                                                    {/* Vertical Line */}
                                                    {idx !== notes.length - 1 && (
                                                        <div className="absolute left-[15px] top-8 bottom-[-24px] w-0.5 bg-gray-100" />
                                                    )}

                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border-2 border-white shadow-sm text-gray-500 z-10">
                                                        <MessageSquare className="w-3 h-3" />
                                                    </div>
                                                    <div className="flex-1 pb-1">
                                                        <div className="bg-gray-50 p-3 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border border-gray-100/50">
                                                            <p className="text-xs text-gray-800 whitespace-pre-wrap">{note.content}</p>
                                                            <div className="mt-2 flex items-center justify-between">
                                                                <span className="text-[10px] text-gray-400 font-medium">
                                                                    {new Date(note.communication_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                                                                </span>
                                                                <span className="text-[10px] text-lumen-structure/60 font-mono">
                                                                    {note.sender}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

