"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const trustBadges = [
    "Respuesta en menos de 24 horas",
    "Diagnóstico visual de tus redes incluido",
    "Propuesta personalizada según tu presupuesto",
];

export default function CtaFinal() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const [isSubmitted, setIsSubmitted] = useState(false); // Ya no se usa estado local, redirigimos
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        whatsapp: "",
        instagram: "",
        institucion: "",
        necesidad: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/create-lead", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.details
                    ? JSON.stringify(data.details)
                    : (data.error || "Error al enviar formulario");
                throw new Error(errorMessage);
            }

            // ÉXITO: Redirigir a la página de gracias
            router.push("/gracias");

        } catch (error: any) {
            console.error("Error enviando formulario:", error);
            alert(`Error del sistema: ${error.message}`);
            setIsSubmitting(false); // Solo bajamos el loading si hubo error
        }
        // No bajamos loading en éxito porque la página va a cambiar
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <section id="contacto" className="section-padding bg-gradient-to-b from-lumen-clarity to-white">
            <div className="container-custom">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-lumen-structure mb-6">
                        Tu obra merece comunicar con la{" "}
                        <span className="text-lumen-creative">misma claridad</span>
                        <br className="hidden md:block" />
                        con la que vive su misión
                    </h2>
                    <div className="text-lg text-gray-600 max-w-2xl mx-auto space-y-2">
                        <p>Agenda 30 minutos con nosotros.</p>
                        <p className="text-base">
                            Sin compromiso. Sin letra pequeña. Sin sorpresas.
                            <br />
                            Solo una conversación honesta sobre cómo podemos ayudarte.
                        </p>
                    </div>
                </motion.div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="max-w-2xl mx-auto"
                >
                    <Card className="p-8 md:p-12 shadow-2xl">
                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Nombre */}
                            <div>
                                <label
                                    htmlFor="nombre"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Nombre completo *
                                </label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    required
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-lumen-creative focus:outline-none transition-colors"
                                    placeholder="Tu nombre"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Email institucional *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-lumen-creative focus:outline-none transition-colors"
                                    placeholder="correo@institucion.org"
                                />
                            </div>

                            {/* WhatsApp */}
                            <div>
                                <label
                                    htmlFor="whatsapp"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    WhatsApp *
                                </label>
                                <input
                                    type="tel"
                                    id="whatsapp"
                                    name="whatsapp"
                                    required
                                    value={formData.whatsapp}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-lumen-creative focus:outline-none transition-colors"
                                    placeholder="+58 412 1234567"
                                />
                            </div>

                            {/* Instagram (New) */}
                            <div>
                                <label
                                    htmlFor="instagram"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Instagram (opcional)
                                </label>
                                <input
                                    type="text"
                                    id="instagram"
                                    name="instagram"
                                    value={formData.instagram}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-lumen-creative focus:outline-none transition-colors"
                                    placeholder="@usuario"
                                />
                            </div>

                            {/* Institución y cargo */}
                            <div>
                                <label
                                    htmlFor="institucion"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Institución y cargo *
                                </label>
                                <input
                                    type="text"
                                    id="institucion"
                                    name="institucion"
                                    required
                                    value={formData.institucion}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-lumen-creative focus:outline-none transition-colors"
                                    placeholder="Ej: Congregación San José - Directora de Comunicaciones"
                                />
                            </div>

                            {/* Necesidad */}
                            <div>
                                <label
                                    htmlFor="necesidad"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    ¿Qué necesitas mejorar en tu comunicación? *
                                </label>
                                <textarea
                                    id="necesidad"
                                    name="necesidad"
                                    required
                                    rows={3}
                                    value={formData.necesidad}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-lumen-creative focus:outline-none transition-colors resize-none"
                                    placeholder="Cuéntanos brevemente tu situación actual..."
                                />
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                size="xl"
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        Agendar mi consultoría gratuita
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </Card>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto"
                >
                    {trustBadges.map((badge, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-center gap-2 text-sm text-gray-600"
                        >
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {badge}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
