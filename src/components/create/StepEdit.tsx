import { useState, useRef } from "react";
import { WizardData, PostData } from "@/pages/Create";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Save, Download, Maximize2, Sparkles } from "lucide-react";
import html2canvas from "html2canvas";
import { upscaleImage, loadImage } from "@/lib/imageProcessing";

interface StepEditProps {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
  user: any;
}

export function StepEdit({ data, updateData, user }: StepEditProps) {
  const [saving, setSaving] = useState(false);
  const [upscaling, setUpscaling] = useState(false);
  const [upscaleLevel, setUpscaleLevel] = useState([2]);
  const previewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const currentPost = data.posts[data.currentPostIndex];

  const updateCurrentPost = (updates: Partial<PostData>) => {
    const newPosts = [...data.posts];
    newPosts[data.currentPostIndex] = { ...currentPost, ...updates };
    updateData({ posts: newPosts });
  };

  const goToPrev = () => {
    if (data.currentPostIndex > 0) {
      updateData({ currentPostIndex: data.currentPostIndex - 1 });
    }
  };

  const goToNext = () => {
    if (data.currentPostIndex < data.posts.length - 1) {
      updateData({ currentPostIndex: data.currentPostIndex + 1 });
    }
  };

  const savePost = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        title: currentPost.title,
        content: currentPost.content,
        format: currentPost.format,
        style: data.colorPreference,
        image_url: currentPost.imageUrl || null,
      });

      if (error) throw error;

      toast({
        title: "Post salvo!",
        description: `Post ${data.currentPostIndex + 1} salvo com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const saveAllPosts = async () => {
    setSaving(true);
    try {
      const posts = data.posts.map((post) => ({
        user_id: user.id,
        title: post.title,
        content: post.content,
        format: post.format,
        style: data.colorPreference,
        image_url: post.imageUrl || null,
      }));

      const { error } = await supabase.from("posts").insert(posts);

      if (error) throw error;

      toast({
        title: "Todos os posts salvos!",
        description: `${data.posts.length} post(s) salvo(s) com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const downloadImage = async () => {
    if (!previewRef.current) return;

    try {
      const canvas = await html2canvas(previewRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 3,
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = `post-${data.currentPostIndex + 1}-${Date.now()}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }
      }, "image/png", 1.0);

      toast({
        title: "Download concluído!",
      });
    } catch (error) {
      toast({
        title: "Erro ao baixar",
        variant: "destructive",
      });
    }
  };

  const applyUpscale = async () => {
    if (!currentPost.imageUrl) return;
    
    setUpscaling(true);
    try {
      const img = await loadImage(currentPost.imageUrl);
      const resultBlob = await upscaleImage(img, upscaleLevel[0]);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        updateCurrentPost({ imageUrl: event.target?.result as string });
        toast({
          title: "Upscale aplicado!",
          description: `Imagem melhorada ${upscaleLevel[0]}x.`,
        });
      };
      reader.readAsDataURL(resultBlob);
    } catch (error) {
      toast({
        title: "Erro no upscale",
        variant: "destructive",
      });
    } finally {
      setUpscaling(false);
    }
  };

  const aspectRatioClass = {
    "1:1": "aspect-square max-w-sm",
    "9:16": "aspect-[9/16] max-w-xs",
    "16:9": "aspect-video max-w-lg",
    "3:4": "aspect-[3/4] max-w-sm",
  }[currentPost?.format] || "aspect-square max-w-sm";

  if (!currentPost) {
    return <div className="text-center text-muted-foreground">Nenhum post para editar</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Preview */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={goToPrev} disabled={data.currentPostIndex === 0}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Post {data.currentPostIndex + 1} de {data.posts.length}
          </span>
          <Button variant="outline" size="icon" onClick={goToNext} disabled={data.currentPostIndex === data.posts.length - 1}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div
          ref={previewRef}
          className={`relative ${aspectRatioClass} w-full rounded-xl overflow-hidden border border-border`}
        >
          {currentPost.imageUrl ? (
            <img
              src={currentPost.imageUrl}
              alt={currentPost.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30" />
          )}
          <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center p-6 text-center">
            <h3 className="text-white font-bold text-xl">{currentPost.title}</h3>
            <p className="text-white/90 text-sm mt-2">{currentPost.content}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={downloadImage}>
            <Download className="w-4 h-4 mr-2" />
            Baixar
          </Button>
          <Button variant="outline" size="sm" onClick={savePost} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Este
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-6">
        <div>
          <Label>Título</Label>
          <Input
            value={currentPost.title}
            onChange={(e) => updateCurrentPost({ title: e.target.value })}
            className="mt-2"
          />
        </div>

        <div>
          <Label>Conteúdo</Label>
          <Textarea
            value={currentPost.content}
            onChange={(e) => updateCurrentPost({ content: e.target.value })}
            className="mt-2"
            rows={4}
          />
        </div>

        <div>
          <Label>Formato</Label>
          <Select value={currentPost.format} onValueChange={(value) => updateCurrentPost({ format: value })}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1:1">1:1 (Feed)</SelectItem>
              <SelectItem value="9:16">9:16 (Stories)</SelectItem>
              <SelectItem value="16:9">16:9 (YouTube)</SelectItem>
              <SelectItem value="3:4">3:4 (Retrato)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border-t border-border pt-4 space-y-3">
          <Label>Upscale de Imagem</Label>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Nível: {upscaleLevel[0]}x</Label>
            <Slider
              value={upscaleLevel}
              onValueChange={setUpscaleLevel}
              min={2}
              max={4}
              step={1}
            />
          </div>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={applyUpscale}
            disabled={!currentPost.imageUrl || upscaling}
          >
            <Maximize2 className="w-4 h-4 mr-2" />
            {upscaling ? "Processando..." : "Aplicar Upscale"}
          </Button>
        </div>

        {data.posts.length > 1 && (
          <Button className="w-full" onClick={saveAllPosts} disabled={saving}>
            <Sparkles className="w-4 h-4 mr-2" />
            {saving ? "Salvando..." : `Salvar Todos (${data.posts.length})`}
          </Button>
        )}
      </div>
    </div>
  );
}
