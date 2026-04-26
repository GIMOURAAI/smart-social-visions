import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WizardProgress } from "@/components/create/WizardProgress";
import { StepIntent } from "@/components/create/StepIntent";
import { StepFormat } from "@/components/create/StepFormat";
import { StepBusiness } from "@/components/create/StepBusiness";
import { StepFrequency } from "@/components/create/StepFrequency";
import { StepStyleNew } from "@/components/create/StepStyleNew";
import { StepPreviewNew } from "@/components/create/StepPreviewNew";
import { StepCaption } from "@/components/create/StepCaption";
import { StepEdit } from "@/components/create/StepEdit";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

export interface PostData {
  gancho: string;
  titulo: string;
  subtitulo: string;
  legenda: string;
  imageUrl: string;
  format: string;
  // legados (mantidos pra compat com StepEdit/CanvasEditor)
  title?: string;
  content?: string;
}

export interface WizardData {
  intent: "venda" | "autoridade" | "viral" | "engajamento" | null;
  format: "post" | "reels" | "story" | "youtube" | null;
  formatRatio: "5:4" | "9:16" | "16:9" | "1:1";
  business: string;
  handle: string;
  quantity: number;
  days: number;
  palette: string;
  customPalette: string[];
  logoDataUrl: string;
  borderPadding: number;
  elementPadding: number;
  posts: PostData[];
  currentPostIndex: number;
}

const TOTAL_STEPS = 8;

export default function Create() {
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [wizardData, setWizardData] = useState<WizardData>({
    intent: null,
    format: null,
    formatRatio: "5:4",
    business: "",
    handle: "@",
    quantity: 3,
    days: 7,
    palette: "purple",
    customPalette: ["#7C3AED", "#A78BFA", "#F5F3FF"],
    logoDataUrl: "",
    borderPadding: 8,
    elementPadding: 6,
    posts: [],
    currentPostIndex: 0,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    })();
  }, [navigate]);

  const updateWizardData = (d: Partial<WizardData>) =>
    setWizardData((prev) => ({ ...prev, ...d }));

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return wizardData.intent !== null;
      case 2:
        return wizardData.format !== null;
      case 3:
        return (
          wizardData.business.trim().length >= 5 &&
          wizardData.handle.replace("@", "").trim().length >= 1
        );
      case 4:
        return wizardData.quantity > 0 && wizardData.days > 0;
      case 5:
        return wizardData.customPalette.length > 0;
      case 6:
        return wizardData.posts.length > 0;
      case 7:
        return true;
      case 8:
        return true;
      default:
        return false;
    }
  };

  const titles = [
    "Qual a intenção do post?",
    "Qual o formato?",
    "Sobre a empresa",
    "Quantos posts e por quanto tempo?",
    "Estilo, paleta e logo",
    "Preview dos posts",
    "Legendas com SEO",
    "Editar arte final",
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepIntent data={wizardData} updateData={updateWizardData} />;
      case 2:
        return <StepFormat data={wizardData} updateData={updateWizardData} />;
      case 3:
        return <StepBusiness data={wizardData} updateData={updateWizardData} />;
      case 4:
        return (
          <StepFrequency data={wizardData} updateData={updateWizardData} />
        );
      case 5:
        return (
          <StepStyleNew data={wizardData} updateData={updateWizardData} />
        );
      case 6:
        return (
          <StepPreviewNew
            data={wizardData}
            updateData={updateWizardData}
            setLoading={setLoading}
          />
        );
      case 7:
        return <StepCaption data={wizardData} updateData={updateWizardData} />;
      case 8:
        return (
          <StepEdit
            data={wizardData}
            updateData={updateWizardData}
            user={user}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">
              Smart Social Media
            </h1>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <WizardProgress currentStep={step} totalSteps={TOTAL_STEPS} />

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
            {titles[step - 1]}
          </h2>

          <div className="min-h-[400px] flex flex-col">{renderStep()}</div>

          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            {step < TOTAL_STEPS ? (
              <Button
                onClick={() => setStep((s) => Math.min(TOTAL_STEPS, s + 1))}
                disabled={!canProceed() || loading}
              >
                {loading ? "Gerando..." : "Próximo"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-primary"
              >
                Concluir
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
