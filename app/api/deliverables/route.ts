import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Note: This route provides API access to the deliverables
// For MVP, the actual storage is handled by localStorage on the client
// This route is prepared for future ERPNext integration

export async function GET() {
    try {
        // For now, deliverables are managed client-side via localStorage
        // This endpoint can be used for future server-side storage
        return NextResponse.json({
            message: "Deliverables are currently managed via localStorage (MVP)",
            note: "This endpoint will be extended for ERPNext integration"
        });
    } catch (error) {
        console.error("API Deliverables GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("lumen_session");

        if (!sessionCookie) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        // Validate required fields
        if (!body.title || !body.url) {
            return NextResponse.json({ error: "Title and URL are required" }, { status: 400 });
        }

        // For MVP, return success - client handles localStorage
        // In production, this would create in ERPNext
        return NextResponse.json({
            success: true,
            message: "Deliverable creation acknowledged (stored client-side for MVP)"
        });

    } catch (error) {
        console.error("API Deliverables POST Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
