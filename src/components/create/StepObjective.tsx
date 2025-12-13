import { WizardData } from "@/pages/Create";
import { Instagram, Film, Youtube, LayoutGrid, Square, RectangleVertical, RectangleHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface StepObjectiveProps {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
}

const platforms = [
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "stories", label: "Stories/Reels", icon: Film },
  { id: "reels", label: "Carrossel", icon: LayoutGrid },
  { id: "youtube", label: "YouTube", icon: Youtube },
] as const;

const formats = [
  { id: "1:1", label: "Quadrado", icon: Square, description: "1:1 - Feed padrão" },
  { id: "4:5", label: "Retrato", icon: RectangleVertical, description: "4:5 - Feed vertical" },
  { id: "9:16", label: "Stories", icon: RectangleVertical, description: "9:16 - Stories/Reels" },
  { id: "16:9", label: "Paisagem", icon: RectangleHorizontal, description: "16:9 - YouTube/Horizontal" },
] as const;

export function StepObjective({ data, updateData }: StepObjectiveProps) {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Platform Selection */}
      <div>
        <Label className="text-lg font-semibold mb-4 block text-foreground">Plataforma</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => updateData({ objective: platform.id })}
              className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                data.objective === platform.id
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                  : "border-border hover:border-primary/50 bg-card"
              }`}
            >
              <platform.icon className={`w-8 h-8 ${data.objective === platform.id ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-sm font-medium ${data.objective === platform.id ? "text-primary" : "text-foreground"}`}>
                {platform.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Format Selection */}
      <div>
        <Label className="text-lg font-semibold mb-4 block text-foreground">Formato do Post</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {formats.map((format) => (
            <button
              key={format.id}
              onClick={() => updateData({ selectedFormat: format.id })}
              className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                data.selectedFormat === format.id
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                  : "border-border hover:border-primary/50 bg-card"
              }`}
            >
              <format.icon className={`w-6 h-6 ${data.selectedFormat === format.id ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-sm font-medium ${data.selectedFormat === format.id ? "text-primary" : "text-foreground"}`}>
                {format.label}
              </span>
              <span className="text-xs text-muted-foreground">{format.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Manual Title/Subtitle Input */}
      <div className="space-y-4 p-6 rounded-xl border border-border bg-card/50">
        <Label className="text-lg font-semibold block text-foreground">
          Texto Manual (opcional)
        </Label>
        <p className="text-sm text-muted-foreground mb-4">
          Adicione seus próprios títulos e subtítulos, ou deixe em branco para a IA sugerir
        </p>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="manualTitle" className="text-sm font-medium text-foreground">Título</Label>
            <Input
              id="manualTitle"
              placeholder="Digite o título do seu post..."
              value={data.manualTitle || ""}
              onChange={(e) => updateData({ manualTitle: e.target.value })}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="manualSubtitle" className="text-sm font-medium text-foreground">Subtítulo</Label>
            <Input
              id="manualSubtitle"
              placeholder="Digite o subtítulo..."
              value={data.manualSubtitle || ""}
              onChange={(e) => updateData({ manualSubtitle: e.target.value })}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="manualCaption" className="text-sm font-medium text-foreground">Legenda</Label>
            <Textarea
              id="manualCaption"
              placeholder="Digite a legenda do post..."
              value={data.manualCaption || ""}
              onChange={(e) => updateData({ manualCaption: e.target.value })}
              className="mt-1 min-h-[80px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
