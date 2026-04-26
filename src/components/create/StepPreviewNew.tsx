import { useEffect, useState } from "react";
import { WizardData } from "@/pages/Create";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Sparkles } from "lucide-react";

interface Props {
  data: WizardData;
  updateData: (d: Partial<WizardData>) => void;
  setLoading: (b: boolean) => void;
}

const ratioToAspect: Record<string, string> = {
  "5:4": "aspect-[5/4]",
  "9:16": "aspect-[9/16]",
  "16:9": "aspect-video",
  "1:1": "aspect-square",
};

export function StepPreviewNew({ data, updateData, setLoading }: Props) {
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const generateAll = async () => {
    setGenerating(true);
    setLoading(true);
    try {
      // 1) Gerar ideias (gancho/título/subtítulo/legenda/imagePrompt)
      const { data: ideas, error: ideasErr } = await supabase.functions.invoke(
        "generate-post-ideas",
        {
          body: {
            intent: data.intent,
            format: data.formatRatio,
            business: data.business,
            handle: data.handle,
            quantity: data.quantity,
            days: data.days,
          },
        }
      );

      if (ideasErr || !ideas?.posts) {
        throw new Error(ideasErr?.message || "Falha ao gerar ideias");
      }

      // 2) Para cada ideia, gerar a imagem de fundo (sem texto)
      const palette = data.customPalette.join(", ");
      const generated: WizardData["posts"] = [];

      for (let i = 0; i < ideas.posts.length; i++) {
        const idea = ideas.posts[i];
        const fullPrompt = `${idea.imagePrompt}. Color palette: ${palette}. Modern social media style, no text, no letters, no typography, only visual elements.`;

        const { data: imgRes, error: imgErr } = await supabase.functions.invoke(
          "generate-image",
          { body: { prompt: fullPrompt } }
        );

        if (imgErr) {
          console.error("Erro imagem", i, imgErr);
          toast({
            title: `Falha na imagem ${i + 1}`,
            description: imgErr.message,
            variant: "destructive",
          });
        }

        generated.push({
          gancho: idea.gancho,
          titulo: idea.titulo,
          subtitulo: idea.subtitulo,
          legenda: idea.legenda,
          imageUrl: imgRes?.imageUrl || "",
          format: data.formatRatio,
        });
      }

      updateData({ posts: generated });
      setDone(true);
      toast({
        title: "Posts criados!",
        description: `${generated.length} post(s) prontos para revisar.`,
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Erro ao gerar",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data.posts.length === 0 && !done) {
      generateAll();
    }
  }, []);

  const aspect = ratioToAspect[data.formatRatio] || "aspect-square";

  return (
    <div className="flex flex-col gap-6">
      {generating ? (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground">
            Criando {data.quantity} post(s)... isso pode levar um pouco.
          </p>
        </div>
      ) : data.posts.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {data.posts.length} post(s) gerado(s) — confira o gancho/título e
              ajuste depois
            </p>
            <Button variant="outline" size="sm" onClick={generateAll}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerar
            </Button>
          </div>

          <div
            className={`grid gap-4 ${
              data.posts.length > 1
                ? "grid-cols-1 sm:grid-cols-2"
                : "grid-cols-1 max-w-sm mx-auto"
            }`}
          >
            {data.posts.map((post, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                <div className={`relative ${aspect} bg-muted`}>
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={`Post ${idx + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                      Sem imagem
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                    {idx + 1}
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <p className="text-xs text-primary font-medium">
                    {post.gancho}
                  </p>
                  <p className="text-sm font-bold text-foreground line-clamp-1">
                    {post.titulo}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {post.subtitulo}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            Próxima etapa: revisar legendas com SEO e editar
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Button onClick={generateAll}>Gerar posts</Button>
        </div>
      )}
    </div>
  );
}
