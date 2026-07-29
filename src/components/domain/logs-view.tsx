"use client";

import { useState } from "react";
import { ScrollText } from "lucide-react";
import { cn } from "@/lib/cn";
import { LogViewer } from "@/components/domain/log-viewer";
import { StatusDot } from "@/components/ui/status";
import { getServer, type LogFile, type LogLevel } from "@/lib/data";
import { formatBytes, relativeTime } from "@/lib/format";

const levelTone: Record<LogLevel, "danger" | "warning" | "neutral"> = {
  error: "danger",
  warning: "warning",
  info: "neutral",
};

export function LogsView({ logs, initialLogId }: { logs: LogFile[]; initialLogId?: string }) {
  const [selectedId, setSelectedId] = useState(
    logs.find((l) => l.id === initialLogId)?.id ?? logs[0]?.id ?? "",
  );
  const selected = logs.find((l) => l.id === selectedId) ?? logs[0];

  return (
    <div className="flex flex-col gap-4 lg:h-[calc(100dvh-12.5rem)] lg:flex-row">
      {/* List */}
      <div className="shrink-0 space-y-1.5 lg:w-80 lg:overflow-y-auto lg:pr-1">
        {logs.map((l) => {
          const server = getServer(l.serverId ?? "");
          const active = l.id === selected?.id;
          return (
            <button
              key={l.id}
              onClick={() => setSelectedId(l.id)}
              className={cn(
                "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                active
                  ? "border-accent/40 bg-accent-soft"
                  : "border-border bg-surface hover:border-border-strong hover:bg-surface-2",
              )}
            >
              <span className="mt-1">
                <StatusDot tone={levelTone[l.level]} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-[12.5px] font-medium text-foreground">{l.name}</p>
                <p className="truncate text-[11.5px] text-muted-foreground">
                  {l.source} · {server?.name ?? "—"}
                </p>
                <p className="mt-0.5 text-[11px] text-subtle-foreground">
                  {l.lines} lines · {formatBytes(l.size)} · {relativeTime(l.createdAt)}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Viewer */}
      <div className="min-h-[440px] flex-1 lg:min-h-0">
        {selected ? (
          <LogViewer
            name={selected.name}
            content={selected.content}
            meta={`${selected.source} · ${selected.lines} lines`}
            className="h-full"
          />
        ) : (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-border-strong text-sm text-muted-foreground">
            <ScrollText className="mr-2 size-4" /> No logs available
          </div>
        )}
      </div>
    </div>
  );
}
