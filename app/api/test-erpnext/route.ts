import { NextResponse } from 'next/server';

export async function GET() {
    const headers = {
        'Authorization': `token ${process.env.ERPNEXT_API_KEY}:${process.env.ERPNEXT_API_SECRET}`,
        'Content-Type': 'application/json'
    };
    const url = process.env.ERPNEXT_URL;

    const checks = ['Sales Invoice', 'Payment Entry', 'Task', 'Customer'];
    const results: Record<string, any> = {};

    for (const doctype of checks) {
        try {
            // Encode spaces in URL
            const cleanDoctype = encodeURIComponent(doctype);
            const res = await fetch(`${url}/api/resource/${cleanDoctype}?limit_page_length=1`, { headers });
            if (res.ok) {
                const data = await res.json();
                results[doctype] = { ok: true, count: data.data?.length || 0, sample: data.data?.[0] || null };
            } else {
                results[doctype] = { ok: false, status: res.status, statusText: res.statusText };
            }
        } catch (e: any) {
            results[doctype] = { ok: false, error: e.message };
        }
    }
    return NextResponse.json(results);
}
