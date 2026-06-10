import type { WizardData } from "@/pages/Create";

const FORMATS: {
  value: WizardData["format"];
  label: string;
  sublabel: string;
  widthClass: string;
  heightClass: string;
}[] = [
  {
    value: "4:5",
    label: "Feed Vertical",
    sublabel: "4:5",
    widthClass: "w-8",
    heightClass: "h-10",
  },
  {
    value: "1:1",
    label: "Quadrado",
    sublabel: "1:1",
    widthClass: "w-10",
    heightClass: "h-10",
  },
  {
    value: "9:16",
    label: "Story / Reels",
    sublabel: "9:16",
    widthClass: "w-6",
    heightClass: "h-10",
  },
  {
    value: "16:9",
    label: "YouTube",
    sublabel: "16:9",
    widthClass: "w-12",
    heightClass: "h-7",
  },
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
        <h3 className="text-sm font-semibold text-foreground mb-1">
          Formato do post
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Escolha a proporção ideal para o seu canal
        </p>
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
                {/* Aspect ratio visual */}
                <div className="flex items-center justify-center h-12">
                  <div
                    className={`${fmt.widthClass} ${fmt.heightClass} rounded border-2 ${
                      isSelected
                        ? "border-primary bg-primary/20"
                        : "border-muted-foreground/40 bg-muted"
                    } transition-all`}
                  />
                </div>
                <div className="text-center">
                  <p
                    className={`text-xs font-bold leading-tight ${
                      isSelected ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {fmt.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {fmt.sublabel}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">
          Quantos posts você quer gerar?
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Gere um post avulso ou uma semana inteira de conteúdo
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => onChange({ quantity: 1 })}
            className={`rounded-2xl border-2 p-5 text-left transition-all hover:-translate-y-0.5 ${
              data.quantity === 1
                ? "border-primary bg-primary/5 shadow-glow"
                : "border-border bg-card hover:border-primary/40"
            }`}
          >
            <p
              className={`text-base font-bold mb-1 ${
                data.quantity === 1 ? "text-primary" : "text-foreground"
              }`}
            >
              1 post
            </p>
            <p className="text-xs text-muted-foreground">
              Cria um único post otimizado
            </p>
          </button>

          <button
            onClick={() => onChange({ quantity: 7 })}
            className={`rounded-2xl border-2 p-5 text-left transition-all hover:-translate-y-0.5 ${
              data.quantity === 7
                ? "border-primary bg-primary/5 shadow-glow"
                : "border-border bg-card hover:border-primary/40"
            }`}
          >
            <p
              className={`text-base font-bold mb-1 ${
                data.quantity === 7 ? "text-primary" : "text-foreground"
              }`}
            >
              7 posts
            </p>
            <p className="text-xs text-muted-foreground">
              Conteúdo de uma semana completa
            </p>
            {data.quantity === 7 && (
              <p className="text-[10px] text-amber-500 font-semibold mt-2">
                Serão descontados 7 créditos do seu plano
              </p>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
