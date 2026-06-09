import { useRef, useState } from "react";
import type { WizardData } from "@/pages/Create";

const STYLES = [
  {
    id: "premium-dark",
    name: "Premium Dark",
    desc: "Sofisticado, fundo escuro, contraste alto",
    colors: ["#0a0a0a", "#7c3aed", "#d4af37"],
  },
  {
    id: "futurista-roxo",
    name: "Futurista Roxo",
    desc: "Tecnológico, neon roxo, estética SaaS",
    colors: ["#0d0d1a", "#8b5cf6", "#c4b5fd"],
  },
  {
    id: "feminino-elegante",
    name: "Feminino Elegante",
    desc: "Tons suaves, delicado, acolhedor",
    colors: ["#fdf4f4", "#e8a0a0", "#c97b7b"],
  },
  {
    id: "minimalista-clean",
    name: "Minimalista Clean",
    desc: "Fundo neutro, espaço, objetivo",
    colors: ["#ffffff", "#1a1a1a", "#666666"],
  },
  {
    id: "editorial",
    name: "Editorial Sofisticado",
    desc: "Hierarquia forte, campanha premium",
    colors: ["#1a1a2e", "#e94560", "#ffffff"],
  },
  {
    id: "tech-neon",
    name: "Tech Neon",
    desc: "Futurista, brilho, energia digital",
    colors: ["#000000", "#00ff88", "#00ccff"],
  },
  {
    id: "luxo-moderno",
    name: "Luxo Moderno",
    desc: "Dourado, refinado, exclusivo",
    colors: ["#0f0f0f", "#c9a84c", "#f5f0e8"],
  },
  {
    id: "comercial-clean",
    name: "Comercial Clean",
    desc: "Direto, claro, para vendas",
    colors: ["#ffffff", "#2563eb", "#1e40af"],
  },
];

interface Props {
  data: WizardData;
  onChange: (d: Partial<WizardData>) => void;
}

export function StepVisualStyle({ data, onChange }: Props) {
  const [activeTab, setActiveTab] = useState<"presets" | "custom">("presets");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const current = data.brandImages ?? [];
    const remaining = 3 - current.length;
    const toAdd = Array.from(files).slice(0, remaining);
    const readers = toAdd.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((urls) => {
      const newImages = [...current, ...urls].slice(0, 3);
      onChange({ brandImages: newImages, visualStyle: "custom" });
    });
  };

  const removeImage = (index: number) => {
    const newImages = (data.brandImages ?? []).filter((_, i) => i !== index);
    onChange({
      brandImages: newImages,
      visualStyle: newImages.length > 0 ? "custom" : data.visualStyle,
    });
  };

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex rounded-2xl bg-muted p-1 gap-1">
        <button
          onClick={() => setActiveTab("presets")}
          className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-all ${
            activeTab === "presets"
              ? "bg-white text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Estilos prontos
        </button>
        <button
          onClick={() => setActiveTab("custom")}
          className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-all ${
            activeTab === "custom"
              ? "bg-white text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Estilo da minha marca
        </button>
      </div>

      {activeTab === "presets" && (
        <div className="grid grid-cols-2 gap-3">
          {STYLES.map((style) => {
            const isSelected = data.visualStyle === style.id;
            return (
              <button
                key={style.id}
                onClick={() => onChange({ visualStyle: style.id })}
                className={`rounded-2xl border-2 p-3 text-left transition-all hover:-translate-y-0.5 ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-glow"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="flex gap-1.5 mb-2">
                  {style.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <p
                  className={`text-xs font-bold leading-tight mb-0.5 ${
                    isSelected ? "text-primary" : "text-foreground"
                  }`}
                >
                  {style.name}
                </p>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  {style.desc}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {activeTab === "custom" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-sm text-foreground font-semibold mb-1">
              Arte de referência da sua marca
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Envie uma arte da sua marca e o SmartPostAI cria novos posts
              seguindo a mesma estética visual, sem copiar o design original.
            </p>
          </div>

          {/* Upload area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
            className="relative rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all cursor-pointer p-8 text-center"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">
              Clique ou arraste imagens aqui
            </p>
            <p className="text-xs text-muted-foreground">
              Até 3 imagens · PNG, JPG, WEBP
            </p>
          </div>

          {/* Previews */}
          {(data.brandImages ?? []).length > 0 && (
            <div className="flex gap-3">
              {(data.brandImages ?? []).map((url, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-border">
                  <img
                    src={url}
                    alt={`Referência ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(i);
                    }}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center text-xs hover:bg-black/80 transition"
                  >
                    ×
                  </button>
                </div>
              ))}
              {(data.brandImages ?? []).length < 3 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary/40 hover:text-primary transition"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
