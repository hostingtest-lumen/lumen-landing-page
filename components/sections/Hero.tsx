"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ArrowRight, Check, Play, Sparkles, Star, Users, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Carousel from "@/components/ui/Carousel";
import { useEffect, useState } from "react";

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
    { text: "Especializados en lenguaje pastoral y eclesial", icon: Sparkles },
    { text: "+15 instituciones católicas confían en nosotros", icon: Users },
    { text: "Diagnóstico profesional sin compromiso", icon: Zap },
];

// Animated counter component
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [target]);

    return <span>{count}{suffix}</span>;
}

export default function Hero() {
    return (
        <section id="hero" className="relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-lumen-clarity via-white to-amber-50/30" />

            {/* Decorative elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />

            {/* Floating shapes */}
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-32 right-1/4 w-16 h-16 border-2 border-amber-300/30 rounded-2xl"
            />
            <motion.div
                animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-40 left-1/4 w-12 h-12 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full"
            />

            <div className="relative section-padding pt-32 lg:pt-40">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left: Text Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium border border-amber-200/50"
                            >
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                Agencia especializada en marketing pastoral
                            </motion.div>

                            {/* Main Headline */}
                            <h1 className="text-lumen-structure text-balance">
                                La comunicación de tu obra merece más que{" "}
                                <span className="relative">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-lumen-creative to-amber-500">
                                        posts bonitos
                                    </span>
                                    <motion.span
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ delay: 0.8, duration: 0.6 }}
                                        className="absolute -bottom-2 left-0 right-0 h-3 bg-amber-200/40 -z-10 rounded"
                                    />
                                </span>
                            </h1>

                            {/* Subheadline */}
                            <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                                Transformamos la presencia digital de instituciones católicas
                                con <span className="font-semibold text-gray-800">estrategia</span>,
                                <span className="font-semibold text-gray-800"> coherencia</span> y
                                <span className="font-semibold text-gray-800"> sentido profundo</span>.
                            </p>

                            {/* Trust Bullets with icons */}
                            <ul className="space-y-4">
                                {trustBullets.map((bullet, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + index * 0.1 }}
                                        className="flex items-center gap-3 text-gray-700"
                                    >
                                        <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center shadow-sm">
                                            <bullet.icon className="w-5 h-5 text-green-600" />
                                        </span>
                                        <span className="font-medium">{bullet.text}</span>
                                    </motion.li>
                                ))}
                            </ul>

                            {/* CTAs */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="flex flex-col sm:flex-row gap-4 pt-4"
                            >
                                <a
                                    href="#contacto"
                                    className={`${buttonVariants({ size: "lg" })} group shadow-lg shadow-lumen-priority/20 hover:shadow-xl hover:shadow-lumen-priority/30 transition-shadow`}
                                >
                                    Agendar consultoría gratuita
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </a>
                                <a
                                    href="#casos"
                                    className="inline-flex items-center gap-2 px-6 py-3 text-gray-700 font-medium hover:text-lumen-priority transition-colors"
                                >
                                    <span className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                        <Play className="w-4 h-4 ml-0.5" />
                                    </span>
                                    Ver casos de éxito
                                </a>
                            </motion.div>
                        </motion.div>

                        {/* Right: Carousel with stats overlay */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <Carousel
                                images={heroImages}
                                autoPlay={true}
                                interval={4000}
                                className="shadow-2xl shadow-gray-300/50"
                            />

                            {/* Floating stats card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 }}
                                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">
                                            <AnimatedCounter target={15} suffix="+" />
                                        </p>
                                        <p className="text-xs text-gray-500 font-medium">Clientes activos</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating rating card */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.4 }}
                                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-3 border border-gray-100"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">5.0</span>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1">Satisfacción garantizada</p>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Social proof bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="mt-20 pt-10 border-t border-gray-200/50"
                    >
                        <p className="text-center text-sm text-gray-500 mb-6 font-medium">
                            Confían en nosotros instituciones en toda Venezuela
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                            {['Arquidiócesis', 'Colegios Católicos', 'Fundaciones', 'Parroquias', 'Seminarios'].map((name, i) => (
                                <div key={i} className="text-gray-700 font-semibold text-lg">
                                    {name}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
