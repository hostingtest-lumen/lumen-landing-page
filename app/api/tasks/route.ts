import { NextResponse } from "next/server";

const API_URL = process.env.ERPNEXT_URL;
const API_KEY = process.env.ERPNEXT_API_KEY;
const API_SECRET = process.env.ERPNEXT_API_SECRET;

const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `token ${API_KEY}:${API_SECRET}`,
});

export async function GET() {
    try {
        if (!API_URL || !API_KEY || !API_SECRET) {
            return NextResponse.json({ error: "Configuración de servidor incompleta" }, { status: 500 });
        }

        // Obtener tareas usando el doctype TASK (más avanzado que ToDo)
        const response = await fetch(
            `${API_URL}/api/resource/Task?fields=["name","subject","description","status","priority","exp_end_date","_assign","project"]&order_by=creation desc&limit_page_length=50`,
            { method: "GET", headers: getHeaders() }
        );

        if (!response.ok) {
            console.error("Error fetching tasks:", await response.text());
            return NextResponse.json({ error: "Error al obtener tareas" }, { status: response.status });
        }

        const data = await response.json();

        // Transformar datos para Lumen Tasks 2.0
        const tasks = (data.data || []).map((task: any) => ({
            id: task.name,
            title: task.subject,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: task.exp_end_date,
            assignedTo: task._assign ? JSON.parse(task._assign)[0] : null,
            project: task.project
        }));

        return NextResponse.json({ tasks });
    } catch (error) {
        console.error("Critical error in Tasks API:", error);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, priority, dueDate, assignedTo, status } = body;

        if (!title) {
            return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 });
        }

        const taskData = {
            subject: title,
            description: description || "",
            status: status || "Open",
            priority: priority || "Medium",
            exp_end_date: dueDate || null,
            _assign: assignedTo ? JSON.stringify([assignedTo]) : null
        };

        const response = await fetch(`${API_URL}/api/resource/Task`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(taskData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error creating task:", errorText);
            return NextResponse.json({ error: "Error al crear tarea", details: errorText }, { status: response.status });
        }

        const result = await response.json();
        return NextResponse.json({ success: true, task: result.data });

    } catch (error) {
        console.error("Error creating task:", error);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) return NextResponse.json({ error: "ID de tarea requerido" }, { status: 400 });

        // Mapeo de campos frontend a backend
        const erpUpdateData: any = {};
        if (updateData.title) erpUpdateData.subject = updateData.title;
        if (updateData.description !== undefined) erpUpdateData.description = updateData.description;
        if (updateData.status) erpUpdateData.status = updateData.status;
        if (updateData.priority) erpUpdateData.priority = updateData.priority;
        if (updateData.dueDate !== undefined) erpUpdateData.exp_end_date = updateData.dueDate;
        if (updateData.assignedTo) erpUpdateData._assign = JSON.stringify([updateData.assignedTo]);

        const response = await fetch(`${API_URL}/api/resource/Task/${id}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(erpUpdateData),
        });

        if (!response.ok) {
            return NextResponse.json({ error: "Error al actualizar tarea" }, { status: response.status });
        }

        const result = await response.json();
        return NextResponse.json({ success: true, task: result.data });

    } catch (error) {
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}
