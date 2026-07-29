import { Check, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/cn";
import type { BiosConfig, BiosSetting } from "@/lib/data";
import { formatDate } from "@/lib/format";

function groupSettings(settings: BiosSetting[]) {
  const map = new Map<string, BiosSetting[]>();
  for (const s of settings) {
    if (!map.has(s.group)) map.set(s.group, []);
    map.get(s.group)!.push(s);
  }
  return [...map.entries()];
}

export function BiosConfigView({ config }: { config: BiosConfig }) {
  const groups = groupSettings(config.settings);

  return (
    <div className="space-y-5">
      {config.notes && (
        <p className="rounded-xl border border-border bg-surface-2 p-3.5 text-[13px] text-muted-foreground">
          {config.notes}
        </p>
      )}
      {groups.map(([group, settings]) => (
        <div key={group} className="overflow-hidden rounded-xl border border-border">
          <div className="flex items-center justify-between border-b border-border bg-surface-2 px-4 py-2.5">
            <h4 className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
              {group}
            </h4>
            <span className="text-[11px] text-subtle-foreground">{settings.length} settings</span>
          </div>
          <div className="divide-y divide-border">
            {settings.map((s) => {
              const deviates = s.recommended && s.recommended !== s.value;
              return (
                <div key={s.key} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-foreground">{s.key}</p>
                    {s.note && <p className="text-[11.5px] text-subtle-foreground">{s.note}</p>}
                  </div>
                  <div className="flex shrink-0 items-center gap-2.5">
                    {s.recommended &&
                      (deviates ? (
                        <span className="hidden items-center gap-1 text-[11px] text-warning sm:inline-flex">
                          <TriangleAlert className="size-3" /> rec: {s.recommended}
                        </span>
                      ) : (
                        <Check className="size-3.5 text-success" />
                      ))}
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 font-mono text-[12px] font-medium",
                        deviates
                          ? "bg-warning-soft text-warning"
                          : "bg-surface-2 text-foreground",
                      )}
                    >
                      {s.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <p className="text-[12px] text-subtle-foreground">
        Captured by {config.capturedBy} · {formatDate(config.capturedAt)}
      </p>
    </div>
  );
}
