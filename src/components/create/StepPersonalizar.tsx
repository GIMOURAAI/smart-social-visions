import { useRef, useState } from "react";
import { X, User, Image as ImageIcon, Palette, Check, Upload, Type } from "lucide-react";
import type { WizardData } from "@/pages/Create";

interface Props {
  data: WizardData;
  onChange: (d: Partial<WizardData>) => void;
}

type InputMode = "image" | "text";

function ToggleOption({
  enabled,
  onToggle,
  label,
  description,
}: {
  enabled: boolean;
  onToggle: (v: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-1">
        <p className="text-sm font-bold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onToggle(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors shrink-0 mt-0.5 ${
          enabled ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
            enabled ? "left-7" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function ModeTab({
  mode,
  current,
  onSelect,
}: {
  mode: InputMode;
  current: InputMode;
  onSelect: (m: InputMode) => void;
}) {
  const active = mode === current;
  return (
    <button
      onClick={() => onSelect(mode)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
        active
          ? "bg-primary text-white shadow"
          : "bg-muted text-muted-foreground hover:text-foreground"
      }`}
    >
      {mode === "image" ? <Upload className="w-3 h-3" /> : <Type className="w-3 h-3" />}
      {mode === "image" ? "Enviar imagem" : "Descrever em texto"}
    </button>
  );
}

function ImageUploadArea({
  fileRef,
  onFile,
  icon,
  label,
  hint,
  accent,
}: {
  fileRef: React.RefObject<HTMLInputElement>;
  onFile: (files: FileList | null) => void;
  icon: React.ReactNode;
  label: string;
  hint: string;
  accent: string;
}) {
  return (
    <div
      onClick={() => fileRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files); }}
      className={`rounded-2xl border-2 border-dashed transition-all cursor-pointer p-5 text-center ${accent}`}
    >
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files)} />
      <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center mx-auto mb-2">
        {icon}
      </div>
      <p className="text-sm font-semibold text-foreground mb-0.5">{label}</p>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function ImagePreview({
  src,
  label,
  sublabel,
  onRemove,
  accentBorder,
  accentBg,
  labelColor,
  contain,
}: {
  src: string;
  label: string;
  sublabel: string;
  onRemove: () => void;
  accentBorder: string;
  accentBg: string;
  labelColor: string;
  contain?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 rounded-2xl border p-3 ${accentBorder} ${accentBg}`}>
      <div className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 ${accentBorder} bg-muted`}>
        <img src={src} alt={label} className={`w-full h-full ${contain ? "object-contain p-1" : "object-cover"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <Check className={`w-3.5 h-3.5 ${labelColor}`} />
          <p className={`text-sm font-bold ${labelColor}`}>{label}</p>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{sublabel}</p>
      </div>
      <button
        onClick={onRemove}
        className="w-7 h-7 rounded-full bg-white/60 flex items-center justify-center hover:bg-destructive/10 hover:text-destructive transition shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function StepPersonalizar({ data, onChange }: Props) {
  const logoRef = useRef<HTMLInputElement>(null);
  const modelRef = useRef<HTMLInputElement>(null);
  const styleRef = useRef<HTMLInputElement>(null);

  const [useLogo, setUseLogo] = useState(!!data.brandLogo || !!data.brandLogoDescription);
  const [useModel, setUseModel] = useState(!!data.modelPhoto || !!data.modelDescription);
  const [useStyle, setUseStyle] = useState(!!data.styleReferenceImage || !!data.styleDescriptionText);

  const [logoMode, setLogoMode] = useState<InputMode>(data.brandLogoDescription ? "text" : "image");
  const [modelMode, setModelMode] = useState<InputMode>(data.modelDescription ? "text" : "image");
  const [styleMode, setStyleMode] = useState<InputMode>(data.styleDescriptionText ? "text" : "image");

  const handleFile = (field: keyof typeof data, files: FileList | null) => {
    if (!files?.[0]) return;
    const reader = new FileReader();
    reader.onload = (e) => onChange({ [field]: e.target?.result as string } as any);
    reader.readAsDataURL(files[0]);
  };

  const toggleLogo = (v: boolean) => {
    setUseLogo(v);
    if (!v) onChange({ brandLogo: undefined, brandLogoDescription: undefined });
  };
  const toggleModel = (v: boolean) => {
    setUseModel(v);
    if (!v) onChange({ modelPhoto: undefined, modelDescription: undefined });
  };
  const toggleStyle = (v: boolean) => {
    setUseStyle(v);
    if (!v) onChange({ styleReferenceImage: undefined, styleAnalysis: undefined, styleDescriptionText: undefined });
  };

  return (
    <div className="space-y-5">
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

      <div className="space-y-3">

        {/* === LOGO === */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <ToggleOption
            enabled={useLogo}
            onToggle={toggleLogo}
            label="Usar logo da marca?"
            description="A logo será inserida nas artes geradas"
          />
          {useLogo && (
            <>
              <div className="flex gap-2">
                <ModeTab mode="image" current={logoMode} onSelect={setLogoMode} />
                <ModeTab mode="text" current={logoMode} onSelect={setLogoMode} />
              </div>
              {logoMode === "image" ? (
                data.brandLogo ? (
                  <ImagePreview
                    src={data.brandLogo}
                    label="Logo carregada"
                    sublabel="Será inserida nas artes em posição de destaque"
                    onRemove={() => onChange({ brandLogo: undefined })}
                    accentBorder="border-primary/30"
                    accentBg="bg-primary/5"
                    labelColor="text-primary"
                    contain
                  />
                ) : (
                  <ImageUploadArea
                    fileRef={logoRef}
                    onFile={(f) => handleFile("brandLogo", f)}
                    icon={<ImageIcon className="w-4 h-4 text-muted-foreground" />}
                    label="Enviar logo"
                    hint="PNG com fundo transparente recomendado"
                    accent="border-border hover:border-primary/50 hover:bg-primary/5"
                  />
                )
              ) : (
                <div>
                  <textarea
                    value={data.brandLogoDescription ?? ""}
                    onChange={(e) => onChange({ brandLogoDescription: e.target.value })}
                    placeholder="Ex: Logo circular com as letras DS em dourado sobre fundo preto, tipografia elegante serif"
                    rows={3}
                    className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Descreva o estilo, cores e símbolo da logo para a IA replicar</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* === MODELO / PERSONAGEM === */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <ToggleOption
            enabled={useModel}
            onToggle={toggleModel}
            label="Usar foto de modelo ou personagem?"
            description="Médica, corretora, advogada, influenciadora... traços exatos mantidos nas imagens"
          />
          {useModel && (
            <>
              <div className="flex gap-2">
                <ModeTab mode="image" current={modelMode} onSelect={setModelMode} />
                <ModeTab mode="text" current={modelMode} onSelect={setModelMode} />
              </div>
              {modelMode === "image" ? (
                data.modelPhoto ? (
                  <ImagePreview
                    src={data.modelPhoto}
                    label="Modelo de referência pronta"
                    sublabel="Os traços serão mantidos exatamente nas imagens geradas"
                    onRemove={() => onChange({ modelPhoto: undefined })}
                    accentBorder="border-violet-300 dark:border-violet-700"
                    accentBg="bg-violet-50 dark:bg-violet-950/20"
                    labelColor="text-violet-700 dark:text-violet-400"
                  />
                ) : (
                  <ImageUploadArea
                    fileRef={modelRef}
                    onFile={(f) => handleFile("modelPhoto", f)}
                    icon={<User className="w-4 h-4 text-violet-500" />}
                    label="Enviar foto da profissional"
                    hint="JPG ou PNG · boa iluminação · rosto visível"
                    accent="border-border hover:border-violet-400/50 hover:bg-violet-50/50 dark:hover:bg-violet-950/20"
                  />
                )
              ) : (
                <div>
                  <textarea
                    value={data.modelDescription ?? ""}
                    onChange={(e) => onChange({ modelDescription: e.target.value })}
                    placeholder="Ex: Mulher negra, 35 anos, cabelo cacheado preto, olhos castanhos, expressão confiante, jaleco branco, joia dourada discreta"
                    rows={3}
                    className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-400/30 resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Descreva tom de pele, cabelo, olhos, faixa etária, roupa e expressão</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* === REFERÊNCIA DE ESTILO / PALETA === */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <ToggleOption
            enabled={useStyle}
            onToggle={toggleStyle}
            label="Usar referência de estilo ou paleta?"
            description="A IA extrai ou recebe paleta de cores, atmosfera e composição para aplicar nas artes"
          />
          {useStyle && (
            <>
              <div className="flex gap-2">
                <ModeTab mode="image" current={styleMode} onSelect={setStyleMode} />
                <ModeTab mode="text" current={styleMode} onSelect={setStyleMode} />
              </div>
              {styleMode === "image" ? (
                data.styleReferenceImage ? (
                  <ImagePreview
                    src={data.styleReferenceImage}
                    label="Referência de estilo carregada"
                    sublabel="Paleta, atmosfera e composição serão aplicadas nas artes"
                    onRemove={() => onChange({ styleReferenceImage: undefined, styleAnalysis: undefined })}
                    accentBorder="border-fuchsia-300 dark:border-fuchsia-700"
                    accentBg="bg-fuchsia-50 dark:bg-fuchsia-950/20"
                    labelColor="text-fuchsia-700 dark:text-fuchsia-400"
                  />
                ) : (
                  <ImageUploadArea
                    fileRef={styleRef}
                    onFile={(f) => handleFile("styleReferenceImage", f)}
                    icon={<Palette className="w-4 h-4 text-fuchsia-500" />}
                    label="Enviar imagem de referência"
                    hint="Post, foto ou arte com o estilo visual que quer replicar"
                    accent="border-border hover:border-fuchsia-400/50 hover:bg-fuchsia-50/50 dark:hover:bg-fuchsia-950/20"
                  />
                )
              ) : (
                <div>
                  <textarea
                    value={data.styleDescriptionText ?? ""}
                    onChange={(e) => onChange({ styleDescriptionText: e.target.value })}
                    placeholder="Ex: Fundo escuro quase preto, acentos em dourado e bordô, tipografia serif elegante, iluminação dramática cinematográfica, atmosfera premium de luxo"
                    rows={3}
                    className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-fuchsia-400/30 resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Descreva cores, iluminação, atmosfera e composição desejadas</p>
                </div>
              )}
            </>
          )}
        </div>

      </div>

      <div className="rounded-2xl bg-muted/60 p-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Dica:</strong> Para cada opção você pode enviar uma imagem de referência ou escrever a descrição — a IA usa o que você fornecer para personalizar todas as artes.
        </p>
      </div>
    </div>
  );
}
