import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Sparkles, Download, Copy, Image as ImageIcon, Wand2, Palette, Maximize2 } from "lucide-react";
import { transferImageColors, upscaleImage, loadImage } from "@/lib/imageProcessing";
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
  const [fontSize, setFontSize] = useState([32]);
  const [contentFontSize, setContentFontSize] = useState([18]);
  const [lineHeight, setLineHeight] = useState([1.5]);
  const [titleAlign, setTitleAlign] = useState<"left" | "center" | "right">("center");
  const [contentAlign, setContentAlign] = useState<"left" | "center" | "right">("center");
  const [paddingX, setPaddingX] = useState([40]);
  const [paddingY, setPaddingY] = useState([40]);
  const [titleColor, setTitleColor] = useState("#ffffff");
  const [contentColor, setContentColor] = useState("#ffffff");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [colorTransferImage, setColorTransferImage] = useState<File | null>(null);
  const [processingImage, setProcessingImage] = useState(false);
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

  const aspectRatios = {
    "1:1": "aspect-square max-w-md",
    "3:4": "aspect-[3/4] max-w-sm",
    "9:16": "aspect-[9/16] max-w-xs",
    "16:9": "aspect-video max-w-2xl",
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
        if (data.imageUrl) {
          setBackgroundImage(data.imageUrl);
        }
        toast({
          title: "Post criado!",
          description: "O conteúdo foi gerado com IA. Ajuste conforme necessário.",
        });
      }
    } catch (error) {
      console.error('Erro ao criar com IA:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o conteúdo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setGeneratingWithAI(false);
    }
  };

  const generateImage = async () => {
    if (!imagePrompt.trim()) {
      toast({
        title: "Descrição necessária",
        description: "Digite uma descrição para a imagem",
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
          description: "A imagem de fundo foi criada com sucesso.",
        });
      }
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar a imagem. Tente novamente.",
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
    }
  };

  const handleColorTransferUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setColorTransferImage(file);
    }
  };

  const applyColorTransfer = async () => {
    if (!uploadedImage || !colorTransferImage) {
      toast({
        title: "Imagens necessárias",
        description: "Envie uma imagem de fundo e uma imagem de referência de cor.",
        variant: "destructive",
      });
      return;
    }

    setProcessingImage(true);
    try {
      const targetImg = await loadImage(uploadedImage);
      const sourceImg = await loadImage(colorTransferImage);
      
      const resultBlob = await transferImageColors(sourceImg, targetImg);
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target?.result as string);
        toast({
          title: "Cores transferidas!",
          description: "As cores foram aplicadas com sucesso.",
        });
      };
      reader.readAsDataURL(resultBlob);
    } catch (error) {
      console.error('Erro ao transferir cores:', error);
      toast({
        title: "Erro",
        description: "Não foi possível transferir as cores.",
        variant: "destructive",
      });
    } finally {
      setProcessingImage(false);
    }
  };

  const applyUpscale = async () => {
    if (!backgroundImage) {
      toast({
        title: "Imagem necessária",
        description: "Envie ou gere uma imagem primeiro.",
        variant: "destructive",
      });
      return;
    }

    setProcessingImage(true);
    try {
      const img = await loadImage(backgroundImage);
      const resultBlob = await upscaleImage(img);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target?.result as string);
        toast({
          title: "Upscaling aplicado!",
          description: "A imagem foi melhorada com sucesso.",
        });
      };
      reader.readAsDataURL(resultBlob);
    } catch (error) {
      console.error('Erro ao fazer upscale:', error);
      toast({
        title: "Erro",
        description: "Não foi possível fazer upscale da imagem.",
        variant: "destructive",
      });
    } finally {
      setProcessingImage(false);
    }
  };

  const handleMouseDown = (element: string, e: React.MouseEvent) => {
    e.stopPropagation();
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

  const savePost = async () => {
    if (!title.trim()) {
      toast({
        title: "Título necessário",
        description: "Por favor, adicione um título ao seu post",
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
        image_url: backgroundImage || null,
      });

      if (error) throw error;

      toast({
        title: "Post salvo!",
        description: "Seu post foi salvo com sucesso",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast({
        title: "Erro ao salvar",
        description: "Houve um erro ao salvar seu post. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!previewRef.current) return;

    try {
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: null,
        scale: 2,
      });

      const link = document.createElement("a");
      link.download = `post-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast({
        title: "Download concluído!",
        description: "Sua imagem foi baixada com sucesso",
      });
    } catch (error) {
      console.error("Erro ao baixar:", error);
      toast({
        title: "Erro ao baixar",
        description: "Houve um erro ao baixar sua imagem. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    if (!previewRef.current) return;

    try {
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: null,
        scale: 2,
      });

      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);

          toast({
            title: "Copiado!",
            description: "A imagem foi copiada para a área de transferência",
          });
        }
      });
    } catch (error) {
      console.error("Erro ao copiar:", error);
      toast({
        title: "Erro ao copiar",
        description: "Houve um erro ao copiar sua imagem. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
          {/* Controles */}
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

              {/* Formato e Paleta */}
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

              {/* Tamanho das Fontes */}
              <div className="space-y-2">
                <Label>Tamanho do Título: {fontSize[0]}px</Label>
                <Slider
                  value={fontSize}
                  onValueChange={setFontSize}
                  min={16}
                  max={72}
                  step={2}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Tamanho do Conteúdo: {contentFontSize[0]}px</Label>
                <Slider
                  value={contentFontSize}
                  onValueChange={setContentFontSize}
                  min={12}
                  max={48}
                  step={2}
                  className="w-full"
                />
              </div>

              {/* Alinhamentos */}
              <div className="space-y-2">
                <Label>Alinhamento do Título</Label>
                <Select value={titleAlign} onValueChange={(value: "left" | "center" | "right") => setTitleAlign(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Esquerda</SelectItem>
                    <SelectItem value="center">Centro</SelectItem>
                    <SelectItem value="right">Direita</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Alinhamento do Conteúdo</Label>
                <Select value={contentAlign} onValueChange={(value: "left" | "center" | "right") => setContentAlign(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Esquerda</SelectItem>
                    <SelectItem value="center">Centro</SelectItem>
                    <SelectItem value="right">Direita</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Espaçamento */}
              <div className="space-y-2">
                <Label>Espaçamento entre Linhas: {lineHeight[0].toFixed(1)}</Label>
                <Slider
                  value={lineHeight}
                  onValueChange={setLineHeight}
                  min={1}
                  max={3}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Margem Horizontal: {paddingX[0]}px</Label>
                <Slider
                  value={paddingX}
                  onValueChange={setPaddingX}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Margem Vertical: {paddingY[0]}px</Label>
                <Slider
                  value={paddingY}
                  onValueChange={setPaddingY}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Cores */}
              <div className="space-y-2">
                <Label htmlFor="title-color">Cor do Título</Label>
                <Input
                  id="title-color"
                  type="color"
                  value={titleColor}
                  onChange={(e) => setTitleColor(e.target.value)}
                  className="h-10 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content-color">Cor do Conteúdo</Label>
                <Input
                  id="content-color"
                  type="color"
                  value={contentColor}
                  onChange={(e) => setContentColor(e.target.value)}
                  className="h-10 cursor-pointer"
                />
              </div>

              {/* Fonte */}
              <div>
                <Label>Fonte</Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="serif">Serif</SelectItem>
                    <SelectItem value="mono">Mono</SelectItem>
                    <SelectItem value="cursive">Cursive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Nome da Marca */}
              <div>
                <Label>Nome da Marca</Label>
                <Input
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Digite o nome da marca"
                  className="mt-2"
                />
              </div>

              {/* Geração de Imagem com IA */}
              <div className="border border-primary/20 rounded-lg p-6 bg-primary/5">
                <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  Gerar Imagem de Fundo com IA
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      placeholder="Descreva a imagem que deseja..."
                      className="flex-1"
                    />
                    <Button onClick={generateImage} disabled={generatingImage}>
                      <Wand2 className="w-4 h-4 mr-2" />
                      {generatingImage ? "Gerando..." : "Gerar"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Upload de Imagem */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image-upload">Ou envie uma imagem</Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-2"
                  />
                </div>

                {/* Transferência de Cor */}
                <div className="border-t pt-4">
                  <Label htmlFor="color-transfer">Transferir Cor de Referência</Label>
                  <Input
                    id="color-transfer"
                    type="file"
                    accept="image/*"
                    onChange={handleColorTransferUpload}
                    className="mt-2"
                  />
                  <Button 
                    onClick={applyColorTransfer} 
                    disabled={!uploadedImage || !colorTransferImage || processingImage}
                    className="mt-2 w-full"
                    variant="outline"
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    {processingImage ? "Processando..." : "Aplicar Cores"}
                  </Button>
                </div>

                {/* Upscaling */}
                <div className="border-t pt-4">
                  <Label>Melhorar Qualidade da Imagem</Label>
                  <p className="text-xs text-muted-foreground mt-1 mb-2">
                    Aumenta resolução e melhora detalhes sem alterar aparência
                  </p>
                  <Button 
                    onClick={applyUpscale} 
                    disabled={!backgroundImage || processingImage}
                    className="w-full"
                    variant="outline"
                  >
                    <Maximize2 className="w-4 h-4 mr-2" />
                    {processingImage ? "Processando..." : "Upscale (2x)"}
                  </Button>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-2 pt-4">
                <Button onClick={savePost} disabled={loading} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Salvando..." : "Salvar"}
                </Button>
                <Button onClick={downloadImage} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar
                </Button>
                <Button onClick={copyToClipboard} variant="outline">
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </Button>
              </div>
            </div>
          </Card>

          {/* Preview */}
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
              💡 Arraste elementos para reposicionar, clique duplo para editar texto
            </div>
            
            <div
              ref={previewRef}
              className={`relative ${aspectRatios[format as keyof typeof aspectRatios]} mx-auto overflow-hidden rounded-lg shadow-lg cursor-move`}
              style={{
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: `${paddingY[0]}px ${paddingX[0]}px`,
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div 
                className={`absolute inset-0 ${colorPalettes[colorPalette as keyof typeof colorPalettes].bg} ${backgroundImage ? 'opacity-80' : 'opacity-100'}`}
                style={{ margin: `-${paddingY[0]}px -${paddingX[0]}px` }}
              />

              {/* Título */}
              <div
                className="absolute cursor-move z-10"
                style={{
                  left: `${titlePosition.x}%`,
                  top: `${titlePosition.y}%`,
                  transform: 'translate(-50%, -50%)',
                  maxWidth: '90%',
                }}
              >
                {editingElement === 'title' ? (
                  <Textarea
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => setEditingElement(null)}
                    autoFocus
                    rows={3}
                    className="bg-transparent border-2 border-dashed border-white/50 resize-none"
                    style={{
                      fontSize: `${fontSize[0]}px`,
                      fontFamily: fonts[fontFamily as keyof typeof fonts],
                      textAlign: titleAlign,
                      lineHeight: lineHeight[0],
                    }}
                  />
                ) : (
                  <h3
                    className={`font-bold ${colorPalettes[colorPalette as keyof typeof colorPalettes].text} ${fonts[fontFamily as keyof typeof fonts]} cursor-move whitespace-pre-wrap`}
                    style={{ 
                      fontSize: `${fontSize[0]}px`,
                      textAlign: titleAlign,
                      lineHeight: lineHeight[0],
                    }}
                    onMouseDown={(e) => handleMouseDown('title', e)}
                    onDoubleClick={() => setEditingElement('title')}
                  >
                    {title || "Seu título aqui"}
                  </h3>
                )}
              </div>

              {/* Conteúdo */}
              <div
                className="absolute cursor-move z-10"
                style={{
                  left: `${contentPosition.x}%`,
                  top: `${contentPosition.y}%`,
                  transform: 'translate(-50%, -50%)',
                  maxWidth: '90%',
                }}
              >
                {editingElement === 'content' ? (
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onBlur={() => setEditingElement(null)}
                    autoFocus
                    rows={4}
                    className="bg-transparent border-2 border-dashed border-white/50 resize-none whitespace-pre-wrap"
                    style={{
                      fontSize: `${contentFontSize[0]}px`,
                      fontFamily: fonts[fontFamily as keyof typeof fonts],
                      lineHeight: lineHeight[0],
                      textAlign: contentAlign,
                      color: contentColor,
                      width: '100%',
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                ) : (
                  <p
                    className={`${colorPalettes[colorPalette as keyof typeof colorPalettes].text} ${fonts[fontFamily as keyof typeof fonts]} cursor-move whitespace-pre-wrap`}
                    style={{ 
                      fontSize: `${contentFontSize[0]}px`,
                      lineHeight: lineHeight[0],
                      textAlign: contentAlign,
                      color: contentColor,
                    }}
                    onMouseDown={(e) => handleMouseDown('content', e)}
                    onDoubleClick={() => setEditingElement('content')}
                  >
                    {content || "Seu conteúdo aqui"}
                  </p>
                )}
              </div>

              {/* Marca */}
              {brandName && (
                <div
                  className="absolute cursor-move z-10"
                  style={{
                    left: `${brandPosition.x}%`,
                    top: `${brandPosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                    maxWidth: '90%',
                  }}
                >
                  {editingElement === 'brand' ? (
                    <Input
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      onBlur={() => setEditingElement(null)}
                      autoFocus
                      className="bg-transparent border-2 border-dashed border-white/50"
                      style={{
                        fontSize: '14px',
                        fontFamily: fonts[fontFamily as keyof typeof fonts],
                      }}
                    />
                  ) : (
                    <p
                      className={`text-sm ${colorPalettes[colorPalette as keyof typeof colorPalettes].accent} ${fonts[fontFamily as keyof typeof fonts]} cursor-move`}
                      onMouseDown={(e) => handleMouseDown('brand', e)}
                      onDoubleClick={() => setEditingElement('brand')}
                    >
                      {brandName}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
