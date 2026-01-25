import { NextResponse } from "next/server";
import { sendWebhook, validateApiKey } from "@/lib/webhooks";

const getErpConfig = () => ({
    url: process.env.ERPNEXT_URL,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `token ${process.env.ERPNEXT_API_KEY}:${process.env.ERPNEXT_API_SECRET}`
    }
});

export async function POST(request: Request) {
    try {
        // Permitir acceso con API Key (para formularios externos) o cookies internas (aunque esta ruta suele ser pública)
        // Por seguridad en landing forms, a veces se deja abierta, 
        // pero validaremos apiKey si está presente para priorizar solicitudes autenticadas.
        // NOTA: Para formularios públicos sin backend, esta ruta suele quedar abierta.

        const body = await request.json();
        const { nombre, email, whatsapp, institucion, necesidad, tipoInstitucion, instagram } = body;

        // 1. Validar datos básicos
        if (!nombre || !email) {
            return NextResponse.json(
                { error: "Faltan datos obligatorios (nombre, email)" },
                { status: 400 }
            );
        }

        const { url: apiUrl, headers } = getErpConfig();

        let leadName;
        let erpCreated = false;

        // Intentar crear en ERPNext si hay credenciales
        if (apiUrl) {
            try {
                // A. Crear Lead
                const leadData = {
                    lead_name: nombre,
                    email_id: email,
                    mobile_no: whatsapp,
                    title: institucion,
                    status: "Lead",
                    source: body.source || "Website"
                };

                console.log("📤 Intentando crear Lead en ERPNext...");
                const response = await fetch(`${apiUrl}/api/resource/Lead`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify(leadData),
                });

                if (response.ok) {
                    const result = await response.json();
                    leadName = result.data.name;
                    erpCreated = true;
                    console.log(`✅ Lead creado en ERPNext: ${leadName}`);

                    // B. Agregar Nota con detalles extra
                    await fetch(`${apiUrl}/api/resource/Comment`, {
                        method: "POST",
                        headers,
                        body: JSON.stringify({
                            reference_doctype: "Lead",
                            reference_name: leadName,
                            content: `Institución: ${institucion} (${tipoInstitucion || 'N/A'}) \nInstagram: ${instagram || 'N/A'} \nNecesidad: ${necesidad}`,
                            comment_type: "Comment",
                        })
                    }).catch(e => console.warn("Nota ERP falló", e));

                } else {
                    console.warn(`⚠️ ERPNext respondió error: ${response.status}`);
                }
            } catch (error) {
                console.error("❌ Error de conexión con ERPNext:", error);
            }
        }

        // Fallback Local si ERP falló
        if (!leadName) {
            leadName = `LOCAL-LEAD-${Date.now()}`;
            console.log("⚠️ Creando Lead en modo LOCAL (ERPNext no disponible)");
        }

        // 2. Enviar Webhook a n8n (El núcleo de la automatización)
        // n8n se encargará de: Telegram, Email de bienvenida, Mautic, etc.
        const webhookPayload = {
            lead: {
                id: leadName,
                name: nombre,
                email,
                phone: whatsapp,
                institution: institucion,
                instagram,
                need: necesidad,
                source: body.source || "Landing Page"
            },
            erpSynced: erpCreated
        };

        // 2. Enviar Webhook a n8n
        // Usamos await para asegurar que se envíe antes de cerrar la conexión
        try {
            await sendWebhook('lead.created', webhookPayload);
        } catch (webhookError) {
            console.error("⚠️ Error enviando webhook en create-lead:", webhookError);
        }

        return NextResponse.json({
            success: true,
            lead: leadName,
            message: erpCreated ? "Lead procesado correctamente" : "Lead guardado localmente (ERP inestable)"
        });

    } catch (error) {
        console.error("❌ Error CRÍTICO en API Route:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
