import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="grid min-h-[72vh] place-items-center px-6">
      <div className="text-center">
        <LogoMark className="mx-auto mb-5" />
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle-foreground">404</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Page not found</h1>
        <p className="mx-auto mt-2 max-w-sm text-[14px] text-muted-foreground">
          That server, validation or page doesn&apos;t exist — it may have been moved or retired.
        </p>
        <Button variant="accent" asChild className="mt-6">
          <Link href="/">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
