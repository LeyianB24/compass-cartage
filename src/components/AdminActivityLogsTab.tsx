// src/components/AdminActivityLogsTab.tsx
"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  FileText,
  Clock,
  User,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Mail,
  CalendarCheck,
  Tag,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from "lucide-react";

export type SerializedActivityLog = {
  id: string;
  action: string;
  category: string;
  quoteNumber: string | null;
  quoteRequestId: string | null;
  actor: string;
  title: string;
  details: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
  status: string;
  createdAt: string;
  quoteRequest?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    pickupAddress: string;
    dropoffAddress: string;
    status: string;
  } | null;
};

type Props = {
  logs: SerializedActivityLog[];
  onSelectQuote?: (quoteNumberOrId: string) => void;
};

const CATEGORIES = ["ALL", "QUOTE", "EMAIL", "STATUS", "BOOKING", "DISPATCH"] as const;

export default function AdminActivityLogsTab({ logs, onSelectQuote }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Category filter
      if (selectedCategory !== "ALL" && log.category.toUpperCase() !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuoteNum = log.quoteNumber?.toLowerCase().includes(q) || false;
        const matchesTitle = log.title.toLowerCase().includes(q);
        const matchesDetails = log.details?.toLowerCase().includes(q) || false;
        const matchesActor = log.actor.toLowerCase().includes(q);
        const matchesClient =
          log.quoteRequest?.name.toLowerCase().includes(q) ||
          log.quoteRequest?.email.toLowerCase().includes(q) ||
          log.quoteRequest?.phone.toLowerCase().includes(q) ||
          false;

        return matchesQuoteNum || matchesTitle || matchesDetails || matchesActor || matchesClient;
      }

      return true;
    });
  }, [logs, selectedCategory, searchQuery]);

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function handleExportCsv() {
    if (!filteredLogs.length) return;

    const headers = ["Timestamp", "Action", "Category", "Quote Number", "Actor", "Status", "Title", "Details"];
    const rows = filteredLogs.map((l) => [
      `"${new Date(l.createdAt).toLocaleString("en-CA")}"`,
      `"${l.action}"`,
      `"${l.category}"`,
      `"${l.quoteNumber || "N/A"}"`,
      `"${l.actor}"`,
      `"${l.status}"`,
      `"${l.title.replace(/"/g, '""')}"`,
      `"${(l.details || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `compass-cartage-audit-logs-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleExportJson() {
    if (!filteredLogs.length) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `compass-cartage-audit-logs-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  function getActionBadge(action: string) {
    switch (action) {
      case "QUOTE_SUBMITTED":
      case "MANUAL_LEAD":
        return {
          label: action === "MANUAL_LEAD" ? "MANUAL INTAKE" : "QUOTE SUBMITTED",
          className: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-400",
          icon: FileText,
        };
      case "EMAIL_DISPATCHED":
      case "ADMIN_EMAIL_SENT":
        return {
          label: action === "ADMIN_EMAIL_SENT" ? "ADMIN EMAIL" : "EMAIL NOTIFICATION",
          className: "bg-sky-500/15 text-sky-700 border-sky-500/30 dark:text-sky-400",
          icon: Mail,
        };
      case "STATUS_UPDATED":
        return {
          label: "STATUS CHANGED",
          className: "bg-purple-500/15 text-purple-700 border-purple-500/30 dark:text-purple-400",
          icon: Tag,
        };
      case "BOOKING_CREATED":
        return {
          label: "BOOKING CONFIRMED",
          className: "bg-gold/20 text-gold border-gold/40",
          icon: CalendarCheck,
        };
      case "BOOKING_CANCELLED":
      case "QUOTE_DELETED":
        return {
          label: action === "QUOTE_DELETED" ? "RECORD DELETED" : "BOOKING CANCELLED",
          className: "bg-rose-500/15 text-rose-700 border-rose-500/30 dark:text-rose-400",
          icon: AlertTriangle,
        };
      default:
        return {
          label: action.replace(/_/g, " "),
          className: "bg-slate-500/15 text-slate-700 border-slate-500/30 dark:text-gray-300",
          icon: Shield,
        };
    }
  }

  return (
    <div className="space-y-6">
      {/* Control Header & Export Bar */}
      <div className="flex flex-col gap-4 rounded-card border border-hairline bg-paper-muted p-5 dark:border-white/10 dark:bg-[#070c14] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-gold" />
            <h2 className="font-display text-lg font-bold text-navy-deep dark:text-white">
              Executive Activity & Audit Ledger
            </h2>
          </div>
          <p className="mt-1 font-mono text-xs text-slate dark:text-gray-400">
            Immutable chronological logging of all quote intakes, customer email dispatches, status transitions, and dispatch records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={filteredLogs.length === 0}
            className="flex items-center gap-1.5 rounded-xs border border-hairline bg-paper px-3 py-1.5 font-mono text-xs font-semibold text-navy-deep transition hover:border-gold disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            <Download className="h-3.5 w-3.5 text-gold" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handleExportJson}
            disabled={filteredLogs.length === 0}
            className="flex items-center gap-1.5 rounded-xs border border-hairline bg-paper px-3 py-1.5 font-mono text-xs font-semibold text-navy-deep transition hover:border-gold disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            <Download className="h-3.5 w-3.5 text-gold" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            const count = cat === "ALL" ? logs.length : logs.filter((l) => l.category.toUpperCase() === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 rounded-xs px-3 py-1.5 font-mono text-xs font-semibold transition ${
                  isActive
                    ? "border border-gold bg-navy text-gold dark:bg-gold dark:text-navy-deep"
                    : "border border-hairline bg-paper-muted text-slate hover:border-slate/40 dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] ${isActive ? "opacity-90" : "opacity-60"}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-light" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Quote #, name, actor, details..."
            className="w-full rounded-xs border border-hairline bg-paper-muted py-2 pl-9 pr-4 text-xs text-navy-deep placeholder-slate-light transition focus:border-gold focus:outline-none dark:border-white/10 dark:bg-[#070c14] dark:text-white"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate hover:text-navy-deep dark:text-gray-400 dark:hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Logs Table / Timeline List */}
      <div className="overflow-hidden rounded-card border border-hairline bg-paper-muted shadow-sm dark:border-white/10 dark:bg-[#070c14]">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="mx-auto h-8 w-8 text-slate-light opacity-50" />
            <p className="mt-3 font-display text-base font-semibold text-navy-deep dark:text-white">
              No matching activity logs found
            </p>
            <p className="mt-1 text-xs text-slate-light">
              {searchQuery ? "Try clearing your search query or switching categories." : "All recent operations will be recorded here automatically."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-hairline dark:divide-white/10">
            {filteredLogs.map((log) => {
              const badge = getActionBadge(log.action);
              const Icon = badge.icon;
              const isExpanded = expandedLogId === log.id;
              const formattedTime = new Date(log.createdAt).toLocaleString("en-CA", {
                dateStyle: "medium",
                timeStyle: "short",
              });

              return (
                <div
                  key={log.id}
                  className="p-4 transition hover:bg-paper/50 dark:hover:bg-white/[0.02]"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Event Type & Quote Number */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`flex items-center gap-1 rounded-xs border px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${badge.className}`}
                      >
                        <Icon className="h-3 w-3" />
                        <span>{badge.label}</span>
                      </span>

                      {log.quoteNumber && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onSelectQuote?.(log.quoteNumber!)}
                            className="rounded-xs border border-gold/40 bg-gold/10 px-2 py-0.5 font-mono text-xs font-bold text-gold transition hover:bg-gold/20"
                            title="Filter or view this quote"
                          >
                            #{log.quoteNumber}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopy(log.quoteNumber!, `quote-${log.id}`)}
                            className="text-slate hover:text-gold dark:text-gray-400"
                            title="Copy Quote Number"
                          >
                            {copiedId === `quote-${log.id}` ? (
                              <Check className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      )}

                      <span className="flex items-center gap-1 rounded-xs bg-paper px-2 py-0.5 font-mono text-[10px] text-slate dark:bg-white/5 dark:text-gray-300">
                        <User className="h-2.5 w-2.5" />
                        <span>{log.actor}</span>
                      </span>
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-2 font-mono text-[11px] text-slate-light">
                      <Clock className="h-3 w-3" />
                      <span>{formattedTime}</span>
                    </div>
                  </div>

                  {/* Title & Details */}
                  <div className="mt-2.5">
                    <h3 className="font-semibold text-xs sm:text-sm text-navy-deep dark:text-white">
                      {log.title}
                    </h3>
                    {log.details && (
                      <p className="mt-1 text-xs text-slate dark:text-gray-300 line-clamp-2">
                        {log.details}
                      </p>
                    )}
                  </div>

                  {/* Associated Customer Profile Snapshot (if available) */}
                  {log.quoteRequest && (
                    <div className="mt-2.5 flex flex-wrap items-center gap-3 font-mono text-[11px] text-slate-light">
                      <span>Customer: <strong className="text-navy-deep dark:text-white">{log.quoteRequest.name}</strong></span>
                      <span>&bull;</span>
                      <span>Phone: {log.quoteRequest.phone}</span>
                      <span>&bull;</span>
                      <span>Route: {log.quoteRequest.pickupAddress.split(",")[0]} → {log.quoteRequest.dropoffAddress.split(",")[0]}</span>
                    </div>
                  )}

                  {/* Metadata Inspector Accordion */}
                  {log.metadata && (
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        className="flex items-center gap-1 font-mono text-[10px] font-semibold text-gold hover:underline"
                      >
                        <span>{isExpanded ? "Hide Technical Audit Metadata" : "View Technical Audit Metadata"}</span>
                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>

                      {isExpanded && (
                        <pre className="mt-2 overflow-x-auto rounded-xs border border-hairline bg-paper p-3 font-mono text-[10px] text-navy-deep dark:border-white/10 dark:bg-[#0c1626] dark:text-gray-300">
                          {typeof log.metadata === "string" ? log.metadata : JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
