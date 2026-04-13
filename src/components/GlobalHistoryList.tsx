"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";

type HistoryItem = {
  id: string;
  url: string;
  grade: string;
  roast_preview: string;
  full_roasts: string[];
  saving_grace: string;
  created_at: string;
};

const gradeColor = (grade: string) => {
  if (["A", "B"].includes(grade.toUpperCase())) return "bg-lime text-black border-foreground";
  if (["C"].includes(grade.toUpperCase())) return "bg-orange text-black border-foreground";
  return "bg-hotpink text-white border-foreground";
};

export function GlobalHistoryList({ onItemClick }: { onItemClick?: () => void }) {

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();

    const channel = supabase
      .channel(`roast_history_channel_${Date.now()}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "roast_history" },
        (payload) => {
          setHistory((prev) => [payload.new as HistoryItem, ...prev].slice(0, 50));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("roast_history")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setHistory(data as HistoryItem[] || []);
    } catch (err: any) {
      console.warn("Could not fetch history (Did you run the SQL script?):", err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col py-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse flex h-24 w-full border-b border-border bg-transparent opacity-50 px-2 py-4" />
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground border border-dashed border-border rounded-[2.5px] mt-4 bg-muted/20">
        Nobody roasted today.<br/>Be the first to draw blood.
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-sm mx-auto">
      {history.map((item) => (
        <Link 
          key={item.id} 
          href={`/roast/${item.id}`}
          onClick={() => onItemClick?.()}
          className="group block focus:outline-none focus:bg-muted/50 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors px-4 py-5"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="truncate font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
              {new URL(item.url).hostname.replace('www.', '')}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap ml-2 opacity-70 group-hover:opacity-100 transition-opacity">
              {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
            </span>
          </div>

          <div className="flex items-start gap-4 mt-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[2.5px] border border-border bg-background shadow-sm overflow-hidden p-[5px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={`https://icon.horse/icon/${new URL(item.url).hostname}`} 
                alt="Favicon" 
                className="w-full h-full object-contain rounded-[2.5px]"
                onError={(e) => { (e.target as HTMLImageElement).src = '/fireicon.png' }}
              />
            </div>
            <p className="text-sm leading-relaxed line-clamp-2 text-muted-foreground group-hover:text-foreground transition-colors">
              "{item.roast_preview}"
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
