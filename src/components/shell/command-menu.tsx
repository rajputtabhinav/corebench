"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import {
  CircuitBoard,
  Cpu,
  CornerDownLeft,
  FileText,
  ScrollText,
  Search,
  Server,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Kbd } from "@/components/ui/kbd";
import { allNavItems } from "@/config/nav";
import { search, servers, type SearchKind, type SearchResult } from "@/lib/data";

export const OPEN_COMMAND_EVENT = "corebench:open-command";

const kindMeta: Record<SearchKind | "nav", { icon: LucideIcon; label: string }> = {
  server: { icon: Server, label: "Server" },
  validation: { icon: ShieldCheck, label: "Validation" },
  report: { icon: FileText, label: "Report" },
  bios: { icon: Cpu, label: "BIOS" },
  firmware: { icon: CircuitBoard, label: "Firmware" },
  log: { icon: ScrollText, label: "Log" },
  nav: { icon: Search, label: "Page" },
};

interface Item {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  href: string;
  kind: SearchKind | "nav";
}

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  // Global ⌘K / Ctrl+K + custom open event from the topbar trigger.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_COMMAND_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_COMMAND_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  const items: Item[] = useMemo(() => {
    if (query.trim()) {
      return search(query).map((r: SearchResult) => ({
        icon: kindMeta[r.kind].icon,
        title: r.title,
        subtitle: r.subtitle,
        href: r.href,
        kind: r.kind,
      }));
    }
    // Empty state: quick navigation + jump to servers
    const nav: Item[] = allNavItems.map((n) => ({
      icon: n.icon,
      title: n.label,
      subtitle: "Page",
      href: n.href,
      kind: "nav" as const,
    }));
    const srv: Item[] = servers
      .filter((s) => s.status !== "retired")
      .slice(0, 4)
      .map((s) => ({
        icon: Server,
        title: s.name,
        subtitle: `${s.vendor} · ${s.model}`,
        href: `/servers/${s.id}`,
        kind: "server" as const,
      }));
    return [...nav, ...srv];
  }, [query]);

  useEffect(() => {
    setActive((a) => Math.min(a, Math.max(0, items.length - 1)));
  }, [items.length]);

  const go = useCallback(
    (item: Item | undefined) => {
      if (!item) return;
      setOpen(false);
      router.push(item.href);
    },
    [router],
  );

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(items[active]);
    }
  }

  // Keep the active row scrolled into view.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const showSectionHeaders = !query.trim();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="cb-overlay fixed inset-0 z-[60] bg-foreground/30 backdrop-blur-[2px]" />
        <Dialog.Content
          className="cb-dialog fixed left-1/2 top-[14vh] z-[60] w-[calc(100vw-2rem)] max-w-[640px] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-surface shadow-lg outline-none"
          aria-label="Command menu"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">Search CoreBench</Dialog.Title>
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search className="size-[18px] shrink-0 text-subtle-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKey}
              placeholder="Search servers, validations, logs, BIOS, firmware…"
              className="h-14 w-full bg-transparent text-[15px] text-foreground outline-none placeholder:text-subtle-foreground"
            />
            <Kbd>Esc</Kbd>
          </div>

          <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
            {items.length === 0 ? (
              <div className="px-3 py-10 text-center text-sm text-muted-foreground">
                No matches for “{query}”.
              </div>
            ) : (
              items.map((item, i) => {
                const Icon = item.icon;
                const isFirstNav = showSectionHeaders && i === 0;
                const isFirstServer =
                  showSectionHeaders && item.kind === "server" && items[i - 1]?.kind === "nav";
                return (
                  <div key={`${item.href}-${i}`}>
                    {isFirstNav && <SectionLabel>Go to</SectionLabel>}
                    {isFirstServer && <SectionLabel>Servers</SectionLabel>}
                    <button
                      data-idx={i}
                      onClick={() => go(item)}
                      onMouseMove={() => setActive(i)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left outline-none transition-colors",
                        active === i ? "bg-neutral-soft" : "hover:bg-neutral-soft/60",
                      )}
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-2 text-muted-foreground">
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-medium text-foreground">
                          {item.title}
                        </span>
                        <span className="block truncate text-[12px] text-muted-foreground">
                          {item.subtitle}
                        </span>
                      </span>
                      {!showSectionHeaders && (
                        <span className="shrink-0 rounded-md bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-subtle-foreground">
                          {kindMeta[item.kind].label}
                        </span>
                      )}
                      {active === i && (
                        <CornerDownLeft className="size-3.5 shrink-0 text-subtle-foreground" />
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-[11px] text-subtle-foreground">
            <span className="flex items-center gap-1.5">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              navigate
            </span>
            <span className="flex items-center gap-1.5">
              <Kbd>↵</Kbd>
              open
            </span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-subtle-foreground">
      {children}
    </div>
  );
}
