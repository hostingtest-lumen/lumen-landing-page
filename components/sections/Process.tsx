"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, ArrowDown } from "lucide-react";
import Card from "@/components/ui/Card";
import { Button, buttonVariants } from "@/components/ui/button";

const steps = [
    {
        number: "1",
        title: "CONSULTORÍA INICIAL",
        subtitle: "(30-45 min)",
        description: "Conocemos tu realidad, objetivos y desafíos actuales",
        bullets: ["Sin compromiso", "100% gratuita"],
    },
    {
        number: "2",
        title: "DIAGNÓSTICO PROFESIONAL",
        subtitle: "",
        description: "Analizamos tus redes sociales, competencia y oportunidades",
        deliverable: "Te enviamos reporte visual detallado",
    },
    {
        number: "3",
        title: "PROPUESTA PERSONALIZADA",
        subtitle: "",
        description: "Plan de trabajo adaptado a tu presupuesto y necesidades específicas",
        promise: "Sin sorpresas, todo claro desde el inicio",
    },
    {
        number: "4",
        title: "ACOMPAÑAMIENTO CONTINUO",
        subtitle: "",
        description: "Reuniones mensuales de seguimiento + soporte permanente vía WhatsApp",
        focus: "Ajustamos según resultados medibles",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
};

export default function Process() {
    return (
        <section id="proceso" className="section-padding">
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
                        Así trabajamos:{" "}
                        <span className="text-lumen-creative">simple, claro, efectivo</span>
                    </h2>
                </motion.div>

                {/* Steps */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="max-w-3xl mx-auto space-y-4"
                >
                    {steps.map((step, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <Card variant="secondary" className="p-8 relative">
                                {/* Left accent */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-lumen-creative rounded-l-3xl" />

                                <div className="flex flex-col md:flex-row md:items-start gap-6">
                                    {/* Number */}
                                    <div className="flex-shrink-0">
                                        <span className="text-5xl font-bold text-lumen-energy">
                                            {step.number}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 space-y-3">
                                        <h3 className="text-xl font-bold text-lumen-structure">
                                            {step.title}{" "}
                                            {step.subtitle && (
                                                <span className="font-normal text-gray-500">
                                                    {step.subtitle}
                                                </span>
                                            )}
                                        </h3>

                                        <p className="text-gray-700">{step.description}</p>

                                        {/* Bullets (step 1) */}
                                        {step.bullets && (
                                            <div className="flex flex-wrap gap-4 pt-2">
                                                {step.bullets.map((bullet, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-flex items-center gap-2 text-sm text-green-600"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        {bullet}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Deliverable (step 2) */}
                                        {step.deliverable && (
                                            <p className="text-sm text-lumen-creative font-medium pt-2">
                                                📋 {step.deliverable}
                                            </p>
                                        )}

                                        {/* Promise (step 3) */}
                                        {step.promise && (
                                            <p className="text-sm text-gray-500 italic pt-2">
                                                {step.promise}
                                            </p>
                                        )}

                                        {/* Focus (step 4) */}
                                        {step.focus && (
                                            <p className="text-sm text-lumen-creative font-medium pt-2">
                                                📊 {step.focus}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Card>

                            {/* Arrow between steps */}
                            {index < steps.length - 1 && (
                                <div className="flex justify-center py-2">
                                    <ArrowDown className="w-6 h-6 text-lumen-creative/50" />
                                </div>
                            )}
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
                        Comenzar con paso 1: Agendar consultoría
                        <ArrowRight className="w-5 h-5" />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
