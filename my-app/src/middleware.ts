import { NextResponse } from "next/server";
import { auth } from "@/utils/auth";

const protectedPaths = ["/dashboard", "/dashboard/*", "/chat"];

export async function middleware(request: Request) {
  const { pathname } = new URL(request.url);
  const isProtected = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(p.replace("/*", ""))
  );

  if (!isProtected) return NextResponse.next();

  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/chat"],
};
