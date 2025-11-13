import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { HeroButton } from "@/components/ui/button-variants";

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
}

export const PricingCard = ({ title, price, period, features, isPopular }: PricingCardProps) => {
  return (
    <Card
      className={cn(
        "relative p-8 bg-card border-border transition-all duration-300 hover:scale-105 hover:shadow-glow-lime",
        isPopular && "border-2 border-lime shadow-glow-lime"
      )}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
          Popular
        </div>
      )}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2 text-foreground">{title}</h3>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-5xl font-bold text-primary">{price}</span>
          <span className="text-muted-foreground">/{period}</span>
        </div>
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>
      <HeroButton variant={isPopular ? "primary" : "secondary"} className="w-full">
        Começar
      </HeroButton>
    </Card>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
