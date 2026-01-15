"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center bg-lumen-light overflow-hidden pt-20">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0 opacity-30">
                <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-lumen-main/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-lumen-energy/10 rounded-full blur-3xl" />
            </div>

            <div className="container relative z-10 px-4 md:px-6 text-center max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-lumen-main/10 text-lumen-main text-sm font-semibold mb-6">
                        Lumen Creativo 💡
                    </span>
                    <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-lumen-dark leading-tight mb-6">
                        Iluminamos los proyectos que <br className="hidden md:block" /> transforman el mundo
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Marketing digital de alta gama con esencia católica para instituciones, congregaciones y causas con propósito.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button size="lg" className="group text-lg">
                            Iniciar Consultoría Gratuita
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="outline" size="lg" className="text-lg">
                            Ver Nuestros Servicios
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
