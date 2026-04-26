import { WizardData } from "@/pages/Create";
import { Square, Smartphone, Youtube, Camera } from "lucide-react";

interface Props {
  data: WizardData;
  updateData: (d: Partial<WizardData>) => void;
}

const formats = [
  {
    id: "post",
    icon: Square,
    title: "Post Feed",
    desc: "1350 x 1080",
    ratio: "5:4",
  },
  {
    id: "reels",
    icon: Smartphone,
    title: "Reels",
    desc: "1080 x 1920",
    ratio: "9:16",
  },
  {
    id: "story",
    icon: Camera,
    title: "Story",
    desc: "1080 x 1920",
    ratio: "9:16",
  },
  {
    id: "youtube",
    icon: Youtube,
    title: "Capa YouTube",
    desc: "1280 x 720",
    ratio: "16:9",
  },
] as const;

export function StepFormat({ data, updateData }: Props) {
  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto w-full">
      <p className="text-muted-foreground text-center">
        Escolha o formato da arte
      </p>
      <div className="grid grid-cols-2 gap-4">
        {formats.map((f) => {
          const Icon = f.icon;
          const active = data.format === f.id;
          return (
            <button
              key={f.id}
              onClick={() =>
                updateData({ format: f.id as any, formatRatio: f.ratio as any })
              }
              className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                active
                  ? "border-primary bg-accent shadow-md"
                  : "border-border hover:border-primary/50 bg-card"
              }`}
            >
              <Icon
                className={`w-8 h-8 ${active ? "text-primary" : "text-muted-foreground"}`}
              />
              <div className="text-center">
                <p
                  className={`font-semibold ${active ? "text-primary" : "text-foreground"}`}
                >
                  {f.title}
                </p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
