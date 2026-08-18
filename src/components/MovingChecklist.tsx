// src/components/MovingChecklist.tsx
"use client";

import { useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckSquare,
  Square,
  Calendar,
  Download,
  RotateCcw,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Search,
  Plus,
  Trash2,
  Copy,
  Check,
  Sparkles,
  Filter,
} from "lucide-react";
import { RELOCATION_CHECKLIST } from "@/lib/constants";

const STORAGE_KEY = "compass_cartage_checklist_v3_state";
const CUSTOM_TASKS_KEY = "compass_cartage_custom_tasks_v3";

type CustomTask = {
  id: string;
  milestoneId: string;
  text: string;
  category: string;
};

const EMPTY_RECORD: Record<string, boolean> = {};
const EMPTY_CUSTOM: CustomTask[] = [];

// Snapshot caches for referential stability in React 19 useSyncExternalStore
let cachedTasksRaw = "";
let cachedTasksParsed: Record<string, boolean> = EMPTY_RECORD;

function getTasksSnapshot(): Record<string, boolean> {
  if (typeof window === "undefined") return EMPTY_RECORD;
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || "{}";
    if (raw !== cachedTasksRaw) {
      cachedTasksRaw = raw;
      cachedTasksParsed = JSON.parse(raw);
    }
    return cachedTasksParsed;
  } catch {
    return EMPTY_RECORD;
  }
}

let cachedCustomRaw = "";
let cachedCustomParsed: CustomTask[] = EMPTY_CUSTOM;

function getCustomSnapshot(): CustomTask[] {
  if (typeof window === "undefined") return EMPTY_CUSTOM;
  try {
    const raw = localStorage.getItem(CUSTOM_TASKS_KEY) || "[]";
    if (raw !== cachedCustomRaw) {
      cachedCustomRaw = raw;
      cachedCustomParsed = JSON.parse(raw);
    }
    return cachedCustomParsed;
  } catch {
    return EMPTY_CUSTOM;
  }
}

const listeners = new Set<() => void>();
function subscribeStore(callback: () => void) {
  listeners.add(callback);
  const onStorage = () => callback();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function notifyStore() {
  listeners.forEach((l) => l());
}

export default function MovingChecklist() {
  const completedTasks = useSyncExternalStore(
    subscribeStore,
    getTasksSnapshot,
    () => EMPTY_RECORD
  );

  const customTasks = useSyncExternalStore(
    subscribeStore,
    getCustomSnapshot,
    () => EMPTY_CUSTOM
  );

  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({
    "8-weeks": true,
    "4-weeks": true,
    "2-weeks": true,
    "1-week": true,
    "move-day": true,
    "post-move": true,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all");
  const [copied, setCopied] = useState(false);

  // New Custom Task input state
  const [newCustomText, setNewCustomText] = useState("");
  const [newCustomMilestone, setNewCustomMilestone] = useState("8-weeks");
  const [newCustomCategory, setNewCustomCategory] = useState("Custom");
  const [showAddModal, setShowAddModal] = useState(false);

  // Storage mutators
  const updateCompletedTasks = (next: Record<string, boolean>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
    notifyStore();
  };

  const updateCustomTasks = (next: CustomTask[]) => {
    try {
      localStorage.setItem(CUSTOM_TASKS_KEY, JSON.stringify(next));
    } catch {}
    notifyStore();
  };

  const toggleTask = (id: string) => {
    const next = { ...completedTasks, [id]: !completedTasks[id] };
    updateCompletedTasks(next);
  };

  const toggleMilestone = (id: string) => {
    setExpandedMilestones((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const markMilestoneAll = (milestoneId: string, value: boolean) => {
    const milestone = combinedMilestones.find((m) => m.id === milestoneId);
    if (!milestone) return;
    const next = { ...completedTasks };
    milestone.tasks.forEach((t) => {
      next[t.id] = value;
    });
    updateCompletedTasks(next);
  };

  const resetAll = () => {
    if (window.confirm("Are you sure you want to reset all checked checklist items?")) {
      updateCompletedTasks({});
    }
  };

  const addCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomText.trim()) return;
    const newTask: CustomTask = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      milestoneId: newCustomMilestone,
      text: newCustomText.trim(),
      category: newCustomCategory.trim() || "Custom",
    };
    updateCustomTasks([...customTasks, newTask]);
    setNewCustomText("");
    setShowAddModal(false);
  };

  const removeCustomTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextCustom = customTasks.filter((t) => t.id !== id);
    updateCustomTasks(nextCustom);
    const nextCompleted = { ...completedTasks };
    delete nextCompleted[id];
    updateCompletedTasks(nextCompleted);
  };

  // Combine default milestone tasks with custom user tasks
  const combinedMilestones = RELOCATION_CHECKLIST.map((milestone) => {
    const customsForMilestone = customTasks.filter((c) => c.milestoneId === milestone.id);
    return {
      ...milestone,
      tasks: [...milestone.tasks, ...customsForMilestone],
    };
  });

  // Extract all categories dynamically
  const allCategories = (() => {
    const cats = new Set<string>();
    cats.add("All");
    combinedMilestones.forEach((m) => {
      m.tasks.forEach((t) => cats.add(t.category));
    });
    return Array.from(cats);
  })();

  // Total statistics
  let totalCount = 0;
  let completedCount = 0;
  combinedMilestones.forEach((m) => {
    m.tasks.forEach((t) => {
      totalCount++;
      if (completedTasks[t.id]) completedCount++;
    });
  });
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filtered milestones per search, category, and status
  const filteredMilestones = combinedMilestones
    .map((milestone) => {
      const filteredTasks = milestone.tasks.filter((t) => {
        const matchesSearch =
          searchQuery.trim() === "" ||
          t.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = activeCategory === "All" || t.category === activeCategory;

        const isChecked = Boolean(completedTasks[t.id]);
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "completed" && isChecked) ||
          (statusFilter === "pending" && !isChecked);

        return matchesSearch && matchesCategory && matchesStatus;
      });

      return {
        ...milestone,
        tasks: filteredTasks,
      };
    })
    .filter((m) => m.tasks.length > 0 || searchQuery === "");

  const handleCopy = () => {
    let text = `# Compass Cartage Moving Checklist (${progressPercent}% Ready)\n\n`;
    combinedMilestones.forEach((m) => {
      text += `## ${m.timeframe} - ${m.title}\n`;
      m.tasks.forEach((t) => {
        const status = completedTasks[t.id] ? "[x]" : "[ ]";
        text += `${status} [${t.category}] ${t.text}\n`;
      });
      text += "\n";
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-5xl rounded-card border border-hairline bg-paper-muted shadow-lg overflow-hidden">
      {/* Top Header Bar - Permanent Dark Surface */}
      <div className="bg-[#071426] dark:bg-[#030914] px-6 py-6 text-[#f7f6f2] md:px-10 border-b border-gold/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-gold/15 text-gold">
              <Calendar size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-semibold text-[#f7f6f2] md:text-2xl">
                  Interactive Moving Checklist
                </h2>
                <span className="hidden rounded-xs bg-gold/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-soft sm:inline-block">
                  Live Planner
                </span>
              </div>
              <p className="text-xs text-[#f7f6f2]/75">
                8-week step-by-step relocation countdown with custom tasks and offline memory.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowAddModal(!showAddModal)}
              className="inline-flex items-center gap-1.5 rounded-sm bg-gold px-3 py-1.5 text-xs font-semibold text-[#071426] transition-colors hover:bg-gold-soft"
            >
              <Plus size={14} />
              <span>Add Custom Task</span>
            </button>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-sm border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#f7f6f2] transition-colors hover:bg-white/20"
              title="Copy checklist markdown to clipboard"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-sm border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#f7f6f2] transition-colors hover:bg-white/20"
            >
              <Download size={14} />
              <span>Print</span>
            </button>

            {completedCount > 0 && (
              <button
                onClick={resetAll}
                className="inline-flex items-center gap-1 text-xs text-[#f7f6f2]/60 hover:text-gold-soft transition-colors ml-1"
                title="Reset completed tasks"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 border-t border-white/10 pt-4">
          <div className="flex items-center justify-between text-xs text-[#f7f6f2]/90 mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Move Readiness Progress</span>
              {progressPercent === 100 && (
                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                  <Sparkles size={13} /> 100% Ready!
                </span>
              )}
            </div>
            <span className="font-display font-semibold text-gold">
              {completedCount} of {totalCount} Completed ({progressPercent}%)
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-gold-soft to-gold"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Controls & Filters */}
      <div className="border-b border-hairline bg-paper p-4 md:px-8 space-y-4">
        {/* Add Custom Task Drawer */}
        <AnimatePresence>
          {showAddModal && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={addCustomTask}
              className="overflow-hidden rounded-sm border border-gold/40 bg-gold/5 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy-deep uppercase tracking-wider">
                  Add Personal Moving Task
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-xs text-slate hover:text-navy-deep"
                >
                  Cancel
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  type="text"
                  placeholder="Task description (e.g. Return condo keys)..."
                  value={newCustomText}
                  onChange={(e) => setNewCustomText(e.target.value)}
                  className="sm:col-span-2 rounded-xs border border-hairline bg-paper px-3 py-2 text-xs text-navy-deep focus:border-gold focus:outline-none"
                  autoFocus
                />

                <div className="flex gap-2">
                  <select
                    value={newCustomMilestone}
                    onChange={(e) => setNewCustomMilestone(e.target.value)}
                    className="flex-1 rounded-xs border border-hairline bg-paper px-3 py-2 text-xs text-navy-deep focus:border-gold focus:outline-none"
                  >
                    {RELOCATION_CHECKLIST.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.timeframe}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Category"
                    value={newCustomCategory}
                    onChange={(e) => setNewCustomCategory(e.target.value)}
                    className="w-24 rounded-xs border border-hairline bg-paper px-2 py-2 text-xs text-navy-deep focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="rounded-xs bg-gold px-4 py-1.5 text-xs font-semibold text-navy-deep hover:bg-gold-soft"
                >
                  Save Task
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Search and Status Segments */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-light" />
            <input
              type="text"
              placeholder="Search checklist tasks or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-sm border border-hairline bg-paper-muted pl-9 pr-3 py-2 text-xs text-navy-deep placeholder:text-slate-light focus:border-gold focus:bg-paper focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 rounded-sm border border-hairline bg-paper-muted p-1 text-xs">
            <button
              onClick={() => setStatusFilter("all")}
              className={`rounded-xs px-2.5 py-1 font-medium transition-colors ${
                statusFilter === "all" ? "bg-navy-deep text-paper shadow-xs" : "text-slate hover:text-navy-deep"
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`rounded-xs px-2.5 py-1 font-medium transition-colors ${
                statusFilter === "pending" ? "bg-navy-deep text-paper shadow-xs" : "text-slate hover:text-navy-deep"
              }`}
            >
              Pending ({totalCount - completedCount})
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`rounded-xs px-2.5 py-1 font-medium transition-colors ${
                statusFilter === "completed" ? "bg-navy-deep text-paper shadow-xs" : "text-slate hover:text-navy-deep"
              }`}
            >
              Done ({completedCount})
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <Filter size={13} className="shrink-0 text-gold mr-1" />
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-xs px-2.5 py-1 font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-gold text-navy-deep font-semibold shadow-xs"
                  : "bg-paper-muted text-slate hover:bg-paper hover:text-navy-deep border border-hairline"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Checklist Body */}
      <div className="p-6 md:p-10 space-y-6">
        {filteredMilestones.length === 0 ? (
          <div className="rounded-sm border border-hairline bg-paper p-8 text-center">
            <p className="text-sm font-medium text-navy-deep">No matching tasks found.</p>
            <p className="mt-1 text-xs text-slate">Try clearing your search query or category filters.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
                setStatusFilter("all");
              }}
              className="mt-3 inline-block text-xs font-semibold text-gold hover:underline"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          filteredMilestones.map((milestone) => {
            const isExpanded = expandedMilestones[milestone.id] ?? true;
            const milestoneTasks = milestone.tasks;
            const milestoneCompleted = milestoneTasks.filter((t) => completedTasks[t.id]).length;
            const isAllDone = milestoneTasks.length > 0 && milestoneCompleted === milestoneTasks.length;

            return (
              <div
                key={milestone.id}
                className="rounded-sm border border-hairline bg-paper/60 overflow-hidden shadow-2xs transition-all"
              >
                {/* Milestone Accordion Header */}
                <div
                  onClick={() => toggleMilestone(milestone.id)}
                  className="flex cursor-pointer items-center justify-between bg-paper p-4 md:px-6 transition-colors hover:bg-paper-muted"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
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

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate">
                      {milestoneCompleted}/{milestoneTasks.length} Done
                    </span>

                    {/* Quick Milestone Mark Buttons */}
                    <div className="hidden sm:flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {!isAllDone ? (
                        <button
                          type="button"
                          onClick={() => markMilestoneAll(milestone.id, true)}
                          className="text-[11px] font-medium text-gold hover:underline"
                        >
                          Check All
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => markMilestoneAll(milestone.id, false)}
                          className="text-[11px] font-medium text-slate hover:underline"
                        >
                          Uncheck
                        </button>
                      )}
                    </div>

                    {isExpanded ? (
                      <ChevronUp size={18} className="text-slate ml-1" />
                    ) : (
                      <ChevronDown size={18} className="text-slate ml-1" />
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
                      transition={{ duration: 0.2 }}
                      className="border-t border-hairline p-4 md:p-6 space-y-2.5 bg-paper-muted/50"
                    >
                      {milestoneTasks.map((task) => {
                        const isChecked = Boolean(completedTasks[task.id]);
                        const isCustom = task.id.startsWith("custom-");

                        return (
                          <div
                            key={task.id}
                            onClick={() => toggleTask(task.id)}
                            className={`group flex cursor-pointer items-start gap-3.5 rounded-sm border p-3 transition-all ${
                              isChecked
                                ? "border-emerald-500/30 bg-emerald-500/5 text-slate-light dark:border-emerald-500/20"
                                : "border-hairline bg-paper hover:border-gold/60"
                            }`}
                          >
                            <div className="mt-0.5 shrink-0 transition-transform group-hover:scale-110">
                              {isChecked ? (
                                <CheckSquare size={18} className="text-emerald-500" />
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

                            <div className="flex items-center gap-2">
                              <span className="shrink-0 rounded-xs bg-paper-muted px-2 py-0.5 text-[10px] font-semibold text-slate border border-hairline">
                                {task.category}
                              </span>

                              {isCustom && (
                                <button
                                  type="button"
                                  onClick={(e) => removeCustomTask(task.id, e)}
                                  className="text-slate-light hover:text-red-500 p-0.5 transition-colors"
                                  title="Delete custom task"
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
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
