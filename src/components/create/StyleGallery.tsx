import { Check } from "lucide-react";

export interface StylePreset {
  id: string;
  label: string;
  desc: string;
  colors: string[];
  icon: string;
}

/**
 * Galeria de estilos premium. Os 9 TEMAs PostLab (mesmos ids reconhecidos pela
 * edge function `generate-post-batch`) + estéticas complementares usadas apenas
 * como direção de arte. Seleção múltipla: até 3 referências que a IA mistura
 * (estética, composição, iluminação, paleta, atmosfera) — nunca copia layout.
 */
export const STYLE_PRESETS: StylePreset[] = [
  { id: "tema-01-saas", label: "Clean Premium", desc: "Minimalismo sofisticado, luz de janela, vidro", colors: ["#0f172a", "#7c3aed", "#e9d5ff"], icon: "💼" },
  { id: "tema-02-moda", label: "Luxo Editorial", desc: "Editorial fashion, dourado, mármore", colors: ["#fdf4ec", "#c9a84c", "#1a1a2e"], icon: "👗" },
  { id: "tema-03-tech", label: "Dark Neon", desc: "Cinematográfico escuro, neon, alto contraste", colors: ["#000000", "#00e5a0", "#8b5cf6"], icon: "⚡" },
  { id: "tema-04-resultado", label: "Prova & Resultado", desc: "Claro, otimista, números em destaque", colors: ["#ffffff", "#2563eb", "#16a34a"], icon: "🏆" },
  { id: "tema-05-emocional", label: "Emocional Warm", desc: "Íntimo, luz dourada, tom nostálgico", colors: ["#fdf6f0", "#e8a87c", "#8b6057"], icon: "💛" },
  { id: "tema-06-saude", label: "Clínico Confiável", desc: "Branco limpo, azul, autoridade técnica", colors: ["#ffffff", "#0ea5e9", "#0c4a6e"], icon: "🩺" },
  { id: "tema-07-imoveis", label: "Prestígio Imóveis", desc: "Arquitetura, ouro, hora dourada", colors: ["#1a1a1a", "#c9a84c", "#f5f0e8"], icon: "🏛️" },
  { id: "tema-08-juridico", label: "Autoridade Séria", desc: "Escuro, madeira, tipografia serifada", colors: ["#0f172a", "#b8860b", "#f8fafc"], icon: "⚖️" },
  { id: "tema-09-influencer", label: "Personal Brand", desc: "Vibrante, movimento, cor saturada", colors: ["#ff6b9d", "#c4a7e7", "#f5d020"], icon: "✨" },
  { id: "estetica-glass", label: "Glassmorphism", desc: "Camadas translúcidas, blur, profundidade", colors: ["#111827", "#38bdf8", "#f1f5f9"], icon: "🧊" },
  { id: "estetica-tipografia", label: "Tipografia Forte", desc: "Headline gigante, poucos elementos", colors: ["#0a0a0a", "#f5f5f5", "#ef4444"], icon: "🔠" },
  { id: "estetica-cinematic", label: "Cinematic Grade", desc: "Teal-orange, grão de filme, drama", colors: ["#0b1a1f", "#e07b39", "#7dd3c0"], icon: "🎬" },
];

interface Props {
  /** ids selecionados (máx. 3) */
  value: string[];
  onChange: (ids: string[]) => void;
  max?: number;
}

export function StyleGallery({ value, onChange, max = 3 }: Props) {
  const toggle = (id: string) => {
    if (value.includes(id)) onChange(value.filter((v) => v !== id));
    else if (value.length < max) onChange([...value, id]);
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {STYLE_PRESETS.map((s) => {
          const active = value.includes(s.id);
          const disabled = !active && value.length >= max;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => toggle(s.id)}
              aria-pressed={active}
              disabled={disabled}
              className={`group relative overflow-hidden rounded-2xl border text-left transition-all ${
                active
                  ? "border-primary shadow-glow ring-1 ring-primary/40"
                  : "border-border hover:border-primary/50 hover:-translate-y-0.5"
              } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <div
                className="h-16 w-full"
                style={{ background: `linear-gradient(135deg, ${s.colors[0]}, ${s.colors[1]} 55%, ${s.colors[2]})` }}
              />
              <div className="p-2.5 bg-card">
                <p className="text-[11px] font-bold text-foreground leading-tight flex items-center gap-1">
                  <span>{s.icon}</span>
                  <span className="truncate">{s.label}</span>
                </p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 line-clamp-2">{s.desc}</p>
              </div>
              {active && (
                <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-muted-foreground mt-2.5">
        {value.length === 0
          ? "Nenhum estilo escolhido — a IA define a direção de arte pelo seu nicho."
          : `${value.length}/${max} estilos no mix — usados como estética, composição, luz, paleta e atmosfera (nunca cópia de layout).`}
      </p>
    </div>
  );
}
