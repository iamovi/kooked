"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Flame } from "lucide-react";
import { GlobalHistoryList } from "./GlobalHistoryList";

export function HistoryModal() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className="relative lg:hidden flex items-center justify-center p-2 h-9 w-9 rounded-[2.5px] border border-border bg-card text-foreground hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Global History"
        >
          <Flame className="h-[18px] w-[18px] text-primary" strokeWidth={2} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden transition-opacity" />
        <Dialog.Content className="fixed lg:hidden inset-0 z-50 w-full h-full flex flex-col bg-card p-5 shadow-xl focus:outline-none">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 border-b border-border pb-4 shrink-0">
            <Dialog.Title className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Flame className="h-5 w-5 text-primary opacity-90" strokeWidth={2} />
              Websites Roasted Last 24hr
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="rounded-[2.5px] p-2 text-muted-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Close"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Description className="sr-only">
            List of recently roasted websites covering the last 24 hours.
          </Dialog.Description>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-1">
            <GlobalHistoryList onItemClick={() => setOpen(false)} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
