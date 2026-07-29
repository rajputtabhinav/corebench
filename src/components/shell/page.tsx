import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const sizeMap = {
  default: "max-w-5xl",
  wide: "max-w-6xl",
  full: "max-w-none",
};

export function PageContainer({
  children,
  size = "default",
  className,
}: {
  children: ReactNode;
  size?: keyof typeof sizeMap;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full px-5 py-8 sm:px-8", sizeMap[size], className)}>
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-subtle-foreground">
            {eyebrow}
          </div>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-[14px] text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

/** Section heading used within pages and on the dashboard. */
export function SectionHeading({
  title,
  action,
  className,
}: {
  title: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-3 flex items-center justify-between gap-3", className)}>
      <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-subtle-foreground">
        {title}
      </h2>
      {action}
    </div>
  );
}
