"use client";

import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t-2 border-foreground mt-auto bg-card">
      <div className="mx-auto max-w-[1400px] px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black tracking-tight text-foreground uppercase opacity-70">
            Kooked
          </span>
          <span className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider">
            © {new Date().getFullYear()} — Brutality as a Service.
          </span>
        </div>

        <a
          href="https://github.com/iamovi/kooked"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-[2.5px] border-2 border-foreground bg-background px-3 py-1.5 text-xs font-black uppercase tracking-widest text-foreground shadow-[2px_2px_0px_#000] dark:shadow-[2px_2px_0px_#fff] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all group"
        >
          <Github className="h-3.5 w-3.5 group-hover:text-primary transition-colors" />
          Source Code
        </a>
      </div>
    </footer>
  );
}
