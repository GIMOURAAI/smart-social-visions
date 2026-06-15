import { useRef, useState } from "react";
import {
  Briefcase, Shirt, Zap, Trophy, Heart, Stethoscope,
  Building2, Scale, Sparkles, Upload, Loader2, CheckCircle2, X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
  const [activeTab, setActiveTab] = useState<"presets" | "custom">(
    data.styleAnalysis ? "custom" : "presets"
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReferenceImage = (files: FileList | null) => {
    if (!files || !files[0]) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      onChange({
        styleReferenceImage: base64,
        styleAnalysis: undefined,
        visualStyle: "custom-analyzed",
      });
      setAnalyzeError(null);
    };
    reader.readAsDataURL(files[0]);
  };

  const handleAnalyze = async () => {
    if (!data.styleReferenceImage) return;
    setAnalyzing(true);
    setAnalyzeError(null);
    try {
      const { data: result, error } = await supabase.functions.invoke("copy-style", {
        body: { imageBase64: data.styleReferenceImage, analyzeOnly: true },
      });
      if (error) throw error;
      if (!result?.styleAnalysis) throw new Error("Análise não retornou dados.");
      onChange({
        styleAnalysis: result.styleAnalysis,
        visualStyle: "custom-analyzed",
      });
    } catch (err: any) {
      setAnalyzeError(err?.message ?? "Erro ao analisar a imagem.");
    } finally {
      setAnalyzing(false);
    }
  };

  const clearReference = () => {
    onChange({
      styleReferenceImage: undefined,
      styleAnalysis: undefined,
      visualStyle: "",
    });
    setAnalyzeError(null);
  };

  const hasAnalysis = !!data.styleAnalysis;

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
                onClick={() => onChange({ visualStyle: tema.id, styleAnalysis: undefined, styleReferenceImage: undefined })}
                className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all hover:-translate-y-0.5 ${
                  isSelected
                    ? "border-transparent shadow-glow"
                    : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
                }`}
                style={isSelected ? { background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)" } : {}}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? "bg-white/20" : "bg-muted"}`}>
                  <tema.Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold mb-0.5 truncate ${isSelected ? "text-white" : "text-foreground"}`}>
                    {tema.name}
                  </p>
                  <p className={`text-xs leading-snug truncate ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
                    {tema.desc}
                  </p>
                </div>
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
          {/* Info */}
          <div className="rounded-2xl border border-violet-200 bg-violet-50 dark:border-violet-800/40 dark:bg-violet-950/20 p-4">
            <p className="text-sm font-semibold text-foreground mb-1">Replicar estilo visual de referência</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Envie uma arte como referência. A IA vai escanear a imagem e criar um prompt visual rico em detalhes — paleta, iluminação, tipografia, atmosfera — que será aplicado em todos os posts da sua linha editorial.
            </p>
          </div>

          {/* Upload area */}
          {!data.styleReferenceImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleReferenceImage(e.dataTransfer.files); }}
              className="relative rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all cursor-pointer p-10 text-center"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleReferenceImage(e.target.files)}
              />
              <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-3">
                <Upload className="w-7 h-7 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">Clique ou arraste a imagem aqui</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, WEBP · 1 imagem de referência</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Preview + remove */}
              <div className="relative rounded-2xl overflow-hidden border border-border">
                <img
                  src={data.styleReferenceImage}
                  alt="Referência"
                  className="w-full max-h-56 object-cover"
                />
                <button
                  onClick={clearReference}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition"
                >
                  <X className="w-4 h-4" />
                </button>
                {hasAnalysis && (
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-green-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Estilo analisado
                  </div>
                )}
              </div>

              {/* Analyze button */}
              {!hasAnalysis && (
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold text-white transition-all disabled:opacity-70"
                  style={{ background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)" }}
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analisando estilo com IA...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Analisar estilo com IA
                    </>
                  )}
                </button>
              )}

              {analyzeError && (
                <p className="text-xs text-red-500 text-center">{analyzeError}</p>
              )}

              {/* Analysis result */}
              {hasAnalysis && data.styleAnalysis && (
                <div className="rounded-2xl border border-green-200 bg-green-50 dark:border-green-800/40 dark:bg-green-950/20 p-4 space-y-3">
                  <p className="text-sm font-bold text-foreground">Estilo extraído da imagem</p>

                  {/* Color palette */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5 font-medium">Paleta de cores</p>
                    <div className="flex gap-2 flex-wrap">
                      {data.styleAnalysis.paletaCores.map((hex, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <div
                            className="w-7 h-7 rounded-lg border border-black/10 shadow-sm"
                            style={{ backgroundColor: hex }}
                          />
                          <span className="text-[10px] font-mono text-muted-foreground">{hex}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Atmosphere */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-medium">Atmosfera</p>
                    <p className="text-xs text-foreground leading-relaxed">{data.styleAnalysis.atmosfera}</p>
                  </div>

                  {/* Typography */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-medium">Tipografia</p>
                    <p className="text-xs text-foreground leading-relaxed">{data.styleAnalysis.tipografia}</p>
                  </div>

                  {/* Composition */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-medium">Composição</p>
                    <p className="text-xs text-foreground leading-relaxed">{data.styleAnalysis.composicao}</p>
                  </div>

                  <button
                    onClick={() => { onChange({ styleAnalysis: undefined }); }}
                    className="text-xs text-muted-foreground underline hover:text-foreground transition"
                  >
                    Reanalisar imagem
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
