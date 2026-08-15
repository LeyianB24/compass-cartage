// src/components/MovingChecklist.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckSquare,
  Square,
  Calendar,
  Sparkles,
  Download,
  RotateCcw,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { RELOCATION_CHECKLIST, type ChecklistMilestone } from "@/lib/constants";

const STORAGE_KEY = "compass_cartage_checklist_state";

export default function MovingChecklist() {
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({
    "8-weeks": true,
    "4-weeks": true,
    "2-weeks": true,
    "1-week": true,
    "move-day": true,
    "post-move": true,
  });

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCompletedTasks(JSON.parse(saved));
      }
    } catch {
      // Ignore fallback
    }
  }, []);

  // Persist state to localStorage
  const toggleTask = (id: string) => {
    setCompletedTasks((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore fallback
      }
      return next;
    });
  };

  const toggleMilestone = (id: string) => {
    setExpandedMilestones((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetAll = () => {
    setCompletedTasks({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  // Calculate completion statistics
  let totalTasksCount = 0;
  let completedCount = 0;

  RELOCATION_CHECKLIST.forEach((m) => {
    m.tasks.forEach((t) => {
      totalTasksCount++;
      if (completedTasks[t.id]) completedCount++;
    });
  });

  const progressPercent = Math.round((completedCount / (totalTasksCount || 1)) * 100);

  // Print function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-5xl rounded-card border border-hairline bg-paper-muted shadow-lg overflow-hidden">
      {/* Top Header */}
      <div className="bg-navy-deep px-6 py-6 text-paper md:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-gold/15 text-gold">
              <Calendar size={22} />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-paper md:text-2xl">
                Relocation Countdown & Moving Checklist
              </h2>
              <p className="text-xs text-paper/70">
                8-week timeline designed to keep your move stress-free and on schedule.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-sm border border-paper/20 bg-paper-muted/10 px-3.5 py-1.5 text-xs font-semibold text-paper transition-colors hover:bg-paper-muted/20"
            >
              <Download size={14} />
              <span>Print Checklist</span>
            </button>
            {completedCount > 0 && (
              <button
                onClick={resetAll}
                className="inline-flex items-center gap-1 text-xs text-paper/60 hover:text-gold"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 border-t border-paper/10 pt-4">
          <div className="flex items-center justify-between text-xs text-paper/80 mb-2">
            <span className="font-medium">Move Readiness Progress</span>
            <span className="font-display font-semibold text-gold">
              {completedCount} of {totalTasksCount} Completed ({progressPercent}%)
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-paper-muted/10">
            <motion.div
              className="h-full bg-gold"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Main Checklist Body */}
      <div className="p-6 md:p-10 space-y-8">
        {RELOCATION_CHECKLIST.map((milestone: ChecklistMilestone) => {
          const isExpanded = expandedMilestones[milestone.id];
          const milestoneTasks = milestone.tasks;
          const milestoneCompleted = milestoneTasks.filter((t) => completedTasks[t.id]).length;
          const isAllDone = milestoneCompleted === milestoneTasks.length;

          return (
            <div
              key={milestone.id}
              className="rounded-sm border border-hairline bg-paper/30 overflow-hidden shadow-2xs"
            >
              {/* Milestone Accordion Header */}
              <div
                onClick={() => toggleMilestone(milestone.id)}
                className="flex cursor-pointer items-center justify-between bg-paper p-4 md:px-6 transition-colors hover:bg-paper-muted"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${
                      isAllDone
                        ? "bg-emerald-500 text-white"
                        : "bg-navy-deep text-gold"
                    }`}
                  >
                    {isAllDone ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                  </div>

                  <div>
                    <span className="eyebrow text-[10px] text-gold">{milestone.timeframe}</span>
                    <h3 className="font-display text-base font-semibold text-navy-deep">
                      {milestone.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-slate">
                    {milestoneCompleted}/{milestoneTasks.length} Done
                  </span>
                  {isExpanded ? (
                    <ChevronUp size={18} className="text-slate" />
                  ) : (
                    <ChevronDown size={18} className="text-slate" />
                  )}
                </div>
              </div>

              {/* Tasks List */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="border-t border-hairline p-4 md:p-6 space-y-3 bg-paper-muted"
                  >
                    {milestoneTasks.map((task) => {
                      const isChecked = Boolean(completedTasks[task.id]);
                      return (
                        <div
                          key={task.id}
                          onClick={() => toggleTask(task.id)}
                          className={`group flex cursor-pointer items-start gap-3.5 rounded-sm border p-3.5 transition-all ${
                            isChecked
                              ? "border-emerald-200 bg-emerald-50/40 text-slate-light"
                              : "border-hairline bg-paper-muted hover:border-gold/60"
                          }`}
                        >
                          <div className="mt-0.5 shrink-0 text-gold transition-transform group-hover:scale-110">
                            {isChecked ? (
                              <CheckSquare size={18} className="text-emerald-600" />
                            ) : (
                              <Square size={18} className="text-slate-light group-hover:text-gold" />
                            )}
                          </div>

                          <div className="flex-1">
                            <p
                              className={`text-sm transition-all ${
                                isChecked
                                  ? "line-through text-slate-light font-normal"
                                  : "text-navy-deep font-medium"
                              }`}
                            >
                              {task.text}
                            </p>
                          </div>

                          <span className="shrink-0 rounded-xs bg-paper px-2 py-0.5 text-[10px] font-semibold text-slate">
                            {task.category}
                          </span>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
