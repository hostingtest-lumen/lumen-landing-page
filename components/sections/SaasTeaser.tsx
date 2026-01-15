"use client";

import { motion } from "framer-motion";
import { Calendar, BarChart3, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const SaasTeaser = () => {
    return (
        <section className="py-24 bg-lumen-dark text-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lumen-main/10 rounded-full blur-[100px]" />
            </div>

            <div className="container relative z-10 px-4 md:px-6 mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lumen-main/20 text-lumen-energy text-xs font-bold uppercase tracking-wider mb-6">
                            <Lock size={12} /> Próximamente
                        </div>
                        <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 text-white">
                            Lumen SaaS: El Sustrato Tecnológico
                        </h2>
                        <p className="text-lumen-light/80 text-lg mb-8 leading-relaxed">
                            Estamos desarrollando herramientas específicas para la Iglesia. Gestiona tu calendario litúrgico y mide el impacto real de tu evangelización digital desde una sola plataforma.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 mb-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/10 rounded-lg">
                                    <Calendar className="text-lumen-energy" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Liturgia Sync</h4>
                                    <p className="text-sm text-gray-400">Automatización de contenidos basada en el calendario litúrgico.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/10 rounded-lg">
                                    <BarChart3 className="text-lumen-energy" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Impacto Real</h4>
                                    <p className="text-sm text-gray-400">Métricas avanzadas de conversión y alcance pastoral.</p>
                                </div>
                            </div>
                        </div>

                        <Button variant="outline" className="border-lumen-energy text-lumen-energy hover:bg-lumen-energy hover:text-white transition-all">
                            Notificarme del Lanzamiento
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2"
                    >
                        <div className="relative bg-gradient-to-br from-white/10 to-transparent p-1 rounded-2xl border border-white/20">
                            <div className="bg-lumen-black/80 backdrop-blur-md rounded-xl p-8 aspect-video flex items-center justify-center border border-white/5">
                                <div className="text-center">
                                    <span className="text-6xl mb-4 block">🚀</span>
                                    <p className="text-gray-400 text-sm uppercase tracking-widest">Dashboard Preview</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default SaasTeaser;
