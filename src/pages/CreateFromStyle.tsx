import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Sparkles, Check, Copy, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Phase = "upload" | "details" | "loading" | "pilot" | "results";

interface GeneratedPost {
  gancho: string;
  tituloArte: string;
  subtituloArte: string;
  legenda: string;
  cta: string;
  hashtags: string;
  promptVisual: string;
}

export default function CreateFromStyle() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [phase, setPhase] = useState<Phase>("upload");
  const [imageBase64, setImageBase64] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [brandName, setBrandName] = useState("");
  const [niche, setNiche] = useState("");
  const [quantity, setQuantity] = useState<1 | 3>(1);
  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  const [pilotPost, setPilotPost] = useState<GeneratedPost | null>(null);
  const [approved, setApproved] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Analisando estilo visual...");

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImageBase64(result);
      setImagePreview(result);
      setPhase("details");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  };

  const generate = async () => {
    setPhase("loading");
    setLoadingMsg("Analisando estilo visual com IA...");

    try {
      const msgs = [
        "Analisando cores e composição...",
        "Identificando tipografia e atmosfera...",
        "Gerando conteúdo no estilo detectado...",
        "Criando textos PostLab...",
      ];
      let i = 0;
      const interval = setInterval(() => {
        if (i < msgs.length) setLoadingMsg(msgs[i++]);
      }, 2500);

      const { data, error } = await supabase.functions.invoke("copy-style", {
        body: { imageBase64, brandName, niche, quantity },
      });

      clearInterval(interval);

      if (error || data?.error) throw new Error(error?.message || data?.error);

      const generated: GeneratedPost[] = data.posts;
      setPosts(generated);
      setPilotPost(generated[0]);
      setPhase("pilot");
    } catch (err: any) {
      toast({ title: "Erro ao gerar", description: err.message, variant: "destructive" });
      setPhase("details");
    }
  };

  const approvePilot = () => {
    setApproved(true);
    setPhase("results");
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado!", description: "Texto copiado para a área de transferência" });
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition"
        >
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-bold text-foreground">Copiar estilo de imagem</h1>
          <p className="text-xs text-muted-foreground">A IA analisa e cria no mesmo estilo</p>
        </div>
        <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-6">

        {/* FASE 1: Upload */}
        {phase === "upload" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">Envie a imagem de referência</h2>
              <p className="text-sm text-muted-foreground">
                Envie um post ou arte da sua marca. A IA vai escanear o estilo visual e criar conteúdo no mesmo padrão.
              </p>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="rounded-3xl border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary/60 transition-all cursor-pointer p-12 text-center"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
              />
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <p className="text-base font-bold text-foreground mb-1">Clique ou arraste aqui</p>
              <p className="text-sm text-muted-foreground">PNG, JPG, WEBP — qualquer arte de referência</p>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Como funciona:</span> A IA analisa cores, composição, tipografia e atmosfera da imagem. Depois gera posts no mesmo estilo visual com os textos da sua marca — sem copiar o design original.
              </p>
            </div>
          </div>
        )}

        {/* FASE 2: Detalhes */}
        {phase === "details" && (
          <div className="space-y-5">
            {/* Preview da imagem */}
            <div className="relative rounded-2xl overflow-hidden">
              <img src={imagePreview} alt="Referência" className="w-full max-h-56 object-cover rounded-2xl" />
              <button
                onClick={() => { setImageBase64(""); setImagePreview(""); setPhase("upload"); }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur rounded-full px-3 py-1">
                <p className="text-xs text-white font-semibold">Imagem de referência</p>
              </div>
            </div>

            {/* Dados da marca */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-1.5">Nome da marca</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Ex: Studio Bella, Clínica Saúde..."
                className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-1.5">Nicho / segmento</label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Ex: Estética, Moda, Consultoria..."
                className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              />
            </div>

            {/* Quantidade */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-3">Quantos posts?</label>
              <div className="grid grid-cols-2 gap-3">
                {([1, 3] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuantity(q)}
                    className={`flex flex-col items-center gap-1 rounded-2xl border-2 py-5 font-bold transition-all hover:-translate-y-0.5 ${
                      quantity === q ? "border-transparent shadow-glow text-white" : "border-border bg-card text-foreground"
                    }`}
                    style={quantity === q ? { background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)" } : {}}
                  >
                    <span className="text-3xl font-extrabold">{q}</span>
                    <span className={`text-xs ${quantity === q ? "text-white/80" : "text-muted-foreground"}`}>
                      {q === 1 ? "post piloto" : "posts completos"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generate}
              disabled={!brandName.trim()}
              className="w-full rounded-2xl py-4 text-base font-bold text-white shadow-glow transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)" }}
            >
              Analisar e gerar posts
            </button>
          </div>
        )}

        {/* FASE 3: Loading */}
        {phase === "loading" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-primary flex items-center justify-center shadow-glow animate-pulse">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -inset-3 rounded-full border-2 border-primary/30 animate-spin border-t-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-1">{loadingMsg}</h3>
              <p className="text-sm text-muted-foreground">Isso leva alguns segundos...</p>
            </div>
          </div>
        )}

        {/* FASE 4: Aprovação do piloto */}
        {phase === "pilot" && pilotPost && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
              <p className="text-sm font-bold text-primary mb-0.5">Aprovação do piloto</p>
              <p className="text-xs text-muted-foreground">
                Revise o primeiro post antes de {quantity === 3 ? "gerar os outros 2" : "finalizar"}. Aprove para continuar.
              </p>
            </div>

            <PostCard post={pilotPost} onCopy={copyText} />

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setPhase("details"); setPosts([]); }}
                className="rounded-2xl border-2 border-border py-3.5 text-sm font-bold text-foreground hover:bg-muted transition"
              >
                Refazer
              </button>
              <button
                onClick={approvePilot}
                className="rounded-2xl py-3.5 text-sm font-bold text-white shadow-glow transition hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)" }}
              >
                Aprovar
              </button>
            </div>
          </div>
        )}

        {/* FASE 5: Resultados */}
        {phase === "results" && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{posts.length} post{posts.length > 1 ? "s" : ""} gerado{posts.length > 1 ? "s" : ""}!</p>
                <p className="text-xs text-muted-foreground">No estilo visual da imagem de referência</p>
              </div>
            </div>

            {posts.map((post, i) => (
              <div key={i}>
                {posts.length > 1 && (
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Post {i + 1}</p>
                )}
                <PostCard post={post} onCopy={copyText} />
              </div>
            ))}

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full rounded-2xl border-2 border-border py-3.5 text-sm font-bold text-foreground hover:bg-muted transition"
            >
              Voltar ao Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PostCard({ post, onCopy }: { post: GeneratedPost; onCopy: (t: string) => void }) {
  return (
    <div className="rounded-3xl border border-border bg-card shadow-card overflow-hidden">
      {/* Gancho destaque */}
      <div className="p-5 border-b border-border" style={{ background: "linear-gradient(135deg, #7c3aed08 0%, #ec489908 100%)" }}>
        <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2">Gancho</p>
        <p className="text-base font-bold text-foreground leading-snug">{post.gancho}</p>
      </div>

      <div className="p-5 space-y-4">
        {/* Título + Subtítulo */}
        <div className="rounded-2xl bg-muted p-4 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Arte do post</p>
          <p className="text-lg font-extrabold text-foreground">{post.tituloArte}</p>
          <p className="text-sm text-muted-foreground">{post.subtituloArte}</p>
        </div>

        {/* Legenda */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Legenda</p>
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{post.legenda}</p>
        </div>

        {/* CTA */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-0.5">CTA</p>
          <p className="text-sm font-semibold text-foreground">{post.cta}</p>
        </div>

        {/* Hashtags */}
        <p className="text-xs text-primary/70">{post.hashtags}</p>

        {/* Copiar tudo */}
        <button
          onClick={() => onCopy(`${post.gancho}\n\n${post.tituloArte}\n${post.subtituloArte}\n\n${post.legenda}\n\n${post.cta}\n\n${post.hashtags}`)}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition"
        >
          <Copy className="w-4 h-4" />
          Copiar legenda completa
        </button>
      </div>
    </div>
  );
}
