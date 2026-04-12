"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AboutDialog } from "@/components/AboutDialog";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b-4 border-foreground bg-card">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image src="/fireicon.png" alt="Kooked" width={28} height={28} />
          <span className="bg-hotpink text-white border-2 border-foreground rounded-[3px] px-3 py-1 text-lg font-black uppercase tracking-tight neo-shadow-sm group-hover:-translate-y-0.5 transition-transform">
            Kooked
          </span>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <AboutDialog />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
