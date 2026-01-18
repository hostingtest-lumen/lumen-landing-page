"use client";

import Link from "next/link";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-lumen-structure text-white">
            <div className="container-custom py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold">
                            Lumen<span className="text-lumen-energy">Creativo</span>
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Marketing digital con propósito para instituciones católicas
                            y organizaciones que transforman el mundo.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Enlaces</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#servicios" className="text-gray-400 hover:text-lumen-energy transition-colors">
                                    Servicios
                                </Link>
                            </li>
                            <li>
                                <Link href="#proceso" className="text-gray-400 hover:text-lumen-energy transition-colors">
                                    Cómo trabajamos
                                </Link>
                            </li>
                            <li>
                                <Link href="#casos" className="text-gray-400 hover:text-lumen-energy transition-colors">
                                    Casos de éxito
                                </Link>
                            </li>
                            <li>
                                <Link href="#faq" className="text-gray-400 hover:text-lumen-energy transition-colors">
                                    Preguntas frecuentes
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Contacto</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-gray-400">
                                <Mail className="w-5 h-5 text-lumen-creative" />
                                <a href="mailto:lumencreativo.lat@gmail.com" className="hover:text-lumen-energy transition-colors">
                                    lumencreativo.lat@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Phone className="w-5 h-5 text-lumen-creative" />
                                <span>WhatsApp disponible</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <MapPin className="w-5 h-5 text-lumen-creative" />
                                <span>Venezuela</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Síguenos</h4>
                        <div className="flex gap-4">
                            <a
                                href="https://instagram.com/lumencreativo.lat"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-lumen-energy transition-colors"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="https://facebook.com/lumencreativo.lat"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-lumen-energy transition-colors"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-500 text-sm">
                    <p>© {currentYear} Lumen Creativo. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
