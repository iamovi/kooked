import { Flame } from "lucide-react";
import { GlobalHistoryList } from "./GlobalHistoryList";

export function HistorySidebar() {
  return (
    <div className="hidden lg:flex w-[350px] flex-col h-[calc(100vh-140px)] sticky top-24 ml-8 border-2 border-foreground rounded-[2.5px] bg-card overflow-hidden shadow-comic">
      <div className="px-5 py-4 border-b-2 border-foreground bg-primary">
        <h2 className="font-black uppercase tracking-widest text-primary-foreground flex items-center gap-2 italic">
          <Flame className="h-4 w-4 text-primary-foreground opacity-90" strokeWidth={3} />
          Recently Roasted
        </h2>
      </div>
      <div className="p-4 overflow-y-auto custom-scrollbar flex-1 bg-dots opacity-100">
        <GlobalHistoryList />
      </div>
    </div>
  );
}
