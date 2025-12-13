import { WizardData } from "@/pages/Create";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

interface StepCloneProps {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
}

export function StepClone({ data, updateData }: StepCloneProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateData({ cloneImage: file });
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    updateData({ cloneImage: null });
    setPreview(null);
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      <p className="text-muted-foreground text-center">
        Envie uma imagem de modelo para a IA analisar e replicar o estilo visual
      </p>
      
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Modelo para clonar"
            className="w-full max-h-80 object-contain rounded-xl border border-border"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-4 p-12 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-card">
          <div className="p-4 bg-primary/10 rounded-full">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center">
            <p className="font-medium text-foreground">Clique para enviar</p>
            <p className="text-sm text-muted-foreground">PNG, JPG até 10MB</p>
          </div>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      )}
      
      <div className="bg-muted/50 p-4 rounded-xl">
        <div className="flex items-start gap-3">
          <ImageIcon className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium text-foreground text-sm">Dica</p>
            <p className="text-xs text-muted-foreground">
              Escolha uma imagem com cores, tipografia e layout que você gostaria de replicar. 
              A IA vai analisar e criar posts similares.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
