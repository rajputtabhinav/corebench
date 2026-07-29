"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, ChevronUp, Search, Server as ServerIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { Input } from "@/components/ui/input";
import { Segmented } from "@/components/ui/segmented";
import { StatusBadge } from "@/components/ui/status";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import type { Server } from "@/lib/data";
import { relativeTime } from "@/lib/format";

export type ServerRow = Server & { validationCount: number };

function healthTone(score: number) {
  if (score >= 90) return "success" as const;
  if (score >= 75) return "warning" as const;
  if (score === 0) return "neutral" as const;
  return "danger" as const;
}

function SortHeader({ label, column }: { label: string; column: any }) {
  const sorted = column.getIsSorted();
  return (
    <button
      onClick={() => column.toggleSorting(sorted === "asc")}
      className="inline-flex items-center gap-1.5 text-left transition-colors hover:text-foreground"
    >
      {label}
      {sorted === "asc" ? (
        <ChevronUp className="size-3.5" />
      ) : sorted === "desc" ? (
        <ChevronDown className="size-3.5" />
      ) : (
        <ArrowUpDown className="size-3 opacity-40" />
      )}
    </button>
  );
}

export function ServersTable({ rows }: { rows: ServerRow[] }) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const data = useMemo(
    () => (statusFilter === "all" ? rows : rows.filter((r) => r.status === statusFilter)),
    [rows, statusFilter],
  );

  const columns = useMemo<ColumnDef<ServerRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => <SortHeader label="Server" column={column} />,
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate font-mono text-[13px] font-semibold text-foreground">{row.original.name}</p>
            <p className="truncate text-[11.5px] text-muted-foreground">
              {row.original.vendor} · {row.original.model}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
        enableSorting: false,
      },
      {
        accessorKey: "cores",
        header: ({ column }) => <SortHeader label="Cores" column={column} />,
        cell: ({ row }) => <span className="tabular text-[13px] text-foreground">{row.original.cores}</span>,
      },
      {
        accessorKey: "memoryGb",
        header: ({ column }) => <SortHeader label="Memory" column={column} />,
        cell: ({ row }) => (
          <span className="tabular text-[13px] text-foreground">
            {row.original.memoryGb >= 1024 ? `${row.original.memoryGb / 1024} TB` : `${row.original.memoryGb} GB`}
          </span>
        ),
      },
      {
        accessorKey: "ip",
        header: "Location",
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate text-[12.5px] text-foreground">{row.original.location}</p>
            <p className="truncate font-mono text-[11px] text-subtle-foreground">{row.original.ip}</p>
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "validationCount",
        header: ({ column }) => <SortHeader label="Validations" column={column} />,
        cell: ({ row }) => <span className="tabular text-[13px] text-foreground">{row.original.validationCount}</span>,
      },
      {
        accessorKey: "healthScore",
        header: ({ column }) => <SortHeader label="Health" column={column} />,
        cell: ({ row }) =>
          row.original.status === "retired" ? (
            <span className="text-[12px] text-subtle-foreground">—</span>
          ) : (
            <div className="flex items-center gap-2">
              <Progress value={row.original.healthScore} tone={healthTone(row.original.healthScore)} className="w-16" />
              <span className="tabular text-[12px] text-muted-foreground">{row.original.healthScore}%</span>
            </div>
          ),
      },
      {
        accessorKey: "updatedAt",
        header: ({ column }) => <SortHeader label="Updated" column={column} />,
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-[12px] text-muted-foreground">{relativeTime(row.original.updatedAt)}</span>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _id, value) => {
      const s = row.original;
      const hay = `${s.name} ${s.vendor} ${s.model} ${s.serialNumber} ${s.assetTag} ${s.ip} ${s.cpu} ${s.tags.join(" ")}`.toLowerCase();
      return hay.includes(String(value).toLowerCase());
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const visibleRows = table.getRowModel().rows;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle-foreground" />
          <Input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search servers, serials, tags…"
            className="pl-9"
          />
        </div>
        <Segmented
          options={[
            { value: "all", label: "All" },
            { value: "online", label: "Online" },
            { value: "maintenance", label: "Maintenance" },
            { value: "retired", label: "Retired" },
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
        />
        <span className="ml-auto text-[12px] text-muted-foreground">
          {visibleRows.length} server{visibleRows.length === 1 ? "" : "s"}
        </span>
      </div>

      {visibleRows.length === 0 ? (
        <EmptyState icon={ServerIcon} title="No servers match" description="Try a different search or status filter." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xs">
          <table className="w-full border-collapse">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-border bg-surface-2/60">
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-subtle-foreground"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border">
              {visibleRows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => router.push(`/servers/${row.original.id}`)}
                  className="cursor-pointer transition-colors hover:bg-surface-2"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
