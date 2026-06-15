import { useRef, useEffect } from "react";
import { GeneratedPost } from "@/pages/Create";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface Props {
  posts: GeneratedPost[];
  onChange: (posts: GeneratedPost[]) => void;
}

const BLOCK_COLORS: Record<string, { badge: string; bar: string }> = {
  Dor: { badge: "bg-red-100 text-red-700 border-red-200", bar: "bg-red-500" },
  Autoridade: { badge: "bg-blue-100 text-blue-700 border-blue-200", bar: "bg-blue-500" },
  Valor: { badge: "bg-green-100 text-green-700 border-green-200", bar: "bg-green-500" },
  Venda: { badge: "bg-amber-100 text-amber-700 border-amber-200", bar: "bg-amber-500" },
};

function AutoResizeTextarea({
  value,
  onChange,
  className,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  placeholder?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={1}
      className={`w-full resize-none overflow-hidden bg-transparent border-0 border-b border-border/50 focus:border-primary focus:outline-none text-sm text-foreground leading-relaxed py-1 transition-colors ${className ?? ""}`}
    />
  );
}

function PostCard({
  post,
  index,
  onChange,
}: {
  post: GeneratedPost;
  index: number;
  onChange: (updated: GeneratedPost) => void;
}) {
  const [legendaOpen, setLegendaOpen] = useState(false);
  const colors = BLOCK_COLORS[post.bloco] ?? BLOCK_COLORS["Dor"];

  const update = (field: keyof GeneratedPost, value: string) => {
    onChange({ ...post, [field]: value });
  };

  return (
    <div className="relative rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Color bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${colors.bar}`} />

      <div className="pl-4 pr-4 pt-3 pb-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold text-muted-foreground">Post {index + 1}</span>
          <Badge variant="outline" className={`text-[10px] font-semibold px-2 py-0.5 ${colors.badge}`}>
            {post.bloco}
          </Badge>
          {post.tipoConteudo && (
            <span className="text-[10px] text-muted-foreground truncate max-w-[140px]">{post.tipoConteudo}</span>
          )}
        </div>

        {/* Gancho */}
        <div className="mb-3">
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Gancho
          </label>
          <AutoResizeTextarea
            value={post.gancho}
            onChange={(v) => update("gancho", v)}
            placeholder="Gancho do post..."
            className="font-medium"
          />
        </div>

        {/* Título e Subtítulo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Título da arte
            </label>
            <AutoResizeTextarea
              value={post.tituloArte}
              onChange={(v) => update("tituloArte", v)}
              placeholder="Título da arte..."
              className="font-bold text-base"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Subtítulo
            </label>
            <AutoResizeTextarea
              value={post.subtituloArte}
              onChange={(v) => update("subtituloArte", v)}
              placeholder="Subtítulo..."
            />
          </div>
        </div>

        {/* Legenda (collapsible) */}
        <div>
          <button
            onClick={() => setLegendaOpen((o) => !o)}
            className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-1"
          >
            Legenda
            {legendaOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {legendaOpen && (
            <AutoResizeTextarea
              value={post.legenda}
              onChange={(v) => update("legenda", v)}
              placeholder="Legenda completa..."
            />
          )}
        </div>

        {/* CTA + Hashtags pills */}
        <div className="flex flex-wrap gap-2 mt-3">
          {post.cta && (
            <span className="inline-flex items-center gap-1 text-[10px] bg-primary/10 text-primary rounded-full px-2.5 py-1 font-medium">
              CTA: {post.cta}
            </span>
          )}
          {post.hashtags && (
            <span className="inline-flex items-center text-[10px] bg-muted text-muted-foreground rounded-full px-2.5 py-1 truncate max-w-[220px]">
              {post.hashtags.split(" ").slice(0, 4).join(" ")}
              {post.hashtags.split(" ").length > 4 ? " ..." : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function StepEditorial({ posts, onChange }: Props) {
  const handlePostChange = (index: number, updated: GeneratedPost) => {
    const next = [...posts];
    next[index] = updated;
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center mb-2">
        <h3 className="text-lg font-bold text-foreground">
          Linha Editorial — revise e edite antes de gerar as imagens
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {posts.length} posts gerados. Edite qualquer campo inline e depois aprove para gerar as imagens.
        </p>
      </div>

      <div className="flex gap-3 flex-wrap justify-center mb-1">
        {(["Dor", "Autoridade", "Valor", "Venda"] as const).map((b) => {
          const count = posts.filter((p) => p.bloco === b).length;
          const colors = BLOCK_COLORS[b];
          return (
            <span
              key={b}
              className={`inline-flex items-center gap-1 text-[11px] font-semibold rounded-full px-3 py-1 border ${colors.badge}`}
            >
              <span className={`w-2 h-2 rounded-full ${colors.bar}`} />
              {b} ({count})
            </span>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 max-h-[520px] overflow-y-auto pr-1">
        {posts.map((post, i) => (
          <PostCard key={i} post={post} index={i} onChange={(updated) => handlePostChange(i, updated)} />
        ))}
      </div>
    </div>
  );
}
