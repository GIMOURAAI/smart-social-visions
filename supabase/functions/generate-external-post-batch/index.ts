import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;
// Public connection values for the owner's external data project. Privileged
// writes remain scoped by the signed-in user's JWT and the project's RLS.
const DATA_URL = "https://ezplkljerrgjjgczzlga.supabase.co";
const DATA_ANON_KEY = "sb_publishable_mkGKzgiNukP4c3ldF41V3g_q5zx9Ii0";

const SIZE_MAP: Record<string, "1024x1024" | "1024x1536" | "1536x1024"> = {
  "1:1": "1024x1024",
  "4:5": "1024x1536",
  "3:4": "1024x1536",
  "9:16": "1024x1536",
  "16:9": "1536x1024",
};

// === 9 TEMAs visuais PostLab (prompts cinematográficos por nicho) ===
const TEMAS: Record<string, { name: string; prompt: string; nichos: string[] }> = {
  "tema-01-saas": {
    name: "TEMA 01 — Clean Premium SaaS",
    nichos: ["saas", "tech", "startup", "empreendedorismo", "marketing"],
    prompt: `Ultra-premium SaaS editorial photo. Subject: confident professional (30s), standing near floor-to-ceiling glass window in modern minimalist office. Wearing tailored charcoal blazer over white dress shirt. Posture: relaxed power — one hand in pocket, slight forward lean. Expression: focused, visionary. Background: real blurred office interior — white walls, floating shelves with plants, MacBook Pro on desk, soft window light. Foreground: floating glassmorphism card with [PALETA DO CLIENTE] accent glow, Cormorant Garamond serif headline + Montserrat body text. Cinematic lighting: golden ratio composition, key light from window left. Color grading: desaturated cool tones with warm skin accent. Negative space left for text overlay. 8K, Hasselblad quality, editorial magazine cover.`,
  },
  "tema-02-moda": {
    name: "TEMA 02 — High Luxury Editorial Moda",
    nichos: ["moda", "beleza", "lifestyle", "luxo", "stylist"],
    prompt: `High fashion editorial photograph. Subject: elegant woman (late 20s), couture pose — slight S-curve, chin tilted up, gaze off-camera. Wearing structured blazer in ivory or [PALETA DO CLIENTE] color, minimal gold jewelry. Background: real blurred Haussmann corridor, marble floors, warm amber sconces. Foreground: translucent glassmorphism panel with bold Cormorant Garamond display font in gold foil effect, Montserrat subtext in white. Lighting: dramatic Rembrandt lighting, butterfly catch-light. Color palette: warm champagne, ivory, deep navy. Subject at golden ratio right third, negative space on left. Film grain texture. Vogue cover quality.`,
  },
  "tema-03-tech": {
    name: "TEMA 03 — Tech Futurista Dark Neon",
    nichos: ["tech", "cripto", "ia", "games", "programacao", "futurismo"],
    prompt: `Cyberpunk tech editorial. Subject: young professional (late 20s), seated at ultra-wide curved monitor setup. Wearing all-black tech-wear bomber jacket. Background: dark room with LED ambient strips in [PALETA DO CLIENTE] neon color, holographic data visualizations blurred. Multiple screens visible, particle effects in air. Foreground: glassmorphism dark card with neon border glow in [PALETA DO CLIENTE], monospace + Montserrat typography, floating data metrics. Lighting: neon underlighting from desk, rim light from screens, high contrast. Color grade: teal-orange split, deep blacks, HDR-punchy. 8K render quality.`,
  },
  "tema-04-resultado": {
    name: "TEMA 04 — Prova Social & Resultados",
    nichos: ["coach", "mentoria", "vendas", "resultados", "marketing digital"],
    prompt: `Before/after transformation editorial. Subject: confident person (30s), arms slightly open — power pose, genuine smile. Wearing smart casual — pressed chinos, clean button shirt. Background: real blurred modern coworking or home office — warm, aspirational. Foreground: glassmorphism card with split result panels — before/after numbers in Cormorant Garamond bold, checkmarks, testimonial quote in Montserrat. [PALETA DO CLIENTE] accent highlights. Lighting: bright, optimistic — large softbox from left, warm fill. Color grading: slightly warm, high saturation skin, clean whites. Nikon D850 commercial quality.`,
  },
  "tema-05-emocional": {
    name: "TEMA 05 — Dor Emocional & Conexão",
    nichos: ["coach", "psicologa", "terapeuta", "autoconhecimento", "bem-estar"],
    prompt: `Intimate emotional storytelling photograph. Subject: woman (30s), seated in cozy reading nook near window, relaxed contemplative posture. Soft authentic expression — real warmth, not performative. Wearing comfortable linen blouse, minimal styling. Background: real cozy interior — warm-toned walls, bookshelf, candle bokeh, morning light streaming in. Foreground: minimal glassmorphism card with [PALETA DO CLIENTE] warm accent, thin border, Cormorant Garamond italic headline — emotional, poetic copy. Lighting: gentle window key light, soft fill from opposite side, golden hour feel. Color grade: warm, slightly desaturated, nostalgic film tone.`,
  },
  "tema-06-saude": {
    name: "TEMA 06 — Médico & Saúde",
    nichos: ["medico", "saude", "nutricao", "estetica", "fisioterapia", "farmacia"],
    prompt: `Professional medical/health editorial. Subject: healthcare professional (30s), standing in modern clinic corridor. Wearing clean white lab coat over professional attire, stethoscope around neck. Posture: confident, approachable — warm smile. Background: real blurred clinical environment — white corridors, medical equipment visible. Foreground: clean glassmorphism card with [PALETA DO CLIENTE] blue or teal accent, Montserrat body, Cormorant Garamond authority headline, health stat inside card. Lighting: clean bright clinical light from above, soft fill, catchlight in eyes. Color grade: clean whites, cool clinical tones, warm skin balance. Medical journal quality.`,
  },
  "tema-07-imoveis": {
    name: "TEMA 07 — Imobiliária & Corretores",
    nichos: ["imoveis", "corretor", "imobiliaria", "real estate", "construtora"],
    prompt: `Luxury real estate editorial. Subject: real estate agent (30-40s), standing near premium property entrance or penthouse terrace. Wearing tailored suit in charcoal or navy, confident posture. Background: blurred luxury interior — marble floors, floor-to-ceiling windows, city skyline — or exterior with pool glimpse. Foreground: prestigious glassmorphism card with property metrics (price range, area, location badge) in [PALETA DO CLIENTE] gold/navy accent. Cormorant Garamond headline, Montserrat data. Lighting: warm late afternoon golden light. Color grade: warm, rich, aspirational. Premium property listing magazine quality.`,
  },
  "tema-08-juridico": {
    name: "TEMA 08 — Advogada & Jurídico",
    nichos: ["advogado", "juridico", "direito", "escritorio juridico", "consultoria juridica"],
    prompt: `Premium legal authority editorial. Subject: lawyer/attorney (30s), standing in front of legal library wall with leather-bound law books or glass-walled corner office. Wearing impeccably tailored dark suit — charcoal or deep navy. Posture: authoritative, composed. Background: real blurred law office — dark wood paneling, books. Foreground: prestige glassmorphism card with [PALETA DO CLIENTE] deep navy/gold accent, Cormorant Garamond serif headline for gravitas, Montserrat for data. Lighting: sophisticated dramatic side lighting, single strong key light. Color grade: dark, serious, prestigious — deep blacks, warm browns, gold accents. Business Insider legal journal cover quality.`,
  },
  "tema-09-influencer": {
    name: "TEMA 09 — Influenciadora & Personal Brand",
    nichos: ["influencer", "criador de conteudo", "personal brand", "digital", "lifestyle"],
    prompt: `Bold personal brand editorial. Subject: confident creator/influencer (20s-30s), dynamic pose — walking toward camera, hair movement, strong eye contact. Wearing expressive on-brand outfit in [PALETA DO CLIENTE] signature color — statement piece, curated casual-chic. Background: artistic location — neon-lit street, colorful mural wall, rooftop at golden hour, or minimal studio. Foreground: energetic glassmorphism card with [PALETA DO CLIENTE] vibrant accent, bold Montserrat headline (uppercase), engagement metrics chips floating. Lighting: dramatic fill, color gel from back in [PALETA DO CLIENTE] hue, soft front light. Color grade: vibrant, punchy, high saturation. Campaign photography quality.`,
  },
};

// === 4 blocos estratégicos PostLab ===
const POSTLAB_BLOCKS: Record<string, {
  name: string; description: string; frameworks: string; tipos: string[]; intencoes: string[];
}> = {
  dor: {
    name: "Dor",
    description: "Identifica e ressoa com a dor, frustração e desafio do avatar",
    frameworks: "SPIN Selling (Situation/Problem), Storytelling emocional",
    tipos: ["problema_identificacao", "frustracao_relato", "custo_inacao"],
    intencoes: ["identificação", "empatia", "curiosidade"],
  },
  autoridade: {
    name: "Autoridade",
    description: "Estabelece credibilidade, expertise e prova social",
    frameworks: "Authority positioning, Social proof, Case studies",
    tipos: ["prova_social", "resultado_cliente", "conquista_pessoal"],
    intencoes: ["confiança", "autoridade", "segurança"],
  },
  valor: {
    name: "Valor",
    description: "Entrega valor real — dicas, educação, transformação",
    frameworks: "AIDA (Attention/Interest/Desire), Value ladder",
    tipos: ["dica_acionavel", "lista_pratica", "insight_exclusivo"],
    intencoes: ["gratidão", "desejo", "engajamento"],
  },
  venda: {
    name: "Venda",
    description: "Converte — oferta, CTA, urgência, benefícios",
    frameworks: "AIDA (Action), Scarcity/Urgency, Objection breaking",
    tipos: ["oferta_direta", "quebra_objecao", "transformacao_promessa"],
    intencoes: ["urgência", "desejo", "ação"],
  },
};

function getTemaForNiche(niche: string, visualStyle: string) {
  if (TEMAS[visualStyle]) return TEMAS[visualStyle];
  const n = (niche || "").toLowerCase();
  for (const tema of Object.values(TEMAS)) {
    if (tema.nichos.some((x) => n.includes(x))) return tema;
  }
  return TEMAS["tema-01-saas"];
}

// === Assets da marca codificados em post_batches.brand_images ===
// Convenção: "logo::<url|dataURL>", "model::<url|dataURL>", "color::#hex",
// qualquer entrada sem prefixo é tratada como imagem de referência de estilo.
function parseBrandAssets(brandImages: unknown) {
  const list = Array.isArray(brandImages) ? (brandImages as string[]) : [];
  const assets = { logo: null as string | null, model: null as string | null, colors: [] as string[], refs: [] as string[] };
  for (const raw of list) {
    if (typeof raw !== "string" || !raw) continue;
    if (raw.startsWith("logo::")) assets.logo = raw.slice(6);
    else if (raw.startsWith("model::")) assets.model = raw.slice(7);
    else if (raw.startsWith("color::")) assets.colors.push(raw.slice(7));
    else if (raw.startsWith("ref::")) assets.refs.push(raw.slice(5));
    else assets.refs.push(raw);
  }
  return assets;
}

// === DESIGN SYSTEM obrigatório para toda arte gerada (modo rápido e Studio) ===
const RATIO_BASE: Record<string, string> = {
  "4:5": "1080x1350 (base canvas)",
  "3:4": "1080x1440 (proportionally adapted from the 1080x1350 base)",
  "1:1": "1080x1080 (proportionally adapted from the 1080x1350 base)",
  "9:16": "1080x1920 (proportionally adapted from the 1080x1350 base)",
  "16:9": "1920x1080 (proportionally adapted from the 1080x1350 base)",
};

function designSystemRules(format: string, assets: ReturnType<typeof parseBrandAssets>, palette: string) {
  const canvas = RATIO_BASE[format] ?? RATIO_BASE["4:5"];
  const colorLine = assets.colors.length
    ? `Brand palette (must dominate accents, typography highlights and light): ${assets.colors.join(", ")}.`
    : `Color direction: ${palette || "choose a sophisticated palette coherent with the niche"}.`;
  return `## DESIGN SYSTEM OBRIGATÓRIO (aplicar SEMPRE dentro de promptVisual, em inglês)
Escreva o promptVisual já incorporando estas regras de composição — o usuário não configura pixels:
- Canvas: ${canvas}. Reference grid based on 1080x1350.
- Side breathing room: minimum 80–100 px. Top margin 90–120 px. Bottom margin 90–120 px.
- Every essential element (headline, support text, icons, CTA, logo, important faces) strictly inside the safe area — nothing touching or bleeding off the edges.
- Main headline: 70–90 px equivalent, max 2 lines. Support text/subtitle: 28–36 px, up to 2 lines. Icons/bullets: 24–30 px. CTA/badge: 24–30 px.
- Preserve hierarchy, alignment, legibility and generous negative space. No visual clutter, no artificial frames or borders; full bleed imagery when the composition asks for it.
- Editorial premium aesthetic: realistic, sophisticated, with depth, dimensional lighting and professional finishing.
- ${colorLine}
${assets.logo ? `- A brand logo will be composed into the art: reserve a clean, uncluttered corner area for it inside the safe margins. The logo must never dominate the composition (max ~10% of the canvas width).` : ""}
${assets.model ? `- A reference photo of the brand's person/model is provided: preserve their facial identity, features and skin tone faithfully; place the face fully inside the safe area, never cropped by edges or covered by text.` : ""}
${assets.refs.length ? `- Style references provided by the user must be used ONLY as inspiration for composition, hierarchy, atmosphere, typography, contrast, depth and finishing — never as a copy of the reference piece. The margin/safe-area system above always prevails over the reference.` : ""}
`;
}

interface Overrides {
  tituloArte?: string | null;
  subtitulo?: string | null;
  cta?: string | null;
  styleMix?: string[];
  subjectPosition?: "auto" | "left" | "center" | "right";
  textSpace?: "auto" | "top" | "bottom" | "left" | "right" | "none";
}

const SUBJECT_POSITION_RULES: Record<string, string> = {
  left: "Place the main subject/product anchored on the LEFT third of the frame (rule of thirds), facing/leaning into the open space.",
  center: "Place the main subject/product CENTERED on the vertical axis, symmetrical and frontal.",
  right: "Place the main subject/product anchored on the RIGHT third of the frame (rule of thirds), facing/leaning into the open space.",
};

const TEXT_SPACE_RULES: Record<string, string> = {
  top: "Reserve a clean, uncluttered TOP band of the canvas for the typography — keep it low in detail and contrast so the headline and subtitle stay perfectly legible inside the safe area.",
  bottom: "Reserve a clean, uncluttered BOTTOM band of the canvas for the typography — keep it low in detail and contrast so the headline, subtitle and CTA stay perfectly legible inside the safe area.",
  left: "Reserve a clean, uncluttered LEFT column of the canvas for the typography — generous negative space, low detail, so text stays legible inside the safe area.",
  right: "Reserve a clean, uncluttered RIGHT column of the canvas for the typography — generous negative space, low detail, so text stays legible inside the safe area.",
  none: "Do NOT reserve a dedicated typography area: build a full-bleed image-led composition where any minimal text still sits comfortably inside the safe area with natural breathing room.",
};

function compositionRules(ov: Overrides): string {
  const lines: string[] = [];
  const sp = ov.subjectPosition && ov.subjectPosition !== "auto" ? SUBJECT_POSITION_RULES[ov.subjectPosition] : null;
  const ts = ov.textSpace && ov.textSpace !== "auto" ? TEXT_SPACE_RULES[ov.textSpace] : null;
  if (sp) lines.push(`- ${sp}`);
  if (ts) lines.push(`- ${ts}`);
  if (!lines.length) return "";
  return `\n## COMPOSIÇÃO DEFINIDA PELO USUÁRIO (obrigatória no promptVisual, em inglês)\n${lines.join("\n")}\nEstas escolhas de composição são obrigatórias, mas NUNCA sobrepõem o sistema de margens e safe area acima.\n`;
}

function compositionPromptSuffix(ov: Overrides): string {
  const sp = ov.subjectPosition && ov.subjectPosition !== "auto" ? SUBJECT_POSITION_RULES[ov.subjectPosition] : null;
  const ts = ov.textSpace && ov.textSpace !== "auto" ? TEXT_SPACE_RULES[ov.textSpace] : null;
  return `${sp ? ` ${sp}` : ""}${ts ? ` ${ts}` : ""}`;
}

function overrideRules(ov: Overrides): string {
  const lines: string[] = [];
  if (ov.tituloArte) lines.push(`- tituloArte: use EXATAMENTE este texto do usuário, sem reescrever: "${ov.tituloArte}"`);
  if (ov.subtitulo) lines.push(`- subtitulo: use EXATAMENTE este texto do usuário, sem reescrever: "${ov.subtitulo}"`);
  if (ov.cta) lines.push(`- cta: use EXATAMENTE esta chamada do usuário: "${ov.cta}"`);
  if (ov.styleMix?.length) {
    lines.push(`- Mix de referências de estilo escolhidas pelo usuário (${ov.styleMix.join(" + ")}): combine a estética, composição, iluminação, paleta e atmosfera destes estilos no promptVisual — sem copiar layout de nenhuma peça.`);
  }
  if (lines.length === 0) return "";
  return `\n## ENTRADAS DO USUÁRIO (prioridade máxima)\n${lines.join("\n")}\nOs textos fornecidos pelo usuário são definitivos: o promptVisual deve compor a arte em torno deles respeitando a hierarquia e o limite de 2 linhas.\n`;
}

function buildSystemPrompt(batch: any, blockKey: string, postCount: number, ov: Overrides = {}): string {
  const block = POSTLAB_BLOCKS[blockKey] ?? POSTLAB_BLOCKS.dor;
  const tema = getTemaForNiche(batch.niche, batch.visual_style);
  const assets = parseBrandAssets(batch.brand_images);
  const designRules = designSystemRules(batch.format, assets, batch.feed_pattern);


  return `Você é o POSTLAB AI — motor estratégico de conteúdo premium para Instagram brasileiro.
Combina copywriting avançado, psicologia do consumidor e direção de arte cinematográfica.

## METODOLOGIA POSTLAB
4 blocos estratégicos: Dor → Autoridade → Valor → Venda. Resultado: máquina de conteúdo que transforma seguidores em clientes.

## BLOCO ATUAL: ${block.name.toUpperCase()}
${block.description}
Frameworks: ${block.frameworks}
Tipos: ${block.tipos.join(", ")}
Intenções emocionais: ${block.intencoes.join(", ")}

## CONTEXTO DA MARCA
- Marca/Negócio: ${batch.brand_name}
- Nicho: ${batch.niche}
- Tema/Assunto: ${batch.theme}
- Objetivo: ${batch.objective}
- Tom de voz: ${batch.tone}
- Formato visual: ${batch.format}
- Padrão de cores do feed: ${batch.feed_pattern}

## ESTILO VISUAL — ${tema.name}
Template base obrigatório para o campo promptVisual (adapte ao nicho e substitua [PALETA DO CLIENTE] pelo padrão "${batch.feed_pattern}"):
${tema.prompt}

${designRules}
${overrideRules(ov)}
${compositionRules(ov)}

## VIRAL HOOKS — escolha um padrão DIFERENTE para cada post
1. "Eu nunca imaginei que [situação] poderia [resultado surpreendente]..."
2. "O erro que [avatar] comete todo dia (e como parar agora)"
3. "Ninguém fala isso sobre [tema], mas precisa ser dito:"
4. "[N] coisas que mudaram tudo na minha [área] — a #[X] me surpreendeu"
5. "Se você está lutando com [dor], leia isso antes de desistir"
6. "A verdade incômoda sobre [tema] que ninguém quer ouvir"
7. "Você está [ação] errado. Veja o que o top 1% faz"
8. "Isso não deveria funcionar. Funcionou. [resultado]"

## ESTRUTURA AIDA PARA LEGENDAS
A: Atenção — gancho que para o scroll (primeira linha)
I: Interesse — desenvolvimento envolvente
D: Desejo — benefício concreto / transformação
A: Ação — CTA claro e específico mencionando a marca ${batch.brand_name}

## REGRAS DE PRODUÇÃO
- Exatamente ${postCount} post(s) DIFERENTES entre si para o bloco ${block.name}
- Cada post: tipo diferente, ângulo diferente, viral hook diferente
- gancho: frase de impacto que para o scroll (máx ~15 palavras)
- tituloArte: título bold e impactante para o design visual (máx 6 palavras)
- subtitulo: complemento com contexto ou benefício (máx 8 palavras)
- textoArte: 3-6 linhas separadas por \\n para compor o design
- legenda: legenda completa rica e envolvente (200-500 chars com quebras + emojis)
- cta: chamada para ação específica e persuasiva, citando "${batch.brand_name}" quando fizer sentido
- hashtags: array com 10-15 hashtags relevantes (PT+EN, SEM o caractere #)
- storyComplementar: story que complementa o post (máx 150 chars)
- promptVisual: SEMPRE em INGLÊS, ultra-detalhado, baseado no TEMA acima, aplicando padrão de cores do cliente de forma clara na cena

- Responda SOMENTE em JSON válido neste formato exato:
{"posts":[{"gancho":"","tituloArte":"","subtitulo":"","textoArte":"","legenda":"","cta":"","hashtags":[],"storyComplementar":"","promptVisual":""}]}`;
}

interface PostJSON {
  gancho: string;
  tituloArte: string;
  subtitulo: string;
  textoArte: string;
  legenda: string;
  cta: string;
  hashtags: string[];
  storyComplementar: string;
  promptVisual: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "No auth" }, 401);

    const userClient = createClient(DATA_URL, DATA_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: "Not authenticated" }, 401);

    const body = await req.json();
    const { batchId, block, count, overrides } = body as {
      batchId: string; block: string; count: number; overrides?: Overrides;
    };
    const ov: Overrides = overrides ?? {};
    const blockKey = (block || "dor").toLowerCase();
    const postCount = Math.min(3, Math.max(1, Number(count) || 1));

    const admin = userClient;

    const { data: batch, error: batchErr } = await admin
      .from("post_batches").select("*").eq("id", batchId).eq("user_id", user.id).single();
    if (batchErr || !batch) return json({ error: "Batch not found" }, 404);

    const { data: credits } = await admin.from("user_credits")
      .select("credits_remaining").eq("user_id", user.id).single();
    if (!credits || credits.credits_remaining < postCount) {
      return json({ error: "INSUFFICIENT_CREDITS", remaining: credits?.credits_remaining ?? 0 }, 402);
    }

    // === GPT-4o com prompt PostLab completo ===
    const systemPrompt = buildSystemPrompt(batch, blockKey, postCount, ov);
    const blockName = (POSTLAB_BLOCKS[blockKey] ?? POSTLAB_BLOCKS.dor).name;

    const gptResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Crie ${postCount} post(s) estratégicos para o bloco ${blockName} da marca ${batch.brand_name}. Cada post deve usar um viral hook diferente e aplicar o framework do bloco.` },
        ],
        response_format: { type: "json_object" },
        temperature: 0.9,
        max_tokens: 4000,
      }),
    });

    if (!gptResp.ok) {
      const t = await gptResp.text();
      console.error("GPT error", t);
      return json({ error: "OpenAI text error", detail: t }, 500);
    }
    const gptData = await gptResp.json();
    const parsed = JSON.parse(gptData.choices[0].message.content);
    const posts: PostJSON[] = parsed.posts ?? [];
    if (posts.length === 0) return json({ error: "No posts generated" }, 500);

    for (const p of posts) {
      if (ov.tituloArte) p.tituloArte = ov.tituloArte;
      if (ov.subtitulo) p.subtitulo = ov.subtitulo;
      if (ov.cta) p.cta = ov.cta;
    }

    const size = SIZE_MAP[batch.format] ?? "1024x1024";
    const results: any[] = [];
    const assets = parseBrandAssets(batch.brand_images);
    const refImages = [assets.model, assets.logo, ...assets.refs].filter(Boolean).slice(0, 4) as string[];
    const promptSuffix = ` Composition system (mandatory): base 1080x1350 grid adapted to ${batch.format}; side breathing room 80-100px, top margin 90-120px, bottom margin 90-120px; all text, icons, CTA, logo and faces strictly inside the safe area, never touching the edges; headline 70-90px max 2 lines, subtitle 28-36px, icons 24-30px, CTA 24-30px; strong hierarchy, clean alignment, generous negative space, no clutter, no artificial borders, full bleed imagery, editorial premium realistic finishing with depth.${assets.colors.length ? ` Brand palette: ${assets.colors.join(", ")}.` : ""}${assets.logo ? " Place the provided brand logo discreetly in a corner inside the safe margins, never dominating the composition." : ""}${assets.model ? " Preserve faithfully the facial identity and features of the person in the provided reference photo." : ""}${assets.refs.length ? " Use the additional reference images only as inspiration for composition, atmosphere, typography and finishing — never copy them." : ""}${compositionPromptSuffix(ov)}`;

    // === GPT Image 2 + upload + persist + crédito ===
    for (let i = 0; i < posts.length; i++) {
      const p = posts[i];
      let imageUrl: string | null = null;

      try {
        const fullPrompt = `${p.promptVisual}${promptSuffix}`;
        let imgResp: Response;

        if (refImages.length > 0) {
          // Com logo / foto do modelo / referências → images/edits (multipart)
          const form = new FormData();
          form.append("model", "gpt-image-2");
          form.append("prompt", fullPrompt);
          form.append("size", size);
          form.append("quality", "medium");
          for (let r = 0; r < refImages.length; r++) {
            const blob = await toBlob(refImages[r]);
            if (blob) form.append("image[]", blob, `ref-${r}.png`);
          }
          imgResp = await fetch("https://api.openai.com/v1/images/edits", {
            method: "POST",
            headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
            body: form,
          });
          if (!imgResp.ok) {
            console.error("images/edits falhou, caindo para generations", await imgResp.text());
            imgResp = await generateImage(fullPrompt, size);
          }
        } else {
          imgResp = await generateImage(fullPrompt, size);
        }

        if (imgResp.ok) {
          const imgData = await imgResp.json();
          const b64 = imgData.data?.[0]?.b64_json;
          if (!b64) throw new Error("GPT Image 2 não retornou a imagem");
          const binary = Uint8Array.from(atob(b64), (char) => char.charCodeAt(0));
          const imgBin = binary.buffer;
          const path = `${user.id}/${batch.id}/${blockKey}-${Date.now()}-${i}.png`;
          const { error: upErr } = await admin.storage.from("post-images").upload(path, imgBin, {
            contentType: "image/png", upsert: true,
          });
          if (!upErr) {
            const { data: pub } = admin.storage.from("post-images").getPublicUrl(path);
            imageUrl = pub.publicUrl;
          }
        } else {
          console.error("GPT Image 2 error", await imgResp.text());
        }
      } catch (e) {
        console.error("Image gen failed", e);
      }

      const { data: postRow, error: postErr } = await admin.from("posts").insert({
        user_id: user.id,
        batch_id: batch.id,
        block: blockKey,
        position: i,
        title: p.tituloArte,
        content: p.legenda,
        format: batch.format,
        style: batch.visual_style,
        image_url: imageUrl,
        gancho: p.gancho,
        titulo_arte: p.tituloArte,
        subtitulo: p.subtitulo,
        texto_arte: p.textoArte,
        legenda: p.legenda,
        cta: p.cta,
        hashtags: p.hashtags,
        story_complementar: p.storyComplementar,
        image_prompt: p.promptVisual,
      }).select().single();

      if (postErr) { console.error("Insert post error", postErr); continue; }

      const { error: creditErr } = await admin.rpc("consume_credit", {
        _user_id: user.id, _amount: 1, _reason: `post:${blockKey}`, _post_id: postRow.id,
      });
      if (creditErr) console.error("Credit consume failed (post created)", creditErr);

      results.push(postRow);
    }

    await admin.from("post_batches").update({
      status: blockKey === "dor" && posts.length <= (batch.pilot_count ?? 1) ? "piloto" : "gerando",
    }).eq("id", batch.id);

    const { data: newCredits } = await admin.from("user_credits")
      .select("credits_remaining").eq("user_id", user.id).single();

    return json({ posts: results, credits_remaining: newCredits?.credits_remaining ?? 0, blockName });
  } catch (e: any) {
    console.error("Fatal", e);
    return json({ error: e?.message ?? "unknown" }, 500);
  }
});

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function generateImage(prompt: string, size: string) {
  return fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-image-2",
      prompt,
      n: 1,
      size,
      quality: "medium",
      output_format: "png",
    }),
  });
}

// Converte data URL ou URL pública em Blob para enviar ao images/edits
async function toBlob(src: string): Promise<Blob | null> {
  try {
    if (src.startsWith("data:")) {
      const [meta, b64] = src.split(",");
      const mime = meta.match(/data:([^;]+)/)?.[1] ?? "image/png";
      const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
      return new Blob([bytes], { type: mime });
    }
    if (src.startsWith("http")) {
      const r = await fetch(src);
      if (!r.ok) return null;
      return await r.blob();
    }
    return null;
  } catch (e) {
    console.error("toBlob failed", e);
    return null;
  }
}
