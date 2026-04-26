import { WizardData } from "@/pages/Create";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CalendarDays, Layers } from "lucide-react";

interface Props {
  data: WizardData;
  updateData: (d: Partial<WizardData>) => void;
}

export function StepFrequency({ data, updateData }: Props) {
  const perDay = (data.quantity / Math.max(data.days, 1)).toFixed(1);
  return (
    <div className="flex flex-col gap-8 max-w-xl mx-auto w-full">
      <p className="text-muted-foreground text-center">
        Quantos posts e para quantos dias?
      </p>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            Quantidade de posts
          </Label>
          <span className="text-2xl font-bold text-primary">
            {data.quantity}
          </span>
        </div>
        <Slider
          value={[data.quantity]}
          onValueChange={(v) => updateData({ quantity: v[0] })}
          min={1}
          max={30}
          step={1}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1</span>
          <span>30</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" />
            Para quantos dias
          </Label>
          <span className="text-2xl font-bold text-primary">{data.days}</span>
        </div>
        <Slider
          value={[data.days]}
          onValueChange={(v) => updateData({ days: v[0] })}
          min={1}
          max={30}
          step={1}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1 dia</span>
          <span>30 dias</span>
        </div>
      </div>

      <div className="rounded-lg bg-accent border border-border p-4 text-center">
        <p className="text-sm text-muted-foreground">Frequência aproximada</p>
        <p className="text-lg font-semibold text-foreground">
          {perDay} post(s) por dia
        </p>
      </div>
    </div>
  );
}
