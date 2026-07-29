import type { Metadata } from "next";
import { PageContainer, PageHeader, SectionHeading } from "@/components/shell/page";
import { Card, CardContent } from "@/components/ui/card";
import { ChartCard } from "@/components/domain/chart";
import { statusMeta, type Tone } from "@/components/ui/status";
import {
  getActiveServerCount,
  getPassRate,
  getStatusCounts,
  getTypeCounts,
  getValidation,
  servers,
  validations,
  type ChartSpec,
} from "@/lib/data";

export const metadata: Metadata = { title: "Analytics" };

const toneBg: Record<Tone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  accent: "bg-accent",
  neutral: "bg-neutral",
};

function Ring({ value }: { value: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative size-[132px]">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--border)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="var(--success)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold tabular tracking-tight text-foreground">{value}%</span>
        <span className="text-[11px] text-muted-foreground">pass rate</span>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <Card className="p-4">
      <p className="text-[11.5px] font-medium uppercase tracking-wide text-subtle-foreground">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold tabular tracking-tight text-foreground">{value}</p>
      <p className="mt-0.5 text-[12px] text-muted-foreground">{sub}</p>
    </Card>
  );
}

function retitle(spec: ChartSpec | undefined, title: string): ChartSpec | null {
  return spec ? { ...spec, title } : null;
}

export default function AnalyticsPage() {
  const passRate = getPassRate();
  const statusCounts = getStatusCounts();
  const typeCounts = getTypeCounts();
  const activeServers = getActiveServerCount();
  const activeHealth = servers.filter((s) => s.status !== "retired");
  const avgHealth = Math.round(
    activeHealth.reduce((n, s) => n + s.healthScore, 0) / Math.max(1, activeHealth.length),
  );

  const statusOrder = ["passed", "warning", "failed", "running", "pending"];
  const maxStatus = Math.max(...Object.values(statusCounts), 1);

  const typeSpec: ChartSpec = {
    id: "type-dist",
    title: "Validations by type",
    kind: "bar",
    unit: "runs",
    series: [{ key: "v", label: "Runs", tone: "accent" }],
    data: typeCounts.map((t) => ({ x: t.type, v: t.count })),
  };

  const firmwareSpec: ChartSpec = {
    id: "fw-impact",
    title: "Memory Triad by BIOS version · TYR-NVMe-217",
    kind: "bar",
    unit: "GB/s",
    series: [{ key: "v", label: "Triad", tone: "success" }],
    data: [
      { x: "BIOS 3.42", v: 435 },
      { x: "BIOS 3.45", v: 443 },
    ],
  };

  const memTrend = retitle(
    getValidation("val-2041")?.charts.find((c) => c.id === "mem-runs"),
    "Memory Triad trend · recent runs",
  );
  const ioScaling = retitle(
    getValidation("val-2039")?.charts.find((c) => c.id === "io-iops"),
    "Storage IOPS scaling · PM1743 Gen5",
  );

  return (
    <PageContainer size="wide">
      <PageHeader
        title="Analytics"
        description="Fleet-wide validation trends, pass rates and firmware impact."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Pass rate" value={`${passRate}%`} sub={`${validations.length} validations`} />
        <StatCard label="Active servers" value={String(activeServers)} sub={`${servers.length} total`} />
        <StatCard label="Avg health" value={`${avgHealth}%`} sub="active fleet" />
        <StatCard
          label="Open issues"
          value={String((statusCounts.failed ?? 0) + (statusCounts.warning ?? 0))}
          sub="failed + warnings"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardContent>
            <SectionHeading title="Validation outcomes" />
            <div className="flex items-center gap-6">
              <Ring value={passRate} />
              <div className="flex-1 space-y-2.5">
                {statusOrder
                  .filter((s) => statusCounts[s])
                  .map((s) => {
                    const { tone, label } = statusMeta(s);
                    const count = statusCounts[s] ?? 0;
                    return (
                      <div key={s}>
                        <div className="mb-1 flex items-center justify-between text-[12.5px]">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="tabular font-medium text-foreground">{count}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-neutral-soft">
                          <div
                            className={`h-full rounded-full ${toneBg[tone]}`}
                            style={{ width: `${(count / maxStatus) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </CardContent>
        </Card>

        <ChartCard spec={typeSpec} height={232} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {memTrend && <ChartCard spec={memTrend} />}
        <ChartCard spec={firmwareSpec} />
      </div>

      {ioScaling && (
        <div className="mt-5">
          <ChartCard spec={ioScaling} height={240} />
        </div>
      )}
    </PageContainer>
  );
}
