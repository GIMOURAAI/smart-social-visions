import { WizardData } from "@/pages/Create";
import { Sparkles, PenLine } from "lucide-react";

interface StepAIProps {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
}

export function StepAI({ data, updateData }: StepAIProps) {
  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      <p className="text-muted-foreground text-center">
        A IA pode sugerir títulos, subtítulos e legendas baseados no seu tema
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => updateData({ useAI: true })}
          className={`p-8 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-4 ${
            data.useAI
              ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
              : "border-border hover:border-primary/50 bg-card"
          }`}
        >
          <Sparkles className={`w-12 h-12 ${data.useAI ? "text-primary" : "text-muted-foreground"}`} />
          <div className="text-center">
            <p className={`font-semibold ${data.useAI ? "text-primary" : "text-foreground"}`}>
              Usar IA
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Sugestões automáticas de conteúdo
            </p>
          </div>
        </button>
        
        <button
          onClick={() => updateData({ useAI: false })}
          className={`p-8 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-4 ${
            !data.useAI
              ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
              : "border-border hover:border-primary/50 bg-card"
          }`}
        >
          <PenLine className={`w-12 h-12 ${!data.useAI ? "text-primary" : "text-muted-foreground"}`} />
          <div className="text-center">
            <p className={`font-semibold ${!data.useAI ? "text-primary" : "text-foreground"}`}>
              Escrever Manual
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Criar tudo do zero
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
