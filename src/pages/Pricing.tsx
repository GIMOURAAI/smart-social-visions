import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCredits } from "@/hooks/useCredits";
import { ArrowLeft, ArrowRight, Check, Sparkles, Loader2 } from "lucide-react";

interface Plan {
  slug: string;
  name: string;
  price_cents: number;
  credits_per_month: number;
}

const DISPLAY: Record<string, { name: string; price: number; credits: number; description: string; features: string[] }> = {
  solo: {
    name: "Solo",
    price: 4990,
    credits: 15,
    description: "Para quem está começando",
    features: ["15 posts completos por mês", "Imagem + copy + legenda", "CTA e hashtags", "Download do conteúdo"],
  },
  pro: {
    name: "Pro",
    price: 8990,
    credits: 30,
    description: "Um mês inteiro de conteúdo",
    features: ["30 posts completos por mês", "Tudo do Solo", "Padrão de feed", "Mais estilos visuais", "Suporte prioritário"],
  },
  business: {
    name: "Studio",
    price: 16990,
    credits: 60,
    description: "Para designers e social medias",
    features: ["60 posts completos por mês", "Tudo do Pro", "Múltiplas marcas", "Uso profissional", "Suporte dedicado"],
  },
};

const FALLBACK: Plan[] = [
  { slug: "solo", name: "Solo", price_cents: 4990, credits_per_month: 15 },
  { slug: "pro", name: "Pro", price_cents: 8990, credits_per_month: 30 },
  { slug: "business", name: "Studio", price_cents: 16990, credits_per_month: 60 },
];

export default function Pricing() {
  const [remotePlans, setRemotePlans] = useState<Plan[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const credits = useCredits();

  useEffect(() => {
    supabase.from("subscription_plans").select("*").order("sort_order").then(({ data }) => {
      if (data) setRemotePlans(data as Plan[]);
    });
  }, []);

  const plans = useMemo(() => {
    const source = remotePlans.length ? remotePlans : FALLBACK;
    return source.map((plan) => ({
      ...plan,
      name: DISPLAY[plan.slug]?.name ?? plan.name,
      price_cents: DISPLAY[plan.slug]?.price ?? plan.price_cents,
      credits_per_month: DISPLAY[plan.slug]?.credits ?? plan.credits_per_month,
    }));
  }, [remotePlans]);

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
    <main className="min-h-screen overflow-hidden bg-[#050608] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-70 [background:radial-gradient(circle_at_50%_0%,rgba(124,92,255,.17),transparent_30%),radial-gradient(circle_at_5%_90%,rgba(84,45,150,.10),transparent_28%)]" />
      <div className="noise-overlay" />

      <header className="relative z-10 mx-auto flex h-24 w-[min(1200px,calc(100%-40px))] items-center justify-between">
        <button onClick={() => navigate(-1)} className="glass-button !py-3"><ArrowLeft className="h-4 w-4" /> Voltar</button>
        <div className="flex items-center gap-3"><span className="glass-icon"><Sparkles className="h-4 w-4" /></span><span className="font-semibold">Smart Post AI</span></div>
      </header>

      <section className="relative z-10 mx-auto w-[min(1200px,calc(100%-40px))] pb-24 pt-14">
        <div className="reveal-up text-center">
          <p className="mb-4 text-xs uppercase tracking-[.16em] text-violet-400">Planos</p>
          <h1 className="text-[clamp(46px,6vw,78px)] font-[430] leading-[1] tracking-[-.06em]">Escolha o plano<br /><span className="text-violet-400">ideal para você.</span></h1>
          <p className="mx-auto mt-7 max-w-xl text-lg text-white/42">Cada crédito gera um post completo com imagem, copy, legenda, CTA e hashtags.</p>

          {credits.planSlug && (
            <div className="glass-label mx-auto mt-7 !normal-case !tracking-normal">
              Plano {credits.planSlug} · {credits.remaining}/{credits.total} créditos
              <button onClick={portal} className="ml-3 underline">Gerenciar</button>
            </div>
          )}
        </div>

        <div className="mt-20 grid gap-5 md:grid-cols-3">
          {plans.map((plan) => {
            const info = DISPLAY[plan.slug];
            const isCurrent = credits.planSlug === plan.slug;
            const popular = plan.slug === "pro";
            return (
              <article key={plan.slug} className={`price-glass ${popular ? "price-popular" : ""}`}>
                {popular && <div className="popular-badge">MAIS ESCOLHIDO</div>}
                <p className="text-sm text-white/45">{info?.description}</p>
                <h2 className="mt-4 text-2xl font-semibold">{plan.name}</h2>
                <div className="mt-7 flex items-end gap-2">
                  <span className="text-5xl font-medium tracking-[-.05em]">R$ {(plan.price_cents / 100).toFixed(2).replace(".", ",")}</span>
                  <span className="pb-1 text-sm text-white/34">/mês</span>
                </div>
                <p className="mt-3 text-sm font-medium text-violet-300">{plan.credits_per_month} posts completos por mês</p>
                <ul className="mt-8 min-h-[170px] space-y-3 text-sm text-white/58">
                  {(info?.features ?? []).map((feature) => (
                    <li key={feature} className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />{feature}</li>
                  ))}
                </ul>
                <button
                  onClick={() => isCurrent ? portal() : subscribe(plan.slug)}
                  disabled={busy === plan.slug}
                  className={popular ? "primary-cta mt-8 w-full justify-center" : "glass-button mt-8 w-full justify-center"}
                >
                  {busy === plan.slug ? <Loader2 className="h-4 w-4 animate-spin" /> : isCurrent ? "Gerenciar plano" : <>Escolher plano <ArrowRight className="h-4 w-4" /></>}
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
