// src/app/privacy-policy/page.tsx
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { BUSINESS } from "@/lib/constants";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Privacy Policy | Compass Cartage",
  description: "How Compass Cartage handles and protects your personal moving information under Canadian privacy law.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="relative w-full overflow-hidden -mt-20">
      <PageHero
        image={IMAGES.packingScene}
        eyebrow="Legal & Privacy"
        title="Privacy Policy"
        lead="How Compass Cartage collects, uses, and safeguards your personal moving information under Canadian privacy legislation."
        hideCta
      />

      <section className="relative border-b border-hairline bg-paper py-16 dark:border-white/10 dark:bg-[#070c14] md:py-24">
        <div className="section-padding mx-auto max-w-3xl">
          <p className="text-xs text-slate-light dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-slate dark:text-gray-300">
            <div>
              <h2 className="mb-2 font-display text-lg font-semibold text-navy-deep dark:text-white">Information We Collect</h2>
              <p>
                When you submit a quote request through our website, we collect your name, phone number, email address,
                pickup and drop-off addresses, preferred move date, home size, any notes you provide, and any photos you
                choose to upload.
              </p>
            </div>

            <div>
              <h2 className="mb-2 font-display text-lg font-semibold text-navy-deep dark:text-white">How We Use Your Information</h2>
              <p>
                We use the information you provide solely to prepare and communicate your moving quote, coordinate your
                move, and respond to your inquiries. We do not sell or share your personal information with third
                parties for marketing purposes.
              </p>
            </div>

            <div>
              <h2 className="mb-2 font-display text-lg font-semibold text-navy-deep dark:text-white">Data Storage</h2>
              <p>
                Quote request information is stored securely and retained only as long as necessary to provide our
                services and maintain business records. Uploaded photos are stored securely and used only to assess
                your move.
              </p>
            </div>

            <div>
              <h2 className="mb-2 font-display text-lg font-semibold text-navy-deep dark:text-white">Your Rights</h2>
              <p>
                Under Canadian privacy law (PIPEDA), you have the right to access, correct, or request deletion of your
                personal information. To make a request, contact us at {BUSINESS.email}.
              </p>
            </div>

            <div>
              <h2 className="mb-2 font-display text-lg font-semibold text-navy-deep dark:text-white">Contact Us</h2>
              <p>
                Questions about this policy can be directed to {BUSINESS.name} at {BUSINESS.email} or {BUSINESS.phone}.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}