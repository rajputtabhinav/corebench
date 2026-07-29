import Link from "next/link";
import {
  CheckCircle2,
  CircuitBoard,
  Cpu,
  FileCheck2,
  Gauge,
  MessageSquare,
  Paperclip,
  ServerIcon,
  ShieldCheck,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { Activity, ActivityKind } from "@/lib/data";
import { relativeTime } from "@/lib/format";
import type { Tone } from "@/components/ui/status";

const kindMeta: Record<ActivityKind, { icon: LucideIcon; tone: Tone; verb: string }> = {
  "server.created": { icon: ServerIcon, tone: "accent", verb: "registered" },
  "validation.added": { icon: ShieldCheck, tone: "accent", verb: "started" },
  "validation.passed": { icon: CheckCircle2, tone: "success", verb: "passed" },
  "validation.failed": { icon: XCircle, tone: "danger", verb: "logged a failure on" },
  "firmware.updated": { icon: CircuitBoard, tone: "info", verb: "updated firmware" },
  "bios.updated": { icon: Cpu, tone: "info", verb: "updated BIOS" },
  "benchmark.completed": { icon: Gauge, tone: "accent", verb: "completed" },
  "comment.added": { icon: MessageSquare, tone: "neutral", verb: "commented on" },
  "file.uploaded": { icon: Paperclip, tone: "neutral", verb: "uploaded" },
  "report.approved": { icon: FileCheck2, tone: "success", verb: "approved" },
};

const toneText: Record<Tone, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
  accent: "text-accent",
  neutral: "text-muted-foreground",
};
const toneBg: Record<Tone, string> = {
  success: "bg-success-soft",
  warning: "bg-warning-soft",
  danger: "bg-danger-soft",
  info: "bg-info-soft",
  accent: "bg-accent-soft",
  neutral: "bg-neutral-soft",
};

function hrefFor(a: Activity): string | undefined {
  if (a.kind.startsWith("validation") || a.kind === "comment.added" || a.kind === "benchmark.completed")
    return a.targetId ? `/validations/${a.targetId}` : undefined;
  if (a.kind === "report.approved") return "/reports";
  if (a.kind === "firmware.updated") return "/firmware";
  if (a.kind === "bios.updated") return "/bios";
  if (a.kind === "file.uploaded") return "/logs";
  if (a.kind === "server.created" && a.serverId) return `/servers/${a.serverId}`;
  return undefined;
}

export function ActivityFeed({
  items,
  connected = false,
  showServer = true,
}: {
  items: Activity[];
  connected?: boolean;
  showServer?: boolean;
}) {
  return (
    <ul className={cn("relative", connected && "before:absolute before:bottom-3 before:left-[18px] before:top-3 before:w-px before:bg-border")}>
      {items.map((a) => {
        const meta = kindMeta[a.kind];
        const Icon = meta.icon;
        const href = hrefFor(a);
        const target = href ? (
          <Link href={href} className="font-medium text-foreground underline-offset-2 hover:underline">
            {a.target}
          </Link>
        ) : (
          <span className="font-medium text-foreground">{a.target}</span>
        );

        return (
          <li key={a.id} className="relative flex gap-3 py-2.5">
            <span
              className={cn(
                "z-10 flex size-9 shrink-0 items-center justify-center rounded-full ring-4 ring-surface",
                toneBg[meta.tone],
                toneText[meta.tone],
              )}
            >
              <Icon className="size-[16px]" />
            </span>
            <div className="min-w-0 flex-1 pt-1">
              <p className="text-[13px] leading-snug text-muted-foreground">
                <span className="font-medium text-foreground">{a.actor.split(" ")[0]}</span>{" "}
                {meta.verb} {target}
                {showServer && a.serverName && (
                  <>
                    {" "}
                    on{" "}
                    <Link
                      href={`/servers/${a.serverId}`}
                      className="font-mono text-[12px] text-muted-foreground hover:text-foreground"
                    >
                      {a.serverName}
                    </Link>
                  </>
                )}
              </p>
              {a.meta && (
                <p className="mt-0.5 truncate text-[12px] italic text-subtle-foreground">“{a.meta}”</p>
              )}
              <p className="mt-0.5 text-[11px] text-subtle-foreground">{relativeTime(a.at)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
