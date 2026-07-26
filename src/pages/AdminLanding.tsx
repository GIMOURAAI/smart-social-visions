import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLandingContent } from "@/hooks/useLandingContent";
import type { LandingContent } from "@/content/landing";
import { ArrowLeft, Image as ImageIcon, Loader2, Plus, RotateCcw, Save, Trash2 } from "lucide-react";

async function fileToCompressedDataUrl(file: File, maxSize = 1400): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = dataUrl;
  });
  const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.82);
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-violet-400/60";

function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs uppercase tracking-widest text-white/40">{label}</span>
      {textarea ? (
        <textarea className={`${inputClass} min-h-[96px]`} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function AdminLanding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { content, loading, save, reset, remoteAvailable } = useLandingContent();
  const [draft, setDraft] = useState<LandingContent | null>(null);
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: session } = await supabase.auth.getSession();
      const user = session.session?.user;
      if (!user) {
        navigate("/auth");
        return;
      }
      const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      setAllowed(Boolean(data));
      setChecking(false);
    })();
  }, [navigate]);

  useEffect(() => {
    if (!loading) setDraft(content);
  }, [loading, content]);

  const value = draft;
  const patch = useMemo(
    () => (updater: (current: LandingContent) => LandingContent) => setDraft((prev) => (prev ? updater(structuredClone(prev)) : prev)),
    [],
  );

  if (checking || !value) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#060708] text-white">
        <Loader2 className="h-6 w-6 animate-spin" />
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#060708] px-6 text-center text-white">
        <h1 className="text-2xl font-semibold">Acesso restrito</h1>
        <p className="text-white/60">Somente administradores podem editar a landing page.</p>
        <button onClick={() => navigate("/")} className="rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold">
          Voltar ao site
        </button>
      </main>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    const result = await save(value);
    setSaving(false);
    toast({
      title: result.published ? "Landing page publicada" : "Alterações salvas neste navegador",
      description: result.published
        ? "As alterações já estão visíveis para todos os visitantes."
        : "Ainda não consigo publicar para todos: falta liberar a tabela no banco. Peça para ativar a ferramenta de migração.",
    });
  };

  return (
    <main className="min-h-screen bg-[#060708] px-4 py-8 text-white md:px-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-white/60">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </button>
          <div className="flex items-center gap-2">
            <button onClick={reset} className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm">
              <RotateCcw className="h-4 w-4" /> Restaurar padrão
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-purple-500 px-5 py-2 text-sm font-semibold disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Salvar
            </button>
          </div>
        </header>

        <div>
          <h1 className="text-3xl font-semibold">Editar landing page</h1>
          <p className="text-sm text-white/50">
            Textos, imagens e preços da página inicial. {remoteAvailable ? "Publicando para todos os visitantes." : "Salvando como rascunho local."}
          </p>
        </div>

        <Card title="Topo (Hero)">
          <Field label="Nome da marca" value={value.hero.wordmark} onChange={(v) => patch((c) => ((c.hero.wordmark = v), c))} />
          <Field label="Selo acima da marca" value={value.hero.poweredBy} onChange={(v) => patch((c) => ((c.hero.poweredBy = v), c))} />
          <Field label="Texto lateral (uma frase por linha)" textarea value={value.hero.sideCopy} onChange={(v) => patch((c) => ((c.hero.sideCopy = v), c))} />
          <Field label="Botão principal" value={value.hero.ctaLabel} onChange={(v) => patch((c) => ((c.hero.ctaLabel = v), c))} />
          <Field label="Frase abaixo do botão" value={value.hero.ctaNote} onChange={(v) => patch((c) => ((c.hero.ctaNote = v), c))} />
        </Card>

        <Card title="Segmentos">
          <Field label="Título" value={value.segments.title} onChange={(v) => patch((c) => ((c.segments.title = v), c))} />
          <Field label="Link do topo" value={value.segments.linkLabel} onChange={(v) => patch((c) => ((c.segments.linkLabel = v), c))} />
          <Field label="Descrição dos cards" value={value.segments.cardSubtitle} onChange={(v) => patch((c) => ((c.segments.cardSubtitle = v), c))} />
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-white/40">Nichos</span>
            {value.segments.niches.map((niche, index) => (
              <div key={index} className="flex gap-2">
                <input className={inputClass} value={niche} onChange={(e) => patch((c) => ((c.segments.niches[index] = e.target.value), c))} />
                <button
                  onClick={() => patch((c) => ((c.segments.niches = c.segments.niches.filter((_, i) => i !== index)), c))}
                  className="rounded-xl border border-white/10 px-3"
                  aria-label="Remover nicho"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => patch((c) => ((c.segments.niches = [...c.segments.niches, "Novo nicho"]), c))}
              className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm"
            >
              <Plus className="h-4 w-4" /> Adicionar nicho
            </button>
          </div>
        </Card>

        <Card title="Projetos e Explore">
          <Field label="Título projetos" value={value.projects.title} onChange={(v) => patch((c) => ((c.projects.title = v), c))} />
          <Field label="Card novo projeto" value={value.projects.ctaTitle} onChange={(v) => patch((c) => ((c.projects.ctaTitle = v), c))} />
          <Field label="Subtítulo novo projeto" value={value.projects.ctaSubtitle} onChange={(v) => patch((c) => ((c.projects.ctaSubtitle = v), c))} />
          <Field label="Título explore" value={value.explore.title} onChange={(v) => patch((c) => ((c.explore.title = v), c))} />
          <Field label="Frase de destaque" textarea value={value.statement.text} onChange={(v) => patch((c) => ((c.statement.text = v), c))} />
        </Card>

        <Card title="Imagens da galeria">
          <p className="text-sm text-white/50">Essas imagens aparecem no mosaico do topo, nos cards de segmento e na seção Explore.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {value.gallery.map((item, index) => (
              <div key={index} className="space-y-2 rounded-2xl border border-white/10 p-3">
                <img src={item.image} alt={item.caption} className="h-32 w-full rounded-xl object-cover" />
                <input className={inputClass} value={item.label} onChange={(e) => patch((c) => ((c.gallery[index].label = e.target.value), c))} />
                <input className={inputClass} value={item.caption} onChange={(e) => patch((c) => ((c.gallery[index].caption = e.target.value), c))} />
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 py-2 text-sm text-white/60">
                  <ImageIcon className="h-4 w-4" /> Trocar imagem
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = await fileToCompressedDataUrl(file);
                      patch((c) => ((c.gallery[index].image = url), c));
                    }}
                  />
                </label>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Planos e preços">
          <Field label="Selo" value={value.pricing.eyebrow} onChange={(v) => patch((c) => ((c.pricing.eyebrow = v), c))} />
          <Field label="Título" value={value.pricing.title} onChange={(v) => patch((c) => ((c.pricing.title = v), c))} />
          <Field label="Subtítulo" textarea value={value.pricing.subtitle} onChange={(v) => patch((c) => ((c.pricing.subtitle = v), c))} />
          {value.pricing.plans.map((plan, index) => (
            <div key={index} className="space-y-3 rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between">
                <strong>Plano {index + 1}</strong>
                <label className="flex items-center gap-2 text-xs text-white/60">
                  <input
                    type="checkbox"
                    checked={Boolean(plan.popular)}
                    onChange={(e) => patch((c) => ((c.pricing.plans[index].popular = e.target.checked), c))}
                  />
                  Mais escolhido
                </label>
              </div>
              <Field label="Nome" value={plan.name} onChange={(v) => patch((c) => ((c.pricing.plans[index].name = v), c))} />
              <Field label="Preço (R$)" value={plan.price} onChange={(v) => patch((c) => ((c.pricing.plans[index].price = v), c))} />
              <Field label="Créditos" value={plan.credits} onChange={(v) => patch((c) => ((c.pricing.plans[index].credits = v), c))} />
              <Field label="Descrição" value={plan.description} onChange={(v) => patch((c) => ((c.pricing.plans[index].description = v), c))} />
              <Field
                label="Benefícios (um por linha)"
                textarea
                value={plan.features.join("\n")}
                onChange={(v) => patch((c) => ((c.pricing.plans[index].features = v.split("\n").filter(Boolean)), c))}
              />
            </div>
          ))}
        </Card>

        <Card title="Rodapé">
          <Field label="Marca" value={value.footer.brand} onChange={(v) => patch((c) => ((c.footer.brand = v), c))} />
          <Field label="Frase" value={value.footer.tagline} onChange={(v) => patch((c) => ((c.footer.tagline = v), c))} />
          <Field label="Botão" value={value.footer.ctaLabel} onChange={(v) => patch((c) => ((c.footer.ctaLabel = v), c))} />
        </Card>
      </div>
    </main>
  );
}
