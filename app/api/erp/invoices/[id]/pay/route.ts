import { NextRequest, NextResponse } from "next/server";
import { getEnv } from "@/lib/env-loader";

// POST /api/erp/invoices/[id]/pay
// Crea un Payment Entry en ERPNext para marcar la factura como pagada
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

    const invoiceId = params.id;

    try {
        // 1. Obtener detalles de la factura
        const invoiceRes = await fetch(
            `${apiUrl}/api/resource/Sales Invoice/${invoiceId}`,
            { headers }
        );

        if (!invoiceRes.ok) {
            return NextResponse.json({ error: "Factura no encontrada" }, { status: 404 });
        }

        const invoiceData = await invoiceRes.json();
        const invoice = invoiceData.data;

        // Verificar si ya está pagada
        if (invoice.status === "Paid") {
            return NextResponse.json({
                success: true,
                message: "La factura ya estaba pagada",
                status: "Paid"
            });
        }

        // 2. Obtener el body opcional (para amount y mode_of_payment)
        let body: { amount?: number; mode_of_payment?: string } = {};
        try {
            body = await request.json();
        } catch {
            // No body provided, use defaults
        }

        const paymentAmount = body.amount || invoice.outstanding_amount || invoice.grand_total;
        const modeOfPayment = body.mode_of_payment || "Transferencia Bancaria";

        // 3. Obtener la cuenta de pago por defecto
        // Primero intentamos obtener una cuenta de banco/efectivo
        let paidToAccount = "";
        try {
            const accountRes = await fetch(
                `${apiUrl}/api/resource/Account?filters=[["account_type","in",["Bank","Cash"]],["is_group","=",0]]&fields=["name"]&limit_page_length=1`,
                { headers }
            );
            if (accountRes.ok) {
                const accountData = await accountRes.json();
                if (accountData.data && accountData.data.length > 0) {
                    paidToAccount = accountData.data[0].name;
                }
            }
        } catch (e) {
            console.error("Error fetching account:", e);
        }

        // 4. Crear el Payment Entry
        const paymentEntry = {
            doctype: "Payment Entry",
            payment_type: "Receive",
            party_type: "Customer",
            party: invoice.customer,
            posting_date: new Date().toISOString().split('T')[0],
            paid_amount: paymentAmount,
            received_amount: paymentAmount,
            source_exchange_rate: 1,
            target_exchange_rate: 1,
            paid_from: invoice.debit_to, // Cuenta por cobrar del cliente
            paid_to: paidToAccount || "1110 - Banco - LC", // Cuenta de banco (ajustar según tu plan)
            paid_from_account_currency: invoice.currency || "USD",
            paid_to_account_currency: invoice.currency || "USD",
            mode_of_payment: modeOfPayment,
            references: [{
                reference_doctype: "Sales Invoice",
                reference_name: invoiceId,
                total_amount: invoice.grand_total,
                outstanding_amount: invoice.outstanding_amount || invoice.grand_total,
                allocated_amount: paymentAmount
            }]
        };

        console.log("Creating Payment Entry:", JSON.stringify(paymentEntry, null, 2));

        // 5. Crear el Payment Entry en ERPNext
        const createRes = await fetch(`${apiUrl}/api/resource/Payment Entry`, {
            method: 'POST',
            headers,
            body: JSON.stringify(paymentEntry)
        });

        if (!createRes.ok) {
            const errorText = await createRes.text();
            console.error("Payment Entry Error:", errorText);

            try {
                const errorJson = JSON.parse(errorText);
                let message = "Error al crear el pago";
                if (errorJson._server_messages) {
                    try {
                        const msgs = JSON.parse(errorJson._server_messages);
                        if (msgs[0]) {
                            const msgObj = JSON.parse(msgs[0]);
                            message = msgObj.message || message;
                        }
                    } catch { }
                } else if (errorJson.message) {
                    message = errorJson.message;
                }
                return NextResponse.json({ error: message }, { status: createRes.status });
            } catch {
                return NextResponse.json({ error: errorText.substring(0, 200) }, { status: createRes.status });
            }
        }

        const paymentData = await createRes.json();
        const paymentName = paymentData.data.name;

        // 6. Submit el Payment Entry para que aplique
        const submitRes = await fetch(
            `${apiUrl}/api/resource/Payment Entry/${paymentName}`,
            {
                method: 'PUT',
                headers,
                body: JSON.stringify({ docstatus: 1 })
            }
        );

        if (!submitRes.ok) {
            console.error("Error submitting payment:", await submitRes.text());
            // El pago se creó pero no se submitió, aún así informamos
            return NextResponse.json({
                success: true,
                payment_entry: paymentName,
                message: `Pago ${paymentName} creado (pendiente de submit manual)`,
                status: "Draft"
            });
        }

        return NextResponse.json({
            success: true,
            payment_entry: paymentName,
            message: `Factura ${invoiceId} marcada como pagada`,
            status: "Paid"
        });

    } catch (error: any) {
        console.error("Payment error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
