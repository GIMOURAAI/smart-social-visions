import type { WizardData } from "@/pages/Create";

const FORMATS: {
  value: WizardData["format"];
  label: string;
  sublabel: string;
  widthClass: string;
  heightClass: string;
}[] = [
  { value: "4:5", label: "Feed Vertical", sublabel: "4:5", widthClass: "w-8", heightClass: "h-10" },
  { value: "1:1", label: "Quadrado", sublabel: "1:1", widthClass: "w-10", heightClass: "h-10" },
  { value: "9:16", label: "Story / Reels", sublabel: "9:16", widthClass: "w-6", heightClass: "h-10" },
  { value: "16:9", label: "YouTube", sublabel: "16:9", widthClass: "w-12", heightClass: "h-7" },
];

const QUANTITIES = [
  { value: 3, label: "3 posts", sublabel: "1 bloco estratégico", badge: null },
  { value: 6, label: "6 posts", sublabel: "2 blocos (Dor + Autoridade)", badge: null },
  { value: 9, label: "9 posts", sublabel: "3 blocos completos", badge: "Popular" },
  { value: 12, label: "12 posts", sublabel: "Mês completo — 4 blocos PostLab", badge: "Completo" },
];

const IMAGE_OPTIONS = [
  { value: 0, label: "Sem imagens", sublabel: "Só copy e texto", icon: "✏️" },
  { value: 1, label: "1 imagem", sublabel: "Para o post de destaque", icon: "🖼️" },
  { value: 3, label: "3 imagens", sublabel: "Um por bloco gerado", icon: "🎨" },
];

interface Props {
  data: WizardData;
  onChange: (d: Partial<WizardData>) => void;
}

export function StepFormatQuantity({ data, onChange }: Props) {
  const imageQuantity = data.imageQuantity ?? 0;

  // Credit cost calculation
  const textCredits = data.quantity;
  const imageCredits = imageQuantity;
  const totalCredits = textCredits + imageCredits;

  return (
    <div className="space-y-8">
      {/* Format */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Formato do post</h3>
        <p className="text-xs text-muted-foreground mb-3">Proporção ideal para o seu canal</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {FORMATS.map((fmt) => {
            const isSelected = data.format === fmt.value;
            return (
              <button
                key={fmt.value}
                onClick={() => onChange({ format: fmt.value })}
                className={`rounded-2xl border-2 p-4 flex flex-col items-center gap-3 transition-all hover:-translate-y-0.5 ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-glow"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-center h-12">
                  <div
                    className={`${fmt.widthClass} ${fmt.heightClass} rounded border-2 transition-all ${
                      isSelected ? "border-primary bg-primary/20" : "border-muted-foreground/40 bg-muted"
                    }`}
                  />
                </div>
                <div className="text-center">
                  <p className={`text-xs font-bold leading-tight ${isSelected ? "text-primary" : "text-foreground"}`}>
                    {fmt.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{fmt.sublabel}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity — PostLab blocks */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Quantos posts gerar?</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Posts organizados em blocos PostLab: Dor → Autoridade → Valor → Venda
        </p>
        <div className="grid grid-cols-2 gap-3">
          {QUANTITIES.map((q) => {
            const isSelected = data.quantity === q.value;
            return (
              <button
                key={q.value}
                onClick={() => onChange({ quantity: q.value })}
                className={`rounded-2xl border-2 p-4 text-left transition-all hover:-translate-y-0.5 relative ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-glow"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                {q.badge && (
                  <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/15 text-primary">
                    {q.badge}
                  </span>
                )}
                <p className={`text-base font-bold mb-0.5 ${isSelected ? "text-primary" : "text-foreground"}`}>
                  {q.label}
                </p>
                <p className="text-[11px] text-muted-foreground leading-tight">{q.sublabel}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Image quantity */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Gerar imagens com IA?</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Cada imagem gasta 1 crédito adicional e leva ~30s para gerar
        </p>
        <div className="grid grid-cols-3 gap-3">
          {IMAGE_OPTIONS.map((opt) => {
            const isSelected = imageQuantity === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onChange({ imageQuantity: opt.value })}
                className={`rounded-2xl border-2 p-3 text-center transition-all hover:-translate-y-0.5 ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-glow"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="text-xl mb-1">{opt.icon}</div>
                <p className={`text-xs font-bold leading-tight ${isSelected ? "text-primary" : "text-foreground"}`}>
                  {opt.label}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{opt.sublabel}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Credit cost transparency */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
        <div className="flex items-start gap-3">
          <span className="text-lg mt-0.5">💳</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground mb-2">Custo desta geração</p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{data.quantity} posts (copy + texto)</span>
                <span className="font-semibold text-foreground">{textCredits} crédito{textCredits !== 1 ? "s" : ""}</span>
              </div>
              {imageCredits > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{imageCredits} imagem{imageCredits !== 1 ? "ns" : ""} com IA</span>
                  <span className="font-semibold text-foreground">{imageCredits} crédito{imageCredits !== 1 ? "s" : ""}</span>
                </div>
              )}
              <div className="border-t border-amber-500/20 pt-1 flex justify-between text-sm">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-bold text-amber-600">{totalCredits} crédito{totalCredits !== 1 ? "s" : ""}</span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
              Os créditos serão descontados após a confirmação da geração. Imagens geradas ficam salvas por 7 dias.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
