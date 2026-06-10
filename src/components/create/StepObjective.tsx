import type { WizardData } from "@/pages/Create";

const OBJECTIVES = [
  "Vender",
  "Educar",
  "Engajar",
  "Gerar autoridade",
  "Divulgar oferta",
  "Atrair seguidores",
  "Gerar conexão",
  "Apresentar produto",
  "Quebrar objeção",
  "Despertar desejo",
];

const TONES = [
  "Profissional",
  "Criativo",
  "Emocional",
  "Persuasivo",
  "Direto",
  "Elegante",
  "Provocativo",
  "Educativo",
];

interface Props {
  data: WizardData;
  onChange: (d: Partial<WizardData>) => void;
}

export function StepObjective({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">
          Qual o objetivo do post?
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          O que você quer que o público faça ou sinta
        </p>
        <div className="flex flex-wrap gap-2">
          {OBJECTIVES.map((obj) => {
            const isSelected = data.objective === obj;
            return (
              <button
                key={obj}
                onClick={() => onChange({ objective: obj })}
                className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                  isSelected
                    ? "border-primary bg-primary text-white shadow-glow"
                    : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5"
                }`}
              >
                {obj}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">
          Tom de voz
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Como você quer se comunicar com o seu público
        </p>
        <div className="flex flex-wrap gap-2">
          {TONES.map((tone) => {
            const isSelected = data.tone === tone;
            return (
              <button
                key={tone}
                onClick={() => onChange({ tone })}
                className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                  isSelected
                    ? "border-primary bg-primary text-white shadow-glow"
                    : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5"
                }`}
              >
                {tone}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
