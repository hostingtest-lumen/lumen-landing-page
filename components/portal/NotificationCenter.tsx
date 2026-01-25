"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, X, Check, AlertCircle, Package, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    type: "delivery" | "reminder" | "approval" | "alert";
    read: boolean;
}

// Mock notifications
const mockNotifications: Notification[] = [
    {
        id: "1",
        title: "Nuevo Entregable",
        message: "Se ha subido un nuevo reel para tu aprobación",
        time: "Hace 5 min",
        type: "delivery",
        read: false
    },
    {
        id: "2",
        title: "Recordatorio de Pago",
        message: "Tu factura INV-2026-002 vence en 3 días",
        time: "Hace 2 horas",
        type: "reminder",
        read: false
    },
    {
        id: "3",
        title: "Contenido Publicado",
        message: "El post 'Motivacional' fue publicado exitosamente",
        time: "Ayer",
        type: "approval",
        read: true
    },
    {
        id: "4",
        title: "Acción Requerida",
        message: "Tienes 2 entregables pendientes de revisión",
        time: "Hace 2 días",
        type: "alert",
        read: true
    },
];

export function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "delivery": return <Package className="w-4 h-4 text-blue-500" />;
            case "reminder": return <Clock className="w-4 h-4 text-amber-500" />;
            case "approval": return <Check className="w-4 h-4 text-green-500" />;
            case "alert": return <AlertCircle className="w-4 h-4 text-red-500" />;
            default: return <FileText className="w-4 h-4 text-gray-500" />;
        }
    };

    const getBgColor = (type: string, read: boolean) => {
        if (read) return "bg-white";
        switch (type) {
            case "delivery": return "bg-blue-50";
            case "reminder": return "bg-amber-50";
            case "approval": return "bg-green-50";
            case "alert": return "bg-red-50";
            default: return "bg-gray-50";
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="relative h-9 w-9 text-gray-600 hover:text-gray-900"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                        {unreadCount}
                    </span>
                )}
            </Button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-3 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900">Notificaciones</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-lumen-priority hover:underline"
                                >
                                    Marcar todas como leídas
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-400">
                                    <Bell className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                    <p>No tienes notificaciones</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <motion.div
                                        key={notification.id}
                                        layout
                                        onClick={() => markAsRead(notification.id)}
                                        className={`p-3 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${getBgColor(notification.type, notification.read)}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                                                {getIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className={`text-sm ${notification.read ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
                                                        {notification.title}
                                                    </p>
                                                    {!notification.read && (
                                                        <span className="w-2 h-2 bg-lumen-priority rounded-full flex-shrink-0 mt-1.5" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notification.message}</p>
                                                <p className="text-[10px] text-gray-400 mt-1">{notification.time}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-2 bg-gray-50 border-t border-gray-100">
                            <Button variant="ghost" className="w-full text-sm text-gray-600 hover:text-gray-900">
                                Ver todas las notificaciones
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
