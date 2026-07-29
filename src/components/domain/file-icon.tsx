import {
  FileArchive,
  FileText,
  Image as ImageIcon,
  ScrollText,
  Sheet,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { AttachmentKind } from "@/lib/data";

const meta: Record<AttachmentKind, { icon: LucideIcon; className: string }> = {
  pdf: { icon: FileText, className: "bg-danger-soft text-danger" },
  log: { icon: ScrollText, className: "bg-neutral-soft text-muted-foreground" },
  txt: { icon: FileText, className: "bg-neutral-soft text-muted-foreground" },
  csv: { icon: Sheet, className: "bg-success-soft text-success" },
  xlsx: { icon: Sheet, className: "bg-success-soft text-success" },
  png: { icon: ImageIcon, className: "bg-info-soft text-info" },
  jpg: { icon: ImageIcon, className: "bg-info-soft text-info" },
  zip: { icon: FileArchive, className: "bg-warning-soft text-warning" },
};

const sizes = {
  sm: "size-8 rounded-lg [&_svg]:size-4",
  md: "size-9 rounded-[10px] [&_svg]:size-[18px]",
  lg: "size-11 rounded-xl [&_svg]:size-5",
};

export function FileIcon({
  kind,
  size = "md",
  className,
}: {
  kind: AttachmentKind;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const { icon: Icon, className: tone } = meta[kind];
  return (
    <span className={cn("inline-flex items-center justify-center", sizes[size], tone, className)}>
      <Icon />
    </span>
  );
}

export function fileKindLabel(kind: AttachmentKind): string {
  return kind.toUpperCase();
}
