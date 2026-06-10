import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WizardProgress } from "@/components/create/WizardProgress";
import { StepBriefing } from "@/components/create/StepBriefing";
import { StepObjective } from "@/components/create/StepObjective";
import { StepVisualStyle } from "@/components/create/StepVisualStyle";
import { StepFormatQuantity } from "@/components/create/StepFormatQuantity";
import { StepResult } from "@/components/create/StepResult";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Sparkles, Plus, ChevronRight } from "lucide-react";

export interface GeneratedPost {
  tema: string;
  bloco: string;
  objetivo: string;
  tipoConteudo: string;
  intencaoEmocional: string;
  gancho: string;
  tituloArte: string;
  subtituloArte: string;
  textoArte: string;
  legenda: string;
  cta: string;
  hashtags: string;
  estiloVisual: string;
  promptVisual: string;
  storyComplementar: string;
  imageUrl?: string;
  creditoCusto: number;
}

export interface WizardData {
  niche: string;
  theme: string;
  objective: string;
  tone: string;
  visualStyle: string;
  brandImages: string[];
  format: "4:5" | "1:1" | "9:16" | "16:9";
  quantity: number;
  imageQuantity: number;
  posts: GeneratedPost[];
  currentPostIndex: number;
  currentBlock: number; // 0-3
  allPosts: GeneratedPost[]; // accumulates across blocks
}

const TOTAL_STEPS = 4;
const STEP_TITLES = [
  "Sobre o seu negócio",
  "Objetivo e tom de voz",
  "Estilo visual",
  "Formato e quantidade",
];
const BLOCK_NAMES = ["Dor", "Autoridade", "Valor", "Venda"];
const BLOCK_DESCRIPTIONS = [
  "Posts que ressoam com a dor e frustração do seu avatar",
  "Posts que constroem credibilidade e prova social",
  "Posts que entregam valor real e educam o seguidor",
  "Posts que convertem — oferta, CTA e urgência",
];

export default function Create() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isMonthMode = searchParams.get("mode") === "7days";

  const [wizardData, setWizardData] = useState<WizardData>({
    niche: "",
    theme: "",
    objective: "",
    tone: "",
    visualStyle: "",
    brandImages: [],
    format: "4:5",
    quantity: isMonthMode ? 12 : 3,
    imageQuantity: 0,
    posts: [],
    currentPostIndex: 0,
    currentBlock: 0,
    allPosts: [],
  });

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate("/auth");
    })();
  }, [navigate]);

  const updateWizardData = (d: Partial<WizardData>) =>
    setWizardData((prev) => ({ ...prev, ...d }));

  const canProceed = (): boolean => {
    switch (step) {
      case 1: return wizardData.niche.trim().length > 0 && wizardData.theme.trim().length >= 5;
      case 2: return wizardData.objective.trim().length > 0 && wizardData.tone.trim().length > 0;
      case 3: return wizardData.visualStyle.trim().length > 0 || (wizardData.brandImages ?? []).length > 0;
      case 4: return wizardData.format.length > 0 && wizardData.quantity > 0;
      default: return false;
    }
  };

  const totalBlocks = Math.ceil(wizardData.quantity / 3);

  const generateBlock = async (blockIndex: number) => {
    setLoading(true);
    try {
      const postsInBlock = Math.min(3, wizardData.quantity - blockIndex * 3);
      const imageQtyForBlock = blockIndex === 0 ? wizardData.imageQuantity : 0;

      const { data, error } = await supabase.functions.invoke("generate-smartpost", {
        body: {
          niche: wizardData.niche,
          theme: wizardData.theme,
          objective: wizardData.objective,
          tone: wizardData.tone,
          visualStyle: wizardData.visualStyle,
          format: wizardData.format,
          quantity: postsInBlock,
          imageQuantity: imageQtyForBlock,
          brandImages: wizardData.brandImages,
          blockIndex,
        },
      });

      if (error) throw error;

      const newPosts: GeneratedPost[] = Array.isArray(data?.posts) ? data.posts : [];
      if (newPosts.length === 0) throw new Error("Nenhum post foi gerado. Tente novamente.");

      const accumulated = [...wizardData.allPosts, ...newPosts];
      updateWizardData({ posts: newPosts, allPosts: accumulated, currentPostIndex: 0, currentBlock: blockIndex });
      setStep(5);
    } catch (err: any) {
      toast({
        title: "Erro ao gerar posts",
        description: err?.message ?? "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 4) {
      generateBlock(0);
    } else {
      setStep((s) => Math.min(TOTAL_STEPS, s + 1));
    }
  };

  const handleBack = () => {
    if (step === 5) {
      setStep(4);
    } else {
      setStep((s) => Math.max(1, s - 1));
    }
  };

  const handleNextBlock = () => {
    const nextBlock = wizardData.currentBlock + 1;
    if (nextBlock < totalBlocks) {
      generateBlock(nextBlock);
    }
  };

  const handleRegenerate = () => generateBlock(wizardData.currentBlock);

  const handleRegenerateImage = (_index: number) => {
    toast({ title: "Regenerando imagem…", description: "Esta funcionalidade estará disponível em breve." });
  };

  const handleEnhance = (_index: number) => {
    toast({ title: "Melhorando qualidade…", description: "Esta funcionalidade estará disponível em breve." });
  };

  const hasMoreBlocks = wizardData.currentBlock + 1 < totalBlocks;
  const allBlocksDone = wizardData.allPosts.length >= wizardData.quantity;

  const renderStep = () => {
    switch (step) {
      case 1: return <StepBriefing data={wizardData} onChange={updateWizardData} />;
      case 2: return <StepObjective data={wizardData} onChange={updateWizardData} />;
      case 3: return <StepVisualStyle data={wizardData} onChange={updateWizardData} />;
      case 4: return <StepFormatQuantity data={wizardData} onChange={updateWizardData} />;
      case 5:
        return (
          <StepResult
            posts={wizardData.posts}
            onRegenerate={handleRegenerate}
            onRegenerateImage={handleRegenerateImage}
            onEnhance={handleEnhance}
          />
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-secondary/20 blur-3xl" />

      {/* Header */}
      <header className="relative z-10 glass border-b border-white/40 sticky top-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">
              SmartPost<span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">AI</span>
            </span>
          </div>
          <Button variant="ghost" onClick={() => navigate("/dashboard")} size="sm" className="rounded-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-3xl">
        <div className="glass rounded-3xl p-6 md:p-10 shadow-card">
          {step <= 4 && <WizardProgress currentStep={step} />}

          {step === 5 ? (
            <div className="mt-6">
              {/* Block progress header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground tracking-tight">
                    Bloco {wizardData.currentBlock + 1}/{totalBlocks}: {BLOCK_NAMES[wizardData.currentBlock]} 🎯
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {BLOCK_DESCRIPTIONS[wizardData.currentBlock]}
                  </p>
                  {totalBlocks > 1 && (
                    <div className="flex gap-1.5 mt-3">
                      {Array.from({ length: totalBlocks }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 rounded-full transition-all ${
                            i < wizardData.currentBlock
                              ? "bg-primary w-8"
                              : i === wizardData.currentBlock
                              ? "bg-primary w-12"
                              : "bg-muted w-8"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => {
                    setWizardData((prev) => ({
                      ...prev,
                      niche: "", theme: "", objective: "", tone: "",
                      visualStyle: "", brandImages: [], posts: [],
                      allPosts: [], currentPostIndex: 0, currentBlock: 0,
                    }));
                    setStep(1);
                  }}
                  variant="outline"
                  className="rounded-full shrink-0"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo
                </Button>
              </div>

              {renderStep()}

              {/* Block navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <Button variant="outline" onClick={handleBack} className="rounded-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Configurações
                </Button>

                {hasMoreBlocks ? (
                  <div className="flex flex-col items-end gap-1">
                    <Button
                      onClick={handleNextBlock}
                      disabled={loading}
                      className="rounded-full bg-gradient-primary hover:opacity-90 shadow-glow border-0"
                    >
                      {loading ? (
                        "Gerando..."
                      ) : (
                        <>
                          Gerar bloco {wizardData.currentBlock + 2}: {BLOCK_NAMES[wizardData.currentBlock + 1]}
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                    <p className="text-[10px] text-muted-foreground">
                      3 créditos serão descontados
                    </p>
                  </div>
                ) : allBlocksDone ? (
                  <Button
                    onClick={() => navigate("/dashboard")}
                    className="rounded-full bg-gradient-primary hover:opacity-90 shadow-glow border-0"
                  >
                    Ver todos os {wizardData.allPosts.length} posts
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleRegenerate}
                    disabled={loading}
                    variant="outline"
                    className="rounded-full"
                  >
                    {loading ? "Gerando..." : "Regenerar bloco"}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <h2 className="text-3xl font-bold text-center mb-2 text-foreground tracking-tight">
                {STEP_TITLES[step - 1]}
              </h2>
              <div className="w-16 h-1 bg-gradient-primary mx-auto rounded-full mb-8" />

              <div className="min-h-[400px] flex flex-col">{renderStep()}</div>

              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <Button variant="outline" onClick={handleBack} disabled={step === 1} className="rounded-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>

                <div className="flex flex-col items-end gap-1">
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed() || loading}
                    className="rounded-full bg-gradient-primary hover:opacity-90 shadow-glow border-0"
                  >
                    {loading
                      ? "Gerando..."
                      : step === 4
                      ? `Gerar bloco 1: Dor`
                      : "Próximo"}
                    {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                  {step === 4 && !loading && (
                    <p className="text-[10px] text-muted-foreground">
                      {wizardData.quantity + (wizardData.imageQuantity ?? 0)} créditos serão descontados
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
