// src/app/api/quote/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { put } from "@vercel/blob";
import { renderToBuffer } from "@react-pdf/renderer";
import QuotePdf from "@/lib/QuotePdf";
import { prisma } from "@/lib/prisma";
import { generateNextQuoteNumber } from "@/lib/quoteNumber";
import { logActivity } from "@/lib/activityLogger";

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

    const distanceKmRaw = form.get("distanceKm")?.toString();
    const distanceFeeRaw = form.get("distanceFee")?.toString();
    const pricingTierRaw = form.get("pricingTier")?.toString();
    const estimatedPriceRaw = form.get("estimatedPrice")?.toString();

    const distanceKm = distanceKmRaw ? parseFloat(distanceKmRaw) : null;
    const distanceFee = distanceFeeRaw ? parseFloat(distanceFeeRaw) : null;
    const pricingTier = pricingTierRaw || "Standard Full-Service";
    const estimatedPrice = estimatedPriceRaw ? parseFloat(estimatedPriceRaw) : null;

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

    // Generate sequential quote number (e.g. CC-2026-1001)
    const quoteNumber = await generateNextQuoteNumber();

    // Save to database — source of truth with distance, tier pricing, and quoteNumber
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const savedRequest = await (prisma.quoteRequest.create as any)({
      data: {
        quoteNumber,
        name: data.name,
        phone: data.phone,
        email: data.email,
        pickupAddress: data.pickupAddress,
        dropoffAddress: data.dropoffAddress,
        moveDate: data.moveDate,
        moveSize: data.moveSize,
        distanceKm,
        distanceFee,
        pricingTier,
        estimatedPrice,
        notes: data.notes,
        photoUrls,
      },
    });

    // Record submission audit log
    await logActivity({
      action: "QUOTE_SUBMITTED",
      category: "QUOTE",
      quoteNumber,
      quoteRequestId: savedRequest?.id,
      actor: "Client",
      title: `New Quote Request #${quoteNumber} Logged`,
      details: `${data.name} (${data.phone}) submitted relocation intake from ${data.pickupAddress} to ${data.dropoffAddress}. Scope: ${data.moveSize || "N/A"}, Tier: ${pricingTier || "Standard"}, Est: $${Math.round(estimatedPrice || 0)}.`,
      metadata: {
        quoteNumber,
        pickupAddress: data.pickupAddress,
        dropoffAddress: data.dropoffAddress,
        distanceKm,
        estimatedPrice,
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
    const safeTier = escapeHtml(pricingTier);
    const safeNotes = escapeHtml(data.notes).replace(/\n/g, "<br/>");

    const submittedAt = new Date().toLocaleString("en-CA", { dateStyle: "long", timeStyle: "short" });

    const pdfBuffer = await renderToBuffer(
      QuotePdf({
        data: {
          quoteId: savedRequest?.id,
          quoteNumber,
          name: data.name,
          phone: data.phone,
          email: data.email,
          pickupAddress: data.pickupAddress,
          dropoffAddress: data.dropoffAddress,
          moveDate: data.moveDate,
          moveSize: data.moveSize,
          distanceKm: distanceKm || undefined,
          distanceFee: distanceFee || undefined,
          pricingTier,
          estimatedPrice: estimatedPrice || undefined,
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

    const pricingSummaryHtml = `
      <div style="background-color: #f4f6f8; border-left: 4px solid #c5a880; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
        <p style="margin: 0 0 6px 0;"><strong>Selected Price Tier:</strong> ${safeTier}</p>
        <p style="margin: 0 0 6px 0;"><strong>Route Distance:</strong> ${distanceKm ? `~${distanceKm} km` : "Local Metro"}</p>
        <p style="margin: 0 0 6px 0;"><strong>Distance Travel Fee:</strong> ${distanceFee ? `$${distanceFee.toFixed(2)}` : "$0.00 (Local Metro Included)"}</p>
        ${estimatedPrice ? `<p style="margin: 6px 0 0 0; font-size: 16px; color: #0a131f;"><strong>Total Estimate: $${Math.round(estimatedPrice)}</strong></p>` : ""}
      </div>
    `;

    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #070c14; color: #334155; margin: 0; padding: 24px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
            <div style="background-color: #0a131f; padding: 20px 24px; border-bottom: 3px solid #c5a880;">
              <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                <tr>
                  <td style="vertical-align: middle; width: 60px; padding-right: 14px;">
                    <img src="https://compass-cartage.vercel.app/logos/logo%20Compass%20Cartage.png" alt="Compass Cartage" width="56" height="31" style="display: block; border-radius: 4px; object-fit: contain;" />
                  </td>
                  <td style="vertical-align: middle;">
                    <h1 style="color: #c5a880; margin: 0; font-size: 18px; letter-spacing: 0.05em; text-transform: uppercase;">Compass Cartage</h1>
                    <p style="color: #ffffff; margin: 3px 0 0 0; font-size: 13px;">Dispatch Notification &bull; New Quote Lead</p>
                  </td>
                </tr>
              </table>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #0a131f; margin-top: 0; font-size: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Customer Profile</h2>
              <p style="margin: 6px 0;"><strong>Client Name:</strong> ${safeName}</p>
              <p style="margin: 6px 0;"><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color: #c5a880; font-weight: bold;">${safeEmail}</a></p>
              <p style="margin: 6px 0;"><strong>Direct Phone:</strong> <a href="tel:${safePhone}" style="color: #0a131f; font-weight: bold;">${safePhone}</a></p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <h2 style="color: #0a131f; font-size: 16px; margin-bottom: 10px;">Route & Move Scope</h2>
              <p style="margin: 6px 0;"><strong>Origin / Pickup:</strong> ${safePickup}</p>
              <p style="margin: 6px 0;"><strong>Destination / Drop-off:</strong> ${safeDropoff}</p>
              <p style="margin: 6px 0;"><strong>Preferred Date:</strong> ${safeDate}</p>
              <p style="margin: 6px 0;"><strong>Home / Move Size:</strong> ${safeSize}</p>
              ${pricingSummaryHtml}
              ${photoLinksHtml}
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: bold; color: #0a131f;">Special Instructions / Inventory Notes:</p>
              <div style="background-color: #f8f9fa; padding: 14px; border-radius: 6px; border-left: 4px solid #c5a880; font-size: 13px; line-height: 1.5;">${safeNotes}</div>
              <p style="color: #64748b; font-size: 12px; margin-top: 24px; border-top: 1px solid #e2e8f0; pt: 16px;">Itemized PDF summary is attached for immediate review.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8f9fa; color: #334155; margin: 0; padding: 24px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
            <div style="background-color: #0a131f; padding: 20px 24px; border-bottom: 3px solid #c5a880;">
              <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                <tr>
                  <td style="vertical-align: middle; width: 60px; padding-right: 14px;">
                    <img src="https://compass-cartage.vercel.app/logos/logo%20Compass%20Cartage.png" alt="Compass Cartage" width="56" height="31" style="display: block; border-radius: 4px; object-fit: contain;" />
                  </td>
                  <td style="vertical-align: middle;">
                    <h1 style="color: #c5a880; margin: 0; font-size: 18px; letter-spacing: 0.05em; text-transform: uppercase;">Compass Cartage</h1>
                    <p style="color: #ffffff; margin: 3px 0 0 0; font-size: 13px;">Precision Relocation &bull; Edmonton & Alberta</p>
                  </td>
                </tr>
              </table>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #0a131f; margin-top: 0; font-size: 18px;">We&rsquo;ve Received Your Moving Quote Request!</h2>
              <p style="font-size: 14px; line-height: 1.6;">Hi ${safeName},</p>
              <p style="font-size: 14px; line-height: 1.6;">Thank you for choosing <strong>Compass Cartage</strong>. We have logged your relocation details and our team is currently preparing your dedicated crew and fleet assignment.</p>
              <p style="font-size: 14px; line-height: 1.6;">We will review your access conditions and follow up within <strong>24 hours</strong> with guaranteed rate availability.</p>
              
              <div style="background-color: #f8f9fa; border: 1px solid #e2e8f0; border-left: 4px solid #c5a880; padding: 18px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; font-weight: bold; color: #0a131f; font-size: 14px;">Summary of Submitted Move Details:</p>
                <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.7; color: #334155;">
                  <li><strong>Pickup:</strong> ${safePickup}</li>
                  <li><strong>Drop-off:</strong> ${safeDropoff}</li>
                  <li><strong>Preferred Date:</strong> ${safeDate}</li>
                  <li><strong>Scope / Size:</strong> ${safeSize}</li>
                  <li><strong>Service Tier:</strong> ${safeTier}</li>
                  ${distanceKm ? `<li><strong>Route Distance:</strong> ~${distanceKm} km</li>` : ""}
                  ${distanceFee !== null && distanceFee > 0 ? `<li><strong>Distance Travel Fee:</strong> $${distanceFee.toFixed(2)}</li>` : "<li><strong>Distance Travel Fee:</strong> Included (Local Metro)</li>"}
                  ${estimatedPrice ? `<li><strong>Upfront Estimate:</strong> $${Math.round(estimatedPrice)} CAD</li>` : ""}
                </ul>
              </div>

              <p style="color: #475569; font-size: 13px; line-height: 1.5;">
                A PDF copy of your submitted quote request is attached to this email for your records.
              </p>
              <p style="color: #475569; font-size: 13px; line-height: 1.5;">
                Have questions or need to make adjustments to your inventory? Reply directly to this email or call our Edmonton dispatch team at <strong>(780) 900-3490</strong>.
              </p>
              <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                <p style="margin: 0; color: #0a131f; font-size: 14px; font-weight: bold;">Compass Cartage Team</p>
                <p style="margin: 4px 0 0 0; color: #64748b; font-size: 12px;">Licensed &bull; Cargo Insured &bull; One Trusted Crew</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      const [adminResult, customerResult] = await Promise.allSettled([
        resend.emails.send({
          from: senderEmail,
          to: recipientEmail,
          replyTo: data.email,
          subject: `[Dispatch Lead] Quote #${quoteNumber} — ${data.name} (${data.moveSize || "Move"})`,
          html: adminEmailHtml,
          attachments: [pdfAttachment],
        }),
        resend.emails.send({
          from: senderEmail,
          to: data.email,
          subject: `Your Compass Cartage Quote #${quoteNumber} & Relocation Estimate`,
          html: customerEmailHtml,
          attachments: [pdfAttachment],
        }),
      ]);

      const emailSuccess = adminResult.status === "fulfilled" || customerResult.status === "fulfilled";
      await logActivity({
        action: "EMAIL_DISPATCHED",
        category: "EMAIL",
        quoteNumber,
        quoteRequestId: savedRequest?.id,
        actor: "System",
        title: `Quote #${quoteNumber} Notifications Dispatched`,
        details: `Admin send: ${adminResult.status === "fulfilled" ? "Delivered" : "Failed"}. Customer send: ${customerResult.status === "fulfilled" ? "Delivered" : "Pending/Failed"}.`,
        status: emailSuccess ? "SUCCESS" : "WARNING",
      });

      if (adminResult.status === "fulfilled") {
        console.log("Admin notification email sent successfully:", adminResult.value?.data?.id);
      } else {
        console.error("Admin notification email delivery failed:", adminResult.reason);
      }

      if (customerResult.status === "fulfilled") {
        console.log("Customer confirmation email sent successfully:", customerResult.value?.data?.id);
      } else {
        console.error("Customer confirmation email delivery failed:", customerResult.reason);
      }
    } catch (emailErr) {
      console.error("Email dispatch exception (request still saved):", emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Quote request submitted successfully.",
        id: savedRequest?.id,
        quoteNumber,
      },
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