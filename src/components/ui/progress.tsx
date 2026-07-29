import { cn } from "@/lib/cn";
import type { Tone } from "@/components/ui/status";

const fill: Record<Tone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  accent: "bg-accent",
  neutral: "bg-neutral",
};

export function Progress({
  value,
  tone = "accent",
  className,
  trackClassName,
}: {
  value: number;
  tone?: Tone;
  className?: string;
  trackClassName?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-neutral-soft", trackClassName)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-500", fill[tone], className)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
