interface RoastResult {
  grade: string;
  roasts: string[];
  savingGrace: string;
  url: string;
}

const gradeColor = (grade: string) => {
  if (["A", "B"].includes(grade.toUpperCase())) return "bg-lime text-black border-foreground";
  if (["C"].includes(grade.toUpperCase())) return "bg-orange text-black border-foreground";
  return "bg-hotpink text-white border-foreground";
};

const RoastCard = ({ grade, roasts, savingGrace, url }: RoastResult) => {
  return (
    <div className="w-full rounded-[3px] border-4 border-foreground bg-card neo-shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 border-b-4 border-foreground p-6 bg-cyan/10">
        <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-[3px] border-4 neo-shadow-sm text-4xl font-black ${gradeColor(grade)} transform -rotate-3`}>
          {grade.toUpperCase()}
        </div>
        <div className="min-w-0 flex-1 ml-2">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Roasted Target</p>
          <p className="truncate font-mono text-base font-bold text-background bg-foreground inline-block px-3 py-1 neo-shadow-sm">{url}</p>
        </div>
      </div>

      {/* Roasts */}
      <div className="flex border-b-4 border-foreground">
        <div className="w-4 shrink-0 bg-hotpink border-r-4 border-foreground" />
        <div className="p-6 space-y-6 bg-card w-full">
          {roasts.map((roast, i) => (
            <p key={i} className="font-mono text-base font-medium text-foreground leading-relaxed">
              {roast}
            </p>
          ))}
        </div>
      </div>

      {/* Saving Grace */}
      <div className="flex bg-lime/10">
        <div className="w-4 shrink-0 bg-lime border-r-4 border-foreground" />
        <div className="p-6 w-full">
          <div className="inline-block bg-lime border-2 border-foreground text-black text-xs font-black uppercase px-3 py-1 mb-3 neo-shadow-sm rounded-[3px]">
            Saving Grace
          </div>
          <p className="font-mono text-base font-medium text-foreground">{savingGrace}</p>
        </div>
      </div>
    </div>
  );
};

export default RoastCard;
