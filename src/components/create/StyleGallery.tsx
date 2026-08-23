import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ref01 from "@/assets/styles/ref01.webp.asset.json";
import ref02 from "@/assets/styles/ref02.webp.asset.json";
import ref03 from "@/assets/styles/ref03.webp.asset.json";
import ref04 from "@/assets/styles/ref04.webp.asset.json";
import ref05 from "@/assets/styles/ref05.webp.asset.json";
import ref06 from "@/assets/styles/ref06.webp.asset.json";
import ref07 from "@/assets/styles/ref07.webp.asset.json";
import ref08 from "@/assets/styles/ref08.webp.asset.json";
import ref09 from "@/assets/styles/ref09.webp.asset.json";

export type StyleCategory = "empreendedorismo" | "esteticas";

export interface StylePreset {
  id: string;
  label: string;
  desc: string;
  category: StyleCategory;
  /** Imagem real do modelo (categoria Empreendedorismo) */
  image?: string;
  /** Fallback visual para estéticas sem imagem de referência */
  colors?: string[];
  icon?: string;
  /** true quando vem da tabela style_references (upload do admin) */
  dynamic?: boolean;
  /** id da linha em style_references (para excluir) */
  rowId?: string;
}

/**
 * Galeria de estilos premium.
 * - `Empreendedorismo`: os modelos oficiais (imagens reais, sem gradiente abstrato).
 * - `Estéticas`: os TEMAs PostLab e direções de arte complementares (ids reconhecidos
 *   pela edge function `generate-post-batch`).
 * Seleção múltipla: até 3 referências que a IA mistura (estética, composição,
 * iluminação, paleta, atmosfera) — nunca copia layout.
 */
export const STYLE_PRESETS: StylePreset[] = [
  { id: "emp-01-glass-authority", label: "Glass Authority", desc: "Vidro azul, tipografia gigante ao fundo, luz difusa", category: "empreendedorismo", image: ref01.url },
  { id: "emp-02-black-gold", label: "Black & Gold", desc: "Preto profundo, âmbar dourado, destaque em bloco", category: "empreendedorismo", image: ref02.url },
  { id: "emp-03-blue-presence", label: "Blue Presence", desc: "Cidade noturna, azul cinematográfico, presença", category: "empreendedorismo", image: ref03.url },
  { id: "emp-04-golden-growth", label: "Golden Growth", desc: "Escada dourada, hora azul, crescimento", category: "empreendedorismo", image: ref04.url },
  { id: "emp-05-red-authority", label: "Red Authority", desc: "Laranja/vermelho, bullets, autoridade e decisão", category: "empreendedorismo", image: ref05.url },
  { id: "emp-06-lifestyle-impact", label: "Lifestyle Impact", desc: "Luz natural, hora dourada, headline no topo", category: "empreendedorismo", image: ref06.url },
  { id: "emp-07-swiss-personal-brand", label: "Swiss Personal Brand", desc: "Fundo claro, grid suíço, acento laranja", category: "empreendedorismo", image: ref07.url },
  { id: "emp-08-black-gold-luxury", label: "Black Gold Luxury", desc: "Serifada dourada, prestígio, fundo preto", category: "empreendedorismo", image: ref08.url },
  { id: "emp-09-cinematic-value", label: "Cinematic Value", desc: "Cena cinematográfica, profundidade e drama", category: "empreendedorismo", image: ref09.url },

  { id: "tema-01-saas", label: "Clean Premium", desc: "Minimalismo sofisticado, luz de janela, vidro", category: "esteticas", colors: ["#0f172a", "#7c3aed", "#e9d5ff"], icon: "💼" },
  { id: "tema-02-moda", label: "Luxo Editorial", desc: "Editorial fashion, dourado, mármore", category: "esteticas", colors: ["#fdf4ec", "#c9a84c", "#1a1a2e"], icon: "👗" },
  { id: "tema-03-tech", label: "Dark Neon", desc: "Cinematográfico escuro, neon, alto contraste", category: "esteticas", colors: ["#000000", "#00e5a0", "#8b5cf6"], icon: "⚡" },
  { id: "tema-04-resultado", label: "Prova & Resultado", desc: "Claro, otimista, números em destaque", category: "esteticas", colors: ["#ffffff", "#2563eb", "#16a34a"], icon: "🏆" },
  { id: "tema-05-emocional", label: "Emocional Warm", desc: "Íntimo, luz dourada, tom nostálgico", category: "esteticas", colors: ["#fdf6f0", "#e8a87c", "#8b6057"], icon: "💛" },
  { id: "tema-06-saude", label: "Clínico Confiável", desc: "Branco limpo, azul, autoridade técnica", category: "esteticas", colors: ["#ffffff", "#0ea5e9", "#0c4a6e"], icon: "🩺" },
  { id: "tema-07-imoveis", label: "Prestígio Imóveis", desc: "Arquitetura, ouro, hora dourada", category: "esteticas", colors: ["#1a1a1a", "#c9a84c", "#f5f0e8"], icon: "🏛️" },
  { id: "tema-08-juridico", label: "Autoridade Séria", desc: "Escuro, madeira, tipografia serifada", category: "esteticas", colors: ["#0f172a", "#b8860b", "#f8fafc"], icon: "⚖️" },
  { id: "tema-09-influencer", label: "Personal Brand", desc: "Vibrante, movimento, cor saturada", category: "esteticas", colors: ["#ff6b9d", "#c4a7e7", "#f5d020"], icon: "✨" },
  { id: "estetica-glass", label: "Glassmorphism", desc: "Camadas translúcidas, blur, profundidade", category: "esteticas", colors: ["#111827", "#38bdf8", "#f1f5f9"], icon: "🧊" },
  { id: "estetica-tipografia", label: "Tipografia Forte", desc: "Headline gigante, poucos elementos", category: "esteticas", colors: ["#0a0a0a", "#f5f5f5", "#ef4444"], icon: "🔠" },
  { id: "estetica-cinematic", label: "Cinematic Grade", desc: "Teal-orange, grão de filme, drama", category: "esteticas", colors: ["#0b1a1f", "#e07b39", "#7dd3c0"], icon: "🎬" },
];

/** Referências enviadas pelo admin (preenchido em runtime, usado para rótulos). */
export const DYNAMIC_PRESETS: StylePreset[] = [];

const TABS: { id: StyleCategory; label: string }[] = [
  { id: "empreendedorismo", label: "Empreendedorismo" },
  { id: "esteticas", label: "Estéticas" },
];

interface Props {
  /** ids selecionados (máx. 3) */
  value: string[];
  onChange: (ids: string[]) => void;
  max?: number;
}

export function StyleGallery({ value, onChange, max = 3 }: Props) {
  const [tab, setTab] = useState<StyleCategory>("empreendedorismo");
  const [isAdmin, setIsAdmin] = useState(false);
  const [dynamic, setDynamic] = useState<StylePreset[]>([]);
  const [busy, setBusy] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const { data, error } = await supabase.functions.invoke("style-refs", { body: { action: "list" } });
    if (error || !data) return;
    setIsAdmin(Boolean(data.isAdmin));
    const mapped: StylePreset[] = (data.refs ?? [])
      .filter((r: { url: string | null }) => !!r.url)
      .map((r: { id: string; label: string; description: string | null; category: string; url: string }) => ({
        id: `ref-${r.id}`,
        rowId: r.id,
        label: r.label,
        desc: r.description ?? "Referência personalizada",
        category: (r.category === "esteticas" ? "esteticas" : "empreendedorismo") as StyleCategory,
        image: r.url,
        dynamic: true,
      }));
    setDynamic(mapped);
    DYNAMIC_PRESETS.splice(0, DYNAMIC_PRESETS.length, ...mapped);
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = (id: string) => {
    if (value.includes(id)) onChange(value.filter((v) => v !== id));
    else if (value.length < max) onChange([...value, id]);
  };

  const upload = async (file: File) => {
    setBusy(true);
    try {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
        reader.readAsDataURL(file);
      });
      await supabase.functions.invoke("style-refs", {
        body: {
          action: "create",
          label: newLabel || file.name.replace(/\.[^.]+$/, ""),
          description: newDesc || null,
          category: tab,
          fileBase64: base64,
          fileName: file.name,
          contentType: file.type || "image/webp",
        },
      });
      setNewLabel("");
      setNewDesc("");
      await load();
    } finally {
      setBusy(false);
    }
  };

  const remove = async (rowId: string) => {
    setBusy(true);
    try {
      await supabase.functions.invoke("style-refs", { body: { action: "delete", id: rowId } });
      onChange(value.filter((v) => v !== `ref-${rowId}`));
      await load();
    } finally {
      setBusy(false);
    }
  };

  const items = [...STYLE_PRESETS, ...dynamic].filter((s) => s.category === tab);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <div className="inline-flex rounded-full spa-panel p-0.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition ${
                tab === t.id ? "bg-primary/20 text-foreground spa-glow-ring" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={() => setPanelOpen((v) => !v)}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full spa-panel px-3 py-1.5 text-[11px] font-bold text-muted-foreground hover:text-foreground transition"
          >
            <Upload className="w-3 h-3" />
            {panelOpen ? "Fechar painel ADM" : "Painel ADM"}
          </button>
        )}
      </div>

      {isAdmin && panelOpen && (
        <div className="spa-panel rounded-2xl p-3.5 mb-3 space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            Enviar referência para “{TABS.find((t) => t.id === tab)?.label}”
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            <input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Nome do modelo"
              className="rounded-xl bg-background/60 border border-border px-3 py-2 text-xs outline-none focus:border-primary/50"
            />
            <input
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Descrição curta (opcional)"
              className="rounded-xl bg-background/60 border border-border px-3 py-2 text-xs outline-none focus:border-primary/50"
            />
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary/20 spa-glow-ring px-3.5 py-2 text-xs font-bold text-foreground disabled:opacity-50"
          >
            {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            Enviar imagem
          </button>
          <p className="text-[10px] text-muted-foreground">
            A imagem é guardada no original — sem recompressão. Visível para todos os usuários na galeria.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {items.map((s) => {
          const active = value.includes(s.id);
          const disabled = !active && value.length >= max;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => toggle(s.id)}
              aria-pressed={active}
              disabled={disabled}
              title={s.desc}
              className={`group relative overflow-hidden rounded-2xl text-left transition-all spa-panel ${
                active ? "spa-glow-ring" : "hover:border-primary/40 hover:-translate-y-0.5"
              } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              {s.image ? (
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <img
                    src={s.image}
                    alt={`Modelo ${s.label} — referência de estilo de empreendedorismo`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
                  <p className="absolute bottom-2 left-2.5 right-2.5 text-[10px] font-semibold text-foreground/85 leading-tight truncate">
                    {s.label}
                  </p>
                </div>
              ) : (
                <>
                  <div
                    className="h-16 w-full"
                    style={{
                      background: `linear-gradient(135deg, ${s.colors?.[0]}, ${s.colors?.[1]} 55%, ${s.colors?.[2]})`,
                    }}
                  />
                  <div className="p-2.5">
                    <p className="text-[11px] font-bold text-foreground leading-tight flex items-center gap-1">
                      <span>{s.icon}</span>
                      <span className="truncate">{s.label}</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 line-clamp-2">{s.desc}</p>
                  </div>
                </>
              )}
              {active && (
                <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </span>
              )}
              {isAdmin && s.dynamic && s.rowId && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(s.rowId!);
                  }}
                  onKeyDown={(e) => e.stopPropagation()}
                  className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-background/80 border border-border flex items-center justify-center text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-muted-foreground mt-2.5">
        {value.length === 0
          ? "Nenhum estilo escolhido — a IA define a direção de arte pelo seu nicho."
          : `${value.length}/${max} estilos no mix — usados como estética, composição, luz, paleta e atmosfera (nunca cópia de layout).`}
      </p>
    </div>
  );
}
