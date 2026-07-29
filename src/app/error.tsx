"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Surface to monitoring in a real deployment.
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-[72vh] place-items-center px-6">
      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-danger">Error</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Something went wrong</h1>
        <p className="mx-auto mt-2 max-w-sm text-[14px] text-muted-foreground">
          An unexpected error occurred while rendering this view.
        </p>
        <Button variant="default" onClick={reset} className="mt-6">
          <RotateCcw className="size-4" /> Try again
        </Button>
      </div>
    </div>
  );
}
