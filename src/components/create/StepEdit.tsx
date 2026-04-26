import { useState } from "react";
import { WizardData, PostData } from "@/pages/Create";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Save, Download, Sparkles } from "lucide-react";
import { CanvasEditor } from "./CanvasEditor";

interface StepEditProps {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
  user: any;
}

export function StepEdit({ data, updateData, user }: StepEditProps) {
  const [saving, setSaving] = useState(false);
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

  const handleCanvasSave = (dataUrl: string) => {
    updateCurrentPost({ imageUrl: dataUrl });
    toast({
      title: "Alterações aplicadas!",
      description: "A arte foi atualizada com sucesso.",
    });
  };

  const savePost = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        title: currentPost.titulo || currentPost.title || "",
        content: currentPost.legenda || currentPost.content || "",
        format: currentPost.format,
        style: data.palette,
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
        title: post.titulo || post.title || "",
        content: post.legenda || post.content || "",
        format: post.format,
        style: data.palette,
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

  const downloadCurrentPost = () => {
    if (!currentPost.imageUrl) return;
    
    const link = document.createElement("a");
    link.download = `post-${data.currentPostIndex + 1}-${Date.now()}.png`;
    link.href = currentPost.imageUrl;
    link.click();
    
    toast({ title: "Download iniciado!" });
  };

  if (!currentPost) {
    return <div className="text-center text-muted-foreground">Nenhum post para editar</div>;
  }

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={goToPrev} disabled={data.currentPostIndex === 0}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium text-foreground">
            Post {data.currentPostIndex + 1} de {data.posts.length}
          </span>
          <Button variant="outline" size="icon" onClick={goToNext} disabled={data.currentPostIndex === data.posts.length - 1}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={downloadCurrentPost} disabled={!currentPost.imageUrl}>
            <Download className="w-4 h-4 mr-2" />
            Baixar
          </Button>
          <Button variant="outline" size="sm" onClick={savePost} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Este
          </Button>
          {data.posts.length > 1 && (
            <Button size="sm" onClick={saveAllPosts} disabled={saving}>
              <Sparkles className="w-4 h-4 mr-2" />
              {saving ? "Salvando..." : `Salvar Todos (${data.posts.length})`}
            </Button>
          )}
        </div>
      </div>

      {/* Canvas Editor - sem texto inicial, usuário adiciona manualmente */}
      <CanvasEditor
        key={data.currentPostIndex}
        initialImage={currentPost.imageUrl}
        format={currentPost.format}
        onSave={handleCanvasSave}
      />
    </div>
  );
}
