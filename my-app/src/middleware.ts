import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/dashboard", "/dashboard/*", "/chat"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(p.replace("/*", ""))
  );

  if (!isProtected) return NextResponse.next();

  // Check for better-auth session cookie
  // In production (HTTPS), the cookie name has __Secure- prefix
  // In development (HTTP), it doesn't have the prefix
  const isProduction = request.nextUrl.protocol === "https:";
  const cookieName = isProduction
    ? "__Secure-better-auth.session_token"
    : "better-auth.session_token";

  const sessionToken = request.cookies.get(cookieName);
  const fallbackToken = request.cookies.get(
    isProduction
      ? "better-auth.session_token"
      : "__Secure-better-auth.session_token"
  );

  if (!sessionToken && !fallbackToken) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Validate the session token by calling the better-auth session endpoint
  try {
    const baseUrl = request.nextUrl.origin;
    const response = await fetch(`${baseUrl}/api/auth/get-session`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    if (!response.ok) {
      const url = new URL("/signin", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    const session = await response.json();
    
    if (!session?.user) {
      const url = new URL("/signin", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Session validation error:", error);
    // On error, redirect to signin for security
    const url = new URL("/signin", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/chat"],
};
