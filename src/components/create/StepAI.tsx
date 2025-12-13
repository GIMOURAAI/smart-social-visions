import { WizardData } from "@/pages/Create";
import { Sparkles, PenLine } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface StepAIProps {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
}

export function StepAI({ data, updateData }: StepAIProps) {
  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      <p className="text-muted-foreground text-center">
        Escolha como você quer criar o conteúdo dos seus posts
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
              Escreva um prompt e deixe a IA criar
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
              Você edita tudo na etapa final
            </p>
          </div>
        </button>
      </div>

      {data.useAI && (
        <div className="mt-4 space-y-3 animate-fade-in">
          <Label htmlFor="ai-prompt" className="text-foreground font-medium">
            O que você quer que a IA crie?
          </Label>
          <Textarea
            id="ai-prompt"
            placeholder="Ex: Crie posts sobre dicas de skincare para pele oleosa, com títulos chamativos e linguagem jovem..."
            value={data.aiPrompt}
            onChange={(e) => updateData({ aiPrompt: e.target.value })}
            className="min-h-[120px] bg-card border-border text-foreground placeholder:text-muted-foreground resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Descreva o tipo de conteúdo, tom de voz, e qualquer detalhe importante para seus posts
          </p>
        </div>
      )}

      {!data.useAI && (
        <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border animate-fade-in">
          <p className="text-sm text-muted-foreground text-center">
            Você poderá adicionar e editar todo o texto diretamente na etapa de edição final
          </p>
        </div>
      )}
    </div>
  );
}
