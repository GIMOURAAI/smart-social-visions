import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCredits } from "@/hooks/useCredits";
import { ArrowLeft, Check, Sparkles, Loader2 } from "lucide-react";

interface Plan {
  slug: string;
  name: string;
  price_cents: number;
  credits_per_month: number;
}

const FEATURES: Record<string, string[]> = {
  solo: ["15 posts completos por mês", "Copy + legenda + CTA + hashtags", "Imagens IA com DALL·E 3", "Download em PDF"],
  pro: ["30 posts completos por mês", "Tudo do Solo +", "Padrão de feed avançado", "Suporte prioritário"],
  business: ["60 posts completos por mês", "Tudo do Pro +", "Múltiplas marcas/clientes", "Suporte dedicado"],
};

const HIGHLIGHT = "pro";

export default function Pricing() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const credits = useCredits();

  useEffect(() => {
    supabase.from("subscription_plans").select("*").order("sort_order").then(({ data }) => {
      if (data) setPlans(data as Plan[]);
    });
  }, []);

  const subscribe = async (slug: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/auth"); return; }
    setBusy(slug);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", { body: { planSlug: slug } });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  const portal = async () => {
    setBusy("portal");
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    } finally { setBusy(null); }
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="container mx-auto px-4 py-6 flex items-center justify-between max-w-5xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-bold">SmartPost<span className="text-primary">AI</span></span>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-16 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Escolha seu plano</h1>
          <p className="text-muted-foreground">1 crédito = 1 post completo (copy + legenda + imagem IA)</p>
          {credits.planSlug && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm">
              <span className="font-semibold text-primary capitalize">{credits.planSlug}</span>
              <span className="text-muted-foreground">· {credits.remaining}/{credits.total} créditos</span>
              <button onClick={portal} className="ml-2 underline text-primary text-xs">Gerenciar</button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((p) => {
            const isCurrent = credits.planSlug === p.slug;
            const isHi = p.slug === HIGHLIGHT;
            return (
              <div key={p.slug} className={`relative rounded-3xl p-6 border-2 bg-card flex flex-col ${
                isHi ? "border-primary shadow-glow" : "border-border"
              }`}>
                {isHi && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-white text-[10px] font-bold px-3 py-1 rounded-full">MAIS POPULAR</div>}
                <h3 className="text-xl font-bold">{p.name}</h3>
                <div className="mt-2 mb-4">
                  <span className="text-4xl font-extrabold">R${(p.price_cents / 100).toFixed(0)}</span>
                  <span className="text-muted-foreground text-sm">/mês</span>
                </div>
                <p className="text-sm text-primary font-semibold mb-4">{p.credits_per_month} créditos / mês</p>
                <ul className="space-y-2 text-sm mb-6 flex-1">
                  {(FEATURES[p.slug] ?? []).map((f) => (
                    <li key={f} className="flex items-start gap-2"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /><span>{f}</span></li>
                  ))}
                </ul>
                <Button
                  onClick={() => isCurrent ? portal() : subscribe(p.slug)}
                  disabled={busy === p.slug}
                  className={`w-full rounded-full ${isHi ? "bg-gradient-primary border-0 shadow-glow" : ""}`}
                  variant={isHi || isCurrent ? "default" : "outline"}
                >
                  {busy === p.slug ? <Loader2 className="w-4 h-4 animate-spin" /> : isCurrent ? "Gerenciar" : "Assinar"}
                </Button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
