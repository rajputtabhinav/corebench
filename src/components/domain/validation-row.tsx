import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { TypeIcon } from "@/components/domain/type-badge";
import { StatusBadge } from "@/components/ui/status";
import { getServer, type Validation } from "@/lib/data";
import { relativeTime } from "@/lib/format";
import { cn } from "@/lib/cn";

export function ValidationRow({
  validation,
  showServer = true,
  className,
}: {
  validation: Validation;
  showServer?: boolean;
  className?: string;
}) {
  const server = getServer(validation.serverId);
  const meta = [
    showServer ? server?.name : null,
    validation.engineer.split(" ")[0],
    relativeTime(validation.date),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/validations/${validation.id}`}
      className={cn(
        "group flex items-center gap-3.5 rounded-xl border border-transparent px-3 py-2.5 transition-colors hover:border-border hover:bg-surface-2",
        className,
      )}
    >
      <TypeIcon type={validation.type} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-medium text-foreground">{validation.title}</p>
        <p className="mt-0.5 truncate text-[12px] text-muted-foreground">{meta}</p>
      </div>
      <StatusBadge status={validation.status} />
      <ChevronRight className="size-4 shrink-0 text-subtle-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}
