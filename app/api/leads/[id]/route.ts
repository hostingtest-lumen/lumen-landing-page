import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(
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

        // 2. Config
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

        // 3. Fetch Lead Details
        const leadRes = await fetch(`${apiUrl}/api/resource/Lead/${id}`, { headers, cache: 'no-store' });

        if (!leadRes.ok) {
            return NextResponse.json({ error: "Lead not found" }, { status: 404 });
        }

        const leadData = await leadRes.json();

        // 4. Fetch Notes/Timeline (In ERPNext, these are often in 'Communication' or 'Note' doctypes linked to the lead)
        // For MVP, simply getting the basic fields + standard ERPNext timeline via Communication could work
        // Let's try to fetch "Communication" linked to this Lead

        const notesRes = await fetch(
            `${apiUrl}/api/resource/Communication?filters=[["reference_name","=","${id}"]]&fields=["subject","content","communication_date","sender"]&order_by=communication_date desc`,
            { headers, cache: 'no-store' }
        );

        let notes = [];
        if (notesRes.ok) {
            const notesData = await notesRes.json();
            notes = notesData.data || [];
        }

        return NextResponse.json({
            lead: leadData.data,
            timeline: notes
        });

    } catch (error) {
        console.error("API Lead Detail Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
