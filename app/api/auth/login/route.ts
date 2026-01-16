import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUsers } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        // 1. Get Users from "DB"
        const users = await getUsers();

        // 2. Validate Credentials
        const user = users.find((u: any) => u.username === username && u.password === password);

        if (!user) {
            return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
        }

        // 3. Create Session
        const sessionData = {
            username: user.username,
            role: user.role,
            name: user.name
        };

        const cookieStore = await cookies();
        cookieStore.set("lumen_session", JSON.stringify(sessionData), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });

        return NextResponse.json({ success: true, role: user.role });

    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
