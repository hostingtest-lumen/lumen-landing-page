"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    variant?: "primary" | "secondary" | "flat";
    hover?: boolean;
}

export function Card({
    children,
    className,
    variant = "primary",
    hover = true
}: CardProps) {
    const baseStyles = "rounded-3xl transition-all duration-300";

    const variants = {
        primary: "bg-white shadow-lg shadow-gray-200/50",
        secondary: "bg-white shadow-md shadow-gray-200/40",
        flat: "bg-gradient-to-b from-white to-gray-50/80",
    };

    const hoverStyles = hover ? "hover:shadow-xl hover:shadow-gray-300/60" : "";

    return (
        <motion.div
            className={cn(baseStyles, variants[variant], hoverStyles, className)}
            whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
        >
            {children}
        </motion.div>
    );
}

export default Card;
