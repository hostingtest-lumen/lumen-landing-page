const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app', 'api', 'erp', 'tasks', 'route.ts');

const content = `import { NextResponse } from 'next/server';
import { ContentGridItem, GridStatus, Platform, ContentType } from "@/types/content-grid";
import { getEnv } from "@/lib/env-loader";

// Helper: Map ERP Status to GridStatus
const mapStatus = (erpStatus) => {
    switch (erpStatus) {
        case 'Open': return 'draft';
        case 'Working': return 'draft';
        case 'Pending Review': return 'pending_approval';
        case 'Completed': return 'approved'; // or published
        case 'Cancelled': return 'draft';
        default: return 'draft';
    }
};

const mapGridStatusToErp = (status) => {
    switch (status) {
        case 'draft': return 'Open';
        case 'pending_approval': return 'Pending Review';
        case 'approved': return 'Completed';
        case 'published': return 'Completed';
        default: return 'Open';
    }
};

// Helper: Parse description to extract metadata
const parseDescription = (desc) => {
    const typeMatch = desc.match(/\\[TYPE: (.*?)\\]/);
    const platMatch = desc.match(/\\[PLATFORMS: (.*?)\\]/);

    return {
        type: (typeMatch ? typeMatch[1] : 'post'),
        platforms: (platMatch ? platMatch[1].split(',') : ['instagram']),
        caption: desc.replace(/\\[.*?\\]/g, '').trim() 
    };
};

const formatDescription = (item) => {
    return \`[TYPE: \${item.type || 'post'}]
[PLATFORMS: \${(item.platforms || []).join(',')}]

\${item.caption || ''}

NOTES: \${item.notes || ''}\`;
};

const getContext = () => {
    const env = getEnv();
    return {
        baseUrl: env.ERPNEXT_URL,
        headers: {
            'Authorization': \`token \${env.ERPNEXT_API_KEY}:\${env.ERPNEXT_API_SECRET}\`,
            'Content-Type': 'application/json',
            'Expect': ''
        }
    };
};

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const erpId = searchParams.get('id'); // Customer Name
    const { baseUrl, headers } = getContext();

    if (!baseUrl) return NextResponse.json({ error: "Config missing" }, { status: 500 });
    if (!erpId) return NextResponse.json([], { status: 400 });

    const filters = JSON.stringify([["customer", "=", erpId]]);
    const fields = JSON.stringify(["name", "subject", "description", "status", "exp_end_date", "priority"]);

    const url = \`\${baseUrl}/api/resource/Task?filters=\${filters}&fields=\${fields}&limit_page_length=100\`;

    try {
        const res = await fetch(url, { headers });
        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        const tasks = data.data || [];

        const gridItems = tasks.map((t) => {
            const meta = parseDescription(t.description || '');
            return {
                id: t.name,
                clientId: erpId, // We use ERP Name as ClientID context here
                date: t.exp_end_date,
                status: mapStatus(t.status),
                concept: t.subject,
                ...meta
            };
        });

        return NextResponse.json(gridItems);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request) {
    const { baseUrl, headers } = getContext();
    try {
        const body = await request.json(); // ContentGridItem
        const erpItem = {
            doctype: "Task",
            subject: body.concept,
            description: formatDescription(body),
            status: mapGridStatusToErp(body.status),
            exp_end_date: body.date,
            customer: body.clientId, // Must be ERP Customer Name
            priority: "Medium"
        };

        const res = await fetch(\`\${baseUrl}/api/resource/Task\`, {
            method: 'POST',
            headers,
            body: JSON.stringify(erpItem)
        });

        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();

        return NextResponse.json({ id: data.data.name });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PUT(request) {
    const { baseUrl, headers } = getContext();
    try {
        const body = await request.json(); // ContentGridItem
        if (!body.id) throw new Error("Missing ID");

        const erpItem = {
            subject: body.concept,
            description: formatDescription(body),
            status: mapGridStatusToErp(body.status),
            exp_end_date: body.date,
        };

        const res = await fetch(\`\${baseUrl}/api/resource/Task/\${body.id}\`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(erpItem)
        });

        if (!res.ok) throw new Error(await res.text());
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    const { baseUrl, headers } = getContext();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    try {
        const res = await fetch(\`\${baseUrl}/api/resource/Task/\${id}\`, {
            method: 'DELETE',
            headers: headers
        });

        if (!res.ok) throw new Error(await res.text());
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
`;

try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Successfully overwrote app/api/erp/tasks/route.ts");
} catch (e) {
    console.error("Failed to write file:", e);
}
