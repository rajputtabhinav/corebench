"use client";

import { useMemo, useState } from "react";
import { Search, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/cn";
import { Input } from "@/components/ui/input";
import { Segmented } from "@/components/ui/segmented";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ValidationRow } from "@/components/domain/validation-row";
import type { Validation, ValidationType } from "@/lib/data";

const TYPES: (ValidationType | "All")[] = [
  "All",
  "Memory",
  "Storage",
  "Network",
  "CPU",
  "Power",
  "Thermal",
  "Firmware",
];

export function ValidationsList({ validations }: { validations: Validation[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>("All");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    return validations.filter((v) => {
      if (type !== "All" && v.type !== type) return false;
      if (status !== "all" && v.status !== status) return false;
      if (query) {
        const hay = `${v.title} ${v.type} ${v.engineer} ${v.summary} ${v.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(query.toLowerCase())) return false;
      }
      return true;
    });
  }, [validations, type, status, query]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search validations…"
            className="pl-9"
          />
        </div>
        <Segmented
          options={[
            { value: "all", label: "All" },
            { value: "passed", label: "Passed" },
            { value: "warning", label: "Warning" },
            { value: "failed", label: "Failed" },
            { value: "running", label: "Running" },
          ]}
          value={status}
          onChange={setStatus}
        />
        <span className="ml-auto text-[12px] text-muted-foreground">
          {filtered.length} of {validations.length}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={cn(
              "rounded-full border px-3 py-1 text-[12.5px] font-medium transition-colors",
              type === t
                ? "border-accent/40 bg-accent-soft text-accent"
                : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length ? (
        <Card>
          <CardContent className="space-y-0.5 p-2.5">
            {filtered.map((v) => (
              <ValidationRow key={v.id} validation={v} />
            ))}
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          icon={ShieldCheck}
          title="No validations match"
          description="Try a different search, type, or status filter."
        />
      )}
    </div>
  );
}
