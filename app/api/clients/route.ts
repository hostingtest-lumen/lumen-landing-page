import { NextResponse } from "next/server";
import { Client, SEED_CLIENTS } from "@/types/clients";
import { getEnv } from "@/lib/env-loader";

// In-memory storage to simulate DB persistence during dev session
// In production, this would be a real database
let clientsStore: Client[] = [...SEED_CLIENTS];

function generateToken(name: string): string {
    const prefix = name.toLowerCase().substring(0, 3).replace(/[^a-z]/g, 'x');
    const random = Math.random().toString(36).substring(2, 6);
    return `${prefix}-portal-${random}`;
}

const getHeaders = () => {
    const env = getEnv();
    return {
        "Content-Type": "application/json",
        "Authorization": `token ${env.ERPNEXT_API_KEY}:${env.ERPNEXT_API_SECRET}`,
        "Expect": ""
    };
};

async function sendTelegramNotification(client: Client, erpCustomerId?: string) {
    const env = getEnv();
    const telegramToken = env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = env.TELEGRAM_CHAT_ID;

    if (!telegramToken || !telegramChatId) return;

    const message = `🎉 *¡NUEVO CLIENTE EN LUMEN CREATIVO!* 🎉

📌 *Nombre:* ${client.name}
📱 *Instagram:* ${client.instagram ? `@${client.instagram}` : 'No especificado'}
🏢 *Rubro:* ${client.industry || 'No especificado'}
📞 *Contacto:* ${client.contactPhone || 'No especificado'}
${erpCustomerId ? `\n📄 *ERPNext:* ${erpCustomerId}` : ''}

¡A dar lo mejor! 💪✨`;

    try {
        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: telegramChatId,
                text: message,
                parse_mode: "Markdown"
            })
        });
    } catch (error) {
        console.warn("⚠️ Falló el envío a Telegram:", error);
    }
}

async function createCustomerInERPNext(client: Client): Promise<string | null> {
    const env = getEnv();
    const apiUrl = env.ERPNEXT_URL;
    if (!apiUrl) return null;

    try {
        const customerData = {
            customer_name: client.name,
            customer_type: "Company",
            customer_group: "All Customer Groups",
            territory: "All Territories",
        };

        const response = await fetch(`${apiUrl}/api/resource/Customer`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(customerData),
        });

        if (!response.ok) {
            console.error(`❌ Error ERPNext Create:`, await response.text());
            return null;
        }

        const result = await response.json();
        const customerId = result.data.name;

        // Add note
        try {
            await fetch(`${apiUrl}/api/resource/Comment`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify({
                    reference_doctype: "Customer",
                    reference_name: customerId,
                    content: `📱 Instagram: ${client.instagram || 'N/A'}\n🏢 Rubro: ${client.industry || 'N/A'}\n📞 Teléfono: ${client.contactPhone || 'N/A'}\n🔗 Portal Token: ${client.token}`,
                    comment_type: "Comment",
                })
            });
        } catch (e) { console.warn("Note error", e); }

        return customerId;

    } catch (error) {
        console.error("❌ Link ERPNext Error:", error);
        return null;
    }
}

export async function GET() {
    return NextResponse.json({ clients: clientsStore });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, instagram, industry, contactPhone } = body;

        if (!name) return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });

        const clientId = name.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 15);
        const token = generateToken(name);

        const newClient: Client = {
            id: clientId,
            name: name.trim(),
            erpId: "PENDING",
            token,
            instagram: instagram?.replace('@', '').trim(),
            industry: industry?.trim(),
            contactPhone: contactPhone?.trim(),
            createdAt: new Date().toISOString()
        };

        const erpId = await createCustomerInERPNext(newClient);
        newClient.erpId = erpId || `LOCAL-${Date.now()}`;

        clientsStore = [newClient, ...clientsStore];
        sendTelegramNotification(newClient, erpId || undefined).catch(console.error);

        return NextResponse.json({ success: true, client: newClient, portalLink: `/portal/${token}`, erpCreated: !!erpId });
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const apiUrl = process.env.ERPNEXT_URL;
    try {
        const body = await request.json();
        const { id, name, instagram, industry, contactPhone } = body;

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        const index = clientsStore.findIndex(c => c.id === id);
        if (index === -1) return NextResponse.json({ error: "Client not found" }, { status: 404 });

        const oldClient = clientsStore[index];
        const updatedClient = {
            ...oldClient,
            name: name || oldClient.name,
            instagram: instagram !== undefined ? instagram : oldClient.instagram,
            industry: industry !== undefined ? industry : oldClient.industry,
            contactPhone: contactPhone !== undefined ? contactPhone : oldClient.contactPhone,
        };

        // ERPNext Sync Update
        if (apiUrl && oldClient.erpId && !oldClient.erpId.startsWith('LOCAL-')) {
            // Note: Cannot easily rename Customer Name via REST. 
            // We focus on updating contact info via a new Comment or updating custom fields if they existed.
            // For now, we'll post a comment about the update.
            try {
                await fetch(`${apiUrl}/api/resource/Comment`, {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify({
                        reference_doctype: "Customer",
                        reference_name: oldClient.erpId,
                        content: `🔄 Actualización de Datos:\n\nNombre: ${updatedClient.name}\nInstagram: ${updatedClient.instagram}\nTel: ${updatedClient.contactPhone}`,
                        comment_type: "Comment",
                    })
                });
            } catch (e) { console.warn("ERP Update warn", e); }
        }

        clientsStore[index] = updatedClient;
        return NextResponse.json({ success: true, client: updatedClient });
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const apiUrl = process.env.ERPNEXT_URL;
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        const clientToDelete = clientsStore.find(c => c.id === id);
        clientsStore = clientsStore.filter(c => c.id !== id);

        // ERPNext Sync Delete
        if (apiUrl && clientToDelete?.erpId && !clientToDelete.erpId.startsWith('LOCAL-')) {
            const res = await fetch(`${apiUrl}/api/resource/Customer/${encodeURIComponent(clientToDelete.erpId)}`, {
                method: "DELETE",
                headers: getHeaders()
            });
            if (!res.ok) console.error("ERP Delete Error", await res.text());
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
