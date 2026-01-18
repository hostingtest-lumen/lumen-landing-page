import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Common ERPNext headers helper
const getErpHeaders = () => {
    const apiKey = process.env.ERPNEXT_API_KEY;
    const apiSecret = process.env.ERPNEXT_API_SECRET;
    return {
        "Authorization": `token ${apiKey}:${apiSecret}`,
        "Content-Type": "application/json",
    };
};

const ERP_URL = process.env.ERPNEXT_URL;

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const clientId = searchParams.get("clientId");

        // We filter Tasks by type 'Deliverable' (we will use this convention)
        // or search by description/subject if needed.
        // For MVP, we will fetch tasks that represent deliverables.
        // We can check if 'custom_is_deliverable' exists, or just use a standard filter like status != Cancelled

        let filters = `[["Task", "status", "!=", "Cancelled"]]`;
        if (clientId) {
            // Assuming we can link task to customer (link_to_name or similar)
            // Or typically Task has a 'customer' field if setup, or 'project'.
            // For now, let's assume we filter by description containing the client ID for simplicity if direct link isn't established,
            // or better, if we set 'customer' field in Task.

            // Let's try to filter by 'customer' field in Task if it exists (standard in some ERPNext setups or custom). 
            // If not, we might store clientId in a custom field.
            // For safety in this generic environment, let's use a text search or assume 'customer' field exists.
            // Let's filter by the 'customer' field which usually exists in Projects or Support, but in generic Task it might be ref 'Reference'.

            // BETTER MVP STRATEGY: Store clientId in the 'project' field or 'customer' field on creation.
            // Let's assume we save clientId in 'customer' field.
            filters = `[["Task", "customer", "=", "${clientId}"], ["Task", "status", "!=", "Cancelled"]]`;
        }

        const fields = JSON.stringify(["name", "subject", "description", "status", "customer", "classification", "creation", "custom_url", "custom_type", "custom_client_name"]);
        // Note: 'custom_url', 'custom_type' might not exist. We should fallback to parsing description if custom fields aren't there.
        // But to do it right, we should rely on standard fields first. 
        // We will store metadata in the 'description' as JSON or specific format if we can't create custom fields easily.
        // Plan: Store everything in 'description' as a JSON string for maximum compatibility without schema migration.

        const url = `${ERP_URL}/api/resource/Task?fields=["name","subject","description","status","creation","customer"]&filters=${filters}&order_by=creation desc`;

        const res = await fetch(url, { headers: getErpHeaders() });
        const data = await res.json();

        if (!res.ok) throw new Error(data.exception || "Failed to fetch from ERPNext");

        // Transform ERPNext Tasks to Deliverables
        const deliverables = (data.data || []).map((task: any) => {
            // Parse our metadata from description if it looks like JSON
            let metadata: any = {};
            try {
                // We will store our JSON payload wrapped in a specific block or just use the description if it is pure JSON
                if (task.description && task.description.startsWith('{')) {
                    metadata = JSON.parse(task.description);
                }
            } catch (e) {
                // fallback if description is just text
                metadata = { url: task.description };
            }

            return {
                id: task.name,
                title: task.subject,
                status: mapErpStatus(task.status),
                clientId: task.customer || metadata.clientId,
                clientName: metadata.clientName || "Cliente", // fallback
                type: metadata.type || 'image',
                url: metadata.url || '',
                carouselUrls: metadata.carouselUrls,
                createdAt: task.creation,
                description: metadata.userDescription, // The actual text description user typed
                feedback: metadata.feedback || []
            };
        });

        // If clientId param was passed, we might need to double check client logic if filter fails (e.g. if field didn't exist)
        const finalFilter = clientId ? deliverables.filter((d: any) => d.clientId === clientId) : deliverables;

        return NextResponse.json(finalFilter);

    } catch (error) {
        console.error("ERP Deliverables GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch deliverables" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Body should match Deliverable type

        // We pack all extra data into the 'description' field as JSON
        const metadata = {
            url: body.url,
            type: body.type,
            carouselUrls: body.carouselUrls,
            clientId: body.clientId,
            clientName: body.clientName,
            userDescription: body.description,
            feedback: []
        };

        const taskPayload = {
            subject: body.title,
            status: 'Open',
            priority: 'Medium',
            customer: body.clientId, // Try to set customer field
            description: JSON.stringify(metadata)
        };

        const res = await fetch(`${ERP_URL}/api/resource/Task`, {
            method: 'POST',
            headers: getErpHeaders(),
            body: JSON.stringify(taskPayload)
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.exception || "Failed to create task");

        return NextResponse.json({ success: true, id: data.data.name });

    } catch (error) {
        console.error("ERP Deliverables POST Error:", error);
        return NextResponse.json({ error: "Failed to create deliverable" }, { status: 500 });
    }
}

function mapErpStatus(erpStatus: string) {
    // Map ERPNext Task status to our app status
    switch (erpStatus) {
        case 'Completed': return 'approved';
        case 'Overdue': return 'changes_requested'; // Just a mapping choice, maybe 'Open' is pending
        case 'Working': return 'pending';
        case 'Open': return 'pending';
        default: return 'pending';
    }
    // We might need a better way to store 'changes_requested'. 
    // Maybe we update the status text directly if ERPNext allows custom status, 
    // or we store the 'app_status' in our metadata JSON.
    // DECISION: Let's accept that we will manage the REAL status in the metadata JSON for precision,
    // and just keep ERPNext status as Open/Completed for general tracking.
}
