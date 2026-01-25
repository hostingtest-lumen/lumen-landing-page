"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, UserRole } from "@/types/auth";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    switchRole: (role: UserRole) => void;
    updateProfile: (data: Partial<User>) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const checkSession = () => {
            try {
                const sessionData = localStorage.getItem("lumen_session");

                if (sessionData) {
                    const session = JSON.parse(sessionData);

                    // Create user from session
                    setUser({
                        id: "user-" + session.email,
                        name: session.name,
                        email: session.email,
                        role: session.role as UserRole,
                        bio: "",
                        location: "Venezuela",
                        phone: ""
                    });
                } else {
                    setUser(null);

                    // Redirect to login if accessing protected routes
                    if (pathname?.startsWith("/dashboard")) {
                        router.push("/login");
                    }
                }
            } catch (error) {
                console.error("Error checking session:", error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();
    }, [pathname, router]);

    const switchRole = (role: UserRole) => {
        if (!user) return;

        const updatedUser = { ...user, role };
        setUser(updatedUser);

        // Update session
        const sessionData = localStorage.getItem("lumen_session");
        if (sessionData) {
            const session = JSON.parse(sessionData);
            session.role = role;
            localStorage.setItem("lumen_session", JSON.stringify(session));
        }
    };

    const updateProfile = (data: Partial<User>) => {
        if (!user) return;
        setUser({ ...user, ...data });
    };

    const logout = () => {
        localStorage.removeItem("lumen_session");
        localStorage.removeItem("lumen_dev_role");
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated: !!user,
            switchRole,
            updateProfile,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
