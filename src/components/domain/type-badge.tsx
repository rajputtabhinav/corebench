import {
  Boxes,
  CircuitBoard,
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  Thermometer,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { ValidationType } from "@/lib/data";

interface TypeMeta {
  icon: LucideIcon;
  className: string;
}

export const typeMeta: Record<ValidationType, TypeMeta> = {
  Memory: { icon: MemoryStick, className: "bg-accent-soft text-accent" },
  Storage: { icon: HardDrive, className: "bg-info-soft text-info" },
  Network: { icon: Network, className: "bg-success-soft text-success" },
  CPU: { icon: Cpu, className: "bg-[#f3ebff] text-[#7a45c9]" },
  Power: { icon: Zap, className: "bg-warning-soft text-warning" },
  Thermal: { icon: Thermometer, className: "bg-danger-soft text-danger" },
  Firmware: { icon: CircuitBoard, className: "bg-neutral-soft text-muted-foreground" },
  Custom: { icon: Boxes, className: "bg-neutral-soft text-muted-foreground" },
};

const sizes = {
  sm: "size-8 rounded-lg [&_svg]:size-4",
  md: "size-9 rounded-[10px] [&_svg]:size-[18px]",
  lg: "size-11 rounded-xl [&_svg]:size-5",
};

export function TypeIcon({
  type,
  size = "md",
  className,
}: {
  type: ValidationType;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const { icon: Icon, className: tone } = typeMeta[type];
  return (
    <span className={cn("inline-flex items-center justify-center", sizes[size], tone, className)}>
      <Icon />
    </span>
  );
}
