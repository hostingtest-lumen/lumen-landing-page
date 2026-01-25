import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { MOCK_LEADS } from "@/lib/mock-data";
import { sendWebhook, validateApiKey } from "@/lib/webhooks";

/**
 * Verifica autenticación: acepta cookie de sesión O API Key válida
 */
async function isAuthenticated(request: Request): Promise<boolean> {
    // Primero verificar API Key (para integraciones externas como n8n)
    if (validateApiKey(request)) {
        return true;
    }

    // Sino, verificar cookie de sesión (para usuarios del dashboard)
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("lumen_session");
    return !!sessionCookie;
}

export async function GET(request: Request) {
    try {
        if (!(await isAuthenticated(request))) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Try to read from JSON DB
        let leads = db.read('leads');

        // If no data in JSON, initialize with MOCK_LEADS
        if (!leads || leads.length === 0) {
            db.write('leads', MOCK_LEADS);
            leads = MOCK_LEADS;
        }

        return NextResponse.json({ leads });
    } catch (error) {
        console.error("API Leads Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        // POST permite API Key para que n8n pueda crear leads
        if (!(await isAuthenticated(request))) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        // Add ID and dates
        const newLead = {
            ...body,
            name: `LEAD-${Date.now()}`,
            creation: new Date().toISOString(),
            status: "Lead",
            pipelineId: body.pipelineId || 'prospectos',
            columnId: body.columnId || 'nuevo'
        };

        const leads = db.read('leads') || [];
        db.write('leads', [newLead, ...leads]);

        // Enviar webhook para automatizaciones (n8n -> Mautic, email, etc.)
        sendWebhook('lead.created', {
            lead: newLead,
            source: body.source || 'dashboard'
        }).catch(console.error);

        return NextResponse.json({ lead: newLead });
    } catch (error) {
        console.error("POST Lead Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        if (!(await isAuthenticated(request))) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name, ...updates } = body;

        if (!name) {
            return NextResponse.json({ error: "Missing name" }, { status: 400 });
        }

        const leads = db.read<any>('leads') || [];
        const index = leads.findIndex((l: any) => l.name === name);

        if (index === -1) {
            return NextResponse.json({ error: "Lead not found" }, { status: 404 });
        }

        const oldLead = leads[index];
        const stageChanged = updates.columnId && updates.columnId !== oldLead.columnId;

        // Update lead
        leads[index] = { ...oldLead, ...updates };
        db.write('leads', leads);

        // Enviar webhook apropiado
        if (stageChanged) {
            // Evento específico para cambio de etapa (útil para n8n triggers)
            sendWebhook('lead.stage_changed', {
                lead: leads[index],
                previousStage: oldLead.columnId,
                newStage: updates.columnId
            }).catch(console.error);
        } else {
            sendWebhook('lead.updated', {
                lead: leads[index],
                changes: Object.keys(updates)
            }).catch(console.error);
        }

        return NextResponse.json({ success: true, lead: leads[index] });

    } catch (error) {
        console.error("PUT Lead Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

