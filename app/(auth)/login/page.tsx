"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/Card";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/dashboard"); // Redirect to new dashboard root
                router.refresh();
            } else {
                setError("Usuario o contraseña incorrectos");
                setIsLoading(false);
            }
        } catch (err) {
            setError("Error de conexión");
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen grid place-items-center bg-lumen-clarity p-4 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-lumen-creative rounded-full blur-3xl translate-x-[-50%] translate-y-[-50%]" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-lumen-structure rounded-full blur-3xl translate-x-[50%] translate-y-[50%]" />
            </div>

            <Card className="w-full max-w-md p-8 shadow-2xl relative z-10 glass-panel">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-lumen-creative to-lumen-structure rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg text-white">
                        <User className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-lumen-structure">Lumen OS</h1>
                    <p className="text-gray-500">Acceso al Sistema Operativo</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Usuario (ej. KevinLumen)"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-lumen-creative focus:outline-none transition-colors bg-gray-50/50"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-lumen-creative focus:outline-none transition-colors bg-gray-50/50"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg animate-in fade-in slide-in-from-top-1">
                            {error}
                        </p>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-lumen-structure hover:bg-lumen-structure/90 h-12 text-lg shadow-lg shadow-lumen-structure/20"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Iniciar Sesión
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                        )}
                    </Button>
                </form>
            </Card>
        </main>
    );
}
