import { NextResponse } from "next/server";
import { Client } from "@/types/clients";
import { getEnv } from "@/lib/env-loader";

function generateToken(name: string): string {
    const prefix = name.toLowerCase().substring(0, 3).replace(/[^a-z]/g, 'x');
    const random = Math.random().toString(36).substring(2, 6);
    return `${prefix}-portal-${random}`;
}

function generateIdFromName(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20);
}

function generateTokenFromErpId(erpId: string): string {
    // Generate a consistent token from ERP ID for existing customers
    const hash = erpId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `erp-${hash.toString(36)}-${erpId.substring(0, 4).toLowerCase().replace(/[^a-z0-9]/g, 'x')}`;
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

        // Add note with extra info
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

// Helper to fetch comments for a customer (to get instagram, token, etc.)
async function getCustomerComments(erpId: string): Promise<{ instagram?: string, contactPhone?: string, token?: string }> {
    const env = getEnv();
    const apiUrl = env.ERPNEXT_URL;
    if (!apiUrl) return {};

    try {
        const filters = JSON.stringify([
            ["reference_doctype", "=", "Customer"],
            ["reference_name", "=", erpId],
            ["comment_type", "=", "Comment"]
        ]);
        const url = `${apiUrl}/api/resource/Comment?filters=${encodeURIComponent(filters)}&fields=["content"]&order_by=creation desc&limit_page_length=1`;

        const res = await fetch(url, { headers: getHeaders() });
        if (!res.ok) return {};

        const data = await res.json();
        if (data.data && data.data.length > 0) {
            const content = data.data[0].content || '';
            // Parse the content for instagram, phone, token
            const instagramMatch = content.match(/Instagram:\s*@?([^\n]+)/i);
            const phoneMatch = content.match(/Teléfono:\s*([^\n]+)/i);
            const tokenMatch = content.match(/Portal Token:\s*([^\n]+)/i);

            return {
                instagram: instagramMatch ? instagramMatch[1].trim() : undefined,
                contactPhone: phoneMatch ? phoneMatch[1].trim() : undefined,
                token: tokenMatch ? tokenMatch[1].trim() : undefined,
            };
        }
    } catch (e) {
        console.warn("Error fetching comments:", e);
    }
    return {};
}

export async function GET() {
    const env = getEnv();
    const apiUrl = env.ERPNEXT_URL;

    // If ERPNext is not configured, return empty array
    if (!apiUrl || !env.ERPNEXT_API_KEY || !env.ERPNEXT_API_SECRET) {
        console.warn("⚠️ ERPNext no configurado - retornando lista vacía");
        return NextResponse.json({ clients: [], source: "none" });
    }

    try {
        // Fetch customers from ERPNext
        const fields = JSON.stringify([
            "name",
            "customer_name",
            "customer_type",
            "industry",
            "mobile_no",
            "creation"
        ]);
        const url = `${apiUrl}/api/resource/Customer?fields=${encodeURIComponent(fields)}&order_by=creation desc&limit_page_length=100`;

        const response = await fetch(url, {
            headers: getHeaders(),
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Error fetching customers from ERPNext:", errorText);
            return NextResponse.json({ clients: [], source: "erpnext-error", error: errorText });
        }

        const result = await response.json();
        const erpCustomers = result.data || [];

        // Map ERPNext customers to Client interface
        const clients: Client[] = await Promise.all(
            erpCustomers.map(async (cust: any) => {
                // Fetch extra info from comments
                const comments = await getCustomerComments(cust.name);

                return {
                    id: generateIdFromName(cust.customer_name || cust.name),
                    name: cust.customer_name || cust.name,
                    erpId: cust.name,
                    token: comments.token || generateTokenFromErpId(cust.name),
                    instagram: comments.instagram,
                    industry: cust.industry || undefined,
                    contactPhone: comments.contactPhone || cust.mobile_no || undefined,
                    createdAt: cust.creation,
                };
            })
        );

        return NextResponse.json({ clients, source: "erpnext" });

    } catch (error: any) {
        console.error("❌ Error connecting to ERPNext:", error);
        return NextResponse.json({
            clients: [],
            source: "erpnext-error",
            error: error.message
        });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, instagram, industry, contactPhone } = body;

        if (!name) return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });

        const clientId = generateIdFromName(name);
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

        // Create in ERPNext
        const erpId = await createCustomerInERPNext(newClient);

        if (!erpId) {
            return NextResponse.json({
                error: "No se pudo crear el cliente en ERPNext. Verifica la conexión.",
                erpCreated: false
            }, { status: 500 });
        }

        newClient.erpId = erpId;

        // Send notification
        sendTelegramNotification(newClient, erpId).catch(console.error);

        return NextResponse.json({
            success: true,
            client: newClient,
            portalLink: `/portal/${token}`,
            erpCreated: true
        });
    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const env = getEnv();
    const apiUrl = env.ERPNEXT_URL;

    try {
        const body = await request.json();
        const { erpId, name, instagram, industry, contactPhone } = body;

        if (!erpId) return NextResponse.json({ error: "erpId required" }, { status: 400 });

        // Update Customer in ERPNext (customer_name can be updated)
        if (apiUrl) {
            try {
                // Update the Customer document
                const updateRes = await fetch(`${apiUrl}/api/resource/Customer/${encodeURIComponent(erpId)}`, {
                    method: "PUT",
                    headers: getHeaders(),
                    body: JSON.stringify({
                        customer_name: name,
                        industry: industry,
                        mobile_no: contactPhone,
                    })
                });

                if (!updateRes.ok) {
                    console.error("ERP Update Error:", await updateRes.text());
                }

                // Add a comment with updated info
                await fetch(`${apiUrl}/api/resource/Comment`, {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify({
                        reference_doctype: "Customer",
                        reference_name: erpId,
                        content: `🔄 Actualización:\n📱 Instagram: ${instagram || 'N/A'}\n📞 Teléfono: ${contactPhone || 'N/A'}\n🏢 Rubro: ${industry || 'N/A'}`,
                        comment_type: "Comment",
                    })
                });
            } catch (e) {
                console.warn("ERP Update warn", e);
            }
        }

        // Return the updated client
        const updatedClient: Client = {
            id: generateIdFromName(name || erpId),
            name: name,
            erpId: erpId,
            token: generateTokenFromErpId(erpId),
            instagram: instagram,
            industry: industry,
            contactPhone: contactPhone,
        };

        return NextResponse.json({ success: true, client: updatedClient });
    } catch (error) {
        console.error("PUT Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const env = getEnv();
    const apiUrl = env.ERPNEXT_URL;

    try {
        const { searchParams } = new URL(request.url);
        const erpId = searchParams.get('erpId') || searchParams.get('id');

        if (!erpId) return NextResponse.json({ error: "erpId required" }, { status: 400 });

        // Delete from ERPNext
        if (apiUrl && !erpId.startsWith('LOCAL-')) {
            try {
                const res = await fetch(`${apiUrl}/api/resource/Customer/${encodeURIComponent(erpId)}`, {
                    method: "DELETE",
                    headers: getHeaders()
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    console.error("ERP Delete Error:", errorText);
                    return NextResponse.json({
                        error: "No se pudo eliminar en ERPNext",
                        details: errorText
                    }, { status: 500 });
                }
            } catch (e) {
                console.error("Delete fetch error:", e);
                return NextResponse.json({ error: "Error de conexión a ERPNext" }, { status: 500 });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

