import { WizardData } from "@/pages/Create";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Upload, Palette, ImageIcon, X } from "lucide-react";
import { useRef } from "react";

interface Props {
  data: WizardData;
  updateData: (d: Partial<WizardData>) => void;
}

const palettes = [
  { id: "purple", label: "Roxo", colors: ["#7C3AED", "#A78BFA", "#F5F3FF"] },
  { id: "white", label: "Branco", colors: ["#FFFFFF", "#F3F4F6", "#111827"] },
  { id: "blue", label: "Azul", colors: ["#1D4ED8", "#60A5FA", "#EFF6FF"] },
  { id: "warm", label: "Quente", colors: ["#DC2626", "#F59E0B", "#FEF3C7"] },
  { id: "nature", label: "Natural", colors: ["#047857", "#84CC16", "#F0FDF4"] },
  { id: "all", label: "Todas", colors: ["#EC4899", "#3B82F6", "#10B981"] },
];

export function StepStyleNew({ data, updateData }: Props) {
  const logoInput = useRef<HTMLInputElement>(null);

  const onLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateData({ logoDataUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-8 max-w-xl mx-auto w-full">
      {/* Paleta */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary" />
          Paleta de cores
        </Label>
        <div className="grid grid-cols-3 gap-3">
          {palettes.map((p) => {
            const active = data.palette === p.id;
            return (
              <button
                key={p.id}
                onClick={() =>
                  updateData({ palette: p.id, customPalette: p.colors })
                }
                className={`p-3 rounded-lg border-2 transition-all ${
                  active
                    ? "border-primary bg-accent"
                    : "border-border hover:border-primary/50 bg-card"
                }`}
              >
                <div className="flex gap-1 mb-2 justify-center">
                  {p.colors.map((c, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border border-border"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <p className="text-xs font-medium text-center">{p.label}</p>
              </button>
            );
          })}
        </div>

        {/* Color pickers manuais */}
        <div className="pt-2">
          <p className="text-xs text-muted-foreground mb-2">
            Ou personalize as cores:
          </p>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <Input
                key={i}
                type="color"
                value={data.customPalette[i] || "#7C3AED"}
                onChange={(e) => {
                  const np = [...data.customPalette];
                  np[i] = e.target.value;
                  updateData({ customPalette: np, palette: "custom" });
                }}
                className="h-10 w-full p-1 cursor-pointer"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Logo upload */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-primary" />
          Logo da empresa
        </Label>
        {data.logoDataUrl ? (
          <div className="relative inline-block">
            <img
              src={data.logoDataUrl}
              alt="Logo"
              className="h-20 w-20 object-contain rounded-lg border border-border bg-muted p-2"
            />
            <button
              onClick={() => updateData({ logoDataUrl: "" })}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => logoInput.current?.click()}
            className="w-full p-6 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-all flex flex-col items-center gap-2 text-muted-foreground"
          >
            <Upload className="w-6 h-6" />
            <span className="text-sm">Enviar logo (PNG transparente)</span>
          </button>
        )}
        <input
          ref={logoInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onLogoChange}
        />
      </div>

      {/* Respiro */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <Label>Respiro na borda</Label>
            <span className="text-sm font-medium text-primary">
              {data.borderPadding}%
            </span>
          </div>
          <Slider
            value={[data.borderPadding]}
            onValueChange={(v) => updateData({ borderPadding: v[0] })}
            min={0}
            max={20}
            step={1}
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <Label>Respiro na arte (entre elementos)</Label>
            <span className="text-sm font-medium text-primary">
              {data.elementPadding}%
            </span>
          </div>
          <Slider
            value={[data.elementPadding]}
            onValueChange={(v) => updateData({ elementPadding: v[0] })}
            min={0}
            max={20}
            step={1}
          />
        </div>
      </div>
    </div>
  );
}
