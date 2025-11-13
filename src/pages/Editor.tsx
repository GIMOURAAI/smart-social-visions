import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Editor() {
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [format, setFormat] = useState("1:1");
  const [style, setStyle] = useState("minimal");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUser(session.user);
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o título e o conteúdo",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        title,
        content,
        format,
        style,
      });

      if (error) throw error;

      toast({
        title: "Post salvo!",
        description: "Seu post foi salvo com sucesso.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Editor de Posts</h1>
          </div>
          <Button variant="ghost" onClick={() => navigate("/dashboard")} size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Criar Novo Post</h2>

          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Título do Post</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título do seu post"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="content">Conteúdo</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escreva o conteúdo do seu post..."
                className="mt-2 min-h-[200px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="format">Formato</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1:1">1:1 - Feed Quadrado</SelectItem>
                    <SelectItem value="3:4">3:4 - Retrato</SelectItem>
                    <SelectItem value="9:16">9:16 - Stories/Reels</SelectItem>
                    <SelectItem value="16:9">16:9 - YouTube</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="style">Estilo</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Minimalista</SelectItem>
                    <SelectItem value="futuristic">Futurista</SelectItem>
                    <SelectItem value="cinematic">Cinematográfico</SelectItem>
                    <SelectItem value="animated">Animado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Preview Area */}
            <div className="border-t border-border pt-6">
              <Label>Visualização</Label>
              <div className="mt-4 p-8 bg-secondary/20 rounded-lg border border-border">
                <div
                  className={`mx-auto bg-card rounded-lg p-6 shadow-lg ${
                    format === "1:1"
                      ? "aspect-square max-w-md"
                      : format === "3:4"
                      ? "aspect-[3/4] max-w-sm"
                      : format === "9:16"
                      ? "aspect-[9/16] max-w-xs"
                      : "aspect-video max-w-2xl"
                  }`}
                >
                  <h3 className="text-xl font-bold mb-2 text-foreground">{title || "Título do Post"}</h3>
                  <p className="text-muted-foreground text-sm">{content || "Conteúdo do post..."}</p>
                  <div className="mt-4 flex gap-2">
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">{format}</span>
                    <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded">{style}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button onClick={handleSave} disabled={loading} className="flex-1" size="lg">
                <Save className="w-5 h-5 mr-2" />
                {loading ? "Salvando..." : "Salvar Post"}
              </Button>
              <Button variant="outline" onClick={() => navigate("/dashboard")} size="lg">
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}