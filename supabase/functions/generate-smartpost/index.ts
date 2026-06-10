import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SmartPostRequest {
  niche: string;
  theme: string;
  objective: string;
  tone: string;
  visualStyle: string;
  brandImages?: string[]; // base64 data URLs for brand reference
  format: "4:5" | "1:1" | "9:16" | "16:9";
  quantity: number; // 1 or 7
}

interface GeneratedPost {
  tema: string;
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
}

const systemPrompt = `Você é o motor estratégico de conteúdo do SmartPostAI.

Sua função é criar posts completos para redes sociais com base nas informações fornecidas pelo usuário.

Você atua como especialista em social media, copywriting, marketing digital, branding e criação visual com IA.

Para cada post, você deve entregar obrigatoriamente os seguintes campos como JSON:
- tema: assunto principal do post
- objetivo: função estratégica (vender, educar, engajar, etc.)
- tipoConteudo: educativo | venda | autoridade | conexão | prova social | engajamento | bastidor | oferta | lista | dica prática | quebra de objeção
- intencaoEmocional: o que o conteúdo deve despertar (desejo, identificação, urgência, confiança, curiosidade, segurança, autoridade, conexão)
- gancho: frase inicial forte para prender atenção (máx 100 chars)
- tituloArte: texto principal curto para o design (máx 60 chars)
- subtituloArte: frase de apoio (máx 100 chars)
- textoArte: frase pequena opcional para o design (máx 80 chars)
- legenda: legenda completa estratégica com início envolvente, desenvolvimento e CTA final (200-400 chars)
- cta: chamada para ação específica
- hashtags: 5 a 10 hashtags relevantes separadas por espaço
- estiloVisual: descrição do estilo visual aplicado
- promptVisual: prompt detalhado em inglês para gerar a imagem/design do post (composição, cores, iluminação, fundo, estilo, atmosfera, hierarquia visual)
- storyComplementar: sugestão simples de story para acompanhar o post

Regras:
- Escreva sempre em português brasileiro (exceto promptVisual que deve ser em inglês)
- Adapte ao nicho informado
- Não use linguagem genérica
- O título da arte deve ser curto, forte e visualmente impactante
- A legenda deve ter início envolvente, desenvolvimento persuasivo e CTA final
- As hashtags devem ser relevantes ao nicho e tema
- O prompt visual deve ser detalhado com composição, cores, estilo, iluminação e atmosfera
- Evite textos longos demais dentro da arte
- O conteúdo deve parecer profissional e pronto para redes sociais`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as SmartPostRequest;
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY não configurada");

    const isCustomStyle =
      body.visualStyle === "custom" &&
      body.brandImages &&
      body.brandImages.length > 0;

    const userTextPrompt = `Nicho: ${body.niche}
Tema: ${body.theme}
Objetivo: ${body.objective}
Tom de voz: ${body.tone}
Estilo visual: ${isCustomStyle ? "Adaptar ao estilo da marca enviada" : body.visualStyle}
Formato: ${body.format}
Quantidade de posts: ${body.quantity}

Gere ${body.quantity} post(s) variado(s) seguindo as instruções. Retorne um JSON com chave "posts" contendo array de objetos com todos os campos especificados.`;

    type MessageContent =
      | string
      | Array<
          | { type: "text"; text: string }
          | { type: "image_url"; image_url: { url: string } }
        >;

    const userContent: MessageContent = isCustomStyle
      ? [
          {
            type: "text",
            text: "Analise o estilo visual dessas imagens de referência da marca do cliente. Identifique paleta de cores, composição, atmosfera e linguagem visual. Use esse estilo como inspiração para criar os posts, sem copiar literalmente.",
          },
          ...body.brandImages!.map((img) => ({
            type: "image_url" as const,
            image_url: { url: img },
          })),
          { type: "text" as const, text: userTextPrompt },
        ]
      : userTextPrompt;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userContent },
          ],
        }),
      }
    );

    if (!response.ok) {
      const txt = await response.text();
      console.error("OpenAI error", response.status, txt);

      if (response.status === 401) {
        return new Response(
          JSON.stringify({
            error:
              "Chave de API inválida. Verifique a configuração do OPENAI_API_KEY.",
          }),
          {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error:
              "Limite de requisições da OpenAI atingido. Tente novamente em instantes.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      throw new Error(`Erro OpenAI: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("Resposta inválida da OpenAI");

    const parsed = JSON.parse(content);
    const posts: GeneratedPost[] = parsed.posts;

    if (!Array.isArray(posts)) {
      throw new Error("Formato de resposta inválido: campo 'posts' ausente ou não é array");
    }

    return new Response(JSON.stringify(posts), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("generate-smartpost error", err);
    return new Response(
      JSON.stringify({ error: err.message || "Erro desconhecido" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
