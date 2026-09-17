// src/app/contact/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ShieldCheck, ArrowRight, MessageSquare } from "lucide-react";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import CallToAction from "@/components/CallToAction";
import { BUSINESS } from "@/lib/constants";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Contact Us | Compass Cartage Edmonton",
  description:
    "Get in touch with Compass Cartage. Direct dispatch phone, email, operating hours, and general moving inquiries across Edmonton and Alberta.",
  openGraph: {
    title: "Contact Compass Cartage | Edmonton Moving Services",
    description: "Reach our local dispatch team for moving estimates, schedule confirmations, or questions.",
    url: "https://www.compasscartage.com/contact",
  },
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    name: "Compass Cartage",
    telephone: "+1-587-501-7519",
    email: "info@compasscartage.ca",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Edmonton",
      addressRegion: "AB",
      addressCountry: "CA",
    },
    openingHours: "Mo-Su 07:00-21:00",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="relative w-full overflow-hidden">
        {/* Page Hero */}
        <PageHero
          image={IMAGES.smilingMover}
          eyebrow="Direct Line & Dispatch"
          title="We're here to help with your move"
          lead="Whether you need to confirm move-day logistics, request a commercial proposal, or reach our crew directly, connect with us below."
        >
          {/* Quick contact aside inside hero */}
          <div className="space-y-3.5 border-t border-paper/15 pt-6 text-sm">
            <a
              href={BUSINESS.phoneHref}
              className="flex items-center gap-3 font-semibold text-paper transition-colors hover:text-gold-soft"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xs bg-gold/20 text-gold-soft">
                <Phone size={15} />
              </div>
              <div>
                <span className="block text-[11px] font-mono uppercase tracking-wider text-gold-soft">Direct Dispatch</span>
                <span>{BUSINESS.phone}</span>
              </div>
            </a>

            <a
              href={`mailto:${BUSINESS.email}`}
              className="flex items-center gap-3 font-semibold text-paper transition-colors hover:text-gold-soft"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xs bg-gold/20 text-gold-soft">
                <Mail size={15} />
              </div>
              <div>
                <span className="block text-[11px] font-mono uppercase tracking-wider text-gold-soft">Email Operations</span>
                <span>{BUSINESS.email}</span>
              </div>
            </a>
          </div>
        </PageHero>

        {/* Contact Desk Main Section */}
        <section className="border-b border-hairline bg-paper py-16 dark:border-white/10 dark:bg-[#070c14] md:py-24">
          <div className="section-padding mx-auto max-w-content">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              {/* Left Column: Direct channels, Hours, and Operations */}
              <div className="space-y-8">
                <div>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-gold-soft dark:text-gold">
                    Edmonton Hub & Operations
                  </span>
                  <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-navy-deep dark:text-white">
                    Direct Contact Channels
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate dark:text-gray-300">
                    Our dispatch desk is staffed 7 days a week to answer pricing questions, check vehicle availability, or provide move day updates.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {/* Channel 1: Phone */}
                  <div className="rounded-card border border-hairline bg-paper-muted p-5 shadow-xs dark:border-white/10 dark:bg-[#0f172a]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xs bg-navy-deep text-gold-soft dark:bg-gold dark:text-navy-deep">
                        <Phone size={18} />
                      </div>
                      <div>
                        <p className="font-display text-base font-semibold text-navy-deep dark:text-white">
                          Phone & SMS Line
                        </p>
                        <p className="text-[11px] text-slate-light dark:text-gray-400">
                          Fastest response for urgent moves
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3 dark:border-white/10">
                      <a
                        href={BUSINESS.phoneHref}
                        className="font-mono text-sm font-bold text-navy-deep transition-colors hover:text-gold dark:text-gold-soft"
                      >
                        {BUSINESS.phone}
                      </a>
                      <a
                        href={`sms:${BUSINESS.phone}`}
                        className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-gold hover:underline"
                      >
                        <MessageSquare size={12} />
                        <span>Send Text</span>
                      </a>
                    </div>
                  </div>

                  {/* Channel 2: Email */}
                  <div className="rounded-card border border-hairline bg-paper-muted p-5 shadow-xs dark:border-white/10 dark:bg-[#0f172a]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xs bg-navy-deep text-gold-soft dark:bg-gold dark:text-navy-deep">
                        <Mail size={18} />
                      </div>
                      <div>
                        <p className="font-display text-base font-semibold text-navy-deep dark:text-white">
                          Official Operations Desk
                        </p>
                        <p className="text-[11px] text-slate-light dark:text-gray-400">
                          Quotes, receipts, and logistics docs
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 border-t border-hairline pt-3 dark:border-white/10">
                      <a
                        href={`mailto:${BUSINESS.email}`}
                        className="font-mono text-xs font-bold text-navy-deep transition-colors hover:text-gold dark:text-gold-soft"
                      >
                        {BUSINESS.email}
                      </a>
                    </div>
                  </div>

                  {/* Channel 3: Operating Hours */}
                  <div className="rounded-card border border-hairline bg-paper-muted p-5 shadow-xs dark:border-white/10 dark:bg-[#0f172a]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xs bg-navy-deep text-gold-soft dark:bg-gold dark:text-navy-deep">
                        <Clock size={18} />
                      </div>
                      <div>
                        <p className="font-display text-base font-semibold text-navy-deep dark:text-white">
                          Operating & Dispatch Hours
                        </p>
                        <p className="text-[11px] text-slate-light dark:text-gray-400">
                          Moves scheduled 7 days a week
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-1 border-t border-hairline pt-3 font-mono text-xs text-slate dark:border-white/10 dark:text-gray-300">
                      <div className="flex justify-between">
                        <span>Monday – Saturday</span>
                        <span className="font-semibold text-navy-deep dark:text-white">7:00 AM – 9:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday & Holidays</span>
                        <span className="font-semibold text-navy-deep dark:text-white">8:00 AM – 7:00 PM</span>
                      </div>
                    </div>
                  </div>

                  {/* Channel 4: Base Location */}
                  <div className="rounded-card border border-hairline bg-paper-muted p-5 shadow-xs dark:border-white/10 dark:bg-[#0f172a]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xs bg-navy-deep text-gold-soft dark:bg-gold dark:text-navy-deep">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="font-display text-base font-semibold text-navy-deep dark:text-white">
                          Fleet Hub & Service Region
                        </p>
                        <p className="text-[11px] text-slate-light dark:text-gray-400">
                          {BUSINESS.serviceAreaShort}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3 dark:border-white/10">
                      <span className="text-xs text-slate dark:text-gray-300">
                        Edmonton, St. Albert, Sherwood Park & Alberta
                      </span>
                      <Link
                        href="/service-area"
                        className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-gold hover:underline"
                      >
                        <span>View Map</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Trust callout */}
                <div className="flex items-start gap-3 rounded-xs border border-gold/30 bg-gold/10 p-4">
                  <ShieldCheck size={20} className="shrink-0 text-gold-soft dark:text-gold" />
                  <p className="text-xs leading-relaxed text-navy-deep dark:text-gray-200">
                    <strong>Licensed & Insured:</strong> Every Compass Cartage move is protected under comprehensive cargo transit insurance with single-crew chain of custody.
                  </p>
                </div>
              </div>

              {/* Right Column: Contact Inquiry Form */}
              <div className="rounded-card border border-hairline bg-paper-muted p-6 shadow-xl dark:border-white/10 dark:bg-[#0f172a] sm:p-8">
                <div className="border-b border-hairline pb-4 dark:border-white/10">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-gold-soft dark:text-gold">
                    Send a Message
                  </span>
                  <h3 className="font-display mt-1 text-2xl font-bold text-navy-deep dark:text-white">
                    General Questions & Inquiries
                  </h3>
                  <p className="mt-1 text-xs text-slate dark:text-gray-400">
                    We respond to online inquiries within 2–4 hours during normal business hours.
                  </p>
                </div>

                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Band */}
        <CallToAction
          heading="Ready to book your move date?"
          subtext="Request an itemized moving quote with distance calculation and rate protection."
        />
      </main>
    </>
  );
}
