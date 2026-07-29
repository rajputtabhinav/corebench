import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong bg-surface-2/50 px-6 py-14 text-center",
        className,
      )}
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl border border-border bg-surface text-muted-foreground shadow-xs">
        <Icon className="size-5" />
      </div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-sm text-[13px] text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
