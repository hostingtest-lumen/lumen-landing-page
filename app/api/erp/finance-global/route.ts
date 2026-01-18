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
        // 1. Sales Invoices (Ingresos)
        // Fields: grand_total, outstanding_amount, status, due_date
        const invUrl = `${apiUrl}/api/resource/Sales Invoice?fields=["name","customer","grand_total","outstanding_amount","status","due_date","posting_date"]&order_by=posting_date desc&limit_page_length=200`;

        // 2. Purchase Invoices (Gastos)
        const expUrl = `${apiUrl}/api/resource/Purchase Invoice?fields=["name","supplier","grand_total","status","posting_date"]&order_by=posting_date desc&limit_page_length=100`;

        // 3. Payment Entries (Flujo de Caja real)
        const payUrl = `${apiUrl}/api/resource/Payment Entry?fields=["name","party","paid_amount","payment_type","posting_date"]&order_by=posting_date desc&limit_page_length=200`;

        const [invRes, expRes, payRes] = await Promise.all([
            fetch(invUrl, { headers }),
            fetch(expUrl, { headers }),
            fetch(payUrl, { headers })
        ]);

        const invoices = invRes.ok ? (await invRes.json()).data : [];
        const expenses = expRes.ok ? (await expRes.json()).data : [];
        const payments = payRes.ok ? (await payRes.json()).data : [];

        return NextResponse.json({
            invoices: invoices || [],
            expenses: expenses || [],
            payments: payments || []
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
