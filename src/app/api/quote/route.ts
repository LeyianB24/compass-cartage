// src/app/api/quote/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

// Lazy-initialize Resend client to avoid build-time environment variable errors
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY environment variable");
  }
  return new Resend(apiKey);
};

// -----------------------------------------------------------------------------
// 1. In-Memory Rate Limiter (Basic DDoS & Spam Protection)
// -----------------------------------------------------------------------------
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5; // Max 5 requests per IP every 15 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }

  if (now - record.lastReset > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  record.count += 1;
  return false;
}

// -----------------------------------------------------------------------------
// 2. Strict Zod Validation Schema
// -----------------------------------------------------------------------------
const quoteSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address"),
  phone: z.string().trim().min(7, "Invalid phone number").max(20),
  pickupAddress: z.string().trim().min(3, "Pickup address is required").max(300),
  dropoffAddress: z.string().trim().min(3, "Drop-off address is required").max(300),
  moveDate: z.string().trim().optional().default("Not specified"),
  moveSize: z.string().trim().optional().default("Not specified"),
  notes: z.string().trim().max(2000, "Notes cannot exceed 2000 characters").optional().default("None"),
});

// -----------------------------------------------------------------------------
// 3. HTML Escaping Utility
// -----------------------------------------------------------------------------
function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// -----------------------------------------------------------------------------
// 4. API Route Handler
// -----------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    // A. Check Client IP & Apply Rate Limiting
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "Too many quote requests. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    // B. Parse Request Body
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // C. Validate Input Against Zod Schema
    const validation = quoteSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Invalid input";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const data = validation.data;
    const resend = getResendClient();

    // Environment Configurations
    const senderEmail = process.env.SENDER_EMAIL || "Compass Cartage <onboarding@resend.dev>";
    const recipientEmail = process.env.CONTACT_EMAIL || "compasscartage@gmail.com";

    // Safe Escaped Values
    const safeName = escapeHtml(data.name);
    const safePhone = escapeHtml(data.phone);
    const safeEmail = escapeHtml(data.email);
    const safePickup = escapeHtml(data.pickupAddress);
    const safeDropoff = escapeHtml(data.dropoffAddress);
    const safeDate = escapeHtml(data.moveDate);
    const safeSize = escapeHtml(data.moveSize);
    const safeNotes = escapeHtml(data.notes).replace(/\n/g, "<br/>");

    // D. Email Template (Internal Notification)
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f7f6f2; color: #071426; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e3e1da;">
            <h2 style="color: #071426; border-bottom: 2px solid #c9a227; padding-bottom: 10px; margin-top: 0;">
              New Quote Request
            </h2>
            <p><strong>Client Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color: #0b1f3a;">${safeEmail}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${safePhone}" style="color: #0b1f3a;">${safePhone}</a></p>
            <hr style="border: none; border-top: 1px solid #e3e1da; margin: 20px 0;" />
            <p><strong>Moving From:</strong> ${safePickup}</p>
            <p><strong>Moving To:</strong> ${safeDropoff}</p>
            <p><strong>Preferred Date:</strong> ${safeDate}</p>
            <p><strong>Move Size:</strong> ${safeSize}</p>
            <hr style="border: none; border-top: 1px solid #e3e1da; margin: 20px 0;" />
            <p><strong>Notes / Special Instructions:</strong></p>
            <div style="background-color: #f7f6f2; padding: 15px; border-radius: 6px; border-left: 4px solid #c9a227;">
              ${safeNotes}
            </div>
          </div>
        </body>
      </html>
    `;

    // E. Email Template (Customer Auto-Confirmation)
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f7f6f2; color: #071426; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e3e1da;">
            <h2 style="color: #071426; border-bottom: 2px solid #c9a227; padding-bottom: 10px; margin-top: 0;">
              We Received Your Moving Quote Request!
            </h2>
            <p>Hi ${safeName},</p>
            <p>Thank you for reaching out to <strong>Compass Cartage</strong>. We’ve received your quote request and our team is currently reviewing your details.</p>
            <p>We will get back to you within 24 hours with a detailed estimate.</p>
            <div style="background-color: #f7f6f2; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0 0 8px 0;"><strong>Summary of your details:</strong></p>
              <ul style="margin: 0; padding-left: 20px;">
                <li><strong>Pickup:</strong> ${safePickup}</li>
                <li><strong>Drop-off:</strong> ${safeDropoff}</li>
                <li><strong>Preferred Date:</strong> ${safeDate}</li>
              </ul>
            </div>
            <p>If you need to make urgent changes, simply reply to this email or call our team directly.</p>
            <p style="margin-top: 30px; color: #4a5568; font-size: 0.9em;">Best regards,<br/><strong>Compass Cartage Team</strong></p>
          </div>
        </body>
      </html>
    `;

    // F. Dispatch Emails via Resend
    await Promise.all([
      // Email 1: To the business owner/dispatch team
      resend.emails.send({
        from: senderEmail,
        to: recipientEmail,
        replyTo: data.email,
        subject: `New Quote Request — ${data.name} (${data.moveSize})`,
        html: adminEmailHtml,
      }),
      // Email 2: Instant confirmation receipt to the customer
      resend.emails.send({
        from: senderEmail,
        to: data.email,
        subject: "We've received your quote request | Compass Cartage",
        html: customerEmailHtml,
      }),
    ]);

    return NextResponse.json(
      { success: true, message: "Quote request submitted successfully." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Quote form processing error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}