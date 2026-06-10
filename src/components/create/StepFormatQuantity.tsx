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

interface Props {
  data: WizardData;
  onChange: (d: Partial<WizardData>) => void;
}

export function StepFormatQuantity({ data, onChange }: Props) {
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

      {/* Quantity */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Quantos posts gerar?</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Geração em blocos PostLab: Dor → Autoridade → Valor → Venda (3 posts por bloco)
        </p>
        <div className="grid grid-cols-2 gap-3">
          {QUANTITIES.map((q) => {
            const isSelected = data.quantity === q.value;
            return (
              <button
                key={q.value}
                onClick={() => onChange({ quantity: q.value, imageQuantity: q.value })}
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
                <p className="text-[10px] text-primary/70 font-semibold mt-1.5">
                  {q.value} crédito{q.value !== 1 ? "s" : ""}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Credit info */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
        <div className="flex items-start gap-3">
          <span className="text-lg mt-0.5">💳</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground mb-1">
              Esta geração vai descontar <span className="text-amber-600">{data.quantity} crédito{data.quantity !== 1 ? "s" : ""}</span> do seu saldo
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Cada post inclui: copy estratégico, legenda completa, CTA, hashtags, gancho viral, story e imagem gerada com IA — tudo por 1 crédito. Sem saldo, nenhuma geração é realizada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
