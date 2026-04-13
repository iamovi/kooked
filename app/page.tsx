"use client";

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import RoastCard from "@/components/RoastCard";
import { HistorySidebar } from "@/components/HistorySidebar";
import { RecentRoasts } from "@/components/RecentRoasts";
import { Flame, ArrowLeft } from "lucide-react";


interface RoastData {
  grade: string;
  roasts: string[];
  savingGrace: string;
}

function parseRoast(text: string): RoastData {
  const gradeMatch = text.match(/Grade:\s*([A-Fa-f][+-]?)/i);
  const roast1 = text.match(/Roast 1:\s*(.*?)(?=\s*Roast 2:|$)/is);
  const roast2 = text.match(/Roast 2:\s*(.*?)(?=\s*Roast 3:|$)/is);
  const roast3 = text.match(/Roast 3:\s*(.*?)(?=\s*Saving Grace:|$)/is);
  const saving = text.match(/Saving Grace:\s*(.*)/is);

  return {
    grade: gradeMatch?.[1]?.trim() || "?",
    roasts: [
      roast1?.[1]?.trim() || "No roast found.",
      roast2?.[1]?.trim() || "No roast found.",
      roast3?.[1]?.trim() || "No roast found.",
    ],
    savingGrace: saving?.[1]?.trim() || "None. Truly hopeless.",
  };
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<(RoastData & { url: string }) | null>(null);
  const [roastId, setRoastId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleRoast = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setRoastId(null);

    try {
      // Fetch site content via Jina
      const siteRes = await fetch(`https://r.jina.ai/${url.trim()}`);
      if (!siteRes.ok) throw new Error("Failed to fetch site content");
      const siteContent = (await siteRes.text()).slice(0, 3000);

      // Call edge function
      const { data, error: fnError } = await supabase.functions.invoke("roast", {
        body: { url: url.trim(), siteContent },
      });

      if (fnError) throw new Error(fnError.message);
      const text = data?.choices?.[0]?.message?.content || "";
      const parsed = parseRoast(text);
      setResult({ ...parsed, url: url.trim() });

      // Insert into history and capture the returned id for sharing
      supabase.from("roast_history").insert({
        url: url.trim(),
        grade: parsed.grade,
        roast_preview: parsed.roasts[0] || "Brutal.",
        full_roasts: parsed.roasts,
        saving_grace: parsed.savingGrace,
      }).select("id").single().then(({ data, error }) => {
        if (error) {
          console.error("History logging failed:", error);
        } else if (data) {
          setRoastId(data.id);
        }
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background w-full relative overflow-hidden flex flex-col">
      {/* Comic Book Dot Pattern Background */}
      <div className="absolute inset-0 bg-dots opacity-[0.15] pointer-events-none" />
      
      {/* Subtle background glow for premium depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="mx-auto max-w-[1400px] px-4 py-12 flex relative justify-center lg:justify-between items-start gap-8 z-10 flex-1">
        
        {/* Main Content Area */}
        <div className="mx-auto lg:mx-0 max-w-2xl flex-1 w-full shrink-0">
          {!loading && !result && (
            <div className="flex flex-col items-center lg:items-start mb-12">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground mb-3 uppercase italic">
                Kooked
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground font-bold uppercase tracking-widest">
                Paste a URL. Get destroyed.
              </p>
            </div>
          )}

          <div className="mb-12">
            {!loading && !result && (
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRoast()}
                  placeholder="https://example.com"
                  className="flex-1 rounded-[2.5px] border-2 border-foreground bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground shadow-comic focus:outline-none transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-sans"
                />
                <button
                  onClick={handleRoast}
                  disabled={loading || !url.trim()}
                  className="rounded-[2.5px] border-2 border-primary bg-primary px-6 py-3 text-sm font-black uppercase text-primary-foreground shadow-comic-primary hover:bg-primary/95 disabled:opacity-50 disabled:pointer-events-none transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  Roast It
                </button>
              </div>
            )}
            {!loading && !result && <RecentRoasts />}
          </div>

        {loading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-10 animate-in fade-in zoom-in duration-500">
            <div className="relative flex items-end justify-center h-24 w-40">
              {/* Flame Group */}
              <Flame className="h-16 w-16 text-primary animate-comic-flicker delay-75 absolute -translate-x-12" strokeWidth={3} />
              <Flame className="h-24 w-24 text-primary animate-comic-flicker relative z-10" strokeWidth={3} />
              <Flame className="h-16 w-16 text-primary animate-comic-flicker delay-150 absolute translate-x-12" strokeWidth={3} />
              
              {/* Ground Shadow */}
              <div className="absolute -bottom-4 w-32 h-2 bg-foreground/10 rounded-full blur-md animate-pulse" />
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="px-6 py-2 bg-foreground text-background rounded-full border-2 border-foreground shadow-[4px_4px_0px_#000] rotate-2 relative">
                <span className="text-xl font-black uppercase tracking-widest italic animate-pulse">
                  Cooking...
                </span>
                {/* Speech bubble pointer */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-foreground rotate-45" />
              </div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-4">
                Assembling the insults
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="border-2 border-destructive p-4">
            <p className="font-mono text-sm text-destructive">{error}</p>
          </div>
        )}

        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
              onClick={() => {
                setResult(null);
                setRoastId(null);
                setError("");
              }}
              className="mb-8 inline-flex items-center gap-2 rounded-[2.5px] border-2 border-foreground bg-card px-4 py-2 text-sm font-black uppercase tracking-widest text-foreground shadow-comic hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={3} />
              Roast Another
            </button>
            <RoastCard {...result} roastId={roastId} />
          </div>
        )}
        </div>

        {/* Desktop Sidebar */}
        {!loading && !result && <HistorySidebar />}

      </div>
    </div>
  );
}
