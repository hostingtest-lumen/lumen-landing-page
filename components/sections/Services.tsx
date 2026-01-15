"use client";

import { motion } from "framer-motion";
import {
    Smartphone,
    Palette,
    PenTool,
    BarChart3,
    Video,
    ArrowRight
} from "lucide-react";
import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/button";

const services = [
    {
        icon: Smartphone,
        title: "Gestión de Redes Sociales",
        description: "Contenido estratégico + diseño profesional + community management",
        detail: "Instagram, Facebook, TikTok adaptado a tu identidad",
    },
    {
        icon: Palette,
        title: "Identidad Visual",
        description: "Logo, paleta de colores, tipografías y sistema visual completo",
        detail: "Que refleja fielmente tu carisma institucional",
    },
    {
        icon: PenTool,
        title: "Estrategia de Contenido",
        description: "Calendario editorial + storytelling + llamados a la acción",
        detail: "Mensajes con propósito, no solo publicaciones",
    },
    {
        icon: BarChart3,
        title: "Reportes y Optimización",
        description: "Métricas claras y comprensibles + ajustes basados en datos reales",
        detail: "Transparencia total en resultados",
    },
    {
        icon: Video,
        title: "Producción Audiovisual",
        description: "Reels, videos institucionales, cobertura de eventos especiales",
        detail: "Calidad profesional adaptada a presupuesto",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function Services() {
    return (
        <section id="servicios" className="section-padding">
            <div className="container-custom">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-lumen-structure">
                        Lo que podemos hacer{" "}
                        <span className="text-lumen-creative">por tu obra</span>
                    </h2>
                </motion.div>

                {/* Services Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {services.map((service, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <Card variant="flat" className="p-8 h-full">
                                <div className="space-y-4">
                                    {/* Icon */}
                                    <div className="w-12 h-12 rounded-xl bg-lumen-creative/10 flex items-center justify-center">
                                        <service.icon className="w-6 h-6 text-lumen-creative" />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-lumen-structure">
                                        {service.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-700">{service.description}</p>

                                    {/* Detail */}
                                    <p className="text-sm text-gray-500 italic">
                                        {service.detail}
                                    </p>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Disclaimer + CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-12 space-y-6"
                >
                    <p className="text-sm text-gray-600 italic">
                        * Cada propuesta se personaliza según tu presupuesto y necesidades
                    </p>
                    <Button size="lg">
                        Hablar sobre mi caso específico
                        <ArrowRight className="w-5 h-5" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
