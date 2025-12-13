import { WizardData } from "@/pages/Create";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Palette } from "lucide-react";

interface StepStyleProps {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
}

const colorOptions = [
  { id: "auto", label: "Automático (IA escolhe)" },
  { id: "ocean", label: "Oceano (Azul)" },
  { id: "sunset", label: "Pôr do Sol (Laranja/Rosa)" },
  { id: "forest", label: "Floresta (Verde)" },
  { id: "purple", label: "Noite (Roxo)" },
  { id: "dark", label: "Escuro (Preto)" },
];

const fontOptions = [
  { id: "inter", label: "Inter (Moderna)" },
  { id: "serif", label: "Serif (Clássica)" },
  { id: "mono", label: "Mono (Técnica)" },
];

export function StepStyle({ data, updateData }: StepStyleProps) {
  return (
    <div className="flex flex-col gap-8 max-w-lg mx-auto">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          <Label className="text-lg font-semibold">Preferência de cores</Label>
        </div>
        <Select value={data.colorPreference} onValueChange={(value) => updateData({ colorPreference: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {colorOptions.map((opt) => (
              <SelectItem key={opt.id} value={opt.id}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-primary font-bold text-lg">Aa</span>
          <Label className="text-lg font-semibold">Preferência de fonte</Label>
        </div>
        <Select value={data.fontPreference} onValueChange={(value) => updateData({ fontPreference: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fontOptions.map((opt) => (
              <SelectItem key={opt.id} value={opt.id}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="border-t border-border pt-6">
        <button
          onClick={() => updateData({ cloneMode: !data.cloneMode })}
          className={`w-full p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${
            data.cloneMode
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50 bg-card"
          }`}
        >
          <Copy className={`w-6 h-6 ${data.cloneMode ? "text-primary" : "text-muted-foreground"}`} />
          <div className="text-left flex-1">
            <p className={`font-semibold ${data.cloneMode ? "text-primary" : "text-foreground"}`}>
              Clonar modelo existente
            </p>
            <p className="text-xs text-muted-foreground">
              Envie uma imagem para a IA replicar o estilo
            </p>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            data.cloneMode ? "border-primary bg-primary" : "border-muted"
          }`}>
            {data.cloneMode && <div className="w-3 h-3 bg-primary-foreground rounded-full" />}
          </div>
        </button>
      </div>
    </div>
  );
}
