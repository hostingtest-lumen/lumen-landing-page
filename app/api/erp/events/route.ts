import { NextResponse } from "next/server";
import { getEnv } from "@/lib/env-loader";

export async function GET() {
    const env = getEnv();
    const apiUrl = env.ERPNEXT_URL;
    const apiKey = env.ERPNEXT_API_KEY;
    const apiSecret = env.ERPNEXT_API_SECRET;

    if (!apiUrl || !apiKey || !apiSecret) {
        return NextResponse.json({ error: "Config Error" }, { status: 500 });
    }

    const headers = {
        "Authorization": `token ${apiKey}:${apiSecret}`,
        "Content-Type": "application/json",
    };

    try {
        // Fetch Events
        // Fields: subject, starts_on, ends_on, event_type, description, ref_type, ref_name
        const fields = JSON.stringify(["name", "subject", "starts_on", "ends_on", "event_type", "description"]);

        // Filter: Status Open? Or all? Let's get all for this month? 
        // For MVP, get last 100 events.
        const url = `${apiUrl}/api/resource/Event?fields=${fields}&order_by=starts_on desc&limit_page_length=100`;

        const response = await fetch(url, { headers });
        if (!response.ok) throw new Error(await response.text());

        const data = await response.json();
        return NextResponse.json({ events: data.data || [] });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
