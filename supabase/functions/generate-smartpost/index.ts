import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SmartPostRequest {
  niche: string;
  theme: string;
  objective: string;
  tone: string;
  visualStyle: string;
  feedPattern: string;
  brandName: string;
  format: string;
  quantity: number;
  imageQuantity: number;
  brandImages?: string[];
  blockIndex?: number;
  customStylePrompt?: string;
  customStyleMeta?: {
    paletaCores: string[];
    atmosfera: string;
    tipografia: string;
    composicao: string;
  };
  // Two-phase editorial flow
  textOnly?: boolean;
  totalPosts?: number;
  postsForImage?: GeneratedPost[];
  // Personalization
  brandLogo?: string;
  brandLogoDescription?: string;
  modelPhoto?: string;
  modelDescription?: string;
}

interface GeneratedPost {
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

// 9 TEMA visual style templates mapped to nichos
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

// PostLab 4-block structure
const POSTLAB_BLOCKS = [
  {
    id: "dor",
    name: "Dor",
    description: "Identifica e ressoa com a dor, frustração e desafio do avatar",
    frameworks: "SPIN Selling (Situation/Problem), Storytelling emocional",
    tipos: ["problema_identificacao", "frustracao_relato", "custo_inacao"],
    intencoes: ["identificação", "empatia", "curiosidade"],
  },
  {
    id: "autoridade",
    name: "Autoridade",
    description: "Estabelece credibilidade, expertise e prova social",
    frameworks: "Authority positioning, Social proof, Case studies",
    tipos: ["prova_social", "resultado_cliente", "conquista_pessoal"],
    intencoes: ["confiança", "autoridade", "segurança"],
  },
  {
    id: "valor",
    name: "Valor",
    description: "Entrega valor real — dicas, educação, transformação",
    frameworks: "AIDA (Attention/Interest/Desire), Value ladder",
    tipos: ["dica_acionavel", "lista_pratica", "insight_exclusivo"],
    intencoes: ["gratidão", "desejo", "engajamento"],
  },
  {
    id: "venda",
    name: "Venda",
    description: "Converte — oferta, CTA, urgência, benefícios",
    frameworks: "AIDA (Action), Scarcity/Urgency, Objection breaking",
    tipos: ["oferta_direta", "quebra_objecao", "transformacao_promessa"],
    intencoes: ["urgência", "desejo", "ação"],
  },
];

function getTemaForNiche(niche: string, visualStyle: string): typeof TEMAS[string] {
  if (TEMAS[visualStyle]) return TEMAS[visualStyle];
  const nicheLower = niche.toLowerCase();
  for (const [, tema] of Object.entries(TEMAS)) {
    if (tema.nichos.some((n) => nicheLower.includes(n))) return tema;
  }
  return TEMAS["tema-01-saas"];
}

function buildSystemPrompt(req: SmartPostRequest, blockIndex: number): string {
  const block = POSTLAB_BLOCKS[blockIndex % 4];
  const temaInfo = getTemaForNiche(req.niche, req.visualStyle);
  const postsInBlock = Math.min(req.quantity, 3);

  const hasCustomStyle = !!req.customStylePrompt;
  const visualSection = hasCustomStyle
    ? `## ESTILO VISUAL — Estilo personalizado extraído da imagem de referência
Paleta de cores: ${req.customStyleMeta?.paletaCores?.join(", ") ?? "extraída da referência"}
Atmosfera: ${req.customStyleMeta?.atmosfera ?? ""}
Tipografia: ${req.customStyleMeta?.tipografia ?? ""}
Composição: ${req.customStyleMeta?.composicao ?? ""}

BASE DO PROMPT VISUAL (adapte para cada post mantendo o estilo):
${req.customStylePrompt}`
    : `## ESTILO VISUAL — ${temaInfo.name}
Template base para prompts visuais:
${temaInfo.prompt}`;

  return `Você é o POSTLAB AI — motor estratégico de conteúdo premium para redes sociais. Combina copywriting avançado, psicologia do consumidor e direção de arte cinematográfica.

## METODOLOGIA POSTLAB
4 blocos estratégicos: Dor → Autoridade → Valor → Venda. Cada bloco tem 3 posts. Resultado: máquina de conteúdo que transforma seguidores em clientes.

## BLOCO ATUAL: ${block.name.toUpperCase()} (Bloco ${blockIndex + 1}/4)
${block.description}
Frameworks: ${block.frameworks}
Tipos de conteúdo: ${block.tipos.join(", ")}
Intenções emocionais: ${block.intencoes.join(", ")}

## CONTEXTO DO CLIENTE
- Marca/Negócio: ${req.brandName}
- Nicho: ${req.niche}
- Tema/Assunto: ${req.theme}
- Objetivo: ${req.objective}
- Tom de voz: ${req.tone}
- Formato visual: ${req.format}
- Padrão de cores do feed: ${req.feedPattern}

${visualSection}

## VIRAL HOOKS — escolha padrões diferentes para cada post
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
A: Ação — CTA claro e específico

## REGRAS DE PRODUÇÃO
- Exatamente ${postsInBlock} posts distintos para o bloco ${block.name}
- Cada post: tipo diferente, ângulo diferente, hook diferente
- gancho: frase de impacto que para o scroll — sem limite fixo, seja criativo
- tituloArte: título bold e impactante para o design visual
- subtituloArte: complementa o título com contexto ou benefício
- textoArte: 3-6 linhas para compor o design — cada linha em novo parágrafo
- legenda: legendas completas, ricas e envolventes — sem cortar o conteúdo
- cta: chamada para ação específica e persuasiva
- hashtags: 10-15 hashtags relevantes em português e inglês
- storyComplementar: story completo e detalhado que complementa o post
- promptVisual: SEMPRE em inglês, ultra-detalhado, cinematográfico
- Adapte o template visual para o nicho "${req.niche}" e aplique o padrão de feed "${req.feedPattern}" nos fundos
- Use o nome da marca "${req.brandName}" nas legendas, CTAs e onde fizer sentido

## FORMATO DE SAÍDA — JSON VÁLIDO APENAS
{"posts":[{"tema":"string","bloco":"${block.name}","objetivo":"string","tipoConteudo":"string","intencaoEmocional":"string","gancho":"string impactante","tituloArte":"string bold para design","subtituloArte":"string complemento","textoArte":"string linhas separadas por \\n","legenda":"string completa e envolvente","cta":"string persuasivo","hashtags":"string hashtags separadas por espaço","estiloVisual":"${temaInfo.name}","promptVisual":"string ultra-detailed English cinematic prompt","storyComplementar":"string story completo","creditoCusto":1}]}`;
}

function buildTextOnlySystemPrompt(req: SmartPostRequest, totalPosts: number): string {
  const temaInfo = getTemaForNiche(req.niche, req.visualStyle);
  const hasCustomStyle = !!req.customStylePrompt;

  const visualSection = hasCustomStyle
    ? `## ESTILO VISUAL — Estilo personalizado extraído da imagem de referência
Paleta de cores: ${req.customStyleMeta?.paletaCores?.join(", ") ?? "extraída da referência"}
Atmosfera: ${req.customStyleMeta?.atmosfera ?? ""}
Tipografia: ${req.customStyleMeta?.tipografia ?? ""}
Composição: ${req.customStyleMeta?.composicao ?? ""}`
    : `## ESTILO VISUAL — ${temaInfo.name}`;

  return `Você é o POSTLAB AI — motor estratégico de conteúdo premium para redes sociais. Combina copywriting avançado, psicologia do consumidor e direção de arte cinematográfica.

## METODOLOGIA POSTLAB
4 blocos estratégicos: Dor → Autoridade → Valor → Venda. Cada bloco tem 3 posts. Resultado: máquina de conteúdo que transforma seguidores em clientes.

## CONTEXTO DO CLIENTE
- Marca/Negócio: ${req.brandName}
- Nicho: ${req.niche}
- Tema/Assunto: ${req.theme}
- Objetivo: ${req.objective}
- Tom de voz: ${req.tone}
- Formato visual: ${req.format}
- Padrão de cores do feed: ${req.feedPattern}

${visualSection}

## TAREFA: GERAR TODOS OS ${totalPosts} POSTS — APENAS TEXTO, SEM IMAGENS
Distribua os posts entre os 4 blocos estratégicos na sequência: Dor → Autoridade → Valor → Venda (repetindo o ciclo se necessário).

Para ${totalPosts} posts, distribua assim:
- Bloco Dor: posts 1, 5, 9, 13... (1ª, 5ª, 9ª posição)
- Bloco Autoridade: posts 2, 6, 10, 14...
- Bloco Valor: posts 3, 7, 11, 15...
- Bloco Venda: posts 4, 8, 12, 16...

## VIRAL HOOKS — escolha padrões diferentes para cada post
1. "Eu nunca imaginei que [situação] poderia [resultado surpreendente]..."
2. "O erro que [avatar] comete todo dia (e como parar agora)"
3. "Ninguém fala isso sobre [tema], mas precisa ser dito:"
4. "[N] coisas que mudaram tudo na minha [área] — a #[X] me surpreendeu"
5. "Se você está lutando com [dor], leia isso antes de desistir"
6. "A verdade incômoda sobre [tema] que ninguém quer ouvir"
7. "Você está [ação] errado. Veja o que o top 1% faz"
8. "Isso não deveria funcionar. Funcionou. [resultado]"

## REGRAS DE PRODUÇÃO
- Exatamente ${totalPosts} posts distintos cobrindo todos os 4 blocos
- Cada post: tipo diferente, ângulo diferente, hook diferente
- gancho: frase de impacto que para o scroll
- tituloArte: título bold e impactante para o design visual
- subtituloArte: complementa o título com contexto ou benefício
- textoArte: 3-6 linhas para compor o design — cada linha em novo parágrafo
- legenda: legendas completas, ricas e envolventes
- cta: chamada para ação específica e persuasiva
- hashtags: 10-15 hashtags relevantes em português e inglês
- storyComplementar: story completo e detalhado
- promptVisual: SEMPRE em inglês, ultra-detalhado, cinematográfico (será usado depois para gerar imagem)
- Use o nome da marca "${req.brandName}" nas legendas, CTAs e onde fizer sentido

## FORMATO DE SAÍDA — JSON VÁLIDO APENAS
{"posts":[{"tema":"string","bloco":"Dor|Autoridade|Valor|Venda","objetivo":"string","tipoConteudo":"string","intencaoEmocional":"string","gancho":"string impactante","tituloArte":"string bold para design","subtituloArte":"string complemento","textoArte":"string linhas separadas por \\n","legenda":"string completa e envolvente","cta":"string persuasivo","hashtags":"string hashtags separadas por espaço","estiloVisual":"string","promptVisual":"string ultra-detailed English cinematic prompt","storyComplementar":"string story completo","creditoCusto":1}]}`;
}

function buildTextOverlayPrompt(
  post: GeneratedPost,
  modelDescription?: string,
  brandName?: string,
  brandLogoDescription?: string
): string {
  const firstLine = post.textoArte ? post.textoArte.split("\n")[0] : "";
  const modelClause = modelDescription
    ? `Subject appearance: ${modelDescription}. `
    : "";
  const brandClause = brandName
    ? `Bottom right corner: small brand name "${brandName}" in clean white font. `
    : "";
  const logoClause = brandLogoDescription
    ? `Brand logo: ${brandLogoDescription} — placed bottom right corner. `
    : "";
  const overlay = `CRITICAL TEXT OVERLAY — the following text MUST appear visibly in the image, positioned on the LEFT SIDE with generous padding: Large bold white Poppins Black title: "${post.tituloArte}". Below it in purple/violet (#7c3aed) accent: "${post.subtituloArte}". A thin 2px horizontal gradient line (purple to cyan, 40px wide). Below that medium white font: "${firstLine}". Text occupies left 45% of image. Right 55%: the visual scene. ${modelClause}${brandClause}${logoClause}Dark or appropriate background ensuring text is fully legible. Professional Instagram post card, magazine quality.`;
  return `${post.promptVisual} | ${overlay}`;
}

async function generatePostImage(
  promptVisual: string,
  openaiKey: string,
  modelPhotoBase64?: string
): Promise<string | undefined> {
  try {
    // When a model photo is provided, use the edits endpoint to preserve the person's exact appearance
    if (modelPhotoBase64) {
      const base64Data = modelPhotoBase64.includes(",")
        ? modelPhotoBase64.split(",")[1]
        : modelPhotoBase64;
      const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
      const imageBlob = new Blob([imageBytes], { type: "image/png" });

      const formData = new FormData();
      formData.append("image", imageBlob, "model.png");
      formData.append("prompt", promptVisual);
      formData.append("n", "1");
      formData.append("size", "1024x1024");
      formData.append("model", "gpt-image-1");

      const resp = await fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: { "Authorization": `Bearer ${openaiKey}` },
        body: formData,
      });
      if (!resp.ok) {
        // Fallback to standard generation if edit fails
        console.error("Image edit failed, falling back to generation");
      } else {
        const data = await resp.json();
        const b64 = data.data?.[0]?.b64_json;
        if (b64) return `data:image/png;base64,${b64}`;
        if (data.data?.[0]?.url) return data.data[0].url;
      }
    }

    // Standard DALL-E 3 generation (no model photo or fallback)
    const resp = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: promptVisual,
        n: 1,
        size: "1024x1024",
        quality: "hd",
        style: "vivid",
      }),
    });
    if (!resp.ok) return undefined;
    const data = await resp.json();
    return data.data?.[0]?.url;
  } catch {
    return undefined;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const openaiKey = Deno.env.get("OPENAI_API_KEY");
  if (!openaiKey) {
    return new Response(
      JSON.stringify({ error: "OPENAI_API_KEY not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const body: SmartPostRequest = await req.json();
    const {
      niche, theme, objective, tone, format, quantity, imageQuantity = 0,
      brandImages, blockIndex = 0, feedPattern = "", brandName = "",
      customStylePrompt, customStyleMeta,
      textOnly = false, totalPosts, postsForImage,
      modelDescription, brandLogo, brandLogoDescription, modelPhoto,
    } = body;

    // Mode: generate images for already-approved posts
    if (postsForImage && postsForImage.length > 0) {
      const postsWithImages = [...postsForImage];
      await Promise.all(
        postsWithImages.map(async (post, i) => {
          const richPrompt = buildTextOverlayPrompt(post, modelDescription, brandName, brandLogoDescription);
          const url = await generatePostImage(richPrompt, openaiKey, modelPhoto);
          if (url) postsWithImages[i] = { ...postsWithImages[i], imageUrl: url };
        })
      );
      return new Response(
        JSON.stringify({ posts: postsWithImages }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mode: text-only — generate ALL posts text without images
    if (textOnly) {
      const count = totalPosts ?? quantity;
      const systemPrompt = buildTextOnlySystemPrompt(body, count);
      const userText = `Crie exatamente ${count} posts estratégicos para ${brandName} no nicho ${niche}, tema: ${theme}, objetivo: ${objective}, tom: ${tone}. Distribua pelos 4 blocos Dor/Autoridade/Valor/Venda em sequência. Retorne JSON com array "posts" contendo todos os ${count} posts.`;

      const messages: any[] = [{ role: "system", content: systemPrompt }];
      if (brandImages && brandImages.length > 0) {
        messages.push({
          role: "user",
          content: [
            { type: "text", text: userText + "\n\nAnalise as imagens de referência e adapte o estilo visual." },
            ...brandImages.slice(0, 3).map((img: string) => ({
              type: "image_url",
              image_url: { url: img, detail: "low" },
            })),
          ],
        });
      } else {
        messages.push({ role: "user", content: userText });
      }

      const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages,
          response_format: { type: "json_object" },
          temperature: 0.85,
          max_tokens: 8000,
        }),
      });

      if (!openaiResp.ok) {
        const err = await openaiResp.json().catch(() => ({}));
        const status = openaiResp.status;
        if (status === 401) throw new Error("Chave OpenAI inválida ou expirada.");
        if (status === 429) throw new Error("Limite de uso OpenAI atingido. Tente em instantes.");
        throw new Error(err?.error?.message ?? `OpenAI error ${status}`);
      }

      const openaiData = await openaiResp.json();
      const rawContent = openaiData.choices?.[0]?.message?.content;
      if (!rawContent) throw new Error("OpenAI retornou resposta vazia.");

      const parsed = JSON.parse(rawContent);
      const posts: GeneratedPost[] = Array.isArray(parsed.posts) ? parsed.posts : [];
      if (posts.length === 0) throw new Error("Nenhum post foi gerado. Tente novamente.");

      return new Response(
        JSON.stringify({ posts, totalPosts: posts.length }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mode: original — generate text + images for a single block
    const systemPrompt = buildSystemPrompt(body, blockIndex);
    const postsToGenerate = Math.min(quantity, 3);
    const blockName = POSTLAB_BLOCKS[blockIndex % 4].name;

    const userText = `Crie ${postsToGenerate} posts estratégicos para o bloco ${blockName}:
- Nicho: ${niche}
- Tema: ${theme}
- Objetivo: ${objective}
- Tom: ${tone}
- Formato: ${format}
Cada post deve ter hook viral único e aplicar o framework do bloco ${blockName}.`;

    const messages: any[] = [{ role: "system", content: systemPrompt }];

    if (brandImages && brandImages.length > 0) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: userText + "\n\nAnalise as imagens de referência e adapte o estilo visual mantendo a essência sem copiar o design." },
          ...brandImages.slice(0, 3).map((img: string) => ({
            type: "image_url",
            image_url: { url: img, detail: "low" },
          })),
        ],
      });
    } else {
      messages.push({ role: "user", content: userText });
    }

    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        response_format: { type: "json_object" },
        temperature: 0.85,
        max_tokens: 4000,
      }),
    });

    if (!openaiResp.ok) {
      const err = await openaiResp.json().catch(() => ({}));
      const status = openaiResp.status;
      if (status === 401) throw new Error("Chave OpenAI inválida ou expirada.");
      if (status === 429) throw new Error("Limite de uso OpenAI atingido. Tente em instantes.");
      throw new Error(err?.error?.message ?? `OpenAI error ${status}`);
    }

    const openaiData = await openaiResp.json();
    const rawContent = openaiData.choices?.[0]?.message?.content;
    if (!rawContent) throw new Error("OpenAI retornou resposta vazia.");

    const parsed = JSON.parse(rawContent);
    const posts: GeneratedPost[] = Array.isArray(parsed.posts) ? parsed.posts : [];
    if (posts.length === 0) throw new Error("Nenhum post foi gerado. Tente novamente.");

    // Generate images with text overlay embedded in the prompt
    if (imageQuantity > 0) {
      const toImage = posts.slice(0, Math.min(imageQuantity, posts.length));
      await Promise.all(
        toImage.map(async (post, i) => {
          const richPrompt = buildTextOverlayPrompt(post, modelDescription, brandName, brandLogoDescription);
          const url = await generatePostImage(richPrompt, openaiKey, modelPhoto);
          if (url) posts[i].imageUrl = url;
        })
      );
    }

    return new Response(
      JSON.stringify({ posts, blockName, blockIndex, totalBlocks: 4 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("generate-smartpost error:", err);
    return new Response(
      JSON.stringify({ error: err?.message ?? "Erro interno" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
