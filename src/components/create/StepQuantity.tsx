import { WizardData } from "@/pages/Create";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepQuantityProps {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
}

export function StepQuantity({ data, updateData }: StepQuantityProps) {
  const decrease = () => {
    if (data.quantity > 1) {
      updateData({ quantity: data.quantity - 1 });
    }
  };

  const increase = () => {
    if (data.quantity < 9) {
      updateData({ quantity: data.quantity + 1 });
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 max-w-md mx-auto">
      <p className="text-muted-foreground text-center">
        Escolha quantos posts deseja criar de uma vez (máximo 9)
      </p>
      
      <div className="flex items-center gap-6">
        <Button
          variant="outline"
          size="icon"
          onClick={decrease}
          disabled={data.quantity <= 1}
          className="h-14 w-14 rounded-full"
        >
          <Minus className="w-6 h-6" />
        </Button>
        
        <div className="text-6xl font-bold text-primary min-w-[100px] text-center">
          {data.quantity}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={increase}
          disabled={data.quantity >= 9}
          className="h-14 w-14 rounded-full"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {[1, 3, 6, 9].map((num) => (
          <Button
            key={num}
            variant={data.quantity === num ? "default" : "outline"}
            size="sm"
            onClick={() => updateData({ quantity: num })}
          >
            {num} post{num > 1 ? "s" : ""}
          </Button>
        ))}
      </div>
    </div>
  );
}
