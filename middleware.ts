import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // 🔥 Check ANY Appwrite session cookie
  const hasSession = request.cookies
  .getAll()
  .some((cookie) => cookie.name.startsWith("a_session_"));


  if (hasSession && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register"],
};
