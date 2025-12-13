import { useState, useEffect } from "react";
import { WizardData, PostData } from "@/pages/Create";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Check } from "lucide-react";

interface StepPreviewProps {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
  setLoading: (loading: boolean) => void;
}

export function StepPreview({ data, updateData, setLoading }: StepPreviewProps) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const { toast } = useToast();

  const getTheme = () => data.customTheme || data.theme;
  
  const getFormat = () => {
    switch (data.objective) {
      case "instagram": return "1:1";
      case "stories":
      case "reels": return "9:16";
      case "youtube": return "16:9";
      default: return "1:1";
    }
  };

  const generatePosts = async () => {
    setGenerating(true);
    setLoading(true);
    
    try {
      const posts: PostData[] = [];
      const theme = getTheme();
      const format = getFormat();
      
      for (let i = 0; i < data.quantity; i++) {
        // Prompt apenas para gerar IMAGEM - sem texto sobreposto
        const imagePrompt = data.aiPrompt 
          ? data.aiPrompt
          : `Imagem profissional para redes sociais sobre ${theme}. Estilo moderno, cores vibrantes, alta qualidade. Sem texto na imagem.`;

        const { data: result, error } = await supabase.functions.invoke("generate-image", {
          body: { prompt: imagePrompt }
        });

        if (error) {
          console.error("Erro ao gerar imagem:", error);
          toast({
            title: "Erro ao gerar",
            description: `Falha na imagem ${i + 1}. Tente novamente.`,
            variant: "destructive",
          });
          continue;
        }

        posts.push({
          title: "",
          content: "",
          imageUrl: result.imageUrl || "",
          format,
        });
      }

      updateData({ posts });
      setGenerated(true);
      toast({
        title: "Imagens geradas!",
        description: `${posts.length} imagem(ns) criada(s). Adicione texto no próximo passo.`,
      });
    } catch (error) {
      console.error("Erro ao gerar imagens:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar as imagens.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data.posts.length === 0 && !generated) {
      generatePosts();
    }
  }, []);

  const aspectRatioClass = {
    "1:1": "aspect-square",
    "9:16": "aspect-[9/16]",
    "16:9": "aspect-video",
    "3:4": "aspect-[3/4]",
  }[getFormat()] || "aspect-square";

  return (
    <div className="flex flex-col gap-6">
      {generating ? (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground">Gerando {data.quantity} imagem(ns)...</p>
        </div>
      ) : data.posts.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {data.posts.length} imagem(ns) gerada(s)
            </p>
            <Button variant="outline" size="sm" onClick={generatePosts}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerar
            </Button>
          </div>
          
          <div className={`grid gap-4 ${data.posts.length > 1 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1 max-w-sm mx-auto"}`}>
            {data.posts.map((post, index) => (
              <div
                key={index}
                className={`relative ${aspectRatioClass} rounded-xl overflow-hidden border border-border bg-card`}
              >
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt={`Imagem ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">Sem imagem</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Check className="w-4 h-4 text-green-500" />
            Adicione título, subtítulo e @marca no próximo passo
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <p className="text-muted-foreground">Nenhuma imagem gerada ainda</p>
          <Button onClick={generatePosts}>
            Gerar Imagens
          </Button>
        </div>
      )}
    </div>
  );
}
