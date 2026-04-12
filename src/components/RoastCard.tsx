"use client";

interface RoastResult {
  grade: string;
  roasts: string[];
  savingGrace: string;
  url: string;
}

const RoastCard = ({ roasts, savingGrace, url }: RoastResult) => {
  const hostname = new URL(url).hostname;

  return (
    <div className="w-full rounded-[2.5px] border border-border bg-card shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-b border-border p-6 sm:p-8 bg-muted/10">
        <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-[2.5px] border border-border bg-background shadow-sm overflow-hidden p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={`https://icon.horse/icon/${hostname}`} 
            alt="Favicon" 
            className="w-full h-full object-contain rounded-[2.5px]"
            onError={(e) => { (e.target as HTMLImageElement).src = '/fireicon.png' }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">Roasted Target</p>
          <a href={url} target="_blank" rel="noopener noreferrer" className="truncate text-base sm:text-lg font-medium text-foreground hover:text-primary transition-colors underline underline-offset-4 decoration-border hover:decoration-primary">
            {url}
          </a>
        </div>
      </div>

      {/* Roasts */}
      <div className="flex flex-col p-6 sm:p-8 space-y-6">
        {roasts.map((roast, i) => (
          <div key={i} className="flex gap-4">
            <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed">
              {roast}
            </p>
          </div>
        ))}
      </div>

      {/* Saving Grace */}
      <div className="p-6 sm:p-8 bg-muted/20 border-t border-border flex gap-4">
         <span className="text-foreground font-bold opacity-50 select-none">SG</span>
         <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">Saving Grace</p>
            <p className="text-base font-medium text-foreground">{savingGrace}</p>
         </div>
      </div>
    </div>
  );
};

export default RoastCard;
