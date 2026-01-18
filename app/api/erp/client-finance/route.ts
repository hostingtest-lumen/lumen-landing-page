import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const clientName = searchParams.get("clientName");

    if (!clientName) {
        return NextResponse.json({ error: "Client Name required" }, { status: 400 });
    }

    const apiUrl = process.env.ERPNEXT_URL;
    const apiKey = process.env.ERPNEXT_API_KEY;
    const apiSecret = process.env.ERPNEXT_API_SECRET;

    const headers = {
        "Authorization": `token ${apiKey}:${apiSecret}`,
        "Content-Type": "application/json",
    };

    try {
        // Filter by Customer Name (ERPNext usually uses Name or Customer Name field)
        const filter = `[["Sales Invoice", "customer", "=", "${clientName}"]]`;
        const invUrl = `${apiUrl}/api/resource/Sales Invoice?fields=["name","grand_total","outstanding_amount","status","due_date","posting_date","currency"]&filters=${filter}&order_by=posting_date desc`;

        const payFilter = `[["Payment Entry", "party", "=", "${clientName}"], ["Payment Entry", "payment_type", "=", "Receive"]]`;
        const payUrl = `${apiUrl}/api/resource/Payment Entry?fields=["name","paid_amount","posting_date","reference_no","reference_date"]&filters=${payFilter}&order_by=posting_date desc`;

        const [invRes, payRes] = await Promise.all([
            fetch(invUrl, { headers }),
            fetch(payUrl, { headers })
        ]);

        const invoices = invRes.ok ? (await invRes.json()).data : [];
        const payments = payRes.ok ? (await payRes.json()).data : [];

        return NextResponse.json({
            invoices: invoices || [],
            payments: payments || []
        });

    } catch (error: any) {
        console.error("Client Finance Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
