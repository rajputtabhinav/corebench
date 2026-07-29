import { ArrowRight, CircuitBoard, Cpu, HardDrive, Network, Server as ServerIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { StatusBadge } from "@/components/ui/status";
import type { FirmwareComponent, FirmwareEntry } from "@/lib/data";
import { formatDate } from "@/lib/format";

const componentIcon: Record<FirmwareComponent, LucideIcon> = {
  BIOS: Cpu,
  BMC: ServerIcon,
  CPLD: CircuitBoard,
  NIC: Network,
  SSD: HardDrive,
};

export function FirmwareTimeline({
  entries,
  showServer,
  serverNameOf,
}: {
  entries: FirmwareEntry[];
  showServer?: boolean;
  serverNameOf?: (serverId: string) => string | undefined;
}) {
  return (
    <ol className="relative space-y-1 before:absolute before:bottom-4 before:left-[19px] before:top-4 before:w-px before:bg-border">
      {entries.map((e) => {
        const Icon = componentIcon[e.component];
        return (
          <li key={e.id} className="relative flex gap-3.5 py-2">
            <span className="z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground ring-4 ring-surface">
              <Icon className="size-[18px]" />
            </span>
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span className="rounded-md bg-neutral-soft px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                  {e.component}
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[13px] font-medium text-foreground">
                  {e.previousVersion && (
                    <>
                      <span className="text-subtle-foreground line-through">{e.previousVersion}</span>
                      <ArrowRight className="size-3 text-subtle-foreground" />
                    </>
                  )}
                  {e.version}
                </span>
                <StatusBadge status={e.status} />
              </div>
              {e.impact && <p className="mt-1 text-[12.5px] text-muted-foreground">{e.impact}</p>}
              <p className="mt-0.5 text-[11.5px] text-subtle-foreground">
                {formatDate(e.date)} · {e.updatedBy}
                {showServer && serverNameOf?.(e.serverId) ? ` · ${serverNameOf(e.serverId)}` : ""}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
