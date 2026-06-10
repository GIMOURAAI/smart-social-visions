import type { WizardData } from "@/pages/Create";

const FEED_PATTERNS = [
  {
    id: "xadrez",
    name: "Xadrez (claro/escuro)",
    desc: "Alterna fundo claro e escuro — feed mais dinâmico e profissional",
    preview: ["#1a1a2e", "#f8f8f8", "#1a1a2e", "#f8f8f8", "#1a1a2e", "#f8f8f8"],
    icon: "♟️",
  },
  {
    id: "escuro",
    name: "Só fundo escuro",
    desc: "Todos os posts com fundo escuro — visual premium e consistente",
    preview: ["#0a0a0a", "#1a1a2e", "#0d0d1a", "#0a0a0a", "#1a1a2e", "#0d0d1a"],
    icon: "🌑",
  },
  {
    id: "claro",
    name: "Só fundo claro",
    desc: "Todos os posts com fundo claro — leve, clean e acessível",
    preview: ["#ffffff", "#f5f5f5", "#fafafa", "#ffffff", "#f5f5f5", "#fafafa"],
    icon: "☀️",
  },
  {
    id: "colorido",
    name: "Fundo colorido da marca",
    desc: "Usa a paleta principal do seu nicho em todos os posts",
    preview: ["#7c3aed", "#a855f7", "#7c3aed", "#a855f7", "#7c3aed", "#a855f7"],
    icon: "🎨",
  },
  {
    id: "gradiente",
    name: "Gradiente consistente",
    desc: "Todos os posts com gradiente suave — identidade forte",
    preview: ["#1a1a2e", "#16213e", "#0f3460", "#533483", "#1a1a2e", "#16213e"],
    icon: "🌈",
  },
  {
    id: "tematico",
    name: "Temático por bloco",
    desc: "Cada bloco PostLab tem cor diferente — Dor, Autoridade, Valor, Venda",
    preview: ["#dc2626", "#dc2626", "#2563eb", "#2563eb", "#16a34a", "#16a34a"],
    icon: "🎯",
  },
];

interface Props {
  data: WizardData;
  onChange: (d: Partial<WizardData>) => void;
}

export function StepFeedPattern({ data, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">
          Padrão de cores do feed
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Como você quer que o seu perfil fique visualmente quando alguém entrar na sua página
        </p>

        <div className="grid grid-cols-1 gap-3">
          {FEED_PATTERNS.map((pattern) => {
            const isSelected = data.feedPattern === pattern.id;
            return (
              <button
                key={pattern.id}
                onClick={() => onChange({ feedPattern: pattern.id })}
                className={`rounded-2xl border-2 p-3.5 text-left transition-all hover:-translate-y-0.5 ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-glow"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Mini feed preview */}
                  <div className="shrink-0 grid grid-cols-3 gap-0.5 w-16">
                    {pattern.preview.map((color, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-base">{pattern.icon}</span>
                      <p className={`text-xs font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>
                        {pattern.name}
                      </p>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      {pattern.desc}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Info */}
      <div className="rounded-2xl bg-muted/50 p-3.5">
        <p className="text-xs text-muted-foreground leading-relaxed">
          💡 O padrão escolhido será aplicado nos prompts visuais de cada post para garantir consistência no feed do Instagram.
        </p>
      </div>
    </div>
  );
}
