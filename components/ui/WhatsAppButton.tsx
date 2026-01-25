"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

const WHATSAPP_NUMBER = "584144141887"; // +58 414 4141887 sin espacios ni símbolos
const DEFAULT_MESSAGE = "¡Hola! 👋 Me interesa conocer más sobre los servicios de Lumen Creativo para mi institución.";

export default function WhatsAppButton() {
    const [showTooltip, setShowTooltip] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setHasScrolled(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Mostrar tooltip después de 3 segundos
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTooltip(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleClick = () => {
        const encodedMessage = encodeURIComponent(DEFAULT_MESSAGE);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
            {/* Tooltip */}
            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9 }}
                        className="bg-white rounded-2xl shadow-xl p-4 max-w-xs border border-gray-100 relative"
                    >
                        <button
                            onClick={() => setShowTooltip(false)}
                            className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-3 h-3 text-gray-400" />
                        </button>
                        <p className="text-sm text-gray-700 pr-4">
                            <span className="font-semibold">¿Tienes dudas?</span>
                            <br />
                            Escríbenos por WhatsApp y te responderemos en minutos.
                        </p>
                        <div className="mt-2 flex items-center gap-1 text-xs text-green-600 font-medium">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            En línea ahora
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15, delay: 0.5 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClick}
                className="relative w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg shadow-green-500/30 flex items-center justify-center transition-colors"
                aria-label="Contactar por WhatsApp"
            >
                <MessageCircle className="w-6 h-6" />

                {/* Pulse animation */}
                <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></span>

                {/* Notification badge */}
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold">
                    1
                </span>
            </motion.button>
        </div>
    );
}
