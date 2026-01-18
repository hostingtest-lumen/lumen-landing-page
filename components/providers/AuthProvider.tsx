"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types/auth";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    switchRole: (role: UserRole) => void;
    updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USER: User = {
    id: "u-001",
    name: "Kevin Flores",
    email: "kevin@lumencreativo.com",
    role: "admin",
    bio: "Fundador y Líder de Visión en Lumen Creativo.",
    location: "Buenos Aires, Argentina",
    phone: "+54 9 11 1234 5678"
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load from localStorage or use default
        const storedRole = localStorage.getItem("lumen_dev_role") as UserRole;
        if (storedRole) {
            setUser({ ...DEFAULT_USER, role: storedRole });
        } else {
            setUser(DEFAULT_USER);
        }
        setIsLoading(false);
    }, []);

    const switchRole = (role: UserRole) => {
        if (!user) return;
        const updatedUser = { ...user, role };
        setUser(updatedUser);
        localStorage.setItem("lumen_dev_role", role);
    };

    const updateProfile = (data: Partial<User>) => {
        if (!user) return;
        setUser({ ...user, ...data });
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, switchRole, updateProfile }}>
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
