import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface IdeaRequest {
  intent: "venda" | "autoridade" | "viral" | "engajamento";
  format: string; // "1350x1080" | "9:16" | "16:9"
  business: string; // o que a empresa faz / vende
  handle: string; // @marca
  quantity: number; // quantos posts
  days: number; // pra quantos dias
  customPrompt?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as IdeaRequest;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY não configurada");

    const intentMap: Record<string, string> = {
      venda: "gerar conversões e vendas diretas, com chamada para ação clara",
      autoridade:
        "construir autoridade, mostrar expertise e conhecimento profundo do nicho",
      viral:
        "gerar alto compartilhamento, com gancho polêmico/curioso/contraintuitivo",
      engajamento:
        "estimular comentários, salvamentos e respostas da audiência",
    };

    const systemPrompt = `Você é um copywriter especialista em redes sociais e SEO. 
Crie ideias de posts em português brasileiro, com linguagem direta e moderna.
Cada post deve ter:
- gancho: frase de abertura curta e impactante (máx 80 caracteres)
- titulo: título principal forte (máx 50 caracteres)
- subtitulo: subtítulo de no máximo 2 linhas (máx 90 caracteres total)
- legenda: legenda completa com SEO (200-400 caracteres) com hashtags relevantes ao final
- imagePrompt: descrição visual em inglês para gerar a imagem de fundo, SEM texto, SEM letras, apenas elementos visuais (cenário, objetos, atmosfera, cores)
Inclua a marca ${body.handle} naturalmente nas legendas quando fizer sentido.`;

    const userPrompt = `Negócio: ${body.business}
Marca: ${body.handle}
Intenção: ${intentMap[body.intent] || body.intent}
Formato: ${body.format}
Quantidade de posts: ${body.quantity}
Período: distribuídos em ${body.days} dia(s)
${body.customPrompt ? `Observações extras: ${body.customPrompt}` : ""}

Gere ${body.quantity} posts variados, cada um com ângulo diferente mas seguindo a mesma intenção.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "create_posts",
                description: "Cria array de posts",
                parameters: {
                  type: "object",
                  properties: {
                    posts: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          gancho: { type: "string" },
                          titulo: { type: "string" },
                          subtitulo: { type: "string" },
                          legenda: { type: "string" },
                          imagePrompt: { type: "string" },
                        },
                        required: [
                          "gancho",
                          "titulo",
                          "subtitulo",
                          "legenda",
                          "imagePrompt",
                        ],
                      },
                    },
                  },
                  required: ["posts"],
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "create_posts" },
          },
        }),
      }
    );

    if (!response.ok) {
      const txt = await response.text();
      console.error("AI error", response.status, txt);
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error:
              "Créditos insuficientes. Adicione créditos em Settings → Workspace → Usage.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições. Tente em instantes." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      throw new Error(`Erro IA: ${response.status}`);
    }

    const data = await response.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) throw new Error("Resposta inválida da IA");

    const parsed = JSON.parse(args);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("generate-post-ideas error", err);
    return new Response(
      JSON.stringify({ error: err.message || "Erro desconhecido" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
