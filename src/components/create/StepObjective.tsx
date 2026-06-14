import type { WizardData } from "@/pages/Create";

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

const LINGUAGENS = [
  { id: "formal",       label: "Formal",         desc: "Linguagem técnica e séria" },
  { id: "descontraido", label: "Descontraído",    desc: "Leve, próximo e divertido" },
  { id: "inspirador",   label: "Inspirador",      desc: "Motiva e gera emoção" },
  { id: "direto",       label: "Direto ao ponto", desc: "Curto, objetivo e claro" },
];

interface Props {
  data: WizardData;
  onChange: (d: Partial<WizardData>) => void;
}

export function StepObjective({ data, onChange }: Props) {
  return (
    <div className="space-y-7">

      {/* Tom de voz */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-1">Tom de voz</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Como você quer se comunicar com o seu público
        </p>
        <div className="flex flex-wrap gap-2">
          {TONES.map((tone) => {
            const isSelected = data.tone === tone;
            return (
              <button
                key={tone}
                onClick={() => onChange({ tone })}
                className={`rounded-full border-2 px-4 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                  isSelected
                    ? "border-fuchsia-500 bg-fuchsia-500 text-white shadow-glow"
                    : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5"
                }`}
              >
                {tone}
              </button>
            );
          })}
        </div>
      </div>

      {/* Estilo de linguagem */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-1">Estilo de linguagem</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Como o texto deve soar para quem lê
        </p>
        <div className="grid grid-cols-2 gap-3">
          {LINGUAGENS.map(({ id, label, desc }) => {
            const isSelected = (data as any).linguagem === id;
            return (
              <button
                key={id}
                onClick={() => onChange({ ...(data as any), linguagem: id } as any)}
                className={`rounded-2xl border-2 p-4 text-left transition-all hover:-translate-y-0.5 ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-glow"
                    : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
                }`}
              >
                <p className={`text-base font-bold mb-0.5 ${isSelected ? "text-primary" : "text-foreground"}`}>{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
