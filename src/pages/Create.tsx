import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WizardProgress } from "@/components/create/WizardProgress";
import { StepBriefing } from "@/components/create/StepBriefing";
import { StepObjective } from "@/components/create/StepObjective";
import { StepVisualStyle } from "@/components/create/StepVisualStyle";
import { StepFeedPattern } from "@/components/create/StepFeedPattern";
import { StepFormatQuantity } from "@/components/create/StepFormatQuantity";
import { StepConfirm } from "@/components/create/StepConfirm";
import { StepResult } from "@/components/create/StepResult";
import { StepEditorial } from "@/components/create/StepEditorial";
import { FeedPreview } from "@/components/create/FeedPreview";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Sparkles, Plus, ChevronRight, FileDown, CheckCircle2 } from "lucide-react";
import { downloadPDF } from "@/lib/downloadPDF";

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
  // Step 1
  forClient: boolean;
  brandName: string;
  niche: string;
  theme: string;
  // Step 2
  objective: string;
  tone: string;
  // Step 3
  visualStyle: string;
  brandImages: string[];
  styleReferenceImage?: string;
  styleAnalysis?: {
    paletaCores: string[];
    estiloFoto: string;
    tipografia: string;
    atmosfera: string;
    composicao: string;
    promptDalle: string;
  };
  // Step 4
  feedPattern: string;
  // Step 5
  format: "4:5" | "1:1" | "9:16" | "16:9";
  daysQuantity: number;
  quantity: number;
  pilotQuantity: number;
  imageQuantity: number;
  // State
  posts: GeneratedPost[];
  currentPostIndex: number;
  currentBlock: number;
  allPosts: GeneratedPost[];
  phase: "pilot" | "blocks" | "complete";
  // Editorial phase
  editorialPhase: boolean;
  editorialPosts: GeneratedPost[];
}

const TOTAL_WIZARD_STEPS = 6;

const STEP_TITLES = [
  "Sobre o seu negócio",
  "Objetivo e tom de voz",
  "Estilo visual",
  "Padrão do feed",
  "Formato e quantidade",
  "Confirme seu pedido",
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
  const [showFeedPreview, setShowFeedPreview] = useState(false);
  const [imageGenProgress, setImageGenProgress] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isMonthMode = searchParams.get("mode") === "7days";

  const [wizardData, setWizardData] = useState<WizardData>({
    forClient: false,
    brandName: "",
    niche: "",
    theme: "",
    objective: "",
    tone: "",
    visualStyle: "",
    brandImages: [],
    feedPattern: "",
    format: "4:5",
    daysQuantity: isMonthMode ? 30 : 7,
    quantity: isMonthMode ? 30 : 7,
    pilotQuantity: 1,
    imageQuantity: isMonthMode ? 30 : 7,
    posts: [],
    currentPostIndex: 0,
    currentBlock: 0,
    allPosts: [],
    phase: "pilot",
    editorialPhase: false,
    editorialPosts: [],
  });

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate("/auth");
    })();
  }, [navigate]);

  const update = (d: Partial<WizardData>) =>
    setWizardData((prev) => ({ ...prev, ...d }));

  const canProceed = (): boolean => {
    switch (step) {
      case 1: return (wizardData.brandName?.trim().length ?? 0) > 0 && wizardData.niche.trim().length > 0 && wizardData.theme.trim().length >= 5;
      case 2: return wizardData.objective.trim().length > 0 && wizardData.tone.trim().length > 0;
      case 3: {
        if (wizardData.visualStyle === "custom-analyzed") return !!wizardData.styleAnalysis;
        return wizardData.visualStyle.trim().length > 0;
      }
      case 4: return (wizardData.feedPattern ?? "").trim().length > 0;
      case 5: return wizardData.format.length > 0 && wizardData.daysQuantity > 0;
      case 6: return true;
      default: return false;
    }
  };

  const totalBlocks = Math.ceil(wizardData.quantity / 3);

  // Phase 1: Generate all text content for all posts
  const generateAllText = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-smartpost", {
        body: {
          niche: wizardData.niche,
          theme: wizardData.theme,
          objective: wizardData.objective,
          tone: wizardData.tone,
          visualStyle: wizardData.visualStyle,
          feedPattern: wizardData.feedPattern,
          brandName: wizardData.brandName,
          format: wizardData.format,
          quantity: wizardData.quantity,
          imageQuantity: 0,
          brandImages: wizardData.brandImages,
          customStylePrompt: wizardData.styleAnalysis?.promptDalle,
          customStyleMeta: wizardData.styleAnalysis
            ? {
                paletaCores: wizardData.styleAnalysis.paletaCores,
                atmosfera: wizardData.styleAnalysis.atmosfera,
                tipografia: wizardData.styleAnalysis.tipografia,
                composicao: wizardData.styleAnalysis.composicao,
              }
            : undefined,
          textOnly: true,
          totalPosts: wizardData.quantity,
        },
      });

      if (error) throw error;

      const generatedPosts: GeneratedPost[] = Array.isArray(data?.posts) ? data.posts : [];
      if (generatedPosts.length === 0) throw new Error("Nenhum post foi gerado. Tente novamente.");

      update({
        editorialPhase: true,
        editorialPosts: generatedPosts,
      });
      setStep(7);
    } catch (err: any) {
      toast({
        title: "Erro ao gerar textos",
        description: err?.message ?? "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Phase 2: Generate images for approved posts in batches of 3
  const generateImagesForPosts = async (approvedPosts: GeneratedPost[]) => {
    setLoading(true);
    setImageGenProgress(0);
    const batchSize = 3;
    const result: GeneratedPost[] = [...approvedPosts];

    try {
      for (let i = 0; i < approvedPosts.length; i += batchSize) {
        const batch = approvedPosts.slice(i, i + batchSize);
        const { data, error } = await supabase.functions.invoke("generate-smartpost", {
          body: {
            niche: wizardData.niche,
            theme: wizardData.theme,
            objective: wizardData.objective,
            tone: wizardData.tone,
            visualStyle: wizardData.visualStyle,
            feedPattern: wizardData.feedPattern,
            brandName: wizardData.brandName,
            format: wizardData.format,
            quantity: batch.length,
            imageQuantity: batch.length,
            postsForImage: batch,
          },
        });

        if (error) throw error;

        const batchWithImages: GeneratedPost[] = Array.isArray(data?.posts) ? data.posts : batch;
        for (let j = 0; j < batchWithImages.length; j++) {
          result[i + j] = batchWithImages[j];
        }

        setImageGenProgress(Math.round(((i + batch.length) / approvedPosts.length) * 100));
      }

      update({
        allPosts: result,
        posts: result,
        phase: "complete",
      });
      setStep(8);
    } catch (err: any) {
      toast({
        title: "Erro ao gerar imagens",
        description: err?.message ?? "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setImageGenProgress(0);
    }
  };

  // Legacy block-by-block generation (kept for compatibility)
  const generatePosts = async (blockIndex: number, count: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-smartpost", {
        body: {
          niche: wizardData.niche,
          theme: wizardData.theme,
          objective: wizardData.objective,
          tone: wizardData.tone,
          visualStyle: wizardData.visualStyle,
          feedPattern: wizardData.feedPattern,
          brandName: wizardData.brandName,
          format: wizardData.format,
          quantity: count,
          imageQuantity: count,
          brandImages: wizardData.brandImages,
          blockIndex,
          customStylePrompt: wizardData.styleAnalysis?.promptDalle,
          customStyleMeta: wizardData.styleAnalysis
            ? {
                paletaCores: wizardData.styleAnalysis.paletaCores,
                atmosfera: wizardData.styleAnalysis.atmosfera,
                tipografia: wizardData.styleAnalysis.tipografia,
                composicao: wizardData.styleAnalysis.composicao,
              }
            : undefined,
        },
      });

      if (error) throw error;

      const newPosts: GeneratedPost[] = Array.isArray(data?.posts) ? data.posts : [];
      if (newPosts.length === 0) throw new Error("Nenhum post foi gerado. Tente novamente.");

      const accumulated = [...wizardData.allPosts, ...newPosts];
      const isComplete = accumulated.length >= wizardData.quantity;

      update({
        posts: newPosts,
        allPosts: accumulated,
        currentPostIndex: 0,
        currentBlock: blockIndex,
        phase: isComplete ? "complete" : blockIndex === 0 && wizardData.phase === "pilot" ? "blocks" : wizardData.phase,
      });
      setStep(8);
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
    if (step === 6) {
      // New two-phase flow: generate all text first
      generateAllText();
    } else {
      setStep((s) => Math.min(TOTAL_WIZARD_STEPS, s + 1));
    }
  };

  const handleBack = () => {
    if (step === 7) {
      setStep(6);
    } else if (step === 8) {
      setStep(7);
    } else {
      setStep((s) => Math.max(1, s - 1));
    }
  };

  const handleNextBlock = () => {
    const postsInCurrentBlock = wizardData.allPosts.filter(
      (_, i) => Math.floor(i / 3) === wizardData.currentBlock
    ).length;
    const remainingInBlock = 3 - postsInCurrentBlock;
    const postsLeft = wizardData.quantity - wizardData.allPosts.length;

    if (remainingInBlock > 0 && postsLeft > 0) {
      const count = Math.min(remainingInBlock, postsLeft);
      generatePosts(wizardData.currentBlock, count);
    } else {
      const nextBlock = wizardData.currentBlock + 1;
      const count = Math.min(3, postsLeft);
      if (count > 0) generatePosts(nextBlock, count);
    }
  };

  const handleRegenerate = () => {
    const count = wizardData.posts.length;
    generatePosts(wizardData.currentBlock, count);
  };

  const handleRegenerateImage = (_index: number) => {
    toast({ title: "Em breve", description: "Regeneração individual de imagem será liberada em breve." });
  };

  const handleDownloadPDF = () => {
    downloadPDF(wizardData.allPosts, wizardData.brandName ?? "SmartPostAI");
  };

  const hasMoreBlocks = wizardData.allPosts.length < wizardData.quantity;
  const isComplete = wizardData.allPosts.length >= wizardData.quantity;
  const isPilotPhase = wizardData.currentBlock === 0 && wizardData.allPosts.length <= wizardData.pilotQuantity;

  const resetWizard = () => {
    setWizardData((prev) => ({
      ...prev,
      forClient: false, brandName: "", niche: "", theme: "",
      objective: "", tone: "", visualStyle: "", brandImages: [], feedPattern: "",
      styleReferenceImage: undefined, styleAnalysis: undefined,
      posts: [], allPosts: [], currentPostIndex: 0, currentBlock: 0, phase: "pilot",
      editorialPhase: false, editorialPosts: [],
    }));
    setShowFeedPreview(false);
    setStep(1);
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

          {/* Feed preview overlay */}
          {showFeedPreview && (
            <FeedPreview
              posts={wizardData.allPosts}
              brandName={wizardData.brandName}
              onClose={() => setShowFeedPreview(false)}
              onDownloadPDF={handleDownloadPDF}
            />
          )}

          {/* Wizard steps 1-6 */}
          {step <= TOTAL_WIZARD_STEPS && (
            <>
              <WizardProgress currentStep={step} />
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-center mb-2 text-foreground tracking-tight">
                  {STEP_TITLES[step - 1]}
                </h2>
                <div className="w-16 h-1 bg-gradient-primary mx-auto rounded-full mb-8" />

                <div className="min-h-[400px] flex flex-col">
                  {step === 1 && <StepBriefing data={wizardData} onChange={update} />}
                  {step === 2 && <StepObjective data={wizardData} onChange={update} />}
                  {step === 3 && <StepVisualStyle data={wizardData} onChange={update} defaultTab={searchParams.get("style") === "custom" ? "custom" : undefined} />}
                  {step === 4 && <StepFeedPattern data={wizardData} onChange={update} />}
                  {step === 5 && <StepFormatQuantity data={wizardData} onChange={update} />}
                  {step === 6 && <StepConfirm data={wizardData} onEdit={(s) => setStep(s)} />}
                </div>

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
                      {loading ? "Gerando textos..." : step === 6 ? `Gerar linha editorial (${wizardData.quantity} posts)` : "Próximo"}
                      {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                    {step === 6 && !loading && (
                      <p className="text-[10px] text-muted-foreground">
                        Primeiro geraremos todos os textos para revisão
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 7: Editorial review */}
          {step === 7 && (
            <div className="mt-2">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-violet-500/15 text-violet-600 rounded-full px-3 py-1 text-xs font-bold mb-2">
                    Fase 1 de 2 — Revisão editorial
                  </div>
                  <h2 className="text-xl font-bold text-foreground tracking-tight">
                    Revise e edite seus posts
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Todos os textos foram gerados. Edite o que quiser antes de gerar as imagens.
                  </p>
                </div>
                <Button onClick={resetWizard} variant="outline" className="rounded-full shrink-0">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo
                </Button>
              </div>

              <StepEditorial
                posts={wizardData.editorialPosts}
                onChange={(posts) => update({ editorialPosts: posts })}
              />

              <div className="flex flex-wrap items-center justify-between gap-3 mt-8 pt-6 border-t border-border">
                <Button variant="outline" onClick={handleBack} className="rounded-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Configurações
                </Button>

                <div className="flex flex-col items-end gap-1">
                  <Button
                    onClick={() => generateImagesForPosts(wizardData.editorialPosts)}
                    disabled={loading || wizardData.editorialPosts.length === 0}
                    className="rounded-full bg-gradient-primary hover:opacity-90 shadow-glow border-0"
                  >
                    {loading ? (
                      imageGenProgress > 0
                        ? `Gerando imagens... ${imageGenProgress}%`
                        : "Iniciando geração..."
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Aprovar e gerar imagens
                      </>
                    )}
                    {!loading && <ChevronRight className="w-4 h-4 ml-1" />}
                  </Button>
                  {!loading && (
                    <p className="text-[10px] text-muted-foreground">
                      {wizardData.editorialPosts.length} imagens serão geradas em lotes de 3
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 8: Results with images */}
          {step === 8 && (
            <div className="mt-2">
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-green-500/15 text-green-600 rounded-full px-3 py-1 text-xs font-bold mb-2">
                    Fase 2 de 2 — Posts com imagens
                  </div>
                  <h2 className="text-xl font-bold text-foreground tracking-tight">
                    Sua linha editorial está pronta!
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {wizardData.allPosts.length} posts gerados com imagens
                  </p>

                  {/* Progress bar */}
                  {totalBlocks > 1 && (
                    <div className="flex gap-1.5 mt-3">
                      {Array.from({ length: totalBlocks }).map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all bg-primary w-8`} />
                      ))}
                    </div>
                  )}
                </div>

                <Button onClick={resetWizard} variant="outline" className="rounded-full shrink-0">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo
                </Button>
              </div>

              <StepResult
                posts={wizardData.allPosts}
                onRegenerate={handleRegenerate}
                onRegenerateImage={handleRegenerateImage}
                onEnhance={() => toast({ title: "Em breve", description: "Melhoria de qualidade será liberada em breve." })}
              />

              {/* Action bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-8 pt-6 border-t border-border">
                <Button variant="outline" onClick={handleBack} className="rounded-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Revisar textos
                </Button>

                <div className="flex flex-wrap gap-2 justify-end">
                  <Button
                    onClick={() => setShowFeedPreview(true)}
                    variant="outline"
                    className="rounded-full"
                  >
                    Ver feed completo
                  </Button>
                  <Button
                    onClick={handleDownloadPDF}
                    className="rounded-full bg-gradient-primary hover:opacity-90 shadow-glow border-0"
                  >
                    <FileDown className="w-4 h-4 mr-2" />
                    Baixar PDF
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
