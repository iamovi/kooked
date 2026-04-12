"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Info } from "lucide-react";

export function AboutDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className="relative flex items-center justify-center p-2 h-9 w-9 rounded-[2.5px] border border-border bg-card text-foreground hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="About this app"
        >
          <Info className="h-[18px] w-[18px]" strokeWidth={2} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[2.5px] border border-border bg-card p-6 shadow-xl focus:outline-none">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-semibold tracking-tight text-foreground">
              About Kooked
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

          <Dialog.Description asChild>
            <div className="space-y-6 text-muted-foreground text-sm">
              <p className="leading-relaxed">
                <span className="font-semibold text-foreground">Kooked</span> is an AI-powered website roaster that mercilessly judges any website you throw at it. Paste a URL and our AI critic delivers an extensive, deeply sarcastic, paragraph-long takedown — then gives you a shareable link so you can send it to the person responsible.
              </p>

              <div className="rounded-[2.5px] border border-border bg-muted/30 p-4">
                <p className="font-medium text-xs uppercase tracking-wider text-foreground mb-3">How it works</p>
                <ol className="list-decimal list-inside space-y-2 font-mono text-xs">
                  <li>Paste a website URL and hit Roast It</li>
                  <li>We scrape the site content via Jina Reader</li>
                  <li>The AI roasts it with zero mercy</li>
                  <li>You get three brutal paragraphs + a Saving Grace</li>
                  <li>Share the unique roast link with anyone</li>
                </ol>
              </div>

              <p className="text-xs font-mono text-center pt-2 opacity-70">
                Built for fun. Don&apos;t take it personally. Or do. We don&apos;t care. 🔥
              </p>
            </div>
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
