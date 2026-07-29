import { cn } from "@/lib/cn";

export type Tone = "success" | "warning" | "danger" | "info" | "neutral" | "accent";

const dotColor: Record<Tone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  accent: "bg-accent",
  neutral: "bg-neutral",
};

const softText: Record<Tone, string> = {
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
  accent: "bg-accent-soft text-accent",
  neutral: "bg-neutral-soft text-muted-foreground",
};

/** Map any domain status string to a tone + display label. */
export function statusMeta(status: string): { tone: Tone; label: string } {
  const s = status.toLowerCase();
  const map: Record<string, Tone> = {
    passed: "success",
    pass: "success",
    online: "success",
    current: "success",
    approved: "success",
    healthy: "success",
    complete: "success",
    completed: "success",
    running: "info",
    "in-progress": "info",
    provisioning: "info",
    queued: "neutral",
    pending: "warning",
    review: "warning",
    "changes-requested": "warning",
    maintenance: "warning",
    "update-available": "warning",
    outdated: "warning",
    warning: "warning",
    degraded: "warning",
    failed: "danger",
    fail: "danger",
    offline: "danger",
    error: "danger",
    critical: "danger",
    retired: "neutral",
    draft: "neutral",
    archived: "neutral",
  };
  const tone = map[s] ?? "neutral";
  const label = status
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return { tone, label };
}

export function StatusDot({
  tone,
  pulse,
  className,
}: {
  tone: Tone;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-flex size-2 shrink-0", className)}>
      {pulse && (
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
            dotColor[tone],
          )}
        />
      )}
      <span className={cn("relative inline-flex size-2 rounded-full", dotColor[tone])} />
    </span>
  );
}

export function StatusBadge({
  status,
  pulse,
  className,
}: {
  status: string;
  pulse?: boolean;
  className?: string;
}) {
  const { tone, label } = statusMeta(status);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        softText[tone],
        className,
      )}
    >
      <StatusDot tone={tone} pulse={pulse ?? (tone === "info" || label === "Online")} />
      {label}
    </span>
  );
}
