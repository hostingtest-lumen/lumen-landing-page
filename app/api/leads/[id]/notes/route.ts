import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        // 1. Security Check
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("lumen_session");

        if (!sessionCookie) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const session = JSON.parse(sessionCookie.value);
        const currentUserEmail = session.email || "admin@lumen.com"; // Fallback or extract from session

        // 2. Config
        const apiUrl = process.env.ERPNEXT_URL;
        const apiKey = process.env.ERPNEXT_API_KEY;
        const apiSecret = process.env.ERPNEXT_API_SECRET;

        // 3. Payload
        const body = await request.json();
        const { note } = body;

        if (!note) {
            return NextResponse.json({ error: "Note content is empty" }, { status: 400 });
        }

        const headers = {
            "Authorization": `token ${apiKey}:${apiSecret}`,
            "Content-Type": "application/json",
        };

        // 4. Create Communication (Note) in ERPNext
        // mapping to "Communication" Doctype or "Note" Doctype. 
        // Using "Communication" as it's the standard feed item.
        const newCommunication = {
            subject: "Nota Interna",
            content: note,
            communication_date: new Date().toISOString().split('T')[0],
            communication_type: "Comment",
            reference_doctype: "Lead",
            reference_name: id,
            status: "Open",
            sent_or_received: "Sent",
            sender: currentUserEmail,
        };

        const response = await fetch(`${apiUrl}/api/resource/Communication`, {
            method: "POST",
            headers,
            body: JSON.stringify(newCommunication),
        });

        if (!response.ok) {
            console.error("ERPNext Note Error:", await response.text());
            return NextResponse.json({ error: "Failed to save note" }, { status: response.status });
        }

        const data = await response.json();

        return NextResponse.json({ success: true, data: data.data });

    } catch (error) {
        console.error("API Create Note Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
