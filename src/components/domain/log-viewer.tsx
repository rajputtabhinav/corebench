"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Download, ListFilter, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { Input } from "@/components/ui/input";

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

type LineTone = "default" | "error" | "warn" | "muted";

function classify(line: string): LineTone {
  if (/\b(error|fail|failed|fatal|critical|panic|down|downgraded|stall)\b/i.test(line)) return "error";
  if (/\b(warn|warning|deasserted|exceeds|throttle|retr|discard)\b/i.test(line)) return "warn";
  if (/^\s*[#$]/.test(line) || /^[-=]{3,}/.test(line)) return "muted";
  return "default";
}

const toneClass: Record<LineTone, string> = {
  default: "text-foreground/85",
  error: "text-danger",
  warn: "text-warning",
  muted: "text-subtle-foreground",
};

function Highlighted({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, "gi"));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="rounded bg-warning/35 text-foreground">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function LogViewer({
  name,
  content,
  meta,
  className,
}: {
  name: string;
  content: string;
  meta?: string;
  className?: string;
}) {
  const [query, setQuery] = useState("");
  const [onlyMatches, setOnlyMatches] = useState(false);
  const [copied, setCopied] = useState(false);

  const allLines = useMemo(() => content.split("\n"), [content]);
  const matchCount = useMemo(() => {
    if (!query) return 0;
    return allLines.filter((l) => l.toLowerCase().includes(query.toLowerCase())).length;
  }, [allLines, query]);

  const rows = useMemo(
    () =>
      allLines
        .map((line, i) => ({ line, n: i + 1 }))
        .filter((r) => (onlyMatches && query ? r.line.toLowerCase().includes(query.toLowerCase()) : true)),
    [allLines, onlyMatches, query],
  );

  function copy() {
    navigator.clipboard?.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  function download() {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={cn("flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-[#0c0e12]", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 bg-white/[0.03] px-3 py-2">
        <div className="mr-auto flex min-w-0 items-center gap-2">
          <span className="truncate font-mono text-[12.5px] font-medium text-white/90">{name}</span>
          {meta && <span className="shrink-0 text-[11px] text-white/40">{meta}</span>}
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-white/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="h-8 w-40 rounded-lg border border-white/10 bg-white/5 pl-8 pr-2 text-[12.5px] text-white/90 outline-none placeholder:text-white/35 focus:border-white/25"
          />
        </div>
        {query && (
          <span className="text-[11px] tabular text-white/50">{matchCount} match{matchCount === 1 ? "" : "es"}</span>
        )}
        <button
          onClick={() => setOnlyMatches((v) => !v)}
          title="Show only matching lines"
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-lg border text-white/70 transition-colors",
            onlyMatches ? "border-accent/60 bg-accent/20 text-white" : "border-white/10 hover:bg-white/10",
          )}
        >
          <ListFilter className="size-4" />
        </button>
        <button
          onClick={copy}
          title="Copy"
          className="inline-flex size-8 items-center justify-center rounded-lg border border-white/10 text-white/70 transition-colors hover:bg-white/10"
        >
          {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
        </button>
        <button
          onClick={download}
          title="Download"
          className="inline-flex size-8 items-center justify-center rounded-lg border border-white/10 text-white/70 transition-colors hover:bg-white/10"
        >
          <Download className="size-4" />
        </button>
      </div>

      {/* Body */}
      <div className="min-h-0 flex-1 overflow-auto py-2 font-mono text-[12.5px] leading-[1.7]">
        {rows.length === 0 ? (
          <p className="px-4 py-8 text-center text-white/40">No lines match “{query}”.</p>
        ) : (
          rows.map(({ line, n }) => {
            const tone = classify(line);
            return (
              <div key={n} className="flex hover:bg-white/[0.04]">
                <span className="w-12 shrink-0 select-none px-2 text-right text-white/25">{n}</span>
                <pre className={cn("flex-1 whitespace-pre-wrap break-words px-3", toneClass[tone])}>
                  <Highlighted text={line || " "} query={query} />
                </pre>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
