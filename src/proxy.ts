// src/proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  const isLoginPage = req.nextUrl.pathname === "/admin/login";
  const session = req.cookies.get("admin_session")?.value;
  const adminPassword = process.env.ADMIN_PASSWORD;

  const isValid = await verifyAdminSessionToken(session, adminPassword);

  if (!isLoginPage && !isValid) {
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && isValid) {
    const adminUrl = new URL("/admin", req.url);
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
