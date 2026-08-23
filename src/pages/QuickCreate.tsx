import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditsBadge } from "@/components/CreditsBadge";
import { useCredits } from "@/hooks/useCredits";
import { StepResult } from "@/components/create/StepResult";
import type { GeneratedPost } from "@/pages/Create";
import {
  BrandKit, EMPTY_KIT, compressImage, encodeBrandAssets, hasBrandKit, loadBrandKit, saveBrandKit,
} from "@/lib/brandKit";
import {
  ArrowLeft, Sparkles, Zap, ImagePlus, X, RefreshCw, Wand2, ChevronDown, SlidersHorizontal,
} from "lucide-react";

const NICHOS = [
  "Moda", "Beleza", "Estética", "Saúde", "Nutrição", "Fitness", "Psicologia",
  "Imóveis", "Jurídico", "Tech / SaaS", "Marketing", "Coach / Mentoria",
  "Gastronomia", "Pet", "Educação", "Serviços locais",
];

const OBJETIVOS: { id: string; label: string; block: string; theme: string }[] = [
  { id: "vender", label: "Vender agora", block: "venda", theme: "Post de venda direta com oferta clara, benefício e CTA forte." },
  { id: "autoridade", label: "Mostrar autoridade", block: "autoridade", theme: "Post que constrói autoridade e credibilidade no nicho." },
  { id: "valor", label: "Entregar valor / dica", block: "valor", theme: "Post educativo com dica prática e acionável para a audiência." },
  { id: "conexao", label: "Gerar conexão", block: "dor", theme: "Post emocional que ressoa com a dor e o desejo do público." },
  { id: "lancamento", label: "Lançamento", block: "venda", theme: "Post de lançamento gerando curiosidade, antecipação e urgência." },
  { id: "prova", label: "Prova social", block: "autoridade", theme: "Post de prova social com resultado real e depoimento." },
];

const ESTILOS = [
  { id: "tema-01-saas", label: "Clean Premium", icon: "💼" },
  { id: "tema-02-moda", label: "Luxo Editorial", icon: "👗" },
  { id: "tema-03-tech", label: "Dark Neon", icon: "⚡" },
  { id: "tema-04-resultado", label: "Resultados", icon: "🏆" },
  { id: "tema-05-emocional", label: "Emocional", icon: "💛" },
  { id: "tema-06-saude", label: "Saúde", icon: "🩺" },
  { id: "tema-07-imoveis", label: "Imóveis", icon: "🏛️" },
  { id: "tema-08-juridico", label: "Jurídico", icon: "⚖️" },
  { id: "tema-09-influencer", label: "Personal Brand", icon: "✨" },
];

const PALETAS: { label: string; colors: string[] }[] = [
  { label: "Roxo premium", colors: ["#0f0a1f", "#7c3aed", "#e9d5ff"] },
  { label: "Nude luxo", colors: ["#fdf4ec", "#c9a84c", "#1a1a2e"] },
  { label: "Preto & ouro", colors: ["#0a0a0a", "#d4af37", "#f5f0e8"] },
  { label: "Azul clínico", colors: ["#ffffff", "#0ea5e9", "#0c4a6e"] },
  { label: "Verde natural", colors: ["#f4f7f2", "#2f6b46", "#c8b78a"] },
  { label: "Vibrante pop", colors: ["#ff6b9d", "#c4a7e7", "#f5d020"] },
];

const FORMATOS: { id: "4:5" | "1:1" | "9:16" | "16:9"; label: string }[] = [
  { id: "4:5", label: "4:5 Feed" },
  { id: "1:1", label: "1:1 Quadrado" },
  { id: "9:16", label: "9:16 Story" },
  { id: "16:9", label: "16:9 Wide" },
];

function chipClass(active: boolean) {
  return `px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
    active
      ? "bg-gradient-to-r from-[hsl(258_70%_45%)] to-[hsl(275_75%_60%)] text-white border-transparent shadow-glow"
      : "bg-card text-foreground border-border hover:border-primary/50"
  }`;
}

export default function QuickCreate() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const credits = useCredits();

  const [niche, setNiche] = useState("");
  const [objective, setObjective] = useState("valor");
  const [style, setStyle] = useState("");
  const [format, setFormat] = useState<"4:5" | "1:1" | "9:16" | "16:9">("4:5");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [useKit, setUseKit] = useState(false);
  const [kit, setKit] = useState<BrandKit>({ ...EMPTY_KIT });
  const [savedKit, setSavedKit] = useState<BrandKit>({ ...EMPTY_KIT });

  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  const [batchId, setBatchId] = useState<string | null>(null);

  const logoRef = useRef<HTMLInputElement>(null);
  const modelRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate("/auth");
    })();
    const stored = loadBrandKit();
    setSavedKit(stored);
    if (hasBrandKit(stored)) {
      setUseKit(true);
      setKit(stored);
      if (stored.niche) setNiche(stored.niche);
      if (stored.visualStyle) setStyle(stored.visualStyle);
    }
  }, [navigate]);

  const toggleKit = (on: boolean) => {
    setUseKit(on);
    if (on) {
      setKit(savedKit);
      if (savedKit.niche) setNiche(savedKit.niche);
      if (savedKit.visualStyle) setStyle(savedKit.visualStyle);
    } else {
      setKit({ ...EMPTY_KIT });
    }
  };

  const upload = async (file: File | undefined, target: "logo" | "model") => {
    if (!file) return;
    try {
      const dataUrl = await compressImage(file, target === "logo" ? 512 : 896);
      setKit((k) => ({ ...k, [target]: dataUrl }));
      setShowAdvanced(true);
    } catch (e: any) {
      toast({ title: "Falha na imagem", description: e?.message, variant: "destructive" });
    }
  };

  const mapRow = (r: any, obj: typeof OBJETIVOS[number]): GeneratedPost => ({
    tema: obj.theme,
    bloco: r.block ? r.block.charAt(0).toUpperCase() + r.block.slice(1) : "",
    objetivo: obj.label,
    tipoConteudo: r.block ?? "",
    intencaoEmocional: "",
    gancho: r.gancho ?? "",
    tituloArte: r.titulo_arte ?? r.title ?? "",
    subtituloArte: r.subtitulo ?? "",
    textoArte: r.texto_arte ?? "",
    legenda: r.legenda ?? r.content ?? "",
    cta: r.cta ?? "",
    hashtags: Array.isArray(r.hashtags) ? r.hashtags.map((h: string) => `#${h}`).join(" ") : (r.hashtags ?? ""),
    estiloVisual: style,
    promptVisual: r.image_prompt ?? "",
    storyComplementar: r.story_complementar ?? "",
    imageUrl: r.image_url ?? undefined,
    creditoCusto: 1,
  });

  const generate = async () => {
    if (!niche) {
      toast({ title: "Escolha o nicho", description: "Selecione um segmento para começar.", variant: "destructive" });
      return;
    }
    if (credits.remaining < 1) {
      navigate("/pricing");
      return;
    }
    const obj = OBJETIVOS.find((o) => o.id === objective) ?? OBJETIVOS[2];
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");

      const chosenStyle = style || "auto";
      const paletteLabel = kit.colors.length ? kit.colors.join(", ") : "definido pela IA conforme nicho e estilo";

      const { data: batch, error: batchErr } = await supabase.from("post_batches").insert({
        user_id: user.id,
        brand_name: kit.brandName || niche,
        niche,
        theme: obj.theme,
        objective: obj.label,
        tone: "profissional e próximo",
        visual_style: chosenStyle,
        brand_images: encodeBrandAssets({ logo: kit.logo, model: kit.model, colors: kit.colors }),
        feed_pattern: paletteLabel,
        format,
        days: 1,
        total_posts: 1,
        pilot_count: 1,
      }).select("id").single();
      if (batchErr || !batch) throw new Error(batchErr?.message ?? "Falha ao criar lote");
      setBatchId(batch.id);

      const { data, error } = await supabase.functions.invoke("generate-post-batch", {
        body: { batchId: batch.id, block: obj.block, count: 1 },
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
      setPosts(rows.map((r: any) => mapRow(r, obj)));
      if (useKit) {
        const next = { ...kit, niche, visualStyle: chosenStyle };
        saveBrandKit(next);
        setSavedKit(next);
      }
      credits.refresh();
    } catch (e: any) {
      toast({ title: "Erro ao gerar", description: e?.message ?? "Erro inesperado", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const openInStudio = () => {
    const obj = OBJETIVOS.find((o) => o.id === objective) ?? OBJETIVOS[2];
    sessionStorage.setItem("spa_studio_handoff", JSON.stringify({
      batchId,
      posts,
      wizard: {
        brandName: kit.brandName || niche,
        niche,
        theme: obj.theme,
        objective: [obj.label],
        tone: "profissional e próximo",
        visualStyle: style || "auto",
        brandImages: encodeBrandAssets({ logo: kit.logo, model: kit.model, colors: kit.colors }),
        feedPattern: kit.colors.length ? kit.colors.join(", ") : "definido pela IA",
        format,
      },
      currentBlock: OBJETIVOS.findIndex((o) => o.id === objective) >= 0 ? 0 : 0,
    }));
    navigate("/create?from=quick");
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="glass border-b border-white/40 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground leading-none">Criação Rápida</p>
              <p className="text-[11px] text-muted-foreground">1 post pronto em poucos cliques</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CreditsBadge />
            <Button variant="ghost" size="sm" className="rounded-full" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {posts.length === 0 ? (
          <div className="glass rounded-3xl p-6 md:p-8 shadow-card space-y-7">
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">O que vamos publicar hoje?</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Só o essencial — as regras profissionais de design (margens, respiro, hierarquia) já vão aplicadas.
              </p>
            </div>

            <section>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">1. Seu nicho</p>
              <div className="flex flex-wrap gap-2">
                {NICHOS.map((n) => (
                  <button key={n} onClick={() => setNiche(n)} className={chipClass(niche === n)}>{n}</button>
                ))}
              </div>
            </section>

            <section>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">2. Objetivo do post</p>
              <div className="flex flex-wrap gap-2">
                {OBJETIVOS.map((o) => (
                  <button key={o.id} onClick={() => setObjective(o.id)} className={chipClass(objective === o.id)}>{o.label}</button>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">3. Estilo visual</p>
                <span className="text-[11px] text-muted-foreground">opcional — a IA escolhe</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {ESTILOS.map((e) => (
                  <button key={e.id} onClick={() => setStyle(style === e.id ? "" : e.id)} className={chipClass(style === e.id)}>
                    <span className="mr-1">{e.icon}</span>{e.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Opcionais */}
            <section className="rounded-2xl border border-border bg-card/60 overflow-hidden">
              <button
                onClick={() => setShowAdvanced((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <SlidersHorizontal className="w-4 h-4 text-primary" />
                  Marca, logo, foto e cores (opcional)
                </span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition ${showAdvanced ? "rotate-180" : ""}`} />
              </button>

              {showAdvanced && (
                <div className="px-4 pb-5 space-y-5 border-t border-border pt-4">
                  <label className="flex items-center gap-3 text-sm font-medium text-foreground">
                    <input
                      type="checkbox"
                      checked={useKit}
                      onChange={(e) => toggleKit(e.target.checked)}
                      className="w-4 h-4 accent-[hsl(258_70%_45%)]"
                    />
                    Usar identidade da minha marca (salva para as próximas criações)
                  </label>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1.5">Nome da marca</p>
                    <Input
                      value={kit.brandName}
                      onChange={(e) => setKit((k) => ({ ...k, brandName: e.target.value }))}
                      placeholder="Ex.: Studio Aura"
                      className="rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {(["logo", "model"] as const).map((t) => (
                      <div key={t}>
                        <p className="text-xs font-semibold text-muted-foreground mb-1.5">
                          {t === "logo" ? "Logo" : "Sua foto / modelo"}
                        </p>
                        {kit[t] ? (
                          <div className="relative rounded-xl overflow-hidden border border-border aspect-square bg-muted">
                            <img src={kit[t] as string} alt={t} className="w-full h-full object-cover" />
                            <button
                              onClick={() => setKit((k) => ({ ...k, [t]: null }))}
                              className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-background/80 flex items-center justify-center"
                              aria-label="Remover"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => (t === "logo" ? logoRef : modelRef).current?.click()}
                            className="w-full aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/60 flex flex-col items-center justify-center gap-1 text-muted-foreground text-xs"
                          >
                            <ImagePlus className="w-5 h-5" />
                            Enviar
                          </button>
                        )}
                      </div>
                    ))}
                    <input ref={logoRef} type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files?.[0], "logo")} />
                    <input ref={modelRef} type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files?.[0], "model")} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Paleta da marca</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {PALETAS.map((p) => {
                        const active = p.colors.join() === kit.colors.join();
                        return (
                          <button
                            key={p.label}
                            onClick={() => setKit((k) => ({ ...k, colors: active ? [] : p.colors }))}
                            className={`flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-semibold transition ${
                              active ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40"
                            }`}
                          >
                            <span className="flex">
                              {p.colors.map((c) => (
                                <span key={c} className="w-3.5 h-3.5 rounded-full -ml-1 first:ml-0 border border-white/60" style={{ background: c }} />
                              ))}
                            </span>
                            {p.label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-3">
                      {[0, 1, 2].map((i) => (
                        <input
                          key={i}
                          type="color"
                          value={kit.colors[i] ?? "#7c3aed"}
                          onChange={(e) => {
                            const next = [...kit.colors];
                            while (next.length < 3) next.push("#7c3aed");
                            next[i] = e.target.value;
                            setKit((k) => ({ ...k, colors: next }));
                          }}
                          className="w-10 h-10 rounded-lg border border-border bg-transparent cursor-pointer"
                          aria-label={`Cor ${i + 1}`}
                        />
                      ))}
                      {kit.colors.length > 0 && (
                        <button onClick={() => setKit((k) => ({ ...k, colors: [] }))} className="text-xs text-muted-foreground underline">
                          limpar cores
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Formato</p>
                    <div className="flex flex-wrap gap-2">
                      {FORMATOS.map((f) => (
                        <button key={f.id} onClick={() => setFormat(f.id)} className={chipClass(format === f.id)}>{f.label}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>

            <div className="pt-2 flex flex-col gap-2">
              <Button
                onClick={generate}
                disabled={loading}
                className="w-full h-12 rounded-full bg-gradient-primary border-0 shadow-glow text-base font-bold"
              >
                {loading ? "Criando seu post..." : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Gerar post agora
                  </>
                )}
              </Button>
              <p className="text-center text-[11px] text-muted-foreground">
                Custa 1 crédito · saldo {credits.remaining} ·{" "}
                <button onClick={() => navigate("/create")} className="underline">
                  quero o Smart Post Studio completo
                </button>
              </p>
            </div>
          </div>
        ) : (
          <div className="glass rounded-3xl p-6 md:p-8 shadow-card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">Seu post está pronto ✨</h1>
                <p className="text-sm text-muted-foreground">Gere outra versão ou continue no Studio completo.</p>
              </div>
            </div>

            <StepResult
              posts={posts}
              onRegenerate={generate}
              onRegenerateImage={() => toast({ title: "Em breve", description: "Regeneração individual de imagem será liberada em breve." })}
              onEnhance={() => toast({ title: "Em breve", description: "Melhoria de qualidade será liberada em breve." })}
            />

            <div className="flex flex-wrap gap-2 justify-end mt-8 pt-6 border-t border-border">
              <Button variant="outline" className="rounded-full" onClick={() => setPosts([])}>
                Novo post rápido
              </Button>
              <Button variant="outline" className="rounded-full" onClick={generate} disabled={loading}>
                <RefreshCw className="w-4 h-4 mr-2" />
                {loading ? "Gerando..." : "Gerar novamente (1 crédito)"}
              </Button>
              <Button onClick={openInStudio} className="rounded-full bg-gradient-primary border-0 shadow-glow">
                <Sparkles className="w-4 h-4 mr-2" />
                Editar no Studio
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
