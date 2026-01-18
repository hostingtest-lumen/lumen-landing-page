import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        // 1. Get Loaded Env Var
        const loadedSecret = process.env.ERPNEXT_API_SECRET;

        // 2. Read File Env Var
        const envPath = path.join(process.cwd(), '.env.local');
        let fileSecret = 'File not found';

        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf-8');
            const match = content.match(/ERPNEXT_API_SECRET=(.*)/);
            if (match) fileSecret = match[1].trim();
        }

        const isMatch = loadedSecret === fileSecret;

        // 3. Test Connection with LOADED creds
        let apiStatus = "Not Tested";
        let apiError = null;
        if (process.env.ERPNEXT_URL) {
            try {
                const res = await fetch(`${process.env.ERPNEXT_URL}/api/method/frappe.auth.get_logged_user`, {
                    headers: {
                        'Authorization': `token ${process.env.ERPNEXT_API_KEY}:${loadedSecret}`
                    }
                });
                apiStatus = res.status === 200 ? "Connected OK" : `Error ${res.status}`;
                if (!res.ok) apiError = await res.text();
            } catch (e: any) {
                apiStatus = "Connection Failed";
                apiError = e.message;
            }
        }

        return NextResponse.json({
            status: "Diagnostic Report",
            environment_loaded: {
                secret_start: loadedSecret ? loadedSecret.substring(0, 5) + '...' : 'null',
                is_correct: loadedSecret?.startsWith('5a29') // Based on user input
            },
            file_on_disk: {
                secret_start: fileSecret.substring(0, 5) + '...',
                is_correct: fileSecret.startsWith('5a29')
            },
            conclusion: isMatch ? "Environment is SYNCED." : "⚠️ RESTART REQUIRED: Loaded env differs from file.",
            connection_test_with_loaded_creds: {
                status: apiStatus,
                error: apiError
            }
        });

    } catch (e: any) {
        return NextResponse.json({ error: e.message });
    }
}
