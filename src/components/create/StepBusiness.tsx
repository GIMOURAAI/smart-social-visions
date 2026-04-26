import { WizardData } from "@/pages/Create";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { AtSign, Building2 } from "lucide-react";

interface Props {
  data: WizardData;
  updateData: (d: Partial<WizardData>) => void;
}

export function StepBusiness({ data, updateData }: Props) {
  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto w-full">
      <p className="text-muted-foreground text-center">
        Conte sobre a empresa e o que vende
      </p>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" />
          Sobre a empresa / o que vende
        </Label>
        <Textarea
          placeholder="Ex: Estúdio de design especializado em identidade visual para restaurantes. Vendo pacotes de branding completos."
          value={data.business}
          onChange={(e) => updateData({ business: e.target.value })}
          className="min-h-[140px] resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <AtSign className="w-4 h-4 text-primary" />@ da empresa
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            @
          </span>
          <Input
            placeholder="suamarca"
            value={data.handle.replace(/^@/, "")}
            onChange={(e) =>
              updateData({ handle: "@" + e.target.value.replace(/^@/, "") })
            }
            className="pl-7"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Aparece nas legendas e pode ser inserido nas artes
        </p>
      </div>
    </div>
  );
}
