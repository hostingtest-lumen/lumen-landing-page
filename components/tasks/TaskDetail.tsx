"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Calendar,
    User,
    Tag,
    CheckSquare,
    Paperclip,
    MessageSquare,
    Send,
    MoreHorizontal,
    Trash2,
    Clock,
    CheckCircle2,
    Circle,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Task, Comment } from "@/types/crm";

interface TaskDetailProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updatedTask: Task) => void;
}

const PRIORITIES = {
    Low: { label: "Baja", color: "text-gray-400", bg: "bg-gray-800" },
    Medium: { label: "Media", color: "text-blue-400", bg: "bg-blue-900/30" },
    High: { label: "Alta", color: "text-orange-400", bg: "bg-orange-900/30" },
    Urgent: { label: "Urgente", color: "text-red-400", bg: "bg-red-900/30" },
};

const STATUSES = {
    Open: { label: "Pendiente", color: "bg-gray-800 text-gray-400" },
    Working: { label: "En Progreso", color: "bg-lumen-creative/20 text-lumen-creative" },
    "Pending Review": { label: "En Revisión", color: "bg-lumen-gold/20 text-lumen-gold" },
    Completed: { label: "Completada", color: "bg-green-900/20 text-green-400" },
    Cancelled: { label: "Cancelada", color: "bg-red-900/20 text-red-400" },
};

export default function TaskDetail({ task, isOpen, onClose, onUpdate }: TaskDetailProps) {
    const [localTask, setLocalTask] = useState<Task>(task);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isCommentLoading, setIsCommentLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const commentInputRef = useRef<HTMLTextAreaElement>(null);

    // Sync local state when prop changes
    useEffect(() => {
        if (task) {
            setLocalTask(task);
        }
        if (isOpen && task?.id) {
            fetchComments();
        }
    }, [task, isOpen]);

    const fetchComments = async () => {
        if (!task?.id) return;
        try {
            const res = await fetch(`/api/tasks/${task.id}/comments`);
            if (res.ok) {
                const data = await res.json();
                setComments(data.comments || []);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            // Optimistic update
            onUpdate(localTask);

            // API Call
            const res = await fetch('/api/tasks', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(localTask)
            });

            if (!res.ok) {
                console.error("Error saving task");
                // Revert logic could be added here
            } else {
                // Success feedback could be added here
            }

        } catch (error) {
            console.error("Error updating task:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleStatusChange = async (newStatus: Task['status']) => {
        const updated = { ...localTask, status: newStatus };
        setLocalTask(updated);
        // Status changes are typically auto-saved or part of general save. 
        // For immediate feedback let's call update immediately but also keep it in local state.
        onUpdate(updated);

        try {
            await fetch('/api/tasks', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: task.id, status: newStatus })
            });
        } catch (e) { console.error(e); }
    };

    const handleSendComment = async () => {
        if (!newComment.trim() || !task?.id) return;

        setIsCommentLoading(true);
        try {
            const res = await fetch(`/api/tasks/${task.id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newComment })
            });

            if (res.ok) {
                const data = await res.json();
                setComments([data.comment, ...comments]);
                setNewComment("");
            }
        } catch (error) {
            console.error("Error sending comment:", error);
        } finally {
            setIsCommentLoading(false);
        }
    };

    // Auto-resize textarea
    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewComment(e.target.value);
        if (commentInputRef.current) {
            commentInputRef.current.style.height = 'auto';
            commentInputRef.current.style.height = `${commentInputRef.current.scrollHeight}px`;
        }
    };

    if (!isOpen || !localTask) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    />

                    {/* SlideOver Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-4xl bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-lg z-10">
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-gray-100 text-gray-500 hover:text-gray-900">
                                    <X className="w-5 h-5" />
                                </Button>
                                {/* Breadcrumbs */}
                                <span className="text-sm text-gray-400 font-mono">
                                    {localTask.project ? `PRJ: ${localTask.project}` : "TASKS"}
                                    {' / '}
                                    <span className="text-lumen-priority">#{localTask.id?.slice(-4) || "..."}</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={handleSaveChanges}
                                    disabled={isSaving}
                                    className="bg-lumen-priority hover:bg-lumen-priority/90 text-white font-medium shadow-md shadow-lumen-priority/20"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar Cambios"}
                                </Button>
                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-900 hover:bg-gray-100">
                                    <MoreHorizontal className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1 flex overflow-hidden">
                            {/* Left Column: Task Details */}
                            <div className="flex-1 overflow-y-auto p-8 border-r border-gray-200 bg-white">
                                {/* Title Area */}
                                <div className="mb-8 group">
                                    <input
                                        type="text"
                                        value={localTask.title || ""}
                                        onChange={(e) => setLocalTask({ ...localTask, title: e.target.value })}
                                        className="w-full text-3xl font-bold text-gray-900 border-none focus:ring-0 p-0 placeholder-gray-300 bg-transparent"
                                        placeholder="Título de la tarea"
                                    />
                                </div>

                                {/* Status & Meta Bar */}
                                <div className="flex items-center gap-4 mb-8 flex-wrap">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 shadow-sm">
                                        <div className={`w-2.5 h-2.5 rounded-full ${STATUSES[localTask.status as keyof typeof STATUSES]?.color.split(' ')[0].replace('bg-', 'bg-') || 'bg-gray-400'
                                            }`} />
                                        <select
                                            value={localTask.status}
                                            onChange={(e) => handleStatusChange(e.target.value as any)}
                                            className="bg-transparent text-sm font-medium text-gray-700 border-none focus:ring-0 p-0 cursor-pointer"
                                        >
                                            {Object.entries(STATUSES).map(([key, config]) => (
                                                <option key={key} value={key}>{config.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* ... rest of the meta controls ... */}
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={localTask.assignedTo || ""}
                                            onChange={(e) => setLocalTask({ ...localTask, assignedTo: e.target.value })}
                                            className="bg-transparent text-sm text-gray-700 border-none focus:ring-0 p-0 w-32 placeholder-gray-400"
                                            placeholder="Asignar a..."
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <input
                                            type="date"
                                            value={localTask.dueDate || ""}
                                            onChange={(e) => setLocalTask({ ...localTask, dueDate: e.target.value })}
                                            className="bg-transparent text-sm text-gray-700 border-none focus:ring-0 p-0 w-32"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-8">
                                    <h3 className="flex items-center gap-2 text-sm font-semibold text-lumen-priority mb-3 uppercase tracking-wider">
                                        <CheckSquare className="w-4 h-4" />
                                        Descripción
                                    </h3>
                                    <textarea
                                        value={localTask.description || ""}
                                        onChange={(e) => setLocalTask({ ...localTask, description: e.target.value })}
                                        className="w-full min-h-[150px] p-4 rounded-xl border border-gray-200 bg-gray-50 focus:border-lumen-priority focus:ring-0 text-gray-900 resize-none placeholder-gray-400"
                                        placeholder="Escribe una descripción detallada..."
                                    />
                                </div>

                                {/* Checklist (Subtasks Placeholder) */}
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Subtareas
                                        </h3>
                                        <Button variant="ghost" size="sm" className="h-6 text-xs text-lumen-priority hover:text-white hover:bg-lumen-priority/10">
                                            + Agregar item
                                        </Button>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center text-sm text-gray-400">
                                        No hay subtareas creadas (Próximamente)
                                    </div>
                                </div>

                                {/* Attachments Placeholder */}
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                            <Paperclip className="w-4 h-4" />
                                            Archivos
                                        </h3>
                                        <Button variant="ghost" size="sm" className="h-6 text-xs text-lumen-priority hover:text-white hover:bg-lumen-priority/10">
                                            + Subir
                                        </Button>
                                    </div>
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer group hover:border-lumen-priority/30">
                                        <p className="text-sm text-gray-400 group-hover:text-gray-600">Arrastra archivos aquí o haz clic para subir</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Activity & Comments */}
                            <div className="w-[350px] bg-gray-50 flex flex-col border-l border-gray-200">
                                <div className="p-4 border-b border-gray-200 bg-white">
                                    <h3 className="text-sm font-semibold text-gray-900">Actividad</h3>
                                </div>

                                {/* Activity List */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {comments.map((comment, idx) => (
                                        <div key={comment.id || idx} className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-lumen-priority/10 flex items-center justify-center text-xs font-bold text-lumen-priority flex-shrink-0 ring-1 ring-lumen-priority/20">
                                                {(comment.author || "?").charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <div className="bg-white p-3 rounded-lg rounded-tl-none border border-gray-200 shadow-sm">
                                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1 pl-1">
                                                    {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : "Justo ahora"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Comment Input */}
                                <div className="p-4 bg-gray-50 border-t border-gray-200">
                                    <div className="relative">
                                        <textarea
                                            ref={commentInputRef}
                                            value={newComment}
                                            onChange={handleCommentChange}
                                            placeholder="Escribe un comentario..."
                                            className="w-full min-h-[80px] max-h-[200px] p-3 pr-12 rounded-xl border border-gray-200 bg-white focus:border-lumen-priority focus:ring-0 text-sm resize-none text-gray-900 placeholder-gray-400 shadow-sm"
                                            disabled={isCommentLoading}
                                        />
                                        <Button
                                            size="sm"
                                            className="absolute bottom-2 right-2 h-8 w-8 p-0 rounded-lg bg-lumen-priority hover:bg-lumen-priority/90"
                                            onClick={handleSendComment}
                                            disabled={!newComment.trim() || isCommentLoading}
                                        >
                                            <Send className="w-4 h-4 text-white" />
                                        </Button>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2 text-center">
                                        Presiona Enter para enviar
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
