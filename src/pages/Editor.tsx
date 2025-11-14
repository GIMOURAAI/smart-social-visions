import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Sparkles, Download, Copy, Image as ImageIcon, Wand2, Move } from "lucide-react";
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
  const [generatingWithAI, setGeneratingWithAI] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [colorPalette, setColorPalette] = useState("default");
  const [fontFamily, setFontFamily] = useState("inter");
  const [fontSize, setFontSize] = useState([20]);
  const [contentFontSize, setContentFontSize] = useState([16]);
  const [titleContentGap, setTitleContentGap] = useState([16]);
  const [lineHeight, setLineHeight] = useState([1.5]);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [brandName, setBrandName] = useState("");
  const [titlePosition, setTitlePosition] = useState({ x: 50, y: 20 });
  const [contentPosition, setContentPosition] = useState({ x: 50, y: 50 });
  const [brandPosition, setBrandPosition] = useState({ x: 50, y: 85 });
  const [draggingElement, setDraggingElement] = useState<string | null>(null);
  const [editingElement, setEditingElement] = useState<string | null>(null);
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

  const createWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Prompt necessário",
        description: "Digite uma descrição do que deseja criar",
        variant: "destructive",
      });
      return;
    }

    setGeneratingWithAI(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-post-with-ai', {
        body: { prompt: aiPrompt }
      });

      if (error) throw error;

      if (data) {
        setTitle(data.title);
        setContent(data.content);
        setBackgroundImage(data.imageUrl);
        toast({
          title: "Post criado!",
          description: "Conteúdo gerado com IA com sucesso",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao criar com IA",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setGeneratingWithAI(false);
    }
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

  const handleMouseDown = (element: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDraggingElement(element);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingElement || !previewRef.current) return;

    const rect = previewRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (draggingElement === 'title') {
      setTitlePosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    } else if (draggingElement === 'content') {
      setContentPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    } else if (draggingElement === 'brand') {
      setBrandPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    }
  };

  const handleMouseUp = () => {
    setDraggingElement(null);
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

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controles à esquerda */}
          <Card className="p-8 h-fit">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Criar Novo Post</h2>

            <div className="space-y-6">
              {/* Criação com IA */}
              <div className="border border-primary/20 rounded-lg p-6 bg-primary/5">
                <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Criar Post com IA
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Descreva o que você quer criar..."
                      className="flex-1"
                    />
                    <Button onClick={createWithAI} disabled={generatingWithAI}>
                      <Wand2 className="w-4 h-4 mr-2" />
                      {generatingWithAI ? "Gerando..." : "Criar"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">ou configure</span>
                </div>
              </div>

              {/* Configurações de formato e paleta */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Formato</Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1:1">1:1</SelectItem>
                      <SelectItem value="3:4">3:4</SelectItem>
                      <SelectItem value="9:16">9:16</SelectItem>
                      <SelectItem value="16:9">16:9</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Paleta</Label>
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
              </div>

              {/* Tamanho das fontes */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Título: {fontSize[0]}px</Label>
                  <Slider
                    value={fontSize}
                    onValueChange={setFontSize}
                    min={12}
                    max={64}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Subtítulo: {contentFontSize[0]}px</Label>
                  <Slider
                    value={contentFontSize}
                    onValueChange={setContentFontSize}
                    min={10}
                    max={48}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Espaçamento */}
              <div>
                <Label>Espaçamento Linhas: {lineHeight[0].toFixed(1)}</Label>
                <Slider
                  value={lineHeight}
                  onValueChange={setLineHeight}
                  min={1}
                  max={3}
                  step={0.1}
                  className="mt-2"
                />
              </div>

              {/* Marca */}
              <div>
                <Label>Nome da Marca</Label>
                <Input
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Ex: minhamarca"
                  className="mt-2"
                />
              </div>

              {/* Imagem de fundo */}
              <div className="border-t border-border pt-6">
                <Label>Imagem de Fundo</Label>
                <div className="space-y-4 mt-4">
                  <div className="flex gap-2">
                    <Input
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      placeholder="Descreva a imagem..."
                      className="flex-1"
                    />
                    <Button onClick={generateImage} disabled={generatingImage}>
                      <Wand2 className="w-4 h-4 mr-2" />
                      {generatingImage ? "..." : "Gerar"}
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">ou</div>
                    <Label htmlFor="upload-image" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-accent">
                        <ImageIcon className="w-4 h-4" />
                        <span>Upload</span>
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

              {/* Botões de ação */}
              <div className="flex flex-col gap-3 pt-6 border-t border-border">
                <Button onClick={downloadPost} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar
                </Button>
                <Button onClick={copyPost} variant="outline">
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </div>
          </Card>

          {/* Preview à direita */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Label className="flex items-center gap-2 mb-4">
              <Move className="w-4 h-4" />
              Visualização (Arraste e clique duplo para editar)
            </Label>
            <div className="p-8 bg-secondary/20 rounded-lg border border-border">
              <div
                ref={previewRef}
                className={`mx-auto rounded-lg shadow-lg relative overflow-hidden cursor-move select-none ${
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
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Título */}
                <div
                  className="absolute cursor-move"
                  style={{
                    left: `${titlePosition.x}%`,
                    top: `${titlePosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                    maxWidth: '90%',
                  }}
                  onMouseDown={(e) => handleMouseDown('title', e)}
                  onDoubleClick={() => setEditingElement('title')}
                >
                  {editingElement === 'title' ? (
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onBlur={() => setEditingElement(null)}
                      autoFocus
                      className={`font-bold ${colorPalettes[colorPalette as keyof typeof colorPalettes].text} ${fonts[fontFamily as keyof typeof fonts]} bg-transparent border-2 border-primary`}
                      style={{ 
                        fontSize: `${fontSize[0]}px`,
                        textShadow: backgroundImage ? '0 2px 8px rgba(0,0,0,0.5)' : 'none',
                      }}
                    />
                  ) : (
                    <h3 
                      className={`font-bold ${colorPalettes[colorPalette as keyof typeof colorPalettes].text} ${fonts[fontFamily as keyof typeof fonts]} hover:opacity-80 transition-opacity`}
                      style={{ 
                        fontSize: `${fontSize[0]}px`,
                        textShadow: backgroundImage ? '0 2px 8px rgba(0,0,0,0.5)' : 'none',
                      }}
                    >
                      {title || "Título"}
                    </h3>
                  )}
                </div>

                {/* Conteúdo */}
                <div
                  className="absolute cursor-move"
                  style={{
                    left: `${contentPosition.x}%`,
                    top: `${contentPosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                    maxWidth: '90%',
                  }}
                  onMouseDown={(e) => handleMouseDown('content', e)}
                  onDoubleClick={() => setEditingElement('content')}
                >
                  {editingElement === 'content' ? (
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      onBlur={() => setEditingElement(null)}
                      autoFocus
                      className={`${colorPalettes[colorPalette as keyof typeof colorPalettes].text} ${fonts[fontFamily as keyof typeof fonts]} bg-transparent border-2 border-primary`}
                      style={{ 
                        fontSize: `${contentFontSize[0]}px`,
                        lineHeight: lineHeight[0],
                        textShadow: backgroundImage ? '0 2px 8px rgba(0,0,0,0.5)' : 'none',
                      }}
                    />
                  ) : (
                    <p 
                      className={`${colorPalettes[colorPalette as keyof typeof colorPalettes].text} ${fonts[fontFamily as keyof typeof fonts]} hover:opacity-80 transition-opacity`}
                      style={{ 
                        fontSize: `${contentFontSize[0]}px`,
                        lineHeight: lineHeight[0],
                        textShadow: backgroundImage ? '0 2px 8px rgba(0,0,0,0.5)' : 'none',
                      }}
                    >
                      {content || "Conteúdo"}
                    </p>
                  )}
                </div>

                {/* Marca */}
                {brandName && (
                  <div
                    className="absolute cursor-move"
                    style={{
                      left: `${brandPosition.x}%`,
                      top: `${brandPosition.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    onMouseDown={(e) => handleMouseDown('brand', e)}
                    onDoubleClick={() => setEditingElement('brand')}
                  >
                    {editingElement === 'brand' ? (
                      <Input
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        onBlur={() => setEditingElement(null)}
                        autoFocus
                        className={`text-sm font-semibold ${colorPalettes[colorPalette as keyof typeof colorPalettes].text} ${fonts[fontFamily as keyof typeof fonts]} bg-transparent border-2 border-primary`}
                        style={{ textShadow: backgroundImage ? '0 2px 8px rgba(0,0,0,0.5)' : 'none' }}
                      />
                    ) : (
                      <span 
                        className={`text-sm font-semibold ${colorPalettes[colorPalette as keyof typeof colorPalettes].text} ${fonts[fontFamily as keyof typeof fonts]} hover:opacity-80 transition-opacity`}
                        style={{ textShadow: backgroundImage ? '0 2px 8px rgba(0,0,0,0.5)' : 'none' }}
                      >
                        @{brandName}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                💡 Arraste elementos, clique duplo para editar texto
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
