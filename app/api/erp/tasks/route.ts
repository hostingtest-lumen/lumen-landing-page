import { NextResponse } from 'next/server';
import { ContentGridItem, GridStatus, Platform, ContentType } from "@/types/content-grid";
import { getEnv } from "@/lib/env-loader";

// Helper: Map ERP Status to GridStatus
const mapStatus = (erpStatus: string): GridStatus => {
    switch (erpStatus) {
        case 'Open': return 'draft';
        case 'Working': return 'draft';
        case 'Pending Review': return 'pending_approval';
        case 'Completed': return 'approved'; // or published
        case 'Cancelled': return 'draft';
        default: return 'draft';
    }
};

const mapGridStatusToErp = (status: GridStatus): string => {
    switch (status) {
        case 'draft': return 'Open';
        case 'pending_approval': return 'Pending Review';
        case 'approved': return 'Completed';
        case 'published': return 'Completed';
        default: return 'Open';
    }
};

// Helper: Parse description to extract metadata
const parseDescription = (desc: string) => {
    const typeMatch = desc.match(/\[TYPE: (.*?)\]/);
    const platMatch = desc.match(/\[PLATFORMS: (.*?)\]/);

    return {
        type: (typeMatch ? typeMatch[1] : 'post') as ContentType,
        platforms: (platMatch ? platMatch[1].split(',') : ['instagram']) as Platform[],
        caption: desc.replace(/\[.*?\]/g, '').trim()
    };
};

const formatDescription = (item: Partial<ContentGridItem>) => {
    return `[TYPE: ${item.type || 'post'}]
[PLATFORMS: ${(item.platforms || []).join(',')}]

${item.caption || ''}

NOTES: ${item.notes || ''}`;
};

const getContext = () => {
    const env = getEnv();
    return {
        baseUrl: env.ERPNEXT_URL,
        headers: {
            'Authorization': `token ${env.ERPNEXT_API_KEY}:${env.ERPNEXT_API_SECRET}`,
            'Content-Type': 'application/json'
        }
    };
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const erpId = searchParams.get('id');
    const { baseUrl, headers } = getContext();

    if (!baseUrl) return NextResponse.json({ error: "Config missing" }, { status: 500 });
    if (!erpId) return NextResponse.json([], { status: 400 });

    const filters = JSON.stringify([["customer", "=", erpId]]);
    const fields = JSON.stringify(["name", "subject", "description", "status", "exp_end_date", "priority"]);

    const url = `${baseUrl}/api/resource/Task?filters=${filters}&fields=${fields}&limit_page_length=100`;

    try {
        const res = await fetch(url, { headers });
        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        const tasks = data.data || [];

        const gridItems: ContentGridItem[] = tasks.map((t: any) => {
            const meta = parseDescription(t.description || '');
            return {
                id: t.name,
                clientId: erpId,
                date: t.exp_end_date,
                status: mapStatus(t.status),
                concept: t.subject,
                ...meta
            };
        });

        return NextResponse.json(gridItems);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const { baseUrl, headers } = getContext();
    try {
        const body = await request.json();
        const erpItem = {
            doctype: "Task",
            subject: body.concept,
            description: formatDescription(body),
            status: mapGridStatusToErp(body.status),
            exp_end_date: body.date,
            customer: body.clientId,
            priority: "Medium"
        };

        const res = await fetch(`${baseUrl}/api/resource/Task`, {
            method: 'POST',
            headers,
            body: JSON.stringify(erpItem)
        });

        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();

        return NextResponse.json({ id: data.data.name });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const { baseUrl, headers } = getContext();
    try {
        const body = await request.json();
        if (!body.id) throw new Error("Missing ID");

        const erpItem = {
            subject: body.concept,
            description: formatDescription(body),
            status: mapGridStatusToErp(body.status),
            exp_end_date: body.date,
        };

        const res = await fetch(`${baseUrl}/api/resource/Task/${body.id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(erpItem)
        });

        if (!res.ok) throw new Error(await res.text());
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { baseUrl, headers } = getContext();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    try {
        const res = await fetch(`${baseUrl}/api/resource/Task/${id}`, {
            method: 'DELETE',
            headers: headers
        });

        if (!res.ok) throw new Error(await res.text());
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
