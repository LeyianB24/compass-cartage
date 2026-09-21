// src/components/HomeFaqPreview.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";

interface FaqPreviewItem {
  id: string;
  question: string;
  answer: string;
}

const HOME_FAQS: FaqPreviewItem[] = [
  {
    id: "faq-1",
    question: "How do you calculate moving quotes?",
    answer:
      "Our quotes are transparent and upfront. For local Edmonton moves, we calculate based on estimated labor hours, crew size, and distance tier. For long-distance moves across Alberta, rates reflect volume (cubic feet) and direct mileage. Every quote includes our single dedicated crew from pickup to dropoff.",
  },
  {
    id: "faq-2",
    question: "Are there any hidden fuel or stair fees?",
    answer:
      "No. Unlike many freight or brokerage services, all stair travel, fuel surcharges, and equipment usage are explicitly detailed in your written quote before move day. What we quote is what you pay.",
  },
  {
    id: "faq-3",
    question: "Is Compass Cartage fully licensed and insured?",
    answer:
      "Yes, 100%. We carry comprehensive commercial cargo insurance, $2,000,000 general liability coverage, and full worker's compensation. Your home, belongings, and property are protected throughout transit.",
  },
  {
    id: "faq-4",
    question: "How do you protect delicate furniture and hardwood floors?",
    answer:
      "Our crews lay heavy-duty neoprene floor runners, door jamb shields, and wrap every piece of wood or upholstered furniture in thick quilted moving blankets secured with ratchet straps before leaving the room.",
  },
  {
    id: "faq-5",
    question: "Do you offer short-notice or same-week moves?",
    answer:
      "Yes. We keep flexible slots open each week for urgent relocations and short-notice emergencies in the Edmonton Capital Region. Contact our dispatch desk directly at (587) 501-7519 for immediate availability.",
  },
];

export default function HomeFaqPreview() {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="border-b border-hairline bg-paper py-20 dark:border-white/10 dark:bg-[#070c14] md:py-28">
      <div className="section-padding mx-auto max-w-content">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-gold-soft dark:text-gold">
              <HelpCircle size={14} />
              <span>Moving FAQs & Common Inquiries</span>
            </div>
            <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-navy-deep dark:text-white sm:text-4xl lg:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate dark:text-gray-300 max-w-2xl">
              Quick answers about our dedicated moving crews, upfront pricing guarantees, and insurance protection.
            </p>
          </div>

          <Link
            href="/faq"
            className="inline-flex items-center gap-2 rounded-xs border border-hairline bg-paper-muted px-5 py-2.5 font-mono text-xs font-semibold text-navy-deep hover:border-gold hover:text-gold dark:border-white/15 dark:bg-[#0f172a] dark:text-gray-200 shrink-0 transition-colors"
          >
            <span>View Full FAQ Center (8+ Answers)</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Accordion 5-Question Preview */}
        <div className="mx-auto max-w-4xl space-y-3">
          {HOME_FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-xs border transition-all ${
                  isOpen
                    ? "border-gold bg-paper-muted shadow-sm dark:border-gold dark:bg-[#0a1320]"
                    : "border-hairline bg-paper-muted/50 hover:border-gold/50 dark:border-white/10 dark:bg-[#0f172a] dark:hover:border-gold/50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between p-5 text-left focus:outline-none"
                >
                  <span className="font-display text-base font-semibold text-navy-deep dark:text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-slate dark:text-gray-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-gold dark:text-gold" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-hairline/60 px-5 pb-5 pt-3 dark:border-white/10"
                    >
                      <p className="text-sm leading-relaxed text-slate dark:text-gray-300">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
