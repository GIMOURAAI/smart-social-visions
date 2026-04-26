import { WizardData } from "@/pages/Create";
import { ShoppingBag, Award, Flame, MessageCircle } from "lucide-react";

interface Props {
  data: WizardData;
  updateData: (d: Partial<WizardData>) => void;
}

const intents = [
  {
    id: "venda",
    icon: ShoppingBag,
    title: "Venda",
    desc: "Conversão direta com chamada para ação",
  },
  {
    id: "autoridade",
    icon: Award,
    title: "Autoridade",
    desc: "Posicionamento e expertise no nicho",
  },
  {
    id: "viral",
    icon: Flame,
    title: "Viral",
    desc: "Gancho forte para compartilhamentos",
  },
  {
    id: "engajamento",
    icon: MessageCircle,
    title: "Engajamento",
    desc: "Comentários e salvamentos",
  },
] as const;

export function StepIntent({ data, updateData }: Props) {
  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto w-full">
      <p className="text-muted-foreground text-center">
        Qual a intenção do post? A IA vai desenvolver a ideia para você.
      </p>
      <div className="grid grid-cols-2 gap-4">
        {intents.map((it) => {
          const Icon = it.icon;
          const active = data.intent === it.id;
          return (
            <button
              key={it.id}
              onClick={() => updateData({ intent: it.id as any })}
              className={`group relative p-6 rounded-3xl transition-all duration-300 flex flex-col items-center gap-3 text-center overflow-hidden ${
                active
                  ? "bg-gradient-card text-white shadow-glow scale-[1.02]"
                  : "bg-white border border-border hover:border-primary/40 hover:shadow-soft hover:-translate-y-0.5"
              }`}
            >
              {active && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              )}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  active
                    ? "bg-white/20 backdrop-blur-sm"
                    : "bg-accent group-hover:bg-primary/10"
                }`}
              >
                <Icon
                  className={`w-7 h-7 ${active ? "text-white" : "text-primary"}`}
                />
              </div>
              <div className="relative">
                <p
                  className={`font-bold text-base ${active ? "text-white" : "text-foreground"}`}
                >
                  {it.title}
                </p>
                <p
                  className={`text-xs mt-1 ${active ? "text-white/80" : "text-muted-foreground"}`}
                >
                  {it.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
