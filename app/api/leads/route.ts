import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
    try {
        // 1. Security Check
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("lumen_session");

        if (!sessionCookie) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Optional: Parse session if needed, but existence of cookie + middleware protection is enough for read
        // const session = JSON.parse(sessionCookie.value);

        // 2. Fetch from ERPNext
        const apiUrl = process.env.ERPNEXT_URL;
        const apiKey = process.env.ERPNEXT_API_KEY;
        const apiSecret = process.env.ERPNEXT_API_SECRET;

        if (!apiUrl || !apiKey || !apiSecret) {
            return NextResponse.json({ error: "Server Config Error" }, { status: 500 });
        }

        const headers = {
            "Authorization": `token ${apiKey}:${apiSecret}`,
            "Content-Type": "application/json",
        };

        // Fetch fields: name (ID), lead_name, title (institution), mobile_no, email_id, status
        // Order by creation desc
        const response = await fetch(
            `${apiUrl}/api/resource/Lead?fields=["name","lead_name","title","mobile_no","email_id","status","creation"]&order_by=creation desc&limit_page_length=50`,
            { headers, cache: 'no-store' }
        );

        if (!response.ok) {
            console.error("ERPNext Fetch Error:", await response.text());
            return NextResponse.json({ error: "Failed to fetch leads" }, { status: response.status });
        }

        const data = await response.json();

        return NextResponse.json({ leads: data.data || [] });
    } catch (error) {
        console.error("API Leads Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


export async function PUT(request: Request) {
    try {
        // 1. Security Check
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("lumen_session");

        if (!sessionCookie) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. config
        const apiUrl = process.env.ERPNEXT_URL;
        const apiKey = process.env.ERPNEXT_API_KEY;
        const apiSecret = process.env.ERPNEXT_API_SECRET;

        // 3. Payload
        const body = await request.json();
        const { name, status } = body;

        if (!name || !status) {
            return NextResponse.json({ error: "Missing name or status" }, { status: 400 });
        }

        const headers = {
            "Authorization": `token ${apiKey}:${apiSecret}`,
            "Content-Type": "application/json",
        };

        const response = await fetch(`${apiUrl}/api/resource/Lead/${name}`, {
            method: "PUT",
            headers,
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            return NextResponse.json({ error: "Failed update" }, { status: response.status });
        }

        return NextResponse.json({ success: true, status });

    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
