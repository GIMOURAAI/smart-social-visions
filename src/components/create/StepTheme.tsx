import { WizardData } from "@/pages/Create";
import { Input } from "@/components/ui/input";
import { Heart, Cpu, Sparkles, Briefcase, Utensils, Dumbbell } from "lucide-react";

interface StepThemeProps {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
}

const themes = [
  { id: "saude", label: "Saúde", icon: Heart },
  { id: "beleza", label: "Beleza", icon: Sparkles },
  { id: "tecnologia", label: "Tecnologia", icon: Cpu },
  { id: "negocios", label: "Negócios", icon: Briefcase },
  { id: "gastronomia", label: "Gastronomia", icon: Utensils },
  { id: "fitness", label: "Fitness", icon: Dumbbell },
];

export function StepTheme({ data, updateData }: StepThemeProps) {
  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      <div className="grid grid-cols-3 gap-3">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => updateData({ theme: theme.id, customTheme: "" })}
            className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
              data.theme === theme.id
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50 bg-card"
            }`}
          >
            <theme.icon className={`w-6 h-6 ${data.theme === theme.id ? "text-primary" : "text-muted-foreground"}`} />
            <span className={`text-sm font-medium ${data.theme === theme.id ? "text-primary" : "text-foreground"}`}>
              {theme.label}
            </span>
          </button>
        ))}
      </div>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">ou digite seu tema</span>
        </div>
      </div>
      
      <Input
        value={data.customTheme}
        onChange={(e) => updateData({ customTheme: e.target.value, theme: "" })}
        placeholder="Digite um tema personalizado..."
        className="text-center"
      />
    </div>
  );
}
