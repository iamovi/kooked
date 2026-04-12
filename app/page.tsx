"use client";

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import RoastCard from "@/components/RoastCard";
import { HistorySidebar } from "@/components/HistorySidebar";

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
  const [error, setError] = useState("");

  const handleRoast = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

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

      // Fire and forget global history push
      supabase.from("roast_history").insert({
        url: url.trim(),
        grade: parsed.grade,
        roast_preview: parsed.roasts[0] || "Brutal.",
        full_roasts: parsed.roasts,
        saving_grace: parsed.savingGrace,
      }).then(({ error }) => {
        if (error) console.error("History logging failed:", error);
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="mx-auto max-w-[1400px] px-4 py-12 flex relative justify-center lg:justify-between items-start gap-8">
        
        {/* Main Content Area */}
        <div className="mx-auto lg:mx-0 max-w-2xl flex-1 w-full shrink-0">
          <div className="flex flex-col items-center lg:items-start mb-12">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-3">
              Kooked
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-medium">
              Paste a URL. Get destroyed.
            </p>
          </div>

          <div className="mb-12 flex flex-col sm:flex-row gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRoast()}
              placeholder="https://example.com"
              className="flex-1 rounded-[2.5px] border border-border bg-card px-6 py-4 text-base text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <button
              onClick={handleRoast}
              disabled={loading || !url.trim()}
              className="rounded-[2.5px] border border-transparent bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              Roast It
            </button>
          </div>

        {loading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-xl bg-primary/30 animate-pulse"></div>
              <div className="h-12 w-12 rounded-full border-[3px] border-border border-t-primary animate-spin relative z-10"></div>
            </div>
            <div className="h-6 flex items-center justify-center mt-6">
              <p className="text-lg font-medium text-foreground transition-opacity duration-300">
                Reading your website...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="border-2 border-destructive p-4">
            <p className="font-mono text-sm text-destructive">{error}</p>
          </div>
        )}

        {result && <RoastCard {...result} />}
        </div>

        {/* Desktop Sidebar */}
        <HistorySidebar />

      </div>
    </div>
  );
}
