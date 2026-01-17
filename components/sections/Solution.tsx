"use client";

import { motion } from "framer-motion";
import { Target, Palette, MessageCircle, ArrowRight } from "lucide-react";
import Card from "@/components/ui/Card";
import { Button, buttonVariants } from "@/components/ui/button";

const pillars = [
    {
        icon: Target,
        title: "ESTRATEGIA",
        description: "Diagnóstico → Identidad → Contenido → Medición",
        detail: "Creamos un proceso claro y medible adaptado a tu realidad",
    },
    {
        icon: Palette,
        title: "DISEÑO PROFESIONAL",
        description: "Identidad visual coherente que refleja tu carisma institucional",
        detail: "No es solo \"bonito\", es funcional y con propósito",
    },
    {
        icon: MessageCircle,
        title: "LENGUAJE PASTORAL",
        description: "Hablamos tu idioma: vocaciones, misión, carisma, pastoral",
        detail: "Traducimos valores profundos a formatos digitales contemporáneos",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

export default function Solution() {
    return (
        <section className="section-padding">
            <div className="container-custom">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-lumen-structure mb-4">
                        La comunicación con propósito{" "}
                        <span className="text-lumen-creative">no es accidente</span>, es estrategia
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        En Lumen Creativo combinamos tres pilares fundamentales:
                    </p>
                </motion.div>

                {/* Pillars Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {pillars.map((pillar, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <Card variant="flat" className="p-10 h-full text-center">
                                <div className="flex flex-col items-center gap-6">
                                    {/* Icon */}
                                    <div className="w-16 h-16 rounded-2xl bg-lumen-creative/10 flex items-center justify-center">
                                        <pillar.icon className="w-8 h-8 text-lumen-creative" />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-lumen-structure">
                                        {pillar.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-700 leading-relaxed">
                                        {pillar.description}
                                    </p>

                                    {/* Detail */}
                                    <p className="text-sm text-gray-500 italic">
                                        {pillar.detail}
                                    </p>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <a href="#contacto" className={buttonVariants({ size: "lg" })}>
                        Agendar diagnóstico gratuito
                        <ArrowRight className="w-5 h-5" />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
