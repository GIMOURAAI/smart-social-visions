import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const SIZE_MAP: Record<string, "1024x1024" | "1024x1792" | "1792x1024"> = {
  "1:1": "1024x1024",
  "4:5": "1024x1792",
  "9:16": "1024x1792",
  "16:9": "1792x1024",
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

function buildSystemPrompt(batch: any, blockKey: string, postCount: number): string {
  const block = POSTLAB_BLOCKS[blockKey] ?? POSTLAB_BLOCKS.dor;
  const tema = getTemaForNiche(batch.niche, batch.visual_style);

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

    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: "Not authenticated" }, 401);

    const body = await req.json();
    const { batchId, block, count } = body as { batchId: string; block: string; count: number };
    const blockKey = (block || "dor").toLowerCase();
    const postCount = Math.min(3, Math.max(1, Number(count) || 1));

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

    const { data: batch, error: batchErr } = await admin
      .from("post_batches").select("*").eq("id", batchId).eq("user_id", user.id).single();
    if (batchErr || !batch) return json({ error: "Batch not found" }, 404);

    const { data: credits } = await admin.from("user_credits")
      .select("credits_remaining").eq("user_id", user.id).single();
    if (!credits || credits.credits_remaining < postCount) {
      return json({ error: "INSUFFICIENT_CREDITS", remaining: credits?.credits_remaining ?? 0 }, 402);
    }

    // === GPT-4o com prompt PostLab completo ===
    const systemPrompt = buildSystemPrompt(batch, blockKey, postCount);
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

    const size = SIZE_MAP[batch.format] ?? "1024x1024";
    const results: any[] = [];

    // === DALL·E 3 + upload + persist + crédito ===
    for (let i = 0; i < posts.length; i++) {
      const p = posts[i];
      let imageUrl: string | null = null;

      try {
        const imgResp = await fetch("https://api.openai.com/v1/images/generations", {
          method: "POST",
          headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: p.promptVisual,
            n: 1,
            size,
            quality: "standard",
            style: "vivid",
          }),
        });
        if (imgResp.ok) {
          const imgData = await imgResp.json();
          const url = imgData.data[0].url;
          const imgBin = await fetch(url).then((r) => r.arrayBuffer());
          const path = `${user.id}/${batch.id}/${blockKey}-${Date.now()}-${i}.png`;
          const { error: upErr } = await admin.storage.from("post-images").upload(path, imgBin, {
            contentType: "image/png", upsert: true,
          });
          if (!upErr) {
            const { data: pub } = admin.storage.from("post-images").getPublicUrl(path);
            imageUrl = pub.publicUrl;
          }
        } else {
          console.error("DALL-E error", await imgResp.text());
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
