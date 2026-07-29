import { cn } from "@/lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex size-7 items-center justify-center rounded-[9px] bg-gradient-to-br from-accent-500 to-accent-700 shadow-[0_2px_8px_-2px_rgba(42,87,224,0.5)]",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none">
        {/* ascending benchmark bars */}
        <rect x="4" y="13" width="3.4" height="7" rx="1.2" fill="white" fillOpacity="0.65" />
        <rect x="10.3" y="9" width="3.4" height="11" rx="1.2" fill="white" fillOpacity="0.85" />
        <rect x="16.6" y="5" width="3.4" height="15" rx="1.2" fill="white" />
      </svg>
    </span>
  );
}

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            CoreBench
          </span>
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-subtle-foreground">
            Validation Workspace
          </span>
        </span>
      )}
    </span>
  );
}
