import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nombre, email, whatsapp, institucion, necesidad } = body;

        // 1. Validar datos básicos
        if (!nombre || !email || !whatsapp) {
            return NextResponse.json(
                { error: "Faltan datos obligatorios" },
                { status: 400 }
            );
        }

        const apiUrl = process.env.ERPNEXT_URL;
        const apiKey = process.env.ERPNEXT_API_KEY;
        const apiSecret = process.env.ERPNEXT_API_SECRET;

        if (!apiUrl || !apiKey || !apiSecret) {
            console.error("Faltan variables de entorno de ERPNext");
            return NextResponse.json(
                { error: "Error de configuración del servidor" },
                { status: 500 }
            );
        }

        // 2. Crear Lead en ERPNext
        // Mapeamos los campos del formulario a los campos de ERPNext
        const leadData = {
            lead_name: nombre,
            email_id: email,
            mobile_no: whatsapp,
            // company: "Lumen Creativo", 
            status: "Lead",
            // source: "Website", // Comentado por error de idioma/link
            // territory: "All Territories", // Comentado por error de idioma/link
            title: institucion,
        };

        console.log("📤 Enviando a ERPNext:", JSON.stringify(leadData));

        const response = await fetch(`${apiUrl}/api/resource/Lead`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `token ${apiKey}:${apiSecret}`,
            },
            body: JSON.stringify(leadData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Error ERPNext (${response.status}):`, errorText);

            let errorDetails;
            try {
                errorDetails = JSON.parse(errorText);
            } catch (e) {
                errorDetails = { message: errorText };
            }

            return NextResponse.json(
                { error: "Error al crear Lead en ERPNext", details: errorDetails },
                { status: response.status }
            );
        }

        const result = await response.json();
        const leadName = result.data.name;
        console.log("✅ Lead creado exitosamente:", leadName);

        // 3. Agregar Nota con los detalles completos (Necesidad)
        try {
            await fetch(`${apiUrl}/api/resource/Comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `token ${apiKey}:${apiSecret}`,
                },
                body: JSON.stringify({
                    reference_doctype: "Lead",
                    reference_name: leadName,
                    content: `Institución: ${institucion} \nNecesidad: ${necesidad}`,
                    comment_type: "Comment",
                })
            });
        } catch (noteError) {
            console.warn("⚠️ No se pudo crear la nota, pero el lead sí se creó:", noteError);
        }

        return NextResponse.json({ success: true, lead: leadName });

    } catch (error) {
        console.error("❌ Error CRÍTICO en API Route:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
