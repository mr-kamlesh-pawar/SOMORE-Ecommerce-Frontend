// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Auth pages
  const isAuthPage = 
    pathname.startsWith("/login") || 
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/verify-pending");

  // Check Appwrite session cookie
  const hasSession = request.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith("a_session_"));

  // 🔥 If logged in and trying to access auth pages, redirect to home
  if (hasSession && isAuthPage) {
    // Except verify-pending if coming from verification flow
    if (pathname.startsWith("/verify-pending")) {
      const email = request.nextUrl.searchParams.get("email");
      if (email) {
        // Allow access to verify-pending with email param
        return NextResponse.next();
      }
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 🔥 Protected pages that require login
  const protectedPages = [
    "/account",
    "/checkout",
    "/settings",
    "/admin",
  ];

  const isProtectedPage = protectedPages.some(page => pathname.startsWith(page));

  // If trying to access protected page without session, redirect to login
  if (isProtectedPage && !hasSession) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/forgot-password",
    "/verify-pending",
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/admin/:path*",
  ],
};