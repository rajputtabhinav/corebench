"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartSpec } from "@/lib/data";
import type { Tone } from "@/components/ui/status";

const FALLBACK: Record<Tone | "grid" | "axis", string> = {
  accent: "#2a57e0",
  success: "#11935a",
  warning: "#b06e00",
  danger: "#cf3b30",
  info: "#2a57e0",
  neutral: "#5b6470",
  grid: "#ecedf1",
  axis: "#98a1ad",
};

const VAR: Record<Tone | "grid" | "axis", string> = {
  accent: "--accent",
  success: "--success",
  warning: "--warning",
  danger: "--danger",
  info: "--info",
  neutral: "--muted-foreground",
  grid: "--border",
  axis: "--subtle-foreground",
};

/** Resolve token colors from CSS vars; re-read when the theme class flips. */
function useChartColors() {
  const [colors, setColors] = useState(FALLBACK);
  useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement);
      const next = {} as typeof FALLBACK;
      (Object.keys(VAR) as (keyof typeof VAR)[]).forEach((k) => {
        next[k] = cs.getPropertyValue(VAR[k]).trim() || FALLBACK[k];
      });
      setColors(next);
    };
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return colors;
}

function ChartTooltip({
  active,
  payload,
  label,
  unit,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string | number;
  unit: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border-strong bg-elevated px-3 py-2 shadow-pop">
      <p className="mb-1 text-[11px] font-medium text-muted-foreground">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2 text-[12.5px]">
          <span className="inline-block size-2 rounded-full" style={{ background: p.color }} />
          <span className="font-semibold tabular text-foreground">
            {typeof p.value === "number" ? p.value.toLocaleString("en-US") : p.value}
          </span>
          <span className="text-subtle-foreground">{unit}</span>
        </p>
      ))}
    </div>
  );
}

export function ChartView({ spec, height = 220 }: { spec: ChartSpec; height?: number }) {
  const colors = useChartColors();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="skeleton rounded-xl" style={{ height }} />;
  }

  const axisProps = {
    stroke: colors.axis,
    tick: { fill: colors.axis, fontSize: 11 },
    tickLine: false,
    axisLine: false,
  };
  const colorOf = (tone?: Tone) => colors[tone ?? "accent"];

  const common = (
    <>
      <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
      <XAxis dataKey="x" {...axisProps} dy={6} />
      <YAxis {...axisProps} width={40} />
      <Tooltip
        cursor={{ stroke: colors.grid, strokeWidth: 1 }}
        content={(p) => <ChartTooltip {...(p as object)} unit={spec.unit} />}
      />
    </>
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      {spec.kind === "line" ? (
        <LineChart data={spec.data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
          {common}
          {spec.series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={colorOf(s.tone)}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              animationDuration={700}
            />
          ))}
        </LineChart>
      ) : spec.kind === "area" ? (
        <AreaChart data={spec.data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
          <defs>
            {spec.series.map((s) => (
              <linearGradient key={s.key} id={`grad-${spec.id}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colorOf(s.tone)} stopOpacity={0.25} />
                <stop offset="100%" stopColor={colorOf(s.tone)} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          {common}
          {spec.series.map((s) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={colorOf(s.tone)}
              strokeWidth={2}
              fill={`url(#grad-${spec.id}-${s.key})`}
              animationDuration={700}
            />
          ))}
        </AreaChart>
      ) : (
        <BarChart data={spec.data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
          {common}
          {spec.series.map((s) => (
            <Bar key={s.key} dataKey={s.key} name={s.label} fill={colorOf(s.tone)} radius={[5, 5, 0, 0]} animationDuration={700} maxBarSize={56}>
              {spec.series.length === 1 &&
                spec.data.map((_, i) => <Cell key={i} fill={colorOf(s.tone)} />)}
            </Bar>
          ))}
        </BarChart>
      )}
    </ResponsiveContainer>
  );
}

export function ChartCard({ spec, height }: { spec: ChartSpec; height?: number }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="text-[13px] font-semibold tracking-tight text-foreground">{spec.title}</h3>
        <span className="shrink-0 font-mono text-[11px] text-subtle-foreground">{spec.unit}</span>
      </div>
      <ChartView spec={spec} height={height} />
    </div>
  );
}
