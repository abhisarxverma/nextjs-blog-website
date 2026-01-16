import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
    const { pathname } = request.nextUrl;

    // 1. Avoid redirecting if the user is already on the login page
    if (pathname.startsWith("/auth/login")) {
        return NextResponse.next();
    }

    // 2. Optimistic session check
    if (!sessionCookie) {
        // Use a 303 status to prevent the browser from caching the redirect
        return NextResponse.redirect(new URL("/auth/login", request.url), {
            status: 303 
        });
    }

    // 3. Optional: Clear middleware cache headers to ensure fresh checks
    const response = NextResponse.next();
    response.headers.set("x-middleware-cache", "no-cache");
    return response;
}

export const config = {
  matcher: ["/create", "/blog"],
};
