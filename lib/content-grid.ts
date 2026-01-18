import { ContentGridItem, MOCK_GRID_ITEMS } from "@/types/content-grid";

const STORAGE_KEY = 'lumen_content_grid_v1';

export const contentGridService = {
    getAll: (): ContentGridItem[] => {
        if (typeof window === 'undefined') return MOCK_GRID_ITEMS;
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : MOCK_GRID_ITEMS;
        } catch (e) {
            return MOCK_GRID_ITEMS;
        }
    },

    getByClientId: (clientId: string): ContentGridItem[] => {
        const all = contentGridService.getAll();
        return all.filter(item => item.clientId === clientId);
    },

    add: (item: ContentGridItem) => {
        const all = contentGridService.getAll();
        const updated = [item, ...all];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },

    update: (id: string, updates: Partial<ContentGridItem>) => {
        const all = contentGridService.getAll();
        const updated = all.map(item => item.id === id ? { ...item, ...updates } : item);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },

    delete: (id: string) => {
        const all = contentGridService.getAll();
        const updated = all.filter(item => item.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },

    createId: (): string => {
        return 'grid-' + Math.random().toString(36).substr(2, 9);
    }
};
