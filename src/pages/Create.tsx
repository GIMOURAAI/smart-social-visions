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
import { FeedPreview } from "@/components/create/FeedPreview";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Sparkles, Plus, ChevronRight, FileDown } from "lucide-react";
import { downloadPDF } from "@/lib/downloadPDF";
import { CreditsBadge } from "@/components/CreditsBadge";
import { useCredits } from "@/hooks/useCredits";

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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const credits = useCredits();

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
      case 3: return wizardData.visualStyle.trim().length > 0 || (wizardData.brandImages ?? []).length > 0;
      case 4: return (wizardData.feedPattern ?? "").trim().length > 0;
      case 5: return wizardData.format.length > 0 && wizardData.daysQuantity > 0;
      case 6: return true;
      default: return false;
    }
  };

  const totalBlocks = Math.ceil(wizardData.quantity / 3);

  const [batchId, setBatchId] = useState<string | null>(null);
  const BLOCK_KEYS = ["dor", "autoridade", "valor", "venda"];

  const ensureBatch = async (): Promise<string> => {
    if (batchId) return batchId;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Não autenticado");
    const { data, error } = await supabase.from("post_batches").insert({
      user_id: user.id,
      brand_name: wizardData.brandName,
      niche: wizardData.niche,
      theme: wizardData.theme,
      objective: wizardData.objective,
      tone: wizardData.tone,
      visual_style: wizardData.visualStyle,
      brand_images: wizardData.brandImages,
      feed_pattern: wizardData.feedPattern,
      format: wizardData.format,
      days: wizardData.daysQuantity,
      total_posts: wizardData.quantity,
      pilot_count: wizardData.pilotQuantity,
    }).select("id").single();
    if (error || !data) throw new Error(error?.message ?? "Falha ao criar lote");
    setBatchId(data.id);
    return data.id;
  };

  const mapRow = (r: any): GeneratedPost => ({
    tema: wizardData.theme,
    bloco: r.block ? r.block.charAt(0).toUpperCase() + r.block.slice(1) : "",
    objetivo: wizardData.objective,
    tipoConteudo: r.block ?? "",
    intencaoEmocional: "",
    gancho: r.gancho ?? "",
    tituloArte: r.titulo_arte ?? r.title ?? "",
    subtituloArte: r.subtitulo ?? "",
    textoArte: r.texto_arte ?? "",
    legenda: r.legenda ?? r.content ?? "",
    cta: r.cta ?? "",
    hashtags: Array.isArray(r.hashtags) ? r.hashtags.map((h: string) => `#${h}`).join(" ") : (r.hashtags ?? ""),
    estiloVisual: wizardData.visualStyle,
    promptVisual: r.image_prompt ?? "",
    storyComplementar: r.story_complementar ?? "",
    imageUrl: r.image_url ?? undefined,
    creditoCusto: 1,
  });

  const generatePosts = async (blockIndex: number, count: number) => {
    setLoading(true);
    try {
      const id = await ensureBatch();
      const blockKey = BLOCK_KEYS[blockIndex % 4];
      const { data, error } = await supabase.functions.invoke("generate-post-batch", {
        body: { batchId: id, block: blockKey, count: Math.min(3, count) },
      });

      if (error) {
        const ctx = (error as any).context;
        if (ctx?.status === 402 || /INSUFFICIENT_CREDITS/i.test(error.message)) {
          toast({ title: "Sem créditos", description: "Faça upgrade do plano para continuar.", variant: "destructive" });
          navigate("/pricing");
          return;
        }
        throw error;
      }

      const rows = Array.isArray(data?.posts) ? data.posts : [];
      if (rows.length === 0) throw new Error("Nenhum post foi gerado. Tente novamente.");
      const newPosts = rows.map(mapRow);

      const accumulated = [...wizardData.allPosts, ...newPosts];
      const isComplete = accumulated.length >= wizardData.quantity;

      update({
        posts: newPosts,
        allPosts: accumulated,
        currentPostIndex: 0,
        currentBlock: blockIndex,
        phase: isComplete ? "complete" : blockIndex === 0 && wizardData.phase === "pilot" ? "blocks" : wizardData.phase,
      });
      setStep(7);
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

  const getMissingField = (): string | null => {
    if (step === 1) {
      if (!wizardData.brandName?.trim()) return "Preencha o nome da marca antes de continuar";
      if (!wizardData.niche) return "Selecione um nicho";
      if ((wizardData.theme?.trim().length ?? 0) < 5) return "Descreva melhor o assunto (mínimo 5 caracteres)";
    }
    if (step === 2) {
      if (!wizardData.objective?.trim()) return "Descreva o objetivo do conteúdo";
      if (!wizardData.tone?.trim()) return "Selecione um tom de voz";
    }
    if (step === 3 && !wizardData.visualStyle?.trim() && !(wizardData.brandImages ?? []).length)
      return "Escolha um estilo visual";
    if (step === 4 && !wizardData.feedPattern?.trim()) return "Escolha o padrão do feed";
    if (step === 5 && (!wizardData.format || !wizardData.daysQuantity)) return "Escolha o formato e período";
    return null;
  };

  const handleNext = () => {
    const missing = getMissingField();
    if (missing) {
      toast({ title: "Campo obrigatório", description: missing, variant: "destructive" });
      return;
    }
    if (step === 6) {
      generatePosts(0, wizardData.pilotQuantity);
    } else {
      setStep((s) => Math.min(TOTAL_WIZARD_STEPS, s + 1));
    }
  };

  const handleBack = () => {
    if (step === 7) {
      setStep(6);
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
      // Completa o bloco atual antes de avançar
      generatePosts(wizardData.currentBlock, Math.min(remainingInBlock, postsLeft));
    } else {
      // Bloco atual completo — vai para o próximo
      const nextBlock = wizardData.currentBlock + 1;
      if (postsLeft > 0) generatePosts(nextBlock, Math.min(3, postsLeft));
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
  const isPilotPhase = wizardData.currentBlock === 0 && wizardData.allPosts.length < wizardData.pilotQuantity;

  const resetWizard = () => {
    setBatchId(null);
    setWizardData((prev) => ({
      ...prev,
      forClient: false, brandName: "", niche: "", theme: "",
      objective: "", tone: "", visualStyle: "", brandImages: [], feedPattern: "",
      posts: [], allPosts: [], currentPostIndex: 0, currentBlock: 0, phase: "pilot",
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
          <div className="flex items-center gap-2">
            <CreditsBadge />
            <Button variant="ghost" onClick={() => navigate("/dashboard")} size="sm" className="rounded-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>
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
                  {step === 3 && <StepVisualStyle data={wizardData} onChange={update} />}
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
                    {(() => {
                      const noCredits = step === 6 && !credits.loading && credits.remaining < wizardData.pilotQuantity;
                      return (
                        <>
                          <Button
                            onClick={noCredits ? () => navigate("/pricing") : handleNext}
                            disabled={loading}
                            className="rounded-full bg-gradient-primary hover:opacity-90 shadow-glow border-0"
                          >
                            {loading ? "Gerando..." : noCredits ? "Sem créditos · Ver planos" : step === 6 ? `Gerar piloto (${wizardData.pilotQuantity} post${wizardData.pilotQuantity > 1 ? "s" : ""})` : "Próximo"}
                            {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                          </Button>
                          {step === 6 && !loading && (
                            <p className="text-[10px] text-muted-foreground">
                              Saldo: {credits.remaining} crédito{credits.remaining !== 1 ? "s" : ""} · piloto custa {wizardData.pilotQuantity}
                            </p>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Result step (7) */}
          {step === 7 && (
            <div className="mt-2">
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  {isPilotPhase ? (
                    <>
                      <div className="inline-flex items-center gap-1.5 bg-amber-500/15 text-amber-600 rounded-full px-3 py-1 text-xs font-bold mb-2">
                        🔍 Post piloto — aprovação de estilo
                      </div>
                      <h2 className="text-xl font-bold text-foreground tracking-tight">
                        O estilo visual ficou bom?
                      </h2>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Aprove para continuar gerando os demais posts
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold text-foreground tracking-tight">
                        Bloco {wizardData.currentBlock + 1}/{totalBlocks}: {BLOCK_NAMES[wizardData.currentBlock % 4]} 🎯
                      </h2>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {BLOCK_DESCRIPTIONS[wizardData.currentBlock % 4]}
                      </p>
                    </>
                  )}

                  {/* Progress bar */}
                  {totalBlocks > 1 && !isPilotPhase && (
                    <div className="flex gap-1.5 mt-3">
                      {Array.from({ length: totalBlocks }).map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all ${
                          i < wizardData.currentBlock ? "bg-primary w-8"
                          : i === wizardData.currentBlock ? "bg-primary w-12"
                          : "bg-muted w-8"
                        }`} />
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
                posts={wizardData.posts}
                onRegenerate={handleRegenerate}
                onRegenerateImage={handleRegenerateImage}
                onEnhance={() => toast({ title: "Em breve", description: "Melhoria de qualidade será liberada em breve." })}
              />

              {/* Action bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-8 pt-6 border-t border-border">
                <Button variant="outline" onClick={handleBack} className="rounded-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Configurações
                </Button>

                <div className="flex flex-wrap gap-2 justify-end">
                  {isComplete ? (
                    <>
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
                    </>
                  ) : isPilotPhase ? (
                    <div className="flex flex-col items-end gap-1">
                      <Button
                        onClick={handleNextBlock}
                        disabled={loading}
                        className="rounded-full bg-gradient-primary hover:opacity-90 shadow-glow border-0"
                      >
                        {loading ? "Gerando..." : "Aprovei — continuar gerando"}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                      <p className="text-[10px] text-muted-foreground">
                        {Math.min(3, wizardData.quantity - wizardData.allPosts.length)} créditos agora
                      </p>
                    </div>
                  ) : hasMoreBlocks ? (
                    <div className="flex flex-col items-end gap-1">
                      <Button
                        onClick={handleNextBlock}
                        disabled={loading}
                        className="rounded-full bg-gradient-primary hover:opacity-90 shadow-glow border-0"
                      >
                        {loading ? "Gerando..." : `Próximo: ${BLOCK_NAMES[(wizardData.currentBlock + 1) % 4]}`}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                      <p className="text-[10px] text-muted-foreground">
                        {Math.min(3, wizardData.quantity - wizardData.allPosts.length)} créditos
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
