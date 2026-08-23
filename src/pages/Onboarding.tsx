import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, BriefcaseBusiness, UserRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type UsageType = "own_brand" | "one_client" | "multiple_clients";

const options: Array<{
  value: UsageType;
  title: string;
  description: string;
  icon: typeof UserRound;
}> = [
  {
    value: "own_brand",
    title: "Minha marca",
    description: "Vou criar conteúdo para o meu próprio negócio.",
    icon: UserRound,
  },
  {
    value: "one_client",
    title: "Um cliente",
    description: "Vou criar conteúdo para uma marca ou cliente.",
    icon: BriefcaseBusiness,
  },
  {
    value: "multiple_clients",
    title: "Vários clientes",
    description: "Vou gerenciar conteúdo para diferentes marcas.",
    icon: Building2,
  },
];

export default function Onboarding() {
  const [selected, setSelected] = useState<UsageType | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleContinue = async () => {
    if (!selected) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          usage_type: selected,
          onboarding_completed: true,
        },
      });

      if (error) throw error;

      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      toast({
        title: "Não foi possível salvar",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="spa-dark spa-ambient min-h-screen text-foreground px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-primary mb-2">Primeiro acesso</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Para quem você vai criar conteúdo?
          </h1>
          <p className="mt-3 text-muted-foreground">
            Escolha uma opção para personalizarmos seu painel.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {options.map((option) => {
            const Icon = option.icon;
            const active = selected === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelected(option.value)}
                className="text-left"
              >
                <Card
                  className={`h-full p-6 transition-all hover:-translate-y-1 hover:shadow-lg ${
                    active ? "border-primary ring-2 ring-primary/20" : "border-border"
                  }`}
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">{option.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {option.description}
                  </p>
                </Card>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            size="lg"
            onClick={handleContinue}
            disabled={!selected || loading}
            className="min-w-52"
          >
            {loading ? "Salvando..." : "Continuar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
