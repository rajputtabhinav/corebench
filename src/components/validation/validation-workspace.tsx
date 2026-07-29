"use client";

import { useState } from "react";
import Link from "next/link";
import { CircleDot, Clock, TriangleAlert, UserRound } from "lucide-react";
import { cn } from "@/lib/cn";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status";
import { Dialog, DialogClose, DialogTitle, SheetContent } from "@/components/ui/dialog";
import { SectionHeading } from "@/components/shell/page";
import { Reveal } from "@/components/motion";
import { TypeIcon } from "@/components/domain/type-badge";
import { MetricGrid } from "@/components/domain/metric-grid";
import { ChartCard } from "@/components/domain/chart";
import { LogViewer } from "@/components/domain/log-viewer";
import { Comments } from "@/components/domain/comments";
import { FileIcon, fileKindLabel } from "@/components/domain/file-icon";
import { DocumentPreview } from "@/components/domain/document-preview";
import { useRightPanel, PanelKV, PanelSection, PanelStat } from "@/components/shell/right-panel";
import { getCurrentUser, type Server, type Validation } from "@/lib/data";
import { formatBytes, formatDate, formatDuration, relativeTime } from "@/lib/format";

const TEXT_KINDS = new Set(["log", "txt", "csv"]);

export function ValidationWorkspace({
  validation,
  server,
}: {
  validation: Validation;
  server?: Server;
}) {
  const [previewId, setPreviewId] = useState<string | null>(null);
  const preview = validation.attachments.find((a) => a.id === previewId);

  useRightPanel(<ValidationPanel validation={validation} server={server} />, [validation.id]);

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-7 sm:px-8">
      {/* Hero */}
      <div className="flex items-start gap-4">
        <TypeIcon type={validation.type} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">{validation.title}</h1>
            <StatusBadge status={validation.status} pulse={validation.status === "running"} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-muted-foreground">
            {server && (
              <Link href={`/servers/${server.id}`} className="inline-flex items-center gap-1.5 font-mono hover:text-foreground">
                <CircleDot className="size-3.5 text-subtle-foreground" />
                {server.name}
              </Link>
            )}
            <span className="inline-flex items-center gap-1.5">
              <UserRound className="size-3.5 text-subtle-foreground" />
              {validation.engineer}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5 text-subtle-foreground" />
              {formatDate(validation.date)}
            </span>
            {validation.durationSec > 0 && (
              <span className="text-subtle-foreground">{formatDuration(validation.durationSec)} run</span>
            )}
            {validation.errors > 0 && (
              <span className="inline-flex items-center gap-1.5 text-danger">
                <TriangleAlert className="size-3.5" />
                {validation.errors} errors
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="mt-5 max-w-3xl text-[14px] leading-relaxed text-muted-foreground">{validation.summary}</p>

      {/* Results */}
      {validation.metrics.length > 0 && (
        <Reveal className="mt-8">
          <SectionHeading title="Results" />
          <MetricGrid metrics={validation.metrics} />
        </Reveal>
      )}

      {/* Charts */}
      {validation.charts.length > 0 && (
        <Reveal className="mt-8">
          <SectionHeading title="Benchmark charts" />
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {validation.charts.map((c) => (
              <ChartCard key={c.id} spec={c} />
            ))}
          </div>
        </Reveal>
      )}

      {/* Notes */}
      {validation.notes && (
        <div className="mt-8">
          <SectionHeading title="Engineer notes" />
          <div className="rounded-2xl border border-border bg-surface-2 p-4 text-[13.5px] leading-relaxed text-muted-foreground">
            {validation.notes}
          </div>
        </div>
      )}

      {/* Attachments */}
      {validation.attachments.length > 0 && (
        <div className="mt-8">
          <SectionHeading title={`Attachments · ${validation.attachments.length}`} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {validation.attachments.map((a) => (
              <button
                key={a.id}
                onClick={() => setPreviewId(a.id)}
                className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-3 text-left shadow-xs transition-colors hover:border-border-strong hover:bg-surface-2"
              >
                <FileIcon kind={a.kind} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-[12.5px] text-foreground">{a.name}</p>
                  <p className="truncate text-[11.5px] text-muted-foreground">
                    {fileKindLabel(a.kind)} · {formatBytes(a.size)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Discussion */}
      <div className="mt-9">
        <SectionHeading title={`Discussion · ${validation.comments.length}`} />
        <Card>
          <CardContent>
            <Comments comments={validation.comments} author={getCurrentUser().name} />
          </CardContent>
        </Card>
      </div>

      {/* Attachment preview */}
      <Dialog open={!!previewId} onOpenChange={(o) => !o && setPreviewId(null)}>
        {preview && (
          <SheetContent width={preview.kind === "pdf" ? "max-w-4xl" : "max-w-3xl"} className="p-0" aria-describedby={undefined}>
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
              <DialogTitle className="flex min-w-0 items-center gap-2.5 font-mono text-[13px] font-semibold text-foreground">
                <FileIcon kind={preview.kind} size="sm" />
                <span className="truncate">{preview.name}</span>
              </DialogTitle>
              <DialogClose className="rounded-lg px-2 py-1 text-[13px] text-muted-foreground hover:bg-neutral-soft hover:text-foreground">
                Close
              </DialogClose>
            </div>
            <div className="min-h-0 flex-1 p-4">
              {preview.preview && TEXT_KINDS.has(preview.kind) ? (
                <LogViewer
                  name={preview.name}
                  content={preview.preview}
                  meta={`${fileKindLabel(preview.kind)} · ${formatBytes(preview.size)}`}
                  className="h-full"
                />
              ) : preview.kind === "pdf" ? (
                <iframe
                  src={`/docs/${preview.name}#toolbar=1&view=FitH`}
                  title={preview.name}
                  className="h-full w-full rounded-xl border border-border bg-white"
                />
              ) : (
                <DocumentPreview
                  name={preview.name}
                  kind={preview.kind}
                  size={preview.size}
                  sub={preview.uploadedBy}
                />
              )}
            </div>
          </SheetContent>
        )}
      </Dialog>
    </div>
  );
}

function ValidationPanel({ validation, server }: { validation: Validation; server?: Server }) {
  const headline = validation.metrics.find((m) => m.unit);
  return (
    <div>
      <PanelSection title="Validation">
        <div className="grid grid-cols-2 gap-2.5">
          <PanelStat
            label="Errors"
            value={validation.errors}
            tone={validation.errors ? "danger" : "success"}
          />
          <PanelStat
            label="Duration"
            value={validation.durationSec ? formatDuration(validation.durationSec) : "—"}
            tone="accent"
          />
        </div>
        <div className="mt-2.5">
          <StatusBadge status={validation.status} pulse={validation.status === "running"} />
        </div>
      </PanelSection>

      {headline && (
        <PanelSection title="Headline result">
          <div className="rounded-xl border border-border bg-surface-2 p-3.5">
            <p className="text-[11.5px] text-muted-foreground">{headline.label}</p>
            <p className="mt-1 text-2xl font-semibold tabular tracking-tight text-foreground">
              {headline.value}
              <span className="ml-1 text-[13px] font-normal text-muted-foreground">{headline.unit}</span>
            </p>
          </div>
        </PanelSection>
      )}

      <PanelSection title="Details">
        <div className="divide-y divide-border">
          {server && <PanelKV label="Server" value={<Link href={`/servers/${server.id}`} className="font-mono text-accent hover:underline">{server.name}</Link>} />}
          <PanelKV label="Type" value={validation.type} />
          <PanelKV label="Engineer" value={validation.engineer} />
          <PanelKV label="Date" value={relativeTime(validation.date)} />
          <PanelKV label="Charts" value={validation.charts.length} />
          <PanelKV label="Attachments" value={validation.attachments.length} />
        </div>
      </PanelSection>
    </div>
  );
}
