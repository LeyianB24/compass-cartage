// src/app/api/admin/send-email/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { verifyAdminAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Missing RESEND_API_KEY environment variable");
  return new Resend(apiKey);
};

export async function POST(req: NextRequest) {
  try {
    const isAuthorized = await verifyAdminAuth();
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const json = await req.json().catch(() => null);
    if (!json) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { to, subject, body, quoteRequestId } = json;

    if (!to || typeof to !== "string" || !to.includes("@")) {
      return NextResponse.json({ error: "Valid recipient email ('to') is required" }, { status: 400 });
    }

    if (!subject || typeof subject !== "string") {
      return NextResponse.json({ error: "Email subject is required" }, { status: 400 });
    }

    if (!body || typeof body !== "string") {
      return NextResponse.json({ error: "Email body content is required" }, { status: 400 });
    }

    const resend = getResendClient();
    const senderEmail = process.env.SENDER_EMAIL || "Compass Cartage <info@compasscartage.ca>";

    // Convert plain text line breaks to HTML paragraphs
    const formattedHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; line-height: 1.6;">
        <div style="border-bottom: 2px solid #c5a880; padding-bottom: 16px; margin-bottom: 24px;">
          <h2 style="color: #070c14; margin: 0 0 4px 0; font-size: 20px;">Compass Cartage Relocation Services</h2>
          <p style="color: #c5a880; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Edmonton & Alberta Movers</p>
        </div>
        
        <div style="white-space: pre-wrap; font-size: 14px; color: #334155; line-height: 1.7;">
${body}
        </div>

        <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
          <p style="margin: 0 0 4px 0;"><strong>Compass Cartage Dispatch Operations</strong></p>
          <p style="margin: 0 0 4px 0;">Phone: (587) 501-7519 &middot; Email: info@compasscartage.ca</p>
          <p style="margin: 0;">Licensed & Insured Moving Services across Alberta</p>
        </div>
      </div>
    `;

    const { data: resendData, error: resendError } = await resend.emails.send({
      from: senderEmail,
      to: [to.trim()],
      subject: subject.trim(),
      text: body,
      html: formattedHtml,
      replyTo: "info@compasscartage.ca",
    });

    if (resendError) {
      console.error("Resend API Error:", resendError);
      return NextResponse.json(
        { error: resendError.message || "Failed to send email via Resend" },
        { status: 500 }
      );
    }

    // If quoteRequestId is provided, automatically advance status if currently NEW
    if (quoteRequestId) {
      try {
        const current = await prisma.quoteRequest.findUnique({
          where: { id: quoteRequestId },
          select: { status: true },
        });

        if (current && current.status === "NEW") {
          await prisma.quoteRequest.update({
            where: { id: quoteRequestId },
            data: { status: "CONTACTED" },
          });
        }
      } catch (dbErr) {
        console.warn("Could not update quote request status after email:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      messageId: resendData?.id,
    });
  } catch (error) {
    console.error("Error in /api/admin/send-email:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
