import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { sendWebhook, validateApiKey } from "@/lib/webhooks";

/**
 * Configuración de ERPNext
 */
const getErpConfig = () => ({
    url: process.env.ERPNEXT_URL,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `token ${process.env.ERPNEXT_API_KEY}:${process.env.ERPNEXT_API_SECRET}`
    }
});

/**
 * Crea una Task en ERPNext asociada al entregable
 */
async function createErpNextTask(deliverable: any): Promise<string | null> {
    const { url, headers } = getErpConfig();
    if (!url) return null;

    try {
        const taskData = {
            subject: deliverable.title,
            status: mapStatusToErp(deliverable.status),
            priority: mapPriorityToErp(deliverable.priority),
            description: `Entregable Lumen: ${deliverable.type}\nCliente: ${deliverable.client || 'N/A'}\nURL: ${deliverable.url || 'N/A'}`,
            exp_end_date: deliverable.dueDate || null,
            project: deliverable.erpProjectId || null, // Si hay proyecto asociado
            custom_lumen_deliverable_id: deliverable.id // Campo personalizado para mapeo
        };

        const response = await fetch(`${url}/api/resource/Task`, {
            method: "POST",
            headers,
            body: JSON.stringify(taskData)
        });

        if (response.ok) {
            const result = await response.json();
            console.log(`✅ Task creada en ERPNext: ${result.data.name}`);
            return result.data.name;
        } else {
            console.error("❌ Error creando Task en ERPNext:", await response.text());
            return null;
        }
    } catch (error) {
        console.error("❌ Error de conexión a ERPNext:", error);
        return null;
    }
}

/**
 * Actualiza el status de una Task en ERPNext
 */
async function updateErpNextTask(erpTaskId: string, updates: any): Promise<boolean> {
    const { url, headers } = getErpConfig();
    if (!url || !erpTaskId) return false;

    try {
        const taskUpdates: any = {};
        if (updates.status) taskUpdates.status = mapStatusToErp(updates.status);
        if (updates.title) taskUpdates.subject = updates.title;

        const response = await fetch(`${url}/api/resource/Task/${encodeURIComponent(erpTaskId)}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(taskUpdates)
        });

        return response.ok;
    } catch (error) {
        console.error("❌ Error actualizando Task:", error);
        return false;
    }
}

/**
 * Mapea status de Lumen a status de ERPNext Task
 */
function mapStatusToErp(status: string): string {
    const map: Record<string, string> = {
        'pending': 'Open',
        'in_review': 'Working',
        'approved': 'Completed',
        'changes_requested': 'Pending Review',
        'rejected': 'Cancelled'
    };
    return map[status] || 'Open';
}

/**
 * Mapea prioridad de Lumen a ERPNext
 */
function mapPriorityToErp(priority: string): string {
    const map: Record<string, string> = {
        'low': 'Low',
        'medium': 'Medium',
        'high': 'High',
        'urgent': 'Urgent'
    };
    return map[priority] || 'Medium';
}

/**
 * Verifica autenticación
 */
async function isAuthenticated(request: Request): Promise<boolean> {
    if (validateApiKey(request)) return true;
    const cookieStore = await cookies();
    return !!cookieStore.get("lumen_session");
}

export async function GET(request: Request) {
    try {
        if (!(await isAuthenticated(request))) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let deliverables = db.read('deliverables');

        if (!deliverables || deliverables.length === 0) {
            // Transform MOCK_DELIVERABLES to match DB schema if needed
            // Assuming structure is compatible, just use it
            // Or create a few internal initial deliverables
            const initialData = [
                {
                    id: "d-001",
                    title: "Brand Kit Refresh - V1",
                    type: "brand",
                    status: "approved",
                    priority: "high",
                    dueDate: "2026-02-15",
                    client: "Congregación Santa María",
                    version: "v1",
                    author: "Kevin Flores",
                    url: "https://example.com/brand-kit",
                },
                {
                    id: "d-002",
                    title: "Campaña Vocacional - Reels",
                    type: "video",
                    status: "in_review",
                    priority: "urgent",
                    dueDate: "2026-01-30",
                    client: "Seminario Mayor",
                    version: "v2",
                    author: "Ana López",
                    url: "https://example.com/video",
                }
            ];

            db.write('deliverables', initialData);
            deliverables = initialData;
        }

        return NextResponse.json({ deliverables });
    } catch (error) {
        console.error("API Deliverables Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        if (!(await isAuthenticated(request))) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        if (!body.title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const newDeliverable = {
            ...body,
            id: `DEL-${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: body.status || "pending",
            version: "v1",
            history: [
                {
                    version: "v1",
                    date: new Date().toISOString(),
                    author: body.author || "Admin", // Should be user.name
                    action: "created",
                    comment: "Entregable creado"
                }
            ]
        };

        // Crear Task en ERPNext (opcional, no bloquea si falla)
        const erpTaskId = await createErpNextTask(newDeliverable);
        if (erpTaskId) {
            newDeliverable.erpTaskId = erpTaskId;
        }

        const list = db.read('deliverables') || [];
        db.write('deliverables', [newDeliverable, ...list]);

        // Enviar webhook para automatizaciones
        sendWebhook('deliverable.created', {
            deliverable: newDeliverable,
            erpSynced: !!erpTaskId
        }).catch(console.error);

        return NextResponse.json({ success: true, deliverable: newDeliverable });

    } catch (error) {
        console.error("API Deliverables POST Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        if (!(await isAuthenticated(request))) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: "ID required" }, { status: 400 });
        }

        const list = db.read<any>('deliverables') || [];
        const index = list.findIndex((d: any) => d.id === id);

        if (index === -1) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const oldDeliverable = list[index];
        const statusChanged = updates.status && updates.status !== oldDeliverable.status;

        // Actualizar en local
        list[index] = { ...oldDeliverable, ...updates };
        db.write('deliverables', list);

        // Sincronizar con ERPNext si hay Task asociada
        if (oldDeliverable.erpTaskId) {
            updateErpNextTask(oldDeliverable.erpTaskId, updates).catch(console.error);
        }

        // Enviar webhook apropiado
        if (statusChanged) {
            if (updates.status === 'approved') {
                sendWebhook('deliverable.approved', {
                    deliverable: list[index],
                    approvedAt: new Date().toISOString()
                }).catch(console.error);
            } else if (updates.status === 'changes_requested') {
                sendWebhook('deliverable.changes_requested', {
                    deliverable: list[index],
                    feedback: updates.feedback || body.comment
                }).catch(console.error);
            }
        }

        return NextResponse.json({ success: true, deliverable: list[index] });

    } catch (error) {
        console.error("API Deliverables PUT Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
