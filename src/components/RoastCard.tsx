"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Share2, Download, Check } from "lucide-react";

interface RoastResult {
  grade: string;
  roasts: string[];
  savingGrace: string;
  url: string;
  roastId?: string | null;
}

const RoastCard = ({ grade, roasts, savingGrace, url, roastId }: RoastResult) => {
  const hostname = new URL(url).hostname;
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleShare = async () => {
    if (!roastId) return;
    const shareUrl = `https://kooked.vercel.app/roast/${roastId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportImage = async () => {
    if (!cardRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#000000",
      });
      const link = document.createElement("a");
      link.download = `kooked-roast-${hostname}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export image:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Exportable Card */}
      <div
        ref={cardRef}
        className="w-full rounded-[2.5px] border border-border bg-card shadow-sm overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-b border-border p-6 sm:p-8 bg-muted/10">
          <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-[2.5px] border border-border bg-background shadow-sm overflow-hidden p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://icon.horse/icon/${hostname}`}
              alt="Favicon"
              className="w-full h-full object-contain rounded-[2.5px]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/fireicon.png";
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Roasted Target
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-base sm:text-lg font-medium text-foreground hover:text-primary transition-colors underline underline-offset-4 decoration-border hover:decoration-primary"
            >
              {url}
            </a>
          </div>
          {grade && (
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-[2.5px] border-2 border-primary bg-primary/10">
              <span className="text-2xl sm:text-3xl font-extrabold text-primary">
                {grade}
              </span>
            </div>
          )}
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
          <span className="text-foreground font-bold opacity-50 select-none">
            SG
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Saving Grace
            </p>
            <p className="text-base font-medium text-foreground">
              {savingGrace}
            </p>
          </div>
        </div>

        {/* Kooked Branding Footer (visible in export) */}
        <div className="px-6 sm:px-8 py-4 border-t border-border bg-muted/10 flex items-center justify-between">
          <span className="text-sm font-bold text-foreground tracking-tight">
            Kooked
          </span>
          <span className="text-xs text-muted-foreground">
            kooked.vercel.app
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {roastId && (
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-[2.5px] border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm hover:bg-muted/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-500" strokeWidth={2} />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" strokeWidth={2} />
                Share Link
              </>
            )}
          </button>
        )}
        <button
          onClick={handleExportImage}
          disabled={exporting}
          className="inline-flex items-center gap-2 rounded-[2.5px] border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm hover:bg-muted/50 disabled:opacity-50 disabled:pointer-events-none transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <Download className="h-4 w-4" strokeWidth={2} />
          {exporting ? "Exporting..." : "Share as Image"}
        </button>
      </div>
    </div>
  );
};

export default RoastCard;
