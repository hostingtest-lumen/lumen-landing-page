"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import Card from "@/components/ui/Card";

const problems = [
    "Publicamos contenido, pero no vemos resultados reales",
    "Todo se ve improvisado y sin coherencia visual",
    "No sabemos si llegamos a las personas correctas",
    "No tenemos tiempo ni equipo dedicado para esto",
    "Nuestra identidad se pierde entre tanto ruido digital",
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

export default function Problem() {
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
                    <h2 className="text-lumen-structure mb-6">
                        ¿Tu comunicación digital refleja{" "}
                        <span className="text-lumen-creative">quiénes son realmente</span>?
                    </h2>
                </motion.div>

                {/* Problem Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {problems.map((problem, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <Card className="p-8 h-full">
                                <div className="flex items-start gap-4">
                                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                        <X className="w-5 h-5 text-red-500" />
                                    </span>
                                    <p className="text-lg text-gray-700 leading-relaxed">
                                        {problem}
                                    </p>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Empathy Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-16 space-y-2"
                >
                    <p className="text-xl text-lumen-structure font-medium">
                        Si te identificas con esto, no estás solo/a.
                    </p>
                    <p className="text-gray-600">
                        El 80% de instituciones católicas enfrentan los mismos desafíos.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
