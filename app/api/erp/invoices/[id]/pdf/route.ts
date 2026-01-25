import { NextRequest, NextResponse } from "next/server";
import { getEnv } from "@/lib/env-loader";

// GET /api/erp/invoices/[id]/pdf
// Descarga el PDF de la factura desde ERPNext
export async function GET(
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
    };

    const invoiceId = params.id;

    try {
        // Obtener el print format desde query params (opcional)
        const searchParams = request.nextUrl.searchParams;
        const printFormat = searchParams.get('format') || 'Standard';

        // Endpoint de ERPNext para descargar PDF
        // Método: frappe.utils.print_format.download_pdf
        const pdfUrl = `${apiUrl}/api/method/frappe.utils.print_format.download_pdf?doctype=Sales%20Invoice&name=${encodeURIComponent(invoiceId)}&format=${encodeURIComponent(printFormat)}&no_letterhead=0`;

        console.log("Fetching PDF from:", pdfUrl);

        const pdfRes = await fetch(pdfUrl, {
            headers,
            // Importante: no seguir redirects automáticamente para manejar errores
        });

        if (!pdfRes.ok) {
            // Intentar método alternativo
            const altUrl = `${apiUrl}/api/method/frappe.utils.weasyprint.download_pdf?doctype=Sales%20Invoice&name=${encodeURIComponent(invoiceId)}&print_format=${encodeURIComponent(printFormat)}`;

            const altRes = await fetch(altUrl, { headers });

            if (!altRes.ok) {
                // Último intento: print directo
                const directUrl = `${apiUrl}/printview?doctype=Sales%20Invoice&name=${encodeURIComponent(invoiceId)}&format=${encodeURIComponent(printFormat)}&_lang=es`;

                return NextResponse.json({
                    error: "No se pudo generar el PDF",
                    fallback_url: directUrl,
                    message: "Puedes abrir el link directamente en el navegador"
                }, { status: 500 });
            }

            // Si el método alternativo funcionó
            const pdfBuffer = await altRes.arrayBuffer();
            return new NextResponse(pdfBuffer, {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename="Factura-${invoiceId}.pdf"`,
                },
            });
        }

        // Verificar que sea un PDF
        const contentType = pdfRes.headers.get('content-type');

        if (contentType?.includes('application/json')) {
            // ERPNext devolvió un error en JSON
            const errorData = await pdfRes.json();
            return NextResponse.json({
                error: errorData.message || "Error al generar PDF"
            }, { status: 400 });
        }

        const pdfBuffer = await pdfRes.arrayBuffer();

        // Retornar el PDF como descarga
        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Factura-${invoiceId}.pdf"`,
            },
        });

    } catch (error: any) {
        console.error("PDF download error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
