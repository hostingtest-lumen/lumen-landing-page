"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Paperclip, Smile, User, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    id: string;
    text: string;
    sender: "user" | "agent";
    time: string;
}

interface SupportChatProps {
    clientId?: string;
    whatsappNumber?: string;
}

const STORAGE_KEY = 'lumen_support_chat';

export function SupportChat({ clientId, whatsappNumber = "+584120238088" }: SupportChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load messages from localStorage on mount
    useEffect(() => {
        const storageKey = clientId ? `${STORAGE_KEY}_${clientId}` : STORAGE_KEY;
        const savedMessages = localStorage.getItem(storageKey);

        if (savedMessages) {
            try {
                setMessages(JSON.parse(savedMessages));
            } catch {
                initDefaultMessages();
            }
        } else {
            initDefaultMessages();
        }
    }, [clientId]);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            const storageKey = clientId ? `${STORAGE_KEY}_${clientId}` : STORAGE_KEY;
            localStorage.setItem(storageKey, JSON.stringify(messages));
        }
    }, [messages, clientId]);

    const initDefaultMessages = () => {
        setMessages([
            {
                id: "1",
                sender: "agent",
                text: "¡Hola! 👋 Soy Ana, tu ejecutiva de cuenta en Lumen Creativo. ¿En qué puedo ayudarte hoy?",
                time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
            },
        ]);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: "user",
            time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText("");

        // Simulate agent typing
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            const responses = [
                "¡Gracias por tu mensaje! Un miembro del equipo te responderá pronto. 🙌",
                "¡Entendido! Voy a revisar eso y te confirmo en breve. 📝",
                "¡Perfecto! Déjame consultar con el equipo y te aviso. 💡",
                "Recibido. ¿Hay algo más en lo que pueda ayudarte? 😊"
            ];
            const agentResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: responses[Math.floor(Math.random() * responses.length)],
                sender: "agent",
                time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
            };
            setMessages(prev => [...prev, agentResponse]);
        }, 1500);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const openWhatsApp = () => {
        const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
        const message = encodeURIComponent("Hola, soy cliente de Lumen Creativo y tengo una consulta.");
        window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
    };

    return (
        <>
            {/* Chat Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2"
                    >
                        {/* WhatsApp Button */}
                        <Button
                            onClick={openWhatsApp}
                            className="rounded-full w-12 h-12 bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30 flex items-center justify-center transition-all hover:scale-110"
                            title="Abrir WhatsApp"
                        >
                            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                        </Button>

                        {/* Chat Button */}
                        <Button
                            onClick={() => setIsOpen(true)}
                            className="rounded-full w-12 h-12 bg-lumen-priority hover:bg-amber-600 shadow-lg shadow-amber-500/30 flex items-center justify-center transition-all hover:scale-110"
                            title="Abrir chat"
                        >
                            <MessageCircle className="w-6 h-6 text-white" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-lumen-priority to-amber-500 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-amber-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Soporte Lumen</h3>
                                    <p className="text-xs text-white/80">En línea • Respuesta rápida</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={openWhatsApp}
                                    className="text-white hover:bg-white/20 h-8 w-8"
                                    title="Abrir WhatsApp"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsOpen(false)}
                                    className="text-white hover:bg-white/20 h-8 w-8"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${msg.sender === "user"
                                            ? "bg-lumen-priority text-white rounded-br-md"
                                            : "bg-white text-gray-900 shadow-sm border border-gray-100 rounded-bl-md"
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                        <p className={`text-[10px] mt-1 ${msg.sender === "user" ? "text-amber-100" : "text-gray-400"}`}>
                                            {msg.time}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white border-t border-gray-100">
                            <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                                    <Paperclip className="w-4 h-4" />
                                </Button>
                                <input
                                    type="text"
                                    placeholder="Escribe tu mensaje..."
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
                                    className="h-8 w-8 rounded-lg bg-lumen-priority hover:bg-amber-600 text-white disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <button
                                    onClick={openWhatsApp}
                                    className="text-[10px] text-gray-400 hover:text-green-600 transition-colors flex items-center gap-1"
                                >
                                    O contáctanos por WhatsApp →
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
