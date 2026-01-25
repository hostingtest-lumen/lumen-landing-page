import { NextResponse } from "next/server";
import { Client } from "@/types/clients";
import { getEnv } from "@/lib/env-loader";
import { sendWebhook } from "@/lib/webhooks";

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
        "Authorization": `token ${env.ERPNEXT_API_KEY}:${env.ERPNEXT_API_SECRET}`
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
                    content: `📱 Instagram: ${client.instagram || 'N/A'}\n👤 Encargado: ${client.contactPerson || 'N/A'}\n📅 Día Pago: ${client.paymentDay || 'N/A'}\n� Email: ${client.email || 'N/A'}\n📍 Dirección: ${client.address || 'N/A'}\n🆔 RUT/NIT: ${client.taxId || 'N/A'}\n🌐 Web: ${client.website || 'N/A'}\n�📞 Teléfono: ${client.contactPhone || 'N/A'}\n🔗 Portal Token: ${client.token}`,
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
async function getCustomerComments(erpId: string): Promise<{ instagram?: string, contactPhone?: string, token?: string, paymentDay?: string, contactPerson?: string, email?: string, address?: string, taxId?: string, website?: string }> {
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
            // Parse the content for all fields
            const instagramMatch = content.match(/Instagram:\s*@?([^\n]+)/i);
            const phoneMatch = content.match(/Teléfono:\s*([^\n]+)/i);
            const tokenMatch = content.match(/Portal Token:\s*([^\n]+)/i);
            const paymentMatch = content.match(/Día Pago:\s*([^\n]+)/i);
            const contactMatch = content.match(/Encargado:\s*([^\n]+)/i);
            const emailMatch = content.match(/Email:\s*([^\n]+)/i);
            const addressMatch = content.match(/Dirección:\s*([^\n]+)/i);
            const taxMatch = content.match(/RUT\/NIT:\s*([^\n]+)/i);
            const webMatch = content.match(/Web:\s*([^\n]+)/i);

            return {
                instagram: instagramMatch ? instagramMatch[1].trim() : undefined,
                contactPhone: phoneMatch ? phoneMatch[1].trim() : undefined,
                token: tokenMatch ? tokenMatch[1].trim() : undefined,
                paymentDay: paymentMatch ? paymentMatch[1].trim() : undefined,
                contactPerson: contactMatch ? contactMatch[1].trim() : undefined,
                email: emailMatch ? emailMatch[1].trim() : undefined,
                address: addressMatch ? addressMatch[1].trim() : undefined,
                taxId: taxMatch ? taxMatch[1].trim() : undefined,
                website: webMatch ? webMatch[1].trim() : undefined,
            };
        }
    } catch (e) {
        console.warn("Error fetching comments:", e);
    }
    return {};
}

export async function GET() {
    // Use process.env directly like the debug endpoint does
    const apiUrl = process.env.ERPNEXT_URL;
    const apiKey = process.env.ERPNEXT_API_KEY;
    const apiSecret = process.env.ERPNEXT_API_SECRET;

    // If ERPNext is not configured, return empty array
    if (!apiUrl || !apiKey || !apiSecret) {
        console.warn("⚠️ ERPNext no configurado - retornando lista vacía");
        return NextResponse.json({ clients: [], source: "none" });
    }

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `token ${apiKey}:${apiSecret}`
    };

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

        // Build the customer URL with fields
        const url = `${apiUrl}/api/resource/Customer?fields=${encodeURIComponent(fields)}&limit_page_length=100`;

        // Also fetch balances (dashboard-style)
        // We can do this by getting the GL Report or simply relying on the fact 
        // that we might need a separate call or specific field if 'outstanding_amount' isn't on Customer doctype directly (it isn't by default).
        // A better approach for list view is to fetch `Customer` and then mapped balances via `accounts` if possible, 
        // OR simply fetch `Sales Invoice` summaries. 
        // However, ERPNext has a `get_balance` method but via API we might need `Selling Settings`.
        // EASIER WAY: Accounts Receivable Summary is a report.

        // FOR NOW: Let's fetch Customer. Note: Customer doctype DOES NOT have outstanding_amount field by default in standard API response unless calculated.
        // We will fetch the basic list first. To show balance, we'd ideally hit a report API.
        // Let's optimize: We will just fetch the list as before, and for the "Detailed View" we fetch balance. 
        // BUT user wants it on the card.
        // Let's try to fetch `api/method/erpnext.accounts.utils.get_balance` for each if list is small, or just one bulk query if possible. 
        // Efficient way: Fetch `Sales Invoice` with status Unpaid grouped by customer.

        // Let's try fetching `Sales Invoice` with `outstanding_amount > 0` and aggregate locally.
        const balanceUrl = `${apiUrl}/api/resource/${encodeURIComponent('Sales Invoice')}?fields=${encodeURIComponent('["customer","outstanding_amount"]')}&filters=${encodeURIComponent('[["docstatus","=",1],["outstanding_amount",">",0]]')}&limit_page_length=500`;

        // Fetch customers first (main request)
        let customerRes: Response;
        try {
            customerRes = await fetch(url, {
                headers,
                cache: 'no-store'
            });
        } catch (fetchError: any) {
            console.error("❌ Fetch exception for customers:", fetchError.message);
            return NextResponse.json({
                clients: [],
                source: "erpnext-error",
                error: `Customer fetch failed: ${fetchError.message}`,
                debug: { url, apiUrl }
            });
        }

        if (!customerRes.ok) {
            const errorText = await customerRes.text();
            console.error("❌ Error fetching customers from ERPNext:", errorText);
            return NextResponse.json({ clients: [], source: "erpnext-error", error: errorText });
        }

        // Fetch balances separately (non-blocking)
        let balanceRes: Response | null = null;
        try {
            balanceRes = await fetch(balanceUrl, { headers, cache: 'no-store' });
        } catch (e) {
            console.warn("⚠️ Balance fetch failed, continuing without balances");
        }

        const result = await customerRes.json();
        const erpCustomers = result.data || [];

        // Process balances
        const balancesMap: Record<string, number> = {};
        if (balanceRes && balanceRes.ok) {
            const balanceData = await balanceRes.json();
            (balanceData.data || []).forEach((inv: any) => {
                balancesMap[inv.customer] = (balancesMap[inv.customer] || 0) + inv.outstanding_amount;
            });
        }

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
                    paymentDay: comments.paymentDay,
                    contactPerson: comments.contactPerson,
                    email: comments.email,
                    address: comments.address,
                    taxId: comments.taxId,
                    website: comments.website,
                    outstandingBalance: balancesMap[cust.name] || 0,
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
        const { name, instagram, industry, contactPhone, paymentDay, contactPerson, email, address, taxId, website } = body;

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
            paymentDay,
            contactPerson,
            email,
            address,
            taxId,
            website,
            createdAt: new Date().toISOString()
        };

        // Create in ERPNext
        let erpId = await createCustomerInERPNext(newClient);
        let erpCreated = true;

        if (!erpId) {
            console.warn("⚠️ ERPNext no disponible, creando cliente en modo LOCAL-ONLY");
            erpId = `LOCAL-${Date.now()}`;
            erpCreated = false;
        }

        newClient.erpId = erpId;

        // Enviar evento webhook (n8n manejará Telegram, Email, etc.)
        // Se envía incluso si es local, con una bandera indicando el estado de sync
        sendWebhook('client.created', {
            client: newClient,
            erpId,
            portalLink: `/portal/${token}`,
            erpSynced: erpCreated
        }).catch(console.error);

        return NextResponse.json({
            success: true,
            client: newClient,
            portalLink: `/portal/${token}`,
            erpCreated: erpCreated,
            message: erpCreated ? "Cliente creado y sincronizado" : "Cliente creado SOLO LOCALMENTE (ERPNext falló)"
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
        const { erpId, name, instagram, industry, contactPhone, paymentDay, contactPerson, email, address, taxId, website } = body;

        if (!erpId) return NextResponse.json({ error: "erpId required" }, { status: 400 });

        // Update Customer in ERPNext
        if (apiUrl) {
            try {
                // Update basic fields
                const updateRes = await fetch(`${apiUrl}/api/resource/Customer/${encodeURIComponent(erpId)}`, {
                    method: "PUT",
                    headers: getHeaders(),
                    body: JSON.stringify({
                        customer_name: name,
                        industry: industry,
                        mobile_no: contactPhone,
                        website: website,
                        tax_id: taxId
                    })
                });

                if (!updateRes.ok) {
                    console.error("ERP Update Error:", await updateRes.text());
                }

                // Add comment with ALL extended info
                await fetch(`${apiUrl}/api/resource/Comment`, {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify({
                        reference_doctype: "Customer",
                        reference_name: erpId,
                        content: `🔄 Datos Actualizados:\n📱 Instagram: ${instagram || 'N/A'}\n👤 Encargado: ${contactPerson || 'N/A'}\n📅 Día Pago: ${paymentDay || 'N/A'}\n� Email: ${email || 'N/A'}\n📍 Dirección: ${address || 'N/A'}\n🆔 RUT/NIT: ${taxId || 'N/A'}\n🌐 Web: ${website || 'N/A'}\n�📞 Teléfono: ${contactPhone || 'N/A'}\n🏢 Rubro: ${industry || 'N/A'}`,
                        comment_type: "Comment",
                    })
                });
            } catch (e) {
                console.warn("ERP Update warn", e);
            }
        }

        // Return updated client
        const updatedClient: Client = {
            id: generateIdFromName(name || erpId),
            name: name,
            erpId: erpId,
            token: generateTokenFromErpId(erpId),
            instagram,
            industry,
            contactPhone,
            paymentDay,
            contactPerson,
            email,
            address,
            taxId,
            website
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

