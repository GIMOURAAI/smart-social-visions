import { useRef, useState } from "react";
import {
  Briefcase, Shirt, Zap, Trophy, Heart, Stethoscope,
  Building2, Scale, Sparkles,
} from "lucide-react";
import type { WizardData } from "@/pages/Create";

const TEMAS = [
  {
    id: "tema-01-saas",
    name: "Clean Premium SaaS",
    desc: "Minimalista sofisticado — Tech, SaaS, Empreendedorismo",
    colors: ["#0a0a0a", "#7c3aed", "#d4af37"],
    Icon: Briefcase,
    nichos: "Tech · SaaS · Marketing",
  },
  {
    id: "tema-02-moda",
    name: "High Luxury Editorial",
    desc: "Editorial fashion de alto padrão — Moda, Beleza, Lifestyle",
    colors: ["#fdf4ec", "#c9a84c", "#1a1a2e"],
    Icon: Shirt,
    nichos: "Moda · Beleza · Luxo",
  },
  {
    id: "tema-03-tech",
    name: "Futurista Dark Neon",
    desc: "Cyberpunk energético — Tech, Cripto, IA, Games",
    colors: ["#000000", "#00ff88", "#8b5cf6"],
    Icon: Zap,
    nichos: "Tech · IA · Cripto",
  },
  {
    id: "tema-04-resultado",
    name: "Prova Social & Resultados",
    desc: "Transformação e resultados — Coach, Mentoria, Vendas",
    colors: ["#ffffff", "#2563eb", "#16a34a"],
    Icon: Trophy,
    nichos: "Coach · Mentoria · Vendas",
  },
  {
    id: "tema-05-emocional",
    name: "Dor Emocional & Conexão",
    desc: "Intimidade e acolhimento — Terapia, Coach, Bem-estar",
    colors: ["#fdf6f0", "#e8a87c", "#8b6057"],
    Icon: Heart,
    nichos: "Psicologia · Terapia · Coach",
  },
  {
    id: "tema-06-saude",
    name: "Médico & Saúde",
    desc: "Autoridade clínica confiável — Saúde, Nutrição, Estética",
    colors: ["#ffffff", "#0ea5e9", "#0c4a6e"],
    Icon: Stethoscope,
    nichos: "Médico · Saúde · Nutrição",
  },
  {
    id: "tema-07-imoveis",
    name: "Imobiliária & Corretores",
    desc: "Prestígio e sofisticação — Imóveis, Real Estate",
    colors: ["#1a1a1a", "#c9a84c", "#f5f0e8"],
    Icon: Building2,
    nichos: "Imóveis · Corretor · Construtora",
  },
  {
    id: "tema-08-juridico",
    name: "Advogado & Jurídico",
    desc: "Seriedade e autoridade — Direito, Jurídico, Consultoria",
    colors: ["#0f172a", "#b8860b", "#f8fafc"],
    Icon: Scale,
    nichos: "Direito · Jurídico · Advocacia",
  },
  {
    id: "tema-09-influencer",
    name: "Influenciadora & Personal Brand",
    desc: "Vibrante e magnético — Criadores, Personal Brand",
    colors: ["#ff6b9d", "#c4a7e7", "#f5d020"],
    Icon: Sparkles,
    nichos: "Influencer · Criador · Digital",
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
    onChange({ brandImages: newImages, visualStyle: newImages.length > 0 ? "custom" : data.visualStyle });
  };

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex rounded-2xl bg-muted p-1 gap-1">
        <button
          onClick={() => setActiveTab("presets")}
          className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-all ${
            activeTab === "presets" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          9 TEMAs PostLab
        </button>
        <button
          onClick={() => setActiveTab("custom")}
          className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-all ${
            activeTab === "custom" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Estilo da minha marca
        </button>
      </div>

      {activeTab === "presets" && (
        <div className="grid grid-cols-1 gap-3">
          {TEMAS.map((tema) => {
            const isSelected = data.visualStyle === tema.id;
            return (
              <button
                key={tema.id}
                onClick={() => onChange({ visualStyle: tema.id })}
                className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all hover:-translate-y-0.5 ${
                  isSelected
                    ? "border-transparent shadow-glow"
                    : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
                }`}
                style={isSelected ? { background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)" } : {}}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? "bg-white/20" : "bg-muted"}`}>
                  <tema.Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-muted-foreground"}`} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold mb-0.5 truncate ${isSelected ? "text-white" : "text-foreground"}`}>
                    {tema.name}
                  </p>
                  <p className={`text-xs leading-snug truncate ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
                    {tema.desc}
                  </p>
                </div>

                {/* Color palette — large strips */}
                <div className="flex gap-1 shrink-0">
                  {tema.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-10 rounded-lg shadow-sm border border-white/10"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {activeTab === "custom" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm text-foreground font-semibold mb-1">Copiar estilo visual</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Envie uma arte da sua marca como referência. O SmartPostAI criará posts com estética similar — cores, tipografia e atmosfera — sem copiar o design original.
            </p>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
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
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">Clique ou arraste imagens aqui</p>
            <p className="text-xs text-muted-foreground">Até 3 imagens · PNG, JPG, WEBP</p>
          </div>

          {(data.brandImages ?? []).length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {(data.brandImages ?? []).map((url, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-border">
                  <img src={url} alt={`Referência ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => { e.stopPropagation(); removeImage(i); }}
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
