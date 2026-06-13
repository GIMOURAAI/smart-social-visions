import type { WizardData } from "@/pages/Create";

const FOR_OPTIONS = [
  {
    id: "myself",
    icon: "🙋",
    label: "Para mim",
    desc: "Estou criando conteúdo para o meu próprio negócio",
  },
  {
    id: "client",
    icon: "🤝",
    label: "Para um cliente",
    desc: "Sou social media, agência ou freelancer criando para terceiros",
  },
];

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
  const forClient = data.forClient ?? false;

  return (
    <div className="space-y-6">
      {/* For myself or client */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">
          Você está criando para quem?
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Isso ajuda o SmartPostAI a personalizar melhor o conteúdo
        </p>
        <div className="grid grid-cols-2 gap-3">
          {FOR_OPTIONS.map((opt) => {
            const isSelected = forClient ? opt.id === "client" : opt.id === "myself";
            return (
              <button
                key={opt.id}
                onClick={() => onChange({ forClient: opt.id === "client" })}
                className={`rounded-2xl border-2 p-4 text-left transition-all hover:-translate-y-0.5 ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-glow"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="text-2xl mb-2">{opt.icon}</div>
                <p className={`text-sm font-bold mb-1 ${isSelected ? "text-primary" : "text-foreground"}`}>
                  {opt.label}
                </p>
                <p className="text-[11px] text-muted-foreground leading-snug">{opt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand name — label muda conforme seleção */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1">
          {forClient ? "Nome do negócio do cliente" : "Nome da sua marca ou negócio"}
        </label>
        <p className="text-xs text-muted-foreground mb-2">
          {forClient
            ? "Aparece nas legendas e CTAs — personalize para o cliente"
            : "Aparece nas legendas, CTAs e títulos gerados"}
        </p>
        <input
          type="text"
          value={data.brandName ?? ""}
          onChange={(e) => onChange({ brandName: e.target.value })}
          placeholder={
            forClient
              ? "Ex: Clínica do Dr. João, Boutique Ana Lima..."
              : "Ex: Studio Bella, Clínica Saúde Plena, Dr. Rafael..."
          }
          className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
        />
      </div>

      {/* Niche */}
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
                <span className={`text-[11px] font-semibold leading-tight ${isSelected ? "text-primary" : "text-foreground"}`}>
                  {n.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1">
          Sobre o que você quer postar?
        </label>
        <p className="text-xs text-muted-foreground mb-2">
          Descreva o tema, promoção, serviço ou assunto principal
        </p>
        <textarea
          value={data.theme}
          onChange={(e) => onChange({ theme: e.target.value })}
          placeholder="Ex: Promoção de fim de semana com 30% de desconto em todos os serviços. Quero atrair clientes novos e mostrar resultados reais."
          rows={4}
          className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
        />
        <p className="text-[10px] text-muted-foreground mt-1 text-right">
          {data.theme.length} caracteres
        </p>
      </div>
    </div>
  );
}
