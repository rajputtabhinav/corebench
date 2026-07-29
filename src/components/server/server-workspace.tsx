"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CircuitBoard,
  Clock,
  FileText,
  MapPin,
  Network,
  ScrollText,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, statusMeta } from "@/components/ui/status";
import { Progress } from "@/components/ui/progress";
import { Segmented } from "@/components/ui/segmented";
import { UnderlineTabs } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { Dialog, DialogClose, DialogTitle, SheetContent } from "@/components/ui/dialog";
import { Reveal } from "@/components/motion";
import { ValidationRow } from "@/components/domain/validation-row";
import { ChartCard } from "@/components/domain/chart";
import { LogViewer } from "@/components/domain/log-viewer";
import { BiosConfigView } from "@/components/domain/bios-config";
import { FirmwareTimeline } from "@/components/domain/firmware-timeline";
import { ActivityFeed } from "@/components/domain/activity-feed";
import { useRightPanel, PanelKV, PanelSection, PanelStat } from "@/components/shell/right-panel";
import { formatBytes, formatDate, relativeTime } from "@/lib/format";
import type {
  Activity,
  BiosConfig,
  FirmwareEntry,
  LogFile,
  Server,
  Validation,
} from "@/lib/data";

function healthTone(score: number) {
  if (score >= 90) return "success" as const;
  if (score >= 75) return "warning" as const;
  if (score === 0) return "neutral" as const;
  return "danger" as const;
}

const FULL_WIDTH_SPECS = new Set(["CPU", "Memory", "Storage", "NIC"]);

export function ServerWorkspace({
  server,
  validations,
  bios,
  firmware,
  logs,
  activity,
}: {
  server: Server;
  validations: Validation[];
  bios: BiosConfig[];
  firmware: FirmwareEntry[];
  logs: LogFile[];
  activity: Activity[];
}) {
  const [tab, setTab] = useState("overview");
  const [logId, setLogId] = useState<string | null>(null);
  const [biosId, setBiosId] = useState(bios[0]?.id ?? "");

  const charts = useMemo(() => validations.flatMap((v) => v.charts.map((c) => ({ c, v }))), [validations]);
  const selectedLog = logs.find((l) => l.id === logId);
  const selectedBios = bios.find((b) => b.id === biosId) ?? bios[0];
  const latestValidation = validations[0];

  useRightPanel(
    <ServerPanel server={server} validations={validations} firmware={firmware} />,
    [server.id, validations.length],
  );

  const specs: [string, string][] = [
    ["Vendor", server.vendor],
    ["Model", server.model],
    ["Asset Tag", server.assetTag],
    ["Serial Number", server.serialNumber],
    ["CPU", server.cpu],
    ["Memory", server.memory],
    ["Storage", server.storage],
    ["NIC", server.nic],
    ["BIOS Version", server.biosVersion],
    ["BMC Version", server.bmcVersion],
    ["Location", server.location],
    ["IP Address", server.ip],
    ["Owner", server.owner],
    ["Purchase Date", formatDate(server.purchaseDate)],
    ["Warranty", `${server.warranty} · until ${formatDate(server.warrantyUntil)}`],
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-7 sm:px-8">
      {/* Hero header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-mono text-[22px] font-semibold tracking-tight text-foreground">{server.name}</h1>
            <StatusBadge status={server.status} />
          </div>
          <p className="mt-1 text-[14px] text-muted-foreground">
            {server.vendor} · {server.model}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Network className="size-3.5 text-subtle-foreground" />
              <span className="font-mono">{server.ip}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5 text-subtle-foreground" />
              {server.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <UserRound className="size-3.5 text-subtle-foreground" />
              {server.owner}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="default" size="sm" asChild>
            <Link href="/reports">
              <FileText className="size-4" /> Reports
            </Link>
          </Button>
          <Button variant="accent" size="sm" asChild>
            <Link href="/validations">
              <ShieldCheck className="size-4" /> Run validation
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <UnderlineTabs
          value={tab}
          onValueChange={setTab}
          tabs={[
            { value: "overview", label: "Overview" },
            { value: "validations", label: "Validations", count: validations.length },
            { value: "benchmarks", label: "Benchmarks", count: charts.length },
            { value: "logs", label: "Logs", count: logs.length },
            { value: "bios", label: "BIOS", count: bios.length },
            { value: "firmware", label: "Firmware", count: firmware.length },
            { value: "history", label: "History" },
          ]}
        />
      </div>

      <div className="mt-6">
        {tab === "overview" && (
          <Reveal className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>System information</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                    {specs.map(([k, v]) => (
                      <div key={k} className={cn(FULL_WIDTH_SPECS.has(k) && "sm:col-span-2")}>
                        <dt className="text-[11px] font-medium uppercase tracking-wide text-subtle-foreground">{k}</dt>
                        <dd className={cn("mt-0.5 text-[13.5px] text-foreground", FULL_WIDTH_SPECS.has(k) && "font-mono text-[13px]")}>
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-5">
              {server.status !== "retired" && (
                <Card>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-medium text-foreground">Health score</span>
                      <span className="tabular text-[15px] font-semibold text-foreground">{server.healthScore}%</span>
                    </div>
                    <Progress value={server.healthScore} tone={healthTone(server.healthScore)} />
                    <p className="text-[12px] text-muted-foreground">
                      Updated {relativeTime(server.updatedAt)}
                    </p>
                  </CardContent>
                </Card>
              )}
              <Card>
                <CardHeader>
                  <CardTitle>Recent validations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-0.5 px-2.5 pb-2.5 pt-1">
                  {validations.slice(0, 4).map((v) => (
                    <ValidationRow key={v.id} validation={v} showServer={false} />
                  ))}
                  {validations.length === 0 && (
                    <p className="px-2.5 py-6 text-center text-[13px] text-muted-foreground">No validations yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </Reveal>
        )}

        {tab === "validations" && (
          <Reveal>
            {validations.length ? (
              <Card>
                <CardContent className="space-y-0.5 p-2.5">
                  {validations.map((v) => (
                    <ValidationRow key={v.id} validation={v} showServer={false} />
                  ))}
                </CardContent>
              </Card>
            ) : (
              <EmptyState icon={ShieldCheck} title="No validations" description="This server has no validation runs yet." />
            )}
          </Reveal>
        )}

        {tab === "benchmarks" && (
          <Reveal>
            {charts.length ? (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {charts.map(({ c, v }) => (
                  <ChartCard key={`${v.id}-${c.id}`} spec={c} />
                ))}
              </div>
            ) : (
              <EmptyState icon={CircuitBoard} title="No benchmark charts" description="Charts appear here once validations with measurements are recorded." />
            )}
          </Reveal>
        )}

        {tab === "logs" && (
          <Reveal>
            {logs.length ? (
              <Card>
                <CardContent className="space-y-1 p-2.5">
                  {logs.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setLogId(l.id)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-surface-2"
                    >
                      <span className={cn("flex size-9 items-center justify-center rounded-[10px]", l.level === "error" ? "bg-danger-soft text-danger" : l.level === "warning" ? "bg-warning-soft text-warning" : "bg-neutral-soft text-muted-foreground")}>
                        <ScrollText className="size-[18px]" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-mono text-[13px] text-foreground">{l.name}</p>
                        <p className="truncate text-[11.5px] text-muted-foreground">
                          {l.source} · {l.lines} lines · {formatBytes(l.size)}
                        </p>
                      </div>
                      <span className="text-[11px] text-subtle-foreground">{relativeTime(l.createdAt)}</span>
                    </button>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <EmptyState icon={ScrollText} title="No logs" description="Captured logs from validation runs will appear here." />
            )}
          </Reveal>
        )}

        {tab === "bios" && (
          <Reveal>
            {selectedBios ? (
              <div className="space-y-4">
                {bios.length > 1 && (
                  <Segmented
                    options={bios.map((b) => ({ value: b.id, label: `v${b.version}` }))}
                    value={biosId || bios[0].id}
                    onChange={setBiosId}
                  />
                )}
                <div className="mb-1 flex items-baseline gap-2">
                  <h3 className="text-[15px] font-semibold text-foreground">BIOS {selectedBios.version}</h3>
                  <span className="text-[13px] text-muted-foreground">{selectedBios.profile}</span>
                </div>
                <BiosConfigView config={selectedBios} />
              </div>
            ) : (
              <EmptyState icon={CircuitBoard} title="No BIOS captures" description="Capture a BIOS configuration to track its settings here." />
            )}
          </Reveal>
        )}

        {tab === "firmware" && (
          <Reveal>
            {firmware.length ? (
              <Card>
                <CardContent>
                  <FirmwareTimeline entries={firmware} />
                </CardContent>
              </Card>
            ) : (
              <EmptyState icon={CircuitBoard} title="No firmware history" description="Firmware changes are tracked here over time." />
            )}
          </Reveal>
        )}

        {tab === "history" && (
          <Reveal>
            {activity.length ? (
              <Card>
                <CardContent>
                  <ActivityFeed items={activity} connected showServer={false} />
                </CardContent>
              </Card>
            ) : (
              <EmptyState icon={Clock} title="No history" description="Activity for this server will appear here." />
            )}
          </Reveal>
        )}
      </div>

      {/* Log viewer sheet */}
      <Dialog open={!!logId} onOpenChange={(o) => !o && setLogId(null)}>
        {selectedLog && (
          <SheetContent width="max-w-3xl" className="p-0" aria-describedby={undefined}>
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <DialogTitle className="font-mono text-[14px] font-semibold text-foreground">
                {selectedLog.name}
              </DialogTitle>
              <DialogClose className="rounded-lg px-2 py-1 text-[13px] text-muted-foreground hover:bg-neutral-soft hover:text-foreground">
                Close
              </DialogClose>
            </div>
            <div className="min-h-0 flex-1 p-4">
              <LogViewer
                name={selectedLog.name}
                content={selectedLog.content}
                meta={`${selectedLog.source} · ${selectedLog.lines} lines`}
                className="h-full"
              />
            </div>
          </SheetContent>
        )}
      </Dialog>
    </div>
  );
}

function ServerPanel({
  server,
  validations,
  firmware,
}: {
  server: Server;
  validations: Validation[];
  firmware: FirmwareEntry[];
}) {
  const latest = validations[0];
  return (
    <div>
      <PanelSection title="Server">
        <div className="grid grid-cols-2 gap-2.5">
          <PanelStat
            label="Health"
            value={server.status === "retired" ? "—" : `${server.healthScore}%`}
            tone={healthTone(server.healthScore)}
          />
          <PanelStat label="Validations" value={validations.length} tone="accent" />
        </div>
      </PanelSection>

      {latest && (
        <PanelSection title="Latest validation">
          <Link
            href={`/validations/${latest.id}`}
            className="block rounded-xl border border-border bg-surface-2 p-3 transition-colors hover:border-border-strong"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-[13px] font-medium text-foreground">{latest.title}</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <StatusBadge status={latest.status} />
              <span className="text-[11px] text-subtle-foreground">{relativeTime(latest.date)}</span>
            </div>
          </Link>
        </PanelSection>
      )}

      <PanelSection title="Specs">
        <div className="divide-y divide-border">
          <PanelKV label="CPU" value={`${server.cores} cores`} />
          <PanelKV label="Memory" value={server.memoryGb >= 1024 ? `${server.memoryGb / 1024} TB` : `${server.memoryGb} GB`} />
          <PanelKV label="BIOS" value={server.biosVersion} />
          <PanelKV label="BMC" value={server.bmcVersion} />
          <PanelKV label="Owner" value={server.owner} />
          <PanelKV label="Warranty" value={server.warranty} />
        </div>
      </PanelSection>

      {firmware.length > 0 && (
        <PanelSection title="Firmware">
          <div className="space-y-2">
            {firmware.slice(0, 4).map((f) => (
              <div key={f.id} className="flex items-center justify-between gap-2 text-[12.5px]">
                <span className="text-muted-foreground">{f.component}</span>
                <span className="flex items-center gap-1.5">
                  <span className="font-mono text-foreground">{f.version}</span>
                  <span className={cn("size-1.5 rounded-full", statusMeta(f.status).tone === "success" ? "bg-success" : statusMeta(f.status).tone === "warning" ? "bg-warning" : "bg-neutral")} />
                </span>
              </div>
            ))}
          </div>
        </PanelSection>
      )}
    </div>
  );
}
