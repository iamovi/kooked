"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";

type RecentItem = {
  id: string;
  url: string;
};

export function RecentRoasts() {
  const [recent, setRecent] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecent();

    const channel = supabase
      .channel(`recent_roasts_channel_${Date.now()}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "roast_history" },
        (payload) => {
          setRecent((prev) => {
            const newItem = payload.new as RecentItem;
            // Prevent duplicates if the user just generated one
            if (prev.find(item => item.id === newItem.id)) return prev;
            return [newItem, ...prev].slice(0, 5);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRecent = async () => {
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from("roast_history")
        .select("id, url")
        .gte("created_at", twentyFourHoursAgo)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecent(data as RecentItem[] || []);
    } catch (err) {
      console.warn("Could not fetch recent roasts:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || recent.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4 px-1 animate-in fade-in duration-500">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mr-1 opacity-80 italic">
        Recently Roasted
      </span>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        {recent.map((item) => {
          let hostname = "unknown";
          try {
            hostname = new URL(item.url).hostname.replace('www.', '');
          } catch (e) {
            console.error("Invalid URL in history:", item.url);
          }
          
          return (
            <Link
              key={item.id}
              href={`/roast/${item.id}`}
              className="group flex items-center gap-2 transition-all p-1"
            >
              <div className="h-5 w-5 rounded-[2px] border-2 border-foreground bg-background p-[2px] overflow-hidden group-hover:border-primary transition-all shadow-[1.5px_1.5px_0px_#000] dark:shadow-[1.5px_1.5px_0px_#fff]">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img 
                  src={`https://icon.horse/icon/${hostname}`} 
                  alt={hostname} 
                  className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/fireicon.png' }}
                />
              </div>
              <span className="text-[12px] font-black uppercase tracking-tight text-muted-foreground group-hover:text-foreground transition-colors">
                {hostname}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
