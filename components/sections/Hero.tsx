"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Carousel from "@/components/ui/Carousel";

// Placeholder images from Unsplash
const heroImages = [
    {
        src: "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800&h=600&fit=crop",
        alt: "Iglesia moderna con vitral",
    },
    {
        src: "https://images.unsplash.com/photo-1516997121675-4c2d1684aa7e?w=800&h=600&fit=crop",
        alt: "Diseño gráfico profesional",
    },
    {
        src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
        alt: "Equipo trabajando juntos",
    },
    {
        src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
        alt: "Reunión estratégica de marketing",
    },
];

const trustBullets = [
    "Especializados en lenguaje pastoral y eclesial",
    "+15 instituciones católicas confían en nosotros",
    "Diagnóstico profesional sin compromiso",
];

export default function Hero() {
    return (
        <section id="hero" className="section-padding pt-32 lg:pt-40">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        {/* Main Headline */}
                        <h1 className="text-lumen-structure text-balance">
                            La comunicación de tu obra merece más que{" "}
                            <span className="text-lumen-creative">posts bonitos</span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                            Transformamos la presencia digital de instituciones católicas
                            con estrategia, coherencia y sentido profundo.
                        </p>

                        {/* Trust Bullets */}
                        <ul className="space-y-3">
                            {trustBullets.map((bullet, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="flex items-center gap-3 text-gray-700"
                                >
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-green-600" />
                                    </span>
                                    {bullet}
                                </motion.li>
                            ))}
                        </ul>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4 pt-4"
                        >
                            <a href="#contacto" className={buttonVariants({ size: "lg" })}>
                                Agendar consultoría gratuita
                                <ArrowRight className="w-5 h-5" />
                            </a>
                            <a href="#casos" className={buttonVariants({ variant: "link", size: "lg" })}>
                                Ver casos de éxito
                            </a>
                        </motion.div>
                    </motion.div>

                    {/* Right: Carousel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <Carousel
                            images={heroImages}
                            autoPlay={true}
                            interval={4000}
                            className="shadow-2xl shadow-gray-300/50"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
