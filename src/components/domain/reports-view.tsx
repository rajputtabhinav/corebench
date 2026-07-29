"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Segmented } from "@/components/ui/segmented";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status";
import { EmptyState } from "@/components/ui/empty-state";
import { Dialog, DialogClose, DialogTitle, SheetContent } from "@/components/ui/dialog";
import { FileIcon } from "@/components/domain/file-icon";
import { DocumentPreview } from "@/components/domain/document-preview";
import { getServer, type Report } from "@/lib/data";
import { formatBytes, relativeTime } from "@/lib/format";

export function ReportsView({ reports }: { reports: Report[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const open = reports.find((r) => r.id === openId);

  const filtered = useMemo(
    () =>
      reports.filter((r) => {
        if (status !== "all" && r.status !== status) return false;
        if (query) {
          const hay = `${r.title} ${r.type} ${r.author}`.toLowerCase();
          if (!hay.includes(query.toLowerCase())) return false;
        }
        return true;
      }),
    [reports, status, query],
  );

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search reports…" className="pl-9" />
        </div>
        <Segmented
          options={[
            { value: "all", label: "All" },
            { value: "approved", label: "Approved" },
            { value: "review", label: "Review" },
            { value: "draft", label: "Draft" },
          ]}
          value={status}
          onChange={setStatus}
        />
      </div>

      {filtered.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => {
            const server = getServer(r.serverId);
            return (
              <button key={r.id} onClick={() => setOpenId(r.id)} className="text-left outline-none">
                <Card interactive className="flex h-full flex-col p-4">
                  <div className="flex items-start gap-3">
                    <FileIcon kind="pdf" size="lg" />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-[13.5px] font-semibold text-foreground">{r.title}</p>
                      <p className="mt-0.5 text-[11.5px] text-muted-foreground">{r.type}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <StatusBadge status={r.status} />
                    <span className="text-[11px] text-subtle-foreground">{r.pages} pages · {formatBytes(r.size)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5 text-[11.5px] text-muted-foreground">
                    <span className="truncate font-mono">{server?.name}</span>
                    <span className="shrink-0">{relativeTime(r.updatedAt)}</span>
                  </div>
                </Card>
              </button>
            );
          })}
        </div>
      ) : (
        <EmptyState icon={FileText} title="No reports match" description="Try a different search or status filter." />
      )}

      <Dialog open={!!openId} onOpenChange={(o) => !o && setOpenId(null)}>
        {open && (
          <SheetContent width="max-w-4xl" className="p-0" aria-describedby={undefined}>
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
              <DialogTitle className="flex min-w-0 items-center gap-2.5 text-[14px] font-semibold text-foreground">
                <FileIcon kind="pdf" size="sm" />
                <span className="truncate">{open.title}</span>
              </DialogTitle>
              <div className="flex shrink-0 items-center gap-3">
                {open.validationId && (
                  <Link
                    href={`/validations/${open.validationId}`}
                    className="hidden text-[12.5px] font-medium text-accent hover:underline sm:inline"
                    onClick={() => setOpenId(null)}
                  >
                    Validation →
                  </Link>
                )}
                {open.file && (
                  <a
                    href={open.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[12.5px] font-medium text-accent hover:underline"
                  >
                    Open <ExternalLink className="size-3.5" />
                  </a>
                )}
                <DialogClose className="rounded-lg px-2 py-1 text-[13px] text-muted-foreground hover:bg-neutral-soft hover:text-foreground">
                  Close
                </DialogClose>
              </div>
            </div>
            <div className="min-h-0 flex-1 bg-neutral-soft p-3">
              {open.file ? (
                <iframe
                  src={`${open.file}#toolbar=1&view=FitH`}
                  title={open.title}
                  className="h-full w-full rounded-xl border border-border bg-white"
                />
              ) : (
                <DocumentPreview name={open.title} kind="pdf" size={open.size} sub={`${open.author} · ${open.pages} pages`} />
              )}
            </div>
          </SheetContent>
        )}
      </Dialog>
    </div>
  );
}
