import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Sparkles, Download, Copy, Image as ImageIcon, Wand2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import html2canvas from "html2canvas";

export default function Editor() {
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [format, setFormat] = useState("1:1");
  const [style, setStyle] = useState("minimal");
  const [loading, setLoading] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [colorPalette, setColorPalette] = useState("default");
  const [fontFamily, setFontFamily] = useState("inter");
  const [fontSize, setFontSize] = useState([20]);
  const [contentFontSize, setContentFontSize] = useState([16]);
  const [titleContentGap, setTitleContentGap] = useState([16]);
  const [lineHeight, setLineHeight] = useState([1.5]);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [brandName, setBrandName] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const colorPalettes = {
    default: { bg: "bg-card", text: "text-foreground", accent: "text-primary" },
    ocean: { bg: "bg-gradient-to-br from-blue-500 to-cyan-600", text: "text-white", accent: "text-yellow-300" },
    sunset: { bg: "bg-gradient-to-br from-orange-500 to-pink-600", text: "text-white", accent: "text-yellow-200" },
    forest: { bg: "bg-gradient-to-br from-green-600 to-emerald-700", text: "text-white", accent: "text-lime-300" },
    purple: { bg: "bg-gradient-to-br from-purple-600 to-indigo-700", text: "text-white", accent: "text-pink-300" },
    dark: { bg: "bg-gradient-to-br from-gray-900 to-gray-800", text: "text-white", accent: "text-cyan-400" },
  };

  const fonts = {
    inter: "font-sans",
    serif: "font-serif",
    mono: "font-mono",
    cursive: "font-cursive",
  };

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

  const generateImage = async () => {
    if (!imagePrompt.trim()) {
      toast({
        title: "Prompt necessário",
        description: "Digite uma descrição para gerar a imagem de fundo",
        variant: "destructive",
      });
      return;
    }

    setGeneratingImage(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt: imagePrompt }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setBackgroundImage(data.imageUrl);
        toast({
          title: "Imagem gerada!",
          description: "Imagem de fundo criada com sucesso",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao gerar imagem",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      toast({
        title: "Imagem carregada!",
        description: "Imagem de referência adicionada",
      });
    }
  };

  const downloadPost = async () => {
    if (!previewRef.current) return;

    try {
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: null,
        scale: 2,
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `post-${Date.now()}.png`;
          a.click();
          URL.revokeObjectURL(url);
          toast({
            title: "Download concluído!",
            description: "Post salvo como imagem",
          });
        }
      });
    } catch (error) {
      toast({
        title: "Erro ao baixar",
        description: "Não foi possível baixar o post",
        variant: "destructive",
      });
    }
  };

  const copyPost = async () => {
    if (!previewRef.current) return;

    try {
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: null,
        scale: 2,
      });

      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          toast({
            title: "Copiado!",
            description: "Post copiado para a área de transferência",
          });
        }
      });
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o post",
        variant: "destructive",
      });
    }
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="colorPalette">Paleta de Cores</Label>
                <Select value={colorPalette} onValueChange={setColorPalette}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Padrão</SelectItem>
                    <SelectItem value="ocean">Oceano</SelectItem>
                    <SelectItem value="sunset">Pôr do Sol</SelectItem>
                    <SelectItem value="forest">Floresta</SelectItem>
                    <SelectItem value="purple">Roxo</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fontFamily">Fonte</Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter">Inter (Sans)</SelectItem>
                    <SelectItem value="serif">Serif</SelectItem>
                    <SelectItem value="mono">Monospace</SelectItem>
                    <SelectItem value="cursive">Cursiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fontSize">Tamanho do Título: {fontSize[0]}px</Label>
                <Slider
                  value={fontSize}
                  onValueChange={setFontSize}
                  min={12}
                  max={64}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="contentFontSize">Tamanho do Subtítulo: {contentFontSize[0]}px</Label>
                <Slider
                  value={contentFontSize}
                  onValueChange={setContentFontSize}
                  min={10}
                  max={48}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="titleContentGap">Espaçamento Título-Subtítulo: {titleContentGap[0]}px</Label>
                <Slider
                  value={titleContentGap}
                  onValueChange={setTitleContentGap}
                  min={0}
                  max={64}
                  step={2}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="textAlign">Alinhamento do Texto</Label>
                <Select value={textAlign} onValueChange={(value: "left" | "center" | "right") => setTextAlign(value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Esquerda</SelectItem>
                    <SelectItem value="center">Centro</SelectItem>
                    <SelectItem value="right">Direita</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="lineHeight">Espaçamento entre Linhas: {lineHeight[0].toFixed(1)}</Label>
                <Slider
                  value={lineHeight}
                  onValueChange={setLineHeight}
                  min={1}
                  max={3}
                  step={0.1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="brandName">Nome da Marca</Label>
                <Input
                  id="brandName"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Ex: minhamarca"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <Label>Imagem de Fundo com IA</Label>
              <div className="space-y-4 mt-4">
                <div className="flex gap-2">
                  <Input
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Descreva a imagem de fundo que deseja..."
                    className="flex-1"
                  />
                  <Button onClick={generateImage} disabled={generatingImage}>
                    <Wand2 className="w-4 h-4 mr-2" />
                    {generatingImage ? "Gerando..." : "Gerar"}
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">ou</div>
                  <Label htmlFor="upload-image" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-accent">
                      <ImageIcon className="w-4 h-4" />
                      <span>Upload de Imagem</span>
                    </div>
                    <Input
                      id="upload-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </Label>
                </div>
              </div>
            </div>

            {/* Preview Area */}
            <div className="border-t border-border pt-6">
              <Label>Visualização do Post</Label>
              <div className="mt-4 p-8 bg-secondary/20 rounded-lg border border-border">
                <div
                  ref={previewRef}
                  className={`mx-auto rounded-lg p-8 shadow-lg relative overflow-hidden ${
                    colorPalettes[colorPalette as keyof typeof colorPalettes].bg
                  } ${
                    format === "1:1"
                      ? "aspect-square max-w-md"
                      : format === "3:4"
                      ? "aspect-[3/4] max-w-sm"
                      : format === "9:16"
                      ? "aspect-[9/16] max-w-xs"
                      : "aspect-video max-w-2xl"
                  }`}
                  style={{
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="relative z-10 h-full flex flex-col justify-between p-6">
                    <div style={{ textAlign: textAlign }}>
                      <h3 
                        className={`font-bold ${colorPalettes[colorPalette as keyof typeof colorPalettes].text} ${fonts[fontFamily as keyof typeof fonts]}`}
                        style={{ 
                          fontSize: `${fontSize[0]}px`,
                          textShadow: backgroundImage ? '0 2px 8px rgba(0,0,0,0.5)' : 'none',
                          marginBottom: `${titleContentGap[0]}px`
                        }}
                      >
                        {title || "Título do Post"}
                      </h3>
                      <p 
                        className={`${colorPalettes[colorPalette as keyof typeof colorPalettes].text} ${fonts[fontFamily as keyof typeof fonts]}`}
                        style={{ 
                          fontSize: `${contentFontSize[0]}px`,
                          lineHeight: lineHeight[0],
                          textShadow: backgroundImage ? '0 2px 8px rgba(0,0,0,0.5)' : 'none'
                        }}
                      >
                        {content || "Conteúdo do post..."}
                      </p>
                    </div>
                    
                    {brandName && (
                      <div className="self-start">
                        <span 
                          className={`text-sm font-semibold ${colorPalettes[colorPalette as keyof typeof colorPalettes].text} ${fonts[fontFamily as keyof typeof fonts]}`}
                          style={{ textShadow: backgroundImage ? '0 2px 8px rgba(0,0,0,0.5)' : 'none' }}
                        >
                          @{brandName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button onClick={downloadPost} variant="outline" size="lg" className="flex-1">
                <Download className="w-5 h-5 mr-2" />
                Baixar Post
              </Button>
              <Button onClick={copyPost} variant="outline" size="lg" className="flex-1">
                <Copy className="w-5 h-5 mr-2" />
                Copiar Post
              </Button>
              <Button onClick={handleSave} disabled={loading} className="flex-1" size="lg">
                <Save className="w-5 h-5 mr-2" />
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}