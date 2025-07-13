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

  // Debug: log all cookies and environment info
  console.log(
    `[Middleware Debug] Environment: ${
      isProduction ? "PRODUCTION" : "DEVELOPMENT"
    }`
  );
  console.log(`[Middleware Debug] Protocol: ${request.nextUrl.protocol}`);
  console.log(`[Middleware Debug] Looking for cookie: ${cookieName}`);
  console.log(
    `[Middleware Debug] All cookies:`,
    Object.fromEntries(request.cookies.getAll().map((c) => [c.name, c.value]))
  );

  const sessionToken = request.cookies.get(cookieName);
  const fallbackToken = request.cookies.get(
    isProduction
      ? "better-auth.session_token"
      : "__Secure-better-auth.session_token"
  );

  if (!sessionToken && !fallbackToken) {
    console.log(`[Middleware Debug] No session cookie found`);
    const url = new URL("/signin", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  const activeToken = sessionToken || fallbackToken;
  console.log(
    `[Middleware Debug] Found token: ${activeToken?.value ? "YES" : "NO"}`
  );

  // Validate the session token by calling the better-auth session endpoint
  try {
    const baseUrl = request.nextUrl.origin;
    const response = await fetch(`${baseUrl}/api/auth/get-session`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    if (!response.ok) {
      console.log("Session invalid, status:", response.status);
      const url = new URL("/signin", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    const session = await response.json();
    console.log("Session response:", session);
    
    // Better Auth returns the user directly, not nested in .data
    if (!session?.user) {
      console.log("No user found in session");
      const url = new URL("/signin", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    console.log("User authenticated successfully:", session.user.email);

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
