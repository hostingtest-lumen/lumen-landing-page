import fs from 'fs';
import path from 'path';

// Base directory for data storage
const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const db = {
    read: <T>(filename: string): T[] => {
        const filePath = path.join(DATA_DIR, `${filename}.json`);
        if (!fs.existsSync(filePath)) {
            return [];
        }
        try {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(fileContent);
        } catch (error) {
            console.error(`Error reading ${filename}.json:`, error);
            return [];
        }
    },

    write: <T>(filename: string, data: T[]): void => {
        const filePath = path.join(DATA_DIR, `${filename}.json`);
        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(`Error writing ${filename}.json:`, error);
        }
    },

    update: <T extends { id: string }>(filename: string, item: T): T => {
        const items = db.read<T>(filename);
        const index = items.findIndex((i) => i.id === item.id);

        if (index >= 0) {
            items[index] = { ...items[index], ...item };
        } else {
            items.push(item);
        }

        db.write(filename, items);
        return item;
    },

    delete: <T extends { id: string }>(filename: string, id: string): void => {
        const items = db.read<T>(filename);
        const filtered = items.filter((i) => i.id !== id);
        db.write(filename, filtered);
    }
};
