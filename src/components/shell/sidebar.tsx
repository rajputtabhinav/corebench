"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronsUpDown, LogOut, Settings as SettingsIcon, UserRound } from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/logo";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navGroups, settingsItem, activeHref, type NavItem } from "@/config/nav";
import { getCurrentUser } from "@/lib/data";

function NavLink({ item, active, onNavigate }: { item: NavItem; active: boolean; onNavigate?: () => void }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "group relative flex items-center gap-3 rounded-[10px] px-3 py-2 text-[13.5px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {active && (
        <motion.span
          layoutId="cb-nav-active"
          className="absolute inset-0 rounded-[10px] border border-border bg-surface shadow-xs"
          transition={{ type: "spring", stiffness: 520, damping: 42 }}
        />
      )}
      <Icon
        className={cn(
          "relative z-10 size-[18px] shrink-0 transition-colors",
          active ? "text-accent" : "text-subtle-foreground group-hover:text-muted-foreground",
        )}
      />
      <span className="relative z-10">{item.label}</span>
    </Link>
  );
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const current = activeHref(pathname);
  const user = getCurrentUser();

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="px-4 pb-3 pt-5">
        <Link href="/" onClick={onNavigate} className="inline-flex outline-none">
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2 no-scrollbar">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-subtle-foreground">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  active={current === item.href}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-1 border-t border-border px-3 py-3">
        <NavLink item={settingsItem} active={current === settingsItem.href} onNavigate={onNavigate} />

        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-2.5 rounded-[10px] px-2 py-2 text-left outline-none transition-colors hover:bg-neutral-soft focus-visible:ring-2 focus-visible:ring-ring/40">
            <Avatar name={user.name} size="md" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold text-foreground">
                {user.name}
              </span>
              <span className="block truncate text-[11px] text-muted-foreground">{user.role}</span>
            </span>
            <ChevronsUpDown className="size-4 shrink-0 text-subtle-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" className="w-56">
            <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <UserRound /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <SettingsIcon /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive>
              <LogOut /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
