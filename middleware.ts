import { NextResponse } from "next/server";
import { account } from "./lib/appwrite";

export async function middleware(req: any) {
  const pathname = req.nextUrl.pathname;

  const authPages = ["/login", "/register"];

  try {
    await account.get();

    // Logged in → block login & register pages
    if (authPages.includes(pathname)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } catch {
    // Not logged in → allow login/register but block private pages
    if (!authPages.includes(pathname) && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}
