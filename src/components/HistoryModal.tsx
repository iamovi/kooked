"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, History } from "lucide-react";
import { GlobalHistoryList } from "./GlobalHistoryList";

export function HistoryModal() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className="relative lg:hidden flex items-center justify-center p-2 h-9 w-9 rounded-[2.5px] border border-border bg-card text-foreground hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Global History"
        >
          <History className="h-[18px] w-[18px]" strokeWidth={2} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden transition-opacity" />
        <Dialog.Content className="fixed lg:hidden left-1/2 top-1/2 z-50 w-[95vw] h-[85vh] max-h-[800px] -translate-x-1/2 -translate-y-1/2 flex flex-col rounded-[2.5px] border border-border bg-card p-4 sm:p-6 shadow-xl focus:outline-none">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 border-b border-border pb-4 shrink-0">
            <Dialog.Title className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              <History className="h-5 w-5 opacity-70" strokeWidth={2} />
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
            <GlobalHistoryList />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
