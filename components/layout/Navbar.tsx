"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

const navLinks = [
    { name: "Inicio", href: "#hero" },
    { name: "Servicios", href: "#servicios" },
    { name: "Proceso", href: "#proceso" },
    { name: "Casos", href: "#casos" },
    { name: "FAQ", href: "#faq" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-white/95 backdrop-blur-md shadow-lg"
                : "bg-transparent"
                }`}
        >
            <div className="container-custom">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <a href="#hero" className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-lumen-structure">
                            Lumen<span className="text-lumen-energy">Creativo</span>
                        </span>
                    </a>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-lumen-structure/80 hover:text-lumen-creative font-medium transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                        <a href="#contacto" className={buttonVariants({ size: "default" })}>
                            Agendar consultoría
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6 text-lumen-structure" />
                        ) : (
                            <Menu className="w-6 h-6 text-lumen-structure" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 pb-6"
                    >
                        <div className="flex flex-col gap-4 pt-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-lumen-structure/80 hover:text-lumen-creative font-medium px-4 py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="px-4 pt-2">
                                <a
                                    href="#contacto"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={buttonVariants({ className: "w-full" })}
                                >
                                    Agendar consultoría
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.nav>
    );
}
