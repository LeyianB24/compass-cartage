// src/components/AdminCalendarView.tsx
"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Truck,
  MapPin,
  Phone,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

type RequestType = {
  id: string;
  name: string;
  phone: string;
  email: string;
  pickupAddress: string;
  dropoffAddress: string;
  moveDate: string | null;
  moveSize: string | null;
  notes: string | null;
  photoUrls: string[];
  status: string;
  createdAt: string;
  bookedSlot: { date: string; moveType: string } | null;
};

type Props = {
  requests: RequestType[];
};

const MOVE_TYPE_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  LOCAL: { label: "Local (Edmonton)", bg: "bg-blue-500/15 border-blue-500/30", text: "text-blue-600 dark:text-blue-400" },
  LONG_DISTANCE_ALBERTA: { label: "Long Distance (AB)", bg: "bg-gold/20 border-gold/40", text: "text-gold dark:text-gold-soft" },
  OUT_OF_PROVINCE: { label: "Out of Province", bg: "bg-purple-500/15 border-purple-500/30", text: "text-purple-600 dark:text-purple-400" },
};

export default function AdminCalendarView({ requests }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Compute month days
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Booked moves map: "YYYY-MM-DD" -> RequestType[]
  const bookedMovesByDate = useMemo(() => {
    const map = new Map<string, RequestType[]>();
    requests.forEach((req) => {
      if (req.bookedSlot) {
        const slotDate = new Date(req.bookedSlot.date);
        const dateKey = slotDate.toISOString().split("T")[0];
        if (!map.has(dateKey)) {
          map.set(dateKey, []);
        }
        map.get(dateKey)!.push(req);
      }
    });
    return map;
  }, [requests]);

  // Out of province monthly quota count for currently viewed month
  const outOfProvinceCount = useMemo(() => {
    const targetYear = currentDate.getFullYear();
    const targetMonth = currentDate.getMonth();
    let count = 0;
    requests.forEach((req) => {
      if (req.bookedSlot && req.bookedSlot.moveType === "OUT_OF_PROVINCE") {
        const d = new Date(req.bookedSlot.date);
        if (d.getFullYear() === targetYear && d.getMonth() === targetMonth) {
          count++;
        }
      }
    });
    return count;
  }, [requests, currentDate]);

  // Month name
  const monthName = currentDate.toLocaleString("en-CA", { month: "long", year: "numeric" });

  // Day inspection list
  const selectedDateKey = selectedDay ? selectedDay.toISOString().split("T")[0] : null;
  const movesForSelectedDay = selectedDateKey ? bookedMovesByDate.get(selectedDateKey) || [] : [];

  return (
    <div className="space-y-6">
      {/* Month Header & Quota Bar */}
      <div className="flex flex-col gap-4 rounded-card border border-hairline bg-paper-muted p-5 shadow-xs dark:border-white/10 dark:bg-[#0f172a] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="rounded-xs border border-hairline bg-paper p-2 text-slate hover:text-navy-deep dark:border-white/15 dark:bg-[#070c14] dark:text-gray-300 dark:hover:text-white"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextMonth}
              className="rounded-xs border border-hairline bg-paper p-2 text-slate hover:text-navy-deep dark:border-white/15 dark:bg-[#070c14] dark:text-gray-300 dark:hover:text-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-navy-deep dark:text-white sm:text-2xl">
              {monthName}
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-wider text-gold">
              Fleet Scheduling & Active Move Matrix
            </p>
          </div>
        </div>

        {/* Out of Province Quota Meter */}
        <div className="rounded-xs border border-hairline bg-paper p-3 dark:border-white/10 dark:bg-[#070c14] sm:w-72">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-navy-deep dark:text-gray-200">
              Interprovincial Quota
            </span>
            <span className="font-mono font-bold text-gold">
              {outOfProvinceCount} / 2 Slots Booked
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate/10 dark:bg-white/10">
            <div
              className={`h-full transition-all duration-300 ${
                outOfProvinceCount >= 2 ? "bg-red-500" : "bg-gold"
              }`}
              style={{ width: `${Math.min(100, (outOfProvinceCount / 2) * 100)}%` }}
            />
          </div>
          {outOfProvinceCount >= 2 && (
            <p className="mt-1 flex items-center gap-1 font-mono text-[10px] text-red-500">
              <AlertTriangle size={11} /> Monthly limit reached for out-of-province moves
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Calendar Grid */}
        <div className="rounded-card border border-hairline bg-paper-muted p-4 shadow-xs dark:border-white/10 dark:bg-[#0f172a] sm:p-6">
          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] font-bold text-slate-light dark:text-gray-400 pb-2 border-b border-hairline dark:border-white/10">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Grid Cells */}
          <div className="mt-2 grid grid-cols-7 gap-1 sm:gap-2">
            {/* Blank leading days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`blank-${i}`} className="min-h-[85px] rounded-xs bg-paper/20 dark:bg-white/[0.02]" />
            ))}

            {/* Actual Days */}
            {Array.from({ length: totalDays }).map((_, i) => {
              const dayNum = i + 1;
              const dateObj = new Date(year, month, dayNum);
              const dateKey = dateObj.toISOString().split("T")[0];
              const movesOnDay = bookedMovesByDate.get(dateKey) || [];
              const isSelected = selectedDateKey === dateKey;

              return (
                <div
                  key={dayNum}
                  onClick={() => setSelectedDay(dateObj)}
                  className={`group relative min-h-[90px] cursor-pointer rounded-xs border p-2 transition-all ${
                    isSelected
                      ? "border-gold bg-gold/10 ring-1 ring-gold shadow-sm"
                      : movesOnDay.length > 0
                      ? "border-hairline bg-paper hover:border-gold/50 dark:border-white/10 dark:bg-[#070c14]"
                      : "border-hairline/60 bg-paper/50 hover:bg-paper dark:border-white/5 dark:bg-[#070c14]/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono text-xs font-semibold ${
                        isSelected
                          ? "text-gold font-bold"
                          : movesOnDay.length > 0
                          ? "text-navy-deep dark:text-white"
                          : "text-slate-light dark:text-gray-500"
                      }`}
                    >
                      {dayNum}
                    </span>
                    {movesOnDay.length > 0 && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gold/20 font-mono text-[9px] font-bold text-gold">
                        {movesOnDay.length}
                      </span>
                    )}
                  </div>

                  {/* Moves snippet list */}
                  <div className="mt-1.5 space-y-1">
                    {movesOnDay.slice(0, 2).map((m) => {
                      const meta = MOVE_TYPE_LABELS[m.bookedSlot?.moveType || "LOCAL"];
                      return (
                        <div
                          key={m.id}
                          className={`truncate rounded-xs border px-1.5 py-0.5 text-[9px] font-medium leading-tight ${meta.bg} ${meta.text}`}
                        >
                          {m.name.split(" ")[0]} ({m.bookedSlot?.moveType === "LOCAL" ? "Local" : "AB/OOP"})
                        </div>
                      );
                    })}
                    {movesOnDay.length > 2 && (
                      <span className="block text-[9px] font-mono text-slate-light dark:text-gray-400">
                        +{movesOnDay.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Inspector Sidebar */}
        <div className="flex flex-col justify-between rounded-card border border-hairline bg-paper-muted p-5 shadow-xs dark:border-white/10 dark:bg-[#0f172a]">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-gold">
              <CalendarIcon size={15} />
              <span>Day Schedule Dispatch</span>
            </div>

            <h3 className="font-display mt-2 text-lg font-bold text-navy-deep dark:text-white">
              {selectedDay
                ? selectedDay.toLocaleDateString("en-CA", { dateStyle: "full" })
                : "Select a date on the calendar"}
            </h3>

            {selectedDay && (
              <div className="mt-4 space-y-3">
                {movesForSelectedDay.length === 0 ? (
                  <div className="rounded-xs border border-dashed border-hairline p-6 text-center text-xs text-slate dark:border-white/10 dark:text-gray-400">
                    No moves currently booked on this date.
                  </div>
                ) : (
                  movesForSelectedDay.map((req) => {
                    const meta = MOVE_TYPE_LABELS[req.bookedSlot?.moveType || "LOCAL"];
                    return (
                      <div
                        key={req.id}
                        className="rounded-xs border border-hairline bg-paper p-3.5 text-xs shadow-2xs space-y-2 dark:border-white/10 dark:bg-[#070c14]"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-navy-deep dark:text-white">
                            {req.name}
                          </span>
                          <span
                            className={`rounded-xs border px-2 py-0.5 font-mono text-[9px] font-bold ${meta.bg} ${meta.text}`}
                          >
                            {meta.label}
                          </span>
                        </div>

                        <div className="space-y-1 font-mono text-[11px] text-slate dark:text-gray-300">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={12} className="text-gold shrink-0" />
                            <span className="truncate">{req.pickupAddress}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Truck size={12} className="text-gold shrink-0" />
                            <span>{req.moveSize || "Standard Scope"}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone size={12} className="text-gold shrink-0" />
                            <span>{req.phone}</span>
                          </div>
                        </div>

                        {req.notes && (
                          <p className="border-t border-hairline/60 pt-2 text-[10px] text-slate-light dark:border-white/10 dark:text-gray-400">
                            {req.notes}
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-hairline pt-4 dark:border-white/10 text-[11px] text-slate dark:text-gray-400">
            <div className="flex items-center gap-1.5 font-mono">
              <CheckCircle size={13} className="text-emerald-500" />
              <span>Full single-crew continuity active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
