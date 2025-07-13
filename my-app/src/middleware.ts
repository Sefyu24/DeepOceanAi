import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/dashboard", "/dashboard/*", "/chat"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(p.replace("/*", ""))
  );

  if (!isProtected) return NextResponse.next();

  // Check for better-auth session cookie
  const sessionToken = request.cookies.get("better-auth.session_token");

  if (!sessionToken) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/chat"],
};
