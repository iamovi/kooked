"use client";

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import RoastCard from "@/components/RoastCard";

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
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="flex justify-center mb-6">
          <div className="inline-block bg-lime text-black border-4 border-foreground neo-shadow-lg px-8 py-4 -rotate-2 transform">
            <h1 className="text-center text-5xl md:text-6xl font-black uppercase tracking-tight">
              Kooked
            </h1>
          </div>
        </div>
        <p className="mb-12 text-center font-bold text-lg md:text-xl text-foreground">
          Paste a URL. Get destroyed.
        </p>

        <div className="mb-12 flex flex-col sm:flex-row gap-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRoast()}
            placeholder="https://example.com"
            className="flex-1 rounded-[3px] border-4 border-foreground bg-card px-6 py-4 font-mono text-base text-foreground placeholder:text-muted-foreground neo-shadow focus:outline-none focus:ring-4 focus:ring-hotpink transition-shadow"
          />
          <button
            onClick={handleRoast}
            disabled={loading || !url.trim()}
            className="rounded-[3px] border-4 border-foreground bg-hotpink px-8 py-4 text-base font-black uppercase tracking-wider text-white neo-shadow hover-neo disabled:opacity-50 disabled:pointer-events-none"
          >
            Roast It
          </button>
        </div>

        {loading && (
          <div className="py-16 text-center">
            <p className="animate-pulse-slow font-mono text-lg text-hotpink">
              Summoning the judges...
            </p>
          </div>
        )}

        {error && (
          <div className="border-2 border-destructive p-4">
            <p className="font-mono text-sm text-destructive">{error}</p>
          </div>
        )}

        {result && <RoastCard {...result} />}
      </div>
    </div>
  );
}
