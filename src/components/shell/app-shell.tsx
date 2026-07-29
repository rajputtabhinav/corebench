"use client";

import { useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/cn";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/shell/sidebar";
import { Topbar } from "@/components/shell/topbar";
import { CommandMenu } from "@/components/shell/command-menu";
import {
  RightPanelOutlet,
  RightPanelProvider,
  useRightPanelControls,
} from "@/components/shell/right-panel";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={300}>
      <RightPanelProvider>
        <ShellInner>{children}</ShellInner>
        <CommandMenu />
      </RightPanelProvider>
    </TooltipProvider>
  );
}

function ShellInner({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open } = useRightPanelControls();

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-[248px] shrink-0 border-r border-border lg:block">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="cb-overlay fixed inset-0 z-50 bg-foreground/35 backdrop-blur-[2px] lg:hidden" />
          <Dialog.Content
            className="cb-sheet-left fixed inset-y-0 left-0 z-50 w-[264px] border-r border-border bg-sidebar shadow-lg outline-none lg:hidden"
            aria-label="Navigation"
            aria-describedby={undefined}
          >
            <Dialog.Title className="sr-only">Navigation</Dialog.Title>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <div className="flex min-h-0 flex-1">
          <main className="min-w-0 flex-1 overflow-y-auto bg-grid">{children}</main>
          <aside
            className={cn(
              "hidden shrink-0 bg-surface transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] xl:block",
              open ? "w-[340px] border-l border-border" : "w-0 overflow-hidden",
            )}
          >
            <div className="h-full w-[340px]">{open && <RightPanelOutlet />}</div>
          </aside>
        </div>
      </div>
    </div>
  );
}
