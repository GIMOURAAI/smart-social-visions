import { useState } from "react";
import {
  Rocket, BookOpen, Tag, Palette, Users, Star,
  PenLine, Scissors, Shirt, UtensilsCrossed, ShoppingBag,
  Home, Briefcase, Smartphone, HeartPulse, GraduationCap,
  Sparkles, Wrench, User, UserCheck,
  ShoppingCart, Zap, Trophy, Megaphone, UserPlus, Heart, Package, HelpCircle, Flame,
} from "lucide-react";
import type { WizardData } from "@/pages/Create";

const LINHAS_EDITORIAIS = [
  {
    id: "lancamento",
    icon: Rocket,
    label: "Campanha de Lançamento",
    desc: "Produto, serviço ou evento novo. Gera curiosidade, antecipação e urgência.",
    theme: "Lançamento de novo produto/serviço. Quero gerar curiosidade, antecipação e urgência para atrair os primeiros clientes.",
  },
  {
    id: "autoridade",
    icon: BookOpen,
    label: "Autoridade & Educação",
    desc: "Mostre expertise. Dicas, bastidores e conteúdo que educa e posiciona.",
    theme: "Quero mostrar autoridade no meu nicho com conteúdo educativo, dicas práticas e bastidores do meu trabalho.",
  },
  {
    id: "promocao",
    icon: Tag,
    label: "Promoção & Oferta",
    desc: "Desconto, condição especial ou oferta por tempo limitado.",
    theme: "Tenho uma promoção ou oferta especial para divulgar. Quero gerar vendas com urgência e destacar o benefício.",
  },
  {
    id: "branding",
    icon: Palette,
    label: "Branding & Identidade",
    desc: "Constrói a marca: valores, história, diferenciais e propósito.",
    theme: "Quero fortalecer a identidade da marca, comunicar valores, história e o que me diferencia da concorrência.",
  },
  {
    id: "engajamento",
    icon: Users,
    label: "Engajamento & Comunidade",
    desc: "Interação com a audiência: perguntas, enquetes e posts relacionáveis.",
    theme: "Quero aumentar o engajamento com posts que gerem comentários, compartilhamentos e conexão com a audiência.",
  },
  {
    id: "prova",
    icon: Star,
    label: "Prova Social & Resultados",
    desc: "Depoimentos, antes/depois e casos de sucesso de clientes.",
    theme: "Quero mostrar resultados reais de clientes, depoimentos e transformações para gerar confiança e novas vendas.",
  },
  {
    id: "livre",
    icon: PenLine,
    label: "Escrever livremente",
    desc: "Descreva o tema com suas próprias palavras.",
    theme: "",
  },
];

const NICHES = [
  { id: "estetica",       label: "Estética",        Icon: Scissors },
  { id: "moda",           label: "Moda",             Icon: Shirt },
  { id: "restaurante",    label: "Restaurante",      Icon: UtensilsCrossed },
  { id: "loja-online",    label: "Loja Online",      Icon: ShoppingBag },
  { id: "imobiliaria",    label: "Imobiliária",      Icon: Home },
  { id: "consultoria",    label: "Consultoria",      Icon: Briefcase },
  { id: "infoproduto",    label: "Infoproduto",      Icon: Smartphone },
  { id: "saude",          label: "Saúde",            Icon: HeartPulse },
  { id: "educacao",       label: "Educação",         Icon: GraduationCap },
  { id: "beleza",         label: "Beleza",           Icon: Sparkles },
  { id: "servicos-locais",label: "Serviços Locais",  Icon: Wrench },
  { id: "outro",          label: "Outro",            Icon: Star },
];

interface Props {
  data: WizardData;
  onChange: (d: Partial<WizardData>) => void;
}

export function StepBriefing({ data, onChange }: Props) {
  const forClient = data.forClient ?? false;
  const [selectedLinha, setSelectedLinha] = useState<string | null>(null);
  const isLivre = selectedLinha === "livre";

  const handleLinha = (linha: typeof LINHAS_EDITORIAIS[0]) => {
    setSelectedLinha(linha.id);
    if (linha.id !== "livre") {
      onChange({ theme: linha.theme, objective: [linha.label] });
    } else {
      onChange({ theme: "", objective: ["Escrever livremente"] });
    }
  };

  return (
    <div className="space-y-7">

      {/* Para mim ou cliente */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-1">Criando para quem?</h3>
        <p className="text-sm text-muted-foreground mb-3">Personalize a experiência de geração</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: "myself", Icon: User,      label: "Para mim",       desc: "Meu próprio negócio" },
            { id: "client", Icon: UserCheck, label: "Para um cliente", desc: "Social media / agência" },
          ].map((opt) => {
            const isSelected = forClient ? opt.id === "client" : opt.id === "myself";
            return (
              <button
                key={opt.id}
                onClick={() => onChange({ forClient: opt.id === "client" })}
                className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all hover:-translate-y-0.5 ${
                  isSelected ? "border-primary bg-primary/5 shadow-glow" : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? "bg-primary" : "bg-muted"}`}>
                  <opt.Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <p className={`text-base font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>{opt.label}</p>
                  <p className="text-xs text-muted-foreground leading-snug">{opt.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nome da marca */}
      <div>
        <label className="block text-lg font-bold text-foreground mb-1">
          {forClient ? "Nome do negócio do cliente" : "Nome da sua marca"}
        </label>
        <p className="text-sm text-muted-foreground mb-2">
          {forClient ? "Aparece nas legendas e CTAs do cliente" : "Aparece nas legendas, CTAs e títulos gerados"}
        </p>
        <input
          type="text"
          value={data.brandName ?? ""}
          onChange={(e) => onChange({ brandName: e.target.value })}
          placeholder={forClient ? "Ex: Clínica Dr. João, Boutique Ana Lima..." : "Ex: Studio Bella, Clínica Saúde Plena..."}
          className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
        />
      </div>

      {/* Nicho — todos violeta sempre */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-1">Qual é o seu nicho?</h3>
        <p className="text-sm text-muted-foreground mb-3">Selecione a categoria do seu negócio</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {NICHES.map(({ id, label, Icon }) => {
            const isSelected = data.niche === id;
            return (
              <button
                key={id}
                onClick={() => onChange({ niche: id })}
                className={`flex flex-col items-center gap-2 rounded-2xl p-3 text-center bg-primary text-white transition-all hover:-translate-y-0.5 hover:bg-primary/90 ${
                  isSelected ? "ring-2 ring-white/70 shadow-glow scale-[1.02]" : ""
                }`}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/15">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold leading-tight text-white">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Linha editorial — multi-select, gradiente roxo igual botão Próximo */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-1">Qual é o objetivo do conteúdo?</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Escolha uma ou mais linhas editoriais
          {Array.isArray(data.objective) && data.objective.length > 0 && (
            <span className="ml-2 text-primary font-bold">· {data.objective.length} selecionado{data.objective.length > 1 ? "s" : ""}</span>
          )}
        </p>
        <div className="grid grid-cols-1 gap-2">
          {LINHAS_EDITORIAIS.map((linha) => {
            const selected: string[] = Array.isArray(data.objective) ? data.objective : [];
            const isSelected = selected.includes(linha.label);
            const handleClick = () => {
              if (linha.id === "livre") {
                setSelectedLinha(isSelected ? null : "livre");
                onChange({
                  objective: isSelected
                    ? selected.filter(o => o !== linha.label)
                    : [...selected, linha.label],
                  theme: isSelected ? "" : data.theme,
                });
                return;
              }
              if (isSelected) {
                const next = selected.filter(o => o !== linha.label);
                onChange({ objective: next, theme: next.length ? data.theme : "" });
              } else {
                const next = [...selected, linha.label];
                const themes = LINHAS_EDITORIAIS
                  .filter(l => l.id !== "livre" && next.includes(l.label))
                  .map(l => l.theme);
                onChange({ objective: next, theme: themes.join(" ") });
              }
            };
            return (
              <button
                key={linha.id}
                onClick={handleClick}
                className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all hover:-translate-y-0.5 ${
                  isSelected ? "border-transparent bg-gradient-primary shadow-glow" : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? "bg-white/20" : "bg-muted"}`}>
                  <linha.icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-base font-bold mb-0.5 ${isSelected ? "text-white" : "text-foreground"}`}>{linha.label}</p>
                  <p className={`text-xs leading-snug ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>{linha.desc}</p>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Campo livre — aparece quando "Escrever livremente" está selecionado */}
        {Array.isArray(data.objective) && data.objective.includes("Escrever livremente") && (
          <div className="mt-3">
            <textarea
              value={data.theme}
              onChange={(e) => onChange({ theme: e.target.value })}
              placeholder="Ex: Promoção de fim de semana com 30% de desconto em todos os serviços. Quero atrair clientes novos e mostrar resultados reais."
              rows={4}
              autoFocus
              className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            />
            <p className="text-[10px] text-muted-foreground mt-1 text-right">{data.theme.length} caracteres</p>
          </div>
        )}
      </div>


    </div>
  );
}
