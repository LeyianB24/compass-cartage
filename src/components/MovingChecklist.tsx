// src/components/MovingChecklist.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  CheckSquare,
  Square,
  Sparkles,
  Plus,
  Trash2,
  Download,
  Copy,
  Check,
  RotateCcw,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { RELOCATION_CHECKLIST, type ChecklistMilestone } from "@/lib/constants";

type ChecklistTask = {
  id: string;
  milestoneId: string;
  text: string;
  category: string;
};

const STORAGE_KEY = "compass_cartage_checklist_state_v2";

export default function MovingChecklist() {
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [customTasks, setCustomTasks] = useState<ChecklistTask[]>([]);
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({
    "8-weeks": true,
    "4-weeks": true,
    "2-weeks": true,
    "1-week": true,
    "moving-day": true,
    "post-move": true,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all");
  const [copied, setCopied] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Custom task form state
  const [newCustomText, setNewCustomText] = useState("");
  const [newCustomMilestone, setNewCustomMilestone] = useState("8-weeks");
  const [newCustomCategory, setNewCustomCategory] = useState("Personal");

  // Load persisted state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.completed) {
          queueMicrotask(() => setCompletedTasks(parsed.completed));
        }
        if (parsed.custom) {
          queueMicrotask(() => setCustomTasks(parsed.custom));
        }
      }
    } catch {
      // Ignore local storage parse errors
    }
  }, []);

  // Persist state to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          completed: completedTasks,
          custom: customTasks,
        })
      );
    } catch {
      // Ignore local storage write errors
    }
  }, [completedTasks, customTasks]);

  // Combine default checklist milestones with user custom tasks
  const combinedMilestones: ChecklistMilestone[] = RELOCATION_CHECKLIST.map((milestone) => {
    const customForMilestone = customTasks.filter((t) => t.milestoneId === milestone.id);
    return {
      ...milestone,
      tasks: [...milestone.tasks, ...customForMilestone],
    };
  });

  // Calculate global progress
  const allTasks = combinedMilestones.flatMap((m) => m.tasks);
  const totalCount = allTasks.length;
  const completedCount = allTasks.filter((t) => completedTasks[t.id]).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Toggle individual task status
  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  // Toggle milestone accordion expansion
  const toggleMilestone = (id: string) => {
    setExpandedMilestones((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Mark all tasks in a specific milestone
  const markMilestoneAll = (milestoneId: string, markDone: boolean) => {
    const milestone = combinedMilestones.find((m) => m.id === milestoneId);
    if (!milestone) return;

    setCompletedTasks((prev) => {
      const next = { ...prev };
      milestone.tasks.forEach((t) => {
        next[t.id] = markDone;
      });
      return next;
    });
  };

  // Reset all tasks
  const resetAll = () => {
    if (window.confirm("Reset all completed tasks and start fresh?")) {
      setCompletedTasks({});
    }
  };

  // Add custom user task
  const addCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomText.trim()) return;

    const newTask: ChecklistTask = {
      id: `custom-${Date.now()}`,
      text: newCustomText.trim(),
      category: newCustomCategory.trim() || "Custom",
      milestoneId: newCustomMilestone,
    };

    setCustomTasks((prev) => [...prev, newTask]);
    setNewCustomText("");
    setShowAddModal(false);

    // Expand destination milestone
    setExpandedMilestones((prev) => ({ ...prev, [newCustomMilestone]: true }));
  };

  // Remove custom task
  const removeCustomTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomTasks((prev) => prev.filter((t) => t.id !== id));
    setCompletedTasks((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  // Extract all categories for filtering
  const allCategories = ["All", ...Array.from(new Set(allTasks.map((t) => t.category)))];

  // Filter tasks based on search, category, and completion status
  const filteredMilestones = combinedMilestones
    .map((milestone) => {
      const tasks = milestone.tasks.filter((task) => {
        const matchesSearch =
          task.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === "All" || task.category === activeCategory;
        const isDone = Boolean(completedTasks[task.id]);
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "pending" && !isDone) ||
          (statusFilter === "completed" && isDone);

        return matchesSearch && matchesCategory && matchesStatus;
      });

      return { ...milestone, tasks };
    })
    .filter((m) => m.tasks.length > 0 || searchQuery === "");

  // Copy checklist markdown summary
  const handleCopy = () => {
    let text = `# Compass Cartage Moving Checklist\n`;
    text += `Readiness Progress: ${completedCount}/${totalCount} (${progressPercent}%)\n\n`;

    combinedMilestones.forEach((m) => {
      text += `## ${m.timeframe} - ${m.title}\n`;
      m.tasks.forEach((t) => {
        const check = completedTasks[t.id] ? "[x]" : "[ ]";
        text += `${check} ${t.text} (${t.category})\n`;
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
    <div className="mx-auto max-w-5xl rounded-card border border-hairline bg-paper-muted shadow-lg overflow-hidden dark:border-white/10 dark:bg-[#0f172a]">
      {/* Top Header Bar */}
      <div className="bg-navy-deep px-6 py-6 text-white md:px-10 border-b border-hairline dark:bg-[#070c14] dark:border-white/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xs bg-gold/15 text-gold">
              <Calendar size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-semibold text-white md:text-2xl">
                  Interactive Moving Checklist
                </h2>
                <span className="hidden rounded-xs bg-gold/20 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-gold-soft sm:inline-block">
                  Live Planner
                </span>
              </div>
              <p className="text-xs text-white/80 dark:text-gray-300 font-normal">
                8-week step-by-step relocation countdown with custom tasks and offline memory.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowAddModal(!showAddModal)}
              className="inline-flex items-center gap-1.5 rounded-xs bg-gold px-3.5 py-2 text-xs font-bold text-navy-deep transition-all hover:bg-gold-soft"
            >
              <Plus size={14} />
              <span>Add Custom Task</span>
            </button>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-xs border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20"
              title="Copy checklist markdown to clipboard"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xs border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20"
            >
              <Download size={14} />
              <span>Print</span>
            </button>

            {completedCount > 0 && (
              <button
                onClick={resetAll}
                className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-gold-soft transition-colors ml-1"
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
          <div className="flex items-center justify-between text-xs text-white/90 mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Move Readiness Progress</span>
              {progressPercent === 100 && (
                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                  <Sparkles size={13} /> 100% Ready!
                </span>
              )}
            </div>
            <span className="font-mono font-bold text-gold">
              {completedCount} of {totalCount} Completed ({progressPercent}%)
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
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
      <div className="border-b border-hairline bg-paper p-4 md:px-8 space-y-4 dark:border-white/10 dark:bg-[#070c14]">
        {/* Add Custom Task Drawer */}
        <AnimatePresence>
          {showAddModal && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={addCustomTask}
              className="overflow-hidden rounded-xs border border-gold/40 bg-gold/5 p-4 space-y-3 dark:bg-[#0f172a]"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-navy-deep uppercase tracking-wider dark:text-white">
                  Add Personal Moving Task
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-xs text-slate hover:text-navy-deep dark:text-gray-400 dark:hover:text-white"
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
                  className="sm:col-span-2 rounded-xs border border-hairline bg-paper px-3 py-2 text-xs text-navy-deep focus:border-gold focus:outline-none dark:border-white/15 dark:bg-[#070c14] dark:text-white"
                  autoFocus
                />

                <div className="flex gap-2">
                  <select
                    value={newCustomMilestone}
                    onChange={(e) => setNewCustomMilestone(e.target.value)}
                    className="flex-1 rounded-xs border border-hairline bg-paper px-3 py-2 text-xs text-navy-deep focus:border-gold focus:outline-none dark:border-white/15 dark:bg-[#070c14] dark:text-white"
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
                    className="w-24 rounded-xs border border-hairline bg-paper px-2 py-2 text-xs text-navy-deep focus:border-gold focus:outline-none dark:border-white/15 dark:bg-[#070c14] dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="rounded-xs bg-gold px-4 py-1.5 text-xs font-bold text-navy-deep hover:bg-gold-soft"
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
            <Search size={15} className="absolute left-3 top-2.5 text-slate-light dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search checklist tasks or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xs border border-hairline bg-paper-muted pl-9 pr-3 py-2 text-xs text-navy-deep placeholder:text-slate-light focus:border-gold focus:outline-none dark:border-white/15 dark:bg-[#0f172a] dark:text-white dark:placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-1.5 rounded-xs border border-hairline bg-paper-muted p-1 text-xs dark:border-white/10 dark:bg-[#0f172a]">
            <button
              onClick={() => setStatusFilter("all")}
              className={`rounded-xs px-2.5 py-1 font-medium transition-colors ${
                statusFilter === "all"
                  ? "bg-navy-deep text-gold-soft font-bold shadow-xs dark:bg-gold dark:text-navy-deep"
                  : "text-slate hover:text-navy-deep dark:text-gray-300 dark:hover:text-white"
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`rounded-xs px-2.5 py-1 font-medium transition-colors ${
                statusFilter === "pending"
                  ? "bg-navy-deep text-gold-soft font-bold shadow-xs dark:bg-gold dark:text-navy-deep"
                  : "text-slate hover:text-navy-deep dark:text-gray-300 dark:hover:text-white"
              }`}
            >
              Pending ({totalCount - completedCount})
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`rounded-xs px-2.5 py-1 font-medium transition-colors ${
                statusFilter === "completed"
                  ? "bg-navy-deep text-gold-soft font-bold shadow-xs dark:bg-gold dark:text-navy-deep"
                  : "text-slate hover:text-navy-deep dark:text-gray-300 dark:hover:text-white"
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
                  ? "bg-gold text-navy-deep font-bold shadow-xs"
                  : "bg-paper-muted text-slate hover:bg-paper hover:text-navy-deep border border-hairline dark:border-white/10 dark:bg-[#0f172a] dark:text-gray-300 dark:hover:bg-[#070c14] dark:hover:text-gold"
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
          <div className="rounded-xs border border-hairline bg-paper p-8 text-center dark:border-white/10 dark:bg-[#070c14]">
            <p className="text-sm font-medium text-navy-deep dark:text-white">No matching tasks found.</p>
            <p className="mt-1 text-xs text-slate dark:text-gray-400">Try clearing your search query or category filters.</p>
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
                className="rounded-xs border border-hairline bg-paper/60 overflow-hidden shadow-2xs transition-all dark:border-white/10 dark:bg-[#070c14]"
              >
                {/* Milestone Accordion Header */}
                <div
                  onClick={() => toggleMilestone(milestone.id)}
                  className="flex cursor-pointer items-center justify-between bg-paper p-4 md:px-6 transition-colors hover:bg-paper-muted dark:bg-[#070c14] dark:hover:bg-[#0f172a]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                        isAllDone
                          ? "bg-emerald-500 text-white"
                          : "bg-navy-deep text-gold dark:bg-gold/20 dark:text-gold"
                      }`}
                    >
                      {isAllDone ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                    </div>

                    <div>
                      <span className="font-mono text-[10px] font-bold text-gold uppercase tracking-wider">{milestone.timeframe}</span>
                      <h3 className="font-display text-base font-semibold text-navy-deep dark:text-white">
                        {milestone.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-slate dark:text-gray-300">
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
                          className="text-[11px] font-medium text-slate hover:underline dark:text-gray-400"
                        >
                          Uncheck
                        </button>
                      )}
                    </div>

                    {isExpanded ? (
                      <ChevronUp size={18} className="text-slate dark:text-gray-400 ml-1" />
                    ) : (
                      <ChevronDown size={18} className="text-slate dark:text-gray-400 ml-1" />
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
                      className="border-t border-hairline p-4 md:p-6 space-y-2.5 bg-paper-muted/50 dark:border-white/10 dark:bg-[#0f172a]/70"
                    >
                      {milestoneTasks.map((task) => {
                        const isChecked = Boolean(completedTasks[task.id]);
                        const isCustom = task.id.startsWith("custom-");

                        return (
                          <div
                            key={task.id}
                            onClick={() => toggleTask(task.id)}
                            className={`group flex cursor-pointer items-start gap-3.5 rounded-xs border p-3 transition-all ${
                              isChecked
                                ? "border-emerald-500/30 bg-emerald-500/5 text-slate-light dark:border-emerald-500/20 dark:bg-emerald-950/10"
                                : "border-hairline bg-paper hover:border-gold/60 dark:border-white/10 dark:bg-[#070c14] dark:hover:border-gold/60"
                            }`}
                          >
                            <div className="mt-0.5 shrink-0 transition-transform group-hover:scale-110">
                              {isChecked ? (
                                <CheckSquare size={18} className="text-emerald-500" />
                              ) : (
                                <Square size={18} className="text-slate-light group-hover:text-gold dark:text-gray-500" />
                              )}
                            </div>

                            <div className="flex-1">
                              <p
                                className={`text-sm transition-all ${
                                  isChecked
                                    ? "line-through text-slate-light font-normal dark:text-gray-500"
                                    : "text-navy-deep font-medium dark:text-white"
                                }`}
                              >
                                {task.text}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="shrink-0 rounded-xs bg-paper-muted px-2 py-0.5 text-[10px] font-semibold text-slate border border-hairline dark:border-white/10 dark:bg-[#0f172a] dark:text-gray-300">
                                {task.category}
                              </span>

                              {isCustom && (
                                <button
                                  type="button"
                                  onClick={(e) => removeCustomTask(task.id, e)}
                                  className="text-slate-light hover:text-red-500 p-0.5 transition-colors dark:hover:text-red-400"
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
