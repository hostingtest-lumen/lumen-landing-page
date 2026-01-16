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

        // Telegram Credentials
        const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
        const telegramChatId = process.env.TELEGRAM_CHAT_ID;

        if (!apiUrl || !apiKey || !apiSecret) {
            console.error("Faltan variables de entorno de ERPNext");
            return NextResponse.json(
                { error: "Error de configuración del servidor" },
                { status: 500 }
            );
        }

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `token ${apiKey}:${apiSecret}`,
        };

        let leadName;

        // 2. CHECK: Verificar si el Lead ya existe por email
        try {
            const checkResponse = await fetch(
                `${apiUrl}/api/resource/Lead?filters=[["email_id","=","${email}"]]&fields=["name"]`,
                { method: "GET", headers }
            );

            if (checkResponse.ok) {
                const checkData = await checkResponse.json();
                if (checkData.data && checkData.data.length > 0) {
                    leadName = checkData.data[0].name;
                    console.log(`ℹ️ Lead ya existe: ${leadName}. Se agregará una nueva nota.`);
                }
            }
        } catch (checkError) {
            console.warn("⚠️ Error verificando existencia del Lead:", checkError);
            // Continuamos intentando crear si falló la verificación (aunque probablemente falle también)
        }

        // 3. CREATE: Si no existía, crearlo
        if (!leadName) {
            const leadData = {
                lead_name: nombre,
                email_id: email,
                mobile_no: whatsapp,
                // company: "Lumen Creativo", 
                status: "Lead",
                // source: "Website", 
                // territory: "All Territories", 
                title: institucion,
            };

            console.log("📤 Enviando a ERPNext:", JSON.stringify(leadData));

            const response = await fetch(`${apiUrl}/api/resource/Lead`, {
                method: "POST",
                headers,
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
            leadName = result.data.name;
            console.log("✅ Nuevo Lead creado exitosamente:", leadName);
        }

        // 4. NOTE: Agregar Nota con los detalles completos
        try {
            await fetch(`${apiUrl}/api/resource/Comment`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    reference_doctype: "Lead",
                    reference_name: leadName,
                    content: `Institución: ${institucion} (${body.tipoInstitucion || 'No especificado'}) \nInstagram: ${body.instagram || 'No especificado'} \nNecesidad: ${necesidad}`,
                    comment_type: "Comment",
                })
            });
        } catch (noteError) {
            console.warn("⚠️ No se pudo crear la nota:", noteError);
        }

        // 5. TELEGRAM: Enviar notificación
        if (telegramToken && telegramChatId) {
            try {
                const message = `
🚀 *Nuevo Lead Recibido* 🚀

👤 *Nombre:* ${nombre}
🏢 *Institución:* ${institucion}
📱 *WhatsApp:* ${whatsapp}
📧 *Email:* ${email}
${body.instagram ? `📸 *IG:* ${body.instagram}` : ''}

💭 *Necesidad:*
${necesidad}

📄 *ERPNext:* ${leadName}
                `.trim();

                const telegramResponse = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: telegramChatId,
                        text: message,
                        parse_mode: 'Markdown'
                    })
                });

                if (!telegramResponse.ok) {
                    console.error("⚠️ Error enviando a Telegram:", await telegramResponse.text());
                } else {
                    console.log("📨 Notificación enviada a Telegram");
                }

            } catch (telegramError) {
                console.warn("⚠️ Falló el envío a Telegram:", telegramError);
            }
        } else {
            console.log("ℹ️ Credenciales de Telegram no configuradas, saltando notificación.");
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
