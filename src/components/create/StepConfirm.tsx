import type { WizardData } from "@/pages/Create";

const NICHE_LABELS: Record<string, string> = {
  estetica: "Estética", moda: "Moda", restaurante: "Restaurante",
  "loja-online": "Loja Online", imobiliaria: "Imobiliária", consultoria: "Consultoria",
  infoproduto: "Infoproduto", saude: "Saúde", educacao: "Educação",
  beleza: "Beleza", "servicos-locais": "Serviços Locais", outro: "Outro",
};

const DAYS_LABELS: Record<number, string> = {
  7: "7 dias (1 semana)",
  15: "15 dias (2 semanas)",
  30: "30 dias (1 mês)",
};

const FEED_LABELS: Record<string, string> = {
  xadrez: "Xadrez (claro/escuro alternado)",
  escuro: "Só fundo escuro",
  claro: "Só fundo claro",
  colorido: "Fundo colorido da marca",
  gradiente: "Gradiente consistente",
  tematico: "Temático por bloco PostLab",
};

const PILOT_LABELS: Record<number, string> = {
  1: "Gerar 1 post piloto primeiro",
  3: "Gerar 3 posts piloto primeiro",
};

const TONE_LABELS: Record<string, string> = {
  profissional: "Profissional",
  descontraido: "Descontraído",
  inspirador: "Inspirador",
  urgente: "Urgente/Vendas",
  educativo: "Educativo",
  emocional: "Emocional",
};

interface Props {
  data: WizardData;
  onEdit: (step: number) => void;
}

function Row({ label, value, onEdit, step }: { label: string; value: string; onEdit: (s: number) => void; step: number }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm font-medium text-foreground leading-snug">{value || "—"}</p>
      </div>
      <button
        onClick={() => onEdit(step)}
        className="shrink-0 text-[11px] font-semibold text-primary hover:text-primary/70 transition mt-1"
      >
        Editar
      </button>
    </div>
  );
}

export function StepConfirm({ data, onEdit }: Props) {
  const totalPosts = data.daysQuantity ?? data.quantity;
  const totalCredits = totalPosts;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 bg-muted/50 border-b border-border">
          <p className="text-sm font-bold text-foreground">Revise tudo antes de gerar</p>
          <p className="text-xs text-muted-foreground">Confirme se as informações estão corretas</p>
        </div>
        <div className="px-4">
          <Row label="Criando para" value={data.forClient ? "🤝 Cliente" : "🙋 Mim mesmo"} onEdit={onEdit} step={1} />
          <Row label={data.forClient ? "Nome do cliente" : "Nome da marca"} value={data.brandName ?? ""} onEdit={onEdit} step={1} />
          <Row label="Nicho" value={NICHE_LABELS[data.niche] ?? data.niche} onEdit={onEdit} step={1} />
          <Row label="Tema / Assunto" value={data.theme} onEdit={onEdit} step={1} />
          <Row label="Objetivo" value={data.objective} onEdit={onEdit} step={2} />
          <Row label="Tom de voz" value={TONE_LABELS[data.tone] ?? data.tone} onEdit={onEdit} step={2} />
          <Row label="Estilo visual" value={data.visualStyle === "custom" ? "Estilo da minha marca (upload)" : data.visualStyle} onEdit={onEdit} step={3} />
          <Row label="Padrão do feed" value={FEED_LABELS[data.feedPattern ?? ""] ?? "—"} onEdit={onEdit} step={4} />
          <Row label="Formato" value={data.format} onEdit={onEdit} step={5} />
          <Row label="Quantidade" value={DAYS_LABELS[data.daysQuantity ?? 0] ?? `${totalPosts} posts`} onEdit={onEdit} step={5} />
          <Row label="Primeiro gerar (piloto)" value={PILOT_LABELS[data.pilotQuantity ?? 1] ?? "1 post"} onEdit={onEdit} step={5} />
        </div>
      </div>

      {/* Credit warning */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
        <div className="flex items-start gap-3">
          <span className="text-lg">💳</span>
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">
              Total: <span className="text-amber-600">{totalCredits} créditos</span> serão descontados
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Cada post inclui copy completo + imagem gerada com IA. Créditos descontados conforme os blocos forem aprovados e gerados.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4">
        <p className="text-xs text-foreground leading-relaxed">
          🚀 Ao confirmar, o SmartPostAI vai gerar o <strong>piloto</strong> ({data.pilotQuantity ?? 1} post{(data.pilotQuantity ?? 1) > 1 ? "s" : ""}) para você aprovar o estilo visual antes de continuar com todos os blocos.
        </p>
      </div>
    </div>
  );
}
