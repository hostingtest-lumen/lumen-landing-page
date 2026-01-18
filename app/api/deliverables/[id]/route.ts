import { NextResponse } from "next/server";

// This route handles status updates for individual deliverables
// For public access (client review) - no auth required

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status, feedback } = body;

        if (!status) {
            return NextResponse.json({ error: "Status is required" }, { status: 400 });
        }

        if (!['pending', 'approved', 'changes_requested'].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        // For MVP, status updates are handled client-side via localStorage
        // This endpoint acknowledges the update for future ERPNext integration

        console.log(`📝 Deliverable ${id} status updated to: ${status}`);
        if (feedback) {
            console.log(`   Comment: ${feedback.comment}`);
        }

        // TODO: In production, update in ERPNext
        // await updateDeliverableInERPNext(id, status, feedback);

        // TODO: Send Telegram notification for important status changes
        // if (status === 'approved' || status === 'changes_requested') {
        //     await sendStatusNotification(id, status, feedback);
        // }

        return NextResponse.json({
            success: true,
            id,
            status,
            message: "Status update acknowledged (stored client-side for MVP)"
        });

    } catch (error) {
        console.error("API Deliverable Update Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // For MVP, deliverable data is managed client-side
        // This would fetch from ERPNext in production

        return NextResponse.json({
            message: `Deliverable ${id} - managed client-side for MVP`,
            note: "Use client-side deliverableService.getById()"
        });

    } catch (error) {
        console.error("API Deliverable GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
