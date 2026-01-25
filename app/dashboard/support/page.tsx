"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    MessageCircle,
    Search,
    Send,
    MoreVertical,
    Phone,
    Video,
    Paperclip,
    Smile,
    Check,
    CheckCheck,
    Clock,
    User,
    ArrowLeft,
    Filter,
    Star,
    Archive
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Types
interface Message {
    id: string;
    text: string;
    sender: "client" | "team";
    time: string;
    status: "sent" | "delivered" | "read";
    agentName?: string;
}

interface Conversation {
    id: string;
    clientName: string;
    clientAvatar: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    status: "active" | "waiting" | "resolved";
    messages: Message[];
    clientToken: string;
}

// Mock Data
const mockConversations: Conversation[] = [
    {
        id: "conv-1",
        clientName: "Parroquia San José",
        clientAvatar: "PSJ",
        lastMessage: "Hola Ana, tengo una duda sobre el calendario de este mes",
        lastMessageTime: "10:32 AM",
        unreadCount: 2,
        status: "waiting",
        clientToken: "parroquia-san-jose-2026",
        messages: [
            { id: "1", sender: "team", text: "¡Hola! 👋 Soy Ana, tu ejecutiva de cuenta. ¿En qué puedo ayudarte hoy?", time: "10:30 AM", status: "read", agentName: "Ana García" },
            { id: "2", sender: "client", text: "Hola Ana, tengo una duda sobre el calendario de este mes", time: "10:32 AM", status: "read" },
            { id: "3", sender: "client", text: "¿Cuándo se publicará el reel que aprobamos ayer?", time: "10:33 AM", status: "delivered" },
        ]
    },
    {
        id: "conv-2",
        clientName: "Colegio Santa María",
        clientAvatar: "CSM",
        lastMessage: "Gracias por la pronta respuesta!",
        lastMessageTime: "Ayer",
        unreadCount: 0,
        status: "resolved",
        clientToken: "colegio-santa-maria-2026",
        messages: [
            { id: "1", sender: "client", text: "Buenos días, necesito el diseño del flyer para el evento", time: "Ayer 9:00 AM", status: "read" },
            { id: "2", sender: "team", text: "¡Claro! Te lo envío en unos minutos.", time: "Ayer 9:05 AM", status: "read", agentName: "Carlos Ruiz" },
            { id: "3", sender: "client", text: "Gracias por la pronta respuesta!", time: "Ayer 9:10 AM", status: "read" },
        ]
    },
    {
        id: "conv-3",
        clientName: "Fundación Esperanza",
        clientAvatar: "FE",
        lastMessage: "Necesito hablar sobre la campaña de Cuaresma",
        lastMessageTime: "Hace 2 días",
        unreadCount: 1,
        status: "active",
        clientToken: "fundacion-esperanza-2026",
        messages: [
            { id: "1", sender: "client", text: "Necesito hablar sobre la campaña de Cuaresma", time: "Hace 2 días", status: "delivered" },
        ]
    },
];

export default function SupportInboxPage() {
    const [conversations, setConversations] = useState(mockConversations);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [inputText, setInputText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "waiting" | "active" | "resolved">("all");
    const [isMobileViewingChat, setIsMobileViewingChat] = useState(false);

    // Filter conversations
    const filteredConversations = conversations.filter(conv => {
        const matchesSearch = conv.clientName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === "all" || conv.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    // Send message
    const handleSend = () => {
        if (!inputText.trim() || !selectedConversation) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: "team",
            time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
            status: "sent",
            agentName: "Tú"
        };

        setConversations(prev => prev.map(conv => {
            if (conv.id === selectedConversation.id) {
                return {
                    ...conv,
                    messages: [...conv.messages, newMessage],
                    lastMessage: inputText,
                    lastMessageTime: newMessage.time,
                    status: "active" as const
                };
            }
            return conv;
        }));

        setSelectedConversation(prev => prev ? {
            ...prev,
            messages: [...prev.messages, newMessage]
        } : null);

        setInputText("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "waiting": return "bg-amber-500";
            case "active": return "bg-green-500";
            case "resolved": return "bg-gray-400";
            default: return "bg-gray-400";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "waiting": return "Esperando";
            case "active": return "En curso";
            case "resolved": return "Resuelto";
            default: return status;
        }
    };

    const markAsResolved = () => {
        if (!selectedConversation) return;
        setConversations(prev => prev.map(conv =>
            conv.id === selectedConversation.id ? { ...conv, status: "resolved" as const } : conv
        ));
        setSelectedConversation(prev => prev ? { ...prev, status: "resolved" } : null);
    };

    const selectConversation = (conv: Conversation) => {
        setSelectedConversation(conv);
        setIsMobileViewingChat(true);
        // Mark as read
        setConversations(prev => prev.map(c =>
            c.id === conv.id ? { ...c, unreadCount: 0 } : c
        ));
    };

    const backToList = () => {
        setIsMobileViewingChat(false);
    };

    const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <MessageCircle className="w-6 h-6 text-green-500" />
                        Inbox de Soporte
                        {totalUnread > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {totalUnread}
                            </span>
                        )}
                    </h1>
                    <p className="text-gray-500 text-sm">Responde a los mensajes de tus clientes desde el portal</p>
                </div>
            </div>

            {/* Main Container */}
            <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex">
                {/* Conversations List */}
                <div className={`w-full md:w-96 border-r border-gray-200 flex flex-col ${isMobileViewingChat ? 'hidden md:flex' : 'flex'}`}>
                    {/* Search & Filter */}
                    <div className="p-4 border-b border-gray-100 space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar cliente..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            {(["all", "waiting", "active", "resolved"] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterStatus === status
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    {status === "all" ? "Todos" : getStatusLabel(status)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Conversation Items */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredConversations.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>No hay conversaciones</p>
                            </div>
                        ) : (
                            filteredConversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    onClick={() => selectConversation(conv)}
                                    className={`p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${selectedConversation?.id === conv.id ? "bg-green-50" : ""
                                        }`}
                                >
                                    <div className="flex gap-3">
                                        <div className="relative flex-shrink-0">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                                                {conv.clientAvatar}
                                            </div>
                                            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(conv.status)}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-semibold text-gray-900 truncate">{conv.clientName}</h4>
                                                <span className="text-xs text-gray-400 flex-shrink-0">{conv.lastMessageTime}</span>
                                            </div>
                                            <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                                        </div>
                                        {conv.unreadCount > 0 && (
                                            <div className="flex-shrink-0">
                                                <span className="bg-green-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                                    {conv.unreadCount}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`flex-1 flex flex-col ${!isMobileViewingChat ? 'hidden md:flex' : 'flex'}`}>
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="md:hidden"
                                        onClick={backToList}
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </Button>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                                        {selectedConversation.clientAvatar}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{selectedConversation.clientName}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${getStatusColor(selectedConversation.status)}`} />
                                            <span className="text-xs text-gray-500">{getStatusLabel(selectedConversation.status)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                                        <Phone className="w-5 h-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                                        <Video className="w-5 h-5" />
                                    </Button>
                                    {selectedConversation.status !== "resolved" && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={markAsResolved}
                                            className="text-green-600 border-green-200 hover:bg-green-50"
                                        >
                                            <Check className="w-4 h-4 mr-1" />
                                            Resolver
                                        </Button>
                                    )}
                                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                                        <MoreVertical className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                {selectedConversation.messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.sender === "team" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`max-w-[70%] ${msg.sender === "team" ? "order-2" : ""}`}>
                                            {msg.sender === "team" && msg.agentName && (
                                                <p className="text-[10px] text-gray-400 text-right mb-1">{msg.agentName}</p>
                                            )}
                                            <div
                                                className={`px-4 py-2.5 rounded-2xl ${msg.sender === "team"
                                                        ? "bg-green-500 text-white rounded-br-md"
                                                        : "bg-white text-gray-900 shadow-sm border border-gray-100 rounded-bl-md"
                                                    }`}
                                            >
                                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                            </div>
                                            <div className={`flex items-center gap-1 mt-1 ${msg.sender === "team" ? "justify-end" : "justify-start"}`}>
                                                <span className="text-[10px] text-gray-400">{msg.time}</span>
                                                {msg.sender === "team" && (
                                                    msg.status === "read" ? (
                                                        <CheckCheck className="w-3 h-3 text-blue-500" />
                                                    ) : msg.status === "delivered" ? (
                                                        <CheckCheck className="w-3 h-3 text-gray-400" />
                                                    ) : (
                                                        <Check className="w-3 h-3 text-gray-400" />
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Input Area */}
                            <div className="p-4 border-t border-gray-100 bg-white">
                                <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                                        <Paperclip className="w-4 h-4" />
                                    </Button>
                                    <input
                                        type="text"
                                        placeholder="Escribe tu respuesta..."
                                        className="flex-1 bg-transparent text-sm outline-none"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                    />
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                                        <Smile className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        onClick={handleSend}
                                        disabled={!inputText.trim()}
                                        className="h-8 w-8 rounded-lg bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
                                    >
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-gray-50">
                            <div className="text-center text-gray-400">
                                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona una conversación</h3>
                                <p className="text-sm">Elige un cliente del panel izquierdo para ver sus mensajes</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
