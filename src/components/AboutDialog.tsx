"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Info } from "lucide-react";

export function AboutDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className="p-2 rounded-[3px] border-2 border-foreground bg-card text-foreground neo-shadow-sm hover-neo flex items-center justify-center h-10 w-10"
          aria-label="About this app"
        >
          <Info className="h-5 w-5" strokeWidth={2.5} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-foreground/40 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-[3px] border-4 border-foreground bg-card p-8 neo-shadow-lg focus:outline-none">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <Dialog.Title className="text-2xl font-black uppercase tracking-tight text-foreground">
              About Kooked
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="p-1 rounded-[3px] border-2 border-foreground bg-card text-foreground hover-neo neo-shadow-sm flex items-center justify-center h-8 w-8 shrink-0"
                aria-label="Close"
              >
                <X className="h-4 w-4" strokeWidth={3} />
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Description asChild>
            <div className="space-y-4 text-foreground">
              <p className="text-base leading-relaxed">
                <span className="font-black text-hotpink">Kooked</span> is an AI-powered website roaster that mercilessly judges any website you throw at it. Paste a URL, and our AI critic will tear it apart with savage dark humor, brutal honesty, and zero chill.
              </p>

              <div className="rounded-[3px] border-2 border-foreground bg-cyan/10 p-4">
                <p className="font-bold text-sm uppercase tracking-wider text-cyan mb-2">How it works</p>
                <ol className="list-decimal list-inside space-y-1 text-sm font-mono">
                  <li>You paste a website URL</li>
                  <li>We scrape the site content</li>
                  <li>Our AI roasts it with zero mercy</li>
                  <li>You get a grade + savage commentary</li>
                </ol>
              </div>



              <p className="text-xs text-muted-foreground font-mono pt-2">
                Built for fun. Don&apos;t take it personally. Or do. We don&apos;t care. 🔥
              </p>
            </div>
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
