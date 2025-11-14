import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY não configurada');
    }

    console.log('Gerando conteúdo com prompt:', prompt);

    // Gerar título e conteúdo
    const contentResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em criar posts para redes sociais. Gere um título cativante (máx 60 caracteres) e um conteúdo engajador (máx 200 caracteres) baseado no prompt do usuário. Responda APENAS em formato JSON com as chaves "title" e "content".'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_post_content",
              description: "Criar título e conteúdo do post",
              parameters: {
                type: "object",
                properties: {
                  title: { 
                    type: "string",
                    description: "Título cativante com máximo 60 caracteres"
                  },
                  content: { 
                    type: "string",
                    description: "Conteúdo engajador com máximo 200 caracteres"
                  }
                },
                required: ["title", "content"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "create_post_content" } }
      }),
    });

    if (!contentResponse.ok) {
      const errorText = await contentResponse.text();
      console.error('Erro ao gerar conteúdo:', contentResponse.status, errorText);
      throw new Error(`Erro ao gerar conteúdo: ${contentResponse.status}`);
    }

    const contentData = await contentResponse.json();
    console.log('Resposta da API de conteúdo:', JSON.stringify(contentData));

    const toolCall = contentData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error('Resposta inválida da IA');
    }

    const { title, content } = JSON.parse(toolCall.function.arguments);

    // Gerar prompt para imagem baseado no conteúdo
    const imagePrompt = `Uma imagem profissional e atraente para redes sociais sobre: ${prompt}. Estilo moderno, cores vibrantes, alta qualidade.`;

    console.log('Gerando imagem com prompt:', imagePrompt);

    // Gerar imagem de fundo
    const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: imagePrompt
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!imageResponse.ok) {
      const errorText = await imageResponse.text();
      console.error('Erro ao gerar imagem:', imageResponse.status, errorText);
      throw new Error(`Erro ao gerar imagem: ${imageResponse.status}`);
    }

    const imageData = await imageResponse.json();
    const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error('Imagem não gerada');
    }

    console.log('Post criado com sucesso');

    return new Response(
      JSON.stringify({
        title,
        content,
        imageUrl
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Erro na função create-post-with-ai:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erro desconhecido' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
