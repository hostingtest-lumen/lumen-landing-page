import { NextResponse } from 'next/server';
import { getEnv } from "@/lib/env-loader";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const erpId = searchParams.get('id');

    if (!erpId) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const env = getEnv();
    const apiUrl = env.ERPNEXT_URL;
    const apiKey = env.ERPNEXT_API_KEY;
    const apiSecret = env.ERPNEXT_API_SECRET;

    if (!apiUrl || !apiKey || !apiSecret) {
        return NextResponse.json({ error: "Config Error" }, { status: 500 });
    }

    const headers = {
        'Authorization': `token ${apiKey}:${apiSecret}`,
        'Content-Type': 'application/json'
    };
    const baseUrl = apiUrl;

    try {
        // 1. Fetch Invoices
        // Filters syntax: json string of list of lists
        const invFilters = JSON.stringify([["customer", "=", erpId]]);
        const invFields = JSON.stringify(["name", "grand_total", "status", "due_date", "currency", "posting_date"]);

        const invUrl = `${baseUrl}/api/resource/Sales Invoice?filters=${invFilters}&fields=${invFields}&order_by=posting_date desc`;

        // 2. Fetch Payments
        const payFilters = JSON.stringify([["party", "=", erpId], ["party_type", "=", "Customer"]]);
        const payFields = JSON.stringify(["name", "paid_amount", "payment_type", "status", "posting_date"]);

        const payUrl = `${baseUrl}/api/resource/Payment Entry?filters=${payFilters}&fields=${payFields}&order_by=posting_date desc`;

        const [invRes, payRes] = await Promise.all([
            fetch(invUrl, { headers }),
            fetch(payUrl, { headers })
        ]);

        let invoices = [];
        let payments = [];

        if (invRes.ok) {
            const data = await invRes.json();
            invoices = data.data || [];
        } else {
            console.error("ERP Invoice Error:", await invRes.text());
        }

        if (payRes.ok) {
            const data = await payRes.json();
            payments = data.data || [];
        } else {
            console.error("ERP Payment Error:", await payRes.text());
        }

        return NextResponse.json({ invoices, payments });

    } catch (error: any) {
        console.error("Error fetching ERP details:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
