"use client";

import { motion } from "framer-motion";
import { CheckCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";
// Importamos dinámicamente o usamos un script simple para evitar errores de hidratación con librerías externas

export default function ThankYouPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <main className="min-h-screen bg-lumen-clarity flex flex-col">
            <Navbar />

            <section className="flex-grow pt-32 pb-20 px-4">
                <div className="container-custom max-w-4xl mx-auto text-center">

                    {/* Success Message */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-12"
                    >
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-cinzel text-lumen-structure mb-4">
                            ¡Mensaje Recibido!
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Gracias por dar el primer paso. Hemos recibido tus datos correctamente y ya están en nuestro sistema.
                        </p>
                    </motion.div>

                    {/* Calendly Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
                    >
                        <div className="p-8 bg-lumen-vision text-white">
                            <h2 className="text-2xl font-bold flex items-center justify-center gap-3">
                                <Calendar className="w-6 h-6" />
                                Agendemos ahora tu sesión de diagnóstico
                            </h2>
                            <p className="text-white/80 mt-2">
                                Selecciona la hora que mejor te convenga para nuestra videollamada de 30 minutos.
                            </p>
                        </div>

                        <div className="h-[700px] w-full relative">
                            {mounted && (
                                <iframe
                                    src="https://calendar.app.google/6YBGLKtoeaN6x2JK8"
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    title="Calendly Scheduling Page"
                                ></iframe>
                            )}
                        </div>
                    </motion.div>

                    <div className="mt-12 text-center">
                        <Link href="/">
                            <Button variant="outline">
                                Volver al inicio
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
