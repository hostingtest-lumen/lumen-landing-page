import { NextResponse } from "next/server";
import { getUsers, addUser } from "@/lib/db";
import { cookies } from "next/headers";

// Helper to check admin permission
async function isAdmin() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("lumen_session");
    if (!sessionCookie) return false;
    try {
        const session = JSON.parse(sessionCookie.value);
        return session.role === "admin";
    } catch { return false; }
}

export async function GET() {
    if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const users = await getUsers();
    // Return users without passwords for security
    const safeUsers = users.map(({ password, ...u }: any) => u);
    return NextResponse.json(safeUsers);
}

export async function POST(request: Request) {
    if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await request.json();
        const { name, username, password, role } = body;

        if (!name || !username || !password || !role) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const newUser = {
            id: Date.now().toString(),
            name,
            username,
            password,
            role,
            avatar: name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
        };

        await addUser(newUser);

        return NextResponse.json({ success: true, user: newUser });
    } catch (e) {
        return NextResponse.json({ error: "Error creating user" }, { status: 500 });
    }
}
