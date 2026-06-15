import { useRef, useState } from "react";
import { Upload, X, Loader2, Sparkles, CheckCircle2, User, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { WizardData } from "@/pages/Create";

interface Props {
  data: WizardData;
  onChange: (d: Partial<WizardData>) => void;
}

export function StepPersonalizar({ data, onChange }: Props) {
  const [analyzingModel, setAnalyzingModel] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const modelRef = useRef<HTMLInputElement>(null);

  const handleLogo = (files: FileList | null) => {
    if (!files?.[0]) return;
    const reader = new FileReader();
    reader.onload = (e) => onChange({ brandLogo: e.target?.result as string });
    reader.readAsDataURL(files[0]);
  };

  const handleModelPhoto = (files: FileList | null) => {
    if (!files?.[0]) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange({ modelPhoto: e.target?.result as string, modelDescription: undefined });
      setModelError(null);
    };
    reader.readAsDataURL(files[0]);
  };

  const analyzeModel = async () => {
    if (!data.modelPhoto) return;
    setAnalyzingModel(true);
    setModelError(null);
    try {
      const { data: result, error } = await supabase.functions.invoke("analyze-model", {
        body: { imageBase64: data.modelPhoto },
      });
      if (error) throw error;
      if (!result?.description) throw new Error("Análise não retornou dados.");
      onChange({ modelDescription: result.description });
    } catch (err: any) {
      setModelError(err?.message ?? "Erro ao analisar a foto.");
    } finally {
      setAnalyzingModel(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Brand name */}
      <div>
        <label className="text-sm font-bold text-foreground block mb-2">
          Nome da marca na arte
        </label>
        <input
          type="text"
          value={data.brandName}
          onChange={(e) => onChange({ brandName: e.target.value })}
          placeholder="Ex: Clínica Dr. Silva"
          className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Aparecerá nas legendas e CTAs de todos os posts
        </p>
      </div>

      {/* Logo upload */}
      <div>
        <label className="text-sm font-bold text-foreground block mb-2">
          Logo da empresa <span className="text-muted-foreground font-normal">(opcional)</span>
        </label>

        {!data.brandLogo ? (
          <div
            onClick={() => logoRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleLogo(e.dataTransfer.files); }}
            className="rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer p-6 text-center"
          >
            <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleLogo(e.target.files)} />
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mx-auto mb-2">
              <ImageIcon className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-0.5">Enviar logo</p>
            <p className="text-xs text-muted-foreground">PNG com fundo transparente recomendado</p>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
            <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center overflow-hidden shrink-0">
              <img src={data.brandLogo} alt="Logo" className="w-full h-full object-contain p-1" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Logo carregado</p>
              <p className="text-xs text-muted-foreground">Será referenciado no estilo das artes</p>
            </div>
            <button
              onClick={() => onChange({ brandLogo: undefined })}
              className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-destructive/10 hover:text-destructive transition shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Model/professional photo */}
      <div>
        <label className="text-sm font-bold text-foreground block mb-1">
          Foto da profissional / modelo <span className="text-muted-foreground font-normal">(opcional)</span>
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          Envie uma foto da médica, corretora, advogada, influenciadora, etc. A IA vai analisar a aparência e gerar imagens com uma pessoa similar.
        </p>

        {!data.modelPhoto ? (
          <div
            onClick={() => modelRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleModelPhoto(e.dataTransfer.files); }}
            className="rounded-2xl border-2 border-dashed border-border hover:border-violet-400/50 hover:bg-violet-50/50 dark:hover:bg-violet-950/20 transition-all cursor-pointer p-6 text-center"
          >
            <input ref={modelRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleModelPhoto(e.target.files)} />
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-2">
              <User className="w-5 h-5 text-violet-600" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-0.5">Enviar foto da profissional</p>
            <p className="text-xs text-muted-foreground">JPG ou PNG · foto com boa iluminação</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                <img src={data.modelPhoto} alt="Modelo" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                {data.modelDescription ? (
                  <>
                    <div className="flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                      <p className="text-sm font-semibold text-green-700">Aparência analisada</p>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {data.modelDescription}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-foreground mb-1">Foto carregada</p>
                    <button
                      onClick={analyzeModel}
                      disabled={analyzingModel}
                      className="flex items-center gap-1.5 text-xs font-bold text-white px-3 py-1.5 rounded-full transition-all disabled:opacity-70"
                      style={{ background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)" }}
                    >
                      {analyzingModel ? (
                        <><Loader2 className="w-3 h-3 animate-spin" /> Analisando...</>
                      ) : (
                        <><Sparkles className="w-3 h-3" /> Analisar aparência com IA</>
                      )}
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={() => onChange({ modelPhoto: undefined, modelDescription: undefined })}
                className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-destructive/10 hover:text-destructive transition shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modelError && (
              <p className="text-xs text-red-500">{modelError}</p>
            )}

            {data.modelDescription && (
              <button
                onClick={() => onChange({ modelDescription: undefined })}
                className="text-xs text-muted-foreground underline hover:text-foreground transition"
              >
                Reanalisar foto
              </button>
            )}
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-muted/60 p-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Dica:</strong> Quanto mais informações você fornecer, mais personalizada será a arte. A foto da profissional é usada como referência de aparência — não é copiada diretamente.
        </p>
      </div>
    </div>
  );
}
