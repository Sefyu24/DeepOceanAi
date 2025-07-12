// middleware.ts  (at project root)
import { NextResponse } from "next/server";
import { auth } from "@/utils/auth"; // your Better-Auth instance

// Routes that must be logged in:
const protectedPaths = ["/dashboard", "/dashboard/*"];

export async function middleware(request: Request) {
  console.log("middle ware running!");
  const { pathname } = new URL(request.url);
  const isProtected = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(p.replace("/*", ""))
  );

  if (!isProtected) return NextResponse.next();

  // Ask Better-Auth if the request carries a valid session
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    // redirect to sign-up (or sign-in)
    const url = new URL("/signup", request.url);
    url.searchParams.set("redirect", pathname); // optional deep-link back
    return NextResponse.redirect(url);
  }

  // user is authenticated → continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"], // ← reduces overhead
};
