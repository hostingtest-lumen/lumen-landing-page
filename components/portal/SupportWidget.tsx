"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SupportWidget() {
    const handleContact = () => {
        // Replace with actual support number
        window.open("https://wa.me/1234567890", "_blank");
    };

    return (
        <Button
            onClick={handleContact}
            className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-green-500 hover:bg-green-600 shadow-2xl shadow-green-500/30 flex items-center justify-center z-50 transition-all hover:scale-110"
        >
            <MessageCircle className="w-7 h-7 text-white" />
        </Button>
    );
}
