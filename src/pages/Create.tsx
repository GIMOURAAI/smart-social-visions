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
import { ArrowLeft, ArrowRight, Sparkles, Plus } from "lucide-react";

export interface GeneratedPost {
  tema: string;
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
  imageUrl: string;
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
  posts: GeneratedPost[];
  currentPostIndex: number;
}

const TOTAL_STEPS = 4;

const STEP_TITLES = [
  "Sobre o seu negócio",
  "Objetivo e tom de voz",
  "Estilo visual",
  "Formato e quantidade",
];

export default function Create() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isSevenDays = searchParams.get("mode") === "7days";

  const [wizardData, setWizardData] = useState<WizardData>({
    niche: "",
    theme: "",
    objective: "",
    tone: "",
    visualStyle: "",
    brandImages: [],
    format: "4:5",
    quantity: isSevenDays ? 7 : 1,
    posts: [],
    currentPostIndex: 0,
  });

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    })();
  }, [navigate]);

  const updateWizardData = (d: Partial<WizardData>) =>
    setWizardData((prev) => ({ ...prev, ...d }));

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return wizardData.niche.trim().length > 0 && wizardData.theme.trim().length >= 5;
      case 2:
        return wizardData.objective.trim().length > 0 && wizardData.tone.trim().length > 0;
      case 3:
        return (
          wizardData.visualStyle.trim().length > 0 ||
          (wizardData.brandImages ?? []).length > 0
        );
      case 4:
        return wizardData.format.length > 0 && wizardData.quantity > 0;
      default:
        return false;
    }
  };

  const generateContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-smartpost", {
        body: {
          niche: wizardData.niche,
          theme: wizardData.theme,
          objective: wizardData.objective,
          tone: wizardData.tone,
          visualStyle: wizardData.visualStyle,
          format: wizardData.format,
          quantity: wizardData.quantity,
        },
      });

      if (error) throw error;

      const posts: GeneratedPost[] = Array.isArray(data?.posts)
        ? data.posts
        : data?.post
        ? [data.post]
        : [];

      if (posts.length === 0) {
        throw new Error("Nenhum post foi gerado. Tente novamente.");
      }

      updateWizardData({ posts, currentPostIndex: 0 });
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
      generateContent();
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

  const handleRegenerate = () => {
    generateContent();
  };

  const handleRegenerateImage = (_index: number) => {
    toast({
      title: "Regenerando imagem…",
      description: "Esta funcionalidade estará disponível em breve.",
    });
  };

  const handleEnhance = (_index: number) => {
    toast({
      title: "Melhorando qualidade…",
      description: "Esta funcionalidade estará disponível em breve.",
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepBriefing data={wizardData} onChange={updateWizardData} />;
      case 2:
        return <StepObjective data={wizardData} onChange={updateWizardData} />;
      case 3:
        return <StepVisualStyle data={wizardData} onChange={updateWizardData} />;
      case 4:
        return <StepFormatQuantity data={wizardData} onChange={updateWizardData} />;
      case 5:
        return (
          <StepResult
            posts={wizardData.posts}
            onRegenerate={handleRegenerate}
            onRegenerateImage={handleRegenerateImage}
            onEnhance={handleEnhance}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft relative overflow-hidden">
      {/* Background glows */}
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
              SmartPost
              <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                AI
              </span>
            </span>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            size="sm"
            className="rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-3xl">
        <div className="glass rounded-3xl p-6 md:p-10 shadow-card">
          {/* Progress indicator — only steps 1-4 */}
          {step <= 4 && <WizardProgress currentStep={step} />}

          {step === 5 ? (
            /* Result view */
            <div className="mt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground tracking-tight">
                    Seus posts estão prontos! 🎉
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {wizardData.posts.length === 1
                      ? "1 post gerado com sucesso"
                      : `${wizardData.posts.length} posts gerados — semana completa`}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setWizardData((prev) => ({
                      ...prev,
                      niche: "",
                      theme: "",
                      objective: "",
                      tone: "",
                      visualStyle: "",
                      brandImages: [],
                      posts: [],
                      currentPostIndex: 0,
                    }));
                    setStep(1);
                  }}
                  variant="outline"
                  className="rounded-full shrink-0"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar novo
                </Button>
              </div>
              {renderStep()}
            </div>
          ) : (
            /* Wizard steps 1-4 */
            <div className="mt-8">
              <h2 className="text-3xl font-bold text-center mb-2 text-foreground tracking-tight">
                {STEP_TITLES[step - 1]}
              </h2>
              <div className="w-16 h-1 bg-gradient-primary mx-auto rounded-full mb-8" />

              <div className="min-h-[400px] flex flex-col">{renderStep()}</div>

              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 1}
                  className="rounded-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={!canProceed() || loading}
                  className="rounded-full bg-gradient-primary hover:opacity-90 shadow-glow border-0"
                >
                  {loading
                    ? "Gerando..."
                    : step === 4
                    ? "Gerar posts"
                    : "Próximo"}
                  {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
