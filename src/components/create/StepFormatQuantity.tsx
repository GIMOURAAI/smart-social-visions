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

const DAYS_OPTIONS = [
  { days: 7, posts: 7, label: "7 dias", sublabel: "1 semana de conteúdo", badge: null },
  { days: 15, posts: 15, label: "15 dias", sublabel: "2 semanas completas", badge: "Popular" },
  { days: 30, posts: 30, label: "30 dias", sublabel: "1 mês — calendário completo", badge: "Completo" },
];

const PILOT_OPTIONS = [
  {
    value: 1,
    label: "1 post piloto",
    desc: "Gera 1 post + imagem primeiro para você aprovar o estilo antes de continuar",
    icon: "🔍",
  },
  {
    value: 3,
    label: "3 posts piloto",
    desc: "Gera 3 posts + imagens do bloco Dor para validar o estilo e o conteúdo",
    icon: "🎯",
  },
];

interface Props {
  data: WizardData;
  onChange: (d: Partial<WizardData>) => void;
}

export function StepFormatQuantity({ data, onChange }: Props) {
  const selectedDays = data.daysQuantity ?? 7;
  const selectedOption = DAYS_OPTIONS.find((o) => o.days === selectedDays) ?? DAYS_OPTIONS[0];
  const pilotQuantity = data.pilotQuantity ?? 1;

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
                  <div className={`${fmt.widthClass} ${fmt.heightClass} rounded border-2 transition-all ${
                    isSelected ? "border-primary bg-primary/20" : "border-muted-foreground/40 bg-muted"
                  }`} />
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

      {/* Days quantity */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Para quantos dias?</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Gerado em blocos PostLab de 3 posts — Dor → Autoridade → Valor → Venda
        </p>
        <div className="grid grid-cols-3 gap-3">
          {DAYS_OPTIONS.map((opt) => {
            const isSelected = selectedDays === opt.days;
            return (
              <button
                key={opt.days}
                onClick={() => onChange({ daysQuantity: opt.days, quantity: opt.posts })}
                className={`rounded-2xl border-2 p-4 text-left transition-all hover:-translate-y-0.5 relative ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-glow"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                {opt.badge && (
                  <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/15 text-primary">
                    {opt.badge}
                  </span>
                )}
                <p className={`text-base font-bold mb-0.5 ${isSelected ? "text-primary" : "text-foreground"}`}>
                  {opt.label}
                </p>
                <p className="text-[11px] text-muted-foreground leading-tight">{opt.sublabel}</p>
                <p className="text-[10px] text-primary/70 font-semibold mt-1.5">
                  {opt.posts} créditos
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pilot quantity */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Quantos posts gerar primeiro?</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Veja o resultado antes de continuar — mesmos créditos, você aprova o estilo
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PILOT_OPTIONS.map((opt) => {
            const isSelected = pilotQuantity === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onChange({ pilotQuantity: opt.value })}
                className={`rounded-2xl border-2 p-4 text-left transition-all hover:-translate-y-0.5 ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-glow"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="text-xl mb-2">{opt.icon}</div>
                <p className={`text-sm font-bold mb-1 ${isSelected ? "text-primary" : "text-foreground"}`}>
                  {opt.label}
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{opt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Credit summary */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
        <div className="flex items-start gap-3">
          <span className="text-lg mt-0.5">💳</span>
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">
              Total: <span className="text-amber-600">{selectedOption.posts} créditos</span>
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              1 crédito = 1 post completo (copy + legenda + CTA + hashtags + imagem IA). Descontados conforme cada bloco é aprovado e gerado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
