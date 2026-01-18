"use client";

import { Client, SEED_CLIENTS } from "@/types/clients";

const STORAGE_KEY = 'lumen_clients_v1';

// Client Service with localStorage persistence (MVP)
// Will be replaced with API calls in production
export const clientService = {
    getAll: (): Client[] => {
        if (typeof window === 'undefined') return SEED_CLIENTS;
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) {
                // Initialize with seed data
                localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CLIENTS));
                return SEED_CLIENTS;
            }
            return JSON.parse(stored);
        } catch (e) {
            console.error("Error reading clients", e);
            return SEED_CLIENTS;
        }
    },

    getById: (id: string): Client | undefined => {
        const all = clientService.getAll();
        return all.find(c => c.id === id);
    },

    getByToken: (token: string): Client | undefined => {
        const all = clientService.getAll();
        return all.find(c => c.token === token);
    },

    add: (client: Client): void => {
        const all = clientService.getAll();
        const updated = [client, ...all];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },

    // Sync from API (call after creating via API)
    syncFromAPI: async (): Promise<Client[]> => {
        try {
            const res = await fetch('/api/clients');
            if (res.ok) {
                const data = await res.json();
                const clients = data.clients || [];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
                return clients;
            }
        } catch (e) {
            console.error("Failed to sync clients from API", e);
        }
        return clientService.getAll();
    }
};
