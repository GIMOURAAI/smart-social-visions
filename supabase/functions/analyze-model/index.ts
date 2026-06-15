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
    const { imageBase64 } = await req.json();

    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) throw new Error("OPENAI_API_KEY não configurada");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
                text: `Você é um especialista em direção de arte e geração de imagens com IA. Analise esta foto de uma profissional e descreva sua aparência física com MÁXIMO NÍVEL DE DETALHE para usar como referência em um prompt do DALL-E 3. A descrição deve permitir que o DALL-E gere uma pessoa visualmente similar.

Responda em JSON válido:
{
  "description": "descrição ultra-detalhada EM INGLÊS para DALL-E 3: tom de pele, cor e textura do cabelo (comprimento, estilo, ondulação), cor dos olhos, formato do rosto, faixa etária estimada (20s/30s/40s), estatura estimada, estilo de roupa e cores na foto, expressão facial, postura, acessórios visíveis — tudo que ajuda a criar uma pessoa similar visualmente. NÃO mencione nome ou identidade. Termine com: 'professional appearance, warm expression, high-end photography quality'"
}`,
              },
              {
                type: "image_url",
                image_url: { url: imageBase64, detail: "high" },
              },
            ],
          },
        ],
        max_tokens: 500,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Vision API error: ${err}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return new Response(
      JSON.stringify({ description: result.description }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
