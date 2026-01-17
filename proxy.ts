import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // 1. Routes that require Authentication
    if (path.startsWith("/dashboard")) {
        const sessionCookie = request.cookies.get("lumen_session");

        if (!sessionCookie) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        try {
            const session = JSON.parse(sessionCookie.value);
            // Simple role check for admin routes
            if (path.startsWith("/dashboard/admin") && session.role !== "admin") {
                return NextResponse.redirect(new URL("/dashboard", request.url));
            }
        } catch (e) {
            // Invalid cookie
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // 2. Redirect /team/login -> /login (Legacy support/Cleanup)
    if (path.startsWith("/team/login")) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
