"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  FileUp,
  Menu,
  PanelRight,
  Plus,
  Search,
  ServerCog,
  ShieldPlus,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Kbd } from "@/components/ui/kbd";
import { Hint } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRightPanelControls } from "@/components/shell/right-panel";
import { OPEN_COMMAND_EVENT } from "@/components/shell/command-menu";
import { allNavItems } from "@/config/nav";
import { getServer, getValidation } from "@/lib/data";

interface Crumb {
  label: string;
  href?: string;
}

function useBreadcrumbs(pathname: string): Crumb[] {
  const seg = pathname.split("/").filter(Boolean);
  if (seg.length === 0) return [{ label: "Dashboard" }];

  const sectionMap: Record<string, string> = {
    servers: "Servers",
    validations: "Validations",
    benchmarks: "Benchmarks",
    analytics: "Analytics",
    reports: "Reports",
    bios: "BIOS Archive",
    firmware: "Firmware",
    logs: "Logs",
    settings: "Settings",
  };

  const section = seg[0];
  const crumbs: Crumb[] = [{ label: sectionMap[section] ?? section, href: `/${section}` }];

  if (seg.length > 1) {
    const id = seg[1];
    if (section === "servers") crumbs.push({ label: getServer(id)?.name ?? id });
    else if (section === "validations") crumbs.push({ label: getValidation(id)?.title ?? id });
    else crumbs.push({ label: id });
  }
  return crumbs;
}

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const crumbs = useBreadcrumbs(pathname);
  const { toggle } = useRightPanelControls();

  function openCommand() {
    window.dispatchEvent(new Event(OPEN_COMMAND_EVENT));
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface/80 px-3 backdrop-blur-md sm:px-5">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="inline-flex size-9 items-center justify-center rounded-[10px] text-muted-foreground hover:bg-neutral-soft hover:text-foreground lg:hidden"
      >
        <Menu className="size-[18px]" />
      </button>

      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex min-w-0 items-center gap-1.5">
            {i > 0 && <ChevronRight className="size-3.5 shrink-0 text-subtle-foreground" />}
            {crumb.href && i < crumbs.length - 1 ? (
              <Link
                href={crumb.href}
                className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="truncate font-semibold text-foreground">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          onClick={openCommand}
          className="group hidden h-9 items-center gap-2 rounded-[10px] border border-border-strong bg-surface px-2.5 text-sm text-muted-foreground transition-colors hover:border-border-strong hover:bg-surface-2 sm:flex"
        >
          <Search className="size-4 text-subtle-foreground" />
          <span className="pr-6 text-[13px]">Search…</span>
          <Kbd>⌘K</Kbd>
        </button>
        <button
          type="button"
          onClick={openCommand}
          aria-label="Search"
          className="inline-flex size-9 items-center justify-center rounded-[10px] text-muted-foreground hover:bg-neutral-soft hover:text-foreground sm:hidden"
        >
          <Search className="size-[18px]" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-accent px-3 text-[13px] font-medium text-on-accent shadow-xs outline-none transition-colors hover:bg-accent-600 focus-visible:ring-2 focus-visible:ring-ring/40">
            <Plus className="size-4" />
            <span className="hidden sm:inline">New</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Create</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/validations">
                <ShieldPlus /> New validation
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/servers">
                <ServerCog /> Register server
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/reports">
                <FileUp /> Upload report
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="hidden h-5 w-px bg-border sm:block" />

        <Hint label="Toggle context panel" side="bottom">
          <button
            type="button"
            onClick={toggle}
            aria-label="Toggle context panel"
            className="hidden size-9 items-center justify-center rounded-[10px] text-muted-foreground hover:bg-neutral-soft hover:text-foreground xl:inline-flex"
          >
            <PanelRight className="size-[18px]" />
          </button>
        </Hint>
      </div>
    </header>
  );
}
