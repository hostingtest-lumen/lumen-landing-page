import fs from 'fs';
import path from 'path';

export function getEnv() {
    // 1. Try process.env first (Production / Docker optimized)
    let env = {
        ERPNEXT_URL: process.env.ERPNEXT_URL,
        ERPNEXT_API_KEY: process.env.ERPNEXT_API_KEY,
        ERPNEXT_API_SECRET: process.env.ERPNEXT_API_SECRET,
        TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
        TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID
    };

    // 2. If Dev mode (or explicitly requested), try read file to get LATEST changes
    if (process.env.NODE_ENV === 'development' || !env.ERPNEXT_API_SECRET) {
        try {
            const envPath = path.join(process.cwd(), '.env.local');
            if (fs.existsSync(envPath)) {
                const content = fs.readFileSync(envPath, 'utf-8');
                content.split('\n').forEach(line => {
                    const parts = line.split('=');
                    if (parts.length >= 2) {
                        const key = parts[0].trim();
                        const val = parts.slice(1).join('=').trim();
                        if (key in env) {
                            (env as any)[key] = val; // Override
                        }
                    }
                });
            }
        } catch (e) {
            console.warn("Failed to read .env.local", e);
        }
    }

    return env;
}
