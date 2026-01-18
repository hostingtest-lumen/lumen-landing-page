"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Instagram,
    Facebook,
    Calendar as CalendarIcon,
    Image as ImageIcon,
    Clock,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContentItem {
    id: string;
    title: string;
    platform: "instagram" | "facebook" | "both";
    status: "draft" | "scheduled" | "published";
    date: string;
    time?: string;
    type: "image" | "carousel" | "reel" | "story";
}

// Datos de ejemplo - en producción vendrían de ERPNext o una API
const SAMPLE_CONTENT: ContentItem[] = [
    { id: "1", title: "Post Motivacional", platform: "instagram", status: "scheduled", date: "2026-01-20", time: "10:00", type: "image" },
    { id: "2", title: "Carrusel de Tips", platform: "both", status: "draft", date: "2026-01-21", type: "carousel" },
    { id: "3", title: "Reel Proceso Creativo", platform: "instagram", status: "scheduled", date: "2026-01-22", time: "18:00", type: "reel" },
    { id: "4", title: "Story Promoción", platform: "instagram", status: "published", date: "2026-01-17", type: "story" },
];

const PLATFORM_ICONS = {
    instagram: Instagram,
    facebook: Facebook,
    both: CalendarIcon,
};

const STATUS_CONFIG = {
    draft: { label: "Borrador", color: "bg-gray-200 text-gray-700" },
    scheduled: { label: "Programado", color: "bg-blue-100 text-blue-700" },
    published: { label: "Publicado", color: "bg-emerald-100 text-emerald-700" },
};

const TYPE_CONFIG = {
    image: { label: "Imagen", icon: ImageIcon },
    carousel: { label: "Carrusel", icon: ImageIcon },
    reel: { label: "Reel", icon: Clock },
    story: { label: "Story", icon: Clock },
};

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

export default function ContentPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [content] = useState<ContentItem[]>(SAMPLE_CONTENT);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days: (number | null)[] = [];

        // Add empty slots for days before the first of the month
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }

        // Add the days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        return days;
    };

    const getContentForDate = (day: number) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        return content.filter(c => c.date === dateStr);
    };

    const formatDateStr = (day: number) => {
        return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const today = new Date();
    const isToday = (day: number) => {
        return currentDate.getFullYear() === today.getFullYear() &&
            currentDate.getMonth() === today.getMonth() &&
            day === today.getDate();
    };

    const selectedContent = selectedDate
        ? content.filter(c => c.date === selectedDate)
        : [];

    const stats = {
        total: content.length,
        scheduled: content.filter(c => c.status === "scheduled").length,
        draft: content.filter(c => c.status === "draft").length,
        published: content.filter(c => c.status === "published").length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Calendario de Contenido</h1>
                    <p className="text-gray-500 text-sm">
                        Planifica y programa tus publicaciones
                    </p>
                </div>
                <Button className="gap-2 bg-lumen-structure hover:bg-lumen-structure/90">
                    <Plus className="w-4 h-4" />
                    Nuevo Contenido
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: "Total", value: stats.total, color: "bg-gray-100", textColor: "text-gray-600" },
                    { label: "Programados", value: stats.scheduled, color: "bg-blue-100", textColor: "text-blue-600" },
                    { label: "Borradores", value: stats.draft, color: "bg-amber-100", textColor: "text-amber-600" },
                    { label: "Publicados", value: stats.published, color: "bg-emerald-100", textColor: "text-emerald-600" },
                ].map((stat) => (
                    <motion.div
                        key={stat.label}
                        className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                        whileHover={{ y: -2 }}
                    >
                        <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-2`}>
                            <CalendarIcon className={`w-5 h-5 ${stat.textColor}`} />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Calendar */}
                <div className="col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={prevMonth}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={nextMonth}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {DAYS.map(day => (
                            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {getDaysInMonth(currentDate).map((day, index) => {
                            if (day === null) {
                                return <div key={`empty-${index}`} className="aspect-square" />;
                            }

                            const dayContent = getContentForDate(day);
                            const dateStr = formatDateStr(day);
                            const isSelected = selectedDate === dateStr;

                            return (
                                <motion.button
                                    key={day}
                                    onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                                    className={`aspect-square p-1 rounded-xl transition-all relative ${isToday(day)
                                            ? "bg-lumen-structure text-white"
                                            : isSelected
                                                ? "bg-lumen-creative/10 ring-2 ring-lumen-creative"
                                                : "hover:bg-gray-50"
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className={`text-sm font-medium ${isToday(day) ? "" : "text-gray-700"}`}>
                                        {day}
                                    </span>

                                    {/* Content Indicators */}
                                    {dayContent.length > 0 && (
                                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                                            {dayContent.slice(0, 3).map((c, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-1.5 h-1.5 rounded-full ${c.platform === "instagram"
                                                            ? "bg-pink-500"
                                                            : c.platform === "facebook"
                                                                ? "bg-blue-500"
                                                                : "bg-purple-500"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex justify-center gap-6 mt-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-pink-500" />
                            Instagram
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            Facebook
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500" />
                            Ambos
                        </div>
                    </div>
                </div>

                {/* Selected Day Content */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                        {selectedDate
                            ? `Contenido del ${new Date(selectedDate + "T12:00:00").toLocaleDateString("es-DO", { day: "numeric", month: "long" })}`
                            : "Selecciona un día"
                        }
                    </h3>

                    {selectedDate ? (
                        selectedContent.length > 0 ? (
                            <div className="space-y-3">
                                {selectedContent.map(item => {
                                    const PlatformIcon = PLATFORM_ICONS[item.platform];
                                    const statusConfig = STATUS_CONFIG[item.status];
                                    const typeConfig = TYPE_CONFIG[item.type];
                                    const TypeIcon = typeConfig.icon;

                                    return (
                                        <motion.div
                                            key={item.id}
                                            className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                                            whileHover={{ x: 4 }}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <PlatformIcon className={`w-4 h-4 ${item.platform === "instagram"
                                                            ? "text-pink-500"
                                                            : "text-blue-500"
                                                        }`} />
                                                    <span className="font-medium text-gray-900">{item.title}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                                    {statusConfig.label}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                                    <TypeIcon className="w-3 h-3" />
                                                    {typeConfig.label}
                                                </span>
                                                {item.time && (
                                                    <span className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Clock className="w-3 h-3" />
                                                        {item.time}
                                                    </span>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                                    <CalendarIcon className="w-6 h-6 text-gray-400" />
                                </div>
                                <p className="text-gray-500 text-sm">No hay contenido programado</p>
                                <Button variant="outline" size="sm" className="mt-3 gap-2">
                                    <Plus className="w-4 h-4" />
                                    Agregar
                                </Button>
                            </div>
                        )
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                                <CalendarIcon className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-sm">
                                Haz clic en un día para ver el contenido programado
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
