import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditsBadge } from "@/components/CreditsBadge";
import { useCredits } from "@/hooks/useCredits";
import { StepResult } from "@/components/create/StepResult";
import { StyleGallery, STYLE_PRESETS } from "@/components/create/StyleGallery";
import type { GeneratedPost } from "@/pages/Create";
import {
  BrandKit, EMPTY_KIT, compressImage, encodeBrandAssets, hasBrandKit, loadBrandKit, saveBrandKit,
} from "@/lib/brandKit";
import {
  ArrowLeft, Sparkles, Zap, ImagePlus, X, RefreshCw, Wand2, ChevronDown, SlidersHorizontal,
  User, Palette, KeyRound, Images, Type, MousePointerClick, Crop, LayoutTemplate, MoveHorizontal,
} from "lucide-react";

const NICHOS = [
  "Empreendedorismo", "Moda", "Beleza", "Estética", "Saúde", "Nutrição", "Fitness", "Psicologia",
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

const PALETAS: { label: string; colors: string[] }[] = [
  { label: "Roxo premium", colors: ["#0f0a1f", "#7c3aed", "#e9d5ff"] },
  { label: "Nude luxo", colors: ["#fdf4ec", "#c9a84c", "#1a1a2e"] },
  { label: "Preto & ouro", colors: ["#0a0a0a", "#d4af37", "#f5f0e8"] },
  { label: "Azul clínico", colors: ["#ffffff", "#0ea5e9", "#0c4a6e"] },
  { label: "Verde natural", colors: ["#f4f7f2", "#2f6b46", "#c8b78a"] },
  { label: "Vibrante pop", colors: ["#ff6b9d", "#c4a7e7", "#f5d020"] },
];

type Format = "4:5" | "3:4" | "1:1" | "9:16" | "16:9";

const FORMATOS: { id: Format; label: string; sub: string }[] = [
  { id: "4:5", label: "4:5", sub: "Feed" },
  { id: "3:4", label: "3:4", sub: "Retrato" },
  { id: "1:1", label: "1:1", sub: "Quadrado" },
  { id: "9:16", label: "9:16", sub: "Story" },
  { id: "16:9", label: "16:9", sub: "Wide" },
];

type SubjectPosition = "auto" | "left" | "center" | "right";
type TextSpace = "auto" | "top" | "bottom" | "left" | "right" | "none";

const SUBJECT_POSITIONS: { id: SubjectPosition; label: string }[] = [
  { id: "auto", label: "Automático" },
  { id: "left", label: "Esquerda" },
  { id: "center", label: "Centro" },
  { id: "right", label: "Direita" },
];

const TEXT_SPACES: { id: TextSpace; label: string }[] = [
  { id: "auto", label: "Automático" },
  { id: "top", label: "Superior" },
  { id: "bottom", label: "Inferior" },
  { id: "left", label: "Esquerda" },
  { id: "right", label: "Direita" },
  { id: "none", label: "Nenhum" },
];

function chipClass(active: boolean) {
  return `px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
    active
      ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow"
      : "spa-panel text-muted-foreground hover:text-foreground hover:border-primary/40"
  }`;
}

function smallChipClass(active: boolean) {
  return `px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
    active
      ? "bg-primary/20 text-foreground border-primary/50 spa-glow-ring"
      : "spa-panel text-muted-foreground hover:text-foreground"
  }`;
}

function Block({
  icon, title, hint, children,
}: { icon: React.ReactNode; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="spa-panel rounded-2xl p-4">
      <div className="flex items-baseline justify-between gap-3 mb-2.5">
        <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <span className="text-primary">{icon}</span>
          {title}
        </p>
        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function ModeToggle({
  aiLabel = "IA cria",
  value,
  onChange,
}: { aiLabel?: string; value: "ai" | "manual"; onChange: (v: "ai" | "manual") => void }) {
  return (
    <div className="inline-flex rounded-full spa-panel p-0.5">
      {(["ai", "manual"] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={`px-3 py-1 rounded-full text-[11px] font-bold transition ${
            value === m ? "bg-primary/20 text-foreground" : "text-muted-foreground"
          }`}
        >
          {m === "ai" ? aiLabel : "Eu escrevo"}
        </button>
      ))}
    </div>
  );
}

export default function QuickCreate() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const credits = useCredits();

  const [niche, setNiche] = useState("");
  const [objective, setObjective] = useState("valor");
  const [styleMix, setStyleMix] = useState<string[]>([]);
  const [format, setFormat] = useState<Format>("4:5");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [useKit, setUseKit] = useState(false);
  const [kit, setKit] = useState<BrandKit>({ ...EMPTY_KIT });
  const [savedKit, setSavedKit] = useState<BrandKit>({ ...EMPTY_KIT });

  // Composição
  const [subjectPosition, setSubjectPosition] = useState<SubjectPosition>("auto");
  const [textSpace, setTextSpace] = useState<TextSpace>("auto");

  // Textos: IA cria ou usuário escreve
  const [titleMode, setTitleMode] = useState<"ai" | "manual">("ai");
  const [title, setTitle] = useState("");
  const [subtitleMode, setSubtitleMode] = useState<"ai" | "manual">("ai");
  const [subtitle, setSubtitle] = useState("");
  const [ctaMode, setCtaMode] = useState<"ai" | "manual">("ai");
  const [cta, setCta] = useState("");

  // Cores: automático ou manual
  const [colorMode, setColorMode] = useState<"auto" | "manual">("auto");
  // Referências visuais enviadas pelo usuário (máx 3) — só estilo, não personagem
  const [styleRefs, setStyleRefs] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  const [batchId, setBatchId] = useState<string | null>(null);
  const [tab, setTab] = useState<"galeria" | "resultado">("galeria");


  const logoRef = useRef<HTMLInputElement>(null);
  const modelRef = useRef<HTMLInputElement>(null);
  const refsRef = useRef<HTMLInputElement>(null);

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
      if (stored.visualStyle && STYLE_PRESETS.some((s) => s.id === stored.visualStyle)) {
        setStyleMix([stored.visualStyle]);
      }
      if (stored.colors.length) setColorMode("manual");
    }
  }, [navigate]);

  const toggleKit = (on: boolean) => {
    setUseKit(on);
    if (on) {
      setKit(savedKit);
      if (savedKit.niche) setNiche(savedKit.niche);
      if (savedKit.colors.length) setColorMode("manual");
    } else {
      setKit({ ...EMPTY_KIT });
      setColorMode("auto");
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

  const uploadRefs = async (files: FileList | null) => {
    if (!files?.length) return;
    const remaining = 3 - styleRefs.length;
    if (remaining <= 0) return;
    try {
      const urls = await Promise.all(
        Array.from(files).slice(0, remaining).map((f) => compressImage(f, 768))
      );
      setStyleRefs((r) => [...r, ...urls].slice(0, 3));
    } catch (e: any) {
      toast({ title: "Falha na referência", description: e?.message, variant: "destructive" });
    }
  };

  const effectiveColors = colorMode === "manual" ? kit.colors : [];
  const primaryStyle = styleMix[0] ?? "auto";
  const styleMixLabels = styleMix
    .map((id) => STYLE_PRESETS.find((s) => s.id === id)?.label)
    .filter(Boolean) as string[];

  const brandAssets = () =>
    encodeBrandAssets({ logo: kit.logo, model: kit.model, colors: effectiveColors, refs: styleRefs });

  const overrides = () => ({
    tituloArte: titleMode === "manual" && title.trim() ? title.trim() : null,
    subtitulo: subtitleMode === "manual" && subtitle.trim() ? subtitle.trim() : null,
    cta: ctaMode === "manual" && cta.trim() ? cta.trim() : null,
    styleMix: styleMixLabels,
    subjectPosition,
    textSpace,
  });

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
    estiloVisual: primaryStyle,
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

      const paletteLabel = effectiveColors.length
        ? effectiveColors.join(", ")
        : "definido pela IA conforme nicho e estilo";

      const { data: batch, error: batchErr } = await supabase.from("post_batches").insert({
        user_id: user.id,
        brand_name: kit.brandName || niche,
        niche,
        theme: obj.theme,
        objective: obj.label,
        tone: "profissional e próximo",
        visual_style: primaryStyle,
        brand_images: brandAssets(),
        feed_pattern: paletteLabel,
        format,
        days: 1,
        total_posts: 1,
        pilot_count: 1,
      }).select("id").single();
      if (batchErr || !batch) throw new Error(batchErr?.message ?? "Falha ao criar lote");
      setBatchId(batch.id);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Sua sessão expirou. Entre novamente.");
      const response = await fetch(
        "https://bwzvydfpoilmzhsaxpfa.supabase.co/functions/v1/generate-external-post-batch",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ batchId: batch.id, block: obj.block, count: 1, overrides: overrides() }),
        },
      );
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        const message = data?.error ?? "Falha ao gerar o post";
        const ctx = { status: response.status };
        if (ctx?.status === 402 || /INSUFFICIENT_CREDITS/i.test(error.message)) {
          toast({ title: "Sem créditos", description: "Faça upgrade do plano para continuar.", variant: "destructive" });
          navigate("/pricing");
          return;
        }
        throw new Error(message);
      }
      const rows = Array.isArray(data?.posts) ? data.posts : [];
      if (rows.length === 0) throw new Error("Nenhum post foi gerado. Tente novamente.");
      setPosts(rows.map((r: any) => mapRow(r, obj)));
      setTab("resultado");

      if (useKit) {
        const next = { ...kit, niche, visualStyle: primaryStyle, colors: effectiveColors };
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
        visualStyle: primaryStyle,
        brandImages: brandAssets(),
        feedPattern: effectiveColors.length ? effectiveColors.join(", ") : "definido pela IA",
        format,
      },
      currentBlock: 0,
    }));
    navigate("/create?from=quick");
  };

  const hasResult = posts.length > 0;

  return (
    <div className="spa-dark min-h-screen bg-background text-foreground">
      <div className="spa-ambient min-h-screen">
        <header className="spa-surface border-0 border-b sticky top-0 z-30">
          <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow shrink-0">
                <Zap className="w-4.5 h-4.5 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold leading-none truncate">Criação Rápida</p>
                <p className="text-[11px] text-muted-foreground truncate">Construtor · 1 post pronto em poucos cliques</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <CreditsBadge />
              <Button variant="ghost" size="sm" className="rounded-full" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="w-4 h-4 sm:mr-1" /> <span className="hidden sm:inline">Voltar</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="lg:flex lg:items-start">
          {/* ————— Rail de controles (esquerda) ————— */}
          <aside className="lg:w-[380px] xl:w-[420px] shrink-0 border-b lg:border-b-0 lg:border-r spa-hairline lg:h-[calc(100vh-61px)] lg:sticky lg:top-[61px] lg:overflow-y-auto">
            <div className="p-4 space-y-3">
              <Block icon={<Sparkles className="w-3.5 h-3.5" />} title="Nicho" hint="obrigatório">
                <div className="flex flex-wrap gap-1.5">
                  {NICHOS.map((n) => (
                    <button key={n} onClick={() => setNiche(n)} className={smallChipClass(niche === n)}>{n}</button>
                  ))}
                </div>
              </Block>

              <Block icon={<Wand2 className="w-3.5 h-3.5" />} title="Objetivo do post">
                <div className="flex flex-wrap gap-1.5">
                  {OBJETIVOS.map((o) => (
                    <button key={o.id} onClick={() => setObjective(o.id)} className={smallChipClass(objective === o.id)}>{o.label}</button>
                  ))}
                </div>
              </Block>

              <Block icon={<Crop className="w-3.5 h-3.5" />} title="Dimensões">
                <div className="flex flex-wrap gap-1.5">
                  {FORMATOS.map((f) => (
                    <button key={f.id} onClick={() => setFormat(f.id)} className={smallChipClass(format === f.id)}>
                      {f.sub} <span className="font-normal opacity-70">{f.label}</span>
                    </button>
                  ))}
                </div>
              </Block>

              <Block icon={<MoveHorizontal className="w-3.5 h-3.5" />} title="Posição do sujeito/produto" hint="opcional">
                <div className="flex flex-wrap gap-1.5">
                  {SUBJECT_POSITIONS.map((p) => (
                    <button key={p.id} onClick={() => setSubjectPosition(p.id)} className={smallChipClass(subjectPosition === p.id)}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </Block>

              <Block icon={<LayoutTemplate className="w-3.5 h-3.5" />} title="Espaço para texto" hint="opcional">
                <div className="flex flex-wrap gap-1.5">
                  {TEXT_SPACES.map((t) => (
                    <button key={t.id} onClick={() => setTextSpace(t.id)} className={smallChipClass(textSpace === t.id)}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </Block>

              <Block icon={<Sparkles className="w-3.5 h-3.5" />} title="Nome da marca" hint="opcional">
                <Input
                  value={kit.brandName}
                  onChange={(e) => setKit((k) => ({ ...k, brandName: e.target.value }))}
                  placeholder="Ex.: Studio Aura"
                  className="rounded-xl bg-transparent h-9"
                />
              </Block>

              {/* Upload de imagem: foto principal e logo */}
              <div className="grid grid-cols-2 gap-3">
                {(["model", "logo"] as const).map((t) => (
                  <Block
                    key={t}
                    icon={t === "model" ? <User className="w-3.5 h-3.5" /> : <ImagePlus className="w-3.5 h-3.5" />}
                    title={t === "model" ? "Foto principal" : "Logo"}
                  >
                    {kit[t] ? (
                      <div className="relative rounded-xl overflow-hidden border spa-hairline aspect-square bg-muted">
                        <img src={kit[t] as string} alt={t === "model" ? "Foto principal" : "Logo"} className="w-full h-full object-cover" />
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
                        className="w-full aspect-square rounded-xl border-2 border-dashed spa-hairline hover:border-primary/60 flex flex-col items-center justify-center gap-1 text-muted-foreground text-[11px]"
                      >
                        <ImagePlus className="w-5 h-5" />
                        Enviar
                      </button>
                    )}
                  </Block>
                ))}
                <input ref={logoRef} type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files?.[0], "logo")} />
                <input ref={modelRef} type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files?.[0], "model")} />
              </div>

              {/* Referências enviadas pelo usuário */}
              <Block icon={<Images className="w-3.5 h-3.5" />} title="Referências selecionadas" hint={`${styleRefs.length}/3`}>
                <p className="text-[10px] text-muted-foreground mb-2 leading-tight">
                  Só inspiração de estética, luz, paleta e atmosfera — o layout nunca é copiado.
                </p>
                <div className="flex gap-2 flex-wrap">
                  {styleRefs.map((url, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border spa-hairline">
                      <img src={url} alt={`Referência ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => setStyleRefs((r) => r.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-background/80 flex items-center justify-center"
                        aria-label="Remover referência"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {styleRefs.length < 3 && (
                    <button
                      onClick={() => refsRef.current?.click()}
                      className="w-16 h-16 rounded-xl border-2 border-dashed spa-hairline hover:border-primary/60 flex items-center justify-center text-muted-foreground"
                      aria-label="Adicionar referência"
                    >
                      <ImagePlus className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <input ref={refsRef} type="file" accept="image/*" multiple hidden onChange={(e) => uploadRefs(e.target.files)} />
              </Block>

              {/* Cor principal */}
              <div className="spa-panel rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2.5 gap-3">
                  <p className="text-xs font-bold flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-primary" /> Cor principal
                  </p>
                  <div className="inline-flex rounded-full spa-panel p-0.5">
                    {(["auto", "manual"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setColorMode(m)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold transition ${
                          colorMode === m ? "bg-primary/20 text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {m === "auto" ? "Auto" : "Manual"}
                      </button>
                    ))}
                  </div>
                </div>

                {colorMode === "auto" ? (
                  <p className="text-[11px] text-muted-foreground">
                    A IA define a paleta ideal a partir do nicho e dos estilos selecionados.
                  </p>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {PALETAS.map((p) => {
                        const active = p.colors.join() === kit.colors.join();
                        return (
                          <button
                            key={p.label}
                            onClick={() => setKit((k) => ({ ...k, colors: active ? [] : p.colors }))}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full border text-[11px] font-semibold transition ${
                              active ? "border-primary/50 bg-primary/15 text-foreground" : "spa-panel text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <span className="flex">
                              {p.colors.map((c) => (
                                <span key={c} className="w-3 h-3 rounded-full -ml-1 first:ml-0 border border-foreground/20" style={{ background: c }} />
                              ))}
                            </span>
                            {p.label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {[0, 1, 2].map((i) => (
                        <input
                          key={i}
                          type="color"
                          value={kit.colors[i] ?? "#14b8a6"}
                          onChange={(e) => {
                            const next = [...kit.colors];
                            while (next.length < 3) next.push("#14b8a6");
                            next[i] = e.target.value;
                            setKit((k) => ({ ...k, colors: next }));
                          }}
                          className="w-9 h-9 rounded-lg border spa-hairline bg-transparent cursor-pointer"
                          aria-label={`Cor ${i + 1}`}
                        />
                      ))}
                      {kit.colors.length > 0 && (
                        <button onClick={() => setKit((k) => ({ ...k, colors: [] }))} className="text-[11px] text-muted-foreground underline">
                          limpar
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Textos */}
              <Block icon={<Type className="w-3.5 h-3.5" />} title="Título">
                <div className="mb-2"><ModeToggle value={titleMode} onChange={setTitleMode} /></div>
                {titleMode === "manual" ? (
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Máx. 6 palavras" className="rounded-xl bg-transparent h-9" />
                ) : (
                  <p className="text-[11px] text-muted-foreground">A IA escreve com hierarquia e no máximo 2 linhas.</p>
                )}
              </Block>

              <Block icon={<Type className="w-3.5 h-3.5" />} title="Subtítulo">
                <div className="mb-2"><ModeToggle value={subtitleMode} onChange={setSubtitleMode} /></div>
                {subtitleMode === "manual" ? (
                  <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Complemento curto" className="rounded-xl bg-transparent h-9" />
                ) : (
                  <p className="text-[11px] text-muted-foreground">A IA cria o apoio complementando o título.</p>
                )}
              </Block>

              <Block icon={<MousePointerClick className="w-3.5 h-3.5" />} title="CTA" hint="opcional">
                <div className="mb-2"><ModeToggle value={ctaMode} onChange={setCtaMode} /></div>
                {ctaMode === "manual" ? (
                  <Input value={cta} onChange={(e) => setCta(e.target.value)} placeholder="Ex.: Agende sua avaliação" className="rounded-xl bg-transparent h-9" />
                ) : (
                  <p className="text-[11px] text-muted-foreground">A IA escolhe a chamada ideal ao objetivo.</p>
                )}
              </Block>

              {/* Extras */}
              <section className="spa-panel rounded-2xl overflow-hidden">
                <button
                  onClick={() => setShowAdvanced((v) => !v)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left gap-3"
                >
                  <span className="flex items-center gap-2 text-xs font-bold">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                    Identidade da marca e API
                  </span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition ${showAdvanced ? "rotate-180" : ""}`} />
                </button>

                {showAdvanced && (
                  <div className="px-4 pb-4 space-y-3 border-t spa-hairline pt-3">
                    <label className="flex items-start gap-2.5 text-[11px] font-medium leading-tight">
                      <input
                        type="checkbox"
                        checked={useKit}
                        onChange={(e) => toggleKit(e.target.checked)}
                        className="w-4 h-4 accent-[hsl(var(--primary))] mt-0.5"
                      />
                      Usar identidade da minha marca (salva para as próximas criações)
                    </label>

                    <div className="rounded-xl border border-dashed spa-hairline px-3 py-2.5 flex items-start gap-2.5">
                      <KeyRound className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[11px] font-semibold">
                          Usar minha API <span className="ml-1 text-[10px] font-bold uppercase tracking-wide text-primary">em breve</span>
                        </p>
                        <p className="text-[10px] text-muted-foreground leading-tight">
                          Hoje a geração usa a infraestrutura do Smart Post AI.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              <div className="sticky bottom-0 pt-2 pb-1 bg-gradient-to-t from-background via-background/90 to-transparent">
                <Button
                  onClick={generate}
                  disabled={loading}
                  className="w-full h-12 rounded-full bg-gradient-primary border-0 shadow-glow text-sm font-bold"
                >
                  {loading ? "Construindo..." : (
                    <>
                      <Wand2 className="w-4.5 h-4.5 mr-2" />
                      Gerar post agora
                    </>
                  )}
                </Button>
                <p className="text-center text-[10px] text-muted-foreground mt-1.5">
                  1 crédito · saldo {credits.remaining} ·{" "}
                  <button onClick={() => navigate("/create")} className="underline">Studio completo</button>
                </p>
              </div>
            </div>
          </aside>

          {/* ————— Área de estilos / resultado (direita) ————— */}
          <main className="flex-1 min-w-0 p-4 sm:p-6">
            <div className="flex items-center gap-1.5 mb-4">
              {[
                { id: "galeria" as const, label: "Galeria de estilos" },
                { id: "resultado" as const, label: "Resultado" },
              ].map((t) => {
                const active = (hasResult ? tab : "galeria") === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    disabled={t.id === "resultado" && !hasResult}
                    className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wide transition ${
                      active ? "bg-primary/20 text-foreground spa-glow-ring" : "spa-panel text-muted-foreground hover:text-foreground disabled:opacity-40"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
              {styleMix.length > 0 && (
                <span className="ml-auto text-[10px] uppercase tracking-wide text-muted-foreground">
                  estilos ativos: {styleMix.length}/3
                </span>
              )}
            </div>

            {(hasResult ? tab : "galeria") === "galeria" ? (
              <div className="spa-surface rounded-3xl p-4 sm:p-6 shadow-card">
                <div className="mb-4">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight">O que vamos publicar hoje?</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Escolha até 3 estilos — margens, safe area, hierarquia e respiro já vão aplicados automaticamente.
                  </p>
                </div>
                <StyleGallery value={styleMix} onChange={setStyleMix} max={3} />
              </div>
            ) : (
              <div className="spa-surface rounded-3xl p-4 sm:p-6 shadow-card">
                <div className="mb-5">
                  <h1 className="text-xl font-bold tracking-tight">Seu post está pronto ✨</h1>
                  <p className="text-sm text-muted-foreground">Gere outra versão ou continue no Studio completo.</p>
                </div>

                <StepResult
                  posts={posts}
                  onRegenerate={generate}
                  onRegenerateImage={() => toast({ title: "Em breve", description: "Regeneração individual de imagem será liberada em breve." })}
                  onEnhance={() => toast({ title: "Em breve", description: "Melhoria de qualidade será liberada em breve." })}
                />

                <div className="flex flex-wrap gap-2 justify-end mt-8 pt-6 border-t spa-hairline">
                  <Button variant="outline" className="rounded-full" onClick={() => { setPosts([]); setTab("galeria"); }}>
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
      </div>
    </div>
  );
}

