"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/cn";

export const Tabs = TabsPrimitive.Root;

export function TabsList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex items-center gap-1 rounded-xl border border-border bg-surface-2 p-1",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium text-muted-foreground outline-none transition-colors",
        "hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
        "data-[state=active]:bg-surface data-[state=active]:text-foreground data-[state=active]:shadow-xs",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn("outline-none focus-visible:ring-2 focus-visible:ring-ring/50", className)}
      {...props}
    />
  );
}

/**
 * Underline-style tabs for in-page navigation (server workspace).
 * Use as a controlled segmented nav; renders its own indicator.
 */
export function UnderlineTabs({
  tabs,
  value,
  onValueChange,
  className,
}: {
  tabs: { value: string; label: string; count?: number }[];
  value: string;
  onValueChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1 border-b border-border", className)}>
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            onClick={() => onValueChange(t.value)}
            className={cn(
              "relative -mb-px flex items-center gap-2 px-3.5 py-2.5 text-[13px] font-medium outline-none transition-colors",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
            {typeof t.count === "number" && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular",
                  active ? "bg-accent-soft text-accent" : "bg-neutral-soft text-muted-foreground",
                )}
              >
                {t.count}
              </span>
            )}
            {active && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent" />
            )}
          </button>
        );
      })}
    </div>
  );
}
