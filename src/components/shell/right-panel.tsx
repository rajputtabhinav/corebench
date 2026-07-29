"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type DependencyList,
  type ReactNode,
} from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { StatusDot, type Tone } from "@/components/ui/status";
import {
  getActiveServerCount,
  getActivity,
  getPassRate,
  getPendingReviews,
  servers,
  validations,
} from "@/lib/data";
import { relativeTime } from "@/lib/format";

interface RightPanelCtx {
  node: ReactNode;
  setNode: (n: ReactNode) => void;
  open: boolean;
  toggle: () => void;
}

const Ctx = createContext<RightPanelCtx | null>(null);

export function RightPanelProvider({ children }: { children: ReactNode }) {
  const [node, setNode] = useState<ReactNode>(null);
  const [open, setOpen] = useState(true);
  const toggle = useCallback(() => setOpen((o) => !o), []);
  const value = useMemo(() => ({ node, setNode, open, toggle }), [node, open, toggle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

function useCtx() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("RightPanel components must be used within RightPanelProvider");
  return ctx;
}

export function useRightPanelControls() {
  const { open, toggle } = useCtx();
  return { open, toggle };
}

/** Pages call this to populate the context panel. Cleared on unmount. */
export function useRightPanel(node: ReactNode, deps: DependencyList) {
  const { setNode } = useCtx();
  useEffect(() => {
    setNode(node);
    return () => setNode(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function RightPanelOutlet() {
  const { node } = useCtx();
  return (
    <div className="flex h-full flex-col overflow-y-auto px-5 py-6">
      {node ?? <DefaultPanel />}
    </div>
  );
}

/* ----------------------------- Panel kit ----------------------------- */
export function PanelSection({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mb-7", className)}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-subtle-foreground">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </section>
  );
}

export function PanelStat({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: Tone;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-3">
      <div className="flex items-center gap-1.5">
        <StatusDot tone={tone} />
        <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      </div>
      <div className="mt-1.5 text-xl font-semibold tabular tracking-tight text-foreground">
        {value}
      </div>
      {hint && <div className="mt-0.5 text-[11px] text-subtle-foreground">{hint}</div>}
    </div>
  );
}

export function PanelKV({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5 text-[13px]">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="truncate text-right font-medium text-foreground">{value}</span>
    </div>
  );
}

/* --------------------------- Default panel --------------------------- */
function DefaultPanel() {
  const active = getActiveServerCount();
  const passRate = getPassRate();
  const pending = getPendingReviews().length;
  const recent = getActivity(4);

  return (
    <div>
      <PanelSection title="Workspace">
        <div className="grid grid-cols-2 gap-2.5">
          <PanelStat label="Active servers" value={active} tone="success" hint={`${servers.length} total`} />
          <PanelStat label="Validations" value={validations.length} tone="accent" />
          <PanelStat label="Pass rate" value={`${passRate}%`} tone={passRate >= 80 ? "success" : "warning"} />
          <PanelStat label="Pending review" value={pending} tone={pending ? "warning" : "neutral"} />
        </div>
      </PanelSection>

      <PanelSection title="Recent activity">
        <ul className="space-y-3">
          {recent.map((a) => (
            <li key={a.id} className="flex gap-2.5 text-[13px]">
              <span className="mt-1.5">
                <StatusDot
                  tone={
                    a.kind.includes("failed")
                      ? "danger"
                      : a.kind.includes("passed") || a.kind.includes("approved")
                        ? "success"
                        : "accent"
                  }
                />
              </span>
              <div className="min-w-0">
                <p className="truncate text-foreground">{a.target}</p>
                <p className="text-[11px] text-subtle-foreground">
                  {a.actor.split(" ")[0]} · {relativeTime(a.at)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </PanelSection>

      <div className="mt-auto rounded-xl border border-dashed border-border-strong bg-accent-soft/40 p-3.5">
        <div className="flex items-center gap-2 text-[13px] font-medium text-foreground">
          <Sparkles className="size-3.5 text-accent" />
          AI insights
        </div>
        <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
          Analyze logs, compare validations and surface anomalies — coming soon to this panel.
        </p>
        <Link
          href="/analytics"
          className="mt-2.5 inline-block text-[12px] font-medium text-accent hover:underline"
        >
          Explore analytics →
        </Link>
      </div>
    </div>
  );
}
