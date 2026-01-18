<<<<<<< HEAD
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    Circle,
    Clock,
    AlertCircle,
    Loader2,
    Calendar,
    User,
    Link2,
    Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskDetail from "@/components/tasks/TaskDetail";
import { Task } from "@/types/crm";

const PRIORITY_CONFIG = {
    Low: { label: "Baja", color: "text-gray-400", bg: "bg-gray-800/50" },
    Medium: { label: "Media", color: "text-blue-400", bg: "bg-blue-900/20" },
    High: { label: "Alta", color: "text-orange-400", bg: "bg-orange-900/20" },
    Urgent: { label: "Urgente", color: "text-red-400", bg: "bg-red-900/20" },
};

const STATUS_CONFIG = {
    Open: { icon: Circle, color: "text-gray-500" },
    Working: { icon: Clock, color: "text-lumen-creative" },
    "Pending Review": { icon: AlertCircle, color: "text-lumen-gold" },
    Completed: { icon: CheckCircle2, color: "text-green-500" },
    Cancelled: { icon: Circle, color: "text-red-400" },
};

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "Open" | "Completed">("all");
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/tasks");
            if (res.ok) {
                const data = await res.json();
                setTasks(data.tasks || []);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateTask = async () => {
        const dummyTask: Task = {
            id: `new-${Date.now()}`,
            title: "Nueva Tarea",
            status: "Open",
            priority: "Medium",
            description: "",
        };

        try {
            const res = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dummyTask),
            });

            if (res.ok) {
                const data = await res.json();
                setTasks([data.task, ...tasks]);
                setSelectedTask(data.task);
                setIsDetailOpen(true);
            }
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setIsDetailOpen(true);
    };

    const handleTaskUpdate = (updatedTask: Task) => {
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
        setSelectedTask(updatedTask);
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === "all") return task.status !== "Completed" && task.status !== "Cancelled";
        if (filter === "Completed") return task.status === "Completed";
        return task.status === filter;
    });

    const stats = {
        total: tasks.length,
        open: tasks.filter(t => t.status === "Open").length,
        working: tasks.filter(t => t.status === "Working").length,
        completed: tasks.filter(t => t.status === "Completed").length,
    };

    if (isLoading && tasks.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-lumen-priority" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Mis Tareas</h1>
                    <p className="text-gray-500 text-sm">
                        Gestiona tus proyectos y pendientes
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchTasks}
                        className="gap-2 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    >
                        <Loader2 className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Actualizar
                    </Button>
                    <Button
                        onClick={handleCreateTask}
                        className="gap-2 bg-lumen-priority hover:bg-lumen-priority/90 text-white font-medium shadow-md shadow-lumen-priority/20"
                    >
                        <Plus className="w-4 h-4" />
                        Nueva Tarea
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Pendientes</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.open}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <p className="text-xs text-lumen-priority uppercase font-semibold">En Proceso</p>
                    <p className="text-2xl font-bold text-lumen-priority">{stats.working}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <p className="text-xs text-green-600 uppercase font-semibold">Completadas</p>
                    <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Total Tareas</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
            </div>

            {/* Tasks List */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
                {/* List Header */}
                <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-gray-50/50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="w-8 text-center">Estado</div>
                    <div className="flex-1">Tarea</div>
                    <div className="w-32">Responsable</div>
                    <div className="w-32">Fecha</div>
                    <div className="w-24">Prioridad</div>
                </div>

                {filteredTasks.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Estás al día</h3>
                        <p className="text-gray-500 text-sm mt-1">
                            No hay tareas pendientes en esta vista
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredTasks.map((task) => {
                            const StatusIcon = STATUS_CONFIG[task.status as keyof typeof STATUS_CONFIG]?.icon || Circle;
                            const statusColor = STATUS_CONFIG[task.status as keyof typeof STATUS_CONFIG]?.color || "text-gray-400";
                            const priorityConfig = PRIORITY_CONFIG[task.priority as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG.Medium;

                            return (
                                <motion.div
                                    key={task.id || Math.random()}
                                    layoutId={task.id}
                                    onClick={() => handleTaskClick(task)}
                                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                                >
                                    <div className="w-8 flex justify-center">
                                        <StatusIcon className={`w-5 h-5 ${statusColor}`} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate group-hover:text-lumen-priority transition-colors">
                                            {task.title || "Sin título"}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-500">#{task.id?.slice(-4) || "..."}</span>
                                            {task.project && (
                                                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600 border border-gray-200">
                                                    {task.project}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-32">
                                        {task.assignedTo ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-lumen-priority/10 flex items-center justify-center text-[10px] font-bold text-lumen-priority ring-1 ring-lumen-priority/20">
                                                    {(task.assignedTo || "?").charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm text-gray-600 truncate">{task.assignedTo.split('@')[0]}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400 italic">Sin asignar</span>
                                        )}
                                    </div>

                                    <div className="w-32 text-sm text-gray-500">
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
                                    </div>

                                    <div className="w-24">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.bg} ${priorityConfig.color} border border-gray-200`}>
                                            {priorityConfig.label}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Task Detail SlideOver */}
            {selectedTask && (
                <TaskDetail
                    task={selectedTask}
                    isOpen={isDetailOpen}
                    onClose={() => setIsDetailOpen(false)}
                    onUpdate={handleTaskUpdate}
                />
            )}
        </div>
    );
}
=======
export default function TasksPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Mis Tareas</h1>
            <div className="p-10 text-center bg-white border border-gray-100 rounded-xl">
                <span className="text-4xl">✅</span>
                <h3 className="mt-4 text-lg font-medium">Lista de Tareas</h3>
                <p className="text-gray-500">Tus pendientes asignados desde ERPNext.</p>
            </div>
        </div>
    );
}

