import { useState } from "react";
import {
  Copy,
  Download,
  RefreshCw,
  Image as ImageIcon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GeneratedPost } from "@/pages/Create";

interface Props {
  posts: GeneratedPost[];
  onRegenerate: () => void;
  onRegenerateImage: (index: number) => void;
  onEnhance: (index: number) => void;
}

function PostCard({
  post,
  index,
  onRegenerate,
  onRegenerateImage,
  onEnhance,
}: {
  post: GeneratedPost;
  index: number;
  onRegenerate: () => void;
  onRegenerateImage: (i: number) => void;
  onEnhance: (i: number) => void;
}) {
  const [promptExpanded, setPromptExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyLegenda = async () => {
    const parts = [post.legenda, post.cta, post.hashtags].filter(Boolean);
    await navigator.clipboard.writeText(parts.join("\n\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadImage = () => {
    if (!post.imageUrl) return;
    const a = document.createElement("a");
    a.href = post.imageUrl;
    a.download = `post-${index + 1}.png`;
    a.click();
  };

  return (
    <div className="bg-card rounded-3xl shadow-card overflow-hidden border border-border">
      {/* Image area */}
      <div className="relative bg-gradient-to-br from-primary/20 to-secondary/20 aspect-[4/5] max-h-80 flex items-center justify-center overflow-hidden">
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.tituloArte}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="p-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto">
              <ImageIcon className="w-7 h-7 text-primary/60" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              {post.promptVisual || "Imagem será gerada em breve"}
            </p>
          </div>
        )}
        {/* overlay pills */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {post.tipoConteudo && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm">
              {post.tipoConteudo}
            </span>
          )}
          {post.intencaoEmocional && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/70 text-white backdrop-blur-sm">
              {post.intencaoEmocional}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Gancho */}
        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-primary mb-1">
            Gancho
          </p>
          <p className="text-base font-bold text-foreground leading-snug">
            {post.gancho}
          </p>
        </div>

        {/* Arte texts */}
        <div className="grid grid-cols-1 gap-3">
          {post.tituloArte && (
            <div className="rounded-xl bg-muted/60 px-3 py-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-0.5">
                Título da arte
              </p>
              <p className="text-sm font-semibold text-foreground">
                {post.tituloArte}
              </p>
            </div>
          )}
          {post.subtituloArte && (
            <div className="rounded-xl bg-muted/60 px-3 py-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-0.5">
                Subtítulo da arte
              </p>
              <p className="text-sm text-foreground">{post.subtituloArte}</p>
            </div>
          )}
          {post.textoArte && (
            <div className="rounded-xl bg-muted/60 px-3 py-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-0.5">
                Texto curto da arte
              </p>
              <p className="text-sm text-foreground">{post.textoArte}</p>
            </div>
          )}
        </div>

        {/* Caption block — legenda + CTA + hashtags */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b border-border/50">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
              Legenda + CTA + Hashtags
            </p>
            <button
              onClick={copyLegenda}
              className="flex items-center gap-1.5 text-[11px] font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1 rounded-full hover:opacity-90 transition"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copiado!" : "Copiar para postar"}
            </button>
          </div>
          <div className="p-3 space-y-2">
            <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
              {post.legenda}
            </p>
            {post.cta && (
              <p className="text-xs font-semibold text-primary">{post.cta}</p>
            )}
            {post.hashtags && (
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {post.hashtags}
              </p>
            )}
          </div>
        </div>

        {/* Story complementar */}
        {post.storyComplementar && (
          <div className="rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => setPromptExpanded((v) => !v)}
              className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-muted/50 transition"
            >
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                Story complementar
              </p>
              {promptExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </button>
            {promptExpanded && (
              <div className="px-3 pb-3">
                <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                  {post.storyComplementar}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="px-5 pb-5 flex flex-wrap gap-2 border-t border-border pt-4">
        {post.imageUrl && (
          <button
            onClick={downloadImage}
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition"
          >
            <Download className="w-3.5 h-3.5" />
            Baixar imagem
          </button>
        )}
        <button
          onClick={onRegenerate}
          className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Regenerar post
        </button>
        <button
          onClick={() => onRegenerateImage(index)}
          className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          Regenerar imagem
        </button>
        <button
          onClick={() => onEnhance(index)}
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white px-3 py-1.5 text-xs font-semibold hover:opacity-90 transition shadow-glow"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Melhorar qualidade
        </button>
      </div>
    </div>
  );
}

export function StepResult({ posts, onRegenerate, onRegenerateImage, onEnhance }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhum post gerado.</p>
      </div>
    );
  }

  const isMultiple = posts.length > 1;

  return (
    <div className="space-y-5">
      {isMultiple && (
        <div className="flex items-center justify-between bg-card rounded-2xl px-4 py-3 border border-border">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center disabled:opacity-30 hover:bg-muted/80 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <p className="text-sm font-semibold text-foreground">
            Post {currentIndex + 1} de {posts.length}
          </p>
          <button
            onClick={() => setCurrentIndex((i) => Math.min(posts.length - 1, i + 1))}
            disabled={currentIndex === posts.length - 1}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center disabled:opacity-30 hover:bg-muted/80 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <PostCard
        post={posts[currentIndex]}
        index={currentIndex}
        onRegenerate={onRegenerate}
        onRegenerateImage={onRegenerateImage}
        onEnhance={onEnhance}
      />

      {isMultiple && (
        <div className="flex gap-1.5 justify-center flex-wrap">
          {posts.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex ? "bg-primary w-5" : "bg-muted hover:bg-primary/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
