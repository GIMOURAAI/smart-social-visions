import type { WizardData } from "@/pages/Create";

const NICHES = [
  { id: "estetica", label: "Estética", emoji: "💆‍♀️" },
  { id: "moda", label: "Moda", emoji: "👗" },
  { id: "restaurante", label: "Restaurante", emoji: "🍽️" },
  { id: "loja-online", label: "Loja Online", emoji: "🛍️" },
  { id: "imobiliaria", label: "Imobiliária", emoji: "🏠" },
  { id: "consultoria", label: "Consultoria", emoji: "💼" },
  { id: "infoproduto", label: "Infoproduto", emoji: "📱" },
  { id: "saude", label: "Saúde", emoji: "🏥" },
  { id: "educacao", label: "Educação", emoji: "📚" },
  { id: "beleza", label: "Beleza", emoji: "💄" },
  { id: "servicos-locais", label: "Serviços Locais", emoji: "🔧" },
  { id: "outro", label: "Outro", emoji: "✨" },
];

interface Props {
  data: WizardData;
  onChange: (d: Partial<WizardData>) => void;
}

export function StepBriefing({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">
          Qual é o seu nicho?
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Selecione a categoria que melhor descreve o seu negócio
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {NICHES.map((n) => {
            const isSelected = data.niche === n.id;
            return (
              <button
                key={n.id}
                onClick={() => onChange({ niche: n.id })}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 text-center transition-all hover:-translate-y-0.5 ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-glow"
                    : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
                }`}
              >
                <span className="text-2xl leading-none">{n.emoji}</span>
                <span
                  className={`text-[11px] font-semibold leading-tight ${
                    isSelected ? "text-primary" : "text-foreground"
                  }`}
                >
                  {n.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label
          htmlFor="theme-textarea"
          className="block text-sm font-semibold text-foreground mb-1"
        >
          Sobre o que você quer postar?
        </label>
        <p className="text-xs text-muted-foreground mb-2">
          Descreva o tema, promoção ou assunto do post
        </p>
        <textarea
          id="theme-textarea"
          value={data.theme}
          onChange={(e) => onChange({ theme: e.target.value })}
          placeholder="Ex: Promoção de fim de semana com 30% de desconto em todos os serviços"
          rows={4}
          className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
        />
        <p className="text-[10px] text-muted-foreground mt-1 text-right">
          {data.theme.length}/500
        </p>
      </div>
    </div>
  );
}
