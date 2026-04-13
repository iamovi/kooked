import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import RoastCard from "@/components/RoastCard";

export const revalidate = 60; // optionally cache for 60s, or just rely on standard fetch cache

export default async function RoastDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Use anon public client to fetch the historical roast payload.
  // Because 'roast_history' has public read access via RLS, Server Component fetching works securely.
  const { data: roast, error } = await supabase
    .from("roast_history")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !roast) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12 flex flex-col items-center">
      <div className="w-full max-w-3xl mb-8 flex justify-start">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 font-medium text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Back
        </Link>
      </div>

      <div className="w-full max-w-3xl">
        <RoastCard 
          url={roast.url}
          grade={roast.grade}
          roasts={(roast.full_roasts as string[]) || [roast.roast_preview]}
          savingGrace={roast.saving_grace || "None. Truly hopeless."}
          roastId={roast.id}
        />
      </div>
    </div>
  );
}
