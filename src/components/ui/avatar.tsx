import { cn } from "@/lib/cn";
import { initials } from "@/lib/format";

const TONES = [
  "bg-[#e8efff] text-[#2a57e0]",
  "bg-[#e9f6ef] text-[#11935a]",
  "bg-[#fbf0df] text-[#a8690a]",
  "bg-[#f3ebff] text-[#7a45c9]",
  "bg-[#ffeef0] text-[#cf3b54]",
  "bg-[#e6f6f7] text-[#0e7a89]",
];

function toneFor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return TONES[h % TONES.length];
}

const sizes = {
  xs: "size-6 text-[10px]",
  sm: "size-7 text-[11px]",
  md: "size-8 text-xs",
  lg: "size-10 text-sm",
};

export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold",
        sizes[size],
        toneFor(name),
        className,
      )}
      title={name}
    >
      {initials(name)}
    </span>
  );
}

export function AvatarGroup({ names, max = 4 }: { names: string[]; max?: number }) {
  const shown = names.slice(0, max);
  const extra = names.length - shown.length;
  return (
    <div className="flex items-center -space-x-2">
      {shown.map((n, i) => (
        <Avatar key={i} name={n} size="sm" className="ring-2 ring-surface" />
      ))}
      {extra > 0 && (
        <span className="inline-flex size-7 items-center justify-center rounded-full bg-neutral-soft text-[11px] font-semibold text-muted-foreground ring-2 ring-surface">
          +{extra}
        </span>
      )}
    </div>
  );
}
