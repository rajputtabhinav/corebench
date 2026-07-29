import { FileIcon, fileKindLabel } from "@/components/domain/file-icon";
import { formatBytes } from "@/lib/format";
import type { AttachmentKind } from "@/lib/data";

/** Illustrative in-app preview for binary documents (PDF / image) held as seed data. */
export function DocumentPreview({
  name,
  kind,
  size,
  sub,
}: {
  name: string;
  kind: AttachmentKind;
  size: number;
  sub?: string;
}) {
  const isImage = kind === "png" || kind === "jpg";
  return (
    <div className="flex h-full flex-col items-center justify-center overflow-auto rounded-2xl border border-border bg-surface-2 p-8">
      {isImage ? (
        <div className="aspect-video w-full max-w-md rounded-xl bg-gradient-to-br from-accent-100 to-accent-soft" />
      ) : (
        <div className="w-full max-w-md space-y-2.5 rounded-xl bg-white p-7 shadow-md">
          <div className="flex items-center gap-2">
            <FileIcon kind={kind} size="sm" />
            <div className="h-3 w-1/2 rounded bg-neutral-soft" />
          </div>
          <div className="mt-3 h-2.5 w-full rounded bg-neutral-soft" />
          <div className="h-2.5 w-full rounded bg-neutral-soft" />
          <div className="h-2.5 w-5/6 rounded bg-neutral-soft" />
          <div className="h-24 w-full rounded bg-neutral-soft/70" />
          <div className="h-2.5 w-full rounded bg-neutral-soft" />
          <div className="h-2.5 w-4/6 rounded bg-neutral-soft" />
        </div>
      )}
      <p className="mt-5 text-[13px] font-medium text-foreground">{name}</p>
      <p className="text-[12px] text-muted-foreground">
        {fileKindLabel(kind)} · {formatBytes(size)}
        {sub ? ` · ${sub}` : ""}
      </p>
    </div>
  );
}
