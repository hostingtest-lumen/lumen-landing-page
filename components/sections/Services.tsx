"use client";

import { motion } from "framer-motion";

import { Monitor, PenTool, Users, Zap } from "lucide-react";

const services = [
    {
        icon: Users,
        title: "Estrategia de Redes",
        description: "Gestión comunitaria y contenido de valor para conectar con tu audiencia real."
    },
    {
        icon: Monitor,
        title: "Diseño Web Next.js",
        description: "Sitios web ultrarrápidos, optimizados para SEO y con estética premium."
    },
    {
        icon: PenTool,
        title: "Branding Institucional",
        description: "Identidad visual coherente que transmite los valores de tu institución."
    },
    {
        icon: Zap,
        title: "Automatización n8n",
        description: "Optimizamos tus flujos de trabajo e integaciones para ahorrar tiempo vital."
    }
];

const Services = () => {
    return (
        <section id="servicios" className="py-24 bg-lumen-light">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="font-serif text-3xl md:text-5xl font-bold text-lumen-dark mb-4">
                        Nuestros Servicios
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Soluciones integrales para potenciar tu presencia digital.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-transparent hover:border-lumen-main/20 group"
                        >
                            <div className="w-12 h-12 bg-lumen-light text-lumen-main rounded-lg flex items-center justify-center mb-6 group-hover:bg-lumen-main group-hover:text-white transition-colors duration-300">
                                <service.icon size={24} />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-lumen-dark mb-3">
                                {service.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
