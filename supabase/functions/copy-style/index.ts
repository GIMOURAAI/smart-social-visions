import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { imageBase64, brandName, niche, quantity, analyzeOnly } = await req.json();

    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) throw new Error("OPENAI_API_KEY não configurada");

    // Step 1: GPT-4o Vision analyzes the visual style of the reference image
    const visionResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${openaiKey}` },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Você é um diretor de arte e especialista em design de posts para redes sociais. Analise esta imagem de referência e descreva com precisão o estilo visual para replicação. Responda APENAS em JSON válido com esta estrutura:
{
  "paletaCores": ["#hex1", "#hex2", "#hex3"],
  "estiloFoto": "descrição detalhada da fotografia: iluminação, ângulo, ambiente, modelo/objeto, expressão",
  "tipografia": "estilo de fonte: serifada/sem-serifa, peso, tamanho relativo, posição no card",
  "atmosfera": "mood/feeling geral: luxuoso, minimalista, energético, acolhedor, etc",
  "composicao": "como os elementos estão dispostos: regra dos terços, espaço negativo, etc",
  "promptDalle": "prompt completo em inglês para DALL-E 3 gerar uma imagem no mesmo estilo visual desta referência, sem copiar o conteúdo — apenas replicar a estética, iluminação, composição, paleta e atmosfera"
}`,
              },
              {
                type: "image_url",
                image_url: { url: imageBase64, detail: "high" },
              },
            ],
          },
        ],
        max_tokens: 800,
        response_format: { type: "json_object" },
      }),
    });

    if (!visionResponse.ok) {
      const err = await visionResponse.text();
      throw new Error(`Vision API error: ${err}`);
    }

    const visionData = await visionResponse.json();
    const styleAnalysis = JSON.parse(visionData.choices[0].message.content);

    // If analyzeOnly — return just the style analysis without generating posts
    if (analyzeOnly) {
      return new Response(
        JSON.stringify({ styleAnalysis }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 2: GPT-4o generates posts in PostLab format using the analyzed style
    const count = quantity === 3 ? 3 : 1;

    const generateResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${openaiKey}` },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Você é um copywriter expert em marketing digital e redes sociais no Brasil. Use a metodologia PostLab:
- Gancho: primeira linha que para o scroll — dor, provocação ou promessa impossível de ignorar
- Título da arte: curto, impactante (máx 6 palavras)
- Subtítulo da arte: complementa o título com benefício ou prova (máx 12 palavras)
- Legenda: storytelling de 3-5 frases usando AIDA ou SPIN
- CTA: ação clara e direta
- Hashtags: 5-8 relevantes ao nicho

Estilo visual analisado da referência:
- Paleta: ${styleAnalysis.paletaCores?.join(", ")}
- Atmosfera: ${styleAnalysis.atmosfera}
- Composição: ${styleAnalysis.composicao}
- Tipografia: ${styleAnalysis.tipografia}

Gere conteúdo em português brasileiro, tom conversacional premium.`,
          },
          {
            role: "user",
            content: `Crie ${count} post(s) no mesmo estilo visual da imagem de referência analisada para a marca "${brandName || "minha marca"}" no nicho "${niche || "geral"}".

Responda em JSON:
{
  "posts": [
    {
      "gancho": "...",
      "tituloArte": "...",
      "subtituloArte": "...",
      "legenda": "...",
      "cta": "...",
      "hashtags": "...",
      "promptVisual": "complete DALL-E 3 prompt in English for this specific post, incorporating the analyzed style: ${styleAnalysis.promptDalle}"
    }
  ]
}`,
          },
        ],
        max_tokens: count * 600,
        response_format: { type: "json_object" },
      }),
    });

    if (!generateResponse.ok) {
      const err = await generateResponse.text();
      throw new Error(`Generate API error: ${err}`);
    }

    const generateData = await generateResponse.json();
    const result = JSON.parse(generateData.choices[0].message.content);

    return new Response(
      JSON.stringify({ posts: result.posts, styleAnalysis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
