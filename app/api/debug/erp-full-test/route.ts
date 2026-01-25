import { NextResponse } from "next/server";

export async function GET() {
    const apiUrl = process.env.ERPNEXT_URL;
    const apiKey = process.env.ERPNEXT_API_KEY;
    const apiSecret = process.env.ERPNEXT_API_SECRET;

    if (!apiUrl || !apiKey || !apiSecret) {
        return NextResponse.json({ error: "ERPNext not configured" }, { status: 500 });
    }

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `token ${apiKey}:${apiSecret}`,
    };

    const results: Record<string, any> = {
        config: {
            url: apiUrl,
            keyPrefix: apiKey?.substring(0, 5),
            secretPrefix: apiSecret?.substring(0, 5)
        },
        tests: {}
    };

    // Test 1: Auth endpoint (same as debug that works)
    try {
        const res1 = await fetch(`${apiUrl}/api/method/frappe.auth.get_logged_user`, { headers });
        results.tests.auth = {
            ok: res1.ok,
            status: res1.status,
            data: res1.ok ? await res1.json() : null
        };
    } catch (e: any) {
        results.tests.auth = { ok: false, error: e.message };
    }

    // Test 2: Simple Customer fetch (one customer only)
    try {
        const res2 = await fetch(`${apiUrl}/api/resource/Customer?limit_page_length=1`, { headers });
        results.tests.customer_simple = {
            ok: res2.ok,
            status: res2.status,
            data: res2.ok ? await res2.json() : null
        };
    } catch (e: any) {
        results.tests.customer_simple = { ok: false, error: e.message };
    }

    // Test 3: Customer with fields
    try {
        const fields = JSON.stringify(["name", "customer_name"]);
        const res3 = await fetch(`${apiUrl}/api/resource/Customer?fields=${encodeURIComponent(fields)}&limit_page_length=1`, { headers });
        results.tests.customer_with_fields = {
            ok: res3.ok,
            status: res3.status,
            data: res3.ok ? await res3.json() : null
        };
    } catch (e: any) {
        results.tests.customer_with_fields = { ok: false, error: e.message };
    }

    return NextResponse.json(results);
}
