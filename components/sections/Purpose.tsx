"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const Purpose = () => {
    return (
        <section className="py-24 bg-white">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-lumen-dark mb-6">
                            Una Catedral Digital para la Evangelización
                        </h2>
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                            No somos solo una agencia; somos arquitectos digitales que entienden que la belleza y el orden son caminos hacia la trascendencia.
                        </p>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Unimos la **profesionalidad tecnológica** del mundo moderno con la **profundidad** de la misión católica, creando espacios que invitan al encuentro.
                        </p>

                        <ul className="space-y-4">
                            {[
                                "Diseño que respira (Sacred Minimalism)",
                                "Tecnología al servicio de la misión",
                                "Estrategias que respetan la dignidad humana"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-lumen-black font-medium">
                                    <CheckCircle2 className="text-lumen-main w-6 h-6" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Visual Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="relative h-[500px] bg-lumen-light rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center p-8 group"
                    >
                        {/* Placeholder for "Digital Cathedral" Concept Image */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-lumen-dark/10 to-transparent" />
                        <div className="text-center p-8 border border-lumen-main/20 rounded-xl bg-white/50 backdrop-blur-sm z-10 transition-transform group-hover:-translate-y-2 duration-500">
                            <span className="text-4xl mb-4 block">🏛️</span>
                            <h3 className="font-serif text-xl font-bold text-lumen-dark mb-2">Construimos Puentes</h3>
                            <p className="text-sm text-gray-600">Entre la Fe y la Cultura Digital</p>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default Purpose;
