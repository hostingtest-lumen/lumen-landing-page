import { NextRequest, NextResponse } from "next/server";
import { getEnv } from "@/lib/env-loader";

export interface InvoiceItem {
    description: string;
    qty: number;
    rate: number;
    item_code?: string; // Optional - if provided, use existing item
}

export interface CreateInvoiceRequest {
    customer: string;       // Nombre del cliente en ERPNext
    items: InvoiceItem[];
    due_date: string;       // YYYY-MM-DD
    posting_date?: string;  // YYYY-MM-DD (default: today)
}

// GET - Listar facturas
export async function GET(request: NextRequest) {
    const env = getEnv();
    const apiUrl = env.ERPNEXT_URL;
    const apiKey = env.ERPNEXT_API_KEY;
    const apiSecret = env.ERPNEXT_API_SECRET;

    if (!apiUrl || !apiKey || !apiSecret) {
        return NextResponse.json({ error: "ERPNext no configurado" }, { status: 500 });
    }

    const headers = {
        "Authorization": `token ${apiKey}:${apiSecret}`,
        "Content-Type": "application/json",
    };

    try {
        const searchParams = request.nextUrl.searchParams;
        const customer = searchParams.get('customer');
        const limit = searchParams.get('limit') || '50';

        let url = `${apiUrl}/api/resource/Sales Invoice?fields=["name","customer","grand_total","outstanding_amount","status","due_date","posting_date"]&order_by=posting_date desc&limit_page_length=${limit}`;

        if (customer) {
            url += `&filters=[["customer","=","${customer}"]]`;
        }

        const res = await fetch(url, { headers });

        if (!res.ok) {
            const error = await res.text();
            return NextResponse.json({ error: "ERPNext error: " + error }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json({ invoices: data.data || [] });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// GET items disponibles desde ERPNext
async function getFirstServiceItem(headers: Record<string, string>, apiUrl: string): Promise<string | null> {
    try {
        const url = `${apiUrl}/api/resource/Item?filters=[["is_sales_item","=",1]]&fields=["name","item_name"]&limit_page_length=1`;
        const res = await fetch(url, { headers });
        if (res.ok) {
            const data = await res.json();
            if (data.data && data.data.length > 0) {
                return data.data[0].name;
            }
        }
    } catch (e) {
        console.error("Error fetching items:", e);
    }
    return null;
}

// POST - Crear nueva factura
export async function POST(request: NextRequest) {
    const env = getEnv();
    const apiUrl = env.ERPNEXT_URL;
    const apiKey = env.ERPNEXT_API_KEY;
    const apiSecret = env.ERPNEXT_API_SECRET;

    if (!apiUrl || !apiKey || !apiSecret) {
        return NextResponse.json({ error: "ERPNext no configurado" }, { status: 500 });
    }

    const headers = {
        "Authorization": `token ${apiKey}:${apiSecret}`,
        "Content-Type": "application/json",
    };

    try {
        const body: CreateInvoiceRequest = await request.json();

        // Validaciones
        if (!body.customer) {
            return NextResponse.json({ error: "Cliente es requerido" }, { status: 400 });
        }
        if (!body.items || body.items.length === 0) {
            return NextResponse.json({ error: "Debe incluir al menos un item" }, { status: 400 });
        }
        if (!body.due_date) {
            return NextResponse.json({ error: "Fecha de vencimiento es requerida" }, { status: 400 });
        }

        // Obtener un item de servicio existente en ERPNext
        // Si no existe, informar al usuario
        const defaultItemCode = await getFirstServiceItem(headers, apiUrl);

        if (!defaultItemCode) {
            return NextResponse.json({
                error: "No hay items de venta configurados en ERPNext. Por favor crea un item 'Servicios' en ERPNext primero."
            }, { status: 400 });
        }

        // Formatear items para ERPNext - usar item_code válido
        const formattedItems = body.items.map(item => ({
            item_code: item.item_code || defaultItemCode, // Usar item existente
            description: item.description,
            qty: item.qty,
            rate: item.rate,
        }));

        // Crear documento de Sales Invoice
        const invoiceDoc = {
            doctype: "Sales Invoice",
            customer: body.customer,
            posting_date: body.posting_date || new Date().toISOString().split('T')[0],
            due_date: body.due_date,
            items: formattedItems,
            docstatus: 0, // 0 = Draft, 1 = Submitted
        };

        console.log("Sending to ERPNext:", JSON.stringify(invoiceDoc, null, 2));

        // Llamar a ERPNext API
        const res = await fetch(`${apiUrl}/api/resource/Sales Invoice`, {
            method: 'POST',
            headers,
            body: JSON.stringify(invoiceDoc)
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("ERPNext Invoice Error:", errorText);

            // Intentar parsear el error de ERPNext
            try {
                const errorJson = JSON.parse(errorText);
                let message = "Error desconocido de ERPNext";

                if (errorJson._server_messages) {
                    try {
                        const serverMsgs = JSON.parse(errorJson._server_messages);
                        if (Array.isArray(serverMsgs) && serverMsgs[0]) {
                            const msgObj = JSON.parse(serverMsgs[0]);
                            message = msgObj.message || message;
                        }
                    } catch {
                        message = errorJson._server_messages;
                    }
                } else if (errorJson.message) {
                    message = errorJson.message;
                } else if (errorJson.exc_type) {
                    message = `${errorJson.exc_type}: Verifica la configuración de ERPNext`;
                }

                return NextResponse.json({ error: message }, { status: res.status });
            } catch {
                return NextResponse.json({ error: `Error ERPNext (${res.status}): ${errorText.substring(0, 200)}` }, { status: res.status });
            }
        }

        const data = await res.json();

        return NextResponse.json({
            success: true,
            invoice: data.data,
            invoice_name: data.data.name,
            message: `Factura ${data.data.name} creada exitosamente`
        });

    } catch (error: any) {
        console.error("Invoice creation error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
