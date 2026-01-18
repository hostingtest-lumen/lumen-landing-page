import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const clientName = searchParams.get("clientName"); // Using Name (ID) usually

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
        // Files attached to the Customer document
        const filter = `[["File", "attached_to_name", "=", "${clientName}"]]`;
        // We can also filter by is_private if needed, but for now show all attached
        const url = `${apiUrl}/api/resource/File?fields=["name","file_name","file_url","is_private","creation"]&filters=${filter}&order_by=creation desc`;

        const res = await fetch(url, { headers });
        const data = await res.json();

        // Filter out private files if necessary, or just rely on ERPNext permissions
        // We will return the public URL. ERPNext private files need token to access.
        // Assuming we want to show files that are intended for the client.

        const files = (data.data || []).map((f: any) => ({
            id: f.name,
            name: f.file_name,
            url: f.file_url.startsWith('http') ? f.file_url : `${apiUrl}${f.file_url}`,
            date: f.creation
        }));

        return NextResponse.json({ files });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
