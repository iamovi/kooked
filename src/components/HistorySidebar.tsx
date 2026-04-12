import { GlobalHistoryList } from "./GlobalHistoryList";

export function HistorySidebar() {
  return (
    <div className="hidden lg:flex w-[350px] flex-col h-[calc(100vh-140px)] sticky top-24 ml-8 border border-border rounded-[2.5px] bg-card overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-border bg-muted/30">
        <h2 className="font-semibold tracking-tight text-foreground flex items-center gap-2">
          Websites Roasted Last 24hr
        </h2>
      </div>
      <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
        <GlobalHistoryList />
      </div>
    </div>
  );
}
