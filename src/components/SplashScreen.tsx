"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export function SplashScreen() {
  const [isExiting, setIsExiting] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Minimum display time of 1.5 seconds
    const timer = setTimeout(() => {
      setIsExiting(true);
      // Wait for exit animation to finish before unmounting
      setTimeout(() => setShouldRender(false), 600);
    }, 1800);
    
    return () => clearTimeout(timer);
  }, []);

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-all duration-500 ease-comic-out ${
        isExiting ? "opacity-0 scale-110 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Background Texture */}
      <div className="absolute inset-0 bg-dots opacity-[0.08] pointer-events-none" />
      
      <div className="relative flex flex-col items-center gap-8">
        {/* Animated Flame Icon */}
        <div className="relative h-28 w-28 sm:h-40 sm:w-40 animate-comic-flicker">
          <Image 
            src="/fireicon.png" 
            alt="Kooked Flame" 
            fill 
            className="object-contain grayscale-0"
            priority
          />
        </div>
        
        {/* Branding */}
        <div className="flex flex-col items-center">
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-foreground uppercase italic mb-3">
                Kooked
            </h1>
            <div className="h-1.5 w-32 bg-primary rounded-[2.5px] border border-foreground shadow-[2px_2px_0px_#000] animate-pulse" />
        </div>

        {/* Loading Message */}
        <div className="mt-4 px-4 py-1.5 border-2 border-foreground bg-card shadow-[3px_3px_0px_#000] -rotate-1">
          <span className="text-xs font-black uppercase tracking-widest text-foreground italic">
            Warming up the grill...
          </span>
        </div>
      </div>
      
      <div className="absolute bottom-12 flex flex-col items-center gap-2">
          <div className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40">
              Hand-Kooked Insults
          </div>
      </div>
    </div>
  );
}
