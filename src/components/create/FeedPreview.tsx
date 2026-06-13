import { X, FileDown, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GeneratedPost } from "@/pages/Create";

interface Props {
  posts: GeneratedPost[];
  brandName: string;
  onClose: () => void;
  onDownloadPDF: () => void;
}

export function FeedPreview({ posts, brandName, onClose, onDownloadPDF }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8 px-4">
      <div className="w-full max-w-sm bg-card rounded-3xl shadow-2xl overflow-hidden">
        {/* Instagram-style header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
              {brandName?.charAt(0)?.toUpperCase() ?? "B"}
            </div>
            <div>
              <p className="text-xs font-bold text-foreground leading-none">{brandName || "Sua marca"}</p>
              <p className="text-[10px] text-muted-foreground">Prévia do feed</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Feed grid — 3 columns like Instagram */}
        <div className="grid grid-cols-3 gap-0.5 bg-muted/30">
          {posts.map((post, i) => (
            <div key={i} className="relative aspect-square overflow-hidden bg-muted group cursor-pointer">
              {post.imageUrl ? (
                <img
                  src={post.imageUrl}
                  alt={post.tituloArte}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                  <ImageIcon className="w-5 h-5 text-primary/40" />
                </div>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="text-center px-2">
                  <p className="text-white text-[9px] font-bold leading-tight line-clamp-2">{post.tituloArte}</p>
                  <p className="text-white/70 text-[8px] mt-0.5">{post.bloco}</p>
                </div>
              </div>
              {/* Block color indicator */}
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                post.bloco === "Dor" ? "bg-red-500" :
                post.bloco === "Autoridade" ? "bg-blue-500" :
                post.bloco === "Valor" ? "bg-green-500" :
                "bg-amber-500"
              }`} />
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="px-4 py-3 border-t border-border">
          <div className="flex gap-3 flex-wrap justify-center mb-3">
            {[
              { color: "bg-red-500", label: "Dor" },
              { color: "bg-blue-500", label: "Autoridade" },
              { color: "bg-green-500", label: "Valor" },
              { color: "bg-amber-500", label: "Venda" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${b.color}`} />
                <span className="text-[10px] text-muted-foreground">{b.label}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground text-center mb-3">
            {posts.length} post{posts.length !== 1 ? "s" : ""} gerado{posts.length !== 1 ? "s" : ""} · passe o mouse para ver detalhes
          </p>
          <Button
            onClick={onDownloadPDF}
            className="w-full rounded-full bg-gradient-primary hover:opacity-90 shadow-glow border-0"
          >
            <FileDown className="w-4 h-4 mr-2" />
            Baixar PDF completo
          </Button>
        </div>
      </div>
    </div>
  );
}
