// src/app/api/quote/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      email,
      pickupAddress,
      dropoffAddress,
      moveDate,
      moveSize,
      notes,
    } = body;

    // Basic server-side validation — never trust client input alone
    if (!name || !phone || !email || !pickupAddress || !dropoffAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "Compass Cartage Website <onboarding@resend.dev>", // swap to a verified domain sender once one is set up
      to: process.env.CONTACT_EMAIL || "compasscartage@gmail.com",
      replyTo: email,
      subject: `New Quote Request — ${name}`,
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Moving From:</strong> ${escapeHtml(pickupAddress)}</p>
        <p><strong>Moving To:</strong> ${escapeHtml(dropoffAddress)}</p>
        <p><strong>Preferred Date:</strong> ${escapeHtml(moveDate || "Not specified")}</p>
        <p><strong>Move Size:</strong> ${escapeHtml(moveSize || "Not specified")}</p>
        <p><strong>Notes:</strong><br/>${escapeHtml(notes || "None")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Quote form submission error:", err);
    return NextResponse.json(
      { error: "Failed to send quote request" },
      { status: 500 }
    );
  }
}

// Minimal HTML escaping to prevent injection into the email body
function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}