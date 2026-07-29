"use client";

import { useState } from "react";
import Link from "next/link";
import { Cpu } from "lucide-react";
import { cn } from "@/lib/cn";
import { Card, CardContent } from "@/components/ui/card";
import { BiosConfigView } from "@/components/domain/bios-config";
import { getServer, type BiosConfig } from "@/lib/data";
import { formatDate } from "@/lib/format";

export function BiosArchive({ configs }: { configs: BiosConfig[] }) {
  const [selectedId, setSelectedId] = useState(configs[0]?.id ?? "");
  const selected = configs.find((c) => c.id === selectedId) ?? configs[0];
  const selectedServer = selected ? getServer(selected.serverId) : undefined;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[320px_1fr]">
      {/* List */}
      <div className="space-y-2">
        {configs.map((c) => {
          const server = getServer(c.serverId);
          const active = c.id === selected?.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                active
                  ? "border-accent/40 bg-accent-soft"
                  : "border-border bg-surface hover:border-border-strong hover:bg-surface-2",
              )}
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-[10px]",
                  active ? "bg-accent text-on-accent" : "bg-neutral-soft text-muted-foreground",
                )}
              >
                <Cpu className="size-[18px]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-foreground">BIOS {c.version}</p>
                <p className="truncate font-mono text-[11.5px] text-muted-foreground">{server?.name}</p>
              </div>
              <span className="shrink-0 text-[11px] text-subtle-foreground">{c.settings.length}</span>
            </button>
          );
        })}
      </div>

      {/* Detail */}
      <div className="min-w-0">
        {selected ? (
          <Card>
            <CardContent>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
                      BIOS {selected.version}
                    </h2>
                    <span className="text-[13px] text-muted-foreground">{selected.profile}</span>
                  </div>
                  {selectedServer && (
                    <Link
                      href={`/servers/${selectedServer.id}`}
                      className="mt-0.5 inline-block font-mono text-[12px] text-accent hover:underline"
                    >
                      {selectedServer.name}
                    </Link>
                  )}
                </div>
                <span className="text-[12px] text-subtle-foreground">{formatDate(selected.capturedAt)}</span>
              </div>
              <BiosConfigView config={selected} />
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
