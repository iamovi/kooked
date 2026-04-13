"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AboutDialog } from "@/components/AboutDialog";
import { HistoryModal } from "@/components/HistoryModal";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b-2 border-foreground border-t-0 border-x-0">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image src="/fireicon.png" alt="Kooked" width={28} height={28} className="grayscale group-hover:grayscale-0 transition-all duration-300" />
          <span className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
            Kooked
          </span>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <HistoryModal />
          <AboutDialog />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
