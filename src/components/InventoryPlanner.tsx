// src/components/InventoryPlanner.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  Plus,
  Minus,
  Trash2,
  Scale,
  Box,
  Truck,
  ArrowRight,
  Sparkles,
  Info,
} from "lucide-react";
import { INVENTORY_CATEGORIES } from "@/lib/constants";

export default function InventoryPlanner() {
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState<string>(INVENTORY_CATEGORIES[0].name);

  // Increment item count
  const handleAdd = (itemId: string) => {
    setItemCounts((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  // Decrement item count
  const handleRemove = (itemId: string) => {
    setItemCounts((prev) => {
      const current = prev[itemId] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: current - 1 };
    });
  };

  // Clear all
  const handleClear = () => setItemCounts({});

  // Compute total cubic feet & weight
  let totalCuFt = 0;
  let totalWeightLbs = 0;
  let totalItemCount = 0;

  const selectedSummaryList: Array<{ name: string; count: number; cuFt: number }> = [];

  INVENTORY_CATEGORIES.forEach((cat) => {
    cat.items.forEach((item) => {
      const count = itemCounts[item.id] || 0;
      if (count > 0) {
        totalCuFt += item.cuFt * count;
        totalWeightLbs += item.weightLbs * count;
        totalItemCount += count;
        selectedSummaryList.push({ name: item.name, count, cuFt: item.cuFt * count });
      }
    });
  });

  // Calculate recommended box counts & truck size recommendation
  const recommendedSmallBoxes = Math.max(4, Math.round(totalCuFt * 0.04));
  const recommendedMedBoxes = Math.max(6, Math.round(totalCuFt * 0.03));
  const recommendedLargeBoxes = Math.max(3, Math.round(totalCuFt * 0.02));

  let recommendedTruck = "16ft Box Truck";
  if (totalCuFt > 1400) recommendedTruck = "26ft Fleet Truck + Van";
  else if (totalCuFt > 900) recommendedTruck = "26ft Heavy Truck";
  else if (totalCuFt > 500) recommendedTruck = "20ft Box Truck";

  // Build string representation for Quote request export
  const inventorySummaryString = selectedSummaryList
    .map((item) => `${item.count}x ${item.name}`)
    .join(", ");

  const queryParams = new URLSearchParams({
    inventory: inventorySummaryString,
    cuFt: totalCuFt.toString(),
    weight: totalWeightLbs.toString(),
  }).toString();

  const activeCategoryObj = INVENTORY_CATEGORIES.find((c) => c.name === activeCategory)!;

  return (
    <div className="mx-auto max-w-5xl rounded-card border border-hairline bg-paper-muted shadow-lg overflow-hidden">
      {/* Top Header */}
      <div className="bg-[#071426] dark:bg-[#030914] px-6 py-6 text-[#f7f6f2] md:px-10 border-b border-gold/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-gold/15 text-gold">
              <Package size={22} />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-[#f7f6f2] md:text-2xl">
                Room-by-Room Inventory Planner
              </h2>
              <p className="text-xs text-[#f7f6f2]/75">
                Select your furniture & boxes to calculate total cubic volume (cu ft) and weight.
              </p>
            </div>
          </div>

          {totalItemCount > 0 && (
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1 text-xs text-paper/60 hover:text-gold"
            >
              <Trash2 size={14} />
              <span>Clear Inventory</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-8 p-6 md:grid-cols-[1fr_360px] md:p-10">
        {/* Left Column: Category Tabs & Item Grid */}
        <div>
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-hairline pb-4">
            {INVENTORY_CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setActiveCategory(cat.name)}
                className={`rounded-sm px-4 py-2 text-xs font-semibold transition-all ${
                  activeCategory === cat.name
                    ? "bg-gold text-navy-deep shadow-xs"
                    : "bg-paper text-slate hover:bg-paper-muted hover:text-navy-deep"
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
                  className={`flex items-center justify-between rounded-sm border p-4 transition-all ${
                    count > 0
                      ? "border-gold bg-gold/5 shadow-2xs"
                      : "border-hairline bg-paper/30 hover:border-slate-light"
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-navy-deep">{item.name}</p>
                    <p className="text-[11px] text-slate">
                      {item.cuFt} cu ft • ~{item.weightLbs} lbs
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {count > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-xs border border-hairline bg-paper-muted text-navy-deep shadow-2xs transition-colors hover:bg-red-50 hover:text-red-600"
                        aria-label={`Remove one ${item.name}`}
                      >
                        <Minus size={14} />
                      </button>
                    )}

                    <span
                      className={`min-w-[24px] text-center font-display text-sm font-semibold ${
                        count > 0 ? "text-gold" : "text-slate-light"
                      }`}
                    >
                      {count}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleAdd(item.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-xs border border-hairline bg-navy-deep text-paper shadow-2xs transition-colors hover:bg-navy"
                      aria-label={`Add one ${item.name}`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-sm border border-hairline bg-paper/50 p-4 text-xs text-slate">
            <Info size={16} className="shrink-0 text-gold" />
            <span>
              Calculations use standard moving industry cubic displacement figures. Adding items automatically adjusts truck sizing recommendations.
            </span>
          </div>
        </div>

        {/* Right Column: Dynamic Totals & Recommendation Panel */}
        <div className="flex flex-col justify-between rounded-card border border-hairline bg-paper p-6 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold">
              <Sparkles size={14} />
              <span>Inventory Metrics</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-b border-hairline pb-4">
              <div className="rounded-xs bg-paper-muted p-3 border border-hairline">
                <div className="flex items-center gap-1.5 text-xs text-slate">
                  <Box size={14} className="text-gold" />
                  <span>Total Volume</span>
                </div>
                <p className="mt-1 font-display text-2xl font-bold text-navy-deep">
                  {totalCuFt} <span className="text-xs font-normal text-slate">cu ft</span>
                </p>
              </div>

              <div className="rounded-xs bg-paper-muted p-3 border border-hairline">
                <div className="flex items-center gap-1.5 text-xs text-slate">
                  <Scale size={14} className="text-gold" />
                  <span>Est. Weight</span>
                </div>
                <p className="mt-1 font-display text-2xl font-bold text-navy-deep">
                  {totalWeightLbs} <span className="text-xs font-normal text-slate">lbs</span>
                </p>
              </div>
            </div>

            {/* Truck & Box Advice */}
            <div className="mt-5 space-y-3 text-xs">
              <div className="flex items-center justify-between text-navy-deep">
                <div className="flex items-center gap-2">
                  <Truck size={15} className="text-gold" />
                  <span>Recommended Truck</span>
                </div>
                <span className="font-semibold text-right">{recommendedTruck}</span>
              </div>

              <div className="border-t border-hairline pt-3">
                <p className="font-semibold text-navy-deep mb-2">Estimated Packing Supplies Needed:</p>
                <ul className="space-y-1.5 text-slate text-[11px]">
                  <li className="flex justify-between">
                    <span>Small Boxes (Heavy items)</span>
                    <span className="font-medium text-navy-deep">{recommendedSmallBoxes} boxes</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Medium Boxes (General)</span>
                    <span className="font-medium text-navy-deep">{recommendedMedBoxes} boxes</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Large Boxes (Linens/Soft)</span>
                    <span className="font-medium text-navy-deep">{recommendedLargeBoxes} boxes</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Selected items list snippet */}
            {selectedSummaryList.length > 0 && (
              <div className="mt-5 rounded-xs bg-paper-muted p-3 border border-hairline">
                <p className="text-[11px] font-semibold text-navy-deep mb-1">
                  Selected Items ({totalItemCount}):
                </p>
                <div className="max-h-36 overflow-y-auto space-y-1 pr-1 text-[11px] text-slate">
                  {selectedSummaryList.map((s, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="truncate max-w-[180px]">{s.name}</span>
                      <span className="font-semibold text-navy-deep">x{s.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <Link
              href={`/quote?${queryParams}`}
              className="group flex w-full items-center justify-center gap-2 rounded-sm bg-gold py-3 px-4 text-sm font-semibold text-navy-deep transition-colors hover:bg-gold-soft"
            >
              <span>Attach Inventory to Quote</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="mt-2 text-center text-[10px] text-slate-light">
              Transfer items directly into your quote submission
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
