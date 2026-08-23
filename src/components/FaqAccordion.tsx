// src/components/FaqAccordion.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, HelpCircle } from "lucide-react";
import { FAQ_DATA, type FaqItem } from "@/lib/constants";

export default function FaqAccordion() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const categories = ["All", "Pricing & Quotes", "Moving Safety & Care", "Packing & Logistics", "Services & Storage"];

  const filteredFaqs = FAQ_DATA.filter((item: FaqItem) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Search & Category Filter Header */}
      <div className="rounded-card border border-hairline bg-paper-muted p-6 shadow-sm space-y-6 dark:border-white/10 dark:bg-[#0f172a]">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-light dark:text-gray-400" />
          <input
            type="text"
            placeholder="Search questions (e.g. insurance, packing, stairs, deposit)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xs border border-hairline bg-paper pl-11 pr-4 py-3 text-sm text-navy-deep placeholder:text-slate-light transition-colors focus:border-gold focus:outline-none dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:placeholder:text-gray-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-xs px-4 py-2 text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-navy-deep text-gold-soft font-bold shadow-xs dark:bg-gold dark:text-navy-deep"
                  : "bg-paper text-slate hover:bg-paper-muted hover:text-navy-deep border border-hairline dark:border-white/10 dark:bg-[#070c14] dark:text-gray-300 dark:hover:bg-[#0f172a] dark:hover:text-gold"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="rounded-card border border-hairline bg-paper-muted p-12 text-center dark:border-white/10 dark:bg-[#0f172a]">
            <HelpCircle size={32} className="mx-auto text-slate-light dark:text-gray-400" />
            <h3 className="mt-3 font-display text-lg font-semibold text-navy-deep dark:text-white">
              No matching questions found
            </h3>
            <p className="mt-1 text-xs text-slate dark:text-gray-400">
              Try searching with a different keyword or contact our dispatch team directly.
            </p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-xs border transition-all ${
                  isOpen
                    ? "border-gold bg-paper-muted shadow-xs dark:border-gold dark:bg-[#0f172a]"
                    : "border-hairline bg-paper-muted hover:border-gold/50 dark:border-white/10 dark:bg-[#0f172a] dark:hover:border-gold/50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  className="flex w-full items-center justify-between p-5 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono hidden text-[10px] font-bold uppercase tracking-wider text-gold sm:inline-block">
                      {faq.category}
                    </span>
                    <span className="font-display text-base font-semibold text-navy-deep dark:text-white">
                      {faq.question}
                    </span>
                  </div>
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
                      <p className="text-sm leading-relaxed text-slate dark:text-gray-300">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
