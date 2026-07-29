"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, FileText, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Segmented } from "@/components/ui/segmented";
import { StatusBadge } from "@/components/ui/status";
import { Badge } from "@/components/ui/badge";
import { ChartView } from "@/components/domain/chart";
import { TypeIcon } from "@/components/domain/type-badge";
import { SectionHeading } from "@/components/shell/page";
import type { BenchmarkDetail, Validation, Verdict } from "@/lib/data";
import { formatDate } from "@/lib/format";

export interface BenchmarkItem {
  benchmark: BenchmarkDetail;
  validation: Validation;
  serverId: string;
  serverName: string;
}

const CATEGORY_ORDER = ["Network", "Storage", "Memory", "CPU", "Power", "Thermal", "Custom"];

function VerdictMark({ verdict }: { verdict: Verdict }) {
  if (verdict === "pass")
    return (
      <span className="inline-flex items-center gap-1 text-success">
        <Check className="size-4" />
        <span className="text-[12px] font-medium">PASS</span>
      </span>
    );
  if (verdict === "warn")
    return (
      <span className="inline-flex items-center gap-1 text-warning">
        <TriangleAlert className="size-4" />
        <span className="text-[12px] font-medium">LIMITED</span>
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-danger">
      <X className="size-4" />
      <span className="text-[12px] font-medium">FAIL</span>
    </span>
  );
}

function MetricsTable({ rows }: { rows: BenchmarkDetail["metrics"] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border bg-surface-2/60 text-[11px] font-semibold uppercase tracking-wide text-subtle-foreground">
            <th className="px-4 py-2.5">Metric</th>
            <th className="px-4 py-2.5">Result</th>
            <th className="hidden px-4 py-2.5 sm:table-cell">Industry typical</th>
            <th className="px-4 py-2.5 text-right">Verdict</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r, i) => (
            <tr key={i} className="align-top">
              <td className="px-4 py-2.5 text-[13px] text-foreground">{r.metric}</td>
              <td className="px-4 py-2.5 font-mono text-[12.5px] font-medium text-foreground tabular">{r.result}</td>
              <td className="hidden px-4 py-2.5 text-[12.5px] text-muted-foreground sm:table-cell">{r.typical}</td>
              <td className="px-4 py-2.5 text-right">
                <span className="inline-flex justify-end">
                  <VerdictMark verdict={r.verdict} />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MethodologyTable({ steps }: { steps: BenchmarkDetail["methodology"] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border bg-surface-2/60 text-[11px] font-semibold uppercase tracking-wide text-subtle-foreground">
            <th className="px-4 py-2.5">Step</th>
            <th className="px-4 py-2.5">Tool &amp; command</th>
            <th className="hidden px-4 py-2.5 md:table-cell">Purpose</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {steps.map((s, i) => (
            <tr key={i} className="align-top">
              <td className="whitespace-nowrap px-4 py-2.5 text-[13px] font-medium text-foreground">{s.step}</td>
              <td className="px-4 py-2.5 font-mono text-[12px] text-muted-foreground">{s.tool}</td>
              <td className="hidden px-4 py-2.5 text-[12.5px] text-muted-foreground md:table-cell">{s.purpose}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RefTable({ table }: { table: NonNullable<BenchmarkDetail["references"]> }) {
  const ourCol = table.ourColumn ?? 1;
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border bg-surface-2/60 text-[11px] font-semibold uppercase tracking-wide text-subtle-foreground">
            {table.columns.map((col, i) => (
              <th key={i} className={cn("whitespace-nowrap px-4 py-2.5", i === ourCol && "text-accent")}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {table.rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={cn(
                    "px-4 py-2.5 text-[12.5px]",
                    ci === 0 ? "font-medium text-foreground" : "font-mono tabular text-muted-foreground",
                    ci === ourCol && "bg-accent-soft/50 font-semibold text-foreground",
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BenchmarksExplorer({ items }: { items: BenchmarkItem[] }) {
  const [groupBy, setGroupBy] = useState<"product" | "server">("product");
  const [selectedId, setSelectedId] = useState(items[0]?.benchmark.id ?? "");

  const groups = useMemo(() => {
    const map = new Map<string, BenchmarkItem[]>();
    for (const it of items) {
      const key = groupBy === "product" ? it.benchmark.product.category : it.serverName;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(it);
    }
    const entries = [...map.entries()];
    if (groupBy === "product") {
      entries.sort((a, b) => CATEGORY_ORDER.indexOf(a[0]) - CATEGORY_ORDER.indexOf(b[0]));
    } else {
      entries.sort((a, b) => a[0].localeCompare(b[0]));
    }
    return entries;
  }, [items, groupBy]);

  const selected = items.find((it) => it.benchmark.id === selectedId) ?? items[0];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
      {/* Master list */}
      <div className="lg:sticky lg:top-[84px] lg:self-start">
        <Segmented
          className="mb-4 w-full"
          options={[
            { value: "product", label: "By product" },
            { value: "server", label: "By server" },
          ]}
          value={groupBy}
          onChange={(v) => setGroupBy(v as "product" | "server")}
        />
        <div className="space-y-5">
          {groups.map(([key, groupItems]) => (
            <div key={key}>
              <div className="mb-2 flex items-center gap-2 px-1">
                {groupBy === "product" ? (
                  <TypeIcon type={groupItems[0].benchmark.product.category} size="sm" />
                ) : null}
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-subtle-foreground">
                  {groupBy === "server" ? key : `${key} · ${groupItems.length}`}
                </span>
              </div>
              <div className="space-y-1.5">
                {groupItems.map((it) => {
                  const active = it.benchmark.id === selected?.benchmark.id;
                  return (
                    <button
                      key={it.benchmark.id}
                      onClick={() => setSelectedId(it.benchmark.id)}
                      className={cn(
                        "w-full rounded-xl border p-3 text-left transition-colors",
                        active
                          ? "border-accent/40 bg-accent-soft"
                          : "border-border bg-surface hover:border-border-strong hover:bg-surface-2",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-[13px] font-semibold text-foreground">
                          {it.benchmark.product.name}
                        </span>
                        <StatusBadge status={it.validation.status} />
                      </div>
                      {it.benchmark.product.sku && (
                        <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
                          {it.benchmark.product.sku}
                        </p>
                      )}
                      <p className="mt-0.5 truncate text-[11px] text-subtle-foreground">
                        {groupBy === "product" ? it.serverName : it.benchmark.product.category} ·{" "}
                        {formatDate(it.validation.date)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail */}
      {selected && <BenchmarkDetailView key={selected.benchmark.id} item={selected} />}
    </div>
  );
}

function BenchmarkDetailView({ item }: { item: BenchmarkItem }) {
  const { benchmark: b, validation: v, serverId, serverName } = item;
  return (
    <div className="min-w-0 space-y-7">
      {/* Header */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <TypeIcon type={b.product.category} size="lg" />
            <div className="min-w-0">
              <h2 className="text-[18px] font-semibold tracking-tight text-foreground">{b.product.name}</h2>
              {b.product.sku && <p className="font-mono text-[12px] text-muted-foreground">{b.product.sku}</p>}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge tone="neutral" size="sm">{b.product.vendor}</Badge>
                <Badge tone="accent" size="sm">{b.product.category}</Badge>
                {b.product.detail && (
                  <span className="text-[12px] text-muted-foreground">{b.product.detail}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <StatusBadge status={v.status} pulse={v.status === "running"} />
            <Link href={`/servers/${serverId}`} className="font-mono text-[12px] text-accent hover:underline">
              {serverName}
            </Link>
            <span className="text-[11px] text-subtle-foreground">{formatDate(v.date)} · {v.engineer}</span>
          </div>
        </div>
        <p className="mt-4 border-t border-border pt-4 text-[13.5px] leading-relaxed text-muted-foreground">
          {v.summary}
        </p>
      </div>

      {/* Results */}
      <section>
        <SectionHeading title="Results vs industry-typical" />
        <MetricsTable rows={b.metrics} />
      </section>

      {/* Charts */}
      {v.charts.length > 0 && (
        <section>
          <SectionHeading title="Benchmark charts" />
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {v.charts.map((c) => (
              <div key={c.id} className="rounded-2xl border border-border bg-surface p-4 shadow-xs">
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <h3 className="text-[13px] font-semibold tracking-tight text-foreground">{c.title}</h3>
                  <span className="shrink-0 font-mono text-[11px] text-subtle-foreground">{c.unit}</span>
                </div>
                <ChartView spec={c} height={200} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Methodology */}
      <section>
        <SectionHeading title="Test methodology" />
        <MethodologyTable steps={b.methodology} />
      </section>

      {/* References */}
      {b.references && (
        <section>
          <SectionHeading title={b.references.title} />
          <RefTable table={b.references} />
        </section>
      )}

      {/* Bottom line */}
      <section>
        <SectionHeading title="Bottom line" />
        <div className="rounded-2xl border border-border bg-surface-2 p-4 text-[13.5px] leading-relaxed text-foreground/90">
          {b.verdict}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <Link
            href={`/validations/${v.id}`}
            className="inline-flex items-center gap-1 text-[12.5px] font-medium text-accent hover:underline"
          >
            Full validation <ArrowUpRight className="size-3.5" />
          </Link>
          <Link
            href="/reports"
            className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-muted-foreground hover:text-foreground"
          >
            <FileText className="size-3.5" /> Report
          </Link>
        </div>
      </section>
    </div>
  );
}
