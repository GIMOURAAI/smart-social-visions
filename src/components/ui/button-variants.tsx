import { Button } from "@/components/ui/button";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface HeroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

export const HeroButton = forwardRef<HTMLButtonElement, HeroButtonProps>(
  ({ children, variant = "primary", className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 shadow-glow-lime hover:scale-105",
          variant === "primary" && "bg-primary text-primary-foreground hover:shadow-glow-blue",
          variant === "secondary" && "bg-secondary text-secondary-foreground hover:shadow-glow-lime border border-lime",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

HeroButton.displayName = "HeroButton";
