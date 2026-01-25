/**
 * Utilidad de Webhooks para integraciones externas (n8n, Zapier, etc.)
 * 
 * Esta utilidad envía eventos a URLs de webhook configuradas en variables de entorno.
 * Lee N8N_WEBHOOK_URL del entorno para determinar dónde enviar los eventos.
 */

export type WebhookEvent =
    | 'client.created'
    | 'client.updated'
    | 'client.deleted'
    | 'lead.created'
    | 'lead.updated'
    | 'lead.stage_changed'
    | 'deliverable.created'
    | 'deliverable.approved'
    | 'deliverable.changes_requested';

interface WebhookPayload {
    event: WebhookEvent;
    timestamp: string;
    data: Record<string, any>;
    source: 'lumen-dashboard';
}

/**
 * Envía un evento webhook a n8n u otro servicio configurado.
 * Esta función NO bloquea - si falla, solo registra el error.
 * 
 * @param event - Tipo de evento (ej: 'client.created')
 * @param data - Datos del evento (ej: el objeto cliente)
 */
export async function sendWebhook(event: WebhookEvent, data: Record<string, any>): Promise<void> {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    console.log(`📡 Intentando enviar webhook [${event}]...`);
    console.log(`   URL configurada: ${webhookUrl || 'NINGUNA'}`);

    if (!webhookUrl) {
        console.warn(`⚠️ Webhook NO enviado: Variable N8N_WEBHOOK_URL vacía.`);
        return;
    }

    const payload: WebhookPayload = {
        event,
        timestamp: new Date().toISOString(),
        data,
        source: 'lumen-dashboard'
    };

    try {
        console.log(`   Enviando payload a ${webhookUrl}...`);
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Lumen-Event': event,
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            console.log(`✅ Webhook [${event}] enviado EXITOSAMENTE (Status: ${response.status})`);
        } else {
            console.warn(`⚠️ Webhook [${event}] FALLÓ. Server respondió: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.warn(`   Respuesta del server: ${text.substring(0, 200)}`);
        }
    } catch (error) {
        // No lanzamos el error - webhooks no deben bloquear operaciones principales
        console.error(`❌ ERROR CRÍTICO enviando webhook [${event}]:`, error);
    }
}

/**
 * Verifica si una solicitud tiene una API Key válida.
 * Permite autenticación externa sin cookies de sesión.
 * 
 * @param request - Request de Next.js
 * @returns true si la API Key es válida
 */
export function validateApiKey(request: Request): boolean {
    const apiKey = request.headers.get('x-api-key');
    const validKey = process.env.LUMEN_API_KEY;

    if (!validKey) {
        // Si no hay API Key configurada, no permitir acceso por API Key
        return false;
    }

    return apiKey === validKey;
}
