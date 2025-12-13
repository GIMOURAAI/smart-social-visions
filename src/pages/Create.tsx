import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WizardProgress } from "@/components/create/WizardProgress";
import { StepObjective } from "@/components/create/StepObjective";
import { StepQuantity } from "@/components/create/StepQuantity";
import { StepTheme } from "@/components/create/StepTheme";
import { StepAI } from "@/components/create/StepAI";
import { StepStyle } from "@/components/create/StepStyle";
import { StepClone } from "@/components/create/StepClone";
import { StepPreview } from "@/components/create/StepPreview";
import { StepEdit } from "@/components/create/StepEdit";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

export interface PostData {
  title: string;
  content: string;
  imageUrl: string;
  format: string;
}

export interface WizardData {
  objective: "instagram" | "stories" | "reels" | "youtube" | null;
  selectedFormat: "1:1" | "4:5" | "9:16" | "16:9";
  manualTitle: string;
  manualSubtitle: string;
  manualCaption: string;
  quantity: number;
  theme: string;
  customTheme: string;
  useAI: boolean;
  aiSuggestions: { title: string; subtitle: string; caption: string }[];
  colorPreference: string;
  fontPreference: string;
  cloneMode: boolean;
  cloneImage: File | null;
  posts: PostData[];
  currentPostIndex: number;
}

const TOTAL_STEPS = 8;

export default function Create() {
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [wizardData, setWizardData] = useState<WizardData>({
    objective: null,
    selectedFormat: "1:1",
    manualTitle: "",
    manualSubtitle: "",
    manualCaption: "",
    quantity: 1,
    theme: "",
    customTheme: "",
    useAI: true,
    aiSuggestions: [],
    colorPreference: "auto",
    fontPreference: "inter",
    cloneMode: false,
    cloneImage: null,
    posts: [],
    currentPostIndex: 0,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUser(session.user);
  };

  const updateWizardData = (data: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...data }));
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 1: return wizardData.objective !== null;
      case 2: return wizardData.quantity >= 1 && wizardData.quantity <= 9;
      case 3: return wizardData.theme !== "" || wizardData.customTheme !== "";
      case 4: return true;
      case 5: return true;
      case 6: return true;
      case 7: return wizardData.posts.length > 0;
      case 8: return true;
      default: return false;
    }
  };

  const nextStep = () => {
    if (step < TOTAL_STEPS && canProceed()) {
      // Skip clone step if not in clone mode
      if (step === 5 && !wizardData.cloneMode) {
        setStep(7);
      } else {
        setStep(step + 1);
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      // Skip clone step if not in clone mode
      if (step === 7 && !wizardData.cloneMode) {
        setStep(5);
      } else {
        setStep(step - 1);
      }
    }
  };

  const getStepTitle = (): string => {
    switch (step) {
      case 1: return "O que você quer criar?";
      case 2: return "Quantos posts?";
      case 3: return "Qual o tema?";
      case 4: return "Usar IA para sugestões?";
      case 5: return "Preferências de estilo";
      case 6: return "Clonar um modelo";
      case 7: return "Preview dos posts";
      case 8: return "Editar e finalizar";
      default: return "";
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepObjective data={wizardData} updateData={updateWizardData} />;
      case 2:
        return <StepQuantity data={wizardData} updateData={updateWizardData} />;
      case 3:
        return <StepTheme data={wizardData} updateData={updateWizardData} />;
      case 4:
        return <StepAI data={wizardData} updateData={updateWizardData} />;
      case 5:
        return <StepStyle data={wizardData} updateData={updateWizardData} />;
      case 6:
        return <StepClone data={wizardData} updateData={updateWizardData} />;
      case 7:
        return <StepPreview data={wizardData} updateData={updateWizardData} setLoading={setLoading} />;
      case 8:
        return <StepEdit data={wizardData} updateData={updateWizardData} user={user} />;
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
            <h1 className="text-xl font-bold text-foreground">Smart Social Media</h1>
          </div>
          <Button variant="ghost" onClick={() => navigate("/dashboard")} size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <WizardProgress currentStep={step} totalSteps={TOTAL_STEPS} />
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
            {getStepTitle()}
          </h2>
          
          <div className="min-h-[400px] flex flex-col">
            {renderStep()}
          </div>

          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
            
            {step < TOTAL_STEPS ? (
              <Button
                onClick={nextStep}
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
