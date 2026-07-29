import {
  BarChart3,
  CircuitBoard,
  Cpu,
  FileText,
  Gauge,
  LayoutGrid,
  ScrollText,
  Server,
  Settings,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutGrid },
      { label: "Servers", href: "/servers", icon: Server },
      { label: "Validations", href: "/validations", icon: ShieldCheck },
      { label: "Benchmarks", href: "/benchmarks", icon: Gauge },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Library",
    items: [
      { label: "Reports", href: "/reports", icon: FileText },
      { label: "BIOS Archive", href: "/bios", icon: Cpu },
      { label: "Firmware", href: "/firmware", icon: CircuitBoard },
      { label: "Logs", href: "/logs", icon: ScrollText },
    ],
  },
];

export const settingsItem: NavItem = { label: "Settings", href: "/settings", icon: Settings };

export const allNavItems: NavItem[] = [
  ...navGroups.flatMap((g) => g.items),
  settingsItem,
];

/** Resolve the active nav item for a pathname (longest matching href wins). */
export function activeHref(pathname: string): string {
  const candidates = allNavItems
    .map((i) => i.href)
    .filter((href) => (href === "/" ? pathname === "/" : pathname.startsWith(href)))
    .sort((a, b) => b.length - a.length);
  return candidates[0] ?? "/";
}
