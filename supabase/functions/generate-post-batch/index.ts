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
  "4:5": "1024x1024",
  "9:16": "1024x1792",
  "16:9": "1792x1024",
};

const BLOCK_PROMPT: Record<string, string> = {
  dor: "Bloco DOR: posts que ressoam com a frustração, problema ou bloqueio do avatar. Tom empático.",
  autoridade: "Bloco AUTORIDADE: posts que constroem credibilidade — dados, cases, prova social, bastidores.",
  valor: "Bloco VALOR: posts educacionais e práticos — dicas, passo a passo, insights úteis.",
  venda: "Bloco VENDA: posts de conversão — oferta clara, CTA forte, urgência, benefícios.",
};

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
    const postCount = Math.min(3, Math.max(1, Number(count) || 1));

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

    // Load batch
    const { data: batch, error: batchErr } = await admin
      .from("post_batches").select("*").eq("id", batchId).eq("user_id", user.id).single();
    if (batchErr || !batch) return json({ error: "Batch not found" }, 404);

    // Check credits upfront
    const { data: credits } = await admin.from("user_credits").select("credits_remaining").eq("user_id", user.id).single();
    if (!credits || credits.credits_remaining < postCount) {
      return json({ error: "INSUFFICIENT_CREDITS", remaining: credits?.credits_remaining ?? 0 }, 402);
    }

    // === 1. Gerar conteúdo com GPT-4o ===
    const systemPrompt = `Você é o PostLab AI, especialista em marketing para Instagram brasileiro.
Para a marca "${batch.brand_name}" (nicho: ${batch.niche}, tema: ${batch.theme}).
Objetivo: ${batch.objective}. Tom de voz: ${batch.tone}.
Estilo visual: ${batch.visual_style}. Padrão do feed: ${batch.feed_pattern}.

${BLOCK_PROMPT[block] ?? ""}

Gere ${postCount} post(s) DIFERENTES entre si. Cada post deve ter:
- gancho: 1 frase viral, máx 12 palavras, gera curiosidade ou choque
- tituloArte: título curto e impactante para a imagem (máx 6 palavras)
- subtitulo: complemento do título (máx 8 palavras)
- textoArte: texto principal que vai na arte (máx 15 palavras)
- legenda: legenda completa do post (200-400 caracteres, com quebras de linha, emojis estratégicos)
- cta: chamada para ação clara
- hashtags: array com 8-15 hashtags relevantes (sem #)
- storyComplementar: ideia de story que reforça o post (máx 100 caracteres)
- promptVisual: prompt em INGLÊS para DALL-E 3 gerar a imagem de fundo SEM TEXTO. Descreva cena, estilo, cores, mood. Termine com: "no text, no letters, no words, professional photography, instagram aesthetic"

RESPONDA APENAS JSON válido no formato: { "posts": [ {gancho, tituloArte, subtitulo, textoArte, legenda, cta, hashtags, storyComplementar, promptVisual}, ... ] }`;

    const gptResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: `Gere ${postCount} post(s) para o bloco ${block}.` }],
        response_format: { type: "json_object" },
        temperature: 0.9,
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

    // === 2. Gerar imagens + persistir + debitar crédito ===
    for (let i = 0; i < posts.length; i++) {
      const p = posts[i];
      let imageUrl: string | null = null;

      try {
        const imgResp = await fetch("https://api.openai.com/v1/images/generations", {
          method: "POST",
          headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({ model: "dall-e-3", prompt: p.promptVisual, n: 1, size, quality: "standard" }),
        });
        if (imgResp.ok) {
          const imgData = await imgResp.json();
          const url = imgData.data[0].url;
          // Download and upload to storage
          const imgBin = await fetch(url).then((r) => r.arrayBuffer());
          const path = `${user.id}/${batch.id}/${block}-${Date.now()}-${i}.png`;
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

      // Insert post
      const { data: postRow, error: postErr } = await admin.from("posts").insert({
        user_id: user.id,
        batch_id: batch.id,
        block,
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

      if (postErr) {
        console.error("Insert post error", postErr);
        continue;
      }

      // Consume credit (atomic)
      const { error: creditErr } = await admin.rpc("consume_credit", {
        _user_id: user.id, _amount: 1, _reason: `post:${block}`, _post_id: postRow.id,
      });
      if (creditErr) {
        console.error("Credit consume failed (post already created)", creditErr);
      }

      results.push({ ...postRow });
    }

    // Update batch status
    await admin.from("post_batches").update({
      status: block === "dor" && posts.length <= batch.pilot_count ? "piloto" : "gerando",
    }).eq("id", batch.id);

    const { data: newCredits } = await admin.from("user_credits").select("credits_remaining").eq("user_id", user.id).single();

    return json({ posts: results, credits_remaining: newCredits?.credits_remaining ?? 0 });
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
