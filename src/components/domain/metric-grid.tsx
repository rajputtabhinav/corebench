import { ArrowDownRight, ArrowUpRight, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/cn";
import type { MetricResult } from "@/lib/data";

const stateStyle: Record<string, string> = {
  pass: "border-border",
  warn: "border-warning/40 bg-warning-soft/30",
  fail: "border-danger/40 bg-danger-soft/30",
};

function MetricTile({ metric }: { metric: MetricResult }) {
  const { label, value, unit, delta, state, hint } = metric;
  return (
    <div className={cn("rounded-xl border bg-surface-2 p-3.5", stateStyle[state ?? "pass"])}>
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[11.5px] font-medium text-muted-foreground">{label}</p>
        {(state === "warn" || state === "fail") && (
          <TriangleAlert className={cn("size-3.5 shrink-0", state === "fail" ? "text-danger" : "text-warning")} />
        )}
      </div>
      <p className="mt-1.5 flex items-baseline gap-1 text-[19px] font-semibold tabular tracking-tight text-foreground">
        {value}
        {unit && <span className="text-[12px] font-normal text-muted-foreground">{unit}</span>}
      </p>
      {typeof delta === "number" ? (
        <p
          className={cn(
            "mt-0.5 inline-flex items-center gap-0.5 text-[11.5px] font-medium",
            delta >= 0 ? "text-success" : "text-danger",
          )}
        >
          {delta >= 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
          {Math.abs(delta)}% vs baseline
        </p>
      ) : hint ? (
        <p className="mt-0.5 truncate text-[11.5px] text-subtle-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function MetricGrid({ metrics, className }: { metrics: MetricResult[]; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4", className)}>
      {metrics.map((m, i) => (
        <MetricTile key={i} metric={m} />
      ))}
    </div>
  );
}
