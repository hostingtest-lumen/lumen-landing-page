"use client";

import { NotificationCenter } from "@/components/portal/NotificationCenter";

export function PortalHeader() {
    return (
        <header className="border-b border-gray-100 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-sm">L</span>
                    </div>
                    <div>
                        <span className="font-bold text-gray-900 tracking-tight text-lg">LUMEN</span>
                        <span className="text-gray-400 font-medium ml-1.5 text-sm">Portal</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Notification Center */}
                    <NotificationCenter />

                    {/* Version Badge */}
                    <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        v3.1.0
                    </div>
                </div>
            </div>
        </header>
    );
}
