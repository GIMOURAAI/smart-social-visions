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
              className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 text-center ${
                active
                  ? "border-primary bg-accent shadow-md"
                  : "border-border hover:border-primary/50 bg-card"
              }`}
            >
              <Icon
                className={`w-8 h-8 ${active ? "text-primary" : "text-muted-foreground"}`}
              />
              <div>
                <p
                  className={`font-semibold ${active ? "text-primary" : "text-foreground"}`}
                >
                  {it.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{it.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
