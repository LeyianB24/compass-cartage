// src/lib/auth.ts
import { cookies } from "next/headers";

export async function generateAdminSessionToken(adminPassword: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(adminPassword),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode("admin_authenticated_session")
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyAdminSessionToken(
  token: string | undefined | null,
  adminPassword: string | undefined
): Promise<boolean> {
  if (!token || !adminPassword) return false;
  const expectedToken = await generateAdminSessionToken(adminPassword);
  if (token.length !== expectedToken.length) return false;

  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ expectedToken.charCodeAt(i);
  }
  return result === 0;
}

export async function verifyAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  const adminPassword = process.env.ADMIN_PASSWORD;
  return verifyAdminSessionToken(session, adminPassword);
}
