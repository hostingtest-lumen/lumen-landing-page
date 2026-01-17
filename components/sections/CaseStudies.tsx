"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Card from "@/components/ui/Card";

const caseStudies = [
    {
        image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&h=600&fit=crop",
        client: "Congregación Religiosa",
        problem: "Redes desactualizadas y sin coherencia visual",
        solution: "Identidad visual completa + estrategia de contenido",
        result: "+40% engagement en 2 meses",
    },
    {
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=600&fit=crop",
        client: "Colegio Católico",
        problem: "No comunicaban propuesta de valor formativa",
        solution: "Rebranding digital + storytelling institucional",
        result: "+15 familias contactaron por Instagram",
    },
    {
        image: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=600&h=600&fit=crop",
        client: "Obra Social / Hospital",
        problem: "Nadie conocía su trabajo de impacto social",
        solution: "Campaña de visibilidad + contenido estratégico",
        result: "Duplicaron donaciones en 3 meses",
    },
];

const testimonial = {
    quote: "Lumen nos ayudó a comunicar con la misma dignidad con la que vivimos nuestra misión",
    author: "Hna. María del Carmen",
    role: "Congregación Santa María",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
};

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

export default function CaseStudies() {
    return (
        <section id="casos" className="section-padding">
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
                        Instituciones que ya{" "}
                        <span className="text-lumen-creative">brillan con propósito</span>
                    </h2>
                </motion.div>

                {/* Case Study Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {caseStudies.map((study, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <Card className="overflow-hidden h-full">
                                {/* Image */}
                                <div className="relative aspect-square">
                                    <Image
                                        src={study.image}
                                        alt={study.client}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-4">
                                    <h3 className="font-bold text-lg text-lumen-structure">
                                        {study.client}
                                    </h3>

                                    <div className="space-y-2 text-sm">
                                        <p>
                                            <span className="font-medium text-gray-500">Problema:</span>{" "}
                                            <span className="text-gray-700">{study.problem}</span>
                                        </p>
                                        <p>
                                            <span className="font-medium text-gray-500">Solución:</span>{" "}
                                            <span className="text-gray-700">{study.solution}</span>
                                        </p>
                                    </div>

                                    <div className="pt-2 border-t border-gray-100">
                                        <p className="font-bold text-lumen-creative">
                                            {study.result}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Testimonial */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-16"
                >
                    <Card className="p-8 md:p-12 bg-lumen-vision/5">
                        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                            {/* Photo */}
                            <div className="flex-shrink-0">
                                <Image
                                    src={testimonial.image}
                                    alt={testimonial.author}
                                    width={80}
                                    height={80}
                                    className="rounded-full object-cover"
                                />
                            </div>

                            {/* Quote */}
                            <div className="flex-1">
                                <blockquote className="text-xl md:text-2xl text-lumen-structure italic font-medium mb-4">
                                    &ldquo;{testimonial.quote}&rdquo;
                                </blockquote>
                                <p className="text-gray-600">
                                    <span className="font-semibold">{testimonial.author}</span>
                                    {" — "}
                                    <span>{testimonial.role}</span>
                                </p>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}
