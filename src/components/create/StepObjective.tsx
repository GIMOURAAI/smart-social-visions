import type { WizardData } from "@/pages/Create";
import {
  Briefcase, Laugh, Heart, Target, Zap, Crown,
  Flame, BookOpen,
} from "lucide-react";

const TONES = [
  { id: "Profissional", Icon: Briefcase, desc: "Sério, técnico e confiável" },
  { id: "Criativo",     Icon: Laugh,     desc: "Leve, original e descontraído" },
  { id: "Emocional",   Icon: Heart,     desc: "Toca o coração e gera conexão" },
  { id: "Persuasivo",  Icon: Target,    desc: "Convence e gera ação imediata" },
  { id: "Direto",      Icon: Zap,       desc: "Curto, objetivo e sem enrolação" },
  { id: "Elegante",    Icon: Crown,     desc: "Sofisticado e premium" },
  { id: "Provocativo", Icon: Flame,     desc: "Desperta reação e curiosidade" },
  { id: "Educativo",   Icon: BookOpen,  desc: "Ensina e agrega valor ao público" },
];

const LINGUAGENS = [
  { id: "formal",       label: "Formal",         desc: "Linguagem técnica e séria" },
  { id: "descontraido", label: "Descontraído",    desc: "Leve, próximo e divertido" },
  { id: "inspirador",   label: "Inspirador",      desc: "Motiva e gera emoção" },
  { id: "direto",       label: "Direto ao ponto", desc: "Curto, objetivo e claro" },
];

interface Props {
  data: WizardData;
  onChange: (d: Partial<WizardData>) => void;
}

export function StepObjective({ data, onChange }: Props) {
  return (
    <div className="space-y-7">

      {/* Tom de voz — cards quadrados */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-1">Tom de voz</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Como você quer se comunicar com o seu público
        </p>
        <div className="grid grid-cols-2 gap-3">
          {TONES.map(({ id, Icon, desc }) => {
            const isSelected = data.tone === id;
            return (
              <button
                key={id}
                onClick={() => onChange({ tone: id })}
                className={`flex flex-col gap-3 rounded-2xl border-2 p-4 text-left transition-all hover:-translate-y-0.5 ${
                  isSelected ? "border-transparent shadow-glow" : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
                }`}
                style={isSelected ? { background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)" } : {}}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? "bg-white/20" : "bg-muted"}`}>
                  <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <p className={`text-base font-bold mb-0.5 ${isSelected ? "text-white" : "text-foreground"}`}>{id}</p>
                  <p className={`text-xs leading-snug ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>{desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Estilo de linguagem */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-1">Estilo de linguagem</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Como o texto deve soar para quem lê
        </p>
        <div className="grid grid-cols-2 gap-3">
          {LINGUAGENS.map(({ id, label, desc }) => {
            const isSelected = (data as any).linguagem === id;
            return (
              <button
                key={id}
                onClick={() => onChange({ ...(data as any), linguagem: id } as any)}
                className={`flex flex-col gap-3 rounded-2xl border-2 p-4 text-left transition-all hover:-translate-y-0.5 ${
                  isSelected ? "border-transparent shadow-glow" : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
                }`}
                style={isSelected ? { background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)" } : {}}
              >
                <div>
                  <p className={`text-base font-bold mb-0.5 ${isSelected ? "text-white" : "text-foreground"}`}>{label}</p>
                  <p className={`text-xs leading-snug ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>{desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
