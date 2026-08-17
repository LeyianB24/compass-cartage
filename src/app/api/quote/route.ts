// src/app/api/quote/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { put } from "@vercel/blob";
import { renderToBuffer } from "@react-pdf/renderer";
import QuotePdf from "@/lib/QuotePdf";
import { prisma } from "@/lib/prisma";

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Missing RESEND_API_KEY environment variable");
  return new Resend(apiKey);
};

// -----------------------------------------------------------------------------
// Rate Limiter
// -----------------------------------------------------------------------------
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

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
  if (record.count >= MAX_REQUESTS_PER_WINDOW) return true;
  record.count += 1;
  return false;
}

// -----------------------------------------------------------------------------
// Validation
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

const MAX_PHOTOS = 5;
const MAX_PHOTO_SIZE = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: NextRequest) {
  try {
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "Too many quote requests. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    // Parse multipart form data instead of JSON — needed for file uploads
    const form = await req.formData().catch(() => null);
    if (!form) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const rawFields = {
      name: form.get("name")?.toString() || "",
      email: form.get("email")?.toString() || "",
      phone: form.get("phone")?.toString() || "",
      pickupAddress: form.get("pickupAddress")?.toString() || "",
      dropoffAddress: form.get("dropoffAddress")?.toString() || "",
      moveDate: form.get("moveDate")?.toString() || "",
      moveSize: form.get("moveSize")?.toString() || "",
      notes: form.get("notes")?.toString() || "",
    };

    const validation = quoteSchema.safeParse(rawFields);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Invalid input";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }
    const data = validation.data;

    // Validate and upload photos
    const photoFiles = form.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);

    if (photoFiles.length > MAX_PHOTOS) {
      return NextResponse.json({ error: `Maximum ${MAX_PHOTOS} photos allowed` }, { status: 400 });
    }
    for (const file of photoFiles) {
      if (file.size > MAX_PHOTO_SIZE) {
        return NextResponse.json({ error: `Photo "${file.name}" exceeds 8MB` }, { status: 400 });
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: `Unsupported photo type: ${file.type}` }, { status: 400 });
      }
    }

    const photoUrls: string[] = [];
    for (const file of photoFiles) {
      const rawExt = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const safeKey = `quote-photos/${Date.now()}-${crypto.randomUUID()}.${rawExt}`;
      const blob = await put(safeKey, file, {
        access: "public",
      });
      photoUrls.push(blob.url);
    }

    // Save to database — source of truth, independent of email success
    const savedRequest = await prisma.quoteRequest.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        pickupAddress: data.pickupAddress,
        dropoffAddress: data.dropoffAddress,
        moveDate: data.moveDate,
        moveSize: data.moveSize,
        notes: data.notes,
        photoUrls,
      },
    });

    const resend = getResendClient();
    const senderEmail = process.env.SENDER_EMAIL || "Compass Cartage <onboarding@resend.dev>";
    const recipientEmail = process.env.CONTACT_EMAIL || "compasscartage@gmail.com";

    const safeName = escapeHtml(data.name);
    const safePhone = escapeHtml(data.phone);
    const safeEmail = escapeHtml(data.email);
    const safePickup = escapeHtml(data.pickupAddress);
    const safeDropoff = escapeHtml(data.dropoffAddress);
    const safeDate = escapeHtml(data.moveDate);
    const safeSize = escapeHtml(data.moveSize);
    const safeNotes = escapeHtml(data.notes).replace(/\n/g, "<br/>");

    const submittedAt = new Date().toLocaleString("en-CA", { dateStyle: "long", timeStyle: "short" });

    const pdfBuffer = await renderToBuffer(
      QuotePdf({
        data: {
          name: data.name,
          phone: data.phone,
          email: data.email,
          pickupAddress: data.pickupAddress,
          dropoffAddress: data.dropoffAddress,
          moveDate: data.moveDate,
          moveSize: data.moveSize,
          notes: data.notes,
          submittedAt,
        },
      })
    );
    const pdfAttachment = { filename: `compass-cartage-quote-${Date.now()}.pdf`, content: pdfBuffer };

    const photoLinksHtml = photoUrls.length
      ? `<p><strong>Photos:</strong><br/>${photoUrls
          .map((url, i) => `<a href="${url}" target="_blank">Photo ${i + 1}</a>`)
          .join(" &middot; ")}</p>`
      : "";

    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f7f6f2; color: #071426; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e3e1da;">
            <h2 style="color: #071426; border-bottom: 2px solid #c9a227; padding-bottom: 10px; margin-top: 0;">New Quote Request</h2>
            <p><strong>Client Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color: #0b1f3a;">${safeEmail}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${safePhone}" style="color: #0b1f3a;">${safePhone}</a></p>
            <hr style="border: none; border-top: 1px solid #e3e1da; margin: 20px 0;" />
            <p><strong>Moving From:</strong> ${safePickup}</p>
            <p><strong>Moving To:</strong> ${safeDropoff}</p>
            <p><strong>Preferred Date:</strong> ${safeDate}</p>
            <p><strong>Move Size:</strong> ${safeSize}</p>
            ${photoLinksHtml}
            <hr style="border: none; border-top: 1px solid #e3e1da; margin: 20px 0;" />
            <p><strong>Notes / Special Instructions:</strong></p>
            <div style="background-color: #f7f6f2; padding: 15px; border-radius: 6px; border-left: 4px solid #c9a227;">${safeNotes}</div>
            <p style="color:#8792a2;font-size:12px;margin-top:20px;">A branded PDF summary is attached.</p>
          </div>
        </body>
      </html>
    `;

    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f7f6f2; color: #071426; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e3e1da;">
            <h2 style="color: #071426; border-bottom: 2px solid #c9a227; padding-bottom: 10px; margin-top: 0;">We Received Your Moving Quote Request!</h2>
            <p>Hi ${safeName},</p>
            <p>Thank you for reaching out to <strong>Compass Cartage</strong>. We&rsquo;ve received your quote request and our team is currently reviewing your details.</p>
            <p>We will get back to you within 24 hours with a detailed estimate.</p>
            <div style="background-color: #f7f6f2; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0 0 8px 0;"><strong>Summary of your details:</strong></p>
              <ul style="margin: 0; padding-left: 20px;">
                <li><strong>Pickup:</strong> ${safePickup}</li>
                <li><strong>Drop-off:</strong> ${safeDropoff}</li>
                <li><strong>Preferred Date:</strong> ${safeDate}</li>
              </ul>
            </div>
            <p style="color:#4a5568;font-size:13px;">A PDF copy of your submitted details is attached for your records.</p>
            <p>If you need to make urgent changes, simply reply to this email or call our team directly.</p>
            <p style="margin-top: 30px; color: #4a5568; font-size: 0.9em;">Best regards,<br/><strong>Compass Cartage Team</strong></p>
          </div>
        </body>
      </html>
    `;

    try {
      await Promise.all([
        resend.emails.send({
          from: senderEmail,
          to: recipientEmail,
          replyTo: data.email,
          subject: `New Quote Request — ${data.name} (${data.moveSize})`,
          html: adminEmailHtml,
          attachments: [pdfAttachment],
        }),
        resend.emails.send({
          from: senderEmail,
          to: data.email,
          subject: "We've received your quote request | Compass Cartage",
          html: customerEmailHtml,
          attachments: [pdfAttachment],
        }),
      ]);
    } catch (emailErr) {
      console.error("Email sending failed (request still saved):", emailErr);
    }

    return NextResponse.json(
      { success: true, message: "Quote request submitted successfully.", id: savedRequest.id },
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