// src/proxy.ts
import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const isLoginPage = req.nextUrl.pathname === "/admin/login";
  const session = req.cookies.get("admin_session")?.value;

  if (!isLoginPage && session !== process.env.ADMIN_PASSWORD) {
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};