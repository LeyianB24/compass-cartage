// src/components/InventoryPlanner.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Plus,
  Minus,
  Trash2,
  Truck,
  Box,
  Scale,
  ArrowRight,
  Sparkles,
  Info,
  Printer,
  RotateCcw,
} from "lucide-react";
import { INVENTORY_CATEGORIES } from "@/lib/constants";

const STORAGE_KEY = "compass_cartage_inventory_manifest_v1";

const DEFAULT_ITEMS: Record<string, number> = {
  sofa_3seat: 1,
  tv_55: 1,
  coffee_table: 1,
  bed_queen: 1,
  dresser_6drawer: 1,
  dining_table: 1,
  dining_chair: 4,
  box_medium: 10,
  box_large: 5,
};

export default function InventoryPlanner() {
  const [activeCategory, setActiveCategory] = useState<string>("Living Room");
  const [itemCounts, setItemCounts] = useState<Record<string, number>>(DEFAULT_ITEMS);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          queueMicrotask(() => setItemCounts(parsed));
        }
      }
    } catch {
      // Ignore parse error
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(itemCounts));
    } catch {
      // Ignore write error
    }
  }, [itemCounts]);

  const handlePrint = () => {
    window.print();
  };

  const handleResetDefaults = () => {
    if (window.confirm("Restore recommended standard household items?")) {
      setItemCounts(DEFAULT_ITEMS);
    }
  };

  const handleAdd = (id: string) => {
    setItemCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleRemove = (id: string) => {
    setItemCounts((prev) => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: current - 1 };
    });
  };

  const handleClear = () => {
    setItemCounts({});
  };

  // Calculations across all selected items
  let totalCuFt = 0;
  let totalWeightLbs = 0;
  let totalItemCount = 0;

  const allItemsFlat = INVENTORY_CATEGORIES.flatMap((c) => c.items);

  Object.entries(itemCounts).forEach(([id, count]) => {
    const item = allItemsFlat.find((i) => i.id === id);
    if (item && count > 0) {
      totalCuFt += item.cuFt * count;
      totalWeightLbs += item.weightLbs * count;
      totalItemCount += count;
    }
  });

  // Smart vehicle recommendations based on total volume
  let recommendedTruck = "16ft Box Truck";
  if (totalCuFt > 1200) recommendedTruck = "26ft Heavy Commercial Truck";
  else if (totalCuFt > 750) recommendedTruck = "24ft Box Truck";
  else if (totalCuFt > 400) recommendedTruck = "20ft Box Truck";
  else if (totalCuFt <= 200 && totalCuFt > 0) recommendedTruck = "Cargo Van / Sprinter";

  // Box estimates based on volume
  const recommendedSmallBoxes = Math.max(5, Math.round(totalCuFt * 0.025));
  const recommendedMedBoxes = Math.max(8, Math.round(totalCuFt * 0.035));
  const recommendedLargeBoxes = Math.max(4, Math.round(totalCuFt * 0.015));

  // Prepare prefilled list for quote form
  const selectedSummaryList = Object.entries(itemCounts)
    .map(([id, count]) => {
      const item = allItemsFlat.find((i) => i.id === id);
      return item ? { name: item.name, count } : null;
    })
    .filter(Boolean) as { name: string; count: number }[];

  const queryParams = new URLSearchParams({
    cuFt: totalCuFt.toString(),
    weight: totalWeightLbs.toString(),
    truck: recommendedTruck,
    itemCount: totalItemCount.toString(),
  }).toString();

  const activeCategoryObj = INVENTORY_CATEGORIES.find((c) => c.name === activeCategory)!;

  return (
    <div className="mx-auto w-full max-w-7xl rounded-card border border-hairline bg-paper-muted shadow-lg overflow-hidden dark:border-white/10 dark:bg-[#0f172a]">
      {/* Top Header */}
      <div className="bg-navy-deep px-6 py-6 text-white md:px-10 border-b border-hairline dark:bg-[#070c14] dark:border-white/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xs bg-gold/15 text-gold">
              <Package size={22} />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-white md:text-2xl">
                Room-by-Room Inventory Planner
              </h2>
              <p className="text-xs text-white/80 dark:text-gray-300 font-normal">
                Select your furniture & boxes to calculate total cubic volume (cu ft) and weight.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {totalItemCount > 0 && (
              <>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 rounded-xs border border-gold/40 bg-gold/15 px-3 py-1.5 text-xs font-semibold text-gold-soft hover:bg-gold hover:text-navy-deep transition-all"
                  title="Print or save as PDF"
                >
                  <Printer size={13} />
                  <span>Print Manifest</span>
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1.5 rounded-xs border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30 transition-colors"
                >
                  <Trash2 size={13} />
                  <span>Clear All</span>
                </button>
              </>
            )}

            {totalItemCount === 0 && (
              <button
                type="button"
                onClick={handleResetDefaults}
                className="inline-flex items-center gap-1.5 rounded-xs border border-gold/40 bg-gold/15 px-3 py-1.5 text-xs font-semibold text-gold-soft hover:bg-gold hover:text-navy-deep transition-all"
              >
                <RotateCcw size={13} />
                <span>Load Sample Items</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-8 p-6 md:grid-cols-[1fr_360px] md:p-10">
        {/* Left Column: Category Tabs & Item Grid */}
        <div>
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-hairline pb-4 dark:border-white/10">
            {INVENTORY_CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setActiveCategory(cat.name)}
                className={`rounded-xs px-4 py-2 text-xs font-semibold transition-all ${
                  activeCategory === cat.name
                    ? "bg-gold text-navy-deep font-bold shadow-xs"
                    : "bg-paper text-slate hover:bg-paper-muted hover:text-navy-deep dark:bg-[#070c14] dark:text-gray-300 dark:hover:bg-[#0f172a] dark:hover:text-gold"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {activeCategoryObj.items.map((item) => {
              const count = itemCounts[item.id] || 0;
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between rounded-xs border p-4 transition-all ${
                    count > 0
                      ? "border-gold bg-gold/10 shadow-2xs dark:border-gold dark:bg-gold/10"
                      : "border-hairline bg-paper/50 hover:border-gold/50 dark:border-white/10 dark:bg-[#070c14] dark:hover:border-gold/50"
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-navy-deep dark:text-white">{item.name}</p>
                    <p className="font-mono text-[11px] text-slate dark:text-gray-400">
                      {item.cuFt} cu ft • ~{item.weightLbs} lbs
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {count > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-xs border border-hairline bg-paper-muted text-navy-deep shadow-2xs transition-colors hover:bg-red-50 hover:text-red-600 dark:border-white/15 dark:bg-[#0f172a] dark:text-gray-200 dark:hover:bg-red-950 dark:hover:text-red-300"
                        aria-label={`Remove one ${item.name}`}
                      >
                        <Minus size={14} />
                      </button>
                    )}

                    <span
                      className={`min-w-[24px] text-center font-mono text-sm font-bold ${
                        count > 0 ? "text-gold" : "text-slate-light dark:text-gray-500"
                      }`}
                    >
                      {count}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleAdd(item.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-xs border border-hairline bg-navy-deep text-white shadow-2xs transition-colors hover:bg-gold hover:text-navy-deep dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
                      aria-label={`Add one ${item.name}`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-xs border border-hairline bg-paper/50 p-4 text-xs text-slate dark:border-white/10 dark:bg-[#070c14] dark:text-gray-300">
            <Info size={16} className="shrink-0 text-gold" />
            <span>
              Calculations use standard moving industry cubic displacement figures. Adding items automatically adjusts truck sizing recommendations.
            </span>
          </div>
        </div>

        {/* Right Column: Dynamic Totals & Recommendation Panel */}
        <div className="flex flex-col justify-between rounded-card border border-hairline bg-paper p-6 shadow-xs dark:border-white/10 dark:bg-[#070c14]">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-gold">
              <Sparkles size={14} />
              <span>Inventory Metrics</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-b border-hairline pb-4 dark:border-white/10">
              <div className="rounded-xs bg-paper-muted p-3 border border-hairline dark:border-white/10 dark:bg-[#0f172a]">
                <div className="flex items-center gap-1.5 text-xs text-slate dark:text-gray-400">
                  <Box size={14} className="text-gold" />
                  <span>Total Volume</span>
                </div>
                <p className="mt-1 font-mono text-2xl font-bold text-navy-deep dark:text-white">
                  {totalCuFt} <span className="text-xs font-normal text-slate dark:text-gray-400">cu ft</span>
                </p>
              </div>

              <div className="rounded-xs bg-paper-muted p-3 border border-hairline dark:border-white/10 dark:bg-[#0f172a]">
                <div className="flex items-center gap-1.5 text-xs text-slate dark:text-gray-400">
                  <Scale size={14} className="text-gold" />
                  <span>Est. Weight</span>
                </div>
                <p className="mt-1 font-mono text-2xl font-bold text-navy-deep dark:text-white">
                  {totalWeightLbs} <span className="text-xs font-normal text-slate dark:text-gray-400">lbs</span>
                </p>
              </div>
            </div>

            {/* Truck & Box Advice */}
            <div className="mt-5 space-y-3 text-xs">
              <div className="flex items-center justify-between text-navy-deep dark:text-white">
                <div className="flex items-center gap-2">
                  <Truck size={15} className="text-gold" />
                  <span>Recommended Truck</span>
                </div>
                <span className="font-mono font-semibold text-navy-deep dark:text-gold-soft text-right">{recommendedTruck}</span>
              </div>

              <div className="border-t border-hairline pt-3 dark:border-white/10">
                <p className="font-semibold text-navy-deep dark:text-white mb-2">Estimated Packing Supplies Needed:</p>
                <ul className="space-y-1.5 text-slate dark:text-gray-300 text-[11px]">
                  <li className="flex justify-between">
                    <span>Small Boxes (Heavy items)</span>
                    <span className="font-mono font-medium text-navy-deep dark:text-gold-soft">{recommendedSmallBoxes} boxes</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Medium Boxes (General)</span>
                    <span className="font-mono font-medium text-navy-deep dark:text-gold-soft">{recommendedMedBoxes} boxes</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Large Boxes (Linens/Soft)</span>
                    <span className="font-mono font-medium text-navy-deep dark:text-gold-soft">{recommendedLargeBoxes} boxes</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Selected items list snippet */}
            {selectedSummaryList.length > 0 && (
              <div className="mt-5 rounded-xs bg-paper-muted p-3 border border-hairline dark:border-white/10 dark:bg-[#0f172a]">
                <p className="font-mono text-[11px] font-bold text-navy-deep dark:text-white mb-1.5">
                  Selected Manifest ({totalItemCount} items):
                </p>
                <div className="max-h-36 overflow-y-auto space-y-1 pr-1 text-[11px] text-slate dark:text-gray-300">
                  {selectedSummaryList.map((s, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="truncate max-w-[180px]">{s.name}</span>
                      <span className="font-mono font-semibold text-navy-deep dark:text-gold-soft">x{s.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <Link
              href={`/quote?${queryParams}`}
              className="group flex w-full items-center justify-center gap-2 rounded-xs bg-navy-deep py-3 px-4 text-xs font-bold text-gold-soft shadow-md transition-all hover:bg-gold hover:text-navy-deep dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
            >
              <span>Attach Inventory to Quote</span>
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="mt-2 text-center font-mono text-[10px] text-slate-light dark:text-gray-400">
              Transfer items directly into your quote submission
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
