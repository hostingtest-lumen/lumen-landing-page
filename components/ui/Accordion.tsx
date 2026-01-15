"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
    question: string;
    answer: ReactNode;
    isOpen: boolean;
    onToggle: () => void;
}

function AccordionItem({ question, answer, isOpen, onToggle }: AccordionItemProps) {
    return (
        <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden transition-all hover:bg-gray-50">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-6 text-left"
            >
                <span className="flex items-center gap-3 font-semibold text-lumen-structure">
                    <span className="text-xl">❓</span>
                    {question}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-5 h-5 text-lumen-creative" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="px-6 pb-6 pt-0">
                            <div className="flex items-start gap-3 text-gray-700">
                                <span className="text-green-500 mt-0.5">✅</span>
                                <div>{answer}</div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface AccordionProps {
    items: {
        question: string;
        answer: ReactNode;
    }[];
    defaultOpen?: number;
    className?: string;
}

export function Accordion({ items, defaultOpen = 1, className }: AccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={cn("space-y-4", className)}>
            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    question={item.question}
                    answer={item.answer}
                    isOpen={openIndex === index}
                    onToggle={() => handleToggle(index)}
                />
            ))}
        </div>
    );
}

export default Accordion;
