// src/app/privacy-policy/page.tsx
import type { Metadata } from "next";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy | Compass Cartage",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="bg-paper">
      <div className="section-padding mx-auto max-w-3xl py-16">
        <p className="eyebrow mb-3">Legal</p>
        <h1 className="font-display text-4xl font-semibold text-navy-deep">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate">Last updated: {new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-slate">
          <div>
            <h2 className="mb-2 font-display text-lg font-semibold text-navy-deep">Information We Collect</h2>
            <p>
              When you submit a quote request through our website, we collect your name, phone number, email address,
              pickup and drop-off addresses, preferred move date, home size, any notes you provide, and any photos you
              choose to upload.
            </p>
          </div>

          <div>
            <h2 className="mb-2 font-display text-lg font-semibold text-navy-deep">How We Use Your Information</h2>
            <p>
              We use the information you provide solely to prepare and communicate your moving quote, coordinate your
              move, and respond to your inquiries. We do not sell or share your personal information with third
              parties for marketing purposes.
            </p>
          </div>

          <div>
            <h2 className="mb-2 font-display text-lg font-semibold text-navy-deep">Data Storage</h2>
            <p>
              Quote request information is stored securely and retained only as long as necessary to provide our
              services and maintain business records. Uploaded photos are stored securely and used only to assess
              your move.
            </p>
          </div>

          <div>
            <h2 className="mb-2 font-display text-lg font-semibold text-navy-deep">Your Rights</h2>
            <p>
              Under Canadian privacy law (PIPEDA), you have the right to access, correct, or request deletion of your
              personal information. To make a request, contact us at {BUSINESS.email}.
            </p>
          </div>

          <div>
            <h2 className="mb-2 font-display text-lg font-semibold text-navy-deep">Contact Us</h2>
            <p>
              Questions about this policy can be directed to {BUSINESS.name} at {BUSINESS.email} or {BUSINESS.phone}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}