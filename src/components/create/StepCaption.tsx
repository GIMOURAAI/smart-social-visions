import { WizardData, PostData } from "@/pages/Create";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Hash } from "lucide-react";

interface Props {
  data: WizardData;
  updateData: (d: Partial<WizardData>) => void;
}

export function StepCaption({ data, updateData }: Props) {
  const idx = data.currentPostIndex;
  const post = data.posts[idx];

  if (!post) {
    return (
      <p className="text-center text-muted-foreground">
        Nenhum post para editar
      </p>
    );
  }

  const update = (patch: Partial<PostData>) => {
    const next = [...data.posts];
    next[idx] = { ...post, ...patch };
    updateData({ posts: next });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateData({ currentPostIndex: idx - 1 })}
          disabled={idx === 0}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm font-medium">
          Post {idx + 1} de {data.posts.length}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateData({ currentPostIndex: idx + 1 })}
          disabled={idx >= data.posts.length - 1}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt={post.titulo}
              className="w-full h-auto"
            />
          ) : (
            <div className="aspect-square bg-muted flex items-center justify-center text-muted-foreground text-sm">
              Sem imagem
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <Label className="text-xs">Gancho</Label>
            <Textarea
              value={post.gancho}
              onChange={(e) => update({ gancho: e.target.value })}
              className="min-h-[60px] text-sm"
              maxLength={80}
            />
          </div>
          <div>
            <Label className="text-xs">Título</Label>
            <Textarea
              value={post.titulo}
              onChange={(e) => update({ titulo: e.target.value })}
              className="min-h-[50px] text-sm font-semibold"
              maxLength={50}
            />
          </div>
          <div>
            <Label className="text-xs">Subtítulo (até 2 linhas)</Label>
            <Textarea
              value={post.subtitulo}
              onChange={(e) => update({ subtitulo: e.target.value })}
              className="min-h-[60px] text-sm"
              maxLength={90}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-primary" />
          Legenda com SEO
        </Label>
        <Textarea
          value={post.legenda}
          onChange={(e) => update({ legenda: e.target.value })}
          className="min-h-[160px]"
          placeholder="Legenda otimizada com hashtags..."
        />
        <p className="text-xs text-muted-foreground">
          {post.legenda.length} caracteres • Inclua palavras-chave e hashtags
          relevantes
        </p>
      </div>
    </div>
  );
}
