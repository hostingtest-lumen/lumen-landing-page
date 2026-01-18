import { NextResponse } from "next/server";
import { sendDeliverableStatusEmail } from "@/lib/email";

const getErpHeaders = () => {
    const apiKey = process.env.ERPNEXT_API_KEY;
    const apiSecret = process.env.ERPNEXT_API_SECRET;
    return {
        "Authorization": `token ${apiKey}:${apiSecret}`,
        "Content-Type": "application/json",
    };
};

const ERP_URL = process.env.ERPNEXT_URL;

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const res = await fetch(`${ERP_URL}/api/resource/Task/${id}`, { headers: getErpHeaders() });
        const data = await res.json();

        if (!res.ok) throw new Error(data.exception || "Not found");

        const task = data.data;
        let metadata: any = {};
        try {
            if (task.description && task.description.startsWith('{')) {
                metadata = JSON.parse(task.description);
            }
        } catch (e) {
            metadata = { url: task.description };
        }

        // Use metadata status if available, otherwise derive from ERP status
        const status = metadata.app_status || (task.status === 'Completed' ? 'approved' : 'pending');

        const deliverable = {
            id: task.name,
            title: task.subject,
            status: status,
            clientId: task.customer || metadata.clientId,
            clientName: metadata.clientName,
            type: metadata.type || 'image',
            url: metadata.url || '',
            carouselUrls: metadata.carouselUrls,
            createdAt: task.creation,
            description: metadata.userDescription,
            feedback: metadata.feedback || []
        };

        return NextResponse.json(deliverable);
    } catch (error) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        // Body: { status, feedback }

        // 1. Fetch current task to get existing metadata
        const currentRes = await fetch(`${ERP_URL}/api/resource/Task/${id}`, { headers: getErpHeaders() });
        const currentData = await currentRes.json();
        if (!currentRes.ok) throw new Error("Task not found");

        const task = currentData.data;
        let metadata: any = {};
        try {
            metadata = JSON.parse(task.description);
        } catch (e) {
            // If it wasn't JSON before, we convert it now
            metadata = { url: task.description, feedback: [] };
        }

        // 2. Update metadata
        metadata.app_status = body.status;
        if (body.feedback) {
            metadata.feedback = [...(metadata.feedback || []), body.feedback];
        }

        // 3. Update ERPNext
        // If status is approved, we can also close the task in ERPNext
        const erpStatus = body.status === 'approved' ? 'Completed' : 'Open';

        const updatePayload = {
            description: JSON.stringify(metadata),
            status: erpStatus
        };

        const updateRes = await fetch(`${ERP_URL}/api/resource/Task/${id}`, {
            method: 'PUT',
            headers: getErpHeaders(),
            body: JSON.stringify(updatePayload)
        });

        if (!updateRes.ok) throw new Error("Failed to update in ERPNext");

        // 4. Send Notification
        // Only if status changed to approved or changes_requested
        if (body.status === 'approved' || body.status === 'changes_requested') {
            await sendDeliverableStatusEmail({
                clientName: metadata.clientName || "Cliente",
                title: task.subject,
                status: body.status,
                feedback: body.feedback ? body.feedback.comment : undefined,
                deliverableId: id
            });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("ERP Deliverable Update Error:", error);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}
