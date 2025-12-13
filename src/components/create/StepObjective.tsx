import { WizardData } from "@/pages/Create";
import { Instagram, Film, Youtube, LayoutGrid } from "lucide-react";

interface StepObjectiveProps {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
}

const objectives = [
  { id: "instagram", label: "Post Instagram", icon: Instagram, format: "1:1" },
  { id: "stories", label: "Stories/Reels", icon: Film, format: "9:16" },
  { id: "reels", label: "Carrossel", icon: LayoutGrid, format: "1:1" },
  { id: "youtube", label: "YouTube Thumbnail", icon: Youtube, format: "16:9" },
] as const;

export function StepObjective({ data, updateData }: StepObjectiveProps) {
  return (
    <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
      {objectives.map((obj) => (
        <button
          key={obj.id}
          onClick={() => updateData({ objective: obj.id })}
          className={`p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${
            data.objective === obj.id
              ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
              : "border-border hover:border-primary/50 bg-card"
          }`}
        >
          <obj.icon className={`w-10 h-10 ${data.objective === obj.id ? "text-primary" : "text-muted-foreground"}`} />
          <span className={`font-medium ${data.objective === obj.id ? "text-primary" : "text-foreground"}`}>
            {obj.label}
          </span>
          <span className="text-xs text-muted-foreground">{obj.format}</span>
        </button>
      ))}
    </div>
  );
}
