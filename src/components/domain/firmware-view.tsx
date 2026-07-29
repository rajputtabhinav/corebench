"use client";

import { useMemo, useState } from "react";
import { CircuitBoard } from "lucide-react";
import { cn } from "@/lib/cn";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FirmwareTimeline } from "@/components/domain/firmware-timeline";
import { getServer, type FirmwareComponent, type FirmwareEntry } from "@/lib/data";

const COMPONENTS: (FirmwareComponent | "All")[] = ["All", "BIOS", "BMC", "CPLD", "NIC", "SSD"];

export function FirmwareView({ entries }: { entries: FirmwareEntry[] }) {
  const [component, setComponent] = useState<string>("All");

  const filtered = useMemo(
    () => (component === "All" ? entries : entries.filter((e) => e.component === component)),
    [entries, component],
  );

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-1.5">
        {COMPONENTS.map((c) => (
          <button
            key={c}
            onClick={() => setComponent(c)}
            className={cn(
              "rounded-full border px-3 py-1 text-[12.5px] font-medium transition-colors",
              component === c
                ? "border-accent/40 bg-accent-soft text-accent"
                : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length ? (
        <Card>
          <CardContent>
            <FirmwareTimeline
              entries={filtered}
              showServer
              serverNameOf={(id) => getServer(id)?.name}
            />
          </CardContent>
        </Card>
      ) : (
        <EmptyState icon={CircuitBoard} title="No firmware entries" description="Nothing recorded for this component." />
      )}
    </div>
  );
}
