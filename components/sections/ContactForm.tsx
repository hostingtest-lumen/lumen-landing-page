"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const ContactForm = () => {
    return (
        <section id="contacto" className="py-24 bg-white">
            <div className="container px-4 md:px-6 mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-lumen-light rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100"
                >
                    <div className="text-center mb-10">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-lumen-dark mb-4">
                            Comienza tu Transformación Digital
                        </h2>
                        <p className="text-gray-600">
                            Agenda una consultoría gratuita de 30 minutos para analizar tu presencia digital actual.
                        </p>
                    </div>

                    <form className="space-y-6 max-w-lg mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-lumen-dark">Nombre</label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Tu nombre"
                                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-lumen-main focus:ring-1 focus:ring-lumen-main outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-lumen-dark">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="nombre@ejemplo.com"
                                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-lumen-main focus:ring-1 focus:ring-lumen-main outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="org" className="text-sm font-medium text-lumen-dark">Institución / Organización</label>
                            <input
                                id="org"
                                type="text"
                                placeholder="Nombre de la institución"
                                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-lumen-main focus:ring-1 focus:ring-lumen-main outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium text-lumen-dark">Mensaje (Opcional)</label>
                            <textarea
                                id="message"
                                placeholder="Cuéntanos brevemente sobre tu proyecto o necesidades..."
                                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-lumen-main focus:ring-1 focus:ring-lumen-main outline-none transition-all min-h-[120px]"
                            />
                        </div>

                        <Button size="lg" className="w-full text-lg">
                            Agendar Auditoría
                        </Button>

                        <p className="text-center text-xs text-gray-500 mt-4">
                            Tus datos están protegidos. Responderemos en menos de 24 horas.
                        </p>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

export default ContactForm;
