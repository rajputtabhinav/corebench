import Link from "next/link";
import { Cpu, HardDrive, MemoryStick } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status";
import { Progress } from "@/components/ui/progress";
import { getValidationsForServer, type Server } from "@/lib/data";
import { relativeTime } from "@/lib/format";

function healthTone(score: number) {
  if (score >= 90) return "success" as const;
  if (score >= 75) return "warning" as const;
  if (score === 0) return "neutral" as const;
  return "danger" as const;
}

export function ServerCard({ server }: { server: Server }) {
  const validationCount = getValidationsForServer(server.id).length;
  const retired = server.status === "retired";

  return (
    <Link href={`/servers/${server.id}`} className="block outline-none">
      <Card interactive className="h-full p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-mono text-[14px] font-semibold tracking-tight text-foreground">
              {server.name}
            </p>
            <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
              {server.vendor} · {server.model}
            </p>
          </div>
          <StatusBadge status={server.status} />
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Cpu className="size-3.5 text-subtle-foreground" />
            {server.cores} cores
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MemoryStick className="size-3.5 text-subtle-foreground" />
            {server.memoryGb >= 1024 ? `${server.memoryGb / 1024} TB` : `${server.memoryGb} GB`}
          </span>
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <HardDrive className="size-3.5 shrink-0 text-subtle-foreground" />
            <span className="truncate">{server.nic.split("·")[0].trim()}</span>
          </span>
        </div>

        <div className="mt-4 border-t border-border pt-3">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{retired ? "Decommissioned" : "Health"}</span>
            {!retired && <span className="tabular font-medium text-foreground">{server.healthScore}%</span>}
          </div>
          {!retired && (
            <Progress value={server.healthScore} tone={healthTone(server.healthScore)} className="mt-1.5" />
          )}
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-subtle-foreground">
            <span>{validationCount} validations</span>
            <span>Updated {relativeTime(server.updatedAt)}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
