"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon, Film, Layers, FileText, Calendar as CalendarIcon, List, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface ScheduledPost {
    id: string;
    title: string;
    date: string;
    type: "post" | "reel" | "story" | "carousel";
    status: "draft" | "scheduled" | "published" | "pending" | "approved";
    platform: "instagram" | "facebook" | "tiktok";
}

interface ContentCalendarProps {
    clientId?: string;
    posts?: ScheduledPost[];
}

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

export function ContentCalendar({ clientId, posts: externalPosts }: ContentCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
    const [posts, setPosts] = useState<ScheduledPost[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch posts if clientId is provided, otherwise use external posts or mock data
    useEffect(() => {
        if (clientId) {
            fetchPosts();
        } else if (externalPosts) {
            setPosts(externalPosts);
        } else {
            // Use mock data for demo
            setPosts([
                { id: "1", title: "Post Motivacional", date: new Date().toISOString().split('T')[0], type: "post", status: "scheduled", platform: "instagram" },
                { id: "2", title: "Reel Educativo", date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], type: "reel", status: "pending", platform: "instagram" },
                { id: "3", title: "Carousel Tips", date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], type: "carousel", status: "draft", platform: "instagram" },
                { id: "4", title: "Story Promocional", date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0], type: "story", status: "scheduled", platform: "instagram" },
            ]);
        }
    }, [clientId, externalPosts]);

    const fetchPosts = async () => {
        if (!clientId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/deliverables?clientId=${clientId}`);
            if (res.ok) {
                const data = await res.json();
                // Transform deliverables to calendar posts
                const transformed: ScheduledPost[] = (data.deliverables || []).map((d: any) => ({
                    id: d.id,
                    title: d.title,
                    date: d.date || d.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
                    type: d.type === 'video' ? 'reel' : d.type === 'carousel' ? 'carousel' : 'post',
                    status: d.status,
                    platform: 'instagram'
                }));
                setPosts(transformed);
            }
        } catch (err) {
            console.error("Error fetching calendar posts:", err);
        } finally {
            setLoading(false);
        }
    };

    // Navigation
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

    // Calendar Generation
    const startDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

    // Get posts for a specific day
    const getPostsForDay = (day: number) => {
        const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return posts.filter(post => post.date === dateStr);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "post": return <ImageIcon className="w-3 h-3" />;
            case "reel": return <Film className="w-3 h-3" />;
            case "carousel": return <Layers className="w-3 h-3" />;
            default: return <FileText className="w-3 h-3" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "scheduled": return "bg-blue-100 text-blue-700 border-blue-200";
            case "published": return "bg-green-100 text-green-700 border-green-200";
            case "approved": return "bg-green-100 text-green-700 border-green-200";
            case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "post": return "text-pink-500";
            case "reel": return "text-purple-500";
            case "carousel": return "text-blue-500";
            default: return "text-gray-500";
        }
    };

    // Calendar Grid Generation
    const calendarDays = [];
    for (let i = 0; i < startDay; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="h-24 bg-gray-50/50" />);
    }

    const isToday = (day: number) => {
        const today = new Date();
        return today.getDate() === day && today.getMonth() === currentMonth.getMonth() && today.getFullYear() === currentMonth.getFullYear();
    };

    for (let day = 1; day <= daysInMonth; day++) {
        const dayPosts = getPostsForDay(day);
        calendarDays.push(
            <div
                key={day}
                className={`h-24 border-t border-l border-gray-100 p-1.5 hover:bg-gray-50 transition-colors relative group ${isToday(day) ? 'bg-amber-50/50' : ''}`}
            >
                <span className={`text-xs font-medium ${isToday(day) ? 'bg-lumen-priority text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-gray-500'}`}>
                    {day}
                </span>
                <div className="mt-1 space-y-0.5 overflow-hidden max-h-14">
                    {dayPosts.slice(0, 2).map(post => (
                        <div
                            key={post.id}
                            className={`text-[10px] px-1.5 py-0.5 rounded border flex items-center gap-1 truncate cursor-pointer ${getStatusColor(post.status)}`}
                        >
                            <span className={getTypeColor(post.type)}>{getTypeIcon(post.type)}</span>
                            <span className="truncate">{post.title}</span>
                        </div>
                    ))}
                    {dayPosts.length > 2 && (
                        <div className="text-[9px] text-gray-400 pl-1">+{dayPosts.length - 2} más</div>
                    )}
                </div>
            </div>
        );
    }

    // Month's posts for list view
    const monthPosts = posts.filter(post => {
        const postDate = new Date(post.date);
        return postDate.getMonth() === currentMonth.getMonth() && postDate.getFullYear() === currentMonth.getFullYear();
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-lumen-priority mr-2" />
                <span className="text-gray-500">Cargando calendario...</span>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-lumen-priority" />
                    <h3 className="font-bold text-gray-900">Calendario de Contenido</h3>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-medium text-gray-700 w-32 text-center">
                        {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </span>
                    <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewMode("calendar")}
                        className={`h-7 px-3 text-xs ${viewMode === "calendar" ? "bg-white shadow-sm" : "text-gray-500"}`}
                    >
                        <CalendarIcon className="w-3.5 h-3.5 mr-1.5" /> Mes
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className={`h-7 px-3 text-xs ${viewMode === "list" ? "bg-white shadow-sm" : "text-gray-500"}`}
                    >
                        <List className="w-3.5 h-3.5 mr-1.5" /> Lista
                    </Button>
                </div>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                {viewMode === "calendar" ? (
                    <motion.div
                        key="calendar"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Day Headers */}
                        <div className="grid grid-cols-7 border-b border-gray-100">
                            {DAYS.map(day => (
                                <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase py-2 bg-gray-50/50">
                                    {day}
                                </div>
                            ))}
                        </div>
                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7">
                            {calendarDays}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-4 space-y-2 max-h-[400px] overflow-y-auto"
                    >
                        {monthPosts.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <CalendarIcon className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                <p className="text-sm">Sin contenido programado este mes</p>
                            </div>
                        ) : (
                            monthPosts.map(post => (
                                <div
                                    key={post.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg bg-white border ${getStatusColor(post.status)}`}>
                                            {getTypeIcon(post.type)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-gray-900">{post.title}</p>
                                            <p className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${getStatusColor(post.status)}`}>
                                        {post.status === 'scheduled' ? 'Programado' :
                                            post.status === 'published' ? 'Publicado' :
                                                post.status === 'approved' ? 'Aprobado' :
                                                    post.status === 'pending' ? 'Pendiente' : 'Borrador'}
                                    </span>
                                </div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Legend */}
            <div className="p-3 border-t border-gray-100 bg-gray-50/50 flex items-center gap-4 text-[10px]">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <span className="text-gray-500">Programado</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                    <span className="text-gray-500">Pendiente</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-gray-500">Aprobado</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <span className="text-gray-500">Borrador</span>
                </div>
            </div>
        </div>
    );
}
