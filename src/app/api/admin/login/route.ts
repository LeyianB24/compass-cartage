// src/app/api/admin/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateAdminSessionToken } from "@/lib/auth";

const loginAttempts = new Map<string, { count: number; lastAttempt: number; lockedUntil: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_PERIOD_MS = 15 * 60 * 1000; // 15 mins

function checkLoginRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now, lockedUntil: 0 });
    return false;
  }
  if (record.lockedUntil > now) return true;
  if (now - record.lastAttempt > LOCKOUT_PERIOD_MS) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now, lockedUntil: 0 });
    return false;
  }
  record.count += 1;
  record.lastAttempt = now;
  if (record.count > MAX_LOGIN_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_PERIOD_MS;
    return true;
  }
  return false;
}

export async function POST(req: NextRequest) {
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  if (checkLoginRateLimit(clientIp)) {
    return NextResponse.json(
      { error: "Too many failed login attempts. Please try again in 15 minutes." },
      { status: 429 }
    );
  }

  const { password } = await req.json().catch(() => ({ password: "" }));

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Admin password not configured" }, { status: 500 });
  }

  const expectedPassword = process.env.ADMIN_PASSWORD;
  const passwordStr = String(password || "");

  // Constant time string comparison
  let isMatch = passwordStr.length === expectedPassword.length;
  let diff = 0;
  for (let i = 0; i < Math.max(passwordStr.length, expectedPassword.length); i++) {
    const charA = passwordStr.charCodeAt(i) || 0;
    const charB = expectedPassword.charCodeAt(i) || 0;
    diff |= charA ^ charB;
  }
  if (diff !== 0) isMatch = false;

  if (!isMatch) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  // Reset rate limit on success
  loginAttempts.delete(clientIp);

  const sessionToken = await generateAdminSessionToken(expectedPassword);

  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}