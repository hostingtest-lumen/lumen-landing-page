"use client";

import { motion } from "framer-motion";
import Accordion from "@/components/ui/Accordion";

const faqItems = [
    {
        question: "¿Entienden el lenguaje pastoral y eclesial?",
        answer: (
            <>
                Es nuestra especialización. Trabajamos exclusivamente con instituciones
                católicas y conocemos profundamente el lenguaje vocacional, litúrgico,
                pastoral y de vida consagrada.
            </>
        ),
    },
    {
        question: "¿Cuánto cuesta trabajar con Lumen Creativo?",
        answer: (
            <>
                Depende de tus necesidades específicas. Tenemos opciones desde $150/mes
                hasta servicios premium. En la consultoría gratuita definimos juntos qué
                se ajusta a tu presupuesto y realidad.
            </>
        ),
    },
    {
        question: "¿Qué pasa si la propuesta no me convence?",
        answer: (
            <>
                La consultoría es 100% sin compromiso. Si decides no continuar, no hay
                problema. Igual te enviaremos el diagnóstico visual de tus redes como
                regalo, sin costo alguno.
            </>
        ),
    },
    {
        question: "¿Trabajan solo con cuentas grandes?",
        answer: (
            <>
                No. Acompañamos desde pequeñas congregaciones hasta colegios grandes.
                Lo importante no es el tamaño, sino el propósito y el compromiso con
                una comunicación coherente.
            </>
        ),
    },
    {
        question: "¿Cuánto tiempo toma ver resultados?",
        answer: (
            <>
                Los primeros cambios visuales en 2 semanas. Impacto medible en engagement
                y alcance: 1-2 meses. Transformación completa de presencia digital: 3-6
                meses. Todo depende del punto de partida.
            </>
        ),
    },
];

export default function FAQ() {
    return (
        <section id="faq" className="section-padding">
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
                        Preguntas <span className="text-lumen-creative">frecuentes</span>
                    </h2>
                </motion.div>

                {/* Accordion */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="max-w-3xl mx-auto"
                >
                    <Accordion items={faqItems} defaultOpen={1} />
                </motion.div>
            </div>
        </section>
    );
}
